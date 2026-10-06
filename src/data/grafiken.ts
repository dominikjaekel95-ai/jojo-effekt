/**
 * Register der Studien-Grafiken unter public/grafiken/ (erzeugt von scripts/grafiken.mjs, `npm run grafiken`).
 * Die Seite /grafiken/ listet die Einträge mit Download, Einbettungscode und Quellen. Alle Zahlen stammen aus
 * src/data/sources.ts; `sources` nennt die IDs. Alternativen (gleiche Daten, andere Form) hängen über `variantOf`
 * am Haupteintrag und werden auf der Seite als Varianten angeboten.
 */
import { preise, fmtDate } from './markt';

/** Präparate, die laut preise.json bei Typ-2-Diabetes Kassenleistung sind (für den Alt-Text der Preisgrafik) */
const kassenPraeparate = preise.zeilen.filter((z) => /Kassenleistung/.test(z.hinweis)).map((z) => z.praeparat.split(',')[0]);

export interface Grafik {
  /** Dateiname ohne Endung; SVG und PNG liegen unter /grafiken/<id>.svg bzw. .png */
  id: string;
  title: string;
  subtitle: string;
  /** Alt-Text: beschreibt Form und Zahlen, damit die Grafik auch ohne Bild verständlich ist */
  alt: string;
  /** Quellen-IDs aus src/data/sources.ts in Nennreihenfolge */
  sources: string[];
  /** Seiten, auf denen die Grafik eingebunden ist (speist die Bild-Sitemap; nur eintragen, wenn die Grafik dort wirklich steht) */
  used: { href: string; label: string }[];
  /** Geplanter Einbau laut docs/GRAFIKEN-EINBAU.md; nach dem Einbau nach `used` übernehmen */
  ziel?: { href: string; label: string }[];
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
    alt: 'Liniendiagramm: Unter Semaglutid 2,4 mg sinkt das Gewicht in 68 Wochen im Mittel um 17,3 Prozent, unter Placebo um 2,0 Prozent. In den 52 Wochen nach dem Absetzen steigt es wieder; nach insgesamt 120 Wochen liegt es bei minus 5,6 Prozent (Semaglutid) und minus 0,1 Prozent (Placebo). Zwei Drittel des Verlusts, 11,6 Prozentpunkte, sind nach einem Jahr ohne Medikament wieder da. Messpunkte Woche 0, 68 und 120, Verlauf dazwischen schematisch.',
    sources: ['wilding2022ext'],
    used: [{ href: '/wissen/abnehmspritze-absetzen/', label: 'Abnehmspritze absetzen' }],
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
    alt: 'Drei Kennzahlen aus der STEP-1-Verlängerung: minus 17,3 Prozent Gewicht nach 68 Wochen Semaglutid, minus 5,6 Prozent gegenüber dem Start ein Jahr nach dem Absetzen (Woche 120), zwei Drittel des Verlusts in 52 Wochen zurück. Placebo: minus 2,0 und minus 0,1 Prozent.',
    sources: ['wilding2022ext'],
    used: [],
    variantOf: 'absetzkurve-step-1',
  },
  {
    id: 'zeitachse-nach-letzter-dosis',
    title: 'Die ersten 20 Wochen nach der letzten Dosis',
    subtitle: 'Wirkstoffabbau, Appetit und messbare Zunahme auf einer Zeitachse',
    alt: 'Zeitachse über 20 Wochen nach der letzten Dosis einer Abnehmspritze: Semaglutid (Halbwertszeit etwa eine Woche) ist nach etwa fünf Wochen weitgehend abgebaut und laut Fachinformation Wegovy bis etwa sieben Wochen nachweisbar, Tirzepatid (Halbwertszeit etwa fünf Tage) nach etwa 25 Tagen. Der Appetit kehrt, abgeleitet aus dem sinkenden Wirkstoffspiegel, ab Woche 2 bis 5 zurück; die Gewichtszunahme ist ab etwa Woche 8 messbar und steigt bis etwa Woche 20.',
    sources: ['fachinfoWegovy', 'fachinfoMounjaro', 'wu2025'],
    used: [
      { href: '/wissen/abnehmspritze-absetzen/', label: 'Abnehmspritze absetzen' },
      { href: '/wissen/', label: 'Wissensbereich' },
      { href: '/wissen/feiertage-nach-abnehmspritze/', label: 'Feiertage nach der Abnehmspritze' },
    ],
  },
  {
    id: 'zeitachse-phasen',
    title: 'Nach der letzten Dosis: vier Phasen',
    subtitle: 'Dieselbe Zeitachse als vier Phasen',
    alt: 'Vier Phasen nach der letzten Dosis am Beispiel Semaglutid (Halbwertszeit etwa eine Woche): Woche 0 bis 2 noch wenig Veränderung, Woche 2 bis 5 kehrt der Appetit zurück, Woche 5 bis 8 ist der Wirkstoff praktisch abgebaut, ab Woche 8 ist die Gewichtszunahme messbar und steigt bis etwa Woche 20. Bei Tirzepatid (Halbwertszeit etwa fünf Tage) ist der Wirkstoff schon nach etwa 25 Tagen abgebaut.',
    sources: ['fachinfoWegovy', 'fachinfoMounjaro', 'wu2025'],
    used: [{ href: '/wissen/gewicht-halten-nach-abnehmspritze/', label: 'Gewicht halten nach der Abnehmspritze' }],
    variantOf: 'zeitachse-nach-letzter-dosis',
  },
  {
    id: 'koerperzusammensetzung-step-1',
    title: 'Was beim Abnehmen mit Semaglutid verloren geht',
    subtitle: 'Anteil von Fettmasse und fettfreier Masse am Gewichtsverlust, STEP-1-Substudie mit DXA-Messung',
    alt: 'Balken, der den Gewichtsverlust nach 68 Wochen Semaglutid in einer DXA-Substudie mit 140 Teilnehmenden aufteilt: rund 60 Prozent Fettmasse und rund 40 Prozent fettfreie Masse, also Muskeln, Organe, Knochen und Wasser; wie viel davon Muskel war, wurde nicht getrennt gemessen. In Diätstudien hielt Krafttraining den Verlust an fettfreier Masse klein; empfohlen sind Krafttraining an mindestens zwei Tagen pro Woche und 1,2 bis 1,6 Gramm Protein pro Kilogramm Körpergewicht am Tag.',
    sources: ['wilding2021dxa', 'sardeli2018', 'leidy2015', 'who2020'],
    used: [{ href: '/wissen/muskelabbau-abnehmspritze/', label: 'Muskelabbau bei der Abnehmspritze' }],
  },
  {
    id: 'training-s-lite',
    title: 'Liraglutid allein: 6 kg mehr Zunahme als nach Training allein',
    subtitle: 'S-LiTE-Nachbeobachtung: Gewichtszunahme im Jahr ohne Behandlung, Liraglutid allein gegenüber den Trainingsgruppen',
    alt: 'Punktdiagramm mit 95-Prozent-Konfidenzintervallen aus der S-LiTE-Nachbeobachtung: Im Jahr ohne Behandlung (Woche 52 bis 104) nahmen Teilnehmende nach Liraglutid allein 6,0 Kilogramm mehr zu als nach Training allein ohne Medikament (2,1 bis 10,0) und 2,5 Kilogramm mehr als nach Training plus Liraglutid (−1,5 bis 6,5, nicht signifikant). Nach Training plus Liraglutid blieben Gewichtsverlust und Fettabbau ein Jahr nach Therapieende erhalten. Studienablauf: 8 Wochen kalorienarme Diät, 52 Wochen Placebo, Training, Liraglutid oder beides, danach 52 Wochen ohne Behandlung.',
    sources: ['jensen2024'],
    used: [
      { href: '/wissen/krafttraining-nach-abnehmspritze/', label: 'Krafttraining nach der Abnehmspritze' },
      { href: '/wissen/gewicht-halten-nach-abnehmspritze/', label: 'Gewicht halten nach der Abnehmspritze' },
    ],
  },
  {
    id: 'wirksamkeit-zulassungsstudien',
    title: 'Wie viel Gewicht in großen Studien verloren ging',
    subtitle: 'Mittlere Änderung des Körpergewichts, Wirkstoff gegenüber Placebo; fünf große Studien, eine davon mit nicht zugelassener Dosis',
    alt: 'Balkendiagramm aus fünf großen Studien, mittlere Änderung des Körpergewichts: STEP 1 (Semaglutid 2,4 Milligramm Spritze, 68 Wochen) minus 14,9 Prozent gegenüber minus 2,4 Prozent unter Placebo; OASIS 4 (Semaglutid-Tablette 25 Milligramm, 64 Wochen) minus 13,6 gegenüber minus 2,2; OASIS 1 (Semaglutid-Tablette 50 Milligramm, nicht zugelassen, 68 Wochen) minus 15,1 gegenüber minus 2,4; SURMOUNT-1 (Tirzepatid 15 Milligramm, höchster Studienarm, 72 Wochen) minus 20,9 gegenüber minus 3,1; SCALE (Liraglutid 3 Milligramm, 56 Wochen) minus 8,0 gegenüber minus 2,6 Prozent. Kein direkter Vergleich zwischen den Studien.',
    sources: ['wilding2021step1', 'wharton2025oasis4', 'knop2023oasis1', 'jastreboff2022', 'pisunyer2015'],
    used: [{ href: '/wissen/abnehmpille-oder-spritze/', label: 'Abnehmpille oder Spritze' }],
  },
  {
    id: 'weiter-oder-placebo',
    title: 'Weiter behandeln oder absetzen: zwei randomisierte Studien',
    subtitle: 'Gewicht nach dem Wechsel auf Placebo gegenüber Fortführung',
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
    alt: 'Balkendiagramm der Halbwertszeiten: Semaglutid etwa eine Woche, weitgehend abgebaut nach etwa fünf Wochen und laut Fachinformation Wegovy bis etwa sieben Wochen nachweisbar; Tirzepatid etwa fünf Tage, abgebaut nach etwa 25 Tagen; Liraglutid etwa 13 Stunden, abgebaut nach etwa drei Tagen. Faustregel: fünf Halbwertszeiten.',
    sources: ['fachinfoWegovy', 'fachinfoOzempic', 'fachinfoRybelsus', 'fachinfoMounjaro', 'fachinfoSaxenda'],
    used: [
      { href: '/wissen/abnehmpille-oder-spritze/', label: 'Abnehmpille oder Spritze' },
      { href: '/wissen/mounjaro-absetzen/', label: 'Mounjaro absetzen' },
    ],
  },
  {
    id: 'warum-das-gewicht-zurueckkommt',
    title: 'Warum das Gewicht nach dem Absetzen zurückkommt',
    subtitle: 'Vier Mechanismen, nach Gewichtsverlust belegt und auf die Zeit nach der Spritze übertragen',
    alt: 'Vier Spalten mit den Mechanismen des Jojo-Effekts, nach Gewichtsverlust belegt und auf die Zeit nach der Abnehmspritze übertragen: Die Appetitbremse fällt weg, sobald der Wirkstoff weitgehend abgebaut ist (Semaglutid nach etwa 5 Wochen weitgehend abgebaut, bis etwa 7 Wochen nachweisbar; Tirzepatid nach etwa 25 Tagen); die Hungerhormone Ghrelin und Leptin bleiben noch ein Jahr nach einer Diät verschoben; der Ruheenergieverbrauch blieb in einer kleinen Studie mit 14 Teilnehmenden, einem Extremfall, noch sechs Jahre nach starkem Gewichtsverlust abgesenkt; rund 40 Prozent des Gewichtsverlusts unter Semaglutid entfielen auf fettfreie Masse. In Studien halfen beim Halten: Krafttraining und Protein.',
    sources: ['fachinfoWegovy', 'fachinfoMounjaro', 'sumithran2011', 'fothergill2016', 'wilding2021dxa', 'jensen2024', 'sardeli2018', 'leidy2015'],
    used: [{ href: '/wissen/jojo-effekt-abnehmspritze/', label: 'Jojo-Effekt nach der Abnehmspritze' }],
  },
  {
    id: 'proteinbedarf-nach-abnehmspritze',
    title: 'Wie viel Protein nach der Abnehmspritze',
    subtitle: 'Tagesmenge nach Körpergewicht im Zielkorridor von 1,2 bis 1,6 g pro kg',
    alt: 'Balkendiagramm des Proteinbedarfs von 1,2 bis 1,6 Gramm pro Kilogramm Körpergewicht: bei 60 Kilogramm 72 bis 96 Gramm am Tag, bei 70 Kilogramm 84 bis 112, bei 80 Kilogramm 96 bis 128, bei 90 Kilogramm 108 bis 144, bei 100 Kilogramm 120 bis 160 Gramm. Verteilt auf drei bis vier Mahlzeiten mit mindestens etwa 25 bis 30 Gramm pro Mahlzeit.',
    sources: ['leidy2015'],
    used: [
      { href: '/wissen/protein-abnehmspritze/', label: 'Protein bei der Abnehmspritze' },
      { href: '/wissen/ernaehrung-nach-abnehmspritze/', label: 'Ernährung nach der Abnehmspritze' },
    ],
  },
  {
    id: 'haarausfall-zeitverlauf',
    title: 'Haarausfall nach schnellem Gewichtsverlust: der Verlauf',
    subtitle: 'Telogenes Effluvium in Monaten nach dem Auslöser, mit dem, was sich beeinflussen lässt',
    alt: 'Zeitachse des telogenen Effluviums über zwölf Monate, schematisch: Nach schnellem Gewichtsverlust wechseln viele Haare in die Ruhephase, zwei bis drei Monate später beginnt diffuser Haarausfall, der meist innerhalb von etwa sechs Monaten nach Beginn abklingt, wenn der Auslöser weggefallen ist; danach wachsen die Haare nach. Beeinflussbar sind Protein (1,2 bis 1,6 Gramm pro Kilogramm Körpergewicht am Tag), der Eisenwert sowie Zink und Biotin bei nachgewiesener Lücke; länger als sechs Monate, fleckig oder mit Müdigkeit und Frieren ärztlich abklären.',
    sources: ['malkud2015', 'leidy2015', 'almandoz2024'],
    used: [{ href: '/wissen/haarausfall-abnehmspritze/', label: 'Haarausfall bei der Abnehmspritze' }],
  },
  {
    id: 'abnehmpille-belegt-und-offen',
    title: 'Abnehmpille absetzen: was belegt ist und was fehlt',
    subtitle: 'Die Zulassungsstudie OASIS 4 der Semaglutid-Tablette gegenüber der Datenlage für die Zeit nach dem Absetzen',
    alt: 'Zwei Felder: Links die Zulassungsstudie OASIS 4 der Semaglutid-Tablette 25 Milligramm mit 307 Teilnehmenden ohne Diabetes: minus 13,6 Prozent Gewicht gegenüber minus 2,2 Prozent unter Placebo nach 64 Wochen, bei durchgehender Einnahme minus 16,6 Prozent. Rechts der offene Punkt: Es gibt noch keine Studie zur Wiederzunahme nach dem Absetzen der Tablette (Stand Oktober 2026). Übertragbar mit Vorbehalt: gleicher Wirkstoff mit einer Halbwertszeit von etwa einer Woche; nach dem Absetzen der Spritze waren in der STEP-1-Verlängerung zwei Drittel des Verlusts nach einem Jahr zurück (von minus 17,3 auf minus 5,6 Prozent); in Studien zu Adipositas-Medikamenten ist die Zunahme ab Woche 8 messbar.',
    sources: ['wharton2025oasis4', 'fachinfoRybelsus', 'wilding2022ext', 'wu2025'],
    used: [{ href: '/wissen/abnehmpille-absetzen/', label: 'Abnehmpille absetzen' }],
  },
  {
    id: 'kreatin-speicher-im-muskel',
    title: 'Kreatin: voll nach vier Wochen, auch ohne Ladephase',
    subtitle: 'Gesamtkreatin im Muskel mit 3 g pro Tag und mit Ladephase, Studie mit 31 Männern',
    alt: 'Zwei Verläufe des Kreatinspeichers im Muskel aus einer Studie mit 31 Männern, zwischen den Messpunkten schematisch: Mit 3 Gramm Kreatin pro Tag stieg das Gesamtkreatin im Muskel allmählich und lag nach 28 Tagen etwa 20 Prozent über dem Ausgangswert. Mit einer Ladephase von 20 Gramm pro Tag über 6 Tage war derselbe Anstieg von etwa 20 Prozent nach 6 Tagen erreicht; ohne weitere Einnahme lag der Wert 30 Tage nach dem Ende wieder beim Ausgangswert. Mit dem Speicher steigt das Wasser in der Muskelzelle; das zeigt die Waage, Fett ist es nicht.',
    sources: ['hultman1996', 'kreider2017'],
    used: [{ href: '/wissen/kreatin-abnehmspritze/', label: 'Kreatin und Abnehmspritze' }],
  },
  {
    id: 'wirkstoff-abbau-nach-letzter-dosis',
    title: 'Wirkstoffabbau nach der letzten Dosis: Tage oder Wochen',
    subtitle: 'Dieselben Halbwertszeiten als Abbaukurven: Liraglutid, Tirzepatid, Semaglutid',
    alt: 'Drei Abbaukurven nach der letzten Dosis, gerechnet aus der Halbwertszeit laut Fachinformation: Liraglutid (Saxenda) hat eine Halbwertszeit von etwa 13 Stunden und ist nach etwa 3 Tagen weitgehend abgebaut; Tirzepatid (Mounjaro) etwa 5 Tage, weitgehend abgebaut nach etwa 25 Tagen; Semaglutid (Wegovy, Ozempic) etwa 1 Woche, weitgehend abgebaut nach etwa 5 Wochen und laut Fachinformation Wegovy bis etwa 7 Wochen nachweisbar. Faustregel: nach fünf Halbwertszeiten weitgehend abgebaut.',
    sources: ['fachinfoSaxenda', 'fachinfoMounjaro', 'fachinfoWegovy', 'fachinfoOzempic'],
    used: [
      { href: '/wissen/saxenda-absetzen/', label: 'Saxenda absetzen' },
      { href: '/wissen/ozempic-absetzen/', label: 'Ozempic absetzen' },
    ],
    ziel: [{ href: '/wissen/wegovy-absetzen/', label: 'Wegovy absetzen' }],
    variantOf: 'halbwertszeiten-praeparate',
  },
  {
    id: 's-lite-liraglutid-und-training',
    title: 'Liraglutid mit oder ohne Training: was danach bleibt',
    subtitle: 'S-LiTE: nach einer Diät ein Jahr Behandlung, danach ein Jahr ohne; Vergleiche der Gruppen mit 95-%-Konfidenzintervall',
    alt: 'Drei Kennzahlen aus der S-LiTE-Studie mit Liraglutid: Im Jahr ohne Behandlung (Woche 52 bis 104) nahmen Teilnehmende nach Liraglutid allein 6,0 Kilogramm mehr zu als nach Training allein ohne Medikament (95-Prozent-Konfidenzintervall 2,1 bis 10,0). Von Behandlungsbeginn (Woche 0, nach der Diät) bis ein Jahr nach dem Ende (Woche 104) lagen Teilnehmende mit Training plus Liraglutid 5,1 Kilogramm niedriger (minus 10,0 bis minus 0,2) und beim Körperfettanteil 2,3 Prozentpunkte niedriger (minus 4,3 bis minus 0,3) als nach Liraglutid allein. Nach Training blieben Gewicht und Körperzusammensetzung erhalten. Studienablauf: 8 Wochen Diät, 52 Wochen Behandlung, 52 Wochen ohne Behandlung.',
    sources: ['lundgren2021', 'jensen2024'],
    used: [],
    ziel: [{ href: '/wissen/saxenda-absetzen/', label: 'Saxenda absetzen' }],
  },
  {
    id: 'heisshunger-vor-der-waage',
    title: 'Der Hunger kommt vor der Waage',
    subtitle: 'Die ersten 20 Wochen nach der letzten Dosis: Wirkstoff, Appetit, Hungerhormone, Gewicht',
    alt: 'Zeitachse über 20 Wochen nach der letzten Dosis: Semaglutid baut sich mit einer Halbwertszeit von etwa einer Woche ab und ist nach etwa 5 bis 7 Wochen weitgehend weg. Der Appetit kommt, abgeleitet aus dem sinkenden Wirkstoffspiegel, in Woche 2 bis 5 zurück und bleibt. Die Hungerhormone sind nach einer Diät verschoben, mehr Ghrelin und weniger Leptin, noch ein Jahr später messbar (Studie ohne Medikament). Die Gewichtszunahme ist erst ab etwa Woche 8 messbar und steigt bis etwa Woche 20. Markiert ist das Fenster von Woche 2 bis 8, in dem der Hunger zurück ist, die Waage aber noch wenig zeigt.',
    sources: ['fachinfoWegovy', 'sumithran2011', 'wu2025'],
    used: [{ href: '/wissen/heisshunger-nach-abnehmspritze/', label: 'Heißhunger nach der Abnehmspritze' }],
  },
  {
    id: 'schlaf-und-hungerhormone',
    title: 'Zwei kurze Nächte: Hungerhormone und Appetit',
    subtitle: 'Leptin, Ghrelin, Hunger und Appetit nach zwei Nächten mit 4 Stunden im Bett gegenüber 10 Stunden',
    alt: 'Balkendiagramm: Nach zwei Nächten mit 4 Stunden im Bett gegenüber zwei Nächten mit 10 Stunden sank das Sättigungshormon Leptin um 18 Prozent, das Hungerhormon Ghrelin stieg um 28 Prozent, der Hunger um 24 Prozent und der Appetit um 23 Prozent; der Appetit auf kalorienreiche Lebensmittel mit viel Kohlenhydraten stieg um 33 bis 45 Prozent. Kleine Studie mit 12 gesunden jungen Männern unter Laborbedingungen.',
    sources: ['spiegel2004'],
    used: [{ href: '/wissen/heisshunger-nach-abnehmspritze/', label: 'Heißhunger nach der Abnehmspritze' }],
  },
  {
    id: 'absetzen-im-ersten-jahr',
    title: 'Wie viele die Abnehmspritze im ersten Jahr absetzen',
    subtitle: 'Anteil, der die Therapie innerhalb eines Jahres beendet hatte, als Punktraster; US-Versorgungsdaten',
    alt: 'Zwei Punktraster mit je 100 Punkten aus US-Versorgungsdaten von 125.474 Erwachsenen mit Übergewicht oder Adipositas: Von Menschen ohne Typ-2-Diabetes hatten 64,8 Prozent ihre GLP-1-Therapie innerhalb eines Jahres beendet, von Menschen mit Typ-2-Diabetes 46,5 Prozent.',
    sources: ['rodriguez2025'],
    used: [{ href: '/wissen/abnehmspritze-absetzen/', label: 'Abnehmspritze absetzen' }],
    ziel: [{ href: '/wissen/jojo-effekt-abnehmspritze/', label: 'Jojo-Effekt nach der Abnehmspritze' }],
  },
  {
    id: 'step-2-typ-2-diabetes',
    title: 'Semaglutid bei Typ-2-Diabetes: die Studie STEP 2',
    subtitle: 'Mittlere Änderung des Körpergewichts nach 68 Wochen, Erwachsene mit Übergewicht und Typ-2-Diabetes',
    alt: 'Balkendiagramm aus der Studie STEP 2 mit Erwachsenen mit Übergewicht und Typ-2-Diabetes: Nach 68 Wochen lag das Gewicht unter Semaglutid 2,4 Milligramm im Mittel 9,6 Prozent niedriger, unter Semaglutid 1,0 Milligramm 7,0 Prozent und unter Placebo 3,4 Prozent. Weniger Verlust heißt weniger, was nach dem Absetzen zurückkommen kann.',
    sources: ['davies2021step2'],
    used: [{ href: '/wissen/ozempic-absetzen/', label: 'Ozempic absetzen' }],
  },
  {
    id: 'supplements-was-belegt-ist',
    title: 'Supplements nach der Abnehmspritze: was belegt ist',
    subtitle: 'Drei Stufen nach Datenlage: belegt mit Bedingung, nur bei Mangel, kein Beleg',
    alt: 'Drei Spalten zu Supplements nach der Abnehmspritze. Sinnvoll, mit Bedingung: Protein (zugelassene Angabe: Erhalt von Muskelmasse), wenn 1,2 bis 1,6 Gramm pro Kilogramm Körpergewicht am Tag über Mahlzeiten nicht zusammenkommen; Kreatin-Monohydrat (zugelassene Angabe: Leistung bei Schnellkrafttraining), 3 Gramm täglich, nur mit Krafttraining; Ballaststoffe, wenn man unter dem Richtwert von 30 Gramm am Tag bleibt. Nur bei Mangel oder Lücke: Vitamin D nach Blutwert, Vitamin B12 bei Metformin oder veganer Ernährung kontrollieren, Eisen nur nach gemessenem Wert, Magnesium bei Lücke wie sehr kleinen Portionen. Kein Beleg für den versprochenen Nutzen: Fatburner, Detox und Booster, sogenannte natürliche GLP-1-Booster wie Berberin, Probiotika gegen den Jojo-Effekt, Omega-3 für Gewicht oder Muskeln.',
    sources: ['leidy2015', 'kreider2017', 'euClaims', 'dgeBallaststoffe', 'adaSoc2024', 'klartextNem', 'almandoz2024'],
    used: [],
    ziel: [{ href: '/wissen/supplements-nach-abnehmspritze/', label: 'Supplements nach der Abnehmspritze' }],
  },
  {
    id: 'versorgung-in-deutschland',
    title: 'Wo die Versorgung in Deutschland ohnehin knapp ist',
    subtitle: 'Magnesium und Eisen unter der Zufuhrempfehlung, Vitamin D im Blut, Erwachsene in Deutschland',
    alt: 'Balkendiagramm zur Versorgung Erwachsener in Deutschland: Unter der Zufuhrempfehlung lagen bei Magnesium 26 Prozent der Männer und 29 Prozent der Frauen, bei Eisen 14 Prozent der Männer und 58 Prozent der Frauen (Nationale Verzehrsstudie II). Beim Vitamin-D-Wert im Blut lagen 30,2 Prozent unter 30 Nanomol pro Liter (Mangel) und 61,6 Prozent unter 50 Nanomol pro Liter (DEGS1). Erhoben vor der Zeit der GLP-1-Medikamente.',
    sources: ['nvs2', 'rabenberg2015'],
    used: [{ href: '/wissen/supplements-nach-abnehmspritze/', label: 'Supplements nach der Abnehmspritze' }],
    ziel: [
      { href: '/wissen/magnesium-abnehmspritze/', label: 'Magnesium bei der Abnehmspritze' },
      { href: '/wissen/eisen-abnehmspritze/', label: 'Eisen bei der Abnehmspritze' },
      { href: '/wissen/vitamin-d-abnehmspritze/', label: 'Vitamin D bei der Abnehmspritze' },
    ],
  },
  {
    id: 'fett-und-fettfreie-masse-zwei-studien',
    title: 'Wie viel vom verlorenen Gewicht Fett war',
    subtitle: 'Fettmasse und fettfreie Masse am Gewichtsverlust: STEP 1 (Semaglutid) und SURMOUNT-1 (Tirzepatid)',
    alt: 'Zwei Balken, die den Gewichtsverlust aufteilen: In der STEP-1-Substudie mit Semaglutid (140 Teilnehmende, 68 Wochen) entfielen rund 60 Prozent auf Fettmasse und rund 40 Prozent auf fettfreie Masse, in der SURMOUNT-1-Substudie mit Tirzepatid (160 Teilnehmende, 72 Wochen) rund 75 Prozent auf Fettmasse und rund 25 Prozent auf fettfreie Masse. Unter Tirzepatid sanken Körpergewicht um 21,3 Prozent, Fettmasse um 33,9 Prozent und fettfreie Masse um 10,9 Prozent (Placebo 5,3, 8,2 und 2,6 Prozent). Zwei verschiedene Studien, kein direkter Vergleich.',
    sources: ['wilding2021dxa', 'look2025surmount1dxa'],
    used: [{ href: '/wissen/kalorienbedarf-nach-abnehmspritze/', label: 'Kalorienbedarf nach der Abnehmspritze' }],
    ziel: [{ href: '/wissen/muskelabbau-abnehmspritze/', label: 'Muskelabbau bei der Abnehmspritze' }],
  },
  {
    id: 'training-art-fettfreie-masse',
    title: 'Kraft oder Ausdauer: fettfreie Masse und Knochen beim Abnehmen',
    subtitle: 'Randomisierte Studie: 160 Erwachsene ab 65 Jahren mit Adipositas, 26 Wochen Diät, Gewicht im Mittel −9 %',
    alt: 'Zwei Balkengruppen aus einer randomisierten Studie mit 160 Erwachsenen ab 65 Jahren mit Adipositas, 26 Wochen Diät und im Mittel 9 Prozent Gewichtsverlust: Verlust an fettfreier Masse mit Krafttraining 1,0 Kilogramm, mit Kraft plus Ausdauer 1,7 Kilogramm, mit Ausdauertraining 2,7 Kilogramm. Knochendichte der Hüfte: minus 2,6 Prozent mit Ausdauertraining, minus 1,1 Prozent mit Kraft plus Ausdauer, mit Krafttraining weniger als 1 Prozent und nicht signifikant.',
    sources: ['villareal2017'],
    used: [{ href: '/wissen/krafttraining-nach-abnehmspritze/', label: 'Krafttraining nach der Abnehmspritze' }],
    ziel: [{ href: '/wissen/wechseljahre-abnehmspritze/', label: 'Wechseljahre und Abnehmspritze' }],
  },
  {
    id: 'wiegen-zonen-stop-regain',
    title: 'Wiegen mit Zonen: was die STOP-Regain-Studie zeigt',
    subtitle: '314 Erwachsene nach mindestens 10 % Gewichtsverlust, 18 Monate; tägliches Wiegen mit festgelegter Reaktion je Zone',
    alt: 'STOP-Regain-Studie mit 314 Erwachsenen nach mindestens 10 Prozent Gewichtsverlust, tägliches Wiegen über 18 Monate. Zonen bezogen auf das Gewicht nach der Abnahme, zu Studienbeginn: grün bis plus 1,4 Kilogramm, gelb bis plus 2,3 Kilogramm, obere Zone (in der Studie rot) ab plus 2,3 Kilogramm, jeweils mit vorher festgelegter Reaktion. Nach 18 Monaten hatten in der persönlich betreuten Gruppe 45,7 Prozent 2,3 Kilogramm oder mehr wieder zugenommen, in der Kontrollgruppe 72,4 Prozent. Wiegen ohne festgelegte Reaktion verhinderte die Wiederzunahme in einer späteren Studie (LIMIT, 2019) nicht.',
    sources: ['wing2006', 'daley2019'],
    used: [],
    ziel: [
      { href: '/wissen/wie-oft-wiegen-nach-abnehmspritze/', label: 'Wie oft wiegen nach der Abnehmspritze' },
      { href: '/wissen/gewicht-halten-nach-abnehmspritze/', label: 'Gewicht halten nach der Abnehmspritze' },
    ],
  },
  {
    id: 'feiertage-gewicht',
    title: 'Weihnachten auf der Waage: was Studien messen',
    subtitle: 'Gewichtsänderung über die Feiertage in Deutschland, in der Haltephase und mit Wiegen',
    alt: 'Zwei Balkengruppen: Zehn Tage nach Weihnachten lag das Gewicht in Deutschland im Mittel 0,6 Prozent höher als zehn Tage davor, zu Ostern 0,2 Prozent. In einer europäischen Studie mit Menschen in der Haltephase nach mindestens 5 Prozent Gewichtsverlust stieg es über Weihnachten um 1,35 Prozent. In einer randomisierten Studie wog die Gruppe, die sich mindestens zweimal pro Woche wog, notierte und zehn Tipps bekam, nach den Feiertagen 0,13 Kilogramm weniger, die Vergleichsgruppe 0,37 Kilogramm mehr; Unterschied 0,49 Kilogramm.',
    sources: ['helander2016', 'turicchi2020', 'mason2018'],
    used: [{ href: '/wissen/feiertage-nach-abnehmspritze/', label: 'Feiertage nach der Abnehmspritze' }],
  },
  {
    id: 'wechseljahre-koerperzusammensetzung',
    title: 'Wechseljahre: was sich am Körper verschiebt',
    subtitle: 'Fettmasse und fettfreie Masse pro Jahr vor dem Übergang und im Übergang, SWAN-Studie',
    alt: 'Zwei Balkengruppen aus der SWAN-Studie mit 1.246 Frauen: Der jährliche Zuwachs an Fettmasse stieg von 0,25 Kilogramm vor dem Übergang auf 0,45 Kilogramm im Übergang. Die fettfreie Masse nahm vor dem Übergang um 0,2 Prozent pro Jahr zu und sank im Übergang um 0,2 Prozent pro Jahr. Beides lief bis etwa zwei Jahre nach der letzten Regelblutung weiter; das Gewicht selbst stieg nicht schneller als vorher.',
    sources: ['greendale2019'],
    used: [{ href: '/wissen/wechseljahre-abnehmspritze/', label: 'Wechseljahre und Abnehmspritze' }],
  },
  {
    id: 'protein-verteilung',
    title: 'Protein verteilen: gleich viel zu jeder Mahlzeit',
    subtitle: 'Gleiche Tagesmenge, gleichmäßig oder abendlastig verteilt: Muskelproteinsynthese über 24 Stunden',
    alt: 'Zwei Balkengruppen: gleichmäßige Verteilung mit etwa 30 Gramm Protein zu Frühstück, Mittag und Abend gegenüber abendlastiger Verteilung mit etwa 10, 15 und 65 Gramm bei gleicher Tagesmenge. Bei gleichmäßiger Verteilung lag die Muskelproteinsynthese über 24 Stunden um 25 Prozent höher. Kleine Studie, gemessen wurde die Muskelproteinsynthese, nicht die Muskelmasse. Empfehlung für Gewichtsabnahme und -erhalt: mindestens etwa 25 bis 30 Gramm Protein pro Mahlzeit.',
    sources: ['mamerow2014', 'leidy2015'],
    used: [{ href: '/wissen/protein-abnehmspritze/', label: 'Protein bei der Abnehmspritze' }],
  },
  {
    id: 'kalorienbedarf-zwei-effekte',
    title: 'Warum nach dem Abnehmen weniger Energie gebraucht wird',
    subtitle: 'Rechenbeispiel von 95 auf 80 kg: Formel für das neue Gewicht und Anpassung nach Gewichtsverlust',
    alt: 'Wasserfalldiagramm für eine Frau mit 45 Jahren und 170 Zentimetern: Vor dem Abnehmen mit 95 Kilogramm liegt der Tagesbedarf laut Formel bei 2.277 kcal. Der leichtere Körper senkt ihn um 210 kcal auf 2.067 kcal bei 80 Kilogramm. Die Anpassung nach Gewichtsverlust senkt den tatsächlichen Verbrauch in Messungen um weitere 300 bis 400 kcal, auf rund 1.700 bis 1.800 kcal; beim Ruheumsatz war die Anpassung in einer anderen Studie deutlich kleiner (92 kcal am Tag). Formel nach Mifflin-St-Jeor mal Aktivitätsfaktor 1,4, gerundet.',
    sources: ['mifflin1990', 'dgeEnergie', 'leibel1995', 'rosenbaum2010', 'martins2020'],
    used: [{ href: '/wissen/kalorienbedarf-nach-abnehmspritze/', label: 'Kalorienbedarf nach der Abnehmspritze' }],
  },
  {
    id: 'protein-tag-beispiel',
    title: 'Ein Tag mit rund 100 g Protein bei 80 kg',
    subtitle: 'Vier Mahlzeiten eines Beispieltags mit Proteingehalt, gegenüber dem Zielbereich von 96 bis 128 g',
    alt: 'Gestapelter Balken eines Beispieltags bei 80 Kilogramm Körpergewicht: morgens 200 Gramm Skyr mit Beeren und 2 Esslöffeln Haferflocken, etwa 24 Gramm Protein; mittags Salat oder Gemüse mit 120 Gramm Hähnchen, Fisch oder Tofu und einer Scheibe Vollkornbrot, etwa 30 Gramm (mit Tofu weniger); nachmittags Hüttenkäse oder ein Protein-Shake und ein Apfel, etwa 20 Gramm; abends Linsen- oder Bohneneintopf mit 2 Eiern oder 150 Gramm Fisch, etwa 30 Gramm. Zusammen rund 100 Gramm Protein, im Zielbereich von 96 bis 128 Gramm (1,2 bis 1,6 Gramm pro Kilogramm), und rund 30 Gramm Ballaststoffe.',
    sources: ['leidy2015', 'bls'],
    used: [],
    ziel: [{ href: '/wissen/ernaehrung-nach-abnehmspritze/', label: 'Ernährung nach der Abnehmspritze' }],
  },
  {
    id: 'ballaststoffe-portionen',
    title: 'Ballaststoffe: was eine Portion liefert',
    subtitle: 'Ballaststoffe je Portion gegenüber dem Richtwert von 30 g und der Glucomannan-Tagesmenge',
    alt: 'Balkendiagramm der Ballaststoffe je Portion: Linsen gekocht 150 Gramm etwa 8 Gramm, Vollkornbrot 2 Scheiben etwa 8 Gramm, Himbeeren 125 Gramm etwa 6 Gramm, Brokkoli gegart 200 Gramm etwa 6 Gramm, Haferflocken 50 Gramm etwa 5 Gramm, Leinsamen 1 Esslöffel etwa 4 Gramm, Glucomannan als Tagesmenge laut zugelassener Angabe 3 Gramm. Richtwert mindestens 30 Gramm am Tag; die 3 Gramm Glucomannan sind ein Zehntel davon. Die Angabe zu Glucomannan gilt für drei Portionen zu je 1 Gramm mit ein bis zwei Gläsern Wasser vor den Mahlzeiten bei kalorienarmer Ernährung; nie ohne reichlich Wasser einnehmen (Erstickungsgefahr).',
    sources: ['bls', 'dgeBallaststoffe', 'euClaims'],
    used: [],
    ziel: [{ href: '/wissen/glucomannan-abnehmspritze/', label: 'Glucomannan bei der Abnehmspritze' }],
  },
  {
    id: 'preise-im-monat',
    title: 'Was Abnehmspritzen und die Tablette im Monat kosten',
    subtitle: `Apothekenverkaufspreise für Selbstzahler als Größenordnung, Stand ${fmtDate(preise.stand)}, aus der monatlichen Erhebung im Marktradar`,
    alt: `Balkendiagramm der monatlichen Selbstzahlerpreise für Abnehmspritzen und die Abnehmtablette als Größenordnung, gerundet auf 5 Euro, Stand ${fmtDate(preise.stand)}: ${preise.zeilen.map((z) => `${z.praeparat} ${z.monat}`).join('; ')}.${kassenPraeparate.length ? ` ${kassenPraeparate.join(', ')} ist nur für Typ-2-Diabetes zugelassen und dort Kassenleistung.` : ''}`,
    sources: ['medipreis2026', 'tabletteApotheken2026'],
    used: [{ href: '/marktradar/#preise', label: 'Marktradar: Preise' }],
    monatlich: true,
  },
];

export const hauptgrafiken = grafiken.filter((g) => !g.variantOf);
export const varianten = (id: string) => grafiken.filter((g) => g.variantOf === id);
