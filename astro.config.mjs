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
  // Glossar: ein Eintrag pro Datei
  const gdir = path.resolve('src/content/glossar');
  let glatest = '';
  if (fs.existsSync(gdir)) {
    for (const f of fs.readdirSync(gdir)) {
      if (!f.endsWith('.md')) continue;
      const txt = fs.readFileSync(path.join(gdir, f), 'utf8');
      if (/^draft:\s*true/m.test(txt)) continue;
      const d = (txt.match(/^updatedDate:\s*(\S+)/m) || [])[1] || (txt.match(/^pubDate:\s*(\S+)/m) || [])[1];
      if (!d) continue;
      map.set(`/glossar/${f.replace(/\.md$/, '')}/`, d);
      if (d > glatest) glatest = d;
    }
  }
  if (glatest) { map.set('/glossar/', glatest); if (glatest > latest) latest = glatest; }
  // Marktradar: jüngstes Datum aus den Einträgen
  const radarFile = path.resolve('src/data/markt/radar.json');
  if (fs.existsSync(radarFile)) {
    /** @type {{ stand?: string; eintraege?: { date: string }[] }} */
    const radar = JSON.parse(fs.readFileSync(radarFile, 'utf8'));
    const rl = [radar.stand, ...(radar.eintraege || []).map((e) => e.date)].filter(Boolean).sort().at(-1);
    if (rl) { map.set('/marktradar/', rl); if (rl > latest) latest = rl; }
  }
  map.set('/', latest);
  map.set('/wissen/', latest);
  map.set('/ueber/', latest);
  return map;
}
const lastmod = buildLastmod();
// /erfahrungen/ kommt in die Sitemap, sobald das Erfahrungsformular live ist (site.experienceForm.live in src/data/site.ts)
const experienceLive = /experienceForm:\s*\{[^}]*live:\s*true/.test(fs.readFileSync(path.resolve('src/data/site.ts'), 'utf8'));
if (experienceLive) lastmod.set('/erfahrungen/', lastmod.get('/') ?? '2026-09-30');

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !/\/(danke|impressum|datenschutz)\/$/.test(page) && (experienceLive || !/\/erfahrungen\/$/.test(page)) && !/\.(xml|txt|csv)$/.test(page),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        const p = new URL(item.url).pathname;
        const d = lastmod.get(p);
        if (d) item.lastmod = new Date(d).toISOString();
        if (p === '/') item.priority = 1.0;
        if (p.startsWith('/wissen/') || p === '/marktradar/') item.priority = 0.8;
        if (p.startsWith('/glossar/')) item.priority = 0.6;
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
