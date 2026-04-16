import { defineConfig } from 'vitest/config';
import { createWorkspaceAliases } from './config/aliases';

export default defineConfig({
  resolve: {
    alias: createWorkspaceAliases(__dirname),
  },
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['tests/ct/**', 'playwright/**'],
  },
});
