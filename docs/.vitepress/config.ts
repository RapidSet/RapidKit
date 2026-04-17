import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'mezmer';
const docsBase = process.env.GITHUB_ACTIONS ? `/${repoName}/` : '/';

export default withMermaid(
  defineConfig({
    title: 'Mezmer',
    description:
      'Reusable React UI component library focused on accessibility and contract-driven APIs.',
    base: docsBase,
    head: [['link', { rel: 'icon', href: '/mezmer-icon.svg' }]],
    cleanUrls: true,
    lastUpdated: true,
    themeConfig: {
      logo: '/mezmer-icon.svg',
      nav: [
        { text: 'Guide', link: '/THEMING' },
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
            { text: 'Theming', link: '/THEMING' },
            { text: 'Theme Configuration', link: '/THEME-CONFIGURATION' },
            { text: 'Architecture', link: '/ARCHITECTURE' },
          ],
        },
        {
          text: 'Components',
          items: [
            { text: 'Overview', link: '/components/' },
            { text: 'Input', link: '/components/input' },
            { text: 'Checkbox', link: '/components/checkbox' },
            { text: 'Icon', link: '/components/icon' },
            { text: 'Image', link: '/components/image' },
            { text: 'BaseTable', link: '/components/base-table' },
            { text: 'Chip', link: '/components/chip' },
          ],
        },
      ],
      search: {
        provider: 'local',
      },
    },
  }),
);
