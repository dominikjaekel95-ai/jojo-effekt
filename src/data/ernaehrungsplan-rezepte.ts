/**
 * Ernährungsplan: Lebensmittel und Gerichte (Grundrezepte für eine normale Portion).
 *
 * Proteingehalte je 100 g oder 100 ml (Eier und Wraps je Stück) aus dem Bundeslebensmittelschlüssel (Quelle `bls`),
 * gerundet; Proteinpulver und Räuchertofu nach typischen Herstellerangaben (`quelle: 'hersteller'`). Gemüse, Obst,
 * Kräuter und Gewürze stehen unter `dazu`, haben keine feste Menge und zählen nicht in die Proteinsumme.
 *
 * Laktose: `laktose: 'ersetzbar'` = gibt es im Supermarkt laktosefrei (Milch, Joghurt, Magerquark); im laktosefreien
 * Plan heißt die Zutat dann „…, laktosefrei“. `laktose: 'enthalten'` = Gericht fällt im laktosefreien Plan weg.
 * Gereifter Hartkäse (Gouda, Bergkäse) ist von Natur aus praktisch laktosefrei und hat deshalb keine Markierung.
 *
 * Neue Gerichte: hinten in der passenden Gruppe anhängen, Zutaten nur aus `zutaten`, Rezeptkarte in
 * ernaehrungsplan-karten.ts ergänzen. Danach `npm run build` (prüft alle Pläne) und `npm run pdf:ernaehrungsplan`.
 * IDs nie umbenennen: Sie stehen in keinem Link, aber die Reihenfolge bestimmt die Rotation der Pläne.
 */
import type { Ernaehrung } from './ernaehrungsplan-id.mjs';

export type Einheit = 'g' | 'ml' | 'Stück';
export type Abteilung = 'kuehl' | 'fleischfisch' | 'tk' | 'brot' | 'trocken' | 'konserve' | 'nuesse' | 'gemuese' | 'sonstiges';
export type Slot = 'fruehstueck' | 'mittag' | 'abend' | 'snack';

export interface Zutat {
  name: string;
  plural?: string;
  /** Protein in g je 100 g bzw. 100 ml, bei `Stück` je Stück */
  protein: number;
  einheit: Einheit;
  /** kleinste Ernährungsform, die das Lebensmittel enthält */
  form: Ernaehrung;
  laktose?: 'ersetzbar' | 'enthalten';
  abteilung: Abteilung;
  /** erscheint in der Austauschtabelle */
  tausch?: boolean;
  /** Vorliebe, zu der das Lebensmittel zählt */
  vorliebe?: string;
  quelle?: 'bls' | 'hersteller';
}

export const zutaten = {
  // Milchprodukte und Eier
  magerquark: { name: 'Magerquark', protein: 12, einheit: 'g', form: 'vegetarisch', laktose: 'ersetzbar', abteilung: 'kuehl', tausch: true, vorliebe: 'quark' },
  skyr: { name: 'Skyr natur', protein: 11, einheit: 'g', form: 'vegetarisch', laktose: 'enthalten', abteilung: 'kuehl', tausch: true, vorliebe: 'quark' },
  joghurt: { name: 'Naturjoghurt (1,5 %)', protein: 3.5, einheit: 'g', form: 'vegetarisch', laktose: 'ersetzbar', abteilung: 'kuehl' },
  milch: { name: 'Milch (1,5 %)', protein: 3.4, einheit: 'ml', form: 'vegetarisch', laktose: 'ersetzbar', abteilung: 'kuehl' },
  huettenkaese: { name: 'Hüttenkäse', protein: 12, einheit: 'g', form: 'vegetarisch', laktose: 'enthalten', abteilung: 'kuehl', tausch: true, vorliebe: 'huettenkaese' },
  feta: { name: 'Feta', protein: 17, einheit: 'g', form: 'vegetarisch', laktose: 'enthalten', abteilung: 'kuehl' },
  kaese: { name: 'Gouda oder Bergkäse', protein: 25, einheit: 'g', form: 'vegetarisch', abteilung: 'kuehl', tausch: true },
  ei: { name: 'Ei (Größe M)', plural: 'Eier (Größe M)', protein: 7, einheit: 'Stück', form: 'vegetarisch', abteilung: 'kuehl', tausch: true, vorliebe: 'eier' },
  // Fleisch und Fisch
  haehnchen: { name: 'Hähnchenbrustfilet', protein: 23, einheit: 'g', form: 'mischkost', abteilung: 'fleischfisch', tausch: true, vorliebe: 'haehnchen' },
  pute: { name: 'Putenbrustfilet', protein: 24, einheit: 'g', form: 'mischkost', abteilung: 'fleischfisch', tausch: true, vorliebe: 'pute' },
  rinderhack: { name: 'Rinderhack, mager', protein: 20, einheit: 'g', form: 'mischkost', abteilung: 'fleischfisch', tausch: true, vorliebe: 'rind' },
  lachs: { name: 'Lachsfilet', protein: 20, einheit: 'g', form: 'pescetarisch', abteilung: 'fleischfisch', tausch: true, vorliebe: 'lachs' },
  raeucherlachs: { name: 'Räucherlachs', protein: 21, einheit: 'g', form: 'pescetarisch', abteilung: 'fleischfisch', vorliebe: 'lachs' },
  kabeljau: { name: 'Kabeljau- oder Seelachsfilet', protein: 17.5, einheit: 'g', form: 'pescetarisch', abteilung: 'fleischfisch', tausch: true },
  thunfisch: { name: 'Thunfisch im eigenen Saft, abgetropft', protein: 25, einheit: 'g', form: 'pescetarisch', abteilung: 'konserve', tausch: true, vorliebe: 'thunfisch' },
  garnelen: { name: 'Garnelen (TK, ohne Schale)', protein: 18, einheit: 'g', form: 'pescetarisch', abteilung: 'tk', tausch: true, vorliebe: 'garnelen' },
  // Pflanzlich, gekühlt
  tofu: { name: 'Tofu natur', protein: 13, einheit: 'g', form: 'vegan', abteilung: 'kuehl', tausch: true, vorliebe: 'tofu' },
  raeuchertofu: { name: 'Räuchertofu', protein: 16, einheit: 'g', form: 'vegan', abteilung: 'kuehl', tausch: true, vorliebe: 'tofu', quelle: 'hersteller' },
  tempeh: { name: 'Tempeh', protein: 19, einheit: 'g', form: 'vegan', abteilung: 'kuehl', tausch: true, vorliebe: 'tempeh' },
  sojajoghurt: { name: 'Sojajoghurt natur', protein: 4, einheit: 'g', form: 'vegan', abteilung: 'kuehl' },
  sojadrink: { name: 'Sojadrink', protein: 3.3, einheit: 'ml', form: 'vegan', abteilung: 'kuehl' },
  hummus: { name: 'Hummus', protein: 7.5, einheit: 'g', form: 'vegan', abteilung: 'kuehl', vorliebe: 'kichererbsen' },
  edamame: { name: 'Edamame (TK, ohne Schote)', protein: 11, einheit: 'g', form: 'vegan', abteilung: 'tk', tausch: true, vorliebe: 'edamame' },
  // Brot
  vollkornbrot: { name: 'Vollkornbrot', protein: 7, einheit: 'g', form: 'vegan', abteilung: 'brot' },
  knaeckebrot: { name: 'Vollkorn-Knäckebrot', protein: 9, einheit: 'g', form: 'vegan', abteilung: 'brot' },
  wrap: { name: 'Vollkorn-Wrap (60 g)', plural: 'Vollkorn-Wraps (je 60 g)', protein: 5.5, einheit: 'Stück', form: 'vegan', abteilung: 'brot' },
  // Trockenware
  haferflocken: { name: 'Haferflocken', protein: 13.5, einheit: 'g', form: 'vegan', abteilung: 'trocken', vorliebe: 'haferflocken' },
  roteLinsen: { name: 'Rote Linsen, trocken', protein: 24, einheit: 'g', form: 'vegan', abteilung: 'trocken', vorliebe: 'linsen' },
  sojagranulat: { name: 'Sojagranulat, trocken', protein: 50, einheit: 'g', form: 'vegan', abteilung: 'trocken', tausch: true },
  quinoa: { name: 'Quinoa, trocken', protein: 14, einheit: 'g', form: 'vegan', abteilung: 'trocken' },
  bulgur: { name: 'Bulgur, trocken', protein: 12, einheit: 'g', form: 'vegan', abteilung: 'trocken' },
  vollkornreis: { name: 'Vollkornreis, trocken', protein: 7.5, einheit: 'g', form: 'vegan', abteilung: 'trocken' },
  vollkornnudeln: { name: 'Vollkornnudeln, trocken', protein: 13, einheit: 'g', form: 'vegan', abteilung: 'trocken' },
  reisnudeln: { name: 'Reisnudeln, trocken', protein: 6, einheit: 'g', form: 'vegan', abteilung: 'trocken' },
  // Gläser und Dosen
  linsenGekocht: { name: 'Linsen, gekocht (Glas oder Dose)', protein: 9, einheit: 'g', form: 'vegan', abteilung: 'konserve', tausch: true, vorliebe: 'linsen' },
  kichererbsen: { name: 'Kichererbsen, gekocht (Glas oder Dose)', protein: 8.5, einheit: 'g', form: 'vegan', abteilung: 'konserve', tausch: true, vorliebe: 'kichererbsen' },
  kidney: { name: 'Kidneybohnen, gekocht (Dose)', protein: 8.5, einheit: 'g', form: 'vegan', abteilung: 'konserve', tausch: true, vorliebe: 'bohnen' },
  weisseBohnen: { name: 'Weiße Bohnen, gekocht (Dose)', protein: 7, einheit: 'g', form: 'vegan', abteilung: 'konserve', vorliebe: 'bohnen' },
  // Nüsse, Saaten, Mus
  hanfsamen: { name: 'Hanfsamen, geschält', protein: 30, einheit: 'g', form: 'vegan', abteilung: 'nuesse' },
  erdnussmus: { name: 'Erdnussmus', protein: 25, einheit: 'g', form: 'vegan', abteilung: 'nuesse' },
  mandeln: { name: 'Mandeln', protein: 21, einheit: 'g', form: 'vegan', abteilung: 'nuesse' },
  tahin: { name: 'Tahin (Sesammus)', protein: 17, einheit: 'g', form: 'vegan', abteilung: 'nuesse' },
  // Gemüse mit Menge
  kartoffeln: { name: 'Kartoffeln', protein: 2, einheit: 'g', form: 'vegan', abteilung: 'gemuese' },
  brokkoli: { name: 'Brokkoli', protein: 3.8, einheit: 'g', form: 'vegan', abteilung: 'gemuese' },
  // Proteinpulver
  molkenprotein: { name: 'Molkenproteinpulver', protein: 80, einheit: 'g', form: 'vegetarisch', laktose: 'enthalten', abteilung: 'sonstiges', tausch: true, quelle: 'hersteller' },
  erbsenprotein: { name: 'Erbsenproteinpulver', protein: 75, einheit: 'g', form: 'vegan', abteilung: 'sonstiges', tausch: true, quelle: 'hersteller' },
} satisfies Record<string, Zutat>;

export type ZutatKey = keyof typeof zutaten;

export interface Gericht {
  id: string;
  name: string;
  slots: Slot[];
  zutaten: [ZutatKey, number][];
  /** Gemüse, Obst, Kräuter, Gewürze ohne feste Menge */
  dazu?: string;
  /** Snacks einer Gruppe kommen höchstens einmal am Tag vor (z. B. Proteinshakes) */
  gruppe?: string;
  /** pflanzliche Fassung eines Milch-Gerichts: nur in veganen und laktosefreien Plänen */
  ersatz?: boolean;
}

const HAUPT: Slot[] = ['mittag', 'abend'];
const F: Slot[] = ['fruehstueck'];
const S: Slot[] = ['snack'];

/** Grundrezepte für eine normale Portion. Der Generator skaliert Frühstück und Hauptgerichte je Tag, Snacks nicht. */
export const gerichte: Gericht[] = [
  // ---- Frühstück, vegetarisch
  { id: 'f01', slots: F, name: 'Skyr-Bowl mit Haferflocken und Beeren', zutaten: [['skyr', 250], ['haferflocken', 30]], dazu: 'Beeren, Zimt' },
  { id: 'f02', slots: F, name: 'Rührei mit Vollkornbrot', zutaten: [['ei', 3], ['vollkornbrot', 60]], dazu: 'Tomaten, Schnittlauch' },
  { id: 'f03', slots: F, name: 'Overnight Oats mit Quark', zutaten: [['haferflocken', 50], ['magerquark', 150], ['milch', 100]], dazu: 'Apfel, Zimt' },
  { id: 'f04', slots: F, name: 'Vollkornbrot mit Hüttenkäse', zutaten: [['vollkornbrot', 100], ['huettenkaese', 150]], dazu: 'Gurke, Radieschen, Kresse' },
  { id: 'f05', slots: F, name: 'Kräuterquark-Brot mit Radieschen', zutaten: [['vollkornbrot', 100], ['magerquark', 150]], dazu: 'Radieschen, Schnittlauch' },
  { id: 'f06', slots: F, name: 'Quark-Pfannkuchen mit Apfel', zutaten: [['ei', 2], ['haferflocken', 40], ['magerquark', 100]], dazu: 'Apfel, Zimt' },
  { id: 'f07', slots: F, name: 'Porridge mit Milch, Quark und Mandeln', zutaten: [['haferflocken', 50], ['milch', 250], ['magerquark', 80], ['mandeln', 10]], dazu: 'Birne oder Banane' },
  { id: 'f08', slots: F, name: 'Vollkornbrot mit Ei und Käse', zutaten: [['vollkornbrot', 100], ['ei', 2], ['kaese', 20]], dazu: 'Gurke, Tomaten' },
  { id: 'f09', slots: F, name: 'Gemüse-Omelett mit Käse', zutaten: [['ei', 3], ['kaese', 20], ['vollkornbrot', 50]], dazu: 'Paprika, Champignons, Spinat' },
  { id: 'f10', slots: F, name: 'Quark-Joghurt-Bowl mit Haferflocken', zutaten: [['joghurt', 150], ['magerquark', 150], ['haferflocken', 30]], dazu: 'Beeren' },
  // ---- Frühstück, mit Fisch
  { id: 'f11', slots: F, name: 'Räucherlachs-Brot mit Ei', zutaten: [['vollkornbrot', 100], ['raeucherlachs', 60], ['ei', 1]], dazu: 'Gurke, Dill, Zitrone' },
  // ---- Frühstück, vegan
  { id: 'f20', slots: F, name: 'Tofu-Rührei mit Spinat und Brot', zutaten: [['tofu', 200], ['vollkornbrot', 50]], dazu: 'Spinat, Tomaten, Kurkuma' },
  { id: 'f21', slots: F, ersatz: true, name: 'Sojajoghurt-Bowl mit Hanfsamen', zutaten: [['sojajoghurt', 250], ['haferflocken', 30], ['hanfsamen', 20], ['erdnussmus', 15]], dazu: 'Beeren' },
  { id: 'f22', slots: F, ersatz: true, name: 'Haferbrei mit Sojadrink und Erbsenprotein', zutaten: [['haferflocken', 50], ['sojadrink', 250], ['erbsenprotein', 20]], dazu: 'Banane, Zimt' },
  { id: 'f23', slots: F, name: 'Vollkornbrot mit Hummus und Edamame', zutaten: [['vollkornbrot', 100], ['hummus', 60], ['edamame', 120]], dazu: 'Tomaten' },
  { id: 'f24', slots: F, ersatz: true, name: 'Overnight Oats mit Sojajoghurt und Hanfsamen', zutaten: [['haferflocken', 50], ['sojajoghurt', 150], ['sojadrink', 100], ['hanfsamen', 20], ['erbsenprotein', 10]], dazu: 'Apfel, Zimt' },
  { id: 'f25', slots: F, name: 'Vollkornbrot mit Räuchertofu und Hummus', zutaten: [['vollkornbrot', 100], ['raeuchertofu', 100], ['hummus', 30]], dazu: 'Gurke, Tomaten' },
  { id: 'f26', slots: F, name: 'Bohnen-Tofu-Pfanne auf Vollkornbrot', zutaten: [['weisseBohnen', 150], ['raeuchertofu', 80], ['vollkornbrot', 60]], dazu: 'passierte Tomaten, Paprikapulver' },

  // ---- Hauptgerichte mit Fleisch
  { id: 'h01', slots: HAUPT, name: 'Hähnchen-Gemüse-Pfanne mit Vollkornreis', zutaten: [['haehnchen', 150], ['vollkornreis', 60]], dazu: 'Paprika, Möhren, Zucchini' },
  { id: 'h02', slots: HAUPT, name: 'Salat mit Putenstreifen und Vollkornbrot', zutaten: [['pute', 130], ['vollkornbrot', 50]], dazu: 'Blattsalat, Tomaten, Gurke, Senf-Dressing' },
  { id: 'h03', slots: HAUPT, name: 'Chili con Carne', zutaten: [['rinderhack', 120], ['kidney', 150]], dazu: 'Mais, Paprika, passierte Tomaten' },
  { id: 'h04', slots: HAUPT, name: 'Putengeschnetzeltes mit Vollkornnudeln', zutaten: [['pute', 130], ['vollkornnudeln', 60]], dazu: 'Champignons, Zwiebel, Petersilie' },
  { id: 'h05', slots: HAUPT, name: 'Hähnchen-Wrap mit Hummus', zutaten: [['haehnchen', 120], ['wrap', 1], ['hummus', 40]], dazu: 'Salat, Paprika, Gurke' },
  { id: 'h06', slots: HAUPT, name: 'Vollkornspaghetti Bolognese', zutaten: [['rinderhack', 120], ['vollkornnudeln', 70]], dazu: 'passierte Tomaten, Möhren, Sellerie' },
  { id: 'h07', slots: HAUPT, name: 'Ofenhähnchen mit Kartoffeln und Brokkoli', zutaten: [['haehnchen', 130], ['kartoffeln', 200], ['brokkoli', 150]], dazu: 'Rosmarin, Knoblauch' },
  { id: 'h08', slots: HAUPT, name: 'Puten-Linsen-Curry mit Reis', zutaten: [['pute', 100], ['roteLinsen', 30], ['vollkornreis', 40]], dazu: 'Spinat, Tomaten, Currypulver' },
  { id: 'h09', slots: HAUPT, name: 'Gefüllte Paprika mit Rinderhack und Reis', zutaten: [['rinderhack', 100], ['vollkornreis', 40], ['kaese', 20]], dazu: 'Paprika, Tomaten, Zwiebel' },
  // ---- Hauptgerichte mit Fisch
  { id: 'p01', slots: HAUPT, name: 'Ofenlachs mit Kartoffeln und Brokkoli', zutaten: [['lachs', 130], ['kartoffeln', 200], ['brokkoli', 150]], dazu: 'Zitrone, Dill' },
  { id: 'p02', slots: HAUPT, name: 'Thunfisch-Bohnen-Salat', zutaten: [['thunfisch', 120], ['weisseBohnen', 100]], dazu: 'Rucola, rote Zwiebel, Zitrone, Olivenöl' },
  { id: 'p03', slots: HAUPT, name: 'Kabeljau mit Gemüse und Kartoffeln', zutaten: [['kabeljau', 160], ['kartoffeln', 200]], dazu: 'Möhren, Erbsen, Dill' },
  { id: 'p04', slots: HAUPT, name: 'Garnelen-Gemüse-Pfanne mit Reisnudeln', zutaten: [['garnelen', 150], ['reisnudeln', 50]], dazu: 'Pak Choi, Paprika, Knoblauch, Sojasauce' },
  { id: 'p05', slots: HAUPT, name: 'Vollkornnudeln mit Thunfisch-Tomatensauce', zutaten: [['thunfisch', 100], ['vollkornnudeln', 70]], dazu: 'passierte Tomaten, Kapern, Oliven' },
  { id: 'p06', slots: HAUPT, name: 'Lachs-Bowl mit Quinoa und Edamame', zutaten: [['lachs', 110], ['quinoa', 50], ['edamame', 60]], dazu: 'Gurke, Möhren, Sesam' },
  { id: 'p07', slots: HAUPT, name: 'Gebratener Reis mit Garnelen und Ei', zutaten: [['garnelen', 130], ['vollkornreis', 60], ['ei', 1]], dazu: 'Erbsen, Möhren, Frühlingszwiebel, Sojasauce' },
  { id: 'p08', slots: HAUPT, name: 'Seelachs auf Linsengemüse', zutaten: [['kabeljau', 120], ['linsenGekocht', 120]], dazu: 'Möhren, Lauch, Senf' },
  // ---- Hauptgerichte, vegetarisch
  { id: 'v01', slots: HAUPT, name: 'Linsensalat mit Feta', zutaten: [['linsenGekocht', 200], ['feta', 50]], dazu: 'Paprika, Gurke, Petersilie, Olivenöl' },
  { id: 'v02', slots: HAUPT, name: 'Spinat-Frittata mit Kartoffeln', zutaten: [['ei', 3], ['kartoffeln', 150], ['kaese', 20]], dazu: 'Spinat, Zwiebel' },
  { id: 'v03', slots: HAUPT, name: 'Ofengemüse mit Kichererbsen und Kräuterquark', zutaten: [['magerquark', 200], ['kartoffeln', 150], ['kichererbsen', 80]], dazu: 'Paprika, Zucchini, Kräuter' },
  { id: 'v04', slots: ['abend'], name: 'Vollkornbrot mit Ei und Hüttenkäse', zutaten: [['vollkornbrot', 100], ['ei', 2], ['huettenkaese', 100]], dazu: 'Gurke, Kresse' },
  { id: 'v05', slots: HAUPT, name: 'Shakshuka mit Feta und Brot', zutaten: [['ei', 3], ['feta', 30], ['vollkornbrot', 50]], dazu: 'passierte Tomaten, Paprika, Zwiebel, Kreuzkümmel' },
  { id: 'v06', slots: HAUPT, name: 'Pellkartoffeln mit Kräuterquark', zutaten: [['kartoffeln', 250], ['magerquark', 200]], dazu: 'Leinöl, Schnittlauch, Gurkensalat' },
  { id: 'v07', slots: HAUPT, name: 'Bulgursalat mit Feta und Kichererbsen', zutaten: [['bulgur', 50], ['kichererbsen', 120], ['feta', 50]], dazu: 'Tomaten, Gurke, Petersilie, Zitrone' },
  { id: 'v08', slots: HAUPT, name: 'Ofenkartoffel mit Hüttenkäse und Bohnen', zutaten: [['kartoffeln', 250], ['huettenkaese', 150], ['kidney', 80]], dazu: 'Frühlingszwiebel, Paprika' },
  // ---- Hauptgerichte, vegan
  { id: 'g01', slots: HAUPT, name: 'Kichererbsen-Curry mit Tofu und Reis', zutaten: [['kichererbsen', 150], ['tofu', 100], ['vollkornreis', 50]], dazu: 'Spinat, Tomaten, Currypaste' },
  { id: 'g02', slots: HAUPT, name: 'Vollkornnudeln mit Linsen-Bolognese', zutaten: [['vollkornnudeln', 80], ['roteLinsen', 70]], dazu: 'passierte Tomaten, Zucchini, Oregano' },
  { id: 'g03', slots: HAUPT, name: 'Tempeh-Bowl mit Quinoa und Edamame', zutaten: [['tempeh', 120], ['quinoa', 50], ['edamame', 50]], dazu: 'Rotkohl, Möhren, Sojasauce' },
  { id: 'g04', slots: HAUPT, name: 'Linsensalat mit Räuchertofu', zutaten: [['linsenGekocht', 200], ['raeuchertofu', 80]], dazu: 'Paprika, Gurke, Petersilie, Senf' },
  { id: 'g05', slots: HAUPT, name: 'Rote-Linsen-Suppe mit Tofu und Brot', zutaten: [['roteLinsen', 60], ['tofu', 100], ['vollkornbrot', 50]], dazu: 'Möhren, Lauch, Kreuzkümmel' },
  { id: 'g06', slots: HAUPT, name: 'Tofu-Gemüse-Wok mit Reisnudeln', zutaten: [['tofu', 200], ['reisnudeln', 50]], dazu: 'Pak Choi, Paprika, Ingwer, Sojasauce' },
  { id: 'g07', slots: HAUPT, name: 'Chili sin Carne', zutaten: [['kidney', 200], ['sojagranulat', 30]], dazu: 'Mais, Paprika, passierte Tomaten' },
  { id: 'g08', slots: HAUPT, name: 'Ofen-Kichererbsen mit Quinoa und Tahin', zutaten: [['kichererbsen', 180], ['quinoa', 50], ['tahin', 20]], dazu: 'Paprika, Zucchini, rote Zwiebel' },
  { id: 'g09', slots: HAUPT, name: 'Bohnen-Tofu-Wrap mit Hummus', zutaten: [['kidney', 150], ['raeuchertofu', 50], ['wrap', 1], ['hummus', 50]], dazu: 'Salat, Tomaten, Mais' },
  { id: 'g10', slots: HAUPT, name: 'Weiße-Bohnen-Eintopf mit Räuchertofu', zutaten: [['weisseBohnen', 200], ['kartoffeln', 150], ['raeuchertofu', 80]], dazu: 'Möhren, Lauch, Majoran' },
  { id: 'g11', slots: HAUPT, name: 'Edamame-Nudelsalat mit Sesam', zutaten: [['vollkornnudeln', 60], ['edamame', 150]], dazu: 'Paprika, Frühlingszwiebel, Sesam, Sojasauce' },
  { id: 'g12', slots: HAUPT, name: 'Kartoffel-Tofu-Pfanne mit Spinat', zutaten: [['kartoffeln', 250], ['tofu', 180]], dazu: 'Spinat, Zwiebel, Paprikapulver' },
  { id: 'g13', slots: HAUPT, name: 'Rote-Linsen-Dal mit Reis', zutaten: [['roteLinsen', 70], ['vollkornreis', 50], ['sojajoghurt', 100]], dazu: 'Tomaten, Ingwer, Kurkuma, Koriander' },
  { id: 'g14', slots: HAUPT, name: 'Bulgursalat mit Kichererbsen und Edamame', zutaten: [['bulgur', 50], ['kichererbsen', 120], ['edamame', 80]], dazu: 'Petersilie, Tomaten, Gurke, Zitrone' },
  { id: 'g15', slots: HAUPT, name: 'Tempeh-Erdnuss-Pfanne mit Reis', zutaten: [['tempeh', 120], ['vollkornreis', 50], ['erdnussmus', 15]], dazu: 'Brokkoli, Paprika, Limette' },

  // ---- Zwischenmahlzeiten (feste Portion)
  { id: 's01', slots: S, name: 'Skyr mit Beeren', zutaten: [['skyr', 150]], dazu: 'Beeren' },
  { id: 's02', slots: S, name: 'Magerquark mit Beeren', zutaten: [['magerquark', 150]], dazu: 'Beeren' },
  { id: 's03', slots: S, name: 'Zwei gekochte Eier', zutaten: [['ei', 2]], dazu: 'Kresse' },
  { id: 's04', slots: S, name: 'Hüttenkäse mit Gurke', zutaten: [['huettenkaese', 150]], dazu: 'Gurke' },
  { id: 's05', slots: S, name: 'Edamame mit Salz', zutaten: [['edamame', 150]] },
  { id: 's06', slots: S, ersatz: true, name: 'Sojajoghurt mit Hanfsamen', zutaten: [['sojajoghurt', 150], ['hanfsamen', 15]] },
  { id: 's07', slots: S, name: 'Eine Handvoll Mandeln und ein Apfel', zutaten: [['mandeln', 25]], dazu: 'Apfel' },
  { id: 's08', slots: S, name: 'Hummus mit Gemüsesticks', zutaten: [['hummus', 80]], dazu: 'Möhren, Paprika' },
  { id: 's09', slots: S, name: 'Proteinshake mit Molkenprotein', zutaten: [['molkenprotein', 30]], dazu: 'Wasser', gruppe: 'shake' },
  { id: 's10', slots: S, ersatz: true, name: 'Proteinshake mit Erbsenprotein', zutaten: [['erbsenprotein', 30]], dazu: 'Wasser', gruppe: 'shake' },
  { id: 's11', slots: S, name: 'Geröstete Kichererbsen', zutaten: [['kichererbsen', 100]], dazu: 'Paprikapulver' },
  { id: 's12', slots: S, name: 'Räuchertofu-Würfel mit Gurke', zutaten: [['raeuchertofu', 100]], dazu: 'Gurke' },
  { id: 's13', slots: S, name: 'Ein Glas Milch oder Kakao', zutaten: [['milch', 300]], dazu: 'Kakaopulver nach Wunsch' },
  { id: 's14', slots: S, name: 'Käsewürfel mit Trauben', zutaten: [['kaese', 30]], dazu: 'Trauben' },
  { id: 's15', slots: S, name: 'Thunfisch auf Knäckebrot', zutaten: [['thunfisch', 60], ['knaeckebrot', 20]], dazu: 'Tomaten' },
  { id: 's16', slots: S, ersatz: true, name: 'Ein Glas Sojadrink oder Kakao', zutaten: [['sojadrink', 300]], dazu: 'Kakaopulver nach Wunsch' },
  { id: 's17', slots: S, name: 'Knäckebrot mit Erdnussmus', zutaten: [['knaeckebrot', 20], ['erdnussmus', 15]], dazu: 'Apfel' },
  { id: 's18', slots: S, ersatz: true, name: 'Sojajoghurt-Proteincreme', zutaten: [['sojajoghurt', 150], ['erbsenprotein', 15]], dazu: 'Beeren' },
  { id: 's19', slots: S, name: 'Gebratene Tempeh-Würfel', zutaten: [['tempeh', 60]], dazu: 'Sojasauce' },
  { id: 's20', slots: S, name: 'Weißer Bohnendip mit Gemüsesticks', zutaten: [['weisseBohnen', 100], ['tahin', 10]], dazu: 'Möhren, Gurke, Zitrone' },
  { id: 's21', slots: S, name: 'Bananenmilch mit Quark', zutaten: [['milch', 200], ['magerquark', 100]], dazu: 'Banane' },
  { id: 's22', slots: S, ersatz: true, name: 'Bananen-Sojashake mit Erdnussmus', zutaten: [['sojadrink', 250], ['erdnussmus', 15]], dazu: 'Banane' },
];
