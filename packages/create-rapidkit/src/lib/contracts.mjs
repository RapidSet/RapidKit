import fs from 'node:fs';
import path from 'node:path';
import { resolveContractsIndexPath } from './paths.mjs';

const readJson = (absolutePath) =>
  JSON.parse(fs.readFileSync(absolutePath, 'utf8'));

export const loadContractsIndex = () => {
  const { indexPath, rootDir, mode } = resolveContractsIndexPath();

  if (!fs.existsSync(indexPath)) {
    throw new Error(`Missing contracts index at ${indexPath}`);
  }

  return {
    rootDir,
    mode,
    index: readJson(indexPath),
  };
};

export const listPresets = () => {
  const loaded = loadContractsIndex();
  return Array.isArray(loaded.index.presets) ? loaded.index.presets : [];
};

export const getPresetById = (presetId) => {
  const loaded = loadContractsIndex();
  const presets = Array.isArray(loaded.index.presets)
    ? loaded.index.presets
    : [];
  const preset = presets.find((entry) => entry.id === presetId) ?? null;

  if (!preset) {
    return null;
  }

  const contractPath = path.resolve(loaded.rootDir, preset.contractPath);
  if (!fs.existsSync(contractPath)) {
    throw new Error(`Missing preset contract: ${preset.contractPath}`);
  }

  const contract = readJson(contractPath);
  return {
    indexEntry: preset,
    contract,
  };
};
