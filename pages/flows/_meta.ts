const flowPageTheme = {
  sidebar: false,
  toc: false,
  breadcrumb: false,
  layout: 'full' as const,
  pagination: false,
};

export default {
  index: {
    title: 'Overview',
  },
  dashboard: {
    title: 'Dashboard',
    theme: flowPageTheme,
  },
  login: {
    title: 'Login',
    theme: flowPageTheme,
  },
};
