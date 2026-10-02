/**
 * Ernährungsplan nach der Abnehmspritze: Lebensmittel, Mahlzeiten und der Generator für die 18 Pläne.
 *
 * Alles hier ist deterministisch: Gleiche Antworten ergeben immer denselben Plan. Die Pläne werden beim Build als
 * Seiten unter /werkzeuge/ernaehrungsplan/plan/<id>/ erzeugt und mit `npm run pdf:ernaehrungsplan` zu PDFs unter
 * public/downloads/ernaehrungsplan/<id>.pdf gedruckt. MailerLite verschickt nur den Link (Feld `plan`).
 *
 * Zahlenregeln (CLAUDE.md): Proteingehalte je 100 g aus dem Bundeslebensmittelschlüssel (Quelle `bls`), gerundet;
 * Proteinpulver nach typischen Herstellerangaben. Tagesziel 1,2 g pro kg (Quelle `leidy2015`), angewendet auf die Mitte
 * der Gewichtsstufe. Keine Kalorienvorgaben: Der Plan steuert Protein, Ballaststoffe und Portionsgröße, nicht Energie.
 * Wer Mengen ändert, prüft danach mit `pruefePlaene()` (läuft im Build der Planseiten), dass jeder Tag im Zielkorridor liegt.
 */
import { alleKombinationen, ERNAEHRUNG, APPETIT, GEWICHT, planId } from './ernaehrungsplan-id.mjs';

export type Ernaehrung = (typeof ERNAEHRUNG)[number];
export type Appetit = (typeof APPETIT)[number];
export type Gewicht = (typeof GEWICHT)[number];
export { planId };

export const ernaehrungOptionen: { value: Ernaehrung; label: string; text: string }[] = [
  { value: 'mischkost', label: 'Mischkost', text: 'mit Fleisch und Fisch' },
  { value: 'vegetarisch', label: 'Vegetarisch', text: 'mit Milchprodukten und Eiern' },
  { value: 'vegan', label: 'Vegan', text: 'rein pflanzlich' },
];
export const appetitOptionen: { value: Appetit; label: string; text: string }[] = [
  { value: 'klein', label: 'Noch klein', text: 'nach wenigen Bissen satt, große Portionen gehen nicht' },
  { value: 'normal', label: 'Wieder normal', text: 'der Appetit ist weitgehend zurück' },
];
export const gewichtLabel: Record<Gewicht, string> = { unter75: 'unter 75 kg', '75bis95': '75 bis 95 kg', ueber95: 'über 95 kg' };

/** Tagesziel Protein in g: 1,2 g pro kg, bezogen auf die Mitte der Stufe (rund 65, 85 und 100 kg). */
export const proteinZiel: Record<Gewicht, number> = { unter75: 80, '75bis95': 100, ueber95: 120 };

type Einheit = 'g' | 'ml' | 'Stück';
type Diaet = Ernaehrung; // kleinste Ernährungsform, die das Lebensmittel enthält: mischkost < vegetarisch < vegan
interface Zutat { name: string; plural?: string; protein: number; einheit: Einheit; diaet: Diaet; tausch?: boolean }

/** Protein je 100 g oder 100 ml, bei Eiern je Stück. `tausch` = erscheint in der Austauschtabelle. */
export const zutaten = {
  skyr: { name: 'Skyr natur', protein: 11, einheit: 'g', diaet: 'vegetarisch', tausch: true },
  magerquark: { name: 'Magerquark', protein: 12, einheit: 'g', diaet: 'vegetarisch', tausch: true },
  huettenkaese: { name: 'Hüttenkäse', protein: 12, einheit: 'g', diaet: 'vegetarisch', tausch: true },
  ei: { name: 'Ei (Größe M)', plural: 'Eier (Größe M)', protein: 7, einheit: 'Stück', diaet: 'vegetarisch', tausch: true },
  milch: { name: 'Milch (1,5\u00a0%)', protein: 3.4, einheit: 'ml', diaet: 'vegetarisch' },
  feta: { name: 'Feta', protein: 17, einheit: 'g', diaet: 'vegetarisch' },
  kaese: { name: 'Käse (Gouda o. Ä.)', protein: 25, einheit: 'g', diaet: 'vegetarisch' },
  haehnchen: { name: 'Hähnchenbrust', protein: 23, einheit: 'g', diaet: 'mischkost', tausch: true },
  pute: { name: 'Putenbrust', protein: 24, einheit: 'g', diaet: 'mischkost', tausch: true },
  lachs: { name: 'Lachsfilet', protein: 20, einheit: 'g', diaet: 'mischkost', tausch: true },
  kabeljau: { name: 'Kabeljaufilet', protein: 17.5, einheit: 'g', diaet: 'mischkost' },
  thunfisch: { name: 'Thunfisch im eigenen Saft, abgetropft', protein: 25, einheit: 'g', diaet: 'mischkost', tausch: true },
  haferflocken: { name: 'Haferflocken', protein: 13.5, einheit: 'g', diaet: 'vegan' },
  vollkornbrot: { name: 'Vollkornbrot', protein: 7, einheit: 'g', diaet: 'vegan' },
  linsenGekocht: { name: 'Linsen, gekocht', protein: 9, einheit: 'g', diaet: 'vegan', tausch: true },
  roteLinsen: { name: 'Rote Linsen, trocken', protein: 24, einheit: 'g', diaet: 'vegan' },
  kichererbsen: { name: 'Kichererbsen, gekocht', protein: 8.5, einheit: 'g', diaet: 'vegan', tausch: true },
  kidney: { name: 'Kidneybohnen, gekocht', protein: 8.5, einheit: 'g', diaet: 'vegan' },
  weisseBohnen: { name: 'Weiße Bohnen, gekocht', protein: 7, einheit: 'g', diaet: 'vegan' },
  tofu: { name: 'Tofu natur', protein: 13, einheit: 'g', diaet: 'vegan', tausch: true },
  tempeh: { name: 'Tempeh', protein: 19, einheit: 'g', diaet: 'vegan', tausch: true },
  edamame: { name: 'Edamame', protein: 11, einheit: 'g', diaet: 'vegan', tausch: true },
  sojagranulat: { name: 'Sojagranulat, trocken', protein: 50, einheit: 'g', diaet: 'vegan', tausch: true },
  sojadrink: { name: 'Sojadrink', protein: 3.3, einheit: 'ml', diaet: 'vegan' },
  sojajoghurt: { name: 'Sojajoghurt natur', protein: 4, einheit: 'g', diaet: 'vegan' },
  hanfsamen: { name: 'Hanfsamen, geschält', protein: 30, einheit: 'g', diaet: 'vegan' },
  erdnussmus: { name: 'Erdnussmus', protein: 25, einheit: 'g', diaet: 'vegan' },
  mandeln: { name: 'Mandeln', protein: 21, einheit: 'g', diaet: 'vegan' },
  hummus: { name: 'Hummus', protein: 7.5, einheit: 'g', diaet: 'vegan' },
  tahin: { name: 'Tahin', protein: 17, einheit: 'g', diaet: 'vegan' },
  quinoa: { name: 'Quinoa, trocken', protein: 14, einheit: 'g', diaet: 'vegan' },
  vollkornreis: { name: 'Vollkornreis, trocken', protein: 7.5, einheit: 'g', diaet: 'vegan' },
  vollkornnudeln: { name: 'Vollkornnudeln, trocken', protein: 13, einheit: 'g', diaet: 'vegan' },
  reisnudeln: { name: 'Reisnudeln, trocken', protein: 6, einheit: 'g', diaet: 'vegan' },
  kartoffeln: { name: 'Kartoffeln', protein: 2, einheit: 'g', diaet: 'vegan' },
  brokkoli: { name: 'Brokkoli', protein: 3.8, einheit: 'g', diaet: 'vegan' },
  molkenprotein: { name: 'Molkenproteinpulver', protein: 80, einheit: 'g', diaet: 'vegetarisch', tausch: true },
  erbsenprotein: { name: 'Erbsenproteinpulver', protein: 75, einheit: 'g', diaet: 'vegan', tausch: true },
} satisfies Record<string, Zutat>;

export type ZutatKey = keyof typeof zutaten;
type Slot = 'fruehstueck' | 'mittag' | 'abend' | 'snack';
interface Mahlzeit { id: string; name: string; slot: Slot; diaet: Diaet; zutaten: [ZutatKey, number][]; dazu?: string; gruppe?: string }

/** Mahlzeiten in normaler Portion. `dazu` = Gemüse, Obst, Gewürze ohne nennenswertes Protein (zählt nicht mit). */
export const mahlzeiten: Mahlzeit[] = [
  // Frühstück
  { id: 'f1', slot: 'fruehstueck', diaet: 'vegetarisch', name: 'Skyr-Bowl mit Haferflocken', zutaten: [['skyr', 250], ['haferflocken', 30]], dazu: 'Beeren' },
  { id: 'f2', slot: 'fruehstueck', diaet: 'vegetarisch', name: 'Rührei mit Vollkornbrot', zutaten: [['ei', 3], ['vollkornbrot', 50]], dazu: 'Tomaten, Paprika' },
  { id: 'f3', slot: 'fruehstueck', diaet: 'vegetarisch', name: 'Overnight Oats mit Quark', zutaten: [['haferflocken', 50], ['magerquark', 150], ['milch', 100]], dazu: 'Apfel, Zimt' },
  { id: 'f4', slot: 'fruehstueck', diaet: 'vegetarisch', name: 'Vollkornbrot mit Hüttenkäse', zutaten: [['vollkornbrot', 100], ['huettenkaese', 150]], dazu: 'Gurke, Radieschen' },
  { id: 'f5', slot: 'fruehstueck', diaet: 'vegan', name: 'Tofu-Rührei mit Spinat', zutaten: [['tofu', 200], ['vollkornbrot', 50]], dazu: 'Spinat, Kurkuma' },
  { id: 'f6', slot: 'fruehstueck', diaet: 'vegan', name: 'Sojajoghurt-Bowl mit Hanfsamen', zutaten: [['sojajoghurt', 250], ['haferflocken', 30], ['hanfsamen', 20], ['erdnussmus', 15]], dazu: 'Beeren' },
  { id: 'f7', slot: 'fruehstueck', diaet: 'vegan', name: 'Haferbrei mit Sojadrink und Erbsenprotein', zutaten: [['haferflocken', 50], ['sojadrink', 250], ['erbsenprotein', 20]], dazu: 'Banane' },
  { id: 'f8', slot: 'fruehstueck', diaet: 'vegan', name: 'Vollkornbrot mit Hummus und Edamame', zutaten: [['vollkornbrot', 100], ['hummus', 60], ['edamame', 100]], dazu: 'Tomaten' },
  // Mittag
  { id: 'm1', slot: 'mittag', diaet: 'vegetarisch', name: 'Linsensalat mit Feta', zutaten: [['linsenGekocht', 200], ['feta', 50]], dazu: 'Paprika, Gurke, Petersilie, Olivenöl' },
  { id: 'm2', slot: 'mittag', diaet: 'mischkost', name: 'Hähnchen-Gemüse-Pfanne mit Vollkornreis', zutaten: [['haehnchen', 150], ['vollkornreis', 60]], dazu: 'Paprika, Möhren' },
  { id: 'm3', slot: 'mittag', diaet: 'mischkost', name: 'Thunfisch-Bohnen-Salat', zutaten: [['thunfisch', 130], ['weisseBohnen', 100]], dazu: 'Rucola, rote Zwiebel, Zitrone' },
  { id: 'm4', slot: 'mittag', diaet: 'vegan', name: 'Kichererbsen-Curry mit Tofu', zutaten: [['kichererbsen', 200], ['tofu', 100], ['vollkornreis', 50]], dazu: 'Spinat, Tomaten' },
  { id: 'm5', slot: 'mittag', diaet: 'vegan', name: 'Vollkornnudeln mit Linsen-Bolognese', zutaten: [['vollkornnudeln', 80], ['roteLinsen', 60]], dazu: 'passierte Tomaten, Zucchini' },
  { id: 'm6', slot: 'mittag', diaet: 'mischkost', name: 'Ofenlachs mit Kartoffeln und Brokkoli', zutaten: [['lachs', 150], ['kartoffeln', 250], ['brokkoli', 200]] },
  { id: 'm7', slot: 'mittag', diaet: 'vegetarisch', name: 'Gemüse-Omelett mit Käse', zutaten: [['ei', 3], ['kaese', 30], ['vollkornbrot', 50]], dazu: 'Paprika, Champignons' },
  { id: 'm8', slot: 'mittag', diaet: 'vegan', name: 'Tempeh-Bowl mit Quinoa und Edamame', zutaten: [['tempeh', 120], ['quinoa', 60], ['edamame', 50]], dazu: 'Rotkohl, Möhren' },
  { id: 'm9', slot: 'mittag', diaet: 'vegan', name: 'Linsensalat mit Tofu', zutaten: [['linsenGekocht', 200], ['tofu', 100]], dazu: 'Paprika, Gurke, Petersilie' },
  // Abend
  { id: 'a1', slot: 'abend', diaet: 'vegan', name: 'Linsensuppe mit Tofu und Brot', zutaten: [['roteLinsen', 60], ['tofu', 100], ['vollkornbrot', 50]], dazu: 'Möhren, Lauch' },
  { id: 'a2', slot: 'abend', diaet: 'mischkost', name: 'Salat mit Putenstreifen', zutaten: [['pute', 150], ['vollkornbrot', 50]], dazu: 'Blattsalat, Tomaten, Naturjoghurt fürs Dressing' },
  { id: 'a3', slot: 'abend', diaet: 'vegetarisch', name: 'Ofengemüse mit Kräuterquark', zutaten: [['magerquark', 200], ['kartoffeln', 150]], dazu: 'Paprika, Zucchini, Kräuter' },
  { id: 'a4', slot: 'abend', diaet: 'vegan', name: 'Tofu-Gemüse-Wok', zutaten: [['tofu', 200], ['reisnudeln', 50]], dazu: 'Pak Choi, Paprika, Sojasauce' },
  { id: 'a5', slot: 'abend', diaet: 'mischkost', name: 'Kabeljau mit Gemüse und Kartoffeln', zutaten: [['kabeljau', 150], ['kartoffeln', 150], ['brokkoli', 150]] },
  { id: 'a6', slot: 'abend', diaet: 'vegan', name: 'Chili sin Carne', zutaten: [['kidney', 250], ['sojagranulat', 30]], dazu: 'Mais, Paprika, passierte Tomaten' },
  { id: 'a7', slot: 'abend', diaet: 'vegetarisch', name: 'Vollkornbrot mit Ei und Hüttenkäse', zutaten: [['vollkornbrot', 100], ['ei', 2], ['huettenkaese', 100]], dazu: 'Gurke, Kresse' },
  { id: 'a8', slot: 'abend', diaet: 'vegan', name: 'Ofen-Kichererbsen mit Quinoa und Tahin', zutaten: [['kichererbsen', 150], ['quinoa', 50], ['tahin', 20]], dazu: 'Paprika, Zucchini, rote Zwiebel' },
  // Zwischenmahlzeiten (feste Portion, werden nicht skaliert)
  { id: 's1', slot: 'snack', diaet: 'vegetarisch', name: 'Skyr', zutaten: [['skyr', 150]] },
  { id: 's2', slot: 'snack', diaet: 'vegetarisch', name: 'Magerquark mit Beeren', zutaten: [['magerquark', 150]], dazu: 'Beeren' },
  { id: 's3', slot: 'snack', diaet: 'vegetarisch', name: 'Zwei gekochte Eier', zutaten: [['ei', 2]] },
  { id: 's4', slot: 'snack', diaet: 'vegetarisch', name: 'Hüttenkäse mit Gurke', zutaten: [['huettenkaese', 150]], dazu: 'Gurke' },
  { id: 's5', slot: 'snack', diaet: 'vegan', name: 'Edamame', zutaten: [['edamame', 150]] },
  { id: 's6', slot: 'snack', diaet: 'vegan', name: 'Sojajoghurt mit Hanfsamen', zutaten: [['sojajoghurt', 150], ['hanfsamen', 15]] },
  { id: 's7', slot: 'snack', diaet: 'vegan', name: 'Eine Handvoll Mandeln', zutaten: [['mandeln', 25]], dazu: 'Apfel' },
  { id: 's8', slot: 'snack', diaet: 'vegan', name: 'Hummus mit Gemüsesticks', zutaten: [['hummus', 80]], dazu: 'Möhren, Paprika' },
  { id: 's9', slot: 'snack', diaet: 'vegetarisch', name: 'Proteinshake mit Wasser oder Milch', zutaten: [['molkenprotein', 30]], gruppe: 'shake' },
  { id: 's10', slot: 'snack', diaet: 'vegan', name: 'Proteinshake mit Wasser oder Sojadrink', zutaten: [['erbsenprotein', 30]], gruppe: 'shake' },
];

const RANG: Record<Diaet, number> = { mischkost: 0, vegetarisch: 1, vegan: 2 };
/** Darf jemand mit Ernährungsform `e` ein Lebensmittel oder Gericht der Form `d` essen? */
export const passt = (d: Diaet, e: Ernaehrung) => RANG[d] >= RANG[e];

const BAND: Record<Gewicht, number> = { unter75: 0.8, '75bis95': 1.0, ueber95: 1.15 };
const APPETIT_FAKTOR: Record<Appetit, number> = { klein: 0.7, normal: 1.0 };
const SNACKS: Record<Appetit, { min: number; max: number }> = { klein: { min: 2, max: 4 }, normal: { min: 0, max: 2 } };

function runde(menge: number, einheit: Einheit) {
  if (einheit === 'Stück') return Math.max(1, Math.round(menge));
  if (menge < 50) return Math.max(5, Math.round(menge / 5) * 5);
  return Math.round(menge / 10) * 10;
}

export interface Position { key: ZutatKey; menge: number; einheit: Einheit; text: string; protein: number }
export interface GeplanteMahlzeit { slot: Slot; titel: string; name: string; positionen: Position[]; dazu?: string; protein: number }
export interface Tag { nr: number; mahlzeiten: GeplanteMahlzeit[]; protein: number }
export interface Plan {
  id: string;
  ernaehrung: Ernaehrung;
  appetit: Appetit;
  gewicht: Gewicht;
  ziel: number;
  tage: Tag[];
  einkauf: { text: string; key: ZutatKey }[];
  dazu: string[];
  tausch: { text: string }[];
}

function position(key: ZutatKey, menge: number): Position {
  const z: Zutat = zutaten[key];
  const protein = z.einheit === 'Stück' ? menge * z.protein : (menge / 100) * z.protein;
  const text = z.einheit === 'Stück' ? `${menge} ${menge === 1 ? z.name : (z.plural ?? z.name)}` : `${menge} ${z.einheit} ${z.name}`;
  return { key, menge, einheit: z.einheit, text, protein };
}

function plane(m: Mahlzeit, faktor: number, titel: string): GeplanteMahlzeit {
  const positionen = m.zutaten.map(([key, menge]) => position(key, faktor === 1 ? menge : runde(menge * faktor, zutaten[key].einheit)));
  return { slot: m.slot, titel, name: m.name, positionen, dazu: m.dazu, protein: Math.round(positionen.reduce((s, p) => s + p.protein, 0)) };
}

const TITEL: Record<Slot, string> = { fruehstueck: 'Frühstück', mittag: 'Mittag', abend: 'Abend', snack: 'Zwischendurch' };

/** Erzeugt den Plan für eine Kombination. Deterministisch: Tag d nimmt das d-te passende Gericht je Mahlzeit. */
export function erstellePlan(ernaehrung: Ernaehrung, appetit: Appetit, gewicht: Gewicht): Plan {
  const id = planId(ernaehrung, appetit, gewicht) as string;
  const ziel = proteinZiel[gewicht];
  const faktor = BAND[gewicht] * APPETIT_FAKTOR[appetit];
  const liste = (slot: Slot) => mahlzeiten.filter((m) => m.slot === slot && passt(m.diaet, ernaehrung));
  const [fr, mi, ab, sn] = [liste('fruehstueck'), liste('mittag'), liste('abend'), liste('snack')];

  const tage: Tag[] = [];
  for (let d = 0; d < 7; d++) {
    const haupt = [
      plane(fr[d % fr.length], faktor, TITEL.fruehstueck),
      plane(mi[(d + 1) % mi.length], faktor, TITEL.mittag),
      plane(ab[(d + 2) % ab.length], faktor, TITEL.abend),
    ];
    let summe = haupt.reduce((s, m) => s + m.protein, 0);
    const snacks: GeplanteMahlzeit[] = [];
    const benutzt = new Set<string>();
    const { min, max } = SNACKS[appetit];
    while (snacks.length < max && (summe < ziel - 4 || snacks.length < min)) {
      const luecke = ziel - summe;
      const kandidaten = sn
        .map((m, i) => ({ m, i }))
        .filter(({ m }) => !benutzt.has(m.id) && !(m.gruppe && [...benutzt].some((b) => sn.find((x) => x.id === b)?.gruppe === m.gruppe)))
        .map(({ m, i }) => ({ g: plane(m, 1, TITEL.snack), m, i }));
      if (kandidaten.length === 0) break;
      // Große Lücke: das proteinreichste; kleine Lücke: das, was sie am genauesten schließt; Ziel erreicht: das kleinste.
      // Bei Gleichstand rotiert der Tag die Auswahl, damit nicht jeden Tag dasselbe kommt.
      const rot = (i: number) => (i - d + sn.length) % sn.length;
      let wahl;
      if (luecke <= 0) wahl = kandidaten.sort((a, b) => a.g.protein - b.g.protein || rot(a.i) - rot(b.i))[0];
      else if (luecke > 20) wahl = kandidaten.sort((a, b) => b.g.protein - a.g.protein || rot(a.i) - rot(b.i))[0];
      else wahl = kandidaten.sort((a, b) => Math.abs(a.g.protein - luecke) - Math.abs(b.g.protein - luecke) || rot(a.i) - rot(b.i))[0];
      benutzt.add(wahl.m.id);
      snacks.push(wahl.g);
      summe += wahl.g.protein;
    }
    // Reihenfolge im Tag: bei kleinem Appetit über den Tag verteilt, sonst ein Snack am Nachmittag, einer am Abend.
    const [f, m, a] = haupt;
    const folge = appetit === 'klein' ? [f, snacks[0], m, snacks[1], a, snacks[2], snacks[3]] : [f, m, snacks[0], a, snacks[1]];
    tage.push({ nr: d + 1, mahlzeiten: folge.filter(Boolean) as GeplanteMahlzeit[], protein: summe });
  }

  // Einkaufsliste für die Woche: Summen je Lebensmittel, großzügig gerundet.
  const summen = new Map<ZutatKey, number>();
  for (const t of tage) for (const mz of t.mahlzeiten) for (const p of mz.positionen) summen.set(p.key, (summen.get(p.key) ?? 0) + p.menge);
  const einkauf = [...summen.entries()]
    .sort((a, b) => zutaten[a[0]].name.localeCompare(zutaten[b[0]].name, 'de'))
    .map(([key, menge]) => {
      const z: Zutat = zutaten[key];
      const auf = z.einheit === 'Stück' ? Math.ceil(menge) : Math.ceil(menge / 50) * 50;
      const text = z.einheit === 'Stück' ? `${auf} ${z.plural ?? z.name}` : auf >= 1000 ? `${String(auf / 1000).replace('.', ',')} ${z.einheit === 'ml' ? 'l' : 'kg'} ${z.name}` : `${auf} ${z.einheit} ${z.name}`;
      return { key, text };
    });
  const dazu = [...new Set(tage.flatMap((t) => t.mahlzeiten.flatMap((mz) => (mz.dazu ? mz.dazu.split(', ') : []))))].sort((a, b) => a.localeCompare(b, 'de'));

  // Austauschtabelle: so viel liefert etwa 20 g Protein.
  const tausch = (Object.keys(zutaten) as ZutatKey[])
    .filter((k) => (zutaten[k] as Zutat).tausch && passt(zutaten[k].diaet, ernaehrung))
    .map((k) => {
      const z: Zutat = zutaten[k];
      if (z.einheit === 'Stück') return { text: `${Math.round(20 / z.protein)} ${z.plural ?? z.name}` };
      const menge = Math.round(((20 / z.protein) * 100) / 10) * 10;
      return { text: `${menge} ${z.einheit} ${z.name}` };
    });

  return { id, ernaehrung, appetit, gewicht, ziel, tage, einkauf, dazu, tausch };
}

export const plaene: Plan[] = alleKombinationen().map((k) => erstellePlan(k.ernaehrung, k.appetit, k.gewicht));

/** Prüft jeden Tag aller Pläne: Protein zwischen Ziel − 6 g und Ziel + 20 g. Gibt die Abweichungen zurück. */
export function pruefePlaene(): string[] {
  const fehler: string[] = [];
  for (const p of plaene)
    for (const t of p.tage)
      if (t.protein < p.ziel - 6 || t.protein > p.ziel + 20) fehler.push(`${p.id} (${p.ernaehrung}, ${p.appetit}, ${p.gewicht}) Tag ${t.nr}: ${t.protein} g statt ${p.ziel} g`);
  return fehler;
}
