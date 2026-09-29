// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

// Die Live-Domain kommt aus der Umgebungsvariable SITE_URL (Vercel: Project Settings → Environment Variables).
// Haupt-Host ist die Apex-Domain ohne www; www muss beim Hoster auf die Apex-Domain weiterleiten.
const site = process.env.SITE_URL || 'https://nachderspritze.de';

/** lastmod je URL aus den Artikel-Frontmatters und dem Studien-Tracker (astro:content ist hier nicht verfügbar). */
function buildLastmod() {
  const map = new Map();
  const dir = path.resolve('src/content/wissen');
  let latest = '2026-09-30';
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    const txt = fs.readFileSync(path.join(dir, f), 'utf8');
    if (/^draft:\s*true/m.test(txt)) continue;
    const pub = (txt.match(/^pubDate:\s*(\S+)/m) || [])[1];
    const upd = (txt.match(/^updatedDate:\s*(\S+)/m) || [])[1];
    const d = upd || pub;
    if (!d) continue;
    map.set(`/wissen/${f.replace(/\.md$/, '')}/`, d);
    if (d > latest) latest = d;
  }
  const studien = fs.readFileSync(path.resolve('src/data/studien.ts'), 'utf8');
  const su = (studien.match(/studienUpdated\s*=\s*'([^']+)'/) || [])[1];
  if (su) { map.set('/wissen/studien/', su); if (su > latest) latest = su; }
  map.set('/', latest);
  map.set('/wissen/', latest);
  map.set('/ueber/', latest);
  return map;
}
const lastmod = buildLastmod();

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !/\/(danke|impressum|datenschutz)\/$/.test(page),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        const p = new URL(item.url).pathname;
        const d = lastmod.get(p);
        if (d) item.lastmod = new Date(d).toISOString();
        if (p === '/') item.priority = 1.0;
        if (p.startsWith('/wissen/')) item.priority = 0.8;
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
