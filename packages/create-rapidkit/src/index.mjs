#!/usr/bin/env node
import path from 'node:path';
import { getPresetById, listPresets } from './lib/contracts.mjs';
import { resolveContractsIndexPath } from './lib/paths.mjs';
import { scaffoldProject } from './lib/scaffold.mjs';

const args = process.argv.slice(2);

const hasFlag = (flag) => args.includes(flag);

const getArgValue = (flag) => {
  const flagIndex = args.indexOf(flag);
  if (flagIndex === -1 || flagIndex + 1 >= args.length) {
    return null;
  }
  return args[flagIndex + 1];
};

const TEMPLATE_ROOT_PREFIX = 'packages/create-rapidkit/';

const resolveTemplateRoot = (templateRoot, mode) => {
  if (mode !== 'packaged' || typeof templateRoot !== 'string') {
    return templateRoot;
  }

  return templateRoot.startsWith(TEMPLATE_ROOT_PREFIX)
    ? templateRoot.slice(TEMPLATE_ROOT_PREFIX.length)
    : templateRoot;
};

const showHelp = () => {
  process.stdout.write(
    `rapidkit\n\nUsage:\n  rapidkit list-presets\n  rapidkit init <project-name> [--preset enterprise-dashboard]\n\nFlags:\n  --preset <id>         Preset id (default: enterprise-dashboard)\n  --output <path>       Output directory parent (default: current working directory)\n  --allow-community     Allow presets marked as community source\n  --help                Show this message\n`,
  );
};

const runListPresets = () => {
  const presets = listPresets();

  if (presets.length === 0) {
    process.stdout.write('No presets found in ai/contracts/index.json\n');
    return;
  }

  presets.forEach((preset) => {
    process.stdout.write(
      `- ${preset.id} [${preset.source ?? 'unknown'}]: ${preset.contractPath}\n`,
    );
  });
};

const runInit = () => {
  const projectName = args[1];

  if (!projectName || projectName.startsWith('-')) {
    process.stderr.write('Missing required project name for init.\n');
    process.exit(1);
  }

  const presetId = getArgValue('--preset') ?? 'enterprise-dashboard';
  const outputRoot = getArgValue('--output') ?? process.cwd();

  const preset = getPresetById(presetId);
  if (!preset) {
    process.stderr.write(`Unknown preset: ${presetId}\n`);
    process.exit(1);
  }

  const allowCommunity = hasFlag('--allow-community');
  if (preset.indexEntry.source === 'community' && !allowCommunity) {
    process.stderr.write(
      `Preset '${presetId}' is community-sourced. Re-run with --allow-community to proceed.\n`,
    );
    process.exit(1);
  }

  const { rootDir, mode } = resolveContractsIndexPath();
  const templateRoot = resolveTemplateRoot(
    preset.indexEntry.templateRoot,
    mode,
  );
  const templateDir = path.resolve(rootDir, `${templateRoot}/template`);
  const targetDir = path.resolve(outputRoot, projectName);

  scaffoldProject({
    templateDir,
    targetDir,
    replacements: {
      __PROJECT_NAME__: projectName,
      __RAPIDKIT_PRESET_ID__: preset.contract.id,
    },
  });

  process.stdout.write(
    `Scaffolded '${projectName}' using preset '${preset.contract.id}' at ${targetDir}\n`,
  );
};

if (hasFlag('--help') || hasFlag('-h') || args.length === 0) {
  showHelp();
  process.exit(0);
}

const command = args[0];

if (command === 'list-presets') {
  runListPresets();
  process.exit(0);
}

if (command === 'init') {
  runInit();
  process.exit(0);
}

process.stderr.write(`Unknown command: ${command}\n`);
showHelp();
process.exit(1);
