import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://shuverinsurance.com',
  trailingSlash: 'never',
  integrations: [sitemap()]
});
