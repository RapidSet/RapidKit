import type { DocsThemeConfig } from 'nextra-theme-docs';
import { SiteHeader } from './docs-nextra/components/SiteHeader';
import { MODE_STORAGE_KEY } from './docs-nextra/components/siteTheme';

const config: DocsThemeConfig = {
  darkMode: true,
  head: () => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

    return (
      <>
        <title>RapidKit Documentation</title>
        <link rel="icon" href={`${basePath}/favicon.ico`} sizes="any" />
        <link
          rel="icon"
          href={`${basePath}/rapidkit.svg`}
          type="image/svg+xml"
        />
      </>
    );
  },
  sidebar: {
    autoCollapse: false,
    defaultMenuCollapseLevel: 99,
    toggleButton: false,
  },
  navbar: {
    component: SiteHeader as NonNullable<
      DocsThemeConfig['navbar']
    >['component'],
  },
  nextThemes: {
    storageKey: MODE_STORAGE_KEY,
    defaultTheme: 'light',
  },
  docsRepositoryBase: 'https://github.com/RapidSet/RapidKit/tree/main',
  footer: {
    content: 'RapidKit',
  },
};

export default config;
