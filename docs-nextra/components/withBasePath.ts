const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function withBasePath(targetPath: string): string {
  if (!targetPath) {
    return basePath || '/';
  }

  if (!basePath) {
    return targetPath;
  }

  if (targetPath.startsWith(basePath)) {
    return targetPath;
  }

  const normalizedPath = targetPath.startsWith('/')
    ? targetPath
    : `/${targetPath}`;
  return `${basePath}${normalizedPath}`;
}
