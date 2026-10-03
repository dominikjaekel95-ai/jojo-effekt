/**
 * Ernährungsplan: Zuordnung der drei Antworten zur Plan-ID (ep01 bis ep18).
 *
 * Bewusst als einfaches JavaScript-Modul, weil es zwei Stellen gemeinsam nutzen:
 * src/data/ernaehrungsplan.ts (Konfigurator, Planseiten, PDFs) und api/ernaehrungsplan.js (Vercel-Funktion).
 * Die ID ist absichtlich nichtssagend: In MailerLite steht nur „ep07“, nicht die Gewichtsstufe.
 * Reihenfolge der Listen nie ändern, sonst zeigen bestehende Links in Mails auf den falschen Plan.
 */

/** @typedef {'mischkost' | 'vegetarisch' | 'vegan'} Ernaehrung */
/** @typedef {'klein' | 'normal'} Appetit */
/** @typedef {'unter75' | '75bis95' | 'ueber95'} Gewicht */

/** @type {readonly Ernaehrung[]} */
export const ERNAEHRUNG = ['mischkost', 'vegetarisch', 'vegan'];
/** @type {readonly Appetit[]} */
export const APPETIT = ['klein', 'normal'];
/** @type {readonly Gewicht[]} */
export const GEWICHT = ['unter75', '75bis95', 'ueber95'];

/**
 * Körpergewicht in kg → Gewichtsstufe. Außerhalb von 35 bis 250 kg: null.
 * @param {number | string} kg
 * @returns {Gewicht | null}
 */
export function gewichtsstufe(kg) {
  const n = Number(String(kg).replace(',', '.'));
  if (!(n >= 35 && n <= 250)) return null;
  if (n < 75) return 'unter75';
  if (n <= 95) return '75bis95';
  return 'ueber95';
}

/**
 * Antworten → Plan-ID, z. B. ('vegetarisch', 'klein', '75bis95') → 'ep08'. Ungültige Werte: null.
 * @param {string} ernaehrung
 * @param {string} appetit
 * @param {string} gewicht
 * @returns {string | null}
 */
export function planId(ernaehrung, appetit, gewicht) {
  const e = ERNAEHRUNG.indexOf(/** @type {Ernaehrung} */ (ernaehrung));
  const a = APPETIT.indexOf(/** @type {Appetit} */ (appetit));
  const g = GEWICHT.indexOf(/** @type {Gewicht} */ (gewicht));
  if (e < 0 || a < 0 || g < 0) return null;
  return 'ep' + String(e * 6 + a * 3 + g + 1).padStart(2, '0');
}

/**
 * Alle 18 Kombinationen in fester Reihenfolge.
 * @returns {{ id: string, ernaehrung: Ernaehrung, appetit: Appetit, gewicht: Gewicht }[]}
 */
export function alleKombinationen() {
  const out = [];
  for (const ernaehrung of ERNAEHRUNG)
    for (const appetit of APPETIT)
      for (const gewicht of GEWICHT) out.push({ id: /** @type {string} */ (planId(ernaehrung, appetit, gewicht)), ernaehrung, appetit, gewicht });
  return out;
}
