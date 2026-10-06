/**
 * Ernährungsplan: Zuordnung der Antworten zur Plan-ID (ek01 bis ek56) und die Liste der Vorlieben.
 *
 * Bewusst als einfaches JavaScript-Modul, weil es drei Stellen gemeinsam nutzen:
 * src/data/ernaehrungsplan.ts (Generator, Planseiten, PDFs, Vorschau im Browser), api/ernaehrungsplan.js (Vercel-Funktion)
 * und scripts/ernaehrungsplan-pdf.mjs (indirekt über die gebauten Seiten).
 * Die ID ist absichtlich nichtssagend: In MailerLite steht nur „ek07“, nicht Gewichtsstufe oder Appetit.
 * Reihenfolge der Listen nie ändern, nur hinten anhängen, sonst zeigen bestehende Links in Mails auf den falschen Plan.
 *
 * Grundkombinationen: 4 Ernährungsformen × 2 Appetit-Stufen × 4 Gewichtsstufen × laktosefrei ja/nein, vegan nur
 * laktosefrei (vegan ist immer laktosefrei, kein Duplikat) = 3 × 2 × 4 × 2 + 2 × 4 = 56 Pläne.
 * Vorlieben stecken nicht in der ID, sondern im Parameter `?v=` der Planseite (MailerLite-Feld `vorlieben`).
 */

/** @typedef {'mischkost' | 'pescetarisch' | 'vegetarisch' | 'vegan'} Ernaehrung */
/** @typedef {'klein' | 'normal'} Appetit */
/** @typedef {'bis70' | '70bis85' | '85bis100' | 'ueber100'} Gewicht */
/** @typedef {'quark' | 'eier' | 'huettenkaese' | 'haehnchen' | 'pute' | 'rind' | 'lachs' | 'thunfisch' | 'garnelen' | 'linsen' | 'kichererbsen' | 'bohnen' | 'tofu' | 'tempeh' | 'haferflocken' | 'edamame'} Vorliebe */

/** @type {readonly Ernaehrung[]} */
export const ERNAEHRUNG = ['mischkost', 'pescetarisch', 'vegetarisch', 'vegan'];
/** @type {readonly Appetit[]} */
export const APPETIT = ['klein', 'normal'];
/** @type {readonly Gewicht[]} */
export const GEWICHT = ['bis70', '70bis85', '85bis100', 'ueber100'];

/** Rang der Ernährungsform: Ein Lebensmittel der Form d passt zu Form e, wenn RANG[d] >= RANG[e]. */
export const RANG = { mischkost: 0, pescetarisch: 1, vegetarisch: 2, vegan: 3 };

/**
 * Vorlieben in fester Reihenfolge (so stehen sie im Formular und im Parameter `?v=`).
 * `form` = kleinste Ernährungsform, für die sie angeboten wird; `laktose` = nicht in laktosefreien Plänen.
 * @type {readonly { key: Vorliebe, form: Ernaehrung, laktose?: boolean }[]}
 */
export const VORLIEBEN = [
  { key: 'quark', form: 'vegetarisch' },
  { key: 'eier', form: 'vegetarisch' },
  { key: 'huettenkaese', form: 'vegetarisch', laktose: true },
  { key: 'haehnchen', form: 'mischkost' },
  { key: 'pute', form: 'mischkost' },
  { key: 'rind', form: 'mischkost' },
  { key: 'lachs', form: 'pescetarisch' },
  { key: 'thunfisch', form: 'pescetarisch' },
  { key: 'garnelen', form: 'pescetarisch' },
  { key: 'linsen', form: 'vegan' },
  { key: 'kichererbsen', form: 'vegan' },
  { key: 'bohnen', form: 'vegan' },
  { key: 'tofu', form: 'vegan' },
  { key: 'tempeh', form: 'vegan' },
  { key: 'haferflocken', form: 'vegan' },
  { key: 'edamame', form: 'vegan' },
];

/**
 * Körpergewicht in kg → Gewichtsstufe. Außerhalb von 35 bis 250 kg: null.
 * @param {number | string} kg
 * @returns {Gewicht | null}
 */
export function gewichtsstufe(kg) {
  const n = Number(String(kg).replace(',', '.'));
  if (!(n >= 35 && n <= 250)) return null;
  if (n < 70) return 'bis70';
  if (n <= 85) return '70bis85';
  if (n <= 100) return '85bis100';
  return 'ueber100';
}

/**
 * "ja", "1", "true", true → true. Vegan ist immer laktosefrei.
 * @param {unknown} wert
 * @param {string} [ernaehrung]
 */
export function istLaktosefrei(wert, ernaehrung) {
  if (ernaehrung === 'vegan') return true;
  return wert === true || wert === 'ja' || wert === '1' || wert === 'true' || wert === 'on';
}

/**
 * Alle 56 Kombinationen in fester Reihenfolge.
 * @returns {{ id: string, ernaehrung: Ernaehrung, appetit: Appetit, gewicht: Gewicht, laktosefrei: boolean }[]}
 */
export function alleKombinationen() {
  const out = [];
  for (const ernaehrung of ERNAEHRUNG)
    for (const appetit of APPETIT)
      for (const gewicht of GEWICHT)
        for (const laktosefrei of ernaehrung === 'vegan' ? [true] : [false, true])
          out.push({ id: 'ek' + String(out.length + 1).padStart(2, '0'), ernaehrung, appetit, gewicht, laktosefrei });
  return out;
}
const KOMBIS = alleKombinationen();

/**
 * Antworten → Plan-ID, z. B. ('vegetarisch', 'klein', '70bis85', false) → 'ek…'. Ungültige Werte: null.
 * @param {string} ernaehrung
 * @param {string} appetit
 * @param {string} gewicht
 * @param {unknown} [laktosefrei]
 * @returns {string | null}
 */
export function planId(ernaehrung, appetit, gewicht, laktosefrei = false) {
  const lf = istLaktosefrei(laktosefrei, ernaehrung);
  const k = KOMBIS.find((x) => x.ernaehrung === ernaehrung && x.appetit === appetit && x.gewicht === gewicht && x.laktosefrei === lf);
  return k ? k.id : null;
}

/**
 * Plan-ID → Kombination oder null.
 * @param {string} id
 */
export function kombination(id) {
  return KOMBIS.find((x) => x.id === id) ?? null;
}

/**
 * Welche Vorlieben passen zu Ernährungsform und Laktose-Wahl?
 * @param {string} ernaehrung
 * @param {boolean} laktosefrei
 * @returns {Vorliebe[]}
 */
export function erlaubteVorlieben(ernaehrung, laktosefrei) {
  const r = RANG[/** @type {Ernaehrung} */ (ernaehrung)] ?? 0;
  return VORLIEBEN.filter((v) => RANG[v.form] >= r && !(laktosefrei && v.laktose)).map((v) => v.key);
}

/**
 * Vorlieben aus Text oder Liste lesen ("lachs,quark", ["lachs", "quark"]), auf die erlaubten beschränken,
 * Doppelte entfernen, in feste Reihenfolge bringen. Unbekanntes wird still ignoriert.
 * @param {unknown} eingabe
 * @param {string} ernaehrung
 * @param {boolean} laktosefrei
 * @returns {Vorliebe[]}
 */
export function leseVorlieben(eingabe, ernaehrung, laktosefrei) {
  const roh = Array.isArray(eingabe) ? eingabe.join(',') : String(eingabe ?? '');
  const gewaehlt = new Set(roh.toLowerCase().split(/[\s,;+]+/).filter(Boolean));
  return erlaubteVorlieben(ernaehrung, laktosefrei).filter((k) => gewaehlt.has(k));
}

/**
 * Pläne der ersten Fassung (ep01 bis ep18, sieben Tage, bis 05.10.2026) → passender neuer Plan.
 * Alte Reihenfolge: Mischkost, vegetarisch, vegan × klein, normal × unter 75, 75 bis 95, über 95 kg.
 * Die Gewichtsstufe mit dem nächstliegenden Proteinziel (80 → 75 g, 100 → 95 g, 120 → 125 g).
 * @type {Record<string, string>}
 */
export const ALTE_PLAENE = (() => {
  /** @type {Record<string, string>} */
  const out = {};
  const formen = /** @type {const} */ (['mischkost', 'vegetarisch', 'vegan']);
  const stufen = /** @type {const} */ (['bis70', '70bis85', 'ueber100']);
  let n = 1;
  for (const e of formen)
    for (const a of APPETIT)
      for (const g of stufen) out['ep' + String(n++).padStart(2, '0')] = /** @type {string} */ (planId(e, a, g, false));
  return out;
})();
