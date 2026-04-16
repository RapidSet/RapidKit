import path from 'node:path';

export const createWorkspaceAliases = (rootDir: string) => ({
  '@': path.resolve(rootDir, 'src'),
  '@components': path.resolve(rootDir, 'src/components'),
  '@lib': path.resolve(rootDir, 'src/lib'),
  '@ui': path.resolve(rootDir, 'src/components/ui'),
});
