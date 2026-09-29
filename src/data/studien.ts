/**
 * Studien-Tracker: eine Zeile pro Studie, Kernzahl zum Absetzen bzw. zur Einordnung.
 * Neue Studie = neue Zeile + Quelle in sources.ts. `updated` beim Ergänzen hochsetzen.
 */
export const studienUpdated = '2026-09-30';

/** Datierte Einträge für „Was neu ist“ – neuester zuerst. Jede Ergänzung der Tabelle bekommt eine Zeile. */
export const studienLog: { date: string; text: string }[] = [
  { date: '2026-09-30', text: 'Start des Trackers mit 15 Studien: Absetz-Phasen (STEP 1 Extension, STEP 4, SURMOUNT-4, S-LiTE), Meta-Analysen 2025/2026, Mechanismen und Versorgungsdaten.' },
];

export type Studie = {
  sourceId: string;
  name: string;
  jahr: number;
  wirkstoff: string;
  design: string;
  n: string;
  kernzahl: string;
  bedeutung: string;
  gruppe: 'Absetzen' | 'Zulassung' | 'Mechanismus' | 'Versorgung';
};

export const studien: Studie[] = [
  {
    sourceId: 'wilding2022ext',
    name: 'STEP 1 Extension',
    jahr: 2022,
    wirkstoff: 'Semaglutid 2,4 mg',
    design: 'Nachbeobachtung eines RCT, 1 Jahr ohne Medikament',
    n: '327',
    kernzahl: 'Zwei Drittel des Gewichtsverlusts nach 1 Jahr wieder da; netto noch −5,6 %',
    bedeutung: 'Der Referenzwert für den Jojo-Effekt nach Semaglutid. Blutdruck, Blutzucker und Blutfette näherten sich den Ausgangswerten.',
    gruppe: 'Absetzen',
  },
  {
    sourceId: 'rubino2021',
    name: 'STEP 4',
    jahr: 2021,
    wirkstoff: 'Semaglutid 2,4 mg',
    design: 'RCT, nach 20 Wochen Wechsel auf Placebo vs. Weiterbehandlung',
    n: '803',
    kernzahl: '+6,9 % in 48 Wochen nach Wechsel auf Placebo; −7,9 % unter Fortführung',
    bedeutung: 'Zeigt, dass die Zunahme unmittelbar nach dem Absetzen beginnt, auch nach kurzer Therapie.',
    gruppe: 'Absetzen',
  },
  {
    sourceId: 'aronne2024',
    name: 'SURMOUNT-4',
    jahr: 2024,
    wirkstoff: 'Tirzepatid',
    design: 'RCT, nach 36 Wochen Wechsel auf Placebo vs. Weiterbehandlung',
    n: '670',
    kernzahl: '+14 % in 52 Wochen nach Wechsel auf Placebo; −5,5 % unter Fortführung',
    bedeutung: 'Der Referenzwert für Tirzepatid. Ein Jahr nach dem Absetzen lag das Gewicht im Mittel noch etwa 10 % unter dem Start.',
    gruppe: 'Absetzen',
  },
  {
    sourceId: 'wu2025',
    name: 'Meta-Analyse Wu et al.',
    jahr: 2025,
    wirkstoff: 'Verschiedene Adipositas-Medikamente',
    design: 'Systematischer Review und Meta-Analyse von RCTs mit Absetz-Phase',
    n: '11 Studien',
    kernzahl: 'Zunahme ab Woche 8 nach dem Absetzen signifikant, Anstieg bis etwa Woche 20',
    bedeutung: 'Liefert die Zeitachse: Die ersten acht Wochen sind das Fenster für Routinen.',
    gruppe: 'Absetzen',
  },
  {
    sourceId: 'eclinmed2026',
    name: 'Systematischer Review, eClinicalMedicine',
    jahr: 2026,
    wirkstoff: 'GLP-1-Rezeptoragonisten',
    design: 'Systematischer Review mit nichtlinearer Meta-Regression',
    n: 'mehrere RCTs',
    kernzahl: 'Verlaufskurve: schneller Anstieg in den ersten Monaten, danach Abflachung',
    bedeutung: 'Aktuellste Zusammenfassung; bestätigt die Trajektorie aus den Einzelstudien.',
    gruppe: 'Absetzen',
  },
  {
    sourceId: 'jensen2024',
    name: 'S-LiTE Nachbeobachtung',
    jahr: 2024,
    wirkstoff: 'Liraglutid 3 mg, Training, beides, Placebo',
    design: 'Nachbeobachtung eines RCT, 1 Jahr nach Ende aller Behandlungen',
    n: '109',
    kernzahl: 'Nach Liraglutid allein 6,0 kg mehr Zunahme als nach Training; Trainingsgruppen hielten Gewicht und Körperzusammensetzung',
    bedeutung: 'Die klarste Evidenz dafür, dass Training während der Therapie den Verlauf nach dem Absetzen verändert.',
    gruppe: 'Absetzen',
  },
  {
    sourceId: 'lundgren2021',
    name: 'S-LiTE',
    jahr: 2021,
    wirkstoff: 'Liraglutid 3 mg, Training, beides, Placebo',
    design: 'RCT über 1 Jahr nach 8 Wochen Diät',
    n: '195',
    kernzahl: 'Kombination aus Medikament und Training hielt den Gewichtsverlust am besten und verbesserte die Körperzusammensetzung',
    bedeutung: 'Ausgangsstudie zur Nachbeobachtung oben.',
    gruppe: 'Absetzen',
  },
  {
    sourceId: 'wilding2021dxa',
    name: 'STEP 1 Körperzusammensetzung',
    jahr: 2021,
    wirkstoff: 'Semaglutid 2,4 mg',
    design: 'DXA-Substudie eines RCT, exploratorisch',
    n: '140',
    kernzahl: 'Rund 40 % des Gewichtsverlusts entfielen auf fettfreie Masse',
    bedeutung: 'Begründet, warum Protein und Krafttraining unter und nach der Therapie zählen.',
    gruppe: 'Mechanismus',
  },
  {
    sourceId: 'sumithran2011',
    name: 'Sumithran et al.',
    jahr: 2011,
    wirkstoff: 'Keines (Diät)',
    design: 'Prospektive Studie, Hormonmessung 1 Jahr nach Diät',
    n: '50',
    kernzahl: 'Ghrelin erhöht, Leptin erniedrigt, Appetit gesteigert – noch 1 Jahr nach der Diät',
    bedeutung: 'Erklärt den zurückkehrenden Hunger nach jedem Gewichtsverlust, unabhängig vom Medikament.',
    gruppe: 'Mechanismus',
  },
  {
    sourceId: 'fothergill2016',
    name: 'Fothergill et al. („Biggest Loser“)',
    jahr: 2016,
    wirkstoff: 'Keines (Diät und Training)',
    design: 'Nachbeobachtung über 6 Jahre',
    n: '14',
    kernzahl: 'Ruheenergieverbrauch 6 Jahre nach dem Gewichtsverlust weiterhin deutlich abgesenkt',
    bedeutung: 'Zeigt die metabolische Anpassung, die den Erhalt nach starkem Gewichtsverlust erschwert.',
    gruppe: 'Mechanismus',
  },
  {
    sourceId: 'sardeli2018',
    name: 'Sardeli et al., Meta-Analyse',
    jahr: 2018,
    wirkstoff: 'Keines (Kalorienreduktion)',
    design: 'Meta-Analyse von RCTs',
    n: '6 Studien',
    kernzahl: 'Krafttraining während einer Kalorienreduktion verhinderte den Verlust an fettfreier Masse weitgehend',
    bedeutung: 'Die Basis für zwei Krafteinheiten pro Woche im Programm.',
    gruppe: 'Mechanismus',
  },
  {
    sourceId: 'rodriguez2025',
    name: 'Rodriguez et al., JAMA Netw Open',
    jahr: 2025,
    wirkstoff: 'Semaglutid, Liraglutid, Tirzepatid',
    design: 'Auswertung von US-Versorgungsdaten',
    n: '125.474',
    kernzahl: '64,8 % ohne Typ-2-Diabetes setzten innerhalb eines Jahres ab; über alle 53,6 %',
    bedeutung: 'Die Zeit nach der Spritze ist für die Mehrheit die Realität, nicht die Ausnahme.',
    gruppe: 'Versorgung',
  },
  {
    sourceId: 'wilding2021step1',
    name: 'STEP 1',
    jahr: 2021,
    wirkstoff: 'Semaglutid 2,4 mg',
    design: 'Zulassungs-RCT über 68 Wochen',
    n: '1.961',
    kernzahl: '−14,9 % gegenüber −2,4 % unter Placebo',
    bedeutung: 'Ausgangspunkt für die Extension-Daten; zeigt, wie viel Gewicht zurückkommen kann.',
    gruppe: 'Zulassung',
  },
  {
    sourceId: 'jastreboff2022',
    name: 'SURMOUNT-1',
    jahr: 2022,
    wirkstoff: 'Tirzepatid',
    design: 'Zulassungs-RCT über 72 Wochen',
    n: '2.539',
    kernzahl: '−15,0 % (5 mg), −19,5 % (10 mg), −20,9 % (15 mg) gegenüber −3,1 %',
    bedeutung: 'Größerer Verlust als unter Semaglutid, entsprechend mehr Gewicht, das nach dem Absetzen zurückkommen kann.',
    gruppe: 'Zulassung',
  },
  {
    sourceId: 'aronne2025surmount5',
    name: 'SURMOUNT-5',
    jahr: 2025,
    wirkstoff: 'Tirzepatid vs. Semaglutid 2,4 mg',
    design: 'Direktvergleich, RCT über 72 Wochen',
    n: '751',
    kernzahl: '−20,2 % unter Tirzepatid, −13,7 % unter Semaglutid',
    bedeutung: 'Einordnung der beiden Wirkstoffe; keine Absetz-Daten.',
    gruppe: 'Zulassung',
  },
];
