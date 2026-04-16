import fs from "node:fs";
import path from "node:path";

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
    return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    errors.push(`Invalid JSON: ${relativePath} (${String(error)})`);
    return null;
  }
};

const indexPath = "ai/contracts/index.json";

if (!exists(indexPath)) {
  errors.push(`Missing contracts index: ${indexPath}`);
} else {
  const indexJson = readJson(indexPath);

  if (indexJson) {
    if (!Array.isArray(indexJson.components)) {
      errors.push(`${indexPath} must contain a components array.`);
    } else {
      indexJson.components.forEach((entry, entryIndex) => {
        const entryPrefix = `${indexPath} components[${entryIndex}]`;

        if (!entry?.name || typeof entry.name !== "string") {
          errors.push(`${entryPrefix} is missing a string name.`);
        }

        if (!entry?.contractPath || typeof entry.contractPath !== "string") {
          errors.push(`${entryPrefix} is missing a string contractPath.`);
          return;
        }

        if (!exists(entry.contractPath)) {
          errors.push(
            `${entryPrefix} points to missing contract: ${entry.contractPath}`,
          );
          return;
        }

        if (!entry?.sourcePath || typeof entry.sourcePath !== "string") {
          errors.push(`${entryPrefix} is missing a string sourcePath.`);
        } else if (!isDirectory(entry.sourcePath)) {
          errors.push(
            `${entryPrefix} sourcePath is not a directory: ${entry.sourcePath}`,
          );
        }

        const contract = readJson(entry.contractPath);
        if (!contract) {
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

        if (!Array.isArray(contract.tests) || contract.tests.length === 0) {
          errors.push(
            `${entry.contractPath} must include at least one test file path in tests.`,
          );
        } else {
          contract.tests.forEach((testPath) => {
            if (typeof testPath !== "string" || !exists(testPath)) {
              errors.push(
                `${entry.contractPath} references missing test file: ${String(testPath)}`,
              );
            }
          });
        }

        const contractCapabilities = Object.entries(contract.capabilities || {})
          .filter(([, enabled]) => Boolean(enabled))
          .map(([capability]) => capability)
          .sort();

        const indexCapabilities = Array.isArray(entry.capabilities)
          ? [...entry.capabilities].sort()
          : [];

        if (contractCapabilities.length !== indexCapabilities.length) {
          errors.push(
            `${entryPrefix} capabilities length mismatch between index and contract (${indexCapabilities.length} vs ${contractCapabilities.length}).`,
          );
        } else {
          for (let i = 0; i < contractCapabilities.length; i += 1) {
            if (contractCapabilities[i] !== indexCapabilities[i]) {
              errors.push(
                `${entryPrefix} capabilities mismatch: index=${indexCapabilities.join(",")} contract=${contractCapabilities.join(",")}.`,
              );
              break;
            }
          }
        }
      });
    }
  }
}

if (errors.length > 0) {
  console.error("Contract validation failed:");
  errors.forEach((error) => {
    console.error(`- ${error}`);
  });
  process.exit(1);
}

console.log("Contract validation passed.");
