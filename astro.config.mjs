import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://shuverinsurance.com',
  trailingSlash: 'never',
  integrations: [sitemap({
    // Non-Jerusalem city URLs permanently redirect to the national service hub.
    filter: (page) => !/\/insurance-agent-(?!jerusalem(?:\/|$))/.test(new URL(page).pathname)
  })]
});
