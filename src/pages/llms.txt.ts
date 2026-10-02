/**
 * /llms.txt: Übersicht für KI-Suchsysteme (GEO). Wird beim Build aus den Sammlungen erzeugt, damit sie nie veraltet.
 * Format nach llmstxt.org: Titel, Kurzbeschreibung, Abschnitte mit Links und Ein-Satz-Beschreibungen.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../data/site';
import { radar, radarLastmod } from '../data/markt';
import { byTerm } from '../lib/glossar';
import { themen } from '../data/themen';
import { grafiken, hauptgrafiken } from '../data/grafiken';

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
    `- [Grafiken](${u('/grafiken/')}): ${hauptgrafiken.length} Studien-Grafiken (Absetzkurve, Zeitachse nach der letzten Dosis, Halbwertszeiten, Proteinbedarf, Preise) als SVG und PNG unter CC BY 4.0, Quelle im Bild, Alt-Text nennt jede Zahl`,
    `- [Werkzeuge](${u('/werkzeuge/')}): Zeitplan nach der letzten Dosis (Datum und Wirkstoff ergeben Meilensteine und Kalenderdatei), Proteinrechner (Tagesziel 1,2 bis 1,6 g pro kg, Menge pro Mahlzeit), Gewichtskorridor (drei Zonen mit Reaktionsschwelle nach Wing 2006) und Jahreskosten-Rechner unter ${u('/abnehmspritze-kosten/#rechner')}; rechnen nur im Browser`,
    `- [Ernährungsplan](${u('/ernaehrungsplan/')}): sieben Tage mit Mengen, Einkaufsliste und Austauschtabelle, ausgewählt aus 18 Plänen nach Ernährungsform, Appetit und Gewichtsbereich (rund 1,2 g Protein pro kg); kostenlos als PDF per Mail`,
    `- [Über diese Seite](${u('/ueber/')}): Arbeitsweise, Quellenregeln, Kontakt`,
    '',
    '## Themen',
    ...themen.map((t) => `- [${t.title}](${u(`/wissen/${t.slug}/`)}): ${t.description}`),
    '',
    '## Artikel',
    ...artikel.map((a) => `- [${a.data.title}](${u(`/wissen/${a.id}/`)}): ${a.data.description}`),
    '',
    '## Glossar',
    ...glossar.map((g) => `- [${g.data.term}](${u(`/glossar/${g.id}/`)}): ${g.data.short}`),
    '',
    '## Grafiken (CC BY 4.0, Quelle im Bild, frei verwendbar mit Quellenangabe)',
    ...grafiken.map((g) => `- [${g.title}](${u(`/grafiken/#${g.id}`)}): ${g.alt} Datei: ${u(`/grafiken/${g.id}.png`)}`),
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
