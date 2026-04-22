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
    presets: Array.isArray(indexJson.presets) ? indexJson.presets : [],
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

const findPreset = (presets, id) => {
  const normalized = id.trim().toLowerCase();

  return (
    presets.find((preset) => preset.id.toLowerCase() === normalized) ?? null
  );
};

const selectPresetForUseCase = (presets, useCase) => {
  const normalizedUseCase = useCase.toLowerCase();

  if (
    normalizedUseCase.includes('operations') ||
    normalizedUseCase.includes('ops') ||
    normalizedUseCase.includes('incident') ||
    normalizedUseCase.includes('queue')
  ) {
    const operationsPreset = findPreset(presets, 'operations-console');
    if (operationsPreset) {
      return operationsPreset;
    }
  }

  const enterprisePreset = findPreset(presets, 'enterprise-dashboard');
  if (enterprisePreset) {
    return enterprisePreset;
  }

  return presets[0] ?? null;
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

const loadPresetContract = (presetEntry) => {
  const absolutePath = toAbsolute(presetEntry.contractPath);

  if (!fileExists(absolutePath)) {
    throw new Error(
      `Preset contract file missing: ${presetEntry.contractPath}`,
    );
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

const runCommandInDirectory = (command, args, cwd) => {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
  });

  return {
    command: `${command} ${args.join(' ')}`,
    success: result.status === 0,
    status: result.status,
    stdout: (result.stdout ?? '').trim(),
    stderr: (result.stderr ?? '').trim(),
  };
};

const resolveProjectDir = (projectDir) =>
  path.isAbsolute(projectDir) ? projectDir : path.resolve(ROOT_DIR, projectDir);

const resolvePresetForValidation = (presetId) => {
  const { presets } = loadContractIndex();
  const preset = findPreset(presets, presetId);
  if (!preset) {
    return null;
  }

  const contract = loadPresetContract(preset);
  return {
    preset,
    contract,
    requiredChecks: Array.isArray(contract.requiredChecks)
      ? contract.requiredChecks
      : [],
  };
};

const runScaffoldValidationCheck = ({
  check,
  packageManager,
  absoluteProjectDir,
  skipInstall,
}) => {
  if (check === 'template-manifest') {
    const manifestPath = path.resolve(
      absoluteProjectDir,
      'rapidkit.template.json',
    );

    if (!fileExists(manifestPath)) {
      return {
        check,
        success: false,
        status: 1,
        command: 'validate template manifest',
        stdout: '',
        stderr: 'Missing rapidkit.template.json in scaffolded project.',
      };
    }

    try {
      readJsonFile(manifestPath);
      return {
        check,
        success: true,
        status: 0,
        command: 'validate template manifest',
        stdout: 'rapidkit.template.json is valid JSON.',
        stderr: '',
      };
    } catch (error) {
      return {
        check,
        success: false,
        status: 1,
        command: 'validate template manifest',
        stdout: '',
        stderr: `Invalid rapidkit.template.json: ${String(error)}`,
      };
    }
  }

  if (check === 'install') {
    if (skipInstall) {
      return {
        check,
        success: true,
        skipped: true,
        reason: 'skipInstall=true',
      };
    }

    const installResult = runCommandInDirectory(
      packageManager,
      ['install'],
      absoluteProjectDir,
    );
    return { check, ...installResult };
  }

  if (
    check === 'typecheck' ||
    check === 'lint' ||
    check === 'test' ||
    check === 'build'
  ) {
    const scriptResult = runCommandInDirectory(
      packageManager,
      ['run', check],
      absoluteProjectDir,
    );
    return { check, ...scriptResult };
  }

  return {
    check,
    success: false,
    skipped: true,
    reason: `Unsupported check in preset requiredChecks: ${check}`,
  };
};

const runScaffoldValidationChecks = ({
  requiredChecks,
  packageManager,
  absoluteProjectDir,
  skipInstall,
}) => {
  const results = [];

  for (const check of requiredChecks) {
    const result = runScaffoldValidationCheck({
      check,
      packageManager,
      absoluteProjectDir,
      skipInstall,
    });
    results.push(result);

    if (!result.success) {
      break;
    }
  }

  return results;
};

const parseNodeVersion = (nodeVersion) => {
  const normalized = nodeVersion.startsWith('v')
    ? nodeVersion.slice(1)
    : nodeVersion;
  const [majorRaw, minorRaw, patchRaw] = normalized.split('.');

  return {
    major: Number(majorRaw),
    minor: Number(minorRaw),
    patch: Number(patchRaw),
  };
};

const compareVersions = (left, right) => {
  if (left.major !== right.major) {
    return left.major - right.major;
  }

  if (left.minor !== right.minor) {
    return left.minor - right.minor;
  }

  return left.patch - right.patch;
};

const isNodeVersionSupportedForScaffold = (nodeVersion) => {
  const current = parseNodeVersion(nodeVersion);
  const minimum20 = { major: 20, minor: 19, patch: 0 };
  const minimum22 = { major: 22, minor: 12, patch: 0 };

  const is20LineSupported =
    current.major === 20 && compareVersions(current, minimum20) >= 0;
  const is22PlusSupported =
    current.major > 22 ||
    (current.major === 22 && compareVersions(current, minimum22) >= 0);

  return is20LineSupported || is22PlusSupported;
};

const getNodeCompatibilityPreflight = (nodeVersion) => {
  const supported = isNodeVersionSupportedForScaffold(nodeVersion);

  return {
    runtimeNodeVersion: nodeVersion,
    supported,
    requiredRange: '^20.19.0 || >=22.12.0',
    message: supported
      ? 'Node runtime satisfies scaffold validation requirements.'
      : 'Node runtime is below required range for Vite 7 templates. Use Node 20.19+ or 22.12+.',
  };
};

const recommendExecutionPath = ({
  preflight,
  operation,
  strictMode,
  allowIncompatibleNode,
}) => {
  if (preflight.supported) {
    return {
      recommendation: 'proceed',
      reason: `Runtime satisfies requirements for ${operation}.`,
    };
  }

  if (strictMode && !allowIncompatibleNode) {
    return {
      recommendation: 'block-until-runtime-upgrade',
      reason:
        'Strict mode is enabled and runtime is incompatible. Upgrade Node before continuing.',
    };
  }

  return {
    recommendation: 'proceed-with-warning',
    reason:
      'Runtime is incompatible, but operation can continue in non-strict mode with higher risk of downstream failures.',
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
      name: 'rapidkit-contract-server',
      version: '0.1.0',
    },
    {
      instructions:
        'Use this server as the source of truth for RapidKit contracts, themes, docs, and validation diagnostics.',
    },
  );

  server.registerResource(
    'contracts-index',
    'rapidkit://contracts/index',
    {
      title: 'RapidKit Contracts Index',
      description:
        'Registry of all component and theme contracts declared in ai/contracts/index.json.',
      mimeType: 'application/json',
    },
    async () => {
      const index = loadContractIndex();

      return jsonTextContent('rapidkit://contracts/index', {
        version: index.version,
        components: index.components,
        themes: index.themes,
        presets: index.presets,
      });
    },
  );

  server.registerResource(
    'active-theme',
    'rapidkit://themes/active',
    {
      title: 'RapidKit Active Theme',
      description:
        'Current workspace active theme pointer from ai/theme.active.json.',
      mimeType: 'application/json',
    },
    async () => {
      const activeTheme = getActiveTheme();

      return jsonTextContent('rapidkit://themes/active', {
        activeTheme,
      });
    },
  );

  server.registerResource(
    'component-contract',
    new ResourceTemplate('rapidkit://contracts/components/{name}', {
      list: async () => {
        const { components } = loadContractIndex();

        return {
          resources: components.map((component) => ({
            uri: `rapidkit://contracts/components/${component.name.toLowerCase()}`,
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
      title: 'RapidKit Component Contract',
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
      const resourceUri = `rapidkit://contracts/components/${component.name.toLowerCase()}`;

      return jsonTextContent(resourceUri, {
        name: component.name,
        indexEntry: component,
        contract,
      });
    },
  );

  server.registerResource(
    'component-doc',
    new ResourceTemplate('rapidkit://docs/components/{name}', {
      list: async () => {
        const { components } = loadContractIndex();

        return {
          resources: components.map((component) => ({
            uri: `rapidkit://docs/components/${component.name.toLowerCase()}`,
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
      title: 'RapidKit Component Docs',
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

      const resourceUri = `rapidkit://docs/components/${component.name.toLowerCase()}`;

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
    'list_presets',
    {
      title: 'List Presets',
      description:
        'Lists available project scaffolding presets from ai/contracts/index.json.',
    },
    async () => {
      const { presets } = loadContractIndex();

      return toolTextResult({ presets });
    },
  );

  server.registerTool(
    'get_preset_contract',
    {
      title: 'Get Preset Contract',
      description:
        'Returns one preset contract plus index metadata for scaffold planning.',
      inputSchema: {
        id: z.string().min(1),
      },
    },
    async ({ id }) => {
      const { presets } = loadContractIndex();
      const preset = findPreset(presets, id);

      if (!preset) {
        return {
          content: [
            {
              type: 'text',
              text: `Unknown preset id: ${id}`,
            },
          ],
          isError: true,
        };
      }

      const contract = loadPresetContract(preset);

      return toolTextResult({
        id: preset.id,
        indexEntry: preset,
        contract,
      });
    },
  );

  server.registerTool(
    'plan_project',
    {
      title: 'Plan Project',
      description:
        'Returns a contract-compliant scaffold plan for enterprise project generation.',
      inputSchema: {
        useCase: z.string().min(3),
        packageManager: z.enum(['pnpm', 'npm']).optional(),
        complianceProfile: z.enum(['baseline', 'hardened']).optional(),
        deploymentTarget: z
          .enum(['azure-container-apps', 'vercel', 'none'])
          .optional(),
        backendMode: z.enum(['real-api', 'mock-api']).optional(),
        allowIncompatibleNode: z.boolean().optional(),
      },
    },
    async ({
      useCase,
      packageManager,
      complianceProfile,
      deploymentTarget,
      backendMode,
      allowIncompatibleNode,
    }) => {
      const preflight = getNodeCompatibilityPreflight(process.version);
      const executionRecommendation = recommendExecutionPath({
        preflight,
        operation: 'plan_project',
        strictMode: false,
        allowIncompatibleNode,
      });
      const { presets } = loadContractIndex();

      const selectedPreset = selectPresetForUseCase(presets, useCase);

      if (!selectedPreset) {
        return {
          content: [
            {
              type: 'text',
              text: 'No presets are registered in ai/contracts/index.json.',
            },
          ],
          isError: true,
        };
      }

      const contract = loadPresetContract(selectedPreset);

      const resolvedPlan = {
        presetId: selectedPreset.id,
        rationale:
          selectedPreset.id === 'operations-console'
            ? 'Operations console preset matches incident and queue-driven internal workflows with enterprise constraints.'
            : 'Enterprise dashboard preset is optimized for authenticated internal applications with backend integration boundaries.',
        preflight,
        preflightWarning: preflight.supported
          ? null
          : 'Node runtime is outside recommended range (^20.19.0 || >=22.12.0). Scaffolding can still run, but validation/build may fail later.',
        executionRecommendation,
        request: {
          useCase,
        },
        options: {
          packageManager: packageManager ?? 'pnpm',
          complianceProfile: complianceProfile ?? 'baseline',
          deploymentTarget: deploymentTarget ?? 'none',
          backendMode: backendMode ?? 'real-api',
        },
        checks: contract.requiredChecks,
        routeBlueprint: contract.routeBlueprint ?? null,
        integrationBlueprint: contract.integrationBlueprint ?? null,
      };

      return toolTextResult(resolvedPlan);
    },
  );

  server.registerTool(
    'scaffold_project',
    {
      title: 'Scaffold Project',
      description:
        'Executes rapidkit init with validated options to generate a new project.',
      inputSchema: {
        projectName: z.string().min(1),
        presetId: z.string().default('enterprise-dashboard'),
        outputDir: z.string().optional(),
        allowCommunity: z.boolean().optional(),
      },
    },
    async ({ projectName, presetId, outputDir, allowCommunity }) => {
      const preflight = getNodeCompatibilityPreflight(process.version);
      const args = [
        'packages/create-rapidkit/src/index.mjs',
        'init',
        projectName,
        '--preset',
        presetId,
      ];

      if (outputDir && outputDir.trim().length > 0) {
        args.push('--output', outputDir);
      }

      if (allowCommunity) {
        args.push('--allow-community');
      }

      const result = spawnSync(process.execPath, args, {
        cwd: ROOT_DIR,
        encoding: 'utf8',
      });

      const payload = {
        command: `${process.execPath} ${args.join(' ')}`,
        success: result.status === 0,
        status: result.status,
        preflight,
        preflightWarning: preflight.supported
          ? null
          : 'Node runtime is outside recommended range (^20.19.0 || >=22.12.0). Scaffolding was allowed, but validation/build may fail later.',
        stdout: (result.stdout ?? '').trim(),
        stderr: (result.stderr ?? '').trim(),
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

  server.registerTool(
    'validate_scaffold',
    {
      title: 'Validate Scaffold',
      description:
        'Runs required quality checks for a scaffolded project using preset contract requirements.',
      inputSchema: {
        projectDir: z.string().min(1),
        presetId: z.string().default('enterprise-dashboard'),
        packageManager: z.enum(['pnpm', 'npm']).default('pnpm'),
        skipInstall: z.boolean().optional(),
        allowIncompatibleNode: z.boolean().optional(),
      },
    },
    async ({
      projectDir,
      presetId,
      packageManager,
      skipInstall,
      allowIncompatibleNode,
    }) => {
      const absoluteProjectDir = resolveProjectDir(projectDir);
      const preflight = getNodeCompatibilityPreflight(process.version);

      if (!preflight.supported && !allowIncompatibleNode) {
        const payload = {
          presetId,
          projectDir: absoluteProjectDir,
          packageManager,
          success: false,
          preflight,
          checks: [],
          failureReason:
            'Node runtime is incompatible. Re-run with allowIncompatibleNode=true to continue at your own risk.',
        };

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

      const projectPackageJson = path.resolve(
        absoluteProjectDir,
        'package.json',
      );
      if (!fileExists(projectPackageJson)) {
        return {
          content: [
            {
              type: 'text',
              text: `Scaffold validation target is missing package.json: ${absoluteProjectDir}`,
            },
          ],
          isError: true,
        };
      }

      const presetValidationContext = resolvePresetForValidation(presetId);
      if (!presetValidationContext) {
        return {
          content: [
            {
              type: 'text',
              text: `Unknown preset id: ${presetId}`,
            },
          ],
          isError: true,
        };
      }

      const results = runScaffoldValidationChecks({
        requiredChecks: presetValidationContext.requiredChecks,
        packageManager,
        absoluteProjectDir,
        skipInstall,
      });

      const success = results.every((result) => result.success === true);

      const payload = {
        presetId,
        projectDir: absoluteProjectDir,
        packageManager,
        success,
        preflight,
        checks: results,
      };

      if (!success) {
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
    'recommend_execution_path',
    {
      title: 'Recommend Execution Path',
      description:
        'Returns a deterministic recommendation for scaffold workflows based on Node runtime compatibility and operation strictness.',
      inputSchema: {
        operation: z
          .enum(['plan_project', 'scaffold_project', 'validate_scaffold'])
          .default('validate_scaffold'),
        allowIncompatibleNode: z.boolean().optional(),
      },
    },
    async ({ operation, allowIncompatibleNode }) => {
      const preflight = getNodeCompatibilityPreflight(process.version);
      const strictMode = operation === 'validate_scaffold';
      const recommendation = recommendExecutionPath({
        preflight,
        operation,
        strictMode,
        allowIncompatibleNode,
      });

      return toolTextResult({
        operation,
        strictMode,
        preflight,
        allowIncompatibleNode: Boolean(allowIncompatibleNode),
        recommendation: recommendation.recommendation,
        reason: recommendation.reason,
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
    `RapidKit MCP server\n\nUsage:\n  node scripts/mcp-server.mjs\n\nThis starts a stdio MCP server exposing read-only contracts, themes, docs, and validation tools.\n`,
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
  process.stderr.write(
    `Failed to start RapidKit MCP server: ${String(error)}\n`,
  );
  process.exit(1);
}
