/**
 * Gemeinsame Bausteine der interaktiven Elemente in Artikeln (src/lib/interaktiv/).
 *
 * Ein Modul ist eine Funktion, die aus den data-Attributen des Platzhalters und dem Artikel-Kontext fertiges HTML im
 * Endzustand baut. Text und Zahlen stehen im HTML (Google, Screenreader, ohne JavaScript). Das Skript in client.ts
 * spielt beim Scrollen die Bewegung ab und schaltet Varianten um; ohne Skript oder bei reduzierter Bewegung bleibt der
 * Endzustand stehen.
 *
 * Umschalten ohne eigenen Code je Modul: Ein Element trägt pro Option einer Wahlgruppe g ein Attribut
 *   data-x-g-wert="Text"        → neuer Text (zählt, wenn das Element data-ia-zahl hat)
 *   data-m-g-wert="translate(…)" → neue CSS-Transformation
 *   data-o-g-wert="0.3"          → neue Deckkraft
 *   data-k-g-wert="an"           → Klassen dieser Option (die der anderen Optionen werden entfernt)
 */
import { sources } from '../../data/sources';

export type Attr = Record<string, string>;

export interface Ctx {
  /** Quellen-IDs des Artikels in Zitierreihenfolge (Frontmatter `sources`) */
  quellen: readonly string[];
  /** laufende Nummer des Moduls auf der Seite, für eindeutige IDs */
  nr: number;
  /** Artikel-ID, nur für Fehlermeldungen */
  artikel: string;
}

export const esc = (s: string | number) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Zahl deutsch formatiert, mit echtem Minuszeichen */
export const de = (n: number, dec = 0) =>
  n.toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec }).replace('-', '−');

/** Vorzeichen immer zeigen (+6,9 / −7,9) */
export const deVz = (n: number, dec = 1) => (n > 0 ? '+' : '') + de(n, dec);

/** Zählende Zahl: der Text ist der Endwert, client.ts zählt ihn beim Erscheinen hoch */
export const zahl = (wert: string, cls = '', extra = '') =>
  `<span class="ia-z${cls ? ` ${cls}` : ''}" data-ia-zahl${extra ? ` ${extra}` : ''}>${esc(wert)}</span>`;

/** Fußnote im Format der Artikel: <sup><a href="#fn-ID">n</a></sup>; n = Position in `sources` */
export function fn(ctx: Ctx, id: string): string {
  const i = ctx.quellen.indexOf(id);
  if (i < 0) {
    throw new Error(
      `Interaktives Element in "${ctx.artikel}" braucht die Quelle "${id}". Bitte im Frontmatter unter sources anhängen.`,
    );
  }
  if (!sources[id]) throw new Error(`Unbekannte Quelle "${id}" (src/data/sources.ts)`);
  return `<sup><a href="#fn-${id}">${i + 1}</a></sup>`;
}

/** Mehrere Fußnoten nebeneinander: 6, 7 statt 67 (jede Ziffer bleibt ein eigener Link) */
export function fns(ctx: Ctx, ids: readonly string[]): string {
  const eindeutig = Array.from(new Set(ids));
  return eindeutig.map((id) => fn(ctx, id)).join('').replace(/<\/a><\/sup><sup><a /g, '</a>,\u2009<a ');
}

/** Erste vorhandene Quelle aus einer Liste (z. B. Fachinformation Wegovy oder Ozempic für Semaglutid) */
export function erste(ctx: Ctx, ids: readonly string[]): string {
  const id = ctx.quellen.find((x) => ids.includes(x));
  if (!id) {
    throw new Error(`Interaktives Element in "${ctx.artikel}" braucht eine dieser Quellen: ${ids.join(', ')}.`);
  }
  return id;
}

export const hat = (ctx: Ctx, id: string) => ctx.quellen.includes(id);

/** Attribute für die Umschaltung: pro Option einer Gruppe ein data-Attribut */
export function proWahl(art: 'x' | 'm' | 'o' | 'k', gruppe: string, werte: Record<string, string | number>): string {
  return Object.entries(werte)
    .map(([w, v]) => ` data-${art}-${gruppe}-${w}="${esc(String(v))}"`)
    .join('');
}

export interface Option {
  wert: string;
  label: string;
}

/** Segmentierter Umschalter (eine Pille, mehrere Knöpfe). Ohne JavaScript bleibt die Startoption sichtbar. */
export function wahl(ctx: Ctx, gruppe: string, label: string, optionen: Option[], aktiv: string, klasse = ''): string {
  const id = `ia${ctx.nr}-${gruppe}`;
  return (
    `<div class="ia-wahl ${klasse}" role="group" aria-labelledby="${id}" data-ia-wahl="${gruppe}">` +
    `<span class="ia-wahl-l" id="${id}">${esc(label)}</span>` +
    `<span class="ia-wahl-k">` +
    optionen
      .map(
        (o) =>
          `<button type="button" value="${esc(o.wert)}" aria-pressed="${o.wert === aktiv}">${esc(o.label)}</button>`,
      )
      .join('') +
    `</span></div>`
  );
}

/** Schieberegler mit sichtbarem Wert */
export function regler(
  ctx: Ctx,
  name: string,
  label: string,
  o: { min: number; max: number; step: number; wert: number; einheit: string; dec?: number },
): string {
  const id = `ia${ctx.nr}-${name}`;
  return (
    `<div class="ia-regler">` +
    `<label for="${id}"><span>${esc(label)}</span><output class="ia-regler-w" for="${id}" data-ia-out="${name}">${de(o.wert, o.dec ?? 0)} ${esc(o.einheit)}</output></label>` +
    `<input id="${id}" type="range" min="${o.min}" max="${o.max}" step="${o.step}" value="${o.wert}" data-ia-regler="${name}" data-einheit="${esc(o.einheit)}" data-dec="${o.dec ?? 0}" />` +
    `</div>`
  );
}

export interface Rahmen {
  ctx: Ctx;
  name: string;
  titel: string;
  unter?: string;
  inhalt: string;
  fuss?: string;
  /** zusätzliche Attribute am <figure> (z. B. data-semaglutid="…" für die aktive Option) */
  attrs?: Attr;
  /** Kurzbeschreibung für Screenreader, wenn die Grafik selbst aria-hidden ist */
  klasse?: string;
}

/** Äußere Form jedes Moduls: Haarlinie oben, Titel, Bühne, Quelle */
export function rahmen(r: Rahmen): string {
  const tid = `ia${r.ctx.nr}-t`;
  const attrs = Object.entries(r.attrs ?? {})
    .map(([k, v]) => ` ${k}="${esc(v)}"`)
    .join('');
  return (
    `<figure class="ia ia-${r.name}${r.klasse ? ` ${r.klasse}` : ''}" data-ia="${r.name}" aria-labelledby="${tid}"${attrs}>` +
    `<div class="ia-kopf"><p class="ia-titel" id="${tid}">${r.titel}</p>${r.unter ? `<p class="ia-unter">${r.unter}</p>` : ''}</div>` +
    r.inhalt +
    (r.fuss ? `<figcaption class="ia-fuss">${r.fuss}</figcaption>` : '') +
    `</figure>`
  );
}

/** Zahlen aus data-Attributen lesen */
export const num = (a: Attr, k: string, d: number) => {
  const v = a[k];
  if (v === undefined || v === '') return d;
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : d;
};
export const liste = (a: Attr, k: string, d: string[]) =>
  a[k] ? a[k].split(',').map((s) => s.trim()).filter(Boolean) : d;
export const ja = (a: Attr, k: string, d = false) => (a[k] === undefined ? d : a[k] !== 'nein' && a[k] !== 'false');

/** Achsenbeschriftung in Prozent der Breite; am Rand bündig statt mittig, damit nichts übersteht */
export const tick = (links: number, text: string) =>
  `<span${links <= 0.5 ? ' class="t-a"' : links >= 99.5 ? ' class="t-e"' : ''} style="left:${links.toFixed(2)}%">${text}</span>`;

/** Rundet auf eine Nachkommastelle (SVG-Koordinaten) */
export const r1 = (n: number) => Math.round(n * 10) / 10;
