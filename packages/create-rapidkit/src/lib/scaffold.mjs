import fs from 'node:fs';
import path from 'node:path';

const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const copyTemplateFile = (sourcePath, targetPath, replacements) => {
  const sourceText = fs.readFileSync(sourcePath, 'utf8');
  const rendered = Object.entries(replacements).reduce(
    (value, [token, replacement]) => value.replaceAll(token, replacement),
    sourceText,
  );

  ensureDir(path.dirname(targetPath));
  fs.writeFileSync(targetPath, rendered, 'utf8');
};

const copyTemplateDir = (sourceDir, targetDir, replacements) => {
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  entries.forEach((entry) => {
    const sourcePath = path.resolve(sourceDir, entry.name);
    const targetPath = path.resolve(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyTemplateDir(sourcePath, targetPath, replacements);
      return;
    }

    copyTemplateFile(sourcePath, targetPath, replacements);
  });
};

export const scaffoldProject = ({ templateDir, targetDir, replacements }) => {
  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template directory not found: ${templateDir}`);
  }

  if (fs.existsSync(targetDir)) {
    const existingEntries = fs.readdirSync(targetDir);
    if (existingEntries.length > 0) {
      throw new Error(`Target directory is not empty: ${targetDir}`);
    }
  }

  ensureDir(targetDir);
  copyTemplateDir(templateDir, targetDir, replacements);
};
