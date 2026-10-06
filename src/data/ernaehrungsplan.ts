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
 *  3. Ein Tagesfaktor skaliert die Grundrezepte von Frühstück, Mittag und Abend, bis der Tag das Ziel trifft
 *     (Appetit klein: 0,4 bis 1,0, meist um 0,65, also kleine Teller und mehr Zwischenmahlzeiten; normal: 0,7 bis 1,5).
 *  4. Protein je Zutat = Menge × Proteingehalt je 100 g aus dem Bundeslebensmittelschlüssel (Quelle `bls`).
 * Keine Kalorienvorgaben: Der Plan steuert Protein, Ballaststoffe und Portionsgröße, nicht Energie.
 * `pruefePlaene()` läuft im Build der Planseiten und bricht ab, wenn ein Tag aus dem Korridor fällt.
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
  { value: 'mischkost', label: 'Mischkost', text: 'Fleisch an drei, Fisch an zwei Tagen pro Woche' },
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
interface Info { g: Gericht; idx: number; form: Ernaehrung; laktose: 'enthalten' | 'ersetzbar' | null; art: Art; familie: string; tags: Set<string>; basis: number }

const z = (k: ZutatKey): Zutat => zutaten[k];
const proteinVon = (k: ZutatKey, menge: number) => (z(k).einheit === 'Stück' ? menge * z(k).protein : (menge / 100) * z(k).protein);

const INFOS: Info[] = gerichte.map((g, idx) => {
  const teile = g.zutaten.map(([k, m]) => ({ k, p: proteinVon(k, m) }));
  const basis = teile.reduce((s, t) => s + t.p, 0);
  const form = g.zutaten.reduce<Ernaehrung>((f, [k]) => (RANG[z(k).form as Ernaehrung] < RANG[f] ? (z(k).form as Ernaehrung) : f), 'vegan');
  const laktosen = g.zutaten.map(([k]) => z(k).laktose);
  const laktose = laktosen.includes('enthalten') ? 'enthalten' : laktosen.includes('ersetzbar') ? 'ersetzbar' : null;
  const art: Art = g.zutaten.some(([k]) => z(k).form === 'mischkost') ? 'fleisch' : g.zutaten.some(([k]) => z(k).form === 'pescetarisch') ? 'fisch' : 'veg';
  const tags = new Set(teile.filter((t) => z(t.k).vorliebe && t.p >= 0.2 * basis).map((t) => z(t.k).vorliebe as string));
  const haupt = teile.reduce((a, b) => (b.p > a.p ? b : a));
  return { g, idx, form, laktose, art, familie: z(haupt.k).vorliebe ?? haupt.k, tags, basis };
});

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

export const zahl = (n: number, stellen = 1) => n.toLocaleString('de-DE', { maximumFractionDigits: stellen });

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
    bevorzugt: [...i.tags].some((t) => vorlieben.has(t)),
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Generator

/** Erzeugt den Plan. Vorlieben, die nicht zur Ernährungsform passen, werden ignoriert. */
export function erstellePlan(a: Antworten): Plan {
  const lf = a.ernaehrung === 'vegan' ? true : !!a.laktosefrei;
  const vorlieben = leseVorlieben(a.vorlieben ?? [], a.ernaehrung, lf) as Vorliebe[];
  const vSet = new Set<string>(vorlieben);
  const id = planId(a.ernaehrung, a.appetit, a.gewicht, lf);
  if (!id) throw new Error(`Ernährungsplan: ungültige Antworten ${JSON.stringify(a)}`);
  const ziel = proteinZiel[a.gewicht];
  const pool = INFOS.filter((i) => passt(i, a.ernaehrung, lf));
  const fr = pool.filter((i) => i.g.slots.includes('fruehstueck'));
  const sn = pool.filter((i) => i.g.slots.includes('snack'));
  const hauptFuer = (slot: 'mittag' | 'abend', art: Art | null) => pool.filter((i) => i.g.slots.includes(slot) && (art === null || i.art === art));
  const hatFleisch = vorlieben.some((v) => ['haehnchen', 'pute', 'rind'].includes(v));
  const hatFisch = vorlieben.some((v) => ['lachs', 'thunfisch', 'garnelen'].includes(v));
  const artFuer = (code: string): Art | null => {
    if (code === 'F' || (code === 'f' && hatFleisch)) return 'fleisch';
    if (code === 'S' || (code === 's' && hatFisch)) return 'fisch';
    return MUSTER[a.ernaehrung] ? 'veg' : null;
  };

  const benutzt = new Map<string, number>();
  const zuletzt = new Map<string, number>();
  let gestern = new Set<string>();
  let gesternFam = new Set<string>();
  const { min, max, mitte, snacks: snackFolge } = FAKTOR[a.appetit];
  // Bei kleinem Appetit nur Zwischenmahlzeiten, die nennenswert Protein liefern.
  const snPool = a.appetit === 'klein' ? sn.filter((i) => i.basis >= 8) : sn;

  function waehle(kandidaten: Info[], d: number, slotNr: number, heute: Set<string>, heuteFam: Map<string, number>, extra?: (i: Info) => number): Info {
    let best: Info | null = null;
    let bestWert = Infinity;
    for (const durchgang of [0, 1]) {
      for (const i of kandidaten) {
        if (heute.has(i.g.id) || (durchgang === 0 && gestern.has(i.g.id))) continue;
        if (i.g.gruppe && [...heute].some((h) => INFOS.find((x) => x.g.id === h)?.g.gruppe === i.g.gruppe)) continue;
        let w = (benutzt.get(i.g.id) ?? 0) * 4;
        const l = zuletzt.get(i.g.id);
        if (l !== undefined && d - l <= 3) w += 2;
        w += (heuteFam.get(i.familie) ?? 0) * 4;
        if (gesternFam.has(i.familie)) w += 1;
        if ([...i.tags].some((t) => vSet.has(t))) w -= 6;
        if (extra) w += extra(i);
        w += ((i.idx * 7 + d * 5 + slotNr * 3) % 17) / 100;
        if (w < bestWert) {
          bestWert = w;
          best = i;
        }
      }
      if (best) return best;
    }
    return kandidaten[0];
  }

  const tage: Tag[] = [];
  for (let d = 0; d < TAGE; d++) {
    const heute = new Set<string>();
    const heuteFam = new Map<string, number>();
    const nimm = (i: Info) => {
      heute.add(i.g.id);
      heuteFam.set(i.familie, (heuteFam.get(i.familie) ?? 0) + 1);
      return i;
    };
    const muster = MUSTER[a.ernaehrung]?.[d % 7] ?? ['V', 'V'];
    const f = nimm(waehle(fr, d, 0, heute, heuteFam));
    const mKand = hauptFuer('mittag', artFuer(muster[0]));
    const m = nimm(waehle(mKand.length ? mKand : hauptFuer('mittag', null), d, 1, heute, heuteFam));
    const aKand = hauptFuer('abend', artFuer(muster[1]));
    const ab = nimm(waehle(aKand.length ? aKand : hauptFuer('abend', null), d, 2, heute, heuteFam));
    const haupt = [f, m, ab];
    const basis = haupt.reduce((s, i) => s + i.basis, 0);

    // Zwischenmahlzeiten: Anzahl und Auswahl so, dass der Tagesfaktor nahe der Mitte des erlaubten Bereichs liegt
    // (kleiner Appetit: kleine Teller plus mehrere proteinreiche Zwischenmahlzeiten).
    let bester: { snacks: GeplanteMahlzeit[]; ids: Info[]; mahl: GeplanteMahlzeit[]; summe: number; faktor: number; wert: number } | null = null;
    for (const [rang, n] of snackFolge.entries()) {
      const sHeute = new Set(heute);
      const sFam = new Map(heuteFam);
      const ids: Info[] = [];
      const je = n ? (ziel + 2 - mitte * basis) / n : 0;
      for (let k = 0; k < n; k++) {
        const s = waehle(snPool, d, 3 + k, sHeute, sFam, (i) => Math.abs(i.basis - je) / 3);
        sHeute.add(s.g.id);
        sFam.set(s.familie, (sFam.get(s.familie) ?? 0) + 1);
        ids.push(s);
      }
      const snacks = ids.map((i, k) => plane(i, 'snack', 1, SNACK_TITEL[a.appetit][k], lf, vSet));
      const sProtein = snacks.reduce((s, x) => s + x.protein, 0);
      const faktor = Math.min(max, Math.max(min, (ziel + 2 - sProtein) / basis));
      const mahl = haupt.map((i, k) => { const slot = (['fruehstueck', 'mittag', 'abend'] as const)[k]; return plane(i, slot, faktor, TITEL[slot], lf, vSet); });
      const summe = mahl.reduce((s, x) => s + x.protein, 0) + sProtein;
      const abstand = summe < ziel - KORRIDOR.unten ? ziel - KORRIDOR.unten - summe : summe > ziel + KORRIDOR.oben ? summe - ziel - KORRIDOR.oben : 0;
      const wert = abstand * 100 + Math.abs(faktor - mitte) * 10 + rang * 0.5;
      if (!bester || wert < bester.wert) bester = { snacks, ids, mahl, summe, faktor, wert };
    }
    const { snacks, ids, mahl, summe, faktor } = bester!;
    for (const i of [...haupt, ...ids]) {
      benutzt.set(i.g.id, (benutzt.get(i.g.id) ?? 0) + 1);
      zuletzt.set(i.g.id, d);
    }
    gestern = new Set([...haupt, ...ids].map((i) => i.g.id));
    gesternFam = new Set(haupt.map((i) => i.familie));
    const [mf, mm, ma] = mahl;
    const folge = a.appetit === 'klein' ? [mf, snacks[0], mm, snacks[1], snacks[3], ma, snacks[2]] : [mf, mm, snacks[0], ma, snacks[1]];
    tage.push({ nr: d + 1, mahlzeiten: folge.filter(Boolean) as GeplanteMahlzeit[], protein: summe, faktor });
  }

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

/** Prüft einen Plan: jeder Tag im Korridor, drei Hauptmahlzeiten, kein Gericht an zwei Tagen hintereinander. */
export function pruefePlan(p: Plan): string[] {
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

/** Prüft alle Grundpläne, jeden mit jeder einzelnen Vorliebe und mit allen Vorlieben zusammen. */
export function pruefePlaene(): string[] {
  const fehler: string[] = [];
  for (const k of alleKombinationen()) {
    const erlaubt = erlaubteVorlieben(k.ernaehrung, k.laktosefrei);
    for (const v of [[], ...erlaubt.map((x) => [x]), erlaubt]) fehler.push(...pruefePlan(erstellePlan({ ...(k as Antworten), vorlieben: v })));
  }
  return fehler;
}
