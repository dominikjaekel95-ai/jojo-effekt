/**
 * Die bestehenden Studien-Grafiken (gleiche Dateinamen und URLs wie vor dem Redesign), im Design „Kalk“.
 * Inhalte und Zahlen unverändert; Quellen-IDs aus src/data/sources.ts in den Kommentaren. Datentabellen dazu in
 * src/data/grafiken-daten.json.
 */
import { C, W, M, T, P, L, R, PATH, DOT, DOTTED, HL, BRACKET, ARROW_R, legendRow, gridY, gridX, placeboBar, tw, fit, wrap, de, frame } from './grafiken-lib.mjs';

export function bestand({ preise, fmtDate, warn }) {
  const figures = [];
  const add = (file, meta, body) => figures.push({ file, svg: frame({ file, ...meta, body, warn }) });

  /* 1. Absetzkurve STEP-1-Verlängerung (wilding2022ext) */
  {
    const px = (w) => 150 + (w / 120) * 760;
    const py = (p) => 180 + (-p / 20) * 360;
    let b = '';
    b += gridY([0, -5, -10, -15, -20], py, px(0), px(120), (p) => `${de(p, 0)} %`);
    for (const w of [0, 68, 120]) b += T(px(w), 566, `Woche ${w}`, { st: 'axis', size: 14, fill: C.ink3, anchor: 'middle', tnum: true });
    // letzte Dosis
    b += L(px(68), 140, px(68), py(-20), { c: C.ink, w: 1.2 });
    b += T(px(68) + 9, 150, 'letzte Dosis', { st: 'strong', size: 15 });
    b += T(px(0), 150, '68 Wochen mit Semaglutid', { size: 14, fill: C.ink3 });
    b += T(px(120), 150, '52 Wochen ohne Medikament', { size: 14, fill: C.ink3, anchor: 'end' });
    // Placebo (gepunktet), Behandlung (Tinte), Wiederzunahme (Braun); Verlauf zwischen den Messpunkten schematisch
    b += PATH(`M${px(0)} ${py(0)} C${px(22)} ${py(-1.6)} ${px(45)} ${py(-2)} ${px(68)} ${py(-2)} C${px(86)} ${py(-2)} ${px(102)} ${py(-0.5)} ${px(120)} ${py(-0.1)}`, DOTTED);
    b += PATH(`M${px(0)} ${py(0)} C${px(18)} ${py(-12.5)} ${px(42)} ${py(-17.3)} ${px(68)} ${py(-17.3)}`, { c: C.ink, w: 3 });
    b += PATH(`M${px(68)} ${py(-17.3)} C${px(77)} ${py(-17.3)} ${px(92)} ${py(-7.6)} ${px(120)} ${py(-5.6)}`, { c: C.regain, w: 3 });
    b += DOT(px(68), py(-2), 4.5, C.placebo) + DOT(px(120), py(-0.1), 4.5, C.placebo);
    b += DOT(px(0), py(0), 5.5, C.ink) + DOT(px(68), py(-17.3), 6, C.ink) + DOT(px(120), py(-5.6), 6, C.regain);
    b += T(px(68) - 14, py(-17.3) + 34, '−17,3 %', { st: 'num', size: 26, anchor: 'end' });
    b += T(px(120) + 16, py(-5.6) + 9, '−5,6 %', { st: 'num', size: 26, fill: C.regain });
    b += T(px(68) + 10, py(-2) + 24, 'Placebo −2,0 %', { size: 14, fill: C.ink3 });
    b += T(px(120) + 16, py(-0.1) + 5, '−0,1 %', { size: 14, fill: C.ink3 });
    // zwei Drittel zurück
    const bx = px(120) + 40;
    b += BRACKET(bx, py(-5.6) + 18, py(-17.3), C.regain);
    const ly = (py(-5.6) + py(-17.3)) / 2;
    b += HL(bx + 14, ly - 12, 'zwei Drittel', 'head', 20);
    b += T(bx + 14, ly - 12, 'zwei Drittel', { st: 'head', size: 20, halo: false });
    b += T(bx + 14, ly + 12, 'wieder da', { st: 'head', size: 20 });
    b += T(bx + 14, ly + 36, '+11,6 Prozentpunkte', { size: 14, fill: C.ink2 });
    b += T(M, 600, 'Messpunkte Woche 0, 68 und 120; Verlauf dazwischen schematisch', { size: 14, fill: C.ink3 });
    b += legendRow(W - M, 600, [
      ['line', C.ink, 'Semaglutid 2,4 mg'],
      ['line', C.regain, 'nach dem Absetzen'],
      ['dotted', C.placebo, 'Placebo'],
    ]);
    add(
      'absetzkurve-step-1.svg',
      {
        title: 'Gewicht nach dem Absetzen der Abnehmspritze',
        subtitle: 'Mittlere Gewichtsänderung gegenüber dem Start: 68 Wochen Semaglutid, danach 52 Wochen ohne Medikament',
        source: 'Wilding et al., STEP 1 trial extension, Diabetes Obes Metab 2022;24(8):1553–1564',
        alt: 'Liniendiagramm: Unter Semaglutid 2,4 mg sinkt das Gewicht in 68 Wochen im Mittel um 17,3 Prozent, unter Placebo um 2,0 Prozent. In den 52 Wochen nach dem Absetzen steigt es wieder; nach insgesamt 120 Wochen liegt es bei minus 5,6 Prozent (Semaglutid) und minus 0,1 Prozent (Placebo). Zwei Drittel des Verlusts sind nach einem Jahr ohne Medikament wieder da.',
      },
      b,
    );
  }

  /* 1b. Säulen „verloren, zurück, bleibt“ (wilding2022ext) */
  {
    const py = (p) => 180 + (-p / 20) * 340;
    let b = '';
    b += T(M, 146, 'Mittlere Gewichtsänderung gegenüber dem Start, Semaglutid-Gruppe der STEP-1-Verlängerung', { size: 14, fill: C.ink3 });
    b += gridY([0, -5, -10, -15, -20], py, 230, 1000, (p) => `${de(p, 0)} %`, { zero: 0 });
    // Säule 1: Woche 68
    b += R(300, py(0), 200, py(-17.3) - py(0), { fill: C.ink });
    b += T(400, py(-17.3) - 16, 'verloren', { st: 'head', size: 17, fill: C.bg, anchor: 'middle', inside: true });
    b += T(400, py(-17.3) + 36, '−17,3 %', { st: 'num', size: 28, anchor: 'middle' });
    // Säule 2: Woche 120
    b += R(640, py(0), 200, py(-5.6) - py(0), { fill: C.ink });
    b += R(640, py(-5.6), 200, py(-17.3) - py(-5.6), { fill: C.regain });
    b += T(740, (py(0) + py(-5.6)) / 2 + 8, '−5,6 % bleibt', { st: 'num', size: 20, fill: C.bg, anchor: 'middle', inside: true });
    b += T(740, (py(-5.6) + py(-17.3)) / 2 - 4, '+11,6 Punkte', { st: 'num', size: 22, fill: C.bg, anchor: 'middle', inside: true });
    b += T(740, (py(-5.6) + py(-17.3)) / 2 + 22, 'wieder zurück', { st: 'head', size: 16, fill: C.bg, anchor: 'middle', inside: true });
    // Klammer
    b += BRACKET(866, py(-5.6), py(-17.3), C.regain);
    const ly = (py(-5.6) + py(-17.3)) / 2;
    b += HL(882, ly - 10, 'zwei Drittel', 'head', 20);
    b += T(882, ly - 10, 'zwei Drittel', { st: 'head', size: 20, halo: false });
    b += T(882, ly + 14, 'des Verlusts', { st: 'head', size: 20 });
    b += T(882, ly + 38, 'zurück', { st: 'head', size: 20 });
    b += T(400, 556, 'Nach 68 Wochen Semaglutid', { st: 'head', size: 17, anchor: 'middle' });
    b += T(400, 578, '(Woche 68, Ende der Behandlung)', { size: 14, fill: C.ink3, anchor: 'middle' });
    b += T(740, 556, 'Ein Jahr nach dem Absetzen', { st: 'head', size: 17, anchor: 'middle' });
    b += T(740, 578, '(Woche 120, ohne Medikament)', { size: 14, fill: C.ink3, anchor: 'middle' });
    add(
      'absetzkurve-step-1-saeulen.svg',
      {
        title: 'Was nach dem Absetzen bleibt: ein Drittel',
        subtitle: 'STEP-1-Verlängerung: 68 Wochen Semaglutid, danach 52 Wochen ohne Medikament',
        source: 'Wilding et al., STEP 1 trial extension, Diabetes Obes Metab 2022;24(8):1553–1564',
        alt: 'Zwei Säulen: Nach 68 Wochen Semaglutid sind im Mittel 17,3 Prozent des Gewichts verloren. Ein Jahr nach dem Absetzen sind 11,6 Prozentpunkte wieder zurück, 5,6 Prozent bleiben; das entspricht zwei Dritteln des Verlusts, die zurückkommen.',
      },
      b,
    );
  }

  /* 1c. Drei Zahlen (wilding2022ext) */
  {
    let b = '';
    const cols = [
      { x: M, when: 'Woche 68', big: '−17,3 %', l1: 'nach 68 Wochen', l2: 'Semaglutid 2,4 mg', fill: C.ink },
      { x: 446, when: 'Woche 120', big: '−5,6 %', l1: 'ein Jahr später', l2: 'ohne Medikament', fill: C.ink },
      { x: 828, when: 'Woche 68 bis 120', big: '2/3', l1: 'des Verlusts zurück', l2: 'in 52 Wochen ohne Medikament', fill: C.ink, hl: true },
    ];
    const size = Math.min(...cols.map((c) => fit(c.big, 300, 'big', 76)));
    cols.forEach((c, i) => {
      if (i) b += L(c.x - 24, 180, c.x - 24, 390);
      b += T(c.x, 200, c.when, { size: 15, fill: C.ink3 });
      if (c.hl) b += HL(c.x, 296, c.big, 'big', size);
      b += T(c.x, 296, c.big, { st: 'big', size, fill: c.fill, halo: !c.hl });
      b += T(c.x, 342, c.l1, { st: 'head', size: 20, fill: c.hl ? C.regain : C.ink });
      b += T(c.x, 370, c.l2, { size: 16, fill: C.ink2 });
    });
    b += L(M, 440, W - M, 440);
    b += T(M, 484, 'Placebo-Gruppe zum Vergleich: −2,0 % nach 68 Wochen, −0,1 % nach 120 Wochen.', { size: 18, fill: C.ink2 });
    b += T(M, 514, 'Mittelwerte; die Streuung zwischen einzelnen Menschen ist groß.', { size: 15, fill: C.ink3 });
    add(
      'absetzkurve-step-1-kompakt.svg',
      {
        title: 'Die Absetzkurve in drei Zahlen',
        subtitle: 'Was die STEP-1-Verlängerung über das Jahr nach der letzten Dosis zeigt',
        source: 'Wilding et al., STEP 1 trial extension, Diabetes Obes Metab 2022;24(8):1553–1564',
        alt: 'Drei Kennzahlen aus der STEP-1-Verlängerung: minus 17,3 Prozent Gewicht nach 68 Wochen Semaglutid, minus 5,6 Prozent ein Jahr nach dem Absetzen, zwei Drittel des Verlusts in 52 Wochen zurück. Placebo: minus 2,0 und minus 0,1 Prozent.',
      },
      b,
    );
  }

  /* 2. Zeitachse (fachinfoWegovy, fachinfoMounjaro, wu2025) */
  {
    const px = (w) => 360 + (w / 20) * 740;
    let b = '';
    b += gridX([0, 4, 8, 12, 16, 20], px, 162, 556, (w) => `Woche ${w}`, 150);
    const rows = [
      { y: 202, label: 'Wirkstoff im Körper', note: 'nach etwa fünf Halbwertszeiten weitgehend abgebaut (Semaglutid etwa 1 Woche, Tirzepatid etwa 5 Tage)' },
      { y: 300, label: 'Appetit kommt zurück', note: 'Woche 2 bis 5, mit sinkendem Wirkstoffspiegel; bleibt danach' },
      { y: 398, label: 'Zunahme messbar', note: 'ab Woche 8 signifikant, Anstieg bis etwa Woche 20 (Meta-Analyse randomisierter Studien)' },
      { y: 496, label: 'Kontrolltermin', note: 'Ärztlicher Kontrolltermin 8 bis 12 Wochen nach der letzten Dosis: dann zeigt sich, ob die Zunahme beginnt' },
    ];
    for (const row of rows) {
      b += T(M, row.y + 6, row.label, { st: 'head', size: 19 });
      b += P(px(0), row.y + 34, row.note, { size: 15, fill: C.ink2, maxW: W - M - px(0), lh: 20 }).svg;
    }
    const h = 14;
    b += R(px(0), rows[0].y - h / 2, px(5) - px(0), h, { fill: C.ink });
    b += R(px(5), rows[0].y - h / 2, px(7) - px(5), h, { stroke: C.ink, sw: 1.4, dash: '0.1 4' });
    b += R(px(2), rows[1].y - h / 2, px(5) - px(2), h, { fill: C.regain });
    b += L(px(5), rows[1].y, px(20), rows[1].y, { c: C.regain, w: 2 });
    b += R(px(8), rows[2].y - h / 2, px(20) - px(8) - 6, h, { fill: C.regain });
    b += ARROW_R(px(20) + 8, rows[2].y, C.regain, 10);
    b += R(px(8), rows[3].y - h / 2, px(12) - px(8), h, { stroke: C.ink, sw: 1.6 });
    add(
      'zeitachse-nach-letzter-dosis.svg',
      {
        title: 'Die ersten 20 Wochen nach der letzten Dosis',
        subtitle: 'Was aus Pharmakologie und Studien ableitbar ist; der individuelle Verlauf weicht ab',
        source: 'Fachinformationen Wegovy und Mounjaro (EMA); Wu et al., Meta-Analyse, BMC Medicine 2025',
        alt: 'Zeitachse über 20 Wochen nach der letzten Dosis einer Abnehmspritze: Der Wirkstoff ist nach etwa fünf bis sieben Wochen weitgehend abgebaut, der Appetit kehrt ab Woche 2 bis 5 zurück, die Gewichtszunahme ist ab Woche 8 messbar und steigt bis etwa Woche 20. Ein Kontrolltermin 8 bis 12 Wochen nach der letzten Dosis ist markiert.',
      },
      b,
    );
  }

  /* 2b. Vier Phasen (fachinfoWegovy, fachinfoMounjaro, wu2025) */
  {
    const phases = [
      { t: 'Woche 1 bis 2', h: 'Noch wenig Veränderung', d: 'Genug Wirkstoff im Körper; viele merken keinen Unterschied.', c: C.ink },
      { t: 'Woche 2 bis 5', h: 'Der Appetit kommt zurück', d: 'Wirkstoffspiegel sinkt, der Magen arbeitet schneller, Sättigung kommt später.', c: C.regain },
      { t: 'Woche 5 bis 8', h: 'Wirkstoff praktisch weg', d: 'Nach etwa fünf Halbwertszeiten weitgehend abgebaut.', c: C.ink3 },
      { t: 'Ab Woche 8', h: 'Zunahme messbar', d: 'In Studien ab Woche 8 signifikant, Anstieg bis etwa Woche 20.', c: C.regain },
    ];
    let b = '';
    const cw = 248;
    const hLines = Math.max(...phases.map((p) => wrap(p.h, cw, 'head', 24).length));
    const dy = 268 + (hLines - 1) * 30 + 40;
    phases.forEach((p, i) => {
      const x = M + i * 274;
      b += L(x, 206, x + cw, 206, { c: p.c, w: 4, cap: 'butt' });
      b += DOT(x, 206, 6, p.c);
      if (i) b += L(x - 13, 236, x - 13, 470);
      b += T(x, 186, p.t, { st: 'num', size: 20, fill: p.c });
      b += P(x, 268, p.h, { st: 'head', size: 24, maxW: cw, lh: 30 }).svg;
      b += P(x, dy, p.d, { size: 17, fill: C.ink2, maxW: cw, lh: 24 }).svg;
    });
    b += ARROW_R(W - M + 2, 206, C.regain, 9);
    b += P(M, 530, 'Halbwertszeiten laut Fachinformation (Semaglutid etwa eine Woche, Tirzepatid etwa fünf Tage); Zunahme laut Meta-Analyse randomisierter Studien.', { size: 15, fill: C.ink3, lh: 21 }).svg;
    add(
      'zeitachse-phasen.svg',
      {
        title: 'Nach der letzten Dosis: vier Phasen',
        subtitle: 'Der typische Verlauf, wie er aus Pharmakologie und Studien ableitbar ist',
        source: 'Fachinformationen Wegovy und Mounjaro (EMA); Wu et al., Meta-Analyse, BMC Medicine 2025',
        alt: 'Vier Phasen nach der letzten Dosis einer Abnehmspritze: Woche 1 bis 2 noch wenig Veränderung, Woche 2 bis 5 kehrt der Appetit zurück, Woche 5 bis 8 ist der Wirkstoff praktisch abgebaut, ab Woche 8 ist die Gewichtszunahme messbar und steigt bis etwa Woche 20.',
      },
      b,
    );
  }

  /* 3. Körperzusammensetzung (wilding2021dxa; who2020; leidy2015; sardeli2018) */
  {
    let b = '';
    const x0 = M, w = W - 2 * M, y = 200, h = 104;
    const fat = w * 0.6;
    b += T(x0, 184, 'Anteil am verlorenen Gewicht', { size: 14, fill: C.ink3 });
    b += R(x0, y, fat, h, { fill: C.fat, stroke: C.fatEdge, sw: 1.4, rx: 3 });
    b += R(x0 + fat, y, w - fat, h, { fill: C.lean, rx: 3 });
    b += T(x0 + 24, y + 54, 'rund 60 %', { st: 'num', size: 34, inside: true });
    b += T(x0 + 24, y + 82, 'Fettmasse', { st: 'head', size: 18, inside: true });
    b += T(x0 + fat + 24, y + 54, 'rund 40 %', { st: 'num', size: 34, fill: C.bg, inside: true });
    b += T(x0 + fat + 24, y + 82, 'fettfreie Masse', { st: 'head', size: 18, fill: C.bg, inside: true });
    for (let k = 0; k <= 10; k++) b += L(x0 + (w * k) / 10, y + h + 6, x0 + (w * k) / 10, y + h + (k % 5 ? 11 : 16), { c: C.ink3 });
    for (const k of [0, 20, 40, 60, 80, 100]) b += T(x0 + (w * k) / 100, y + h + 36, `${k} %`, { st: 'axis', size: 14, fill: C.ink3, anchor: k === 0 ? 'start' : k === 100 ? 'end' : 'middle', tnum: true });
    const p1 = P(x0, 402, 'Fettfreie Masse heißt: Muskeln, Organe, Knochen, Wasser. Wie viel davon Muskel war, wurde nicht getrennt gemessen.', { size: 18, lh: 27 });
    b += p1.svg;
    const p2 = P(x0, p1.bottom + 40, 'Was den Anteil klein hält, ist in Studien belegt: Krafttraining an mindestens zwei Tagen pro Woche und 1,2 bis 1,6 g Protein pro kg Körpergewicht am Tag.', { size: 18, lh: 27 });
    b += p2.svg;
    b += T(x0, p2.bottom + 42, 'DXA-Substudie mit 140 Teilnehmenden, exploratorische Analyse; Anteile gerundet.', { size: 15, fill: C.ink3 });
    add(
      'koerperzusammensetzung-step-1.svg',
      {
        title: 'Was beim Abnehmen mit Semaglutid verloren geht',
        subtitle: 'Anteil am Gewichtsverlust nach 68 Wochen, STEP-1-Substudie mit DXA-Messung',
        source: 'Wilding et al., STEP 1 body composition, J Endocr Soc 2021; Sardeli et al. 2018; Leidy et al. 2015; WHO 2020',
        alt: 'Balken, der den Gewichtsverlust unter Semaglutid aufteilt: rund 60 Prozent Fettmasse und rund 40 Prozent fettfreie Masse, also Muskeln, Organe, Knochen und Wasser; wie viel davon Muskel war, wurde nicht getrennt gemessen. Krafttraining an mindestens zwei Tagen pro Woche und 1,2 bis 1,6 Gramm Protein pro Kilogramm am Tag halten den Anteil in Studien klein.',
      },
      b,
    );
  }

  /* 4. S-LiTE (jensen2024): Mehr-Zunahme nach Liraglutid allein als Differenz mit 95-%-Konfidenzintervall */
  {
    let b = '';
    const steps = [
      ['8 Wochen', 'kalorienarme Diät', C.ink3],
      ['52 Wochen Behandlung', 'Placebo, Training, Liraglutid oder beides', C.ink],
      ['52 Wochen', 'ohne jede Behandlung', C.regain],
    ];
    steps.forEach(([a, sub, c], i) => {
      const x = M + i * 362;
      b += T(x, 150, a, { st: 'head', size: 16 });
      b += T(x, 172, sub, { size: 14, fill: C.ink2 });
      b += L(x, 188, x + 342, 188, { c, w: 3, cap: 'butt' });
    });
    b += T(M, 232, 'Mehr-Zunahme nach Liraglutid allein im Jahr ohne Behandlung, verglichen mit …', { st: 'head', size: 18 });
    const px = (kg) => 440 + ((kg + 2) / 14) * 640;
    b += gridX([-2, 0, 2, 4, 6, 8, 10, 12], px, 254, 446, (kg) => `${kg > 0 ? '+' : ''}${de(kg, 0)} kg`, 470, { zero: 0 });
    const rows = [
      { label: '… Training allein', diff: 6.0, lo: 2.1, hi: 10.0, ci: '95-%-KI 2,1 bis 10,0 kg', sig: true },
      { label: '… Training plus Liraglutid', diff: 2.5, lo: -1.5, hi: 6.5, ci: '95-%-KI −1,5 bis 6,5 kg, nicht signifikant', sig: false },
    ];
    rows.forEach((row, i) => {
      const y = 300 + i * 96;
      b += T(M, y + 2, row.label, { st: 'head', size: 19 });
      b += T(M, y + 26, row.ci, { size: 14, fill: C.ink3 });
      b += L(px(row.lo), y, px(row.hi), y, { c: C.regain, w: 2.6 });
      b += L(px(row.lo), y - 9, px(row.lo), y + 9, { c: C.regain, w: 2.6 });
      b += L(px(row.hi), y - 9, px(row.hi), y + 9, { c: C.regain, w: 2.6 });
      b += row.sig ? DOT(px(row.diff), y, 9, C.regain) : DOT(px(row.diff), y, 8, C.bg, { stroke: C.regain, sw: 2.6 });
      b += T(px(row.hi) + 16, y + 9, `+${de(row.diff)} kg`, { st: 'num', size: 24, fill: C.regain });
    });
    b += P(M, 524, 'Nach Training plus Liraglutid blieben Gewichtsverlust und Fettabbau ein Jahr nach Therapieende erhalten; nach Liraglutid allein kam das Gewicht zurück. Erwachsene mit Adipositas, betreutes Trainingsprogramm; Linie = 95-%-Konfidenzintervall, Punkt = Mittelwert.', { size: 15, fill: C.ink3, lh: 21 }).svg;
    add(
      'training-s-lite.svg',
      {
        title: 'Training vor dem Absetzen: 6 kg Unterschied ein Jahr später',
        subtitle: 'S-LiTE-Nachbeobachtung: Gewichtszunahme im Jahr nach Therapieende, Liraglutid allein gegenüber den Trainingsgruppen',
        source: 'Jensen et al., S-LiTE follow-up, eClinicalMedicine 2024;69:102475',
        alt: 'Diagramm aus der S-LiTE-Nachbeobachtung: Im Jahr nach Therapieende nahmen Teilnehmende nach Liraglutid allein 6,0 Kilogramm mehr zu als nach dem Trainingsprogramm (95-Prozent-Konfidenzintervall 2,1 bis 10,0) und 2,5 Kilogramm mehr als nach Training plus Liraglutid (−1,5 bis 6,5, nicht signifikant). Nach Training plus Liraglutid blieben Gewichtsverlust und Fettabbau erhalten.',
      },
      b,
    );
  }

  /* 5. Wirksamkeit (wilding2021step1, wharton2025oasis4, knop2023oasis1, jastreboff2022, pisunyer2015) */
  {
    const rows = [
      { name: 'STEP 1', sub: 'Semaglutid 2,4 mg Spritze, 68 Wochen', drug: -14.9, plac: -2.4 },
      { name: 'OASIS 4', sub: 'Semaglutid 25 mg Tablette, 64 Wochen', drug: -13.6, plac: -2.2 },
      { name: 'OASIS 1', sub: 'Semaglutid 50 mg Tablette, 68 Wochen', drug: -15.1, plac: -2.4 },
      { name: 'SURMOUNT-1', sub: 'Tirzepatid 15 mg Spritze, 72 Wochen', drug: -20.9, plac: -3.1 },
      { name: 'SCALE', sub: 'Liraglutid 3 mg Spritze, 56 Wochen', drug: -8.0, plac: -2.6 },
    ];
    const x0 = 420;
    const px = (p) => x0 + (-p / 22) * 640;
    let b = '';
    b += gridX([0, -5, -10, -15, -20], px, 152, 560, (p) => `${de(p, 0)} %`, 142, { zero: 0 });
    rows.forEach((row, i) => {
      const y = 168 + i * 80;
      b += T(M, y + 18, row.name, { st: 'head', size: 20 });
      b += T(M, y + 40, row.sub, { size: 14, fill: C.ink3 });
      b += R(x0, y, px(row.drug) - x0, 22, { fill: C.ink });
      b += T(px(row.drug) + 10, y + 18, `${de(row.drug)} %`, { st: 'num', size: 18 });
      b += placeboBar(x0, y + 30, px(row.plac) - x0, 14);
      b += T(px(row.plac) + 10, y + 42, `Placebo ${de(row.plac)} %`, { size: 14, fill: C.ink3 });
    });
    b += T(M, 590, 'Verschiedene Studien mit verschiedenen Teilnehmenden und Laufzeiten; kein direkter Vergleich zwischen den Präparaten.', { size: 15, fill: C.ink3 });
    add(
      'wirksamkeit-zulassungsstudien.svg',
      {
        title: 'Wie viel Gewicht in den Zulassungsstudien verloren ging',
        subtitle: 'Mittlere Änderung des Körpergewichts, Wirkstoff gegenüber Placebo',
        source: 'STEP 1 (NEJM 2021), OASIS 4 (NEJM 2025), OASIS 1 (Lancet 2023), SURMOUNT-1 (NEJM 2022), SCALE (NEJM 2015)',
        alt: 'Balkendiagramm der Zulassungsstudien: STEP 1 minus 14,9 Prozent gegenüber minus 2,4 Prozent unter Placebo; OASIS 4 minus 13,6 gegenüber minus 2,2; OASIS 1 minus 15,1 gegenüber minus 2,4; SURMOUNT-1 minus 20,9 gegenüber minus 3,1; SCALE minus 8,0 gegenüber minus 2,6 Prozent. Kein direkter Vergleich zwischen den Studien.',
      },
      b,
    );
  }

  /* 6. Weiter oder Placebo (rubino2021, aronne2024) */
  {
    const groups = [
      { name: 'STEP 4', sub: 'Semaglutid 2,4 mg, 48 Wochen nach dem Wechsel', cont: -7.9, plac: 6.9 },
      { name: 'SURMOUNT-4', sub: 'Tirzepatid, 52 Wochen nach dem Wechsel', cont: -5.5, plac: 14 },
    ];
    const py = (p) => 380 - p * 13;
    let b = '';
    b += T(M, 146, 'Änderung des Körpergewichts ab dem Zeitpunkt des Wechsels; alle Teilnehmenden hatten davor mit dem Medikament abgenommen.', { size: 15, fill: C.ink3 });
    b += gridY([-10, -5, 0, 5, 10], py, 210, W - M, (p) => `${p > 0 ? '+' : p < 0 ? '−' : ''}${Math.abs(p)} %`, { zero: 0 });
    groups.forEach((g, i) => {
      const gx = 300 + i * 450;
      const bar = (x, p, color, label) => {
        let s = R(x, py(0), 150, py(p) - py(0), { fill: color, rx: 1 });
        const v = `${p > 0 ? '+' : '−'}${String(Math.abs(p)).replace('.', ',')} %`;
        s += T(x + 75, p > 0 ? py(p) - 14 : py(p) + 32, v, { st: 'num', size: 24, fill: color, anchor: 'middle' });
        s += T(x + 75, p > 0 ? py(0) + 24 : py(0) - 12, label, { st: 'head', size: 15, fill: C.ink2, anchor: 'middle' });
        return s;
      };
      b += bar(gx, g.cont, C.ink, 'Weiter behandelt');
      b += bar(gx + 190, g.plac, C.regain, 'Wechsel auf Placebo');
      b += T(gx + 170, 568, g.name, { st: 'head', size: 22, anchor: 'middle' });
      b += T(gx + 170, 592, g.sub, { size: 14, fill: C.ink3, anchor: 'middle' });
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
    b += gridX([0, 7, 14, 21, 28, 35, 42, 49], px, 156, 492, (d) => (d === 0 ? 'letzte Dosis' : `Tag ${d}`), 146);
    rows.forEach((row, i) => {
      const y = 178 + i * 108;
      b += T(M, y + 18, row.name, { st: 'head', size: 22 });
      row.sub.forEach((line, j) => (b += T(M, y + 42 + j * 19, line, { size: 14, fill: C.ink3 })));
      b += R(x0, y, Math.max(px(row.hl) - x0, 6), 20, { fill: C.ink });
      b += T(Math.max(px(row.hl), x0 + 6) + 10, y + 15, `Halbwertszeit ${row.hlLabel}`, { st: 'strong', size: 15 });
      const breit = Math.max(px(row.hl * 5) - x0, 6);
      b += R(x0, y + 28, breit, 20, { fill: C.bg2, stroke: C.ink3, sw: 1.2 });
      const lab = `weitgehend abgebaut nach ${row.gone}`;
      if (breit > tw(lab, 'strong', 15) + 24) b += T(x0 + breit - 10, y + 43, lab, { st: 'strong', size: 15, fill: C.ink2, anchor: 'end', inside: true });
      else b += T(x0 + breit + 10, y + 43, lab, { st: 'strong', size: 15, fill: C.ink2 });
      if (row.nachweisbar) {
        const ext = px(row.nachweisbar) - x0 - breit;
        b += R(x0 + breit, y + 28, ext, 20, { stroke: C.ink3, sw: 1.4, dash: '0.1 4.2' });
        b += T(x0 + breit + ext / 2, y + 68, 'nachweisbar bis etwa 7 Wochen', { size: 14, fill: C.ink3, anchor: 'middle' });
      }
    });
    b += P(M, 528, 'Faustregel: Nach etwa fünf Halbwertszeiten ist ein Wirkstoff weitgehend abgebaut. Die Wirkung auf den Appetit lässt schon vorher spürbar nach. Laut Fachinformation ist Semaglutid nach der letzten Dosis noch etwa sieben Wochen im Blut nachweisbar; daher die Angabe „fünf bis sieben Wochen“.', { size: 15, fill: C.ink3, lh: 21 }).svg;
    add(
      'halbwertszeiten-praeparate.svg',
      {
        title: 'Wie lange die Abnehmspritze nach der letzten Dosis nachwirkt',
        subtitle: 'Halbwertszeit laut Fachinformation und daraus abgeleitete Zeit bis zum weitgehenden Abbau',
        source: 'Fachinformationen Wegovy, Ozempic, Rybelsus, Mounjaro, Saxenda (EMA-Produktinformationen)',
        alt: 'Balkendiagramm der Halbwertszeiten: Semaglutid etwa eine Woche, weitgehend abgebaut nach etwa fünf Wochen und laut Fachinformation bis etwa sieben Wochen nachweisbar; Tirzepatid etwa fünf Tage, abgebaut nach etwa 25 Tagen; Liraglutid etwa 13 Stunden, abgebaut nach etwa drei Tagen. Faustregel: fünf Halbwertszeiten.',
      },
      b,
    );
  }

  /* 8. Warum der Körper gegenarbeitet (fachinfos, sumithran2011, fothergill2016, wilding2021dxa) */
  {
    const cols = [
      { big: '5–7 Wochen', h: 'Die Appetitbremse fällt weg', d: 'Semaglutid ist nach etwa fünf bis sieben Wochen abgebaut, Tirzepatid nach etwa 25 Tagen.', src: 'Fachinformationen (EMA)', c: C.ink },
      { big: 'Ghrelin ↑ Leptin ↓', h: 'Hungerhormone bleiben verschoben', d: 'Noch ein Jahr nach einer Diät messbar: mehr Hunger, weniger Sättigung.', src: 'Sumithran et al., NEJM 2011', c: C.regain },
      { big: '6 Jahre', h: 'Weniger Energie in Ruhe', d: 'Der Ruheenergieverbrauch blieb nach starkem Gewichtsverlust abgesenkt.', src: 'Fothergill et al., Obesity 2016', c: C.regain },
      { big: 'rund 40 %', h: 'Ein Teil des Verlusts war Muskel', d: 'des Gewichtsverlusts unter Semaglutid entfielen auf fettfreie Masse.', src: 'STEP-1-DXA-Substudie 2021', c: C.lean },
    ];
    const cw = 244;
    const size = Math.min(...cols.map((c) => fit(c.big, cw, 'num', 30)));
    let b = '';
    const hLines = Math.max(...cols.map((c) => wrap(c.h, cw, 'head', 20).length));
    const top = 222;
    const dy = top + 58 + (hLines - 1) * 26 + 36;
    const dLines = Math.max(...cols.map((c) => wrap(c.d, cw, 'body', 16).length));
    const sy = dy + (dLines - 1) * 23 + 44;
    cols.forEach((c, i) => {
      const x = M + i * 276;
      if (i) b += L(x - 16, top - 32, x - 16, sy + 8);
      b += T(x, top, c.big, { st: 'num', size, fill: c.c });
      b += L(x, top + 20, x + cw, top + 20, { c: c.c, w: 2, cap: 'butt' });
      b += P(x, top + 58, c.h, { st: 'head', size: 20, maxW: cw, lh: 26 }).svg;
      b += P(x, dy, c.d, { size: 16, fill: C.ink2, maxW: cw, lh: 23 }).svg;
      b += T(x, sy, c.src, { size: 14, fill: C.ink3 });
    });
    b += P(M, sy + 70, 'Vier Mechanismen hinter dem Jojo-Effekt. Dagegen belegt: Krafttraining (Jensen 2024, Sardeli 2018) und Protein (Leidy 2015).', { size: 15, fill: C.ink3, lh: 21 }).svg;
    add(
      'warum-das-gewicht-zurueckkommt.svg',
      {
        title: 'Warum das Gewicht nach dem Absetzen zurückkommt',
        subtitle: 'Vier belegte Mechanismen hinter dem Jojo-Effekt nach der Abnehmspritze',
        source: 'Fachinformationen (EMA); Sumithran et al. 2011; Fothergill et al. 2016; Wilding et al. 2021; Jensen 2024; Sardeli 2018; Leidy 2015',
        alt: 'Vier Spalten mit den Mechanismen des Jojo-Effekts nach der Abnehmspritze: Die Appetitbremse fällt weg, sobald der Wirkstoff abgebaut ist (Semaglutid nach etwa fünf bis sieben Wochen, Tirzepatid nach etwa 25 Tagen); die Hungerhormone Ghrelin und Leptin bleiben noch ein Jahr nach einer Diät verschoben; der Ruheenergieverbrauch blieb in einer Studie sechs Jahre nach starkem Gewichtsverlust abgesenkt; rund 40 Prozent des Gewichtsverlusts unter Semaglutid entfielen auf fettfreie Masse. Dagegen belegt: Krafttraining und Protein.',
      },
      b,
    );
  }

  /* 9. Proteinbedarf (leidy2015) */
  {
    const kgs = [60, 70, 80, 90, 100];
    const x0 = 330;
    const px = (g) => x0 + (g / 200) * 740;
    let b = '';
    b += gridX([0, 50, 100, 150, 200], px, 156, 470, (g) => `${g} g`, 146);
    kgs.forEach((kg, i) => {
      const y = 172 + i * 60;
      const lo = kg * 1.2, hi = kg * 1.6;
      b += T(M, y + 22, `${kg} kg`, { st: 'num', size: 22 });
      b += T(M + tw(`${kg} kg`, 'num', 22) + 10, y + 22, 'Körpergewicht', { size: 14, fill: C.ink3 });
      b += L(px(0), y + 16, px(lo), y + 16, { c: C.ink3, w: 1.2 });
      b += R(px(lo), y + 5, px(hi) - px(lo), 22, { fill: C.lean });
      b += T(px(hi) + 12, y + 22, `${Math.round(lo)} bis ${Math.round(hi)} g am Tag`, { st: 'strong', size: 16, fill: C.lean });
    });
    b += T(M, 520, 'Empfehlung für Gewichtsabnahme und -erhalt: 1,2 bis 1,6 g Protein pro kg Körpergewicht und Tag.', { size: 17 });
    b += P(M, 550, 'Verteilt auf drei bis vier Mahlzeiten mit mindestens etwa 25 bis 30 g pro Mahlzeit; bei Nierenerkrankungen vorher ärztlich klären.', { size: 15, fill: C.ink3, lh: 21 }).svg;
    add(
      'proteinbedarf-nach-abnehmspritze.svg',
      {
        title: 'Wie viel Protein nach der Abnehmspritze',
        subtitle: 'Tagesmenge nach Körpergewicht, Zielkorridor aus Übersichtsarbeiten',
        source: 'Leidy et al., Am J Clin Nutr 2015;101(6):1320S–1329S',
        alt: 'Balkendiagramm des Proteinbedarfs von 1,2 bis 1,6 Gramm pro Kilogramm Körpergewicht: bei 60 Kilogramm 72 bis 96 Gramm am Tag, bei 70 Kilogramm 84 bis 112, bei 80 Kilogramm 96 bis 128, bei 90 Kilogramm 108 bis 144, bei 100 Kilogramm 120 bis 160 Gramm. Verteilt auf drei bis vier Mahlzeiten mit mindestens etwa 25 bis 30 Gramm pro Mahlzeit.',
      },
      b,
    );
  }

  /* 10. Preise im Monat (src/data/markt/preise.json) */
  {
    const rows = preise.zeilen.map((z) => ({
      name: z.praeparat,
      eur: Number(String(z.monat).replace(/[^0-9]/g, '')),
      flag: /Anbieterangabe/.test(z.hinweis) ? '*' : '',
      kasse: /Kassenleistung/.test(z.hinweis),
    }));
    const x0 = 490;
    const px = (e) => x0 + (e / 500) * 590;
    const rh = Math.min(34, Math.floor(380 / rows.length));
    const y0 = 152;
    let b = '';
    b += gridX([0, 100, 200, 300, 400, 500], px, y0 - 6, y0 + rows.length * rh, (e) => `${e} €`, 140);
    rows.forEach((row, i) => {
      const y = y0 + i * rh;
      const ns = fit(row.name, x0 - M - 20, 'strong', 14.5, 13);
      b += T(M, y + rh / 2 + 4, row.name, { st: 'strong', size: ns, w: 520 });
      b += R(x0, y + rh / 2 - 10, px(row.eur) - x0, 20, row.kasse ? { fill: C.bg2, stroke: C.ink, sw: 1.4 } : { fill: C.ink });
      b += T(px(row.eur) + 8, y + rh / 2 + 5, `ca. ${row.eur} €${row.flag}`, { st: 'strong', size: 14.5 });
    });
    b += P(M, y0 + rows.length * rh + 28, '* Anbieterangabe, Prüfung gegen den Preisvergleich folgt. Heller Balken: bei Typ-2-Diabetes Kassenleistung. Preise gerundet auf 5 €, niedrigster Versandpreis.', { size: 14, fill: C.ink3, lh: 19 }).svg;
    add(
      'preise-im-monat.svg',
      {
        title: 'Was Abnehmspritzen und die Tablette im Monat kosten',
        subtitle: `Apothekenverkaufspreise für Selbstzahler als Größenordnung, Stand ${fmtDate(preise.stand)}`,
        source: 'Preisvergleich medipreis.de (niedrigster Versandpreis); Tabletten laut Presseberichten zum Marktstart 01.09.2026',
        alt: `Balkendiagramm der monatlichen Selbstzahlerpreise, Stand ${fmtDate(preise.stand)}: ${rows.map((row) => `${row.name} ca. ${row.eur} Euro`).join('; ')}. Größenordnungen, gerundet auf 5 Euro; Ozempic bei Typ-2-Diabetes Kassenleistung.`,
      },
      b,
    );
  }

  /* 11. Haarausfall nach schnellem Gewichtsverlust (malkud2015, leidy2015, almandoz2024) */
  {
    // Ausfall beginnt zwei bis drei Monate nach dem Auslöser und klingt meist innerhalb von etwa sechs Monaten nach Beginn ab (malkud2015)
    const px = (m) => 330 + (m / 12) * 770;
    let b = '';
    b += gridX([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], px, 158, 432, (m) => (m === 0 ? 'Auslöser' : m === 1 ? 'Monat 1' : String(m)), 146);
    const rows = [
      { y: 194, label: 'Schnelle Abnahme', note: 'Der Auslöser: Viele Haare wechseln gleichzeitig in die Ruhephase; sichtbar ist noch nichts' },
      { y: 288, label: 'Haare fallen aus', note: 'Beginnt zwei bis drei Monate nach dem Auslöser; klingt meist innerhalb von etwa sechs Monaten nach Beginn ab' },
      { y: 382, label: 'Haare wachsen nach', note: 'Nachwachsende Haare werden sichtbar, sobald der Auslöser weggefallen ist; bis zur alten Länge dauert es länger' },
    ];
    const h = 14;
    for (const row of rows) {
      b += T(M, row.y + 6, row.label, { st: 'head', size: 19 });
      b += P(px(0), row.y + 32, row.note, { size: 14, fill: C.ink2, maxW: W - M - px(0), lh: 19 }).svg;
    }
    b += R(px(0), rows[0].y - h / 2, px(2) - px(0), h, { fill: C.ink });
    b += R(px(2), rows[1].y - h / 2, px(6) - px(2), h, { fill: C.ink2 });
    b += R(px(6), rows[1].y - h / 2, px(9) - px(6), h, { stroke: C.ink2, sw: 1.4, dash: '0.1 4' });
    b += R(px(6), rows[2].y - h / 2, px(12) - px(6), h, { fill: C.lean });
    b += L(M, 466, W - M, 466);
    b += T(M, 498, 'Was sich beeinflussen lässt', { st: 'head', size: 17 });
    b += P(M, 526, 'Protein 1,2 bis 1,6 g pro kg Körpergewicht am Tag · Eisenwert (Ferritin) prüfen lassen · Zink und Biotin nur bei nachgewiesener Lücke', { size: 15, fill: C.ink2, lh: 21 }).svg;
    b += P(M, 554, 'Ärztlich abklären: länger als sechs Monate, fleckig, oder mit Müdigkeit und Frieren (Eisen, Schilddrüse)', { size: 15, fill: C.ink2, lh: 21 }).svg;
    add(
      'haarausfall-zeitverlauf.svg',
      {
        title: 'Haarausfall nach schnellem Gewichtsverlust: der Verlauf',
        subtitle: 'Telogenes Effluvium: verzögert, diffus, vorübergehend; Zeitangaben in Monaten nach dem Auslöser',
        source: 'Malkud, J Clin Diagn Res 2015; Leidy et al., Am J Clin Nutr 2015; Almandoz et al., Obesity 2024',
        alt: 'Zeitachse des telogenen Effluviums über zwölf Monate: Nach schnellem Gewichtsverlust wechseln viele Haare in die Ruhephase, zwei bis drei Monate später beginnt diffuser Haarausfall, der meist innerhalb von etwa sechs Monaten nach Beginn abklingt, wenn der Auslöser weggefallen ist; danach wachsen die Haare nach. Beeinflussbar sind Protein, Eisenwert, Zink und Biotin bei Lücke; länger als sechs Monate, fleckig oder mit Müdigkeit und Frieren ärztlich abklären.',
      },
      b,
    );
  }

  /* 12. Abnehmpille: belegt und offen (wharton2025oasis4, fachinfoRybelsus, wilding2022ext, wu2025) */
  {
    let b = '';
    // links: belegt
    b += T(M, 160, 'Belegt: Gewichtsverlust unter der Tablette', { st: 'head', size: 19 });
    b += T(M, 184, 'OASIS 4, Semaglutid 25 mg, 64 Wochen, 307 Teilnehmende ohne Diabetes', { size: 14, fill: C.ink3 });
    const base = 246, sc = 15;
    b += L(M, base, 560, base, { c: C.ink3, w: 1.2 });
    b += T(185, base - 14, 'Semaglutid-Tablette', { st: 'head', size: 15, fill: C.ink2, anchor: 'middle' });
    b += R(110, base, 150, 13.6 * sc, { fill: C.ink, rx: 1 });
    b += T(185, base + 13.6 * sc + 36, '−13,6 %', { st: 'num', size: 28, anchor: 'middle' });
    b += T(415, base - 14, 'Placebo', { st: 'head', size: 15, fill: C.ink2, anchor: 'middle' });
    b += placeboBar(340, base, 150, 2.2 * sc);
    b += T(415, base + 2.2 * sc + 32, '−2,2 %', { st: 'num', size: 24, fill: C.ink3, anchor: 'middle' });
    b += T(M, 586, 'Bei durchgehender Einnahme: −16,6 %. Mittelwerte gegenüber dem Start.', { size: 14, fill: C.ink3 });
    // Trennlinie
    b += L(600, 146, 600, 590);
    // rechts: offen
    const x = 640, mw = W - M - x;
    b += T(x, 160, 'Offen: Verlauf nach dem Absetzen der Tablette', { st: 'head', size: fit('Offen: Verlauf nach dem Absetzen der Tablette', mw, 'head', 19) });
    b += T(x, 184, 'Stand Oktober 2026', { size: 14, fill: C.ink3 });
    b += T(x, 262, 'Noch keine Studie', { st: 'big', size: fit('Noch keine Studie', mw, 'big', 44) });
    b += T(x, 294, 'zur Wiederzunahme nach dem Absetzen der Tablette', { size: 17, fill: C.ink2 });
    b += L(x, 326, W - M, 326);
    b += T(x, 360, 'Was sich übertragen lässt, mit Vorbehalt:', { st: 'strong', size: 15 });
    const items = [
      'gleicher Wirkstoff, Halbwertszeit etwa eine Woche wie bei der Spritze',
      'Spritze: zwei Drittel des Verlusts ein Jahr nach dem Absetzen zurück (STEP-1-Verlängerung, von −17,3 % auf −5,6 %)',
      'Zunahme in Studien zu Adipositas-Medikamenten ab Woche 8 messbar',
    ];
    let y = 390;
    for (const it of items) {
      b += T(x, y, '–', { size: 15, fill: C.ink3 });
      const p = P(x + 18, y, it, { size: 15, fill: C.ink2, maxW: mw - 18, lh: 21 });
      b += p.svg;
      y = p.bottom + 30;
    }
    b += T(x, 586, 'Jede Aussage zur Tablette nach dem Absetzen ist ein Übertrag, keine Messung.', { size: 14, fill: C.ink3 });
    add(
      'abnehmpille-belegt-und-offen.svg',
      {
        title: 'Abnehmpille absetzen: was belegt ist und was fehlt',
        subtitle: 'Die Zulassungsstudie der Semaglutid-Tablette gegenüber der Datenlage für die Zeit danach',
        source: 'OASIS 4 (NEJM 2025); Fachinformation Rybelsus (EMA); STEP-1-Verlängerung (2022); Wu et al. (2025)',
        alt: 'Zwei Felder: Links die Zulassungsstudie OASIS 4 der Semaglutid-Tablette mit minus 13,6 Prozent Gewicht gegenüber minus 2,2 Prozent unter Placebo nach 64 Wochen, bei durchgehender Einnahme minus 16,6 Prozent. Rechts der offene Punkt: Es gibt noch keine Studie zur Wiederzunahme nach dem Absetzen der Tablette (Stand Oktober 2026); übertragbar mit Vorbehalt sind die Halbwertszeit von etwa einer Woche und die Spritzen-Daten, nach denen zwei Drittel des Verlusts nach einem Jahr zurück sind.',
      },
      b,
    );
  }

  return figures;
}
