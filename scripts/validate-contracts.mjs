import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const errors = [];

const toAbsolute = (relativePath) => path.resolve(rootDir, relativePath);

const exists = (relativePath) => fs.existsSync(toAbsolute(relativePath));

const isDirectory = (relativePath) => {
  const absolutePath = toAbsolute(relativePath);
  return fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory();
};

const readJson = (relativePath) => {
  const absolutePath = toAbsolute(relativePath);
  try {
    return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    errors.push(`Invalid JSON: ${relativePath} (${String(error)})`);
    return null;
  }
};

const indexPath = 'ai/contracts/index.json';
const activeThemePath = 'ai/theme.active.json';
const requiredThemeTokens = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'radius',
];

const compareAlphabetically = (left, right) => left.localeCompare(right);

const validateCapabilities = (entryPrefix, entry, contract) => {
  const contractCapabilities = Object.entries(contract.capabilities || {})
    .filter(([, enabled]) => Boolean(enabled))
    .map(([capability]) => capability)
    .sort(compareAlphabetically);

  const indexCapabilities = Array.isArray(entry.capabilities)
    ? [...entry.capabilities].sort(compareAlphabetically)
    : [];

  if (contractCapabilities.length === indexCapabilities.length) {
    for (let i = 0; i < contractCapabilities.length; i += 1) {
      if (contractCapabilities[i] !== indexCapabilities[i]) {
        errors.push(
          `${entryPrefix} capabilities mismatch: index=${indexCapabilities.join(',')} contract=${contractCapabilities.join(',')}.`,
        );
        return;
      }
    }
    return;
  }

  errors.push(
    `${entryPrefix} capabilities length mismatch between index and contract (${indexCapabilities.length} vs ${contractCapabilities.length}).`,
  );
};

const validateContractTests = (entry) => {
  if (Array.isArray(entry.contract.tests) && entry.contract.tests.length > 0) {
    entry.contract.tests.forEach((testPath) => {
      const isValidPath = typeof testPath === 'string' && exists(testPath);
      if (isValidPath === false) {
        errors.push(
          `${entry.contractPath} references missing test file: ${String(testPath)}`,
        );
      }
    });
    return;
  }

  errors.push(
    `${entry.contractPath} must include at least one test file path in tests.`,
  );
};

const validateComponentEntry = (entry, entryIndex) => {
  const entryPrefix = `${indexPath} components[${entryIndex}]`;

  if (!entry?.name || typeof entry.name !== 'string') {
    errors.push(`${entryPrefix} is missing a string name.`);
  }

  if (!entry?.contractPath || typeof entry.contractPath !== 'string') {
    errors.push(`${entryPrefix} is missing a string contractPath.`);
    return;
  }

  if (exists(entry.contractPath) === false) {
    errors.push(
      `${entryPrefix} points to missing contract: ${entry.contractPath}`,
    );
    return;
  }

  if (!entry?.sourcePath || typeof entry.sourcePath !== 'string') {
    errors.push(`${entryPrefix} is missing a string sourcePath.`);
  } else if (isDirectory(entry.sourcePath) === false) {
    errors.push(
      `${entryPrefix} sourcePath is not a directory: ${entry.sourcePath}`,
    );
  }

  const contract = readJson(entry.contractPath);
  if (contract === null) {
    return;
  }

  if (contract.component !== entry.name) {
    errors.push(
      `${entryPrefix} name (${entry.name}) does not match contract.component (${contract.component}).`,
    );
  }

  if (contract.source !== entry.sourcePath) {
    errors.push(
      `${entryPrefix} sourcePath (${entry.sourcePath}) does not match contract.source (${contract.source}).`,
    );
  }

  validateContractTests({ contractPath: entry.contractPath, contract });
  validateCapabilities(entryPrefix, entry, contract);
};

const validateThemeTokenCoverage = (themeEntry, themeContract) => {
  if (
    Array.isArray(themeContract.tokenCoverage) &&
    themeContract.tokenCoverage.length > 0
  ) {
    requiredThemeTokens.forEach((token) => {
      if (themeContract.tokenCoverage.includes(token) === false) {
        errors.push(
          `${themeEntry.contractPath} tokenCoverage is missing required token: ${token}.`,
        );
      }
    });
    return;
  }

  errors.push(
    `${themeEntry.contractPath} must include tokenCoverage as a non-empty array.`,
  );
};

const validateThemeEntry = (
  themeEntry,
  themeEntryIndex,
  allThemes,
  seenIds,
) => {
  const themeEntryPrefix = `${indexPath} themes[${themeEntryIndex}]`;

  if (!themeEntry?.id || typeof themeEntry.id !== 'string') {
    errors.push(`${themeEntryPrefix} is missing a string id.`);
    return;
  }

  if (/^[a-z0-9-]+$/.test(themeEntry.id) === false) {
    errors.push(`${themeEntryPrefix} id must match ^[a-z0-9-]+$.`);
  }

  if (seenIds.has(themeEntry.id)) {
    errors.push(`${themeEntryPrefix} has duplicate id: ${themeEntry.id}.`);
  }
  seenIds.add(themeEntry.id);

  if (
    !themeEntry?.contractPath ||
    typeof themeEntry.contractPath !== 'string'
  ) {
    errors.push(`${themeEntryPrefix} is missing a string contractPath.`);
    return;
  }

  if (exists(themeEntry.contractPath) === false) {
    errors.push(
      `${themeEntryPrefix} points to missing contract: ${themeEntry.contractPath}`,
    );
    return;
  }

  if (!themeEntry?.cssPath || typeof themeEntry.cssPath !== 'string') {
    errors.push(`${themeEntryPrefix} is missing a string cssPath.`);
  } else if (exists(themeEntry.cssPath) === false) {
    errors.push(
      `${themeEntryPrefix} points to missing cssPath: ${themeEntry.cssPath}`,
    );
  }

  const themeContract = readJson(themeEntry.contractPath);
  if (themeContract === null) {
    return;
  }

  if (themeContract.id !== themeEntry.id) {
    errors.push(
      `${themeEntryPrefix} id (${themeEntry.id}) does not match contract.id (${themeContract.id}).`,
    );
  }

  if (themeContract.cssPath !== themeEntry.cssPath) {
    errors.push(
      `${themeEntryPrefix} cssPath (${themeEntry.cssPath}) does not match contract.cssPath (${themeContract.cssPath}).`,
    );
  }

  if (
    Array.isArray(themeContract.modes) === false ||
    themeContract.modes.length === 0
  ) {
    errors.push(
      `${themeEntry.contractPath} must include at least one mode in modes.`,
    );
  }

  if (themeContract.tokenPrefix !== '--rk-') {
    errors.push(`${themeEntry.contractPath} tokenPrefix must be '--rk-'.`);
  }

  validateThemeTokenCoverage(themeEntry, themeContract);

  if (themeContract.extendsTheme) {
    const parentExists = allThemes.some(
      (candidateTheme) => candidateTheme.id === themeContract.extendsTheme,
    );
    if (parentExists === false) {
      errors.push(
        `${themeEntry.contractPath} extendsTheme references unknown theme id: ${themeContract.extendsTheme}.`,
      );
    }
  }
};

const validateActiveTheme = (seenThemeIds) => {
  if (exists(activeThemePath)) {
    const activeThemeJson = readJson(activeThemePath);

    if (activeThemeJson === null) {
      return;
    }

    if (
      !activeThemeJson.themeId ||
      typeof activeThemeJson.themeId !== 'string'
    ) {
      errors.push(`${activeThemePath} must contain a string themeId.`);
      return;
    }

    if (seenThemeIds.has(activeThemeJson.themeId) === false) {
      errors.push(
        `${activeThemePath} themeId (${activeThemeJson.themeId}) is not registered in ${indexPath}.`,
      );
    }
    return;
  }

  errors.push(`Missing active theme pointer: ${activeThemePath}`);
};

const validateIndex = (indexJson) => {
  if (Array.isArray(indexJson.components)) {
    indexJson.components.forEach(validateComponentEntry);
  } else {
    errors.push(`${indexPath} must contain a components array.`);
  }

  const themesDeclared = indexJson.themes !== undefined;
  const themesAreArray = Array.isArray(indexJson.themes);

  if (themesDeclared && themesAreArray === false) {
    errors.push(`${indexPath} themes must be an array when provided.`);
  }

  if (themesAreArray) {
    const seenThemeIds = new Set();
    indexJson.themes.forEach((themeEntry, index) => {
      validateThemeEntry(themeEntry, index, indexJson.themes, seenThemeIds);
    });
    validateActiveTheme(seenThemeIds);
  }
};

if (exists(indexPath)) {
  const indexJson = readJson(indexPath);
  if (indexJson !== null) {
    validateIndex(indexJson);
  }
} else {
  errors.push(`Missing contracts index: ${indexPath}`);
}

if (errors.length > 0) {
  console.error('Contract validation failed:');
  errors.forEach((error) => {
    console.error(`- ${error}`);
  });
  process.exit(1);
}

console.log('Contract validation passed.');
