import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const indexPath = path.resolve(rootDir, 'ai/contracts/index.json');

const args = process.argv.slice(2);
const getArgValue = (flag) => {
  const flagIndex = args.indexOf(flag);
  if (flagIndex === -1 || flagIndex + 1 >= args.length) {
    return null;
  }
  return args[flagIndex + 1];
};

const themeId = getArgValue('--id');
const baseThemeId = getArgValue('--from') ?? 'default';

if (!themeId) {
  console.error('Missing required argument: --id <theme-id>');
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(themeId)) {
  console.error('Theme id must match ^[a-z0-9-]+$');
  process.exit(1);
}

const indexJson = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const themes = Array.isArray(indexJson.themes) ? indexJson.themes : [];

if (themes.some((theme) => theme.id === themeId)) {
  console.error(`Theme id already exists: ${themeId}`);
  process.exit(1);
}

const baseTheme = themes.find((theme) => theme.id === baseThemeId);
if (!baseTheme) {
  console.error(`Base theme not found: ${baseThemeId}`);
  process.exit(1);
}

const baseThemeContractPath = path.resolve(rootDir, baseTheme.contractPath);
const baseThemeContract = JSON.parse(
  fs.readFileSync(baseThemeContractPath, 'utf8'),
);

const baseThemeCssPath = path.resolve(rootDir, baseTheme.cssPath);
if (!fs.existsSync(baseThemeCssPath)) {
  console.error(`Base theme CSS missing: ${baseTheme.cssPath}`);
  process.exit(1);
}

const newCssRelativePath = `src/themes/${themeId}.css`;
const newCssAbsolutePath = path.resolve(rootDir, newCssRelativePath);
const newContractRelativePath = `ai/contracts/themes/${themeId}-theme.contract.json`;
const newContractAbsolutePath = path.resolve(rootDir, newContractRelativePath);

if (
  fs.existsSync(newCssAbsolutePath) ||
  fs.existsSync(newContractAbsolutePath)
) {
  console.error(`Theme files already exist for id: ${themeId}`);
  process.exit(1);
}

const baseCss = fs.readFileSync(baseThemeCssPath, 'utf8');
const cssWithHeader = `/* Generated from base theme '${baseThemeId}'. */\n${baseCss}`;
fs.writeFileSync(newCssAbsolutePath, cssWithHeader, 'utf8');

const newThemeContract = {
  id: themeId,
  displayName: themeId
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' '),
  version: '1.0.0',
  cssPath: newCssRelativePath,
  modes: baseThemeContract.modes,
  tokenPrefix: baseThemeContract.tokenPrefix,
  tokenCoverage: baseThemeContract.tokenCoverage,
  extendsTheme: baseThemeId,
};

fs.writeFileSync(
  newContractAbsolutePath,
  `${JSON.stringify(newThemeContract, null, 2)}\n`,
  'utf8',
);

const updatedThemes = [
  ...themes,
  {
    id: themeId,
    contractPath: newContractRelativePath,
    cssPath: newCssRelativePath,
  },
].sort((a, b) => a.id.localeCompare(b.id));

indexJson.themes = updatedThemes;
fs.writeFileSync(indexPath, `${JSON.stringify(indexJson, null, 2)}\n`, 'utf8');

console.log(
  `Created theme '${themeId}' from '${baseThemeId}'. Files: ${newCssRelativePath}, ${newContractRelativePath}`,
);
