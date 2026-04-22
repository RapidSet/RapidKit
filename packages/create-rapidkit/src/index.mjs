#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
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

const DEFAULT_DEPLOYMENT_TARGET = 'none';

const DEPLOYMENT_PROMPT_NAME = 'deploymentTarget';

const DOCKER_REQUIRED_TARGETS = new Set(['azure-container-apps', 'kubernetes']);

const formatOptionLabel = (value) =>
  value
    .split('-')
    .map((segment) => (segment.toUpperCase() === 'AWS' ? 'AWS' : segment))
    .join(' ');

const getDeploymentPrompt = (preset) =>
  Array.isArray(preset.contract.prompts)
    ? preset.contract.prompts.find(
        (prompt) => prompt.name === DEPLOYMENT_PROMPT_NAME,
      )
    : null;

const resolveDeploymentOptions = (preset) => {
  const deploymentPrompt = getDeploymentPrompt(preset);
  return Array.isArray(deploymentPrompt?.options)
    ? deploymentPrompt.options
    : [DEFAULT_DEPLOYMENT_TARGET];
};

const resolveDefaultDeploymentTarget = (preset) => {
  const deploymentPrompt = getDeploymentPrompt(preset);
  const options = resolveDeploymentOptions(preset);
  const fallback = options.includes(DEFAULT_DEPLOYMENT_TARGET)
    ? DEFAULT_DEPLOYMENT_TARGET
    : options[0];

  return options.includes(deploymentPrompt?.default)
    ? deploymentPrompt.default
    : fallback;
};

const resolveDeploymentFlag = (preset) => {
  if (hasFlag('--skip-deployment')) {
    return DEFAULT_DEPLOYMENT_TARGET;
  }

  const requestedTarget = getArgValue('--deployment');
  if (!requestedTarget) {
    return null;
  }

  const options = resolveDeploymentOptions(preset);
  if (!options.includes(requestedTarget)) {
    process.stderr.write(
      `Unsupported deployment target '${requestedTarget}'. Supported targets: ${options.join(', ')}\n`,
    );
    process.exit(1);
  }

  return requestedTarget;
};

const resolveDockerRequirement = (deploymentTarget) =>
  DOCKER_REQUIRED_TARGETS.has(deploymentTarget);

const resolveDockerBuildStrategy = (deploymentTarget) =>
  resolveDockerRequirement(deploymentTarget) ? 'multi-stage' : 'not-required';

const promptForDeploymentTarget = async (preset) => {
  const options = resolveDeploymentOptions(preset);
  const defaultTarget = resolveDefaultDeploymentTarget(preset);

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return defaultTarget;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    process.stdout.write('Select a deployment target for this blueprint:\n');
    options.forEach((option, index) => {
      const defaultLabel = option === defaultTarget ? ' (default)' : '';
      process.stdout.write(
        `  ${index + 1}. ${formatOptionLabel(option)} [${option}]${defaultLabel}\n`,
      );
    });

    const answer = await rl.question(
      `Deployment target [default: ${defaultTarget}, Enter to keep]: `,
    );
    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer) {
      return defaultTarget;
    }

    const numericChoice = Number.parseInt(trimmedAnswer, 10);
    if (
      !Number.isNaN(numericChoice) &&
      numericChoice >= 1 &&
      numericChoice <= options.length
    ) {
      return options[numericChoice - 1];
    }

    if (options.includes(trimmedAnswer)) {
      return trimmedAnswer;
    }

    process.stderr.write(
      `Unsupported deployment target '${trimmedAnswer}'. Falling back to default '${defaultTarget}'.\n`,
    );
    return defaultTarget;
  } finally {
    rl.close();
  }
};

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
    `rapidkit\n\nUsage:\n  rapidkit list-presets\n  rapidkit init <project-name> [--preset enterprise-dashboard]\n\nFlags:\n  --preset <id>         Preset id (default: enterprise-dashboard)\n  --output <path>       Output directory parent (default: current working directory)\n  --deployment <id>     Deployment target to record in the blueprint\n  --skip-deployment     Record no deployment target and skip the deployment prompt\n  --allow-community     Allow presets marked as community source\n  --help                Show this message\n`,
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

const runInit = async () => {
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
  const deploymentTarget =
    resolveDeploymentFlag(preset) ?? (await promptForDeploymentTarget(preset));
  const requiresDocker = resolveDockerRequirement(deploymentTarget);
  const dockerBuildStrategy = resolveDockerBuildStrategy(deploymentTarget);

  scaffoldProject({
    templateDir,
    targetDir,
    replacements: {
      __DEPLOYMENT_TARGET__: deploymentTarget,
      '"__DEPLOYMENT_REQUIRES_DOCKER__"': String(requiresDocker),
      __DOCKER_BUILD_STRATEGY__: dockerBuildStrategy,
      __PROJECT_NAME__: projectName,
      __RAPIDKIT_PRESET_ID__: preset.contract.id,
    },
  });

  process.stdout.write(
    `Scaffolded '${projectName}' using preset '${preset.contract.id}' at ${targetDir} with deployment target '${deploymentTarget}'\n`,
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
  await runInit();
  process.exit(0);
}

process.stderr.write(`Unknown command: ${command}\n`);
showHelp();
process.exit(1);
