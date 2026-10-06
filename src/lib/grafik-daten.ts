/**
 * Datentabelle unter jeder Studien-Grafik (GEO-Plan Abschnitt 2.3): Sprachmodelle und Suchmaschinen lesen Alt-Text und
 * Bildunterschrift, aber keine Pixel. Deshalb bekommt jede eingebundene Grafik eine aufklappbare Tabelle (<details>, ohne
 * JavaScript) mit den Datenpunkten und der Quelle. Die Zahlen stehen in src/data/grafiken-daten.json (identisch mit
 * scripts/grafiken.mjs); die Preisgrafik entsteht aus src/data/markt/preise.json.
 *
 * Artikel: ArticlePage.astro schickt das gerenderte Markdown durch mitGrafikDaten(). Seiten: <GrafikDaten id="…" />.
 */
import datenJson from '../data/grafiken-daten.json';
import { preise, fmtDate } from '../data/markt';

export interface GrafikTabelle {
  spalten: string[];
  zeilen: string[][];
  hinweis?: string;
  quelle: string;
}

const daten = datenJson as unknown as Record<string, GrafikTabelle | string>;

/** Tabellendaten einer Grafik; undefined, wenn es zu der ID keine Daten gibt */
export function grafikDaten(id: string): GrafikTabelle | undefined {
  if (id === 'preise-im-monat') {
    return {
      spalten: ['Präparat', 'Preis im Monat', 'Hinweis'],
      zeilen: preise.zeilen.map((z) => [z.praeparat, z.monat, z.hinweis]),
      hinweis: `Apothekenverkaufspreise für Selbstzahler als Größenordnung, gerundet auf 5 €, niedrigster Preis im Preisvergleich; Stand ${fmtDate(preise.stand)}.`,
      quelle: preise.quelle,
    };
  }
  const t = daten[id];
  return t && typeof t === 'object' ? t : undefined;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Die Tabelle als HTML (<details>), oder leerer String ohne Daten. Zugeklappt steht unter der Grafik nur die leise Zeile
 * „Daten als Tabelle“; aufgeklappt Tabelle, Hinweis, Quelle und mit `aktionen` der Link „Download und Quellen“
 * (GrafikEinbinden.astro setzt dort den Knopf „Grafik einbinden“ davor). Gestaltung: .grafik-daten in global.css.
 */
export function grafikDatenHtml(id: string, klasse = 'mt-2', aktionen = false): string {
  const t = grafikDaten(id);
  if (!t) return '';
  const kopf = t.spalten.map((s) => `<th>${esc(s)}</th>`).join('');
  const zeilen = t.zeilen.map((z) => `<tr>${z.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('');
  return (
    `<details class="grafik-daten ${klasse}" data-grafik="${esc(id)}">` +
    `<summary>Daten als Tabelle</summary>` +
    `<table><thead><tr>${kopf}</tr></thead><tbody>${zeilen}</tbody></table>` +
    (t.hinweis ? `<p class="gd-text">${esc(t.hinweis)}</p>` : '') +
    `<p class="gd-text">Quelle: ${esc(t.quelle)}</p>` +
    (aktionen ? `<p class="gd-aktionen"><a href="/grafiken/#${esc(id)}">Download und Quellen</a></p>` : '') +
    `</details>`
  );
}

/** Hängt in gerendertem Artikel-HTML unter jede <figure> mit einer Grafik aus /grafiken/ die Datentabelle an. */
export function mitGrafikDaten(html: string): string {
  return html.replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/g, (figure) => {
    if (/<details\b/.test(figure)) return figure;
    const m = figure.match(/\/grafiken\/([a-z0-9-]+)\.(?:png|svg)/);
    if (!m) return figure;
    const tabelle = grafikDatenHtml(m[1], 'mt-2', true);
    return tabelle ? figure.replace(/<\/figure>$/, `${tabelle}</figure>`) : figure;
  });
}
