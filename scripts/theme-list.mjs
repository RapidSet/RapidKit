import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const indexPath = path.resolve(rootDir, 'ai/contracts/index.json');
const activeThemePath = path.resolve(rootDir, 'ai/theme.active.json');

const readJson = (absolutePath) =>
  JSON.parse(fs.readFileSync(absolutePath, 'utf8'));

const indexJson = readJson(indexPath);
const themes = Array.isArray(indexJson.themes) ? indexJson.themes : [];
const activeThemeJson = fs.existsSync(activeThemePath)
  ? readJson(activeThemePath)
  : { themeId: null };

const output = {
  activeThemeId: activeThemeJson.themeId ?? null,
  themes: themes.map((theme) => ({
    id: theme.id,
    cssPath: theme.cssPath,
    contractPath: theme.contractPath,
  })),
};

console.log(JSON.stringify(output, null, 2));
