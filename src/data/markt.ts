/**
 * Marktradar: Zulassungen, Markt, Preise, Kassenregeln, Lieferbarkeit, Studien.
 * Daten liegen als JSON in src/data/markt/, damit Menschen, die Redaktions-Routine und der
 * automatische Abruf (scripts/marktradar-fetch.mjs) sie ohne TypeScript-Kenntnis pflegen können.
 */
import radarJson from './markt/radar.json';
import zulassungenJson from './markt/zulassungen.json';
import preiseJson from './markt/preise.json';
import kassenJson from './markt/kassen.json';
import lieferbarkeitJson from './markt/lieferbarkeit.json';

export type RadarType = 'zulassung' | 'markt' | 'preis' | 'kasse' | 'lieferbarkeit' | 'studie';

export type RadarEintrag = {
  id: string;
  date: string;
  type: RadarType;
  /** Startseiten-Fassung ohne Markennamen von Arzneimitteln */
  teaser: string;
  title: string;
  summary: string;
  substances?: string[];
  source: { name: string; url: string };
  links?: { label: string; href: string }[];
  prominent?: boolean;
};

export const radarTypeLabel: Record<RadarType, string> = {
  zulassung: 'Zulassung',
  markt: 'Markt',
  preis: 'Preise',
  kasse: 'Kassen',
  lieferbarkeit: 'Lieferbarkeit',
  studie: 'Studie',
};

const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date);

export const radar = {
  stand: radarJson.stand,
  eintraege: (radarJson.eintraege as RadarEintrag[]).slice().sort(byDateDesc),
};

/** Für die Startseite: hervorgehobene Einträge zuerst, dann die neuesten. */
export function radarTeaser(n = 3): RadarEintrag[] {
  const e = radar.eintraege;
  const prominent = e.filter((x) => x.prominent);
  const rest = e.filter((x) => !x.prominent);
  return [...prominent, ...rest].slice(0, n).sort(byDateDesc);
}

/** Jüngstes Datum über alle Radar-Daten (für lastmod und „Stand“). */
export function radarLastmod(): string {
  const dates = [radarJson.stand, zulassungenJson.stand, preiseJson.stand, kassenJson.stand, lieferbarkeitJson.stand, ...radar.eintraege.map((x) => x.date)].filter(
    (d): d is string => typeof d === 'string' && d.length > 0,
  );
  return dates.sort().at(-1) ?? radarJson.stand;
}

export const zulassungen = zulassungenJson;
export const preise = preiseJson;
export const kassen = kassenJson;
export const lieferbarkeit = lieferbarkeitJson as {
  stand: string | null;
  status: string;
  quelle: { name: string; url: string };
  hinweis: string;
  /** von Hand geprüfter Stand, bleibt sichtbar, wenn der Abruf scheitert */
  manuell?: { stand: string; text: string; quelle?: { name: string; url: string } };
  wirkstoffe: { wirkstoff: string; treffer: number | null; zeilen: string[] }[];
  log: { date: string; text: string }[];
};

export const fmtDate = (d: string) => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
