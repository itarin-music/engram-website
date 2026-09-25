// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Keep in sync with SITE.url in src/config/site.ts.
  site: 'https://engram.itarin.online',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  // Plain static output: every page is prerendered HTML. No server, no adapter.
  output: 'static',
  prefetch: false,
  devToolbar: { enabled: false },
  markdown: {
    shikiConfig: { theme: 'github-dark-dimmed' },
  },
});
