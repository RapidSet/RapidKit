import './env.d.ts';
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { h } from 'vue';
import ThemePlayground from './components/ThemePlayground.vue';
import ComponentExampleTabs from './components/ComponentExampleTabs.vue';
import DocsThemeSelector from './components/DocsThemeSelector.vue';
import './custom.css';

const theme: Theme = {
  ...DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(DocsThemeSelector),
      'nav-screen-content-after': () => h(DocsThemeSelector, { mobile: true }),
    }),
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx);
    ctx.app.component('ThemePlayground', ThemePlayground);
    ctx.app.component('ComponentExampleTabs', ComponentExampleTabs);
  },
};

export default theme;
