/**
 * /llms.txt: Übersicht für KI-Suchsysteme (GEO). Wird beim Build aus den Sammlungen erzeugt, damit sie nie veraltet.
 * Format nach llmstxt.org: Titel, Kurzbeschreibung, Abschnitte mit Links und Ein-Satz-Beschreibungen.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../data/site';
import { radar, radarLastmod } from '../data/markt';
import { byTerm } from '../lib/glossar';

export const GET: APIRoute = async () => {
  const artikel = (await getCollection('wissen', (a) => !a.data.draft)).sort((a, b) => a.data.order - b.data.order);
  const glossar = (await getCollection('glossar', (g) => !g.data.draft)).sort(byTerm);
  const u = (p: string) => `${site.url}${p}`;
  const lines = [
    `# ${site.name}`,
    '',
    `> Deutscher Wissensbereich zur Zeit nach der Abnehmspritze: was nach dem Absetzen von GLP-1-Medikamenten passiert (Jojo-Effekt, Muskelabbau) und was nachweislich hilft (Protein, Krafttraining, Kreatin, Ballaststoffe). Jede Zahl verweist auf die Originalstudie. Betreiber: ${site.owner.name}, ${site.owner.city}.`,
    '',
    'Regeln der Seite: keine Dosierungen, keine Absetz-Anleitungen, keine Bewertung von Medikamenten. Für das 12-Wochen-Set gelten nur die in der EU zugelassenen gesundheitsbezogenen Angaben; es ist ein Lebensmittel mit Programm, kein Medikament, und ersetzt die Spritze nicht. Ob und wie jemand ein Medikament absetzt, entscheidet die behandelnde Ärztin oder der Arzt.',
    '',
    '## Einstieg',
    `- [Startseite](${u('/')}): das 12-Wochen-Set für die Zeit nach der Abnehmspritze (Vorbestellung ohne Zahlung)`,
    `- [Wissen](${u('/wissen/')}): alle Artikel mit Quellen`,
    `- [Studien-Tracker](${u('/wissen/studien/')}): Studien zum Absetzen in einer Tabelle, CSV unter ${u('/wissen/studien.csv')}`,
    `- [Glossar](${u('/glossar/')}): ${glossar.length} Begriffe zur Zeit nach der Abnehmspritze, je ein Satz Definition mit Quelle`,
    `- [Marktradar](${u('/marktradar/')}): Zulassungen, Marktstarts, Preise als Größenordnung, Kassenregeln, Lieferbarkeit; Stand ${radarLastmod()}; Feed ${u('/marktradar/feed.xml')}`,
    `- [Über diese Seite](${u('/ueber/')}): Arbeitsweise, Quellenregeln, Kontakt`,
    '',
    '## Artikel',
    ...artikel.map((a) => `- [${a.data.title}](${u(`/wissen/${a.id}/`)}): ${a.data.description}`),
    '',
    '## Glossar',
    ...glossar.map((g) => `- [${g.data.term}](${u(`/glossar/${g.id}/`)}): ${g.data.short}`),
    '',
    '## Marktradar, neueste Einträge',
    ...radar.eintraege.slice(0, 6).map((e) => `- ${e.date}: [${e.title}](${u(`/marktradar/#${e.id}`)}) (Quelle: ${e.source.name})`),
    '',
    '## Optional',
    `- [Impressum](${u('/impressum/')})`,
    `- [Datenschutz](${u('/datenschutz/')})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
