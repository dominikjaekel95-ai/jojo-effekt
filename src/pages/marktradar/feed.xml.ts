import type { APIRoute } from 'astro';
import { radar, radarTypeLabel } from '../../data/markt';
import { site } from '../../data/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = () => {
  const items = radar.eintraege
    .map(
      (e) => `    <item>
      <title>${esc(`${radarTypeLabel[e.type]}: ${e.title}`)}</title>
      <link>${site.url}/marktradar/#${e.id}</link>
      <guid isPermaLink="false">${esc(e.id)}</guid>
      <pubDate>${new Date(e.date).toUTCString()}</pubDate>
      <description>${esc(`${e.summary} Quelle: ${e.source.name}, ${e.source.url}`)}</description>
    </item>`,
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${site.name}: Marktradar`)}</title>
    <link>${site.url}/marktradar/</link>
    <atom:link href="${site.url}/marktradar/feed.xml" rel="self" type="application/rss+xml" />
    <description>Zulassungen, Markt, Preise, Kassenregeln, Lieferbarkeit und Studien zu GLP-1-Medikamenten, mit Quelle und Datum.</description>
    <language>de-de</language>
    <lastBuildDate>${new Date(radar.stand).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
