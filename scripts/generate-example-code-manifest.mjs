#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const registryRoot = path.join(repoRoot, 'docs-nextra', 'registry');
const generatedDir = path.join(registryRoot, 'generated');
const outFile = path.join(generatedDir, 'exampleCode.ts');

const SURFACES = [
  { dir: 'components', idFor: (file) => path.basename(file, '.tsx') },
  { dir: 'flows', idFor: (file) => path.basename(file, '.tsx') },
  {
    dir: 'hooks',
    idFor: (file, groupDir) =>
      `${path.basename(groupDir)}:${path.basename(file, '.tsx')}`,
  },
];

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

async function collectExamples() {
  const entries = [];

  for (const { dir, idFor } of SURFACES) {
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

function serializeMap(entries, sources) {
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

async function main() {
  const entries = await collectExamples();
  const sources = await Promise.all(
    entries.map(({ filePath }) => fs.readFile(filePath, 'utf8')),
  );

  await fs.mkdir(generatedDir, { recursive: true });
  await fs.writeFile(outFile, serializeMap(entries, sources), 'utf8');

  console.log(
    `[gen:example-code] wrote ${entries.length} example${entries.length === 1 ? '' : 's'} → ${path.relative(repoRoot, outFile)}`,
  );
}

main().catch((error) => {
  console.error('[gen:example-code] failed:', error);
  process.exit(1);
});
