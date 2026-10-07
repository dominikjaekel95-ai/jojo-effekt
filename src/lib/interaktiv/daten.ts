/**
 * Zahlen der interaktiven Elemente, jeweils mit Quelle aus src/data/sources.ts. Ändert sich eine Zahl in einer Quelle
 * oder im Artikel, hier mitändern. Nichts hier ist eine Dosierung oder Anleitung zum Absetzen.
 */

/* ---------- Wirkstoffe: Halbwertszeiten laut Fachinformation ---------- */
export type WirkstoffId = 'semaglutid' | 'tirzepatid' | 'liraglutid';
export interface Wirkstoff {
  id: WirkstoffId;
  name: string;
  /** Halbwertszeit in Tagen */
  hwzTage: number;
  hwzText: string;
  /** fünf Halbwertszeiten, als Text */
  abgebautText: string;
  /** mögliche Quellen, die erste im Artikel vorhandene wird zitiert */
  quellen: string[];
  /** Präparatenamen nur im Wissensbereich */
  praeparate: string;
}
export const wirkstoffe: Record<WirkstoffId, Wirkstoff> = {
  semaglutid: {
    id: 'semaglutid',
    name: 'Semaglutid',
    hwzTage: 7,
    hwzText: 'etwa eine Woche',
    abgebautText: 'nach etwa fünf Wochen',
    quellen: ['fachinfoWegovy', 'fachinfoOzempic', 'fachinfoRybelsus'],
    praeparate: 'Wegovy, Ozempic, Rybelsus',
  },
  tirzepatid: {
    id: 'tirzepatid',
    name: 'Tirzepatid',
    hwzTage: 5,
    hwzText: 'etwa fünf Tage',
    abgebautText: 'nach rund 25 Tagen',
    quellen: ['fachinfoMounjaro'],
    praeparate: 'Mounjaro',
  },
  liraglutid: {
    id: 'liraglutid',
    name: 'Liraglutid',
    hwzTage: 13 / 24,
    hwzText: 'etwa 13 Stunden',
    abgebautText: 'nach knapp drei Tagen',
    quellen: ['fachinfoSaxenda'],
    praeparate: 'Saxenda',
  },
};

/* ---------- STEP-1-Verlängerung (wilding2022ext), Körperzusammensetzung ---------- */
export const step1ext = {
  quelle: 'wilding2022ext',
  wocheDosis: 68,
  wocheEnde: 120,
  sema: { w68: -17.3, w120: -5.6 },
  placebo: { w68: -2.0, w120: -0.1 },
};
export const wu2025 = { quelle: 'wu2025', abWoche: 8, bisWoche: 20 };

export interface Zusammensetzung {
  id: string;
  studie: string;
  wirkstoff: string;
  fettfrei: number;
  text: string;
  quelle: string;
}
export const zusammensetzung: Record<string, Zusammensetzung> = {
  step1: {
    id: 'step1',
    studie: 'STEP 1, DXA-Substudie',
    wirkstoff: 'Semaglutid',
    fettfrei: 40,
    text: '140 Teilnehmende, 68 Wochen, exploratorische Analyse',
    quelle: 'wilding2021dxa',
  },
  surmount1: {
    id: 'surmount1',
    studie: 'SURMOUNT-1, DXA-Substudie',
    wirkstoff: 'Tirzepatid',
    fettfrei: 25,
    text: '160 Teilnehmende, 72 Wochen',
    quelle: 'look2025surmount1dxa',
  },
};

/* ---------- Weiterbehandeln oder Placebo: STEP 4 und SURMOUNT-4 ---------- */
export interface Gabelung {
  id: string;
  name: string;
  wirkstoff: string;
  wochen: number;
  weiter: number;
  placebo: number;
  vorher: string;
  quelle: string;
}
export const gabelungen: Record<string, Gabelung> = {
  step4: {
    id: 'step4',
    name: 'STEP 4',
    wirkstoff: 'Semaglutid',
    wochen: 48,
    weiter: -7.9,
    placebo: 6.9,
    vorher: 'Vorher 20 Wochen Semaglutid für alle.',
    quelle: 'rubino2021',
  },
  surmount4: {
    id: 'surmount4',
    name: 'SURMOUNT-4',
    wirkstoff: 'Tirzepatid',
    wochen: 52,
    weiter: -5.5,
    placebo: 14,
    vorher: 'Vorher 36 Wochen Tirzepatid für alle.',
    quelle: 'aronne2024',
  },
};

/* ---------- Zulassungsstudien: Wirkstoff gegenüber Placebo (mittlere Gewichtsänderung in %) ---------- */
export interface Zulassung {
  id: string;
  studie: string;
  praeparat: string;
  form: 'tablette' | 'spritze';
  wochen: number;
  wirk: number;
  placebo: number;
  quelle: string;
}
export const zulassungen: Record<string, Zulassung> = {
  oasis4: { id: 'oasis4', studie: 'OASIS 4', praeparat: 'Semaglutid-Tablette', form: 'tablette', wochen: 64, wirk: -13.6, placebo: -2.2, quelle: 'wharton2025oasis4' },
  step1: { id: 'step1', studie: 'STEP 1', praeparat: 'Semaglutid-Spritze', form: 'spritze', wochen: 68, wirk: -14.9, placebo: -2.4, quelle: 'wilding2021step1' },
  oasis1: { id: 'oasis1', studie: 'OASIS 1', praeparat: 'Semaglutid-Tablette, nicht vermarktet', form: 'tablette', wochen: 68, wirk: -15.1, placebo: -2.4, quelle: 'knop2023oasis1' },
  surmount1: { id: 'surmount1', studie: 'SURMOUNT-1', praeparat: 'Tirzepatid-Spritze', form: 'spritze', wochen: 72, wirk: -20.9, placebo: -3.1, quelle: 'jastreboff2022' },
  scale: { id: 'scale', studie: 'SCALE', praeparat: 'Liraglutid-Spritze', form: 'spritze', wochen: 56, wirk: -8.0, placebo: -2.6, quelle: 'pisunyer2015' },
};

/* ---------- S-LiTE (jensen2024): Unterschied der Wiederzunahme im Jahr nach Therapieende, kg ---------- */
export const slite = {
  quelle: 'jensen2024',
  zeilen: [
    { label: 'Nur Liraglutid gegenüber nur Training', wert: 6.0, ci: [2.1, 10.0] as [number, number], signifikant: true },
    { label: 'Nur Liraglutid gegenüber Training plus Liraglutid', wert: 2.5, ci: [-1.5, 6.5] as [number, number], signifikant: false },
  ],
};

/* ---------- Punktfelder ---------- */
export interface Punktgruppe {
  wert: string;
  label: string;
  an: number;
  /** zweite Stufe (z. B. „unter 50 nmol/l“), zusätzlich zu `an` */
  an2?: number;
  zahl: string;
  satz: string;
}
export interface Punktfeld {
  id: string;
  titel: string;
  basis: 100 | 1000;
  farbe: 'ink' | 'clay' | 'moss';
  gruppen: Punktgruppe[];
  wahlLabel?: string;
  legende?: [string, string?];
  fuss: string;
  quellen: string[];
}
export const punktfelder: Record<string, Punktfeld> = {
  absetzrate: {
    id: 'absetzrate',
    titel: 'Wie viele innerhalb eines Jahres absetzen',
    basis: 100,
    farbe: 'ink',
    wahlLabel: 'Gruppe',
    gruppen: [
      { wert: 'ohne', label: 'Ohne Typ-2-Diabetes', an: 65, zahl: '64,8', satz: 'der Menschen ohne Typ-2-Diabetes hatten ein Jahr nach Beginn der Therapie abgesetzt.' },
      { wert: 'alle', label: 'Alle', an: 54, zahl: '53,6', satz: 'der Menschen insgesamt, mit und ohne Typ-2-Diabetes, hatten ein Jahr nach Beginn der Therapie abgesetzt.' },
    ],
    fuss: 'US-Versorgungsdaten, Menschen mit Übergewicht oder Adipositas. Ein Punkt steht für einen Menschen; die Zahl der Punkte ist gerundet.',
    quellen: ['rodriguez2025'],
  },
  'stop-regain': {
    id: 'stop-regain',
    titel: 'Wer nach 18 Monaten 2,3 kg oder mehr wieder zugenommen hatte',
    basis: 100,
    farbe: 'clay',
    wahlLabel: 'Gruppe',
    gruppen: [
      { wert: 'zonen', label: 'Wiegen mit Zonen', an: 46, zahl: '45,7', satz: 'der persönlich betreuten Gruppe mit täglichem Wiegen und festen Zonen.' },
      { wert: 'kontrolle', label: 'Kontrollgruppe', an: 72, zahl: '72,4', satz: 'der Kontrollgruppe ohne dieses Programm.' },
    ],
    fuss: 'STOP-Regain-Studie, 314 Erwachsene nach mindestens 10 % Gewichtsverlust. Ein Punkt steht für einen Menschen; die Zahl der Punkte ist gerundet.',
    quellen: ['wing2006'],
  },
  eisen: {
    id: 'eisen',
    titel: 'Wer schon vor der Spritze zu wenig Eisen aufnahm',
    basis: 100,
    farbe: 'ink',
    wahlLabel: 'Gruppe',
    gruppen: [
      { wert: 'frauen', label: 'Frauen', an: 58, zahl: '58', satz: 'der Frauen lagen unter der empfohlenen Eisenzufuhr.' },
      { wert: 'maenner', label: 'Männer', an: 14, zahl: '14', satz: 'der Männer lagen unter der empfohlenen Eisenzufuhr.' },
    ],
    fuss: 'Nationale Verzehrsstudie II, Daten aus der Zeit vor GLP-1-Medikamenten. Ein Punkt steht für einen Menschen.',
    quellen: ['nvs2'],
  },
  magnesium: {
    id: 'magnesium',
    titel: 'Wer schon vor der Spritze zu wenig Magnesium aufnahm',
    basis: 100,
    farbe: 'ink',
    wahlLabel: 'Gruppe',
    gruppen: [
      { wert: 'frauen', label: 'Frauen', an: 29, zahl: '29', satz: 'der Frauen lagen unter der empfohlenen Magnesiumzufuhr.' },
      { wert: 'maenner', label: 'Männer', an: 26, zahl: '26', satz: 'der Männer lagen unter der empfohlenen Magnesiumzufuhr.' },
    ],
    fuss: 'Nationale Verzehrsstudie II, Daten aus der Zeit vor GLP-1-Medikamenten. Ein Punkt steht für einen Menschen.',
    quellen: ['nvs2'],
  },
  'vitamin-d': {
    id: 'vitamin-d',
    titel: 'Vitamin-D-Spiegel von 100 Erwachsenen in Deutschland',
    basis: 100,
    farbe: 'ink',
    gruppen: [
      { wert: 'alle', label: 'Erwachsene', an: 30, an2: 32, zahl: '30,2', satz: 'der Erwachsenen hatten einen Mangel unter 30 nmol/l, insgesamt 61,6 % lagen unter 50 nmol/l.' },
    ],
    legende: ['Mangel, unter 30 nmol/l', 'unter 50 nmol/l'],
    fuss: 'DEGS1-Studie des Robert Koch-Instituts mit fast 7.000 Erwachsenen; im Winter ist der Mangel häufiger als im Sommer. Ein Punkt steht für einen Menschen; die Zahl der Punkte ist gerundet.',
    quellen: ['rabenberg2015'],
  },
  b12: {
    id: 'b12',
    titel: 'Vitamin-B12-Mangel nach fünf Jahren Metformin oder Placebo',
    basis: 1000,
    farbe: 'ink',
    wahlLabel: 'Gruppe',
    gruppen: [
      { wert: 'metformin', label: 'Metformin', an: 43, zahl: '4,3', satz: 'der Teilnehmenden unter Metformin hatten nach fünf Jahren einen Mangel.' },
      { wert: 'placebo', label: 'Placebo', an: 23, zahl: '2,3', satz: 'der Teilnehmenden unter Placebo hatten nach fünf Jahren einen Mangel.' },
    ],
    fuss: 'Diabetes Prevention Program Outcomes Study. Ein Punkt steht für einen Menschen; das Risiko stieg mit der Dauer der Einnahme.',
    quellen: ['aroda2016'],
  },
};

/* ---------- Teller: Lebensmittel bis zum Tageswert (Werte aus den Artikeltabellen, BLS gerundet) ---------- */
export interface Speise {
  name: string;
  menge?: string;
  min: number;
  max?: number;
  hinweis?: string;
}
export interface Teller {
  id: string;
  titel: string;
  naehrstoff: string;
  einheit: string;
  dec: number;
  /** Ziel je Gruppe (z. B. Frauen/Männer); eine Gruppe = kein Umschalter */
  ziele: { wert: string; label: string; ziel: number; zielText: string }[];
  zielQuelle: string;
  speisen: Speise[];
  start: number[];
  speisenQuelle?: string;
  fuss: string;
  /** Tag statt Auswahl: Mahlzeiten mit Uhrzeit */
  tag?: boolean;
  /** Wort vor dem Ziel, z. B. „Tageswert“ */
  zielLabel?: string;
}
export const teller: Record<string, Teller> = {
  magnesium: {
    id: 'magnesium',
    titel: 'Wie viel Magnesium ein Tag mit kleinen Portionen liefert',
    naehrstoff: 'Magnesium',
    einheit: 'mg',
    dec: 0,
    ziele: [
      { wert: 'frauen', label: 'Frauen', ziel: 300, zielText: '300 mg' },
      { wert: 'maenner', label: 'Männer', ziel: 350, zielText: '350 mg' },
    ],
    zielQuelle: 'dgeReferenzwerte',
    speisen: [
      { name: 'Kürbiskerne', menge: '30 g', min: 160 },
      { name: 'Mandeln', menge: '30 g', min: 50 },
      { name: 'Haferflocken', menge: '50 g', min: 65 },
      { name: 'Vollkornbrot', menge: '2 Scheiben', min: 70 },
      { name: 'Linsen, gekocht', menge: '150 g', min: 50 },
      { name: 'Spinat, gegart', menge: '150 g', min: 90 },
      { name: 'Banane', menge: '1 Stück', min: 35 },
      { name: 'Mineralwasser', menge: '1 Liter', min: 20, max: 110, hinweis: 'je nach Sorte' },
    ],
    start: [2, 0, 7],
    speisenQuelle: 'bls',
    fuss: 'Werte aus dem Bundeslebensmittelschlüssel, gerundet. Tippe Lebensmittel an, um sie hinzuzufügen oder zu entfernen.',
  },
  'vitamin-c': {
    id: 'vitamin-c',
    titel: 'Wie schnell Vitamin C zusammenkommt',
    naehrstoff: 'Vitamin C',
    einheit: 'mg',
    dec: 0,
    ziele: [
      { wert: 'frauen', label: 'Frauen', ziel: 95, zielText: '95 mg' },
      { wert: 'maenner', label: 'Männer', ziel: 110, zielText: '110 mg' },
    ],
    zielQuelle: 'dgeReferenzwerte',
    speisen: [
      { name: 'Paprika, rot', menge: '100 g', min: 140 },
      { name: 'Brokkoli, gegart', menge: '150 g', min: 90 },
      { name: 'Erdbeeren', menge: '150 g', min: 90 },
      { name: 'Orange', menge: '1 Stück', min: 75 },
      { name: 'Kiwi', menge: '1 Stück', min: 70 },
      { name: 'Kartoffeln, gegart', menge: '200 g', min: 25 },
    ],
    start: [0],
    speisenQuelle: 'bls',
    fuss: 'Werte aus dem Bundeslebensmittelschlüssel, gerundet. Tippe Lebensmittel an, um sie hinzuzufügen oder zu entfernen.',
  },
  'omega-3': {
    id: 'omega-3',
    titel: 'Wie viel Fisch für eine Woche reicht',
    naehrstoff: 'EPA und DHA',
    einheit: 'g',
    dec: 2,
    zielLabel: 'Wochenwert',
    ziele: [{ wert: 'woche', label: 'Woche', ziel: 1.75, zielText: '1,75 g pro Woche (250 mg am Tag)' }],
    zielQuelle: 'efsa2010fats',
    speisen: [
      { name: 'Lachs', menge: '125 g', min: 2.5 },
      { name: 'Makrele', menge: '100 g', min: 2.5 },
      { name: 'Hering', menge: '100 g', min: 1.5 },
      { name: 'Forelle', menge: '125 g', min: 1 },
      { name: 'Thunfisch aus der Dose', menge: '100 g', min: 0.3 },
      { name: 'Walnüsse', menge: '30 g', min: 0, hinweis: 'ALA, kein EPA/DHA' },
      { name: 'Leinöl', menge: '1 EL', min: 0, hinweis: 'ALA, kein EPA/DHA' },
    ],
    start: [0],
    speisenQuelle: 'bls',
    fuss: 'Werte aus dem Bundeslebensmittelschlüssel, gerundet; Ziel aus 250 mg am Tag mal sieben. Tippe Lebensmittel an, um sie hinzuzufügen oder zu entfernen.',
  },
  b12: {
    id: 'b12',
    titel: 'Was ein Tag mit kleinen Portionen an Vitamin B12 liefert',
    naehrstoff: 'Vitamin B12',
    einheit: 'µg',
    dec: 1,
    ziele: [{ wert: 'tag', label: 'Tag', ziel: 4, zielText: '4 µg am Tag' }],
    zielQuelle: 'dgeReferenzwerte',
    speisen: [
      { name: 'Joghurt', menge: '150 g', min: 0.6 },
      { name: 'Ei', menge: '1 Stück', min: 1 },
      { name: 'Käse, Emmentaler', menge: '30 g', min: 0.9 },
      { name: 'Rindfleisch', menge: '125 g', min: 2.5 },
      { name: 'Lachs', menge: '125 g', min: 4 },
      { name: 'Rinderleber', menge: '100 g', min: 65 },
      { name: 'Hafer-, Soja-, Mandeldrink', menge: 'ohne Zusatz', min: 0 },
    ],
    start: [0, 1],
    speisenQuelle: 'bls',
    fuss: 'Werte aus dem Bundeslebensmittelschlüssel, gerundet. Tippe Lebensmittel an, um sie hinzuzufügen oder zu entfernen.',
  },
  ballaststoffe: {
    id: 'ballaststoffe',
    titel: 'Glucomannan im Vergleich mit 30 g Ballaststoffen',
    naehrstoff: 'Ballaststoffe',
    einheit: 'g',
    dec: 0,
    ziele: [{ wert: 'tag', label: 'Tag', ziel: 30, zielText: '30 g am Tag' }],
    zielQuelle: 'dgeBallaststoffe',
    speisen: [
      { name: 'Glucomannan', menge: 'Tagesmenge laut Angabe', min: 3 },
      { name: 'Linsen, gekocht', menge: '150 g', min: 8 },
      { name: 'Vollkornbrot', menge: '2 Scheiben', min: 8 },
      { name: 'Himbeeren', menge: '125 g', min: 6 },
      { name: 'Brokkoli, gegart', menge: '200 g', min: 6 },
      { name: 'Haferflocken', menge: '50 g', min: 5 },
      { name: 'Leinsamen, geschrotet', menge: '1 EL', min: 4 },
    ],
    start: [0],
    speisenQuelle: 'bls',
    fuss: 'Werte aus dem Bundeslebensmittelschlüssel, gerundet. Tippe Lebensmittel an, um sie hinzuzufügen oder zu entfernen.',
  },
  'protein-lebensmittel': {
    id: 'protein-lebensmittel',
    titel: 'Was 96 g Protein auf dem Teller bedeuten',
    naehrstoff: 'Protein',
    einheit: 'g',
    dec: 0,
    zielLabel: 'Ziel',
    ziele: [{ wert: 'tag', label: 'Tag', ziel: 96, zielText: '96 g am Tag bei 80 kg' }],
    zielQuelle: 'leidy2015',
    speisen: [
      { name: 'Skyr oder Magerquark', menge: '200 g', min: 22, max: 24 },
      { name: 'Hähnchenbrust', menge: '100 g', min: 23 },
      { name: 'Lachs', menge: '150 g', min: 30 },
      { name: 'Eier', menge: '2 Stück', min: 14 },
      { name: 'Tofu', menge: '150 g', min: 18, max: 24 },
      { name: 'Linsen, gekocht', menge: '200 g', min: 18 },
      { name: 'Hüttenkäse', menge: '150 g', min: 17 },
      { name: 'Molkenprotein-Pulver', menge: '30 g', min: 22, max: 25 },
      { name: 'Milch', menge: '250 ml', min: 8 },
    ],
    start: [0, 1, 3],
    speisenQuelle: 'bls',
    fuss: 'Ungefähre Werte pro Portion aus dem Bundeslebensmittelschlüssel, gerundet; 96 g entsprechen dem Ziel für 80 kg (1,2 g pro kg). Tippe Lebensmittel an oder ab.',
  },
  'protein-tag-muskeln': {
    id: 'protein-tag-muskeln',
    titel: 'Ein Tag mit wenig Appetit, aber genug Protein',
    naehrstoff: 'Protein',
    einheit: 'g',
    dec: 0,
    zielLabel: 'Ziel',
    ziele: [{ wert: 'tag', label: 'Tag', ziel: 96, zielText: '96 g bei 80 kg' }],
    zielQuelle: 'leidy2015',
    speisen: [
      { name: 'Morgens', menge: '200 g Skyr mit Beeren', min: 22 },
      { name: 'Mittags', menge: 'Linsensuppe mit 100 g Hähnchen oder Tofu', min: 25, max: 30 },
      { name: 'Nachmittags', menge: 'Protein-Shake mit Milch', min: 25, max: 30 },
      { name: 'Abends', menge: '150 g Fisch oder 2 Eier mit 150 g Hüttenkäse', min: 30 },
    ],
    start: [0, 1, 2, 3],
    tag: true,
    fuss: 'Beispiel aus der Tabelle unten im Artikel, ungefähre Werte. Tippe eine Mahlzeit an, um sie zu entfernen und zu sehen, was dann fehlt.',
  },
  'protein-tag-ernaehrung': {
    id: 'protein-tag-ernaehrung',
    titel: 'Ein Tag nach der Spritze: 80 kg, Ziel 96 g Protein',
    naehrstoff: 'Protein',
    einheit: 'g',
    dec: 0,
    zielLabel: 'Ziel',
    ziele: [{ wert: 'tag', label: 'Tag', ziel: 96, zielText: '96 g bei 80 kg' }],
    zielQuelle: 'leidy2015',
    speisen: [
      { name: 'Morgens', menge: 'Skyr mit Beeren und Haferflocken', min: 24 },
      { name: 'Mittags', menge: 'Salat oder Gemüse mit 120 g Hähnchen, Fisch oder Tofu', min: 30 },
      { name: 'Nachmittags', menge: 'Hüttenkäse oder Protein-Shake, ein Apfel', min: 20 },
      { name: 'Abends', menge: 'Linsen- oder Bohneneintopf, 2 Eier oder 150 g Fisch', min: 30 },
    ],
    start: [0, 1, 2, 3],
    tag: true,
    fuss: 'Beispiel aus der Tabelle unten, ungefähre Werte. Tippe eine Mahlzeit an, um sie zu entfernen und zu sehen, was dann fehlt.',
  },
};

/* ---------- Vergleiche als Balken ---------- */
export interface Balken {
  label: string;
  sub?: string;
  wert: number;
  /** Spanne statt Einzelwert */
  bis?: number;
  text: string;
  farbe: 'ink' | 'clay' | 'moss' | 'grau' | 'sand';
  /** zweiter, grauer Wert (Placebo) */
  placebo?: number;
  placeboBis?: number;
  placeboText?: string;
  blass?: boolean;
  /** eigene Quelle dieses Balkens (sonst die erste des Vergleichs) */
  quelle?: string;
}
export interface Vergleich {
  id: string;
  titel: string;
  unter?: string;
  einheit: string;
  min: number;
  max: number;
  ticks: number[];
  gruppen: { titel?: string; balken: Balken[] }[];
  fuss: string;
  quellen: string[];
}
export const vergleiche: Record<string, Vergleich> = {
  tchang: {
    id: 'tchang',
    titel: 'Gewichtsabnahme unter Tirzepatid nach Menopausenstatus',
    unter: 'SURMOUNT-1, Woche 72, Frauen',
    einheit: '%',
    min: 0,
    max: 30,
    ticks: [0, 10, 20, 30],
    gruppen: [
      {
        balken: [
          { label: 'Vor den Wechseljahren', wert: 26, text: '26 %', farbe: 'ink', placebo: 2, placeboBis: 3, placeboText: 'Placebo 2 bis 3 %' },
          { label: 'Während der Wechseljahre', wert: 23, text: '23 %', farbe: 'ink', placebo: 2, placeboBis: 3, placeboText: 'Placebo 2 bis 3 %' },
          { label: 'Nach den Wechseljahren', wert: 23, text: '23 %', farbe: 'ink', placebo: 2, placeboBis: 3, placeboText: 'Placebo 2 bis 3 %' },
        ],
      },
    ],
    fuss: 'Nachträgliche Auswertung von 2542 Frauen aus SURMOUNT-1, -3 und -4; gezeigt sind die Werte aus SURMOUNT-1.',
    quellen: ['tchang2025'],
  },
  villareal: {
    id: 'villareal',
    titel: 'Abnehmen ab 65: Ausdauer- oder Krafttraining',
    unter: '160 Erwachsene mit Adipositas, Diät mit 9 % Gewichtsverlust',
    einheit: '',
    min: 0,
    max: 3,
    ticks: [0, 1, 2, 3],
    gruppen: [
      {
        titel: 'Verlust an fettfreier Masse, kg',
        balken: [
          { label: 'Mit Ausdauertraining', wert: 2.7, text: '2,7 kg', farbe: 'clay' },
          { label: 'Mit Krafttraining', wert: 1.0, text: '1,0 kg', farbe: 'moss' },
        ],
      },
      {
        titel: 'Verlust an Knochendichte der Hüfte, %',
        balken: [
          { label: 'Mit Ausdauertraining', wert: 2.6, text: '2,6 %', farbe: 'clay' },
          { label: 'Mit Krafttraining', wert: 1, text: 'unter 1 %, nicht signifikant', farbe: 'moss', blass: true },
        ],
      },
    ],
    fuss: 'Randomisierte Studie; die Gruppe mit Krafttraining verlor an der Hüfte unter 1 % Knochendichte.',
    quellen: ['villareal2017'],
  },
  mason: {
    id: 'mason',
    titel: 'Gewicht nach den Feiertagen',
    unter: '272 Erwachsene, zwei Weihnachtsperioden',
    einheit: 'kg',
    min: -0.3,
    max: 0.5,
    ticks: [-0.2, 0, 0.2, 0.4],
    gruppen: [
      {
        balken: [
          { label: 'Wiegen ab zweimal pro Woche, notieren, zehn Tipps', wert: -0.13, text: '−0,13 kg', farbe: 'moss' },
          { label: 'Vergleichsgruppe mit Faltblatt', wert: 0.37, text: '+0,37 kg', farbe: 'clay' },
        ],
      },
    ],
    fuss: 'Randomisierte Studie; Unterschied zwischen den Gruppen 0,49 kg.',
    quellen: ['mason2018'],
  },
  anpassung: {
    id: 'anpassung',
    titel: 'Um wie viel der Verbrauch unter dem erwarteten Wert lag',
    unter: 'kcal am Tag, nach Gewichtsverlust',
    einheit: 'kcal',
    min: 0,
    max: 600,
    ticks: [0, 200, 400, 600],
    gruppen: [
      {
        balken: [
          { label: 'Nach etwa 14 kg Abnahme, Frauen', sub: 'Ruheverbrauch, direkt danach', wert: 92, text: '92 kcal', farbe: 'clay', quelle: 'martins2020' },
          { label: 'Dieselben Frauen, nach vier Wochen stabil', sub: 'Ruheverbrauch', wert: 38, text: '38 kcal', farbe: 'clay', quelle: 'martins2020' },
          { label: 'Nach 10 % Gewichtsverlust', sub: 'Gesamtverbrauch, Übersichtsarbeit', wert: 300, bis: 400, text: '300 bis 400 kcal', farbe: 'clay', quelle: 'rosenbaum2010' },
          { label: 'Sechs Jahre nach extremem Verlust', sub: 'Ruheverbrauch, 14 Personen', wert: 500, text: 'rund 500 kcal', farbe: 'clay', quelle: 'fothergill2016' },
        ],
      },
    ],
    fuss: 'Verschiedene Studien und Messmethoden; Mittelwerte aus kleinen Messreihen.',
    quellen: ['martins2020', 'rosenbaum2010', 'fothergill2016'],
  },
};
