/**
 * Interaktive Elemente in Wissensartikeln.
 *
 * Im Markdown steht ein Platzhalter, z. B.
 *   <div data-interaktiv="absetzkurve" data-acht="ja"></div>
 * ArticlePage.astro schickt das gerenderte HTML durch mitInteraktiv(); der Platzhalter wird durch fertiges HTML/SVG im
 * Endzustand ersetzt (Text und Zahlen lesbar, ohne JavaScript vollständig). Die Bewegung beim Scrollen und das
 * Umschalten macht src/lib/interaktiv/client.ts, die Gestaltung src/components/interaktiv/Interaktiv.astro.
 *
 * Jede Zahl kommt aus src/lib/interaktiv/daten.ts und verweist per Fußnote auf eine Quelle des Artikels; fehlt die
 * Quelle im Frontmatter, bricht der Build mit einer klaren Meldung ab. Übersicht der Module: docs-Kommentar je Datei.
 */
import type { Attr, Ctx } from './basis';
import { absetzkurve } from './module/absetzkurve';
import { gabelung } from './module/gabelung';
import { wirkstoffspiegel } from './module/wirkstoffspiegel';
import { zeitachse } from './module/zeitachse';
import { zusammensetzung } from './module/zusammensetzung';
import { protein } from './module/protein';
import { slite } from './module/slite';
import { punktfeld } from './module/punktfeld';
import { vergleich, zulassung } from './module/vergleich';
import { streifen } from './module/streifen';
import { plan12 } from './module/plan12';
import { kreatin } from './module/kreatin';
import { zonen } from './module/zonen';
import { bedarf } from './module/bedarf';
import { teller } from './module/teller';
import { sortierung } from './module/sortierung';

export type Modul = (a: Attr, ctx: Ctx) => string;

export const module: Record<string, Modul> = {
  absetzkurve,
  gabelung,
  wirkstoffspiegel,
  zeitachse,
  zusammensetzung,
  protein,
  slite,
  punktfeld,
  vergleich,
  zulassung,
  streifen,
  plan12,
  kreatin,
  zonen,
  bedarf,
  teller,
  sortierung,
};

const PLATZHALTER = /<div\s+data-interaktiv="([a-z0-9-]+)"([^>]*)>\s*<\/div>/g;

/** true, wenn das HTML mindestens einen Platzhalter enthält */
export const hatInteraktiv = (html: string) => /<div\s+data-interaktiv="/.test(html);

/** Ersetzt alle Platzhalter im gerenderten Artikel-HTML. */
export function mitInteraktiv(html: string, quellen: readonly string[], artikel: string): string {
  let nr = 0;
  return html.replace(PLATZHALTER, (_all, name: string, rest: string) => {
    const fnc = module[name];
    if (!fnc) throw new Error(`Unbekanntes interaktives Element "${name}" in ${artikel}`);
    const a: Attr = {};
    for (const m of rest.matchAll(/data-([a-z0-9-]+)="([^"]*)"/g)) a[m[1]] = m[2].replace(/&amp;/g, '&');
    nr += 1;
    return fnc(a, { quellen, nr, artikel });
  });
}
