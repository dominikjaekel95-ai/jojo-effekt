import type { APIRoute } from 'astro';
import { studien, studienUpdated } from '../../data/studien';
import { sources } from '../../data/sources';

/** CSV-Export des Studien-Trackers (CC BY 4.0). UTF-8 mit BOM, Semikolon-getrennt für deutsches Excel. */
export const GET: APIRoute = () => {
  const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const head = ['Gruppe', 'Studie', 'Jahr', 'Wirkstoff', 'Design', 'n', 'Kernzahl', 'Bedeutung', 'Zitat', 'URL'];
  const rows = studien.map((s) => [
    s.gruppe, s.name, String(s.jahr), s.wirkstoff, s.design, s.n, s.kernzahl, s.bedeutung,
    sources[s.sourceId]?.full ?? '', sources[s.sourceId]?.url ?? '',
  ]);
  const body = [
    `# Nach der Spritze – Studien-Tracker, Stand ${studienUpdated}, CC BY 4.0, https://nachderspritze.de/wissen/studien/`,
    head.map(esc).join(';'),
    ...rows.map((r) => r.map(esc).join(';')),
  ].join('\r\n');
  return new Response('\uFEFF' + body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="nachderspritze-studien-tracker.csv"',
    },
  });
};
