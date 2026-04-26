export type SiteNavigationItem = {
  title: string;
  href: string;
  external?: boolean;
};

export const SITE_NAV_ITEMS: SiteNavigationItem[] = [
  { title: 'Installation', href: '/INSTALLATION/' },
  { title: 'Components', href: '/components/' },
  { title: 'Hooks', href: '/hooks/' },
  { title: 'Flows', href: '/flows/' },
  { title: 'Access Control', href: '/ACCESS_CONTROL/' },
  { title: 'Theme', href: '/THEMING/' },
  { title: 'CLI', href: '/rapidcraft/' },
  { title: 'MCP Server', href: '/MCP-SERVER/' },
  { title: 'Architecture', href: '/ARCHITECTURE/' },
];
