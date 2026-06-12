// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://fourth-wall-gaming.github.io',
  integrations: [mdx()],
});