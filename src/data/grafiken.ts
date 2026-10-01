/**
 * Register der Studien-Grafiken unter public/grafiken/ (erzeugt von scripts/grafiken.mjs, `npm run grafiken`).
 * Die Seite /grafiken/ listet die Einträge mit Download, Einbettungscode und Quellen. Alle Zahlen stammen aus
 * src/data/sources.ts; `sources` nennt die IDs. Alternativen (gleiche Daten, andere Form) hängen über `variantOf`
 * am Haupteintrag und werden auf der Seite als Varianten angeboten.
 */
export interface Grafik {
  /** Dateiname ohne Endung; SVG und PNG liegen unter /grafiken/<id>.svg bzw. .png */
  id: string;
  title: string;
  subtitle: string;
  /** Alt-Text: beschreibt Form und Zahlen, damit die Grafik auch ohne Bild verständlich ist */
  alt: string;
  /** Quellen-IDs aus src/data/sources.ts in Nennreihenfolge */
  sources: string[];
  /** Seiten, auf denen die Grafik eingebunden ist */
  used: { href: string; label: string }[];
  /** Haupteintrag, zu dem diese Grafik eine Variante ist */
  variantOf?: string;
  /** true = wird aus src/data/markt/preise.json erzeugt und ändert sich mit jeder Erhebung */
  monatlich?: boolean;
}

export const grafiken: Grafik[] = [
  {
    id: 'absetzkurve-step-1',
    title: 'Gewicht nach dem Absetzen der Abnehmspritze',
    subtitle: 'Mittlere Gewichtsänderung gegenüber dem Start: 68 Wochen Semaglutid, danach 52 Wochen ohne Medikament (STEP-1-Verlängerung)',
    alt: 'Liniendiagramm: Unter Semaglutid 2,4 mg sinkt das Gewicht in 68 Wochen im Mittel um 17,3 Prozent, unter Placebo um 2,0 Prozent. In den 52 Wochen nach dem Absetzen steigt es wieder; nach insgesamt 120 Wochen liegt es bei minus 5,6 Prozent (Semaglutid) und minus 0,1 Prozent (Placebo). Zwei Drittel des Verlusts sind nach einem Jahr ohne Medikament wieder da.',
    sources: ['wilding2022ext'],
    used: [{ href: '/wissen/abnehmspritze-absetzen/', label: 'Abnehmspritze absetzen' }, { href: '/', label: 'Startseite' }],
  },
  {
    id: 'absetzkurve-step-1-saeulen',
    title: 'Was nach dem Absetzen bleibt: ein Drittel',
    subtitle: 'Dieselben Daten als zwei Säulen: verloren, zurück, geblieben',
    alt: 'Zwei Säulen: Nach 68 Wochen Semaglutid sind im Mittel 17,3 Prozent des Gewichts verloren. Ein Jahr nach dem Absetzen sind 11,6 Prozentpunkte wieder zurück, 5,6 Prozent bleiben; das entspricht zwei Dritteln des Verlusts, die zurückkommen.',
    sources: ['wilding2022ext'],
    used: [{ href: '/wissen/jojo-effekt-abnehmspritze/', label: 'Jojo-Effekt nach der Abnehmspritze' }],
    variantOf: 'absetzkurve-step-1',
  },
  {
    id: 'absetzkurve-step-1-kompakt',
    title: 'Die Absetzkurve in drei Zahlen',
    subtitle: 'Dieselben Daten als Kennzahlen, zum Teilen',
    alt: 'Drei Kennzahlen aus der STEP-1-Verlängerung: minus 17,3 Prozent Gewicht nach 68 Wochen Semaglutid, minus 5,6 Prozent ein Jahr nach dem Absetzen, zwei Drittel des Verlusts in 52 Wochen zurück. Placebo: minus 2,0 und minus 0,1 Prozent.',
    sources: ['wilding2022ext'],
    used: [],
    variantOf: 'absetzkurve-step-1',
  },
  {
    id: 'zeitachse-nach-letzter-dosis',
    title: 'Die ersten 20 Wochen nach der letzten Dosis',
    subtitle: 'Wirkstoffabbau, Appetit, messbare Zunahme und Kontrolltermin auf einer Zeitachse',
    alt: 'Zeitachse über 20 Wochen nach der letzten Dosis einer Abnehmspritze: Der Wirkstoff ist nach etwa fünf bis sieben Wochen weitgehend abgebaut, der Appetit kehrt ab Woche 2 bis 5 zurück, die Gewichtszunahme ist ab Woche 8 messbar und steigt bis etwa Woche 20. Ein Kontrolltermin 8 bis 12 Wochen nach der letzten Dosis ist markiert.',
    sources: ['fachinfoWegovy', 'fachinfoMounjaro', 'wu2025'],
    used: [
      { href: '/wissen/abnehmspritze-absetzen/', label: 'Abnehmspritze absetzen' },
      { href: '/wissen/', label: 'Wissensbereich' },
    ],
  },
  {
    id: 'zeitachse-phasen',
    title: 'Nach der letzten Dosis: vier Phasen',
    subtitle: 'Dieselbe Zeitachse als vier Karten',
    alt: 'Vier Phasen nach der letzten Dosis einer Abnehmspritze: Woche 1 bis 2 noch wenig Veränderung, Woche 2 bis 5 kehrt der Appetit zurück, Woche 5 bis 8 ist der Wirkstoff praktisch abgebaut, ab Woche 8 ist die Gewichtszunahme messbar und steigt bis etwa Woche 20.',
    sources: ['fachinfoWegovy', 'fachinfoMounjaro', 'wu2025'],
    used: [{ href: '/wissen/gewicht-halten-nach-abnehmspritze/', label: 'Gewicht halten nach der Abnehmspritze' }],
    variantOf: 'zeitachse-nach-letzter-dosis',
  },
  {
    id: 'koerperzusammensetzung-step-1',
    title: 'Was beim Abnehmen mit Semaglutid verloren geht',
    subtitle: 'Anteil von Fettmasse und fettfreier Masse am Gewichtsverlust, STEP-1-Substudie mit DXA-Messung',
    alt: 'Balken, der den Gewichtsverlust unter Semaglutid aufteilt: rund 60 Prozent Fettmasse und rund 40 Prozent fettfreie Masse, also Muskeln, Organe, Knochen und Wasser. Krafttraining und 1,2 bis 1,6 Gramm Protein pro Kilogramm halten den Anteil klein.',
    sources: ['wilding2021dxa', 'who2020', 'leidy2015'],
    used: [{ href: '/wissen/muskelabbau-abnehmspritze/', label: 'Muskelabbau bei der Abnehmspritze' }],
  },
  {
    id: 'training-s-lite',
    title: 'Training entscheidet, was nach dem Absetzen bleibt',
    subtitle: 'S-LiTE-Nachbeobachtung: Zunahme ein Jahr nach Therapieende, Unterschied zur Trainingsgruppe',
    alt: 'Balkendiagramm aus der S-LiTE-Nachbeobachtung: Teilnehmende mit Trainingsprogramm hielten ein Jahr nach Therapieende Gewicht und Körperzusammensetzung. Nach Liraglutid allein lag die Zunahme 6,0 Kilogramm höher als nach Training.',
    sources: ['jensen2024'],
    used: [
      { href: '/wissen/krafttraining-nach-abnehmspritze/', label: 'Krafttraining nach der Abnehmspritze' },
      { href: '/wissen/gewicht-halten-nach-abnehmspritze/', label: 'Gewicht halten nach der Abnehmspritze' },
      { href: '/', label: 'Startseite' },
    ],
  },
  {
    id: 'wirksamkeit-zulassungsstudien',
    title: 'Wie viel Gewicht in den Zulassungsstudien verloren ging',
    subtitle: 'Mittlere Änderung des Körpergewichts, Wirkstoff gegenüber Placebo, fünf Zulassungsstudien',
    alt: 'Balkendiagramm der Zulassungsstudien: STEP 1 minus 14,9 Prozent gegenüber minus 2,4 Prozent unter Placebo; OASIS 4 minus 13,6 gegenüber minus 2,2; OASIS 1 minus 15,1 gegenüber minus 2,4; SURMOUNT-1 minus 20,9 gegenüber minus 3,1; SCALE minus 8,0 gegenüber minus 2,6 Prozent. Kein direkter Vergleich zwischen den Studien.',
    sources: ['wilding2021step1', 'wharton2025oasis4', 'knop2023oasis1', 'jastreboff2022', 'pisunyer2015'],
    used: [{ href: '/wissen/abnehmpille-oder-spritze/', label: 'Abnehmpille oder Spritze' }],
  },
  {
    id: 'weiter-oder-placebo',
    title: 'Weiter behandeln oder absetzen: zwei randomisierte Studien',
    subtitle: 'Gewicht nach dem Wechsel auf Placebo gegenüber Fortführung in STEP 4 und SURMOUNT-4',
    alt: 'Balkendiagramm: In STEP 4 nahmen Teilnehmende unter fortgeführtem Semaglutid in 48 Wochen weitere 7,9 Prozent ab, nach dem Wechsel auf Placebo nahmen sie 6,9 Prozent zu. In SURMOUNT-4 nahmen Teilnehmende unter fortgeführtem Tirzepatid in 52 Wochen weitere 5,5 Prozent ab, nach dem Wechsel auf Placebo nahmen sie 14 Prozent zu.',
    sources: ['rubino2021', 'aronne2024'],
    used: [
      { href: '/wissen/jojo-effekt-abnehmspritze/', label: 'Jojo-Effekt nach der Abnehmspritze' },
      { href: '/wissen/wegovy-absetzen/', label: 'Wegovy absetzen' },
    ],
  },
  {
    id: 'halbwertszeiten-praeparate',
    title: 'Wie lange die Abnehmspritze nach der letzten Dosis nachwirkt',
    subtitle: 'Halbwertszeit laut Fachinformation und die Zeit bis zum weitgehenden Abbau, drei Wirkstoffe',
    alt: 'Balkendiagramm der Halbwertszeiten: Semaglutid etwa eine Woche, weitgehend abgebaut nach etwa fünf Wochen; Tirzepatid etwa fünf Tage, abgebaut nach etwa 25 Tagen; Liraglutid etwa 13 Stunden, abgebaut nach etwa drei Tagen. Faustregel: fünf Halbwertszeiten.',
    sources: ['fachinfoWegovy', 'fachinfoOzempic', 'fachinfoRybelsus', 'fachinfoMounjaro', 'fachinfoSaxenda'],
    used: [
      { href: '/wissen/abnehmpille-oder-spritze/', label: 'Abnehmpille oder Spritze' },
      { href: '/wissen/mounjaro-absetzen/', label: 'Mounjaro absetzen' },
    ],
  },
  {
    id: 'warum-das-gewicht-zurueckkommt',
    title: 'Warum das Gewicht nach dem Absetzen zurückkommt',
    subtitle: 'Vier belegte Mechanismen hinter dem Jojo-Effekt nach der Abnehmspritze',
    alt: 'Vier Karten mit den Mechanismen des Jojo-Effekts nach der Abnehmspritze: Die Appetitbremse fällt nach fünf bis sieben Wochen weg; die Hungerhormone Ghrelin und Leptin bleiben noch ein Jahr nach einer Diät verschoben; der Ruheenergieverbrauch blieb in einer Studie sechs Jahre nach starkem Gewichtsverlust abgesenkt; rund 40 Prozent des Gewichtsverlusts unter Semaglutid entfielen auf fettfreie Masse.',
    sources: ['fachinfoWegovy', 'sumithran2011', 'fothergill2016', 'wilding2021dxa'],
    used: [{ href: '/wissen/jojo-effekt-abnehmspritze/', label: 'Jojo-Effekt nach der Abnehmspritze' }],
  },
  {
    id: 'proteinbedarf-nach-abnehmspritze',
    title: 'Wie viel Protein nach der Abnehmspritze',
    subtitle: 'Tagesmenge nach Körpergewicht im Zielkorridor von 1,2 bis 1,6 g pro kg',
    alt: 'Balkendiagramm des Proteinbedarfs von 1,2 bis 1,6 Gramm pro Kilogramm Körpergewicht: bei 60 Kilogramm 72 bis 96 Gramm am Tag, bei 70 Kilogramm 84 bis 112, bei 80 Kilogramm 96 bis 128, bei 90 Kilogramm 108 bis 144, bei 100 Kilogramm 120 bis 160 Gramm. Verteilt auf drei bis vier Mahlzeiten sind das 25 bis 35 Gramm pro Mahlzeit.',
    sources: ['leidy2015'],
    used: [
      { href: '/wissen/protein-abnehmspritze/', label: 'Protein bei der Abnehmspritze' },
      { href: '/wissen/ernaehrung-nach-abnehmspritze/', label: 'Ernährung nach der Abnehmspritze' },
    ],
  },
  {
    id: 'haarausfall-zeitverlauf',
    title: 'Haarausfall nach schnellem Gewichtsverlust: der typische Verlauf',
    subtitle: 'Telogenes Effluvium in Monaten nach dem Auslöser, mit dem, was sich beeinflussen lässt',
    alt: 'Zeitachse des telogenen Effluviums: Nach schnellem Gewichtsverlust wechseln viele Haare in die Ruhephase, zwei bis drei Monate später beginnt diffuser Haarausfall, der in der Regel innerhalb von etwa sechs Monaten abklingt; danach wachsen die Haare nach. Beeinflussbar sind Protein, Eisenwert, Zink und Biotin bei Lücke; länger als sechs Monate, fleckig oder mit Müdigkeit ärztlich abklären.',
    sources: ['malkud2015', 'leidy2015', 'almandoz2024'],
    used: [{ href: '/wissen/haarausfall-abnehmspritze/', label: 'Haarausfall bei der Abnehmspritze' }],
  },
  {
    id: 'abnehmpille-belegt-und-offen',
    title: 'Abnehmpille absetzen: was belegt ist und was fehlt',
    subtitle: 'Die Zulassungsstudie OASIS 4 der Semaglutid-Tablette gegenüber der Datenlage für die Zeit nach dem Absetzen',
    alt: 'Zwei Felder: Links die Zulassungsstudie OASIS 4 der Semaglutid-Tablette mit minus 13,6 Prozent Gewicht gegenüber minus 2,2 Prozent unter Placebo nach 64 Wochen, bei durchgehender Einnahme minus 16,6 Prozent. Rechts der offene Punkt: Es gibt keine Studie zur Wiederzunahme nach dem Absetzen der Tablette; übertragbar mit Vorbehalt sind die Halbwertszeit von etwa einer Woche und die Spritzen-Daten, nach denen zwei Drittel des Verlusts nach einem Jahr zurück sind.',
    sources: ['wharton2025oasis4', 'fachinfoRybelsus', 'wilding2022ext', 'wu2025'],
    used: [{ href: '/wissen/abnehmpille-absetzen/', label: 'Abnehmpille absetzen' }],
  },
  {
    id: 'preise-im-monat',
    title: 'Was Abnehmspritzen und die Tablette im Monat kosten',
    subtitle: 'Apothekenverkaufspreise für Selbstzahler als Größenordnung, Stand aus der monatlichen Erhebung im Marktradar',
    alt: 'Balkendiagramm der monatlichen Selbstzahlerpreise für Abnehmspritzen und die Abnehmtablette als Größenordnung, gerundet auf 5 Euro, mit Stand der Erhebung; Zeilen laut Marktradar.',
    sources: ['medipreis2026', 'tabletteApotheken2026'],
    used: [{ href: '/marktradar/#preise', label: 'Marktradar: Preise' }],
    monatlich: true,
  },
];

export const hauptgrafiken = grafiken.filter((g) => !g.variantOf);
export const varianten = (id: string) => grafiken.filter((g) => g.variantOf === id);
