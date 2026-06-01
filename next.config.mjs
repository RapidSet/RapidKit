import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'RapidKit';
const basePath = process.env.GITHUB_ACTIONS ? `/${repoName}` : '';
const shouldExport =
  process.env.GITHUB_ACTIONS === 'true' ||
  process.env.NEXT_OUTPUT_EXPORT === 'true';

export default withNextra({
  ...(shouldExport ? { output: 'export' } : {}),
  basePath,
  assetPrefix: basePath || undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  typescript: {
    tsconfigPath: './tsconfig.docs.json',
  },
  trailingSlash: true,
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@rapidset/rapidkit/styles.css': path.resolve(
        __dirname,
        'src/styles.css',
      ),
      '@rapidset/rapidkit/themes': path.resolve(__dirname, 'src/themes'),
      '@rapidset/rapidkit': path.resolve(
        __dirname,
        'docs-nextra/registry/rapidkit-entry.ts',
      ),
    };
    return config;
  },
});
