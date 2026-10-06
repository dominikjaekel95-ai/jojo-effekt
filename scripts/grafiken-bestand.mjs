/**
 * Die bestehenden Studien-Grafiken (gleiche Dateinamen und URLs wie vor dem Redesign), im Design „Kalk“.
 * Zahlen unverändert; Quellen-IDs aus src/data/sources.ts in den Kommentaren. Datentabellen dazu in
 * src/data/grafiken-daten.json. Schriftstufen aus F (grafiken-lib.mjs), Inhalt endet über BOTTOM (Abstand zur Fußlinie).
 */
import { C, W, M, F, T, P, L, R, PATH, DOT, DOTTED, HL, BRACKET, ARROW_R, legendRow, gridY, gridX, placeboBar, dottedBar, tw, fit, wrap, de, frame } from './grafiken-lib.mjs';

const NB = ' ';

/* Daten der Grafiken, die auch eine Hochformat-Fassung haben (grafiken-hoch.mjs): eine Quelle für beide Formate */

/** Weiter oder Placebo (rubino2021, aronne2024) */
export const WEITER = {
  hinweis: 'Änderung des Körpergewichts ab dem Zeitpunkt des Wechsels; alle Teilnehmenden hatten davor mit dem Medikament abgenommen.',
  gruppen: [
    { name: 'STEP 4', sub: 'Semaglutid, 48 Wochen nach dem Wechsel', cont: -7.9, plac: 6.9 },
    { name: 'SURMOUNT-4', sub: 'Tirzepatid, 52 Wochen nach dem Wechsel', cont: -5.5, plac: 14 },
  ],
  weiter: 'Weiter behandelt',
  placebo: 'Wechsel auf Placebo',
};

/** Warum das Gewicht zurückkommt (fachinfos, sumithran2011, fothergill2016, wilding2021dxa; jensen2024, sardeli2018, leidy2015) */
export const WARUM = {
  cols: [
    { big: '5–7 Wochen', h: 'Die Appetitbremse fällt weg', d: 'Semaglutid ist nach etwa 5 Wochen weitgehend abgebaut, bis etwa 7 Wochen nachweisbar; Tirzepatid nach etwa 25 Tagen.', src: 'Fachinformationen (EMA)', c: C.ink },
    { big: 'Ghrelin ↑ Leptin ↓', h: 'Hungerhormone bleiben verschoben', d: 'Noch ein Jahr nach einer Diät messbar: mehr Hunger, weniger Sättigung.', src: 'Sumithran et al., NEJM 2011', c: C.regain },
    { big: '6 Jahre', h: 'Weniger Energie in Ruhe', d: 'Der Ruheenergieverbrauch blieb noch sechs Jahre nach starkem Gewichtsverlust abgesenkt; kleine Studie, 14 Teilnehmende, Extremfall.', src: 'Fothergill et al., Obesity 2016', c: C.regain },
    { big: 'rund 40 %', h: 'Ein Teil des Verlusts war fettfreie Masse', d: 'Rund 40 % des Gewichtsverlusts unter Semaglutid entfielen auf fettfreie Masse.', src: 'STEP-1-DXA-Substudie 2021', c: C.lean },
  ],
  halten: 'In Studien halfen beim Halten: Krafttraining (Jensen 2024, Sardeli 2018) und Protein (Leidy 2015).',
};

/** Preise im Monat (src/data/markt/preise.json) */
export const preisZeilen = (preise) =>
  preise.zeilen.map((z) => ({
    name: z.praeparat,
    eur: Number(String(z.monat).replace(/[^0-9]/g, '')),
    flag: /Anbieterangabe/.test(z.hinweis) ? '*' : '',
    kasse: /Kassenleistung/.test(z.hinweis),
  }));
export const PREISE_HINWEIS = '* Anbieterangabe, Prüfung gegen den Preisvergleich folgt. Heller Balken: bei Typ-2-Diabetes Kassenleistung. Größenordnungen, gerundet auf 5 €; keine Preisberatung.';

export function bestand({ preise, fmtDate, warn }) {
  const figures = [];
  const add = (file, meta, body) => figures.push({ file, meta, svg: frame({ file, ...meta, body, warn }) });
  const STEP1EXT = 'Wilding et al., STEP-1-Verlängerung, Diabetes Obes Metab 2022;24(8):1553–1564';

  /* 1. Absetzkurve STEP-1-Verlängerung (wilding2022ext) */
  {
    const px = (w) => 150 + (w / 120) * 760;
    const py = (p) => 176 + (-p / 20) * 336;
    let b = '';
    b += gridY([0, -5, -10, -15, -20], py, px(0), px(120), (p) => `${de(p, 0)} %`);
    for (const w of [0, 68, 120]) b += T(px(w), 536, `Woche ${w}`, { st: 'axis', size: F.axis, fill: C.ink3, anchor: 'middle' });
    b += L(px(68), 140, px(68), py(-20), { c: C.ink, w: 1.2 });
    b += T(px(68) + 9, 150, 'letzte Dosis', { st: 'strong', size: F.text });
    b += T(px(0), 150, '68 Wochen mit Semaglutid', { size: F.small, fill: C.ink3 });
    b += T(px(120), 150, '52 Wochen ohne Medikament', { size: F.small, fill: C.ink3, anchor: 'end' });
    // Verlauf zwischen den Messpunkten schematisch
    b += PATH(`M${px(0)} ${py(0)} C${px(22)} ${py(-1.6)} ${px(45)} ${py(-2)} ${px(68)} ${py(-2)} C${px(86)} ${py(-2)} ${px(102)} ${py(-0.5)} ${px(120)} ${py(-0.1)}`, DOTTED);
    b += PATH(`M${px(0)} ${py(0)} C${px(18)} ${py(-12.5)} ${px(42)} ${py(-17.3)} ${px(68)} ${py(-17.3)}`, { c: C.ink, w: 3 });
    b += PATH(`M${px(68)} ${py(-17.3)} C${px(77)} ${py(-17.3)} ${px(92)} ${py(-7.6)} ${px(120)} ${py(-5.6)}`, { c: C.regain, w: 3 });
    b += DOT(px(68), py(-2), 4.5, C.placebo) + DOT(px(120), py(-0.1), 4.5, C.placebo);
    b += DOT(px(0), py(0), 6, C.ink) + DOT(px(68), py(-17.3), 6, C.ink) + DOT(px(120), py(-5.6), 6, C.regain);
    b += T(px(68) - 14, py(-17.3) + 36, '−17,3 %', { st: 'num', size: F.big, anchor: 'end' });
    b += T(px(120) + 16, py(-5.6) + 10, '−5,6 %', { st: 'num', size: F.big, fill: C.regain });
    b += T(px(68) + 10, py(-2) + 24, 'Placebo −2,0 %', { size: F.small, fill: C.ink3 });
    b += T(px(120) + 16, py(-0.1) + 5, '−0,1 %', { size: F.small, fill: C.ink3 });
    const bx = px(120) + 40;
    b += BRACKET(bx, py(-5.6) + 20, py(-17.3), C.regain);
    const ly = (py(-5.6) + py(-17.3)) / 2;
    b += HL(bx + 14, ly - 12, 'zwei Drittel', 'head', F.label);
    b += T(bx + 14, ly - 12, 'zwei Drittel', { st: 'head', size: F.label, halo: false });
    b += T(bx + 14, ly + 12, 'wieder da', { st: 'head', size: F.label });
    b += T(bx + 14, ly + 36, '+11,6 Prozentpunkte', { size: F.small, fill: C.ink2 });
    b += T(M, 568, 'Messpunkte Woche 0, 68 und 120; Verlauf dazwischen schematisch', { size: F.small, fill: C.ink3 });
    b += legendRow(W - M, 568, [
      ['line', C.ink, 'Semaglutid'],
      ['line', C.regain, 'nach dem Absetzen'],
      ['dotted', C.placebo, 'Placebo'],
    ]);
    add(
      'absetzkurve-step-1.svg',
      {
        title: 'Gewicht nach dem Absetzen der Abnehmspritze',
        subtitle: 'Mittlere Gewichtsänderung gegenüber dem Start: 68 Wochen Semaglutid, danach 52 Wochen ohne Medikament',
        source: STEP1EXT,
        alt: 'Liniendiagramm: Unter Semaglutid 2,4 mg sinkt das Gewicht in 68 Wochen im Mittel um 17,3 Prozent, unter Placebo um 2,0 Prozent. In den 52 Wochen nach dem Absetzen steigt es wieder; nach insgesamt 120 Wochen liegt es bei minus 5,6 Prozent (Semaglutid) und minus 0,1 Prozent (Placebo). Zwei Drittel des Verlusts, 11,6 Prozentpunkte, sind nach einem Jahr ohne Medikament wieder da. Messpunkte Woche 0, 68 und 120, Verlauf dazwischen schematisch.',
      },
      b,
    );
  }

  /* 1b. Säulen „verloren, zurück, bleibt“ (wilding2022ext) */
  {
    const py = (p) => 180 + (-p / 20) * 316;
    let b = '';
    b += T(M, 146, 'Mittlere Gewichtsänderung gegenüber dem Start, Semaglutid-Gruppe der STEP-1-Verlängerung', { size: F.small, fill: C.ink3 });
    b += gridY([0, -5, -10, -15, -20], py, 230, 850, (p) => `${de(p, 0)} %`, { zero: 0 });
    b += R(300, py(0), 200, py(-17.3) - py(0), { fill: C.ink });
    b += T(400, py(-17.3) - 16, 'verloren', { st: 'head', size: F.text, fill: C.bg, anchor: 'middle', inside: true });
    b += T(400, py(-17.3) + 38, '−17,3 %', { st: 'num', size: F.big, anchor: 'middle' });
    b += R(640, py(0), 200, py(-5.6) - py(0), { fill: C.ink });
    b += R(640, py(-5.6), 200, py(-17.3) - py(-5.6), { fill: C.regain });
    b += T(740, (py(0) + py(-5.6)) / 2 + 8, '−5,6 % bleibt', { st: 'num', size: F.value, fill: C.bg, anchor: 'middle', inside: true });
    const my = (py(-5.6) + py(-17.3)) / 2;
    b += T(740, my - 10, '+11,6', { st: 'num', size: F.big, fill: C.bg, anchor: 'middle', inside: true });
    b += T(740, my + 16, 'Prozentpunkte', { st: 'head', size: F.text, fill: C.bg, anchor: 'middle', inside: true });
    b += T(740, my + 36, 'wieder zurück', { st: 'head', size: F.text, fill: C.bg, anchor: 'middle', inside: true });
    b += BRACKET(866, py(-5.6), py(-17.3), C.regain);
    const ly = (py(-5.6) + py(-17.3)) / 2;
    b += HL(882, ly - 12, 'zwei Drittel', 'head', F.label);
    b += T(882, ly - 12, 'zwei Drittel', { st: 'head', size: F.label, halo: false });
    b += T(882, ly + 12, 'des Verlusts', { st: 'head', size: F.label });
    b += T(882, ly + 36, 'zurück', { st: 'head', size: F.label });
    b += T(400, 540, 'Nach 68 Wochen Semaglutid', { st: 'head', size: F.label, anchor: 'middle' });
    b += T(400, 562, '(Woche 68, Ende der Behandlung)', { size: F.small, fill: C.ink3, anchor: 'middle' });
    b += T(740, 540, 'Ein Jahr nach dem Absetzen', { st: 'head', size: F.label, anchor: 'middle' });
    b += T(740, 562, '(Woche 120, ohne Medikament)', { size: F.small, fill: C.ink3, anchor: 'middle' });
    add(
      'absetzkurve-step-1-saeulen.svg',
      {
        title: 'Was nach dem Absetzen bleibt: ein Drittel',
        subtitle: 'STEP-1-Verlängerung: 68 Wochen Semaglutid, danach 52 Wochen ohne Medikament',
        source: STEP1EXT,
        alt: 'Zwei Säulen: Nach 68 Wochen Semaglutid sind im Mittel 17,3 Prozent des Gewichts verloren. Ein Jahr nach dem Absetzen sind 11,6 Prozentpunkte wieder zurück, 5,6 Prozent bleiben; das entspricht zwei Dritteln des Verlusts, die zurückkommen.',
      },
      b,
    );
  }

  /* 1c. Drei Zahlen (wilding2022ext) */
  {
    let b = '';
    const cols = [
      { x: M, when: 'Woche 68', big: '−17,3 %', l1: 'nach 68 Wochen', l2: 'Semaglutid, gegenüber dem Start', fill: C.ink },
      { x: 446, when: 'Woche 120', big: '−5,6 %', l1: 'gegenüber dem Start', l2: 'ein Jahr nach dem Absetzen', fill: C.ink },
      { x: 828, when: 'Woche 68 bis 120', big: '2/3', l1: 'des Verlusts zurück', l2: 'in 52 Wochen ohne Medikament', fill: C.ink, hl: true },
    ];
    const size = Math.min(...cols.map((c) => fit(c.big, 300, 'big', F.huge)));
    cols.forEach((c, i) => {
      if (i) b += L(c.x - 24, 216, c.x - 24, 420);
      b += T(c.x, 236, c.when, { size: F.small, fill: C.ink3 });
      if (c.hl) b += HL(c.x, 330, c.big, 'big', size);
      b += T(c.x, 330, c.big, { st: 'big', size, fill: c.fill, halo: !c.hl });
      b += T(c.x, 376, c.l1, { st: 'head', size: F.label, fill: c.hl ? C.regain : C.ink });
      b += T(c.x, 402, c.l2, { size: F.text, fill: C.ink2 });
    });
    b += L(M, 466, W - M, 466);
    b += T(M, 508, 'Placebo-Gruppe zum Vergleich: −2,0 % nach 68 Wochen, −0,1 % nach 120 Wochen.', { size: F.label, fill: C.ink2 });
    b += T(M, 538, 'Mittelwerte; die Streuung zwischen einzelnen Menschen ist groß.', { size: F.small, fill: C.ink3 });
    add(
      'absetzkurve-step-1-kompakt.svg',
      {
        title: 'Die Absetzkurve in drei Zahlen',
        subtitle: 'Was die STEP-1-Verlängerung über das Jahr nach der letzten Dosis zeigt',
        source: STEP1EXT,
        alt: 'Drei Kennzahlen aus der STEP-1-Verlängerung: minus 17,3 Prozent Gewicht nach 68 Wochen Semaglutid, minus 5,6 Prozent gegenüber dem Start ein Jahr nach dem Absetzen (Woche 120), zwei Drittel des Verlusts in 52 Wochen zurück. Placebo: minus 2,0 und minus 0,1 Prozent.',
      },
      b,
    );
  }

  /* 2. Zeitachse (fachinfoWegovy, fachinfoMounjaro, wu2025) */
  {
    const px = (w) => 360 + (w / 20) * 730;
    let b = '';
    b += gridX([0, 4, 8, 12, 16, 20], px, 158, 552, (w) => `Woche ${w}`, 146);
    // Drei Zeilen; der Kontrolltermin (Vorschlag dieser Seite) ist seit 06.10.2026 entfernt.
    const rows = [
      { y: 212, label: 'Wirkstoff im Körper', sub: 'am Beispiel Semaglutid', note: 'Semaglutid (Halbwertszeit etwa 1 Woche) nach etwa 5 Wochen weitgehend abgebaut, laut Fachinformation Wegovy bis etwa 7 Wochen nachweisbar (gepunktet); Tirzepatid (etwa 5 Tage) schon nach etwa 25 Tagen' },
      { y: 348, label: 'Appetit kommt zurück', sub: 'aus dem Wirkstoffspiegel', note: 'Woche 2 bis 5, mit sinkendem Wirkstoffspiegel; bleibt danach (abgeleitet, nicht gemessen)' },
      { y: 484, label: 'Zunahme messbar', sub: 'Meta-Analyse', note: 'ab etwa Woche 8 messbar, Anstieg bis etwa Woche 20 (Meta-Analyse randomisierter Studien)' },
    ];
    for (const row of rows) {
      b += T(M, row.y + 6, row.label, { st: 'head', size: F.label });
      b += T(M, row.y + 28, row.sub, { size: F.small, fill: C.ink3 });
      b += P(px(0), row.y + 32, row.note, { size: F.small, fill: C.ink2, maxW: W - M - px(0), lh: 19 }).svg;
    }
    const h = 14;
    b += R(px(0), rows[0].y - h / 2, px(5) - px(0), h, { fill: C.ink });
    b += dottedBar(px(5), rows[0].y - h / 2, px(7) - px(5), h, C.ink);
    b += R(px(2), rows[1].y - h / 2, px(5) - px(2), h, { fill: C.regain });
    b += L(px(5), rows[1].y, px(20), rows[1].y, { c: C.regain, w: 2 });
    b += R(px(8), rows[2].y - h / 2, px(20) - px(8), h, { fill: C.regain });
    add(
      'zeitachse-nach-letzter-dosis.svg',
      {
        title: 'Die ersten 20 Wochen nach der letzten Dosis',
        subtitle: 'Was aus Pharmakologie und Studien ableitbar ist; der individuelle Verlauf weicht ab',
        source: 'Fachinformationen Wegovy und Mounjaro (EMA); Wu et al., Meta-Analyse, BMC Medicine 2025',
        alt: 'Zeitachse über 20 Wochen nach der letzten Dosis einer Abnehmspritze: Semaglutid (Halbwertszeit etwa eine Woche) ist nach etwa fünf Wochen weitgehend abgebaut und laut Fachinformation Wegovy bis etwa sieben Wochen nachweisbar, Tirzepatid (Halbwertszeit etwa fünf Tage) nach etwa 25 Tagen. Der Appetit kehrt, abgeleitet aus dem sinkenden Wirkstoffspiegel, ab Woche 2 bis 5 zurück; die Gewichtszunahme ist ab etwa Woche 8 messbar und steigt bis etwa Woche 20.',
      },
      b,
    );
  }

  /* 2b. Vier Phasen (fachinfoWegovy, fachinfoMounjaro, wu2025) */
  {
    const phases = [
      { t: 'Woche 0 bis 2', h: ['Noch wenig', 'Veränderung'], d: 'Genug Wirkstoff im Körper; viele merken keinen Unterschied.', c: C.ink },
      { t: 'Woche 2 bis 5', h: ['Der Appetit', 'kommt zurück'], d: 'Der Wirkstoffspiegel sinkt, der Magen entleert sich wieder schneller, die Sättigung kommt später.', c: C.regain },
      { t: 'Woche 5 bis 8', h: ['Wirkstoff', 'praktisch weg'], d: 'Nach etwa fünf Halbwertszeiten weitgehend abgebaut.', c: C.ink3 },
      { t: 'Ab Woche 8', h: ['Zunahme', 'messbar'], d: 'In Studien ab Woche 8 signifikant, Anstieg bis etwa Woche 20.', c: C.regain },
    ];
    let b = '';
    const cw = 244;
    phases.forEach((p, i) => {
      const x = M + i * 276;
      b += L(x, 222, x + cw, 222, { c: p.c, w: 4, cap: 'butt' });
      b += DOT(x, 222, 6, p.c);
      if (i) b += L(x - 16, 252, x - 16, 432);
      b += T(x, 202, p.t, { st: 'num', size: F.value, fill: p.c });
      p.h.forEach((l, j) => (b += T(x, 280 + j * 30, l, { st: 'head', size: F.value })));
      b += P(x, 356, p.d, { size: F.text, fill: C.ink2, maxW: cw, lh: 23 }).svg;
    });
    b += ARROW_R(W - M + 2, 222, C.regain, 9);
    b += P(M, 490, 'Phasen für Semaglutid, abgeleitet aus der Halbwertszeit laut Fachinformation (etwa eine Woche) und der Wirkweise (verzögerte Magenentleerung). Bei Tirzepatid (Halbwertszeit etwa fünf Tage) ist der Wirkstoff schon nach etwa 25 Tagen abgebaut. Zunahme laut Meta-Analyse randomisierter Studien.', { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'zeitachse-phasen.svg',
      {
        title: 'Nach der letzten Dosis: vier Phasen',
        subtitle: 'Der typische Verlauf am Beispiel Semaglutid, wie er aus Pharmakologie und Studien ableitbar ist',
        source: 'Fachinformationen Wegovy und Mounjaro (EMA); Wu et al., Meta-Analyse, BMC Medicine 2025',
        alt: 'Vier Phasen nach der letzten Dosis am Beispiel Semaglutid (Halbwertszeit etwa eine Woche): Woche 0 bis 2 noch wenig Veränderung, Woche 2 bis 5 kehrt der Appetit zurück, Woche 5 bis 8 ist der Wirkstoff praktisch abgebaut, ab Woche 8 ist die Gewichtszunahme messbar und steigt bis etwa Woche 20. Bei Tirzepatid (Halbwertszeit etwa fünf Tage) ist der Wirkstoff schon nach etwa 25 Tagen abgebaut.',
      },
      b,
    );
  }

  /* 3. Körperzusammensetzung (wilding2021dxa; who2020; leidy2015; sardeli2018) */
  {
    let b = '';
    const x0 = M, w = W - 2 * M, y = 206, h = 104;
    const fat = w * 0.6;
    b += T(x0, 190, 'Anteil am verlorenen Gewicht nach 68 Wochen', { size: F.small, fill: C.ink3 });
    b += R(x0, y, fat, h, { fill: C.fat, stroke: C.fatEdge, sw: 1.4, rx: 3 });
    b += R(x0 + fat, y, w - fat, h, { fill: C.lean, rx: 3 });
    b += T(x0 + 24, y + 54, 'rund 60 %', { st: 'num', size: F.big, inside: true });
    b += T(x0 + 24, y + 82, 'Fettmasse', { st: 'head', size: F.label, inside: true });
    b += T(x0 + fat + 24, y + 54, 'rund 40 %', { st: 'num', size: F.big, fill: C.bg, inside: true });
    b += T(x0 + fat + 24, y + 82, 'fettfreie Masse', { st: 'head', size: F.label, fill: C.bg, inside: true });
    for (let k = 0; k <= 10; k++) b += L(x0 + (w * k) / 10, y + h + 6, x0 + (w * k) / 10, y + h + (k % 2 ? 11 : 15), { c: C.ink3 });
    for (const k of [0, 20, 40, 60, 80, 100]) b += T(x0 + (w * k) / 100, y + h + 36, `${k} %`, { st: 'axis', size: F.axis, fill: C.ink3, anchor: k === 0 ? 'start' : k === 100 ? 'end' : 'middle' });
    const p1 = P(x0, 412, 'Fettfreie Masse heißt: Muskeln, Organe, Knochen, Wasser. Wie viel davon Muskel war, wurde nicht getrennt gemessen.', { size: F.label, lh: 26 });
    b += p1.svg;
    const p2 = P(x0, p1.bottom + 38, 'In Diätstudien hielt Krafttraining den Verlust an fettfreier Masse klein. Empfohlen: Krafttraining an mindestens zwei Tagen pro Woche (WHO) und 1,2 bis 1,6 g Protein pro kg Körpergewicht am Tag (Leidy).', { size: F.label, lh: 26 });
    b += p2.svg;
    b += T(x0, p2.bottom + 38, 'DXA-Substudie mit 140 Teilnehmenden, 68 Wochen, exploratorische Analyse; Anteile gerundet.', { size: F.small, fill: C.ink3 });
    add(
      'koerperzusammensetzung-step-1.svg',
      {
        title: 'Was beim Abnehmen mit Semaglutid verloren geht',
        subtitle: 'Anteil am Gewichtsverlust nach 68 Wochen, STEP-1-Substudie mit DXA-Messung',
        source: 'Wilding et al., STEP 1 body composition, J Endocr Soc 2021; Sardeli et al. 2018; Leidy et al. 2015; WHO 2020',
        alt: 'Balken, der den Gewichtsverlust nach 68 Wochen Semaglutid in einer DXA-Substudie mit 140 Teilnehmenden aufteilt: rund 60 Prozent Fettmasse und rund 40 Prozent fettfreie Masse, also Muskeln, Organe, Knochen und Wasser; wie viel davon Muskel war, wurde nicht getrennt gemessen. In Diätstudien hielt Krafttraining den Verlust an fettfreier Masse klein; empfohlen sind Krafttraining an mindestens zwei Tagen pro Woche und 1,2 bis 1,6 Gramm Protein pro Kilogramm Körpergewicht am Tag.',
      },
      b,
    );
  }

  /* 4. S-LiTE (jensen2024): Mehrzunahme nach Liraglutid allein als Differenz mit 95-%-Konfidenzintervall */
  {
    let b = '';
    b += T(M, 150, 'Studienablauf (Abschnitte nicht maßstäblich)', { size: F.small, fill: C.ink3 });
    const steps = [
      ['Woche −8 bis 0', 'kalorienarme Diät', C.ink3],
      ['Woche 0 bis 52', 'Placebo, Training, Liraglutid oder beides', C.ink],
      ['Woche 52 bis 104', 'ohne jede Behandlung', C.regain],
    ];
    steps.forEach(([a, sub, c], i) => {
      const x = M + i * 362;
      b += T(x, 176, a, { st: 'head', size: F.text });
      b += T(x, 196, sub, { size: F.small, fill: C.ink2 });
      b += L(x, 210, x + 342, 210, { c, w: 3, cap: 'butt' });
    });
    b += T(M, 256, 'Mehrzunahme nach Liraglutid allein in Woche 52 bis 104, verglichen mit …', { st: 'head', size: F.label });
    const px = (kg) => 440 + ((kg + 2) / 14) * 630;
    b += gridX([-2, 0, 2, 4, 6, 8, 10, 12], px, 276, 454, (kg) => `${kg > 0 ? '+' : ''}${de(kg, 0)} kg`, 478, { zero: 0 });
    const rows = [
      { label: '… Training allein', diff: 6.0, lo: 2.1, hi: 10.0, ci: '95-%-KI 2,1 bis 10,0 kg', sig: true },
      { label: '… Training plus Liraglutid', diff: 2.5, lo: -1.5, hi: 6.5, ci: '95-%-KI −1,5 bis 6,5 kg, nicht signifikant', sig: false },
    ];
    rows.forEach((row, i) => {
      const y = 318 + i * 90;
      b += T(M, y + 2, row.label, { st: 'head', size: F.label });
      b += T(M, y + 24, row.ci, { size: F.small, fill: C.ink3 });
      b += L(px(row.lo), y, px(row.hi), y, { c: C.regain, w: 2.6 });
      b += L(px(row.lo), y - 9, px(row.lo), y + 9, { c: C.regain, w: 2.6 });
      b += L(px(row.hi), y - 9, px(row.hi), y + 9, { c: C.regain, w: 2.6 });
      b += row.sig ? DOT(px(row.diff), y, 9, C.regain) : DOT(px(row.diff), y, 8, C.bg, { stroke: C.regain, sw: 2.6 });
      b += T(px(row.hi) + 16, y + 8, `+${de(row.diff)} kg`, { st: 'num', size: F.value, fill: C.regain });
    });
    b += P(M, 520, 'Nach Training plus Liraglutid blieben Gewichtsverlust und Fettabbau ein Jahr nach Therapieende erhalten; nach Liraglutid allein kam das Gewicht zurück. Erwachsene mit Adipositas, betreutes Trainingsprogramm; Punkt = Mittelwert (offen: nicht signifikant), Linie = 95-%-Konfidenzintervall.', { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'training-s-lite.svg',
      {
        title: 'Liraglutid allein: 6 kg mehr Zunahme als nach Training allein',
        subtitle: 'S-LiTE-Nachbeobachtung: Gewichtszunahme im Jahr ohne Behandlung, Liraglutid allein gegenüber den Trainingsgruppen',
        source: 'Jensen et al., S-LiTE follow-up, eClinicalMedicine 2024;69:102475',
        alt: 'Punktdiagramm mit 95-Prozent-Konfidenzintervallen aus der S-LiTE-Nachbeobachtung: Im Jahr ohne Behandlung (Woche 52 bis 104) nahmen Teilnehmende nach Liraglutid allein 6,0 Kilogramm mehr zu als nach Training allein ohne Medikament (2,1 bis 10,0) und 2,5 Kilogramm mehr als nach Training plus Liraglutid (−1,5 bis 6,5, nicht signifikant). Nach Training plus Liraglutid blieben Gewichtsverlust und Fettabbau ein Jahr nach Therapieende erhalten. Studienablauf: 8 Wochen kalorienarme Diät, 52 Wochen Placebo, Training, Liraglutid oder beides, danach 52 Wochen ohne Behandlung.',
      },
      b,
    );
  }

  /* 5. Wirksamkeit in großen Studien (wilding2021step1, wharton2025oasis4, knop2023oasis1, jastreboff2022, pisunyer2015) */
  {
    const rows = [
      { name: 'STEP 1', sub: 'Semaglutid 2,4 mg Spritze, 68 Wochen', drug: -14.9, plac: -2.4 },
      { name: 'OASIS 4', sub: 'Semaglutid 25 mg Tablette, 64 Wochen', drug: -13.6, plac: -2.2 },
      { name: 'OASIS 1', sub: `Semaglutid 50 mg Tablette, nicht zugelassen, 68${NB}Wochen`, drug: -15.1, plac: -2.4 },
      { name: 'SURMOUNT-1', sub: `Tirzepatid 15 mg Spritze (höchster Studienarm), 72${NB}Wochen`, drug: -20.9, plac: -3.1 },
      { name: 'SCALE', sub: 'Liraglutid 3 mg Spritze, 56 Wochen', drug: -8.0, plac: -2.6 },
    ];
    const x0 = 470;
    const px = (p) => x0 + (-p / 22) * 580;
    let b = '';
    b += gridX([0, -5, -10, -15, -20], px, 152, 540, (p) => `${de(p, 0)} %`, 142, { zero: 0 });
    rows.forEach((row, i) => {
      const y = 166 + i * 76;
      b += T(M, y + 16, row.name, { st: 'head', size: F.label });
      b += P(M, y + 36, row.sub, { size: F.small, fill: C.ink3, maxW: x0 - M - 24, lh: 17 }).svg;
      b += R(x0, y, px(row.drug) - x0, 22, { fill: C.ink });
      b += T(px(row.drug) + 10, y + 19, `${de(row.drug)} %`, { st: 'num', size: F.value });
      b += placeboBar(x0, y + 30, px(row.plac) - x0, 14);
      b += T(px(row.plac) + 10, y + 42, `Placebo ${de(row.plac)} %`, { size: F.small, fill: C.ink3 });
    });
    b += T(M, 566, 'Verschiedene Studien mit verschiedenen Teilnehmenden und Laufzeiten; kein direkter Vergleich zwischen den Präparaten.', { size: F.small, fill: C.ink3 });
    add(
      'wirksamkeit-zulassungsstudien.svg',
      {
        title: 'Wie viel Gewicht in großen Studien verloren ging',
        subtitle: 'Mittlere Änderung des Körpergewichts, Wirkstoff gegenüber Placebo; fünf Studien, eine mit nicht zugelassener Dosis',
        source: 'STEP 1 (NEJM 2021), OASIS 4 (NEJM 2025), OASIS 1 (Lancet 2023), SURMOUNT-1 (NEJM 2022), SCALE (NEJM 2015)',
        alt: 'Balkendiagramm aus fünf großen Studien, mittlere Änderung des Körpergewichts: STEP 1 (Semaglutid 2,4 Milligramm Spritze, 68 Wochen) minus 14,9 Prozent gegenüber minus 2,4 Prozent unter Placebo; OASIS 4 (Semaglutid-Tablette 25 Milligramm, 64 Wochen) minus 13,6 gegenüber minus 2,2; OASIS 1 (Semaglutid-Tablette 50 Milligramm, nicht zugelassen, 68 Wochen) minus 15,1 gegenüber minus 2,4; SURMOUNT-1 (Tirzepatid 15 Milligramm, höchster Studienarm, 72 Wochen) minus 20,9 gegenüber minus 3,1; SCALE (Liraglutid 3 Milligramm, 56 Wochen) minus 8,0 gegenüber minus 2,6 Prozent. Kein direkter Vergleich zwischen den Studien.',
      },
      b,
    );
  }

  /* 6. Weiter oder Placebo (rubino2021, aronne2024) */
  {
    const groups = WEITER.gruppen;
    const py = (p) => 372 - p * 11;
    let b = '';
    b += T(M, 146, WEITER.hinweis, { size: F.small, fill: C.ink3 });
    b += gridY([-10, -5, 0, 5, 10, 15], py, 210, W - M, (p) => `${p > 0 ? '+' : p < 0 ? '−' : ''}${Math.abs(p)} %`, { zero: 0 });
    groups.forEach((g, i) => {
      const gx = 300 + i * 450;
      const bar = (x, p, color, label) => {
        let s = R(x, py(0), 150, py(p) - py(0), { fill: color, rx: 1 });
        const v = `${p > 0 ? '+' : '−'}${String(Math.abs(p)).replace('.', ',')} %`;
        s += T(x + 75, p > 0 ? py(p) + 30 : py(p) - 12, v, { st: 'num', size: F.value, fill: C.bg, anchor: 'middle', inside: true });
        s += T(x + 75, p > 0 ? py(0) + 24 : py(0) - 12, label, { st: 'head', size: F.text, fill: C.ink2, anchor: 'middle' });
        return s;
      };
      b += bar(gx, g.cont, C.ink, WEITER.weiter);
      b += bar(gx + 190, g.plac, C.regain, WEITER.placebo);
      b += T(gx + 170, 530, g.name, { st: 'head', size: F.value, anchor: 'middle' });
      b += T(gx + 170, 554, g.sub, { size: F.small, fill: C.ink3, anchor: 'middle' });
    });
    add(
      'weiter-oder-placebo.svg',
      {
        title: 'Weiter behandeln oder absetzen: zwei randomisierte Studien',
        subtitle: 'Gewicht nach dem Wechsel auf Placebo gegenüber Fortführung',
        source: 'Rubino et al., STEP 4, JAMA 2021; Aronne et al., SURMOUNT-4, JAMA 2024',
        alt: 'Balkendiagramm: In STEP 4 nahmen Teilnehmende unter fortgeführtem Semaglutid in 48 Wochen weitere 7,9 Prozent ab, nach dem Wechsel auf Placebo nahmen sie 6,9 Prozent zu. In SURMOUNT-4 nahmen Teilnehmende unter fortgeführtem Tirzepatid in 52 Wochen weitere 5,5 Prozent ab, nach dem Wechsel auf Placebo nahmen sie 14 Prozent zu.',
      },
      b,
    );
  }

  /* 7. Halbwertszeiten (fachinfoWegovy, fachinfoOzempic, fachinfoRybelsus, fachinfoMounjaro, fachinfoSaxenda) */
  {
    const rows = [
      { name: 'Semaglutid', sub: ['Wegovy (Spritze und Tablette),', 'Ozempic, Rybelsus'], hl: 7, hlLabel: 'etwa 1 Woche', gone: 'etwa 5 Wochen', nachweisbar: 49 },
      { name: 'Tirzepatid', sub: ['Mounjaro'], hl: 5, hlLabel: 'etwa 5 Tage', gone: 'etwa 25 Tagen' },
      { name: 'Liraglutid', sub: ['Saxenda'], hl: 13 / 24, hlLabel: 'etwa 13 Stunden', gone: 'etwa 3 Tagen' },
    ];
    const x0 = 400;
    const px = (d) => x0 + (d / 50) * 720;
    let b = '';
    b += gridX([0, 7, 14, 21, 28, 35, 42, 49], px, 156, 444, (d) => (d === 0 ? 'letzte Dosis' : `Tag ${d}`), 146);
    rows.forEach((row, i) => {
      const y = 176 + i * 104;
      b += T(M, y + 18, row.name, { st: 'head', size: F.value });
      row.sub.forEach((line, j) => (b += T(M, y + 42 + j * 19, line, { size: F.small, fill: C.ink3 })));
      b += R(x0, y, Math.max(px(row.hl) - x0, 6), 20, { fill: C.ink });
      b += T(Math.max(px(row.hl), x0 + 6) + 10, y + 15, `Halbwertszeit ${row.hlLabel}`, { st: 'strong', size: F.small });
      const breit = Math.max(px(row.hl * 5) - x0, 6);
      b += R(x0, y + 28, breit, 20, { fill: C.bg2, stroke: C.ink3, sw: 1.2 });
      const lab = `weitgehend abgebaut nach ${row.gone}`;
      if (breit > tw(lab, 'strong', F.small) + 24) b += T(x0 + breit - 10, y + 43, lab, { st: 'strong', size: F.small, fill: C.ink2, anchor: 'end', inside: true });
      else b += T(x0 + breit + 10, y + 43, lab, { st: 'strong', size: F.small, fill: C.ink2 });
      if (row.nachweisbar) {
        const ext = px(row.nachweisbar) - x0 - breit;
        b += dottedBar(x0 + breit, y + 28, ext, 20, C.ink3);
        b += T(px(row.nachweisbar), y + 68, 'laut Fachinformation Wegovy bis etwa 7 Wochen nachweisbar', { size: F.small, fill: C.ink3, anchor: 'end' });
      }
    });
    b += P(M, 488, 'Faustregel: Nach etwa fünf Halbwertszeiten ist ein Wirkstoff weitgehend abgebaut. Die Wirkung auf den Appetit lässt schon vorher spürbar nach. Laut Fachinformation Wegovy (2,4 mg) ist Semaglutid nach der letzten Dosis noch etwa sieben Wochen im Blut nachweisbar; daher die Angabe „fünf bis sieben Wochen“.', { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'halbwertszeiten-praeparate.svg',
      {
        title: 'Wie lange die Abnehmspritze nach der letzten Dosis nachwirkt',
        subtitle: 'Halbwertszeit laut Fachinformation und daraus abgeleitete Zeit bis zum weitgehenden Abbau',
        source: 'Fachinformationen Wegovy, Ozempic, Rybelsus, Mounjaro, Saxenda (EMA-Produktinformationen)',
        alt: 'Balkendiagramm der Halbwertszeiten: Semaglutid etwa eine Woche, weitgehend abgebaut nach etwa fünf Wochen und laut Fachinformation Wegovy bis etwa sieben Wochen nachweisbar; Tirzepatid etwa fünf Tage, abgebaut nach etwa 25 Tagen; Liraglutid etwa 13 Stunden, abgebaut nach etwa drei Tagen. Faustregel: fünf Halbwertszeiten.',
      },
      b,
    );
  }

  /* 8. Warum das Gewicht zurückkommt (fachinfos, sumithran2011, fothergill2016, wilding2021dxa) */
  {
    const cols = WARUM.cols;
    const cw = 240;
    const size = Math.min(...cols.map((c) => fit(c.big, cw, 'num', F.big)));
    let b = '';
    const top = 214;
    const hLines = Math.max(...cols.map((c) => wrap(c.h, cw, 'head', F.label).length));
    const dy = top + 58 + (hLines - 1) * 25 + 36;
    const dLines = Math.max(...cols.map((c) => wrap(c.d, cw, 'body', F.text).length));
    const sy = dy + (dLines - 1) * 23 + 44;
    cols.forEach((c, i) => {
      const x = M + i * 276;
      if (i) b += L(x - 18, top - 32, x - 18, sy + 8);
      b += T(x, top, c.big, { st: 'num', size, fill: c.c });
      b += L(x, top + 20, x + cw, top + 20, { c: c.c, w: 2, cap: 'butt' });
      b += P(x, top + 58, c.h, { st: 'head', size: F.label, maxW: cw, lh: 25 }).svg;
      b += P(x, dy, c.d, { size: F.text, fill: C.ink2, maxW: cw, lh: 23 }).svg;
      b += T(x, sy, c.src, { size: F.small, fill: C.ink3 });
    });
    b += L(M, sy + 40, W - M, sy + 40);
    b += P(M, sy + 76, WARUM.halten, { size: F.text, fill: C.ink2, lh: 23 }).svg;
    add(
      'warum-das-gewicht-zurueckkommt.svg',
      {
        title: 'Warum das Gewicht nach dem Absetzen zurückkommt',
        subtitle: 'Vier Mechanismen, nach Gewichtsverlust belegt und auf die Zeit nach der Spritze übertragen',
        source: 'Fachinformationen (EMA); Sumithran 2011; Fothergill 2016; Wilding 2021; Jensen 2024; Sardeli 2018; Leidy 2015',
        alt: 'Vier Spalten mit den Mechanismen des Jojo-Effekts, nach Gewichtsverlust belegt und auf die Zeit nach der Abnehmspritze übertragen: Die Appetitbremse fällt weg, sobald der Wirkstoff weitgehend abgebaut ist (Semaglutid nach etwa 5 Wochen weitgehend abgebaut, bis etwa 7 Wochen nachweisbar; Tirzepatid nach etwa 25 Tagen); die Hungerhormone Ghrelin und Leptin bleiben noch ein Jahr nach einer Diät verschoben; der Ruheenergieverbrauch blieb in einer kleinen Studie mit 14 Teilnehmenden, einem Extremfall, noch sechs Jahre nach starkem Gewichtsverlust abgesenkt; rund 40 Prozent des Gewichtsverlusts unter Semaglutid entfielen auf fettfreie Masse. In Studien halfen beim Halten: Krafttraining und Protein.',
      },
      b,
    );
  }

  /* 9. Proteinbedarf (leidy2015) */
  {
    const kgs = [60, 70, 80, 90, 100];
    const x0 = 350;
    const px = (g) => x0 + (g / 200) * 720;
    const kx = M + tw('100 kg', 'num', F.value) + 14;
    let b = '';
    b += gridX([0, 50, 100, 150, 200], px, 156, 456, (g) => `${g} g`, 146);
    kgs.forEach((kg, i) => {
      const y = 166 + i * 58;
      b += T(M, y + 22, `${kg} kg`, { st: 'num', size: F.value });
      b += T(kx, y + 22, 'Körpergewicht', { size: F.small, fill: C.ink3 });
      const lo = kg * 1.2, hi = kg * 1.6;
      b += L(px(0), y + 16, px(lo), y + 16, { c: C.ink3, w: 1.2 });
      b += R(px(lo), y + 5, px(hi) - px(lo), 22, { fill: C.lean });
      b += T(px(hi) + 12, y + 22, `${Math.round(lo)} bis ${Math.round(hi)} g am Tag`, { st: 'strong', size: F.text, fill: C.lean });
    });
    b += T(M, 500, 'Empfehlung für Gewichtsabnahme und -erhalt: 1,2 bis 1,6 g Protein pro kg Körpergewicht und Tag.', { size: F.text });
    b += P(M, 530, 'Verteilt auf drei bis vier Mahlzeiten mit mindestens etwa 25 bis 30 g pro Mahlzeit; bei Nierenerkrankungen vorher ärztlich klären.', { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'proteinbedarf-nach-abnehmspritze.svg',
      {
        title: 'Wie viel Protein nach der Abnehmspritze',
        subtitle: 'Tagesmenge nach Körpergewicht, Zielkorridor aus einer Übersichtsarbeit',
        source: 'Leidy et al., Am J Clin Nutr 2015;101(6):1320S–1329S',
        alt: 'Balkendiagramm des Proteinbedarfs von 1,2 bis 1,6 Gramm pro Kilogramm Körpergewicht: bei 60 Kilogramm 72 bis 96 Gramm am Tag, bei 70 Kilogramm 84 bis 112, bei 80 Kilogramm 96 bis 128, bei 90 Kilogramm 108 bis 144, bei 100 Kilogramm 120 bis 160 Gramm. Verteilt auf drei bis vier Mahlzeiten mit mindestens etwa 25 bis 30 Gramm pro Mahlzeit.',
      },
      b,
    );
  }

  /* 10. Preise im Monat (src/data/markt/preise.json) */
  {
    const rows = preisZeilen(preise);
    const x0 = 500;
    const px = (e) => x0 + (e / 500) * 540;
    const rh = Math.min(32, Math.floor(372 / rows.length));
    const y0 = 154;
    let b = '';
    b += gridX([0, 100, 200, 300, 400, 500], px, y0 - 6, y0 + rows.length * rh, (e) => `${e} €`, 142);
    rows.forEach((row, i) => {
      const y = y0 + i * rh;
      b += T(M, y + rh / 2 + 5, row.name, { st: 'strong', size: F.small, w: 520 });
      b += R(x0, y + rh / 2 - 10, px(row.eur) - x0, 20, row.kasse ? { fill: C.bg2, stroke: C.ink, sw: 1.4 } : { fill: C.ink });
      b += T(px(row.eur) + 8, y + rh / 2 + 6, `ca. ${row.eur} €${row.flag}`, { st: 'strong', size: F.text });
    });
    b += P(M, y0 + rows.length * rh + 26, PREISE_HINWEIS, { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'preise-im-monat.svg',
      {
        title: 'Was Abnehmspritzen und die Tablette im Monat kosten',
        subtitle: `Apothekenverkaufspreise für Selbstzahler als Größenordnung, Stand ${fmtDate(preise.stand)}`,
        source: `Preisvergleich medipreis.de; Tabletten laut Presseberichten zum Marktstart am 1. September 2026`,
        alt: `Balkendiagramm der monatlichen Selbstzahlerpreise, Stand ${fmtDate(preise.stand)}: ${rows.map((row) => `${row.name} ca. ${row.eur} Euro`).join('; ')}. Größenordnungen, gerundet auf 5 Euro; Ozempic ist bei Typ-2-Diabetes Kassenleistung.`,
      },
      b,
    );
  }

  /* 11. Haarausfall nach schnellem Gewichtsverlust (malkud2015, leidy2015, almandoz2024) */
  {
    // Ausfall beginnt zwei bis drei Monate nach dem Auslöser und klingt meist innerhalb von etwa sechs Monaten nach Beginn ab (malkud2015)
    const px = (m) => 340 + (m / 12) * 750;
    let b = '';
    b += gridX([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], px, 156, 418, (m) => (m === 0 ? 'Auslöser' : String(m)), 146);
    const rows = [
      { y: 190, label: 'Schnelle Abnahme', note: 'Der Auslöser: Viele Haare wechseln gleichzeitig in die Ruhephase; sichtbar ist noch nichts' },
      { y: 280, label: 'Haare fallen aus', note: 'Beginnt zwei bis drei Monate nach dem Auslöser; klingt meist innerhalb von etwa sechs Monaten nach Beginn ab' },
      { y: 370, label: 'Haare wachsen nach', note: 'Nachwachsende Haare werden sichtbar, sobald der Auslöser weggefallen ist; bis zur alten Länge dauert es länger' },
    ];
    const h = 14;
    for (const row of rows) {
      b += T(M, row.y + 6, row.label, { st: 'head', size: F.label });
      b += P(px(0), row.y + 32, row.note, { size: F.small, fill: C.ink2, maxW: W - M - px(0), lh: 19 }).svg;
    }
    b += R(px(0), rows[0].y - h / 2, px(2) - px(0), h, { fill: C.ink });
    b += R(px(2), rows[1].y - h / 2, px(6) - px(2), h, { fill: C.ink });
    b += dottedBar(px(6), rows[1].y - h / 2, px(9) - px(6), h, C.ink);
    b += T(px(9) + 10, rows[1].y + 5, 'klingt ab', { size: F.small, fill: C.ink3 });
    b += R(px(6), rows[2].y - h / 2, px(12) - px(6), h, { fill: C.lean });
    b += L(M, 446, W - M, 446);
    b += T(M, 476, 'Was sich beeinflussen lässt', { st: 'head', size: F.label });
    b += P(M, 502, 'Protein 1,2 bis 1,6 g pro kg Körpergewicht am Tag · Eisenwert (Ferritin) prüfen lassen · Zink und Biotin nur bei nachgewiesener Lücke', { size: F.small, fill: C.ink2, lh: 19 }).svg;
    b += P(M, 526, 'Ärztlich abklären: länger als sechs Monate, fleckig oder mit Müdigkeit und Frieren (Eisen, Schilddrüse)', { size: F.small, fill: C.ink2, lh: 19 }).svg;
    b += T(M, 556, 'Verlauf schematisch; der Zeitpunkt hängt am Auslöser, nicht am Medikament.', { size: F.small, fill: C.ink3 });
    add(
      'haarausfall-zeitverlauf.svg',
      {
        title: 'Haarausfall nach schnellem Gewichtsverlust: der Verlauf',
        subtitle: 'Telogenes Effluvium: verzögert, diffus, vorübergehend; Zeitangaben in Monaten nach dem Auslöser',
        source: 'Malkud, J Clin Diagn Res 2015; Leidy et al., Am J Clin Nutr 2015; Almandoz et al., Obesity 2024',
        alt: 'Zeitachse des telogenen Effluviums über zwölf Monate, schematisch: Nach schnellem Gewichtsverlust wechseln viele Haare in die Ruhephase, zwei bis drei Monate später beginnt diffuser Haarausfall, der meist innerhalb von etwa sechs Monaten nach Beginn abklingt, wenn der Auslöser weggefallen ist; danach wachsen die Haare nach. Beeinflussbar sind Protein (1,2 bis 1,6 Gramm pro Kilogramm Körpergewicht am Tag), der Eisenwert sowie Zink und Biotin bei nachgewiesener Lücke; länger als sechs Monate, fleckig oder mit Müdigkeit und Frieren ärztlich abklären.',
      },
      b,
    );
  }

  /* 12. Abnehmpille: belegt und offen (wharton2025oasis4, fachinfoRybelsus, wilding2022ext, wu2025) */
  {
    let b = '';
    const lw = 560 - M;
    b += T(M, 160, 'Belegt: Gewichtsverlust unter der Tablette', { st: 'head', size: F.label });
    b += P(M, 184, 'OASIS 4: 25 mg, 64 Wochen, 307 Erwachsene ohne Diabetes', { size: F.small, fill: C.ink3, maxW: lw, lh: 19 }).svg;
    const base = 248, sc = 15;
    b += L(M, base, 560, base, { c: C.ink3, w: 1.2 });
    b += T(185, base - 14, 'Semaglutid-Tablette', { st: 'head', size: F.text, fill: C.ink2, anchor: 'middle' });
    b += R(110, base, 150, 13.6 * sc, { fill: C.ink, rx: 1 });
    b += T(185, base + 13.6 * sc + 38, '−13,6 %', { st: 'num', size: F.big, anchor: 'middle' });
    b += T(415, base - 14, 'Placebo', { st: 'head', size: F.text, fill: C.ink2, anchor: 'middle' });
    b += placeboBar(340, base, 150, 2.2 * sc);
    b += T(415, base + 2.2 * sc + 34, '−2,2 %', { st: 'num', size: F.value, fill: C.ink3, anchor: 'middle' });
    b += P(M, 548, 'Bei durchgehender Einnahme: −16,6 %. Mittelwerte gegenüber dem Start.', { size: F.small, fill: C.ink3, maxW: lw, lh: 19 }).svg;
    b += L(600, 146, 600, 566);
    const x = 640, mw = W - M - x;
    b += T(x, 160, 'Offen: Verlauf nach dem Absetzen', { st: 'head', size: F.label });
    b += T(x, 184, 'Stand Oktober 2026', { size: F.small, fill: C.ink3 });
    b += T(x, 256, 'Noch keine Studie', { st: 'big', size: fit('Noch keine Studie', mw, 'big', 44) });
    b += T(x, 286, 'zur Wiederzunahme nach dem Absetzen der Tablette', { size: F.text, fill: C.ink2 });
    b += L(x, 314, W - M, 314);
    b += T(x, 346, 'Was sich übertragen lässt, mit Vorbehalt:', { st: 'strong', size: F.small });
    const items = [
      'gleicher Wirkstoff, Halbwertszeit etwa eine Woche wie bei der Spritze',
      'Spritze: zwei Drittel des Verlusts ein Jahr nach dem Absetzen zurück (STEP-1-Verlängerung, von −17,3 % auf −5,6 %)',
      'Studien zu Adipositas-Medikamenten: Zunahme ab Woche 8 messbar',
    ];
    let y = 374;
    for (const it of items) {
      b += T(x, y, '–', { size: F.small, fill: C.ink3 });
      const p = P(x + 18, y, it, { size: F.small, fill: C.ink2, maxW: mw - 18, lh: 19 });
      b += p.svg;
      y = p.bottom + 28;
    }
    b += P(x, 548, 'Jede Aussage zur Tablette nach dem Absetzen ist ein Übertrag, keine Messung.', { size: F.small, fill: C.ink3, maxW: mw, lh: 19 }).svg;
    add(
      'abnehmpille-belegt-und-offen.svg',
      {
        title: 'Abnehmpille absetzen: was belegt ist und was fehlt',
        subtitle: 'Die Zulassungsstudie der Semaglutid-Tablette gegenüber der Datenlage für die Zeit danach',
        source: 'OASIS 4 (NEJM 2025); Fachinformation Rybelsus (EMA); STEP-1-Verlängerung (2022); Wu et al. (2025)',
        alt: 'Zwei Felder: Links die Zulassungsstudie OASIS 4 der Semaglutid-Tablette 25 Milligramm mit 307 Teilnehmenden ohne Diabetes: minus 13,6 Prozent Gewicht gegenüber minus 2,2 Prozent unter Placebo nach 64 Wochen, bei durchgehender Einnahme minus 16,6 Prozent. Rechts der offene Punkt: Es gibt noch keine Studie zur Wiederzunahme nach dem Absetzen der Tablette (Stand Oktober 2026). Übertragbar mit Vorbehalt: gleicher Wirkstoff mit einer Halbwertszeit von etwa einer Woche; nach dem Absetzen der Spritze waren in der STEP-1-Verlängerung zwei Drittel des Verlusts nach einem Jahr zurück (von minus 17,3 auf minus 5,6 Prozent); in Studien zu Adipositas-Medikamenten ist die Zunahme ab Woche 8 messbar.',
      },
      b,
    );
  }

  return figures;
}
