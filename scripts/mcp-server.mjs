import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  McpServer,
  ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod/v4';

const ROOT_DIR = process.cwd();
const CONTRACT_INDEX_PATH = 'ai/contracts/index.json';
const ACTIVE_THEME_PATH = 'ai/theme.active.json';
const DOCS_COMPONENT_DIR = 'docs/components';

const CONTRACT_INDEX_ABSOLUTE = path.resolve(ROOT_DIR, CONTRACT_INDEX_PATH);
const ACTIVE_THEME_ABSOLUTE = path.resolve(ROOT_DIR, ACTIVE_THEME_PATH);

const toAbsolute = (relativePath) => path.resolve(ROOT_DIR, relativePath);

const readUtf8File = (absolutePath) => fs.readFileSync(absolutePath, 'utf8');

const readJsonFile = (absolutePath) => {
  const raw = readUtf8File(absolutePath);
  return JSON.parse(raw);
};

const safeReadJsonFile = (absolutePath) => {
  try {
    return readJsonFile(absolutePath);
  } catch {
    return null;
  }
};

const fileExists = (absolutePath) => fs.existsSync(absolutePath);

const toKebabCase = (value) =>
  value
    .replaceAll(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replaceAll(/[\s_]+/g, '-')
    .toLowerCase();

const normalizeComponentName = (name) => name.trim().toLowerCase();

const loadContractIndex = () => {
  if (!fileExists(CONTRACT_INDEX_ABSOLUTE)) {
    throw new Error(`Missing contract index at ${CONTRACT_INDEX_PATH}`);
  }

  const indexJson = readJsonFile(CONTRACT_INDEX_ABSOLUTE);

  return {
    components: Array.isArray(indexJson.components) ? indexJson.components : [],
    themes: Array.isArray(indexJson.themes) ? indexJson.themes : [],
    version: indexJson.version ?? null,
  };
};

const getActiveTheme = () => {
  if (!fileExists(ACTIVE_THEME_ABSOLUTE)) {
    return null;
  }

  return safeReadJsonFile(ACTIVE_THEME_ABSOLUTE);
};

const findComponent = (components, name) => {
  const normalized = normalizeComponentName(name);

  return (
    components.find(
      (component) => normalizeComponentName(component.name) === normalized,
    ) ?? null
  );
};

const findTheme = (themes, id) => {
  const normalized = id.trim().toLowerCase();

  return themes.find((theme) => theme.id.toLowerCase() === normalized) ?? null;
};

const loadComponentContract = (componentEntry) => {
  const absolutePath = toAbsolute(componentEntry.contractPath);

  if (!fileExists(absolutePath)) {
    throw new Error(
      `Component contract file missing: ${componentEntry.contractPath}`,
    );
  }

  return readJsonFile(absolutePath);
};

const loadThemeContract = (themeEntry) => {
  const absolutePath = toAbsolute(themeEntry.contractPath);

  if (!fileExists(absolutePath)) {
    throw new Error(`Theme contract file missing: ${themeEntry.contractPath}`);
  }

  return readJsonFile(absolutePath);
};

const loadComponentDoc = (componentName) => {
  const docFileName = `${toKebabCase(componentName)}.md`;
  const docRelativePath = path.posix.join(DOCS_COMPONENT_DIR, docFileName);
  const docAbsolutePath = toAbsolute(docRelativePath);

  if (!fileExists(docAbsolutePath)) {
    return {
      relativePath: docRelativePath,
      text: null,
      exists: false,
    };
  }

  return {
    relativePath: docRelativePath,
    text: readUtf8File(docAbsolutePath),
    exists: true,
  };
};

const runScriptAndCapture = (scriptRelativePath) => {
  const absoluteScriptPath = toAbsolute(scriptRelativePath);

  const result = spawnSync(process.execPath, [absoluteScriptPath], {
    cwd: ROOT_DIR,
    encoding: 'utf8',
  });

  return {
    success: result.status === 0,
    status: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
};

const jsonTextContent = (uri, payload) => ({
  contents: [
    {
      uri,
      mimeType: 'application/json',
      text: `${JSON.stringify(payload, null, 2)}\n`,
    },
  ],
});

const markdownTextContent = (uri, markdown) => ({
  contents: [
    {
      uri,
      mimeType: 'text/markdown',
      text: markdown,
    },
  ],
});

const toolTextResult = (payload) => ({
  content: [
    {
      type: 'text',
      text: `${JSON.stringify(payload, null, 2)}\n`,
    },
  ],
});

const createMcpServer = () => {
  const server = new McpServer(
    {
      name: 'mezmer-contract-server',
      version: '0.1.0',
    },
    {
      instructions:
        'Use this server as the source of truth for Mezmer contracts, themes, docs, and validation diagnostics.',
    },
  );

  server.registerResource(
    'contracts-index',
    'mezmer://contracts/index',
    {
      title: 'Mezmer Contracts Index',
      description:
        'Registry of all component and theme contracts declared in ai/contracts/index.json.',
      mimeType: 'application/json',
    },
    async () => {
      const index = loadContractIndex();

      return jsonTextContent('mezmer://contracts/index', {
        version: index.version,
        components: index.components,
        themes: index.themes,
      });
    },
  );

  server.registerResource(
    'active-theme',
    'mezmer://themes/active',
    {
      title: 'Mezmer Active Theme',
      description:
        'Current workspace active theme pointer from ai/theme.active.json.',
      mimeType: 'application/json',
    },
    async () => {
      const activeTheme = getActiveTheme();

      return jsonTextContent('mezmer://themes/active', {
        activeTheme,
      });
    },
  );

  server.registerResource(
    'component-contract',
    new ResourceTemplate('mezmer://contracts/components/{name}', {
      list: async () => {
        const { components } = loadContractIndex();

        return {
          resources: components.map((component) => ({
            uri: `mezmer://contracts/components/${component.name.toLowerCase()}`,
            name: component.name,
            description: `Contract for ${component.name}`,
            mimeType: 'application/json',
          })),
        };
      },
      complete: {
        name: async (value) => {
          const { components } = loadContractIndex();
          const lowerCaseValue = value.toLowerCase();

          return components
            .map((component) => component.name.toLowerCase())
            .filter((name) => name.startsWith(lowerCaseValue));
        },
      },
    }),
    {
      title: 'Mezmer Component Contract',
      description: 'Read component contracts by name.',
      mimeType: 'application/json',
    },
    async (_uri, variables) => {
      const { components } = loadContractIndex();
      const component = findComponent(components, variables.name);

      if (!component) {
        throw new Error(`Unknown component name: ${variables.name}`);
      }

      const contract = loadComponentContract(component);
      const resourceUri = `mezmer://contracts/components/${component.name.toLowerCase()}`;

      return jsonTextContent(resourceUri, {
        name: component.name,
        indexEntry: component,
        contract,
      });
    },
  );

  server.registerResource(
    'component-doc',
    new ResourceTemplate('mezmer://docs/components/{name}', {
      list: async () => {
        const { components } = loadContractIndex();

        return {
          resources: components.map((component) => ({
            uri: `mezmer://docs/components/${component.name.toLowerCase()}`,
            name: `${component.name} docs`,
            description: `Component documentation for ${component.name}`,
            mimeType: 'text/markdown',
          })),
        };
      },
      complete: {
        name: async (value) => {
          const { components } = loadContractIndex();
          const lowerCaseValue = value.toLowerCase();

          return components
            .map((component) => component.name.toLowerCase())
            .filter((name) => name.startsWith(lowerCaseValue));
        },
      },
    }),
    {
      title: 'Mezmer Component Docs',
      description: 'Read docs/components/<component>.md by component name.',
      mimeType: 'text/markdown',
    },
    async (_uri, variables) => {
      const { components } = loadContractIndex();
      const component = findComponent(components, variables.name);

      if (!component) {
        throw new Error(`Unknown component name: ${variables.name}`);
      }

      const doc = loadComponentDoc(component.name);

      if (!doc.exists || !doc.text) {
        throw new Error(`Missing component docs file: ${doc.relativePath}`);
      }

      const resourceUri = `mezmer://docs/components/${component.name.toLowerCase()}`;

      return markdownTextContent(resourceUri, doc.text);
    },
  );

  server.registerTool(
    'list_components',
    {
      title: 'List Components',
      description:
        'Lists all contract-indexed components with capabilities and source paths.',
    },
    async () => {
      const { components } = loadContractIndex();

      return toolTextResult({ components });
    },
  );

  server.registerTool(
    'get_component_contract',
    {
      title: 'Get Component Contract',
      description:
        'Returns one component contract plus index metadata and docs availability.',
      inputSchema: {
        name: z.string().min(1),
      },
    },
    async ({ name }) => {
      const { components } = loadContractIndex();
      const component = findComponent(components, name);

      if (!component) {
        return {
          content: [
            {
              type: 'text',
              text: `Unknown component name: ${name}`,
            },
          ],
          isError: true,
        };
      }

      const contract = loadComponentContract(component);
      const docs = loadComponentDoc(component.name);

      return toolTextResult({
        name: component.name,
        indexEntry: component,
        contract,
        docs: {
          path: docs.relativePath,
          exists: docs.exists,
        },
      });
    },
  );

  server.registerTool(
    'list_themes',
    {
      title: 'List Themes',
      description: 'Lists available themes and active theme selection.',
    },
    async () => {
      const { themes } = loadContractIndex();
      const activeTheme = getActiveTheme();

      return toolTextResult({
        activeTheme,
        themes,
      });
    },
  );

  server.registerTool(
    'get_theme_contract',
    {
      title: 'Get Theme Contract',
      description:
        'Returns the selected theme contract and active-theme context.',
      inputSchema: {
        id: z.string().optional(),
      },
    },
    async ({ id }) => {
      const { themes } = loadContractIndex();
      const activeTheme = getActiveTheme();

      const requestedThemeId =
        id && id.trim().length > 0 ? id.trim() : activeTheme?.themeId;

      if (!requestedThemeId) {
        return {
          content: [
            {
              type: 'text',
              text: 'No theme id was provided and ai/theme.active.json does not define a themeId.',
            },
          ],
          isError: true,
        };
      }

      const themeEntry = findTheme(themes, requestedThemeId);

      if (!themeEntry) {
        return {
          content: [
            {
              type: 'text',
              text: `Unknown theme id: ${requestedThemeId}`,
            },
          ],
          isError: true,
        };
      }

      const contract = loadThemeContract(themeEntry);

      return toolTextResult({
        activeTheme,
        selectedTheme: themeEntry,
        contract,
      });
    },
  );

  server.registerTool(
    'validate_contracts',
    {
      title: 'Validate Contracts',
      description:
        'Runs scripts/validate-contracts.mjs and returns stdout/stderr diagnostics.',
    },
    async () => {
      const result = runScriptAndCapture('scripts/validate-contracts.mjs');
      const payload = {
        command: 'node scripts/validate-contracts.mjs',
        success: result.success,
        status: result.status,
        stdout: result.stdout.trim(),
        stderr: result.stderr.trim(),
      };

      if (!result.success) {
        return {
          content: [
            {
              type: 'text',
              text: `${JSON.stringify(payload, null, 2)}\n`,
            },
          ],
          isError: true,
        };
      }

      return toolTextResult(payload);
    },
  );

  server.registerTool(
    'validate_component_docs',
    {
      title: 'Validate Component Docs',
      description:
        'Runs scripts/validate-component-docs.mjs and returns stdout/stderr diagnostics.',
    },
    async () => {
      const result = runScriptAndCapture('scripts/validate-component-docs.mjs');
      const payload = {
        command: 'node scripts/validate-component-docs.mjs',
        success: result.success,
        status: result.status,
        stdout: result.stdout.trim(),
        stderr: result.stderr.trim(),
      };

      if (!result.success) {
        return {
          content: [
            {
              type: 'text',
              text: `${JSON.stringify(payload, null, 2)}\n`,
            },
          ],
          isError: true,
        };
      }

      return toolTextResult(payload);
    },
  );

  server.registerTool(
    'validate_workspace_contract_surface',
    {
      title: 'Validate Workspace Contract Surface',
      description:
        'Runs both contract and docs validators and reports a combined status.',
    },
    async () => {
      const contractResult = runScriptAndCapture(
        'scripts/validate-contracts.mjs',
      );
      const docsResult = runScriptAndCapture(
        'scripts/validate-component-docs.mjs',
      );

      const payload = {
        success: contractResult.success && docsResult.success,
        validations: {
          contracts: {
            success: contractResult.success,
            status: contractResult.status,
            stdout: contractResult.stdout.trim(),
            stderr: contractResult.stderr.trim(),
          },
          componentDocs: {
            success: docsResult.success,
            status: docsResult.status,
            stdout: docsResult.stdout.trim(),
            stderr: docsResult.stderr.trim(),
          },
        },
      };

      if (!payload.success) {
        return {
          content: [
            {
              type: 'text',
              text: `${JSON.stringify(payload, null, 2)}\n`,
            },
          ],
          isError: true,
        };
      }

      return toolTextResult(payload);
    },
  );

  return server;
};

const showHelp = () => {
  process.stdout.write(
    `Mezmer MCP server\n\nUsage:\n  node scripts/mcp-server.mjs\n\nThis starts a stdio MCP server exposing read-only contracts, themes, docs, and validation tools.\n`,
  );
};

const main = async () => {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showHelp();
    return;
  }

  const server = createMcpServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);
};

try {
  await main();
} catch (error) {
  process.stderr.write(`Failed to start Mezmer MCP server: ${String(error)}\n`);
  process.exit(1);
}
