import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

const indexPath = path.resolve(rootDir, 'ai/contracts/index.json');
const docsDir = path.resolve(rootDir, 'docs/components');
const docsHubPath = path.resolve(docsDir, 'README.md');

const errors = [];

const toKebabCase = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();

const ensureFile = (absolutePath, message) => {
  if (!fs.existsSync(absolutePath)) {
    errors.push(message);
  }
};

if (!fs.existsSync(indexPath)) {
  errors.push('Missing contracts index: ai/contracts/index.json');
} else {
  const indexJson = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const components = Array.isArray(indexJson.components)
    ? indexJson.components
    : [];

  ensureFile(docsHubPath, 'Missing docs hub: docs/components/README.md');

  const hubContent = fs.existsSync(docsHubPath)
    ? fs.readFileSync(docsHubPath, 'utf8')
    : '';

  for (const component of components) {
    if (!component?.name || typeof component.name !== 'string') {
      errors.push(
        'Invalid component entry in ai/contracts/index.json: missing name',
      );
      continue;
    }

    const slug = toKebabCase(component.name);
    const docRelativePath = `docs/components/${slug}.md`;
    const docAbsolutePath = path.resolve(rootDir, docRelativePath);

    ensureFile(
      docAbsolutePath,
      `Missing component doc for ${component.name}: ${docRelativePath}`,
    );

    if (hubContent && !hubContent.includes(`./${slug}.md`)) {
      errors.push(
        `Missing docs hub link for ${component.name}: add ./${slug}.md to docs/components/README.md`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error('Component docs validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Component docs validation passed.');
