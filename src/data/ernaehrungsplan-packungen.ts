/**
 * Ernährungsplan, nur Anzeige: Packungen für die Einkaufsliste im PDF (src/lib/ernaehrungsplan-druck.ts).
 * Der Generator (ernaehrungsplan.ts) rechnet weiter in Gramm, Millilitern und Stück; hier steht nur, wie man die Menge
 * im Supermarkt kauft. Die Einkaufsmenge wird auf ganze Packungen aufgerundet, die genaue Menge steht klein dahinter.
 *
 * Nur übliche Supermarktgrößen. Wo Packungen stark schwanken (frisches Fleisch und Fisch, Käse, Garnelen, Edamame),
 * steht keine Packung: Dann zeigt die Liste wie bisher die Grammzahl, auf 50 g aufgerundet.
 * `groessen`: mögliche Packungsgrößen (aufsteigend) in der Einheit der Zutat. Gewählt wird die kleinste, die reicht;
 * reicht keine, mehrere der größten. `zeigen: false`: Größe schwankt (Gläser, Pulver), die Liste nennt nur „1 Glas“.
 * `name`: kürzerer Name für die Einkaufsliste (die Packungsart sagt schon „Dose“). `zusatz`: steht hinter der Größe
 * (Dosen: Abtropfgewicht, wie die Mengen im Plan).
 */
import type { ZutatKey } from './ernaehrungsplan-rezepte.ts';

export type PackArt = 'Becher' | 'Packung' | 'Dose' | 'Glas' | 'Beutel' | 'Kopf';
export interface Packung {
  art: PackArt;
  groessen: number[];
  zeigen?: boolean;
  name?: string;
  /** Name im laktosefreien Plan (nur Zutaten mit `laktose: 'ersetzbar'`) */
  nameLaktosefrei?: string;
  zusatz?: string;
  /** Größe nur ungefähr (Gemüse): „etwa 500 g“ */
  etwa?: boolean;
}

export const packArtMehrzahl: Record<PackArt, string> = {
  Becher: 'Becher',
  Packung: 'Packungen',
  Dose: 'Dosen',
  Glas: 'Gläser',
  Beutel: 'Beutel',
  Kopf: 'Köpfe',
};

export const packungen: Partial<Record<ZutatKey, Packung>> = {
  // Kühlregal
  magerquark: { art: 'Becher', groessen: [250, 500], nameLaktosefrei: 'laktosefreier Magerquark' },
  skyr: { art: 'Becher', groessen: [500] },
  joghurt: { art: 'Becher', groessen: [500], nameLaktosefrei: 'laktosefreier Naturjoghurt (1,5 %)' },
  milch: { art: 'Packung', groessen: [1000], nameLaktosefrei: 'laktosefreie Milch (1,5 %)' },
  huettenkaese: { art: 'Becher', groessen: [200] },
  feta: { art: 'Packung', groessen: [200] },
  ei: { art: 'Packung', groessen: [6, 10], name: 'Eier (Größe M)' },
  tofu: { art: 'Packung', groessen: [200] },
  raeuchertofu: { art: 'Packung', groessen: [200] },
  tempeh: { art: 'Packung', groessen: [200] },
  sojajoghurt: { art: 'Becher', groessen: [500] },
  sojadrink: { art: 'Packung', groessen: [1000] },
  hummus: { art: 'Becher', groessen: [200] },
  // Fleisch und Fisch (nur, wo die Packung üblich ist)
  lachs: { art: 'Packung', groessen: [250], zusatz: '(2 Filets)' },
  raeucherlachs: { art: 'Packung', groessen: [100] },
  // Brot
  vollkornbrot: { art: 'Packung', groessen: [500] },
  knaeckebrot: { art: 'Packung', groessen: [250], zeigen: false },
  wrap: { art: 'Packung', groessen: [6], name: 'Vollkorn-Wraps' },
  // Trockenware
  haferflocken: { art: 'Packung', groessen: [500] },
  roteLinsen: { art: 'Packung', groessen: [500], name: 'Rote Linsen' },
  sojagranulat: { art: 'Packung', groessen: [200], zeigen: false, name: 'Sojagranulat' },
  quinoa: { art: 'Packung', groessen: [400], zeigen: false, name: 'Quinoa' },
  bulgur: { art: 'Packung', groessen: [500], name: 'Bulgur' },
  vollkornreis: { art: 'Packung', groessen: [500], name: 'Vollkornreis' },
  vollkornnudeln: { art: 'Packung', groessen: [500], name: 'Vollkornnudeln' },
  reisnudeln: { art: 'Packung', groessen: [250], zeigen: false, name: 'Reisnudeln' },
  // Gläser und Dosen: Abtropfgewicht, wie die Mengen im Plan
  linsenGekocht: { art: 'Dose', groessen: [240], name: 'Linsen, gekocht', zusatz: 'abgetropft' },
  kichererbsen: { art: 'Dose', groessen: [240], name: 'Kichererbsen', zusatz: 'abgetropft' },
  kidney: { art: 'Dose', groessen: [250], name: 'Kidneybohnen', zusatz: 'abgetropft' },
  weisseBohnen: { art: 'Dose', groessen: [240], name: 'Weiße Bohnen', zusatz: 'abgetropft' },
  thunfisch: { art: 'Dose', groessen: [140], name: 'Thunfisch im eigenen Saft', zusatz: 'abgetropft' },
  // Nüsse, Saaten, Mus
  mandeln: { art: 'Packung', groessen: [200] },
  erdnussmus: { art: 'Glas', groessen: [250], zeigen: false },
  tahin: { art: 'Glas', groessen: [250], zeigen: false },
  hanfsamen: { art: 'Packung', groessen: [200], zeigen: false },
  // Gemüse mit Menge
  kartoffeln: { art: 'Beutel', groessen: [1000, 1500, 2000, 2500] },
  brokkoli: { art: 'Kopf', groessen: [500], etwa: true },
  // Proteinpulver
  molkenprotein: { art: 'Packung', groessen: [500], zeigen: false },
  erbsenprotein: { art: 'Packung', groessen: [500], zeigen: false },
};

/** Abteilungen der Einkaufsliste in der Reihenfolge eines Supermarkts (Obst und Gemüse stehen getrennt, mit „dazu“). */
export const abteilungen = [
  ['kuehl', 'Kühlregal'],
  ['fleischfisch', 'Fleisch und Fisch'],
  ['tk', 'Tiefkühl'],
  ['brot', 'Brot'],
  ['trocken', 'Getreide, Nudeln, Linsen'],
  ['konserve', 'Gläser und Dosen'],
  ['nuesse', 'Nüsse, Saaten, Mus'],
  ['sonstiges', 'Sonstiges'],
] as const;

/** „dazu“-Angaben, die man meist im Vorrat hat (Gewürze, Öl, Saucen, Dosen): stehen als eine Zeile, ohne Kästchen. */
export const vorrat = new Set([
  'Currypulver', 'Kakaopulver nach Wunsch', 'Kapern', 'Kreuzkümmel', 'Kurkuma', 'Leinöl', 'Mais', 'Majoran', 'Oliven',
  'Olivenöl', 'Oregano', 'Paprikapulver', 'passierte Tomaten', 'Senf', 'Senf-Dressing', 'Sesam', 'Sojasauce', 'Zimt',
]);

/** Einkaufsnamen für „dazu“-Angaben, die als Gericht formuliert sind (zusammengelegt mit gleichen Einträgen). */
export const dazuEinkauf: Record<string, string> = {
  Gurkensalat: 'Gurke',
  Salat: 'Blattsalat',
  'Senf-Dressing': 'Senf',
  'Kakaopulver nach Wunsch': 'Kakaopulver',
};
