import type { DocsThemeConfig } from 'nextra-theme-docs';
import { SiteHeader } from './docs-nextra/components/SiteHeader';
import { MODE_STORAGE_KEY } from './docs-nextra/components/siteTheme';

const config: DocsThemeConfig = {
  darkMode: false,
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
    enableSystem: false,
  },
  project: {
    link: 'https://github.com/tarikukebede/mezmer',
  },
  docsRepositoryBase: 'https://github.com/tarikukebede/mezmer/tree/main',
  footer: {
    content: 'RapidKit',
  },
};

export default config;
