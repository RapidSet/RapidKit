import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

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
});
