import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'mezmer';
const docsBase = process.env.GITHUB_ACTIONS ? `/${repoName}/` : '/';
const assetPath = `${docsBase}mezmer-icon.svg`;

export default withMermaid(
  defineConfig({
    title: 'Mezmer',
    description:
      'Reusable React UI component library focused on accessibility and contract-driven APIs.',
    base: docsBase,
    head: [['link', { rel: 'icon', href: assetPath }]],
    cleanUrls: true,
    lastUpdated: true,
    themeConfig: {
      logo: assetPath,
      nav: [
        { text: 'Installation', link: '/INSTALLATION' },
        { text: 'Guide', link: '/THEMING' },
        { text: 'MCP', link: '/MCP-SERVER' },
        { text: 'Components', link: '/components/' },
        {
          text: 'GitHub',
          link: 'https://github.com/tarikukebede/mezmer',
        },
      ],
      sidebar: [
        {
          text: 'Getting Started',
          items: [
            { text: 'Home', link: '/' },
            { text: 'Installation', link: '/INSTALLATION' },
            { text: 'Theming', link: '/THEMING' },
            { text: 'Theme Configuration', link: '/THEME-CONFIGURATION' },
            { text: 'MCP Server', link: '/MCP-SERVER' },
            { text: 'Architecture', link: '/ARCHITECTURE' },
          ],
        },
        {
          text: 'Components',
          items: [
            { text: 'Overview', link: '/components/' },
            { text: 'BaseTable', link: '/components/base-table' },
            { text: 'Button', link: '/components/button' },
            { text: 'Checkbox', link: '/components/checkbox' },
            { text: 'Chip', link: '/components/chip' },
            { text: 'DetailsCard', link: '/components/details-card' },
            { text: 'DropDown', link: '/components/drop-down' },
            { text: 'Icon', link: '/components/icon' },
            { text: 'Image', link: '/components/image' },
            { text: 'Input', link: '/components/input' },
            { text: 'Page', link: '/components/page' },
            { text: 'Search', link: '/components/search' },
          ],
        },
      ],
      search: {
        provider: 'local',
      },
    },
  }),
);
