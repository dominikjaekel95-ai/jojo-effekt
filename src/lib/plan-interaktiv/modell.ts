/**
 * Interaktive Planseite (/ernaehrungsplan/plan/<id>/): Zustand und Regeln, ohne DOM. Läuft im Browser und im Testskript
 * scripts/plan-interaktiv-test.mjs (deshalb Importe mit Dateiendung, keine Node-APIs).
 *
 * Grundlage ist der Grundplan aus dem Generator (erstellePlan, mit Vorlieben); Generator, Rezeptpool, Zielwerte und
 * Plan-IDs bleiben unverändert. Der Zustand ist der Grundplan plus Änderungen der Nutzerin oder des Nutzers:
 *  - Jeder Tag hat dieselben Plätze wie im Grundplan (Frühstück, Mittag, Abend, Zwischenmahlzeiten mit ihrem Titel).
 *    Ein Platz trägt ein Gericht und den Tag, dessen Portionsfaktor gilt (`f`). Verschieben tauscht Gericht und Faktor
 *    zweier Tage auf demselben Platz (die Mahlzeit wandert mit ihren Mengen), Tauschen setzt ein anderes Gericht mit dem
 *    Faktor des Platzes ein. Zwischenmahlzeiten haben immer ihre feste Portion.
 *  - `aus`: ausgeblendete Gerichte („Nicht mein Fall“), nie als Alternative angeboten.
 * URL-Parameter `s` (kodiere/dekodiere): Punkt-getrennte Teile, nur [0-9a-z.], z. B. `xh03.2mh01.4mp024`:
 *  `x<gericht>` = ausgeblendet; `<tag><platz><gericht>[<faktortag>]` = Platz weicht vom Grundplan ab (Tag 0 bis 13 in
 *  Basis 36, Platz f/v/m/n/e/a/s, Faktortag nur, wenn er nicht der Tag selbst ist). Ungültige Teile werden ignoriert.
 */
import { zutaten, gerichte, type Gericht, type Slot, type ZutatKey, type Einheit } from '../../data/ernaehrungsplan-rezepte.ts';
import { RANG } from '../../data/ernaehrungsplan-id.mjs';
import { zutatName, zahl, type Plan, type Tag, type GeplanteMahlzeit, type Position, type Ernaehrung } from '../../data/ernaehrungsplan.ts';

/** Plätze eines Tages: Frühstück, Mittag, Abend und die Zwischenmahlzeiten nach ihrem Titel. */
export type Code = 'f' | 'v' | 'm' | 'n' | 'e' | 'a' | 's';
export const CODE_VON_TITEL: Record<string, Code> = {
  Frühstück: 'f',
  Vormittag: 'v',
  Mittag: 'm',
  Nachmittag: 'n',
  'Vor dem Abendessen': 'e',
  Abend: 'a',
  'Später am Abend': 's',
};
/** Zielbereich je Tag wie im Generator: höchstens 5 g unter, höchstens 12 g über dem Ziel. */
export const KORRIDOR = { unten: 5, oben: 12 };
/** Tausch-Alternativen liefern höchstens so viel Protein mehr oder weniger. */
export const TAUSCH_G = 5;

export interface Platz {
  code: Code;
  slot: Slot;
  titel: string;
  id: string;
  /** Tag (0 bis 13), dessen Portionsfaktor gilt; Zwischenmahlzeiten −1 (feste Portion) */
  f: number;
}
export interface Zustand {
  tage: Platz[][];
  /** ausgeblendete Gerichte, in Reihenfolge des Rezeptpools */
  aus: string[];
}

// ---------------------------------------------------------------------------------------------------------------
// Gerichte: Form, Laktose, Vorlieben-Kennzeichen und Grundprotein, gerechnet wie im Generator

interface Info { g: Gericht; idx: number; form: Ernaehrung; laktose: 'enthalten' | 'ersetzbar' | null; tags: string[]; basis: number; familie: string }
const zt = (k: ZutatKey) => zutaten[k] as { name: string; protein: number; einheit: Einheit; form: Ernaehrung; laktose?: string; vorliebe?: string };
const proteinRoh = (k: ZutatKey, menge: number) => (zt(k).einheit === 'Stück' ? menge * zt(k).protein : (menge / 100) * zt(k).protein);

const INFO: Record<string, Info> = {};
gerichte.forEach((g, idx) => {
  const teile = g.zutaten.map(([k, m]) => ({ k, p: proteinRoh(k, m) }));
  const basis = teile.reduce((s, t) => s + t.p, 0);
  const form = g.zutaten.reduce<Ernaehrung>((f, [k]) => (RANG[zt(k).form] < RANG[f] ? zt(k).form : f), 'vegan');
  const laktosen = g.zutaten.map(([k]) => zt(k).laktose);
  const laktose = laktosen.includes('enthalten') ? 'enthalten' : laktosen.includes('ersetzbar') ? 'ersetzbar' : null;
  const tags = [...new Set(teile.filter((t) => zt(t.k).vorliebe && t.p >= 0.2 * basis).map((t) => zt(t.k).vorliebe as string))];
  const haupt = teile.reduce((a, b) => (b.p > a.p ? b : a));
  INFO[g.id] = { g, idx, form, laktose, tags, basis, familie: zt(haupt.k).vorliebe ?? haupt.k };
});

export const gerichtName = (id: string) => INFO[id]?.g.name ?? '';
export const istGericht = (id: string) => !!INFO[id];

function runde(menge: number, einheit: Einheit) {
  if (einheit === 'Stück') return Math.max(1, Math.round(menge));
  if (menge < 50) return Math.max(5, Math.round(menge / 5) * 5);
  return Math.round(menge / 10) * 10;
}

/** Protein eines Gerichts bei einem Portionsfaktor (gerundete Mengen wie im Generator), auf ganze Gramm. */
export function proteinBei(id: string, f: number) {
  let s = 0;
  for (const [k, m] of INFO[id].g.zutaten) s += proteinRoh(k, f === 1 ? m : runde(m * f, zt(k).einheit));
  return Math.round(s);
}

// ---------------------------------------------------------------------------------------------------------------
// Kontext eines Plans

export interface Kontext {
  plan: Plan;
  lf: boolean;
  v: Set<string>;
  ziel: number;
  /** Portionsfaktor je Tag (Frühstück, Mittag, Abend) */
  faktoren: number[];
  /** passende Gerichte je Mahlzeit (Ernährungsform, Laktose; Zwischenmahlzeiten bei kleinem Appetit ab 8 g wie im Generator) */
  pool: Record<Slot, Info[]>;
  grund: Zustand;
}

export function kontext(plan: Plan): Kontext {
  const lf = plan.laktosefrei;
  const passt = (i: Info) => RANG[i.form] >= RANG[plan.ernaehrung] && !(lf && i.laktose === 'enthalten') && !(i.g.ersatz && !lf);
  const alle = Object.values(INFO).filter(passt);
  const fuer = (slot: Slot) => alle.filter((i) => i.g.slots.includes(slot) && !(slot === 'snack' && plan.appetit === 'klein' && i.basis < 8));
  const pool = { fruehstueck: fuer('fruehstueck'), mittag: fuer('mittag'), abend: fuer('abend'), snack: fuer('snack') };
  const grund: Zustand = {
    tage: plan.tage.map((t, d) => t.mahlzeiten.map((m) => ({ code: CODE_VON_TITEL[m.titel], slot: m.slot, titel: m.titel, id: m.id, f: m.slot === 'snack' ? -1 : d }))),
    aus: [],
  };
  return { plan, lf, v: new Set(plan.vorlieben), ziel: plan.ziel, faktoren: plan.tage.map((t) => t.faktor), pool, grund };
}

export const kopie = (z: Zustand): Zustand => ({ tage: z.tage.map((t) => t.map((p) => ({ ...p }))), aus: [...z.aus] });
export const faktorVon = (k: Kontext, p: Platz) => (p.slot === 'snack' ? 1 : k.faktoren[p.f]);
export const platzProtein = (k: Kontext, p: Platz) => proteinBei(p.id, faktorVon(k, p));
export const tagProtein = (k: Kontext, z: Zustand, d: number) => z.tage[d].reduce((s, p) => s + platzProtein(k, p), 0);
export const imZiel = (k: Kontext, g: number) => g >= k.ziel - KORRIDOR.unten && g <= k.ziel + KORRIDOR.oben;
export const finde = (z: Zustand, d: number, code: string) => (z.tage[d] ? z.tage[d].findIndex((p) => p.code === code) : -1);
export const bevorzugt = (k: Kontext, id: string) => INFO[id].tags.some((t) => k.v.has(t));
/** Passt das Gericht auf diesen Platz (Mahlzeit, Ernährungsform, Laktose)? */
export const passtAuf = (k: Kontext, id: string, slot: Slot) => k.pool[slot].some((i) => i.g.id === id);

function position(k: ZutatKey, menge: number, lf: boolean): Position {
  const x = zt(k);
  const text = x.einheit === 'Stück' ? `${menge}\u00a0${zutatName(k, lf, menge !== 1)}` : `${menge}\u00a0${x.einheit} ${zutatName(k, lf)}`;
  return { key: k, menge, einheit: x.einheit, text, protein: proteinRoh(k, menge) };
}

/** Mahlzeit eines Platzes mit Mengen und Protein, gerechnet wie plane() im Generator. */
export function mahlzeit(k: Kontext, p: Platz): GeplanteMahlzeit {
  const i = INFO[p.id];
  const f = faktorVon(k, p);
  const positionen = i.g.zutaten.map(([key, m]) => position(key, f === 1 ? m : runde(m * f, zt(key).einheit), k.lf));
  return { id: p.id, slot: p.slot, titel: p.titel, name: i.g.name, positionen, dazu: i.g.dazu, protein: Math.round(positionen.reduce((s, x) => s + x.protein, 0)), bevorzugt: bevorzugt(k, p.id) };
}

/** Der Zustand als Plan-Objekt (für Druckfassung, Überblick, Einkaufsliste und Rechengrundlage). */
export function alsPlan(k: Kontext, z: Zustand): Plan {
  const tage: Tag[] = z.tage.map((tag, d) => {
    const mahlzeiten = tag.map((p) => mahlzeit(k, p));
    return { nr: d + 1, mahlzeiten, protein: mahlzeiten.reduce((s, m) => s + m.protein, 0), faktor: k.faktoren[d] };
  });
  const wochen = [0, 1].map((w) => {
    const wt = tage.slice(w * 7, w * 7 + 7);
    const mitMenge = new Set(wt.flatMap((t) => t.mahlzeiten.flatMap((m) => m.positionen.map((p) => zt(p.key).name))));
    const dazu = [...new Set(wt.flatMap((t) => t.mahlzeiten.flatMap((m) => (m.dazu ? m.dazu.split(', ') : []))))]
      .filter((x) => x !== 'Wasser' && !mitMenge.has(x))
      .sort((p, q) => p.localeCompare(q, 'de'));
    return { nr: w + 1, tage: wt, einkauf: [], dazu };
  });
  const verwendet = new Set(tage.flatMap((t) => t.mahlzeiten.flatMap((m) => m.positionen.map((p) => p.key))));
  const grundlage = (Object.keys(zutaten) as ZutatKey[])
    .filter((key) => verwendet.has(key))
    .map((key) => {
      const x = zutaten[key] as { protein: number; einheit: Einheit; quelle?: 'bls' | 'hersteller' };
      return { name: zutatName(key, k.lf), wert: `${zahl(x.protein)} g ${x.einheit === 'Stück' ? 'je Stück' : x.einheit === 'ml' ? 'je 100 ml' : 'je 100 g'}`, quelle: x.quelle ?? 'bls' };
    })
    .sort((p, q) => p.name.localeCompare(q.name, 'de'));
  const fs = z.tage.flatMap((t) => t.filter((p) => p.slot !== 'snack').map((p) => k.faktoren[p.f]));
  return { ...k.plan, tage, wochen, karten: [], grundlage, faktor: { min: Math.min(...fs), max: Math.max(...fs) } };
}

// ---------------------------------------------------------------------------------------------------------------
// Alternativen, Ersatz, Vorschlag

export interface Kandidat {
  id: string;
  name: string;
  protein: number;
  /** Protein mehr (+) oder weniger (−) als das Gericht auf dem Platz */
  diff: number;
  bevorzugt: boolean;
  /** steht am Vortag oder am Folgetag */
  nachbar: boolean;
  /** Tagessumme danach im Zielbereich */
  imZiel: boolean;
  /** gleiche Hauptzutat wie ein anderes Gericht des Tages */
  familie: boolean;
  benutzt: number;
  idx: number;
}

/** Alle Gerichte, die statt des Gerichts auf Platz `code` an Tag `d` stehen dürfen: gleiche Mahlzeit, passend zu
 *  Ernährungsform und Laktose, nicht ausgeblendet, nicht schon an diesem Tag, höchstens ein Shake und ein Glas am Tag. */
export function kandidaten(k: Kontext, z: Zustand, d: number, code: string, aus: readonly string[] = z.aus): Kandidat[] {
  const i = finde(z, d, code);
  if (i < 0) return [];
  const p = z.tage[d][i];
  const f = faktorVon(k, p);
  const jetzt = proteinBei(p.id, f);
  const summe = tagProtein(k, z, d);
  const andere = z.tage[d].filter((_, j) => j !== i);
  const heute = new Set(andere.map((x) => x.id));
  const gruppen = new Set(andere.map((x) => INFO[x.id].g.gruppe).filter(Boolean));
  const familien = new Set(andere.map((x) => INFO[x.id].familie));
  const nachbarn = new Set([...(z.tage[d - 1] ?? []), ...(z.tage[d + 1] ?? [])].map((x) => x.id));
  const zaehler = new Map<string, number>();
  for (const t of z.tage) for (const x of t) zaehler.set(x.id, (zaehler.get(x.id) ?? 0) + 1);
  const ausSet = new Set(aus);
  return k.pool[p.slot]
    .filter((c) => c.g.id !== p.id && !heute.has(c.g.id) && !ausSet.has(c.g.id) && !(c.g.gruppe && gruppen.has(c.g.gruppe)))
    .map((c) => {
      const protein = proteinBei(c.g.id, f);
      return {
        id: c.g.id,
        name: c.g.name,
        protein,
        diff: protein - jetzt,
        bevorzugt: c.tags.some((t) => k.v.has(t)),
        nachbar: nachbarn.has(c.g.id),
        imZiel: imZiel(k, summe - jetzt + protein),
        familie: familien.has(c.familie),
        benutzt: zaehler.get(c.g.id) ?? 0,
        idx: c.idx,
      };
    });
}

type Schluessel = (c: Kandidat) => number[];
/** Lexikografischer Vergleich zweier Schlüssel (negativ: a zuerst). */
const vergleiche = (x: number[], y: number[]) => {
  for (let j = 0; j < x.length; j++) if (x[j] !== y[j]) return x[j] - y[j];
  return 0;
};
const sortiere = (xs: Kandidat[], s: Schluessel) => xs.slice().sort((a, b) => vergleiche(s(a), s(b)));
/** Reihenfolge der Alternativen: Tag bleibt im Zielbereich, Vorlieben zuerst, keine doppelte Hauptzutat am Tag, selten
 *  genutzte zuerst (Abwechslung), dann der kleinste Proteinunterschied. */
const RANG_ALTERNATIVE: Schluessel = (c) => [c.imZiel ? 0 : 1, c.bevorzugt ? 0 : 1, c.familie ? 1 : 0, c.benutzt, Math.abs(c.diff), c.idx];

/** Zwei bis drei Alternativen für einen Platz: ±5 g Protein; Gerichte vom Vortag oder Folgetag nur, wenn es sonst
 *  weniger als zwei gäbe. */
export function alternativen(k: Kontext, z: Zustand, d: number, code: string, max = 3): Kandidat[] {
  const nah = sortiere(kandidaten(k, z, d, code).filter((c) => Math.abs(c.diff) <= TAUSCH_G), RANG_ALTERNATIVE);
  const ohneNachbar = nah.filter((c) => !c.nachbar);
  return (ohneNachbar.length >= 2 ? ohneNachbar : [...ohneNachbar, ...nah.filter((c) => c.nachbar)]).slice(0, max);
}

/** Ersatz für ein ausgeblendetes Gericht: möglichst nicht am Vortag oder Folgetag, möglichst ±5 g, sonst das nächste. */
function ersatz(k: Kontext, z: Zustand, d: number, code: string, aus: readonly string[]): Kandidat | null {
  const liste = sortiere(kandidaten(k, z, d, code, aus), (c) => [c.nachbar ? 1 : 0, Math.abs(c.diff) <= TAUSCH_G ? 0 : 1, ...RANG_ALTERNATIVE(c)]);
  return liste[0] ?? null;
}

/** Tagessumme außerhalb des Zielbereichs: ein Tausch, der den Tag zurückbringt (Zwischenmahlzeit zuerst). */
export interface Vorschlag { code: string; von: string; nach: string; summe: number }
export function vorschlag(k: Kontext, z: Zustand, d: number): Vorschlag | null {
  if (imZiel(k, tagProtein(k, z, d))) return null;
  const summe = tagProtein(k, z, d);
  let best: { v: Vorschlag; s: number[] } | null = null;
  for (const p of z.tage[d]) {
    for (const c of kandidaten(k, z, d, p.code)) {
      if (!c.imZiel) continue;
      const s = [p.slot === 'snack' ? 0 : 1, c.nachbar ? 1 : 0, c.bevorzugt ? 0 : 1, Math.abs(summe + c.diff - (k.ziel + 2)), c.idx];
      if (!best || vergleiche(s, best.s) < 0) best = { v: { code: p.code, von: p.id, nach: c.id, summe: summe + c.diff }, s };
    }
  }
  return best?.v ?? null;
}

// ---------------------------------------------------------------------------------------------------------------
// Aktionen (geben einen neuen Zustand zurück oder null, wenn die Aktion nicht geht)

/** Darf das Gericht `id` an Tag `d` auf Platz `i` stehen, ohne dass es dort doppelt ist oder ein zweiter Shake oder
 *  ein zweites Glas dazukommt? */
function frei(z: Zustand, d: number, i: number, id: string) {
  const gruppe = INFO[id].g.gruppe;
  return z.tage[d].every((q, j) => j === i || (q.id !== id && !(gruppe && INFO[q.id].g.gruppe === gruppe)));
}

/** Kann Platz `code` von Tag `d1` mit demselben Platz von Tag `d2` getauscht werden? */
export function kannVerschieben(z: Zustand, d1: number, d2: number, code: string) {
  const i = finde(z, d1, code);
  const j = finde(z, d2, code);
  if (d1 === d2 || i < 0 || j < 0) return false;
  const a = z.tage[d1][i].id;
  const b = z.tage[d2][j].id;
  return a !== b && frei(z, d2, j, a) && frei(z, d1, i, b);
}

/** Tage, mit denen der Platz `code` von Tag `d` getauscht werden kann (gleiche Mahlzeit, kein Gericht doppelt am Tag). */
export const zielTage = (z: Zustand, d: number, code: string) => z.tage.map((_, e) => e).filter((e) => kannVerschieben(z, d, e, code));

/** Verschieben: Die Mahlzeiten zweier Tage auf demselben Platz tauschen, jede mit ihren Mengen. */
export function verschiebe(z: Zustand, d1: number, d2: number, code: string): Zustand | null {
  const i = finde(z, d1, code);
  const j = finde(z, d2, code);
  if (!kannVerschieben(z, d1, d2, code)) return null;
  const n = kopie(z);
  const a = n.tage[d1][i];
  const b = n.tage[d2][j];
  [a.id, b.id] = [b.id, a.id];
  [a.f, b.f] = [b.f, a.f];
  return n;
}

/** Tauschen: anderes Gericht auf den Platz, mit dem Portionsfaktor des Platzes. */
export function tausche(k: Kontext, z: Zustand, d: number, code: string, id: string): Zustand | null {
  const i = finde(z, d, code);
  if (i < 0 || !passtAuf(k, id, z.tage[d][i].slot) || z.aus.includes(id)) return null;
  const n = kopie(z);
  n.tage[d][i].id = id;
  return n;
}

const ordne = (ids: Iterable<string>) => [...new Set(ids)].filter(istGericht).sort((a, b) => INFO[a].idx - INFO[b].idx);

/** Ersetzt alle Vorkommen ausgeblendeter Gerichte (Tag für Tag, damit der Nachbartag schon stimmt). */
function ersetzeAusgeblendete(k: Kontext, z: Zustand): Zustand | null {
  const n = kopie(z);
  const aus = new Set(n.aus);
  for (let d = 0; d < n.tage.length; d++)
    for (const p of n.tage[d]) {
      if (!aus.has(p.id)) continue;
      const c = ersatz(k, n, d, p.code, n.aus);
      if (!c) return null;
      p.id = c.id;
    }
  return n;
}

/** „Nicht mein Fall“: Gericht im ganzen Plan ausblenden und jedes Vorkommen ersetzen. */
export function blendeAus(k: Kontext, z: Zustand, id: string): Zustand | null {
  if (!istGericht(id)) return null;
  return ersetzeAusgeblendete(k, { tage: z.tage, aus: ordne([...z.aus, id]) });
}

/** Ausgeblendetes Gericht wieder anbieten (es kommt nicht von selbst zurück in den Plan). */
export const zeigeWieder = (z: Zustand, id: string): Zustand => ({ tage: kopie(z).tage, aus: z.aus.filter((x) => x !== id) });

export const zuruecksetzen = (k: Kontext): Zustand => kopie(k.grund);

/** Plätze, die vom Grundplan abweichen (Gericht oder Portionsfaktor). */
export function abweichungen(k: Kontext, z: Zustand) {
  const out: { d: number; i: number; p: Platz; neu: boolean }[] = [];
  z.tage.forEach((t, d) => t.forEach((p, i) => {
    const g = k.grund.tage[d]?.[i];
    if (!g || p.id !== g.id || p.f !== g.f) out.push({ d, i, p, neu: !g || p.id !== g.id });
  }));
  return out;
}
export const geaendert = (k: Kontext, z: Zustand) => z.aus.length > 0 || abweichungen(k, z).length > 0;

// ---------------------------------------------------------------------------------------------------------------
// URL-Zustand

export function kodiere(k: Kontext, z: Zustand): string {
  const teile = z.aus.map((id) => `x${id}`);
  for (const { d, p } of abweichungen(k, z)) teile.push(`${d.toString(36)}${p.code}${p.id}${p.slot !== 'snack' && p.f !== d ? p.f.toString(36) : ''}`);
  return teile.join('.');
}

export function dekodiere(k: Kontext, s: string): Zustand {
  const z = kopie(k.grund);
  const aus: string[] = [];
  const tage = z.tage.length;
  for (const t of String(s ?? '').toLowerCase().split('.')) {
    let m = /^x([a-z]\d\d)$/.exec(t);
    if (m) {
      aus.push(m[1]);
      continue;
    }
    m = /^([0-9a-z])([fvmneas])([a-z]\d\d)([0-9a-z])?$/.exec(t);
    if (!m) continue;
    const d = parseInt(m[1], 36);
    const i = d < tage ? finde(z, d, m[2]) : -1;
    if (i < 0 || !istGericht(m[3])) continue;
    const p = z.tage[d][i];
    if (!passtAuf(k, m[3], p.slot)) continue;
    const f = p.slot === 'snack' ? -1 : m[4] ? parseInt(m[4], 36) : d;
    if (f >= tage) continue;
    z.tage[d][i] = { ...p, id: m[3], f };
  }
  z.aus = ordne(aus);
  // Stehen ausgeblendete Gerichte noch im Plan (z. B. weil sich der Rezeptpool geändert hat), werden sie ersetzt.
  return ersetzeAusgeblendete(k, z) ?? z;
}

/**
 * Zustand auf einen anderen Grundplan übertragen (Appetit-Regler, Vorlieben, andere Variante): ausgeblendete Gerichte
 * bleiben und werden ersetzt; jede Änderung der Nutzerin oder des Nutzers (Gericht X an Tag d auf Platz p) wird, soweit
 * der neue Plan diesen Platz hat und das Gericht passt, übernommen. Steht X im neuen Plan an einem anderen Tag auf
 * demselben Platz, wird getauscht (wie Verschieben), sonst ersetzt. Portionen richten sich nach dem neuen Plan.
 */
export function uebertrage(kAlt: Kontext, zAlt: Zustand, kNeu: Kontext): Zustand {
  const start = { tage: kopie(kNeu.grund).tage, aus: ordne(zAlt.aus) };
  const z = ersetzeAusgeblendete(kNeu, start) ?? start;
  const aus = new Set(z.aus);
  const pins = abweichungen(kAlt, zAlt).filter((x) => x.neu);
  const fest = new Set<string>();
  for (const { d, p } of pins) {
    const i = finde(z, d, p.code);
    if (i < 0 || aus.has(p.id) || !passtAuf(kNeu, p.id, z.tage[d][i].slot)) continue;
    const ziel = z.tage[d][i];
    fest.add(`${d}${p.code}`);
    if (ziel.id === p.id || !frei(z, d, i, p.id)) continue;
    const e = z.tage.findIndex((t, x) => x !== d && !fest.has(`${x}${p.code}`) && t.some((q) => q.code === p.code && q.id === p.id) && frei(z, x, finde(z, x, p.code), ziel.id));
    if (e >= 0) z.tage[e][finde(z, e, p.code)].id = ziel.id;
    ziel.id = p.id;
  }
  return z;
}
