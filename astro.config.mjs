// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Die Live-Domain kommt aus der Umgebungsvariable SITE_URL (Vercel: Project Settings → Environment Variables).
// Fallback ist der Domain-Favorit aus docs/DOMAIN-UND-WETTBEWERB.md.
const site = process.env.SITE_URL || 'https://nachderspritze.de';

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/danke/'),
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
