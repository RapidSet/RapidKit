#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHighlighter } from 'shiki';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const registryRoot = path.join(repoRoot, 'docs-nextra', 'registry');
const generatedDir = path.join(registryRoot, 'generated');
const exampleCodeFile = path.join(generatedDir, 'exampleCode.ts');
const flowFilesFile = path.join(generatedDir, 'flowFiles.ts');

const FLAT_SURFACES = [
  { dir: 'components', idFor: (file) => path.basename(file, '.tsx') },
  {
    dir: 'hooks',
    idFor: (file, groupDir) =>
      `${path.basename(groupDir)}:${path.basename(file, '.tsx')}`,
  },
];

const FLOW_FILE_PATTERN = /\.(tsx?|css|json)$/;

const SHIKI_LANGS = ['tsx', 'ts', 'jsx', 'js', 'css', 'json', 'md'];
const SHIKI_THEMES = { light: 'github-light', dark: 'github-dark' };

async function safeReaddir(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function collectFlatExamples() {
  const entries = [];

  for (const { dir, idFor } of FLAT_SURFACES) {
    const surfaceRoot = path.join(registryRoot, dir);
    const groups = await safeReaddir(surfaceRoot);

    for (const group of groups) {
      if (!group.isDirectory()) {
        continue;
      }
      const groupDir = path.join(surfaceRoot, group.name);
      const files = await safeReaddir(groupDir);

      for (const file of files) {
        if (!file.isFile() || !file.name.endsWith('.tsx')) {
          continue;
        }
        const id = idFor(file.name, groupDir);
        const filePath = path.join(groupDir, file.name);
        entries.push({ id, filePath });
      }
    }
  }

  entries.sort((a, b) => a.id.localeCompare(b.id));
  return entries;
}

async function walkFlowFiles(dir) {
  const entries = await safeReaddir(dir);
  const collected = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collected.push(...(await walkFlowFiles(full)));
    } else if (entry.isFile() && FLOW_FILE_PATTERN.test(entry.name)) {
      collected.push(full);
    }
  }
  return collected;
}

function detectLanguage(filePath) {
  const ext = path.extname(filePath).slice(1);
  if (ext === 'tsx' || ext === 'ts' || ext === 'jsx' || ext === 'js') {
    return ext;
  }
  if (ext === 'css' || ext === 'json' || ext === 'md') {
    return ext;
  }
  return 'tsx';
}

function compareFlowPaths(a, b) {
  const aDepth = a.split('/').length;
  const bDepth = b.split('/').length;
  if (aDepth !== bDepth) {
    return aDepth - bDepth;
  }
  return a.localeCompare(b);
}

function highlight(highlighter, content, language) {
  try {
    return highlighter.codeToHtml(content, {
      lang: language,
      themes: SHIKI_THEMES,
    });
  } catch (error) {
    console.warn(
      `[gen:example-code] shiki failed to highlight (${language}):`,
      error?.message ?? error,
    );
    return '';
  }
}

async function collectFlowFiles(highlighter) {
  const flowsRoot = path.join(registryRoot, 'flows');
  const dirs = await safeReaddir(flowsRoot);
  const result = {};

  for (const dir of dirs) {
    if (!dir.isDirectory()) {
      continue;
    }
    const flowDir = path.join(flowsRoot, dir.name);
    const absPaths = await walkFlowFiles(flowDir);
    if (absPaths.length === 0) {
      continue;
    }
    const files = await Promise.all(
      absPaths.map(async (absPath) => {
        const relPath = path
          .relative(flowDir, absPath)
          .split(path.sep)
          .join('/');
        const content = await fs.readFile(absPath, 'utf8');
        const language = detectLanguage(absPath);
        const html = highlight(highlighter, content, language);
        return { path: relPath, content, language, html };
      }),
    );
    files.sort((a, b) => compareFlowPaths(a.path, b.path));
    result[dir.name] = files;
  }

  return result;
}

function serializeExampleCode(entries, sources) {
  const lines = [
    '// AUTO-GENERATED. Do not edit. Run `pnpm gen:example-code` (or rely on `predocs:*` hooks).',
    'export const EXAMPLE_CODE: Record<string, string> = {',
  ];

  for (let i = 0; i < entries.length; i += 1) {
    const { id } = entries[i];
    const source = sources[i];
    lines.push(`  ${JSON.stringify(id)}: ${JSON.stringify(source)},`);
  }

  lines.push('};', '');
  return lines.join('\n');
}

function serializeFlowFiles(flows) {
  const lines = [
    '// AUTO-GENERATED. Do not edit. Run `pnpm gen:example-code` (or rely on `predocs:*` hooks).',
    '',
    'export type FlowExampleFile = Readonly<{',
    '  path: string;',
    '  content: string;',
    "  language: 'tsx' | 'ts' | 'jsx' | 'js' | 'css' | 'json' | 'md';",
    '  html: string;',
    '}>;',
    '',
    'export const FLOW_EXAMPLE_FILES: Record<string, readonly FlowExampleFile[]> = {',
  ];

  const flowIds = Object.keys(flows).sort();
  for (const flowId of flowIds) {
    lines.push(`  ${JSON.stringify(flowId)}: [`);
    for (const file of flows[flowId]) {
      lines.push(
        `    { path: ${JSON.stringify(file.path)}, language: ${JSON.stringify(file.language)}, content: ${JSON.stringify(file.content)}, html: ${JSON.stringify(file.html)} },`,
      );
    }
    lines.push('  ],');
  }
  lines.push('};', '');
  return lines.join('\n');
}

async function main() {
  await fs.mkdir(generatedDir, { recursive: true });

  const entries = await collectFlatExamples();
  const sources = await Promise.all(
    entries.map(({ filePath }) => fs.readFile(filePath, 'utf8')),
  );
  await fs.writeFile(
    exampleCodeFile,
    serializeExampleCode(entries, sources),
    'utf8',
  );
  console.log(
    `[gen:example-code] wrote ${entries.length} example${entries.length === 1 ? '' : 's'} → ${path.relative(repoRoot, exampleCodeFile)}`,
  );

  const highlighter = await createHighlighter({
    themes: Object.values(SHIKI_THEMES),
    langs: SHIKI_LANGS,
  });

  const flows = await collectFlowFiles(highlighter);
  const flowCount = Object.keys(flows).length;
  const totalFlowFiles = Object.values(flows).reduce(
    (sum, files) => sum + files.length,
    0,
  );
  await fs.writeFile(flowFilesFile, serializeFlowFiles(flows), 'utf8');
  console.log(
    `[gen:example-code] wrote ${flowCount} flow${flowCount === 1 ? '' : 's'} (${totalFlowFiles} file${totalFlowFiles === 1 ? '' : 's'}, pre-highlighted) → ${path.relative(repoRoot, flowFilesFile)}`,
  );

  highlighter.dispose?.();
}

main().catch((error) => {
  console.error('[gen:example-code] failed:', error);
  process.exit(1);
});
