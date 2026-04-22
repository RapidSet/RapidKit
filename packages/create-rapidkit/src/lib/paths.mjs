import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CLI_ROOT = path.resolve(__dirname, '..', '..');
export const REPO_ROOT = path.resolve(CLI_ROOT, '..', '..');

export const WORKSPACE_CONTRACTS_INDEX_PATH = path.resolve(
  REPO_ROOT,
  'ai/contracts/index.json',
);

export const PACKAGED_CONTRACTS_INDEX_PATH = path.resolve(
  CLI_ROOT,
  'contracts/index.json',
);

export const resolveContractsIndexPath = () => {
  if (fs.existsSync(WORKSPACE_CONTRACTS_INDEX_PATH)) {
    return {
      indexPath: WORKSPACE_CONTRACTS_INDEX_PATH,
      rootDir: REPO_ROOT,
      mode: 'workspace',
    };
  }

  return {
    indexPath: PACKAGED_CONTRACTS_INDEX_PATH,
    rootDir: CLI_ROOT,
    mode: 'packaged',
  };
};
