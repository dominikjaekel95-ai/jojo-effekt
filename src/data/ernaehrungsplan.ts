/**
 * Ernährungsplan nach der Abnehmspritze: der Generator für 14 Tage.
 *
 * Deterministisch: Gleiche Antworten ergeben immer denselben Plan, im Build (Planseiten, PDFs) wie im Browser
 * (Vorschau auf /ernaehrungsplan/, Vorlieben auf der Planseite). Deshalb ohne Node-APIs und ohne Zufall.
 * Daten: ernaehrungsplan-rezepte.ts (Lebensmittel, Gerichte), Zuordnung der IDs: ernaehrungsplan-id.mjs.
 *
 * Rechenweg (steht so auch im Plan):
 *  1. Proteinziel = 1,2 g × Referenzgewicht der Gewichtsstufe (Quelle `leidy2015`), auf 5 g gerundet.
 *  2. Jeder Tag bekommt drei Hauptmahlzeiten und je nach Appetit Zwischenmahlzeiten mit fester Portion.
 *  3. Ein Tagesfaktor skaliert die Grundrezepte von Frühstück, Mittag und Abend, bis der Tag im Zielbereich liegt
 *     (Appetit klein: 0,4 bis 1,0, meist um 0,65, also kleine Teller und mehr Zwischenmahlzeiten; normal: 0,7 bis 1,5).
 *  4. Protein je Zutat = Menge × Proteingehalt je 100 g aus dem Bundeslebensmittelschlüssel (Quelle `bls`).
 * Keine Kalorienvorgaben: Der Plan steuert Protein, Ballaststoffe und Portionsgröße, nicht Energie.
 * Zielbereich je Tag: höchstens 5 g unter und höchstens 12 g über dem Ziel. Fällt ein Tag heraus (kommt nur mit
 * bestimmten Vorlieben vor), wählt der Generator für diesen Tag Zwischenmahlzeiten und Hauptgerichte neu (Rückfall in planeTage).
 * `pruefePlaene()` läuft im Build der Planseiten und bricht ab, wenn ein Tag aus dem Zielbereich fällt: geprüft werden
 * alle 56 Grundpläne, jede Vorliebe einzeln, alle Paare, alle Dreier und alle Vorlieben zusammen (rund 18.600 Pläne, etwa 3 s).
 */
import { alleKombinationen, kombination, erlaubteVorlieben, leseVorlieben, planId, RANG, VORLIEBEN } from './ernaehrungsplan-id.mjs';
import type { ERNAEHRUNG, APPETIT, GEWICHT } from './ernaehrungsplan-id.mjs';
import { zutaten, gerichte, type Gericht, type Zutat, type ZutatKey, type Einheit, type Slot, type Abteilung } from './ernaehrungsplan-rezepte.ts';

export type Ernaehrung = (typeof ERNAEHRUNG)[number];
export type Appetit = (typeof APPETIT)[number];
export type Gewicht = (typeof GEWICHT)[number];
export type Vorliebe = (typeof VORLIEBEN)[number]['key'];
export { planId, kombination, erlaubteVorlieben, leseVorlieben };
export type { Slot, ZutatKey };

export interface Antworten {
  ernaehrung: Ernaehrung;
  appetit: Appetit;
  gewicht: Gewicht;
  laktosefrei: boolean;
  vorlieben?: readonly string[];
}

export const ernaehrungOptionen: { value: Ernaehrung; label: string; text: string }[] = [
  { value: 'mischkost', label: 'Mischkost', text: 'Fleisch an drei, Fisch an zwei Tagen pro Woche als Hauptgericht' },
  { value: 'pescetarisch', label: 'Pescetarisch', text: 'Fisch statt Fleisch, dazu Milch und Eier' },
  { value: 'vegetarisch', label: 'Vegetarisch', text: 'mit Milchprodukten und Eiern' },
  { value: 'vegan', label: 'Vegan', text: 'rein pflanzlich' },
];
export const appetitOptionen: { value: Appetit; label: string; text: string }[] = [
  { value: 'klein', label: 'Noch klein', text: 'nach wenigen Bissen satt, große Portionen gehen nicht' },
  { value: 'normal', label: 'Wieder normal', text: 'der Appetit ist weitgehend zurück' },
];
export const gewichtLabel: Record<Gewicht, string> = { bis70: 'unter 70 kg', '70bis85': '70 bis 85 kg', '85bis100': '85 bis 100 kg', ueber100: 'über 100 kg' };
/** Referenzgewicht je Stufe in kg: etwa die Mitte der Stufe; für „über 100 kg“ 105 kg. */
export const referenzKg: Record<Gewicht, number> = { bis70: 62, '70bis85': 78, '85bis100': 92, ueber100: 105 };
/** Proteinziel in g pro Tag: 1,2 g pro kg Referenzgewicht, auf 5 g gerundet (75, 95, 110, 125 g). */
export const proteinZiel = Object.fromEntries(Object.entries(referenzKg).map(([g, kg]) => [g, Math.round((1.2 * kg) / 5) * 5])) as Record<Gewicht, number>;
export const G_PRO_KG = 1.2;

/** Vorlieben mit Anzeige-Text und Proteingehalt (für das Formular). */
export const vorliebenText: Record<Vorliebe, { label: string; hinweis: string }> = {
  quark: { label: 'Quark und Skyr', hinweis: '11 bis 12 g Protein je 100 g' },
  eier: { label: 'Eier', hinweis: '7 g Protein je Ei' },
  huettenkaese: { label: 'Hüttenkäse', hinweis: '12 g je 100 g' },
  haehnchen: { label: 'Hähnchen', hinweis: '23 g je 100 g' },
  pute: { label: 'Pute', hinweis: '24 g je 100 g' },
  rind: { label: 'Rinderhack', hinweis: '20 g je 100 g' },
  lachs: { label: 'Lachs', hinweis: '20 g je 100 g' },
  thunfisch: { label: 'Thunfisch', hinweis: '25 g je 100 g' },
  garnelen: { label: 'Garnelen', hinweis: '18 g je 100 g' },
  linsen: { label: 'Linsen', hinweis: '9 g je 100 g, gekocht' },
  kichererbsen: { label: 'Kichererbsen', hinweis: '8,5 g je 100 g, gekocht' },
  bohnen: { label: 'Bohnen', hinweis: '7 bis 8,5 g je 100 g, gekocht' },
  tofu: { label: 'Tofu', hinweis: '13 bis 16 g je 100 g' },
  tempeh: { label: 'Tempeh', hinweis: '19 g je 100 g' },
  haferflocken: { label: 'Haferflocken', hinweis: '13,5 g je 100 g' },
  edamame: { label: 'Edamame', hinweis: '11 g je 100 g' },
};

/** Anzeige-Name einer Vorliebe; im laktosefreien Plan ohne Skyr. */
export const vorliebeLabel = (key: Vorliebe, laktosefrei: boolean) => (key === 'quark' && laktosefrei ? 'Quark' : vorliebenText[key].label);

export const TAGE = 14;
const KORRIDOR = { unten: 5, oben: 12 };
const FAKTOR: Record<Appetit, { min: number; max: number; mitte: number; snacks: number[] }> = {
  klein: { min: 0.4, max: 1, mitte: 0.65, snacks: [3, 2, 4] },
  normal: { min: 0.7, max: 1.5, mitte: 1.05, snacks: [1, 2, 0] },
};
const TITEL: Record<Exclude<Slot, 'snack'>, string> = { fruehstueck: 'Frühstück', mittag: 'Mittag', abend: 'Abend' };
const SNACK_TITEL: Record<Appetit, string[]> = {
  klein: ['Vormittag', 'Nachmittag', 'Später am Abend', 'Vor dem Abendessen'],
  normal: ['Nachmittag', 'Später am Abend'],
};
/** Hauptgerichte je Woche (Mo bis So, [Mittag, Abend]): F Fleisch, S Fisch, V ohne Fleisch und Fisch,
 *  f/s nur mit passender Vorliebe Fleisch bzw. Fisch, sonst V. */
const MUSTER: Partial<Record<Ernaehrung, [string, string][]>> = {
  mischkost: [['F', 'V'], ['V', 'S'], ['F', 'V'], ['V', 's'], ['S', 'V'], ['V', 'F'], ['f', 'V']],
  pescetarisch: [['S', 'V'], ['V', 'S'], ['V', 'V'], ['S', 'V'], ['V', 's'], ['V', 'S'], ['V', 'V']],
};

// ---------------------------------------------------------------------------------------------------------------
// Gerichte vorbereiten

type Art = 'fleisch' | 'fisch' | 'veg';
interface Info { g: Gericht; idx: number; form: Ernaehrung; laktose: 'enthalten' | 'ersetzbar' | null; art: Art; familie: string; tags: string[]; basis: number }

const z = (k: ZutatKey): Zutat => zutaten[k];
const proteinVon = (k: ZutatKey, menge: number) => (z(k).einheit === 'Stück' ? menge * z(k).protein : (menge / 100) * z(k).protein);

const INFOS: Info[] = gerichte.map((g, idx) => {
  const teile = g.zutaten.map(([k, m]) => ({ k, p: proteinVon(k, m) }));
  const basis = teile.reduce((s, t) => s + t.p, 0);
  const form = g.zutaten.reduce<Ernaehrung>((f, [k]) => (RANG[z(k).form as Ernaehrung] < RANG[f] ? (z(k).form as Ernaehrung) : f), 'vegan');
  const laktosen = g.zutaten.map(([k]) => z(k).laktose);
  const laktose = laktosen.includes('enthalten') ? 'enthalten' : laktosen.includes('ersetzbar') ? 'ersetzbar' : null;
  const art: Art = g.zutaten.some(([k]) => z(k).form === 'mischkost') ? 'fleisch' : g.zutaten.some(([k]) => z(k).form === 'pescetarisch') ? 'fisch' : 'veg';
  const tags = [...new Set(teile.filter((t) => z(t.k).vorliebe && t.p >= 0.2 * basis).map((t) => z(t.k).vorliebe as string))];
  const haupt = teile.reduce((a, b) => (b.p > a.p ? b : a));
  return { g, idx, form, laktose, art, familie: z(haupt.k).vorliebe ?? haupt.k, tags, basis };
});
/** Familien und Gruppen als Nummern je Gericht (Index = Info.idx); Gerichte derselben Gruppe nie am selben Tag. */
const FAMILIEN = [...new Set(INFOS.map((i) => i.familie))];
const GRUPPEN = [...new Set(INFOS.flatMap((i) => (i.g.gruppe ? [i.g.gruppe] : [])))];
const FAM = INFOS.map((i) => FAMILIEN.indexOf(i.familie));
const GR = INFOS.map((i) => (i.g.gruppe ? GRUPPEN.indexOf(i.g.gruppe) : -1));
/** Zutaten je Gericht mit Einheit und Protein, für proteinBei(). */
const TEILE = INFOS.map((i) => i.g.zutaten.map(([k, m]) => ({ m, einheit: z(k).einheit, protein: z(k).protein })));

const passt = (i: Info, e: Ernaehrung, lf: boolean) => RANG[i.form] >= RANG[e] && !(lf && i.laktose === 'enthalten') && !(i.g.ersatz && !lf);

/** Anzahl der Gerichte im Pool (für Texte wie „aus 76 Gerichten“). */
export const anzahlGerichte = gerichte.length;
export const anzahlGerichteFuer = (e: Ernaehrung, lf: boolean) => INFOS.filter((i) => passt(i, e, lf)).length;

// ---------------------------------------------------------------------------------------------------------------
// Typen des Plans

export interface Position { key: ZutatKey; menge: number; einheit: Einheit; text: string; protein: number }
export interface GeplanteMahlzeit { id: string; slot: Slot; titel: string; name: string; positionen: Position[]; dazu?: string; protein: number; bevorzugt: boolean }
export interface Tag { nr: number; mahlzeiten: GeplanteMahlzeit[]; protein: number; faktor: number }
export interface EinkaufsGruppe { name: string; posten: string[] }
export interface Woche { nr: number; tage: Tag[]; einkauf: EinkaufsGruppe[]; dazu: string[] }
export interface TauschZeile { name: string; menge: string; je100: string; tierisch: boolean }
export interface KarteImPlan { mahlzeit: GeplanteMahlzeit; anzahl: number; tage: number[] }
export interface Plan {
  id: string;
  ernaehrung: Ernaehrung;
  appetit: Appetit;
  gewicht: Gewicht;
  laktosefrei: boolean;
  vorlieben: Vorliebe[];
  ziel: number;
  referenzKg: number;
  tage: Tag[];
  wochen: Woche[];
  tausch: TauschZeile[];
  karten: KarteImPlan[];
  grundlage: { name: string; wert: string; quelle: 'bls' | 'hersteller' }[];
  faktor: { min: number; max: number };
}

// ---------------------------------------------------------------------------------------------------------------
// Hilfen

const ZAHLFORMAT = new Map<number, Intl.NumberFormat>();
/** Zahl deutsch formatiert, wie toLocaleString('de-DE'), aber mit wiederverwendetem Format (schneller in der Prüfung). */
export const zahl = (n: number, stellen = 1) => {
  let f = ZAHLFORMAT.get(stellen);
  if (!f) ZAHLFORMAT.set(stellen, (f = new Intl.NumberFormat('de-DE', { maximumFractionDigits: stellen })));
  return f.format(n);
};

/** Name der Zutat, im laktosefreien Plan mit Zusatz. */
export function zutatName(k: ZutatKey, lf: boolean, mehrzahl = false) {
  const x = z(k);
  const name = mehrzahl && x.plural ? x.plural : x.name;
  return lf && x.laktose === 'ersetzbar' ? `${name}, laktosefrei` : name;
}

function runde(menge: number, einheit: Einheit) {
  if (einheit === 'Stück') return Math.max(1, Math.round(menge));
  if (menge < 50) return Math.max(5, Math.round(menge / 5) * 5);
  return Math.round(menge / 10) * 10;
}

function position(k: ZutatKey, menge: number, lf: boolean): Position {
  const x = z(k);
  const text = x.einheit === 'Stück' ? `${menge}\u00a0${zutatName(k, lf, menge !== 1)}` : `${menge}\u00a0${x.einheit} ${zutatName(k, lf)}`;
  return { key: k, menge, einheit: x.einheit, text, protein: proteinVon(k, menge) };
}

/** Protein eines Gerichts bei einem Tagesfaktor, gerechnet wie in plane() (gerundete Mengen), ohne Texte. */
function proteinBei(i: Info, faktor: number) {
  let s = 0;
  for (const t of TEILE[i.idx]) {
    const menge = faktor === 1 ? t.m : runde(t.m * faktor, t.einheit);
    s += t.einheit === 'Stück' ? menge * t.protein : (menge / 100) * t.protein;
  }
  return Math.round(s);
}

function plane(i: Info, slot: Slot, faktor: number, titel: string, lf: boolean, vorlieben: Set<string>): GeplanteMahlzeit {
  const positionen = i.g.zutaten.map(([k, m]) => position(k, faktor === 1 ? m : runde(m * faktor, z(k).einheit), lf));
  return {
    id: i.g.id,
    slot,
    titel,
    name: i.g.name,
    positionen,
    dazu: i.g.dazu,
    protein: Math.round(positionen.reduce((s, p) => s + p.protein, 0)),
    bevorzugt: i.tags.some((t) => vorlieben.has(t)),
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Generator

/** Die 14 Tage eines Plans (ohne Einkaufslisten, Karten und Tabellen): Kern von erstellePlan und der Prüfung. */
function planeTage(a: Antworten, mitTexten = true) {
  const lf = a.ernaehrung === 'vegan' ? true : !!a.laktosefrei;
  const vorlieben = leseVorlieben(a.vorlieben ?? [], a.ernaehrung, lf) as Vorliebe[];
  const vSet = new Set<string>(vorlieben);
  const id = planId(a.ernaehrung, a.appetit, a.gewicht, lf);
  if (!id) throw new Error(`Ernährungsplan: ungültige Antworten ${JSON.stringify(a)}`);
  const ziel = proteinZiel[a.gewicht];
  const pool = INFOS.filter((i) => passt(i, a.ernaehrung, lf));
  const fr = pool.filter((i) => i.g.slots.includes('fruehstueck'));
  const sn = pool.filter((i) => i.g.slots.includes('snack'));
  const hauptCache = new Map<string, Info[]>();
  const hauptFuer = (slot: 'mittag' | 'abend', art: Art | null) => {
    const key = `${slot}:${art}`;
    let liste = hauptCache.get(key);
    if (!liste) hauptCache.set(key, (liste = pool.filter((i) => i.g.slots.includes(slot) && (art === null || i.art === art))));
    return liste;
  };
  const hatFleisch = vorlieben.some((v) => ['haehnchen', 'pute', 'rind'].includes(v));
  const hatFisch = vorlieben.some((v) => ['lachs', 'thunfisch', 'garnelen'].includes(v));
  const artFuer = (code: string): Art | null => {
    if (code === 'F' || (code === 'f' && hatFleisch)) return 'fleisch';
    if (code === 'S' || (code === 's' && hatFisch)) return 'fisch';
    return MUSTER[a.ernaehrung] ? 'veg' : null;
  };

  // Zustand als Listen je Gericht (Index = Info.idx) statt Maps: Die Prüfung rechnet rund 18.600 Pläne.
  const benutzt: number[] = INFOS.map(() => 0);
  const zuletzt: number[] = INFOS.map(() => -100);
  const bevorzugt: boolean[] = INFOS.map((i) => i.tags.some((t) => vSet.has(t)));
  // Markierungen für waehle(): gestern (je Gericht, je Familie) und heute (wird je Aufruf gesetzt und wieder gelöscht).
  const gestern: number[] = INFOS.map(() => 0);
  const gesternFam: number[] = FAMILIEN.map(() => 0);
  const heuteMark: number[] = INFOS.map(() => 0);
  const heuteFam: number[] = FAMILIEN.map(() => 0);
  const heuteGr: number[] = GRUPPEN.map(() => 0);
  const { min, max, mitte, snacks: snackFolge } = FAKTOR[a.appetit];
  // Bei kleinem Appetit nur Zwischenmahlzeiten, die nennenswert Protein liefern.
  const snPool = a.appetit === 'klein' ? sn.filter((i) => i.basis >= 8) : sn;
  /** Wie weit eine Tagessumme außerhalb des Korridors liegt (0 = im Korridor). */
  const abstandVon = (summe: number) => (summe < ziel - KORRIDOR.unten ? ziel - KORRIDOR.unten - summe : summe > ziel + KORRIDOR.oben ? summe - ziel - KORRIDOR.oben : 0);

  /** Was an einem Tag schon gewählt ist (Gericht-Indizes, höchstens sieben); waehle() markiert sie für die Dauer des Aufrufs. */
  type Heute = number[];
  const nimm = (h: Heute, i: Info) => {
    h.push(i.idx);
    return i;
  };

  function markiere(h: Heute, an: number) {
    for (const y of h) {
      heuteMark[y] += an;
      heuteFam[FAM[y]] += an;
      if (GR[y] >= 0) heuteGr[GR[y]] += an;
    }
  }

  function waehle(kandidaten: Info[], d: number, slotNr: number, h: Heute, extra?: (i: Info) => number): Info {
    let best: Info | null = null;
    let bestWert = Infinity;
    markiere(h, 1);
    for (const durchgang of [0, 1]) {
      for (const i of kandidaten) {
        const x = i.idx;
        if (heuteMark[x] || (durchgang === 0 && gestern[x]) || (GR[x] >= 0 && heuteGr[GR[x]])) continue;
        let w = benutzt[x] * 4;
        if (d - zuletzt[x] <= 3) w += 2;
        w += heuteFam[FAM[x]] * 4;
        if (gesternFam[FAM[x]]) w += 1;
        if (bevorzugt[x]) w -= 6;
        if (extra) w += extra(i);
        w += ((x * 7 + d * 5 + slotNr * 3) % 17) / 100;
        if (w < bestWert) {
          bestWert = w;
          best = i;
        }
      }
      if (best) break;
    }
    markiere(h, -1);
    return best ?? kandidaten[0];
  }

  interface Variante { haupt: Info[]; ids: Info[]; summe: number; faktor: number; abstand: number; wert: number }

  /** Frühstück, Mittag, Abend. `richtung` +1 bevorzugt proteinreichere, −1 proteinärmere Gerichte (nur im Rückfall). */
  function hauptmahlzeiten(d: number, richtung: number): { haupt: Info[]; heute: Heute } {
    const heute: Heute = [];
    const extra = richtung ? (i: Info) => (-richtung * i.basis) / 2 : undefined;
    const muster = MUSTER[a.ernaehrung]?.[d % 7] ?? ['V', 'V'];
    const f = nimm(heute, waehle(fr, d, 0, heute, extra));
    const mKand = hauptFuer('mittag', artFuer(muster[0]));
    const m = nimm(heute, waehle(mKand.length ? mKand : hauptFuer('mittag', null), d, 1, heute, extra));
    const aKand = hauptFuer('abend', artFuer(muster[1]));
    const ab = nimm(heute, waehle(aKand.length ? aKand : hauptFuer('abend', null), d, 2, heute, extra));
    return { haupt: [f, m, ab], heute };
  }

  /** Zwischenmahlzeiten: Anzahl und Auswahl so, dass der Tagesfaktor nahe der Mitte des erlaubten Bereichs liegt
   *  (kleiner Appetit: kleine Teller plus mehrere proteinreiche Zwischenmahlzeiten). `gezielt` wählt streng nach
   *  der fehlenden Proteinmenge statt nach Vorlieben und Abwechslung (nur im Rückfall). */
  function mitSnacks({ haupt, heute }: { haupt: Info[]; heute: Heute }, d: number, gezielt: boolean): Variante {
    const basis = haupt.reduce((s, i) => s + i.basis, 0);
    let bester: Variante | null = null;
    for (const [rang, n] of snackFolge.entries()) {
      const sHeute = heute.slice();
      const ids: Info[] = [];
      const je = n ? (ziel + 2 - mitte * basis) / n : 0;
      for (let k = 0; k < n; k++) ids.push(nimm(sHeute, waehle(snPool, d, 3 + k, sHeute, (i) => (gezielt ? Math.abs(i.basis - je) * 3 : Math.abs(i.basis - je) / 3))));
      // Zwischenmahlzeiten haben eine feste Portion: ihr Protein ist die gerundete Grundmenge.
      const sProtein = ids.reduce((s, i) => s + Math.round(i.basis), 0);
      const faktor = Math.min(max, Math.max(min, (ziel + 2 - sProtein) / basis));
      const summe = haupt.reduce((s, i) => s + proteinBei(i, faktor), 0) + sProtein;
      const abstand = abstandVon(summe);
      const wert = abstand * 100 + Math.abs(faktor - mitte) * 10 + rang * 0.5;
      if (!bester || wert < bester.wert) bester = { haupt, ids, summe, faktor, abstand, wert };
    }
    return bester!;
  }

  const tage: Tag[] = [];
  for (let d = 0; d < TAGE; d++) {
    const erste = hauptmahlzeiten(d, 0);
    let tag = mitSnacks(erste, d, false);
    // Rückfall, wenn der Tag aus dem Korridor fällt (kommt nur mit bestimmten Vorlieben vor): erst die
    // Zwischenmahlzeiten streng nach Proteinbedarf wählen, dann Hauptgerichte mit mehr oder weniger Protein.
    if (tag.abstand > 0) {
      const x = mitSnacks(erste, d, true);
      if (x.abstand < tag.abstand) tag = x;
    }
    if (tag.abstand > 0) {
      const zweite = hauptmahlzeiten(d, tag.summe < ziel ? 1 : -1);
      for (const gezielt of [false, true]) {
        const x = mitSnacks(zweite, d, gezielt);
        if (x.abstand < tag.abstand) tag = x;
      }
    }
    const { haupt, ids, summe, faktor } = tag;
    for (const i of [...haupt, ...ids]) {
      benutzt[i.idx]++;
      zuletzt[i.idx] = d;
    }
    gestern.fill(0);
    for (const i of [...haupt, ...ids]) gestern[i.idx] = 1;
    gesternFam.fill(0);
    for (const i of haupt) gesternFam[FAM[i.idx]] = 1;
    // Für die Prüfung reichen ID, Slot und Protein; Mengen und Texte baut plane() nur für echte Pläne.
    const fertig = (i: Info, slot: Slot, f: number, titel: string): GeplanteMahlzeit =>
      mitTexten ? plane(i, slot, f, titel, lf, vSet) : { id: i.g.id, slot, titel, name: i.g.name, positionen: [], protein: proteinBei(i, f), bevorzugt: false };
    const snacks = ids.map((i, k) => fertig(i, 'snack', 1, SNACK_TITEL[a.appetit][k]));
    const [mf, mm, ma] = haupt.map((i, k) => { const slot = (['fruehstueck', 'mittag', 'abend'] as const)[k]; return fertig(i, slot, faktor, TITEL[slot]); });
    const folge = a.appetit === 'klein' ? [mf, snacks[0], mm, snacks[1], snacks[3], ma, snacks[2]] : [mf, mm, snacks[0], ma, snacks[1]];
    tage.push({ nr: d + 1, mahlzeiten: folge.filter(Boolean) as GeplanteMahlzeit[], protein: summe, faktor });
  }
  return { id, ziel, lf, vorlieben, tage };
}

/** Erzeugt den Plan. Vorlieben, die nicht zur Ernährungsform passen, werden ignoriert. */
export function erstellePlan(a: Antworten): Plan {
  const { id, ziel, lf, vorlieben, tage } = planeTage(a);

  const wochen: Woche[] = [0, 1].map((w) => {
    const wt = tage.slice(w * 7, w * 7 + 7);
    return { nr: w + 1, tage: wt, ...einkaufsliste(wt, lf) };
  });

  // Austauschtabelle: so viel liefert etwa 20 g Protein.
  const tausch: TauschZeile[] = (Object.keys(zutaten) as ZutatKey[])
    .filter((k) => z(k).tausch && RANG[z(k).form as Ernaehrung] >= RANG[a.ernaehrung] && !(lf && z(k).laktose === 'enthalten'))
    .map((k) => {
      const x = z(k);
      const tierisch = x.form !== 'vegan';
      if (x.einheit === 'Stück') {
        const n = Math.round(20 / x.protein);
        return { name: zutatName(k, lf, true), menge: `${n}\u00a0Stück`, je100: `${zahl(x.protein)}\u00a0g je Stück`, tierisch };
      }
      const menge = Math.round((2000 / x.protein) / 10) * 10;
      return { name: zutatName(k, lf), menge: `${menge}\u00a0${x.einheit}`, je100: `${zahl(x.protein)}\u00a0g je 100\u00a0${x.einheit}`, tierisch };
    })
    .sort((p, q) => Number(q.tierisch) - Number(p.tierisch));

  // Rezeptkarten: die häufigsten Frühstücke und Hauptgerichte, höchstens zehn.
  const zaehler = new Map<string, KarteImPlan>();
  for (const t of tage)
    for (const mz of t.mahlzeiten) {
      if (mz.slot === 'snack') continue;
      const k = zaehler.get(mz.id);
      if (k) {
        k.anzahl++;
        k.tage.push(t.nr);
      } else zaehler.set(mz.id, { mahlzeit: mz, anzahl: 1, tage: [t.nr] });
    }
  const sortiert = [...zaehler.values()].sort(
    (p, q) => q.anzahl - p.anzahl || Number(q.mahlzeit.bevorzugt) - Number(p.mahlzeit.bevorzugt) || p.tage[0] - q.tage[0],
  );
  // Höchstens zwei Frühstücke, der Rest Hauptgerichte (dort hilft eine Anleitung mehr).
  const fruehstuecke = sortiert.filter((k) => k.mahlzeit.slot === 'fruehstueck').slice(0, 2);
  const karten = [...fruehstuecke, ...sortiert.filter((k) => k.mahlzeit.slot !== 'fruehstueck').slice(0, 10 - fruehstuecke.length)];

  const verwendet = new Set(tage.flatMap((t) => t.mahlzeiten.flatMap((m) => m.positionen.map((p) => p.key))));
  const grundlage = (Object.keys(zutaten) as ZutatKey[])
    .filter((k) => verwendet.has(k))
    .map((k) => ({ name: zutatName(k, lf), wert: `${zahl(z(k).protein)} g ${z(k).einheit === 'Stück' ? 'je Stück' : z(k).einheit === 'ml' ? 'je 100 ml' : 'je 100 g'}`, quelle: z(k).quelle ?? 'bls' }))
    .sort((p, q) => p.name.localeCompare(q.name, 'de'));

  const faktoren = tage.map((t) => t.faktor);
  return {
    id,
    ernaehrung: a.ernaehrung,
    appetit: a.appetit,
    gewicht: a.gewicht,
    laktosefrei: lf,
    vorlieben,
    ziel,
    referenzKg: referenzKg[a.gewicht],
    tage,
    wochen,
    tausch,
    karten,
    grundlage,
    faktor: { min: Math.min(...faktoren), max: Math.max(...faktoren) },
  };
}

const ABTEILUNG: [Abteilung, string][] = [
  ['gemuese', 'Obst und Gemüse'],
  ['kuehl', 'Kühlregal'],
  ['fleischfisch', 'Fleisch und Fisch'],
  ['tk', 'Tiefkühl'],
  ['brot', 'Brot'],
  ['trocken', 'Getreide, Nudeln, Linsen'],
  ['konserve', 'Gläser und Dosen'],
  ['nuesse', 'Nüsse, Saaten, Mus'],
  ['sonstiges', 'Sonstiges'],
];

/** Einkaufsliste für eine Woche: Summen je Lebensmittel, großzügig aufgerundet, nach Abteilung. */
function einkaufsliste(tage: Tag[], lf: boolean) {
  const summen = new Map<ZutatKey, number>();
  for (const t of tage) for (const mz of t.mahlzeiten) for (const p of mz.positionen) summen.set(p.key, (summen.get(p.key) ?? 0) + p.menge);
  const einkauf: EinkaufsGruppe[] = ABTEILUNG.map(([ab, name]) => ({
    name,
    posten: [...summen.entries()]
      .filter(([k]) => z(k).abteilung === ab)
      .sort((p, q) => zutatName(p[0], lf).localeCompare(zutatName(q[0], lf), 'de'))
      .map(([k, menge]) => {
        const x = z(k);
        if (x.einheit === 'Stück') return `${Math.ceil(menge)}\u00a0${zutatName(k, lf, Math.ceil(menge) !== 1)}`;
        const auf = Math.ceil(menge / 50) * 50;
        return auf >= 1000 ? `${zahl(auf / 1000, 2)}\u00a0${x.einheit === 'ml' ? 'l' : 'kg'} ${zutatName(k, lf)}` : `${auf}\u00a0${x.einheit} ${zutatName(k, lf)}`;
      }),
  })).filter((g) => g.posten.length);
  const mitMenge = new Set([...summen.keys()].map((k) => z(k).name));
  const dazu = [...new Set(tage.flatMap((t) => t.mahlzeiten.flatMap((mz) => (mz.dazu ? mz.dazu.split(', ') : []))))]
    .filter((d) => d !== 'Wasser' && !mitMenge.has(d))
    .sort((p, q) => p.localeCompare(q, 'de'));
  return { einkauf, dazu };
}

// ---------------------------------------------------------------------------------------------------------------
// Alle Grundpläne und Prüfung

/** Die 56 Grundpläne (ohne Vorlieben), in fester Reihenfolge. Nur im Build aufrufen. */
export function allePlaene(): Plan[] {
  return alleKombinationen().map((k) => erstellePlan(k as Antworten));
}

/** Was die Prüfung von einem Plan braucht (erstellePlan liefert mehr). */
type PlanKern = Pick<Plan, 'id' | 'ziel' | 'tage' | 'vorlieben'> & Pick<Antworten, 'ernaehrung' | 'appetit' | 'gewicht' | 'laktosefrei'>;

/** Prüft einen Plan: jeder Tag im Zielbereich (höchstens 5 g unter, höchstens 12 g über dem Ziel),
 *  drei Hauptmahlzeiten, kein Gericht an zwei Tagen hintereinander. */
export function pruefePlan(p: PlanKern): string[] {
  const fehler: string[] = [];
  const name = `${p.id} (${p.ernaehrung}, ${p.appetit}, ${p.gewicht}${p.laktosefrei ? ', laktosefrei' : ''}${p.vorlieben.length ? `, v=${p.vorlieben.join('+')}` : ''})`;
  p.tage.forEach((t, i) => {
    if (t.protein < p.ziel - KORRIDOR.unten || t.protein > p.ziel + KORRIDOR.oben) fehler.push(`${name} Tag ${t.nr}: ${t.protein} g statt ${p.ziel} g`);
    if (t.mahlzeiten.filter((m) => m.slot !== 'snack').length !== 3) fehler.push(`${name} Tag ${t.nr}: nicht drei Hauptmahlzeiten`);
    if (i > 0) {
      const vorher = new Set(p.tage[i - 1].mahlzeiten.map((m) => m.id));
      const doppelt = t.mahlzeiten.filter((m) => vorher.has(m.id)).map((m) => m.name);
      if (doppelt.length) fehler.push(`${name} Tag ${t.nr}: wie am Vortag: ${doppelt.join(', ')}`);
    }
  });
  return fehler;
}

/** Alle Vorlieben-Auswahlen, die die Prüfung abdeckt: keine, jede einzelne, alle Paare, alle Dreier, alle zusammen. */
function vorliebenAuswahlen(erlaubt: readonly string[]): string[][] {
  const out: string[][] = [[]];
  for (let i = 0; i < erlaubt.length; i++) {
    out.push([erlaubt[i]]);
    for (let j = i + 1; j < erlaubt.length; j++) {
      out.push([erlaubt[i], erlaubt[j]]);
      for (let k = j + 1; k < erlaubt.length; k++) out.push([erlaubt[i], erlaubt[j], erlaubt[k]]);
    }
  }
  if (erlaubt.length > 3) out.push([...erlaubt]);
  return out;
}

/** Prüft alle 56 Grundpläne, jeden mit jeder einzelnen Vorliebe, allen Paaren, allen Dreiern und allen Vorlieben
 *  zusammen (rund 18.600 Pläne; rechnet nur die Tage, ohne Einkaufslisten und Karten). */
export function pruefePlaene(): string[] {
  const fehler: string[] = [];
  for (const k of alleKombinationen()) {
    for (const v of vorliebenAuswahlen(erlaubteVorlieben(k.ernaehrung, k.laktosefrei))) {
      const a = { ...(k as Antworten), vorlieben: v };
      const { id, ziel, lf, vorlieben, tage } = planeTage(a, false);
      fehler.push(...pruefePlan({ id, ziel, tage, vorlieben, ernaehrung: a.ernaehrung, appetit: a.appetit, gewicht: a.gewicht, laktosefrei: lf }));
    }
  }
  return fehler;
}
