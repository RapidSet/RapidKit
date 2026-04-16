import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const sourceThemesDir = path.resolve(rootDir, 'src/themes');
const targetThemesDir = path.resolve(rootDir, 'dist/themes');

if (!fs.existsSync(sourceThemesDir)) {
  console.error('Missing source themes directory: src/themes');
  process.exit(1);
}

fs.mkdirSync(targetThemesDir, { recursive: true });

const themeFiles = fs
  .readdirSync(sourceThemesDir)
  .filter((fileName) => fileName.endsWith('.css'));

for (const fileName of themeFiles) {
  const sourcePath = path.join(sourceThemesDir, fileName);
  const targetPath = path.join(targetThemesDir, fileName);
  fs.copyFileSync(sourcePath, targetPath);
}

console.log(`Copied ${themeFiles.length} theme assets to dist/themes.`);
