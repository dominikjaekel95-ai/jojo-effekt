/**
 * /sitemap-grafiken.xml: Bild-Sitemap für die Studien-Grafiken (Google Bildersuche). Jede Seite, die eine Grafik einbindet,
 * steht mit den PNG-Adressen ihrer Grafiken darin, dazu /grafiken/ mit allen. Quelle ist das Register src/data/grafiken.ts
 * (Feld `used`); eingetragen in public/robots.txt, zusätzlich in der Search Console einreichen.
 */
import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { grafiken } from '../data/grafiken';

export const GET: APIRoute = () => {
  const seiten = new Map<string, Set<string>>();
  const add = (path: string, id: string) => {
    const p = path.replace(/#.*$/, '');
    if (!seiten.has(p)) seiten.set(p, new Set());
    seiten.get(p)!.add(`${site.url}/grafiken/${id}.png`);
  };
  for (const g of grafiken) {
    add('/grafiken/', g.id);
    for (const u of g.used) add(u.href, g.id);
  }
  const esc = (s: string) => s.replace(/&/g, '&amp;');
  const body = [...seiten.entries()]
    .map(
      ([p, imgs]) =>
        `  <url>\n    <loc>${esc(site.url + p)}</loc>\n${[...imgs].map((i) => `    <image:image><image:loc>${esc(i)}</image:loc></image:image>`).join('\n')}\n  </url>`,
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${body}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
