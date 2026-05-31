import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { createWorkspaceAliases } from './config/aliases';

const packageJsonPath = path.resolve(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as {
  version?: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};
const packageVersion = packageJson.version ?? '0.0.0';

const externalPackages = [
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.dependencies ?? {}),
  'react/jsx-runtime',
];

const isExternal = (id: string) =>
  externalPackages.some((dep) => id === dep || id.startsWith(`${dep}/`));

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
      outDir: 'dist',
      entryRoot: 'src',
      insertTypesEntry: true,
    }),
  ],
  define: {
    __RAPIDKIT_VERSION__: JSON.stringify(packageVersion),
  },
  resolve: {
    alias: createWorkspaceAliases(__dirname),
  },
  publicDir: false,
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      cssFileName: 'index',
    },
    rollupOptions: {
      external: isExternal,
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
});
