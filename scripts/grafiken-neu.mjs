/**
 * Neue Studien-Grafiken je Artikel (Redesign „Kalk“, Oktober 2026). Jede Zahl aus src/data/sources.ts (Quellen-IDs in
 * den Kommentaren); Ziel-Artikel und Einbau stehen in docs/GRAFIKEN-EINBAU.md, Datentabellen in
 * src/data/grafiken-daten.json, Register in src/data/grafiken.ts. Keine Dosierungen, keine Markennamen für die Startseite.
 */
import { C, W, M, F, T, P, L, R, PATH, DOT, HL, ARROW_R, gridY, gridX, placeboBar, dottedBar, tw, fit, wrap, de, tsd, frame } from './grafiken-lib.mjs';

const NB = ' ';

export function neu({ warn }) {
  const figures = [];
  const add = (file, meta, body) => figures.push({ file, svg: frame({ file, ...meta, body, warn }) });

  /* N1. Kreatinspeicher im Muskel (hultman1996; Wasser im Muskel: kreider2017) */
  {
    const px = (d) => 340 + (d / 56) * 740;
    const rows = [
      { top: 166, label: '3 g pro Tag', sub: 'ohne Ladephase' },
      { top: 322, label: 'Ladephase', sub: '20 g pro Tag über 6 Tage, danach keine Einnahme' },
    ];
    const py = (row, v) => row.top + 100 - (v / 20) * 88;
    let b = '';
    b += gridX([0, 7, 14, 21, 28, 35, 42, 49, 56], px, rows[0].top, rows[1].top + 104, () => '', 0);
    b += [0, 7, 14, 21, 28, 35, 42, 49, 56].map((d) => T(px(d), rows[1].top + 130, `Woche ${d / 7}`, { st: 'axis', size: F.axis, fill: C.ink3, anchor: d === 56 ? 'end' : 'middle' })).join('');
    for (const row of rows) {
      b += L(px(0), py(row, 0), px(56), py(row, 0), { c: C.ink3, w: 1.2, g: true });
      b += L(px(0), py(row, 20), px(56), py(row, 20), { g: true });
      b += T(px(0) - 12, py(row, 0) + 5, '0 %', { st: 'axis', size: F.axis, fill: C.ink3, anchor: 'end' });
      b += T(px(0) - 12, py(row, 20) + 5, '+20 %', { st: 'axis', size: F.axis, fill: C.ink3, anchor: 'end' });
      b += T(M, row.top + 44, row.label, { st: 'head', size: F.label });
      b += P(M, row.top + 68, row.sub, { size: F.small, fill: C.ink2, maxW: 210, lh: 19 }).svg;
    }
    const a = rows[0], c = rows[1];
    // Verlauf zwischen den Messpunkten schematisch
    b += PATH(`M${px(0)} ${py(a, 0)} C${px(9)} ${py(a, 10)} ${px(18)} ${py(a, 19.5)} ${px(28)} ${py(a, 20)}`, { c: C.lean, w: 3 });
    b += DOT(px(0), py(a, 0), 6, C.lean) + DOT(px(28), py(a, 20), 6, C.lean);
    b += T(px(28) + 16, py(a, 20) - 10, 'etwa +20 % nach 28 Tagen', { st: 'strong', size: F.text, fill: C.lean });
    b += T(px(28) + 16, py(a, 20) + 22, 'Speicher voll nach etwa vier Wochen', { size: F.small, fill: C.ink2 });
    b += PATH(`M${px(0)} ${py(c, 0)} C${px(2)} ${py(c, 14)} ${px(4)} ${py(c, 20)} ${px(6)} ${py(c, 20)} C${px(15)} ${py(c, 20)} ${px(26)} ${py(c, 4)} ${px(36)} ${py(c, 0)}`, { c: C.lean, w: 3 });
    b += DOT(px(0), py(c, 0), 6, C.lean) + DOT(px(6), py(c, 20), 6, C.lean) + DOT(px(36), py(c, 0), 6, C.lean);
    b += T(px(6) + 16, py(c, 20) - 12, 'etwa +20 % nach 6 Tagen', { st: 'strong', size: F.text, fill: C.lean });
    b += T(px(36) + 14, py(c, 0) - 34, '30 Tage nach dem Ende:', { size: F.small, fill: C.ink2 });
    b += T(px(36) + 14, py(c, 0) - 15, 'wieder beim Ausgangswert', { size: F.small, fill: C.ink2 });
    const p = P(M, 504, 'Mit dem Speicher steigt das Wasser in der Muskelzelle. Die Waage zeigt das in den ersten Wochen; Fett ist es nicht.', { size: F.text, lh: 22 });
    b += p.svg;
    b += P(M, p.bottom + 28, 'Messpunkte der Studie: Ausgangswert, Tag 6, Tag 28 und 30 Tage nach dem Ende der Ladephase; Verlauf dazwischen schematisch.', { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'kreatin-speicher-im-muskel.svg',
      {
        title: 'Kreatin: voll nach vier Wochen, auch ohne Ladephase',
        subtitle: 'Gesamtkreatin im Muskel gegenüber dem Ausgangswert, zwei Einnahmewege aus einer Studie mit 31 Männern',
        source: 'Hultman et al., J Appl Physiol 1996;81(1):232–237; Kreider et al., J Int Soc Sports Nutr 2017;14:18',
        alt: 'Zwei Verläufe des Kreatinspeichers im Muskel aus einer Studie mit 31 Männern, zwischen den Messpunkten schematisch: Mit 3 Gramm Kreatin pro Tag stieg das Gesamtkreatin im Muskel allmählich und lag nach 28 Tagen etwa 20 Prozent über dem Ausgangswert. Mit einer Ladephase von 20 Gramm pro Tag über 6 Tage war derselbe Anstieg von etwa 20 Prozent nach 6 Tagen erreicht; ohne weitere Einnahme lag der Wert 30 Tage nach dem Ende wieder beim Ausgangswert. Mit dem Speicher steigt das Wasser in der Muskelzelle; das zeigt die Waage, Fett ist es nicht.',
      },
      b,
    );
  }

  /* N2. Wirkstoffabbau aus der Halbwertszeit (fachinfoSaxenda, fachinfoMounjaro, fachinfoWegovy, fachinfoOzempic) */
  {
    const px = (d) => 380 + (d / 49) * 700;
    const rows = [
      { name: 'Liraglutid', sub: ['Saxenda', 'Halbwertszeit etwa 13 Stunden'], hl: 13 / 24, gone: 'nach etwa 3 Tagen weitgehend abgebaut', side: 'right' },
      { name: 'Tirzepatid', sub: ['Mounjaro', 'Halbwertszeit etwa 5 Tage'], hl: 5, gone: 'nach etwa 25 Tagen weitgehend abgebaut', side: 'right' },
      { name: 'Semaglutid', sub: ['Wegovy, Ozempic', 'Halbwertszeit etwa 1 Woche', 'bis etwa 7 Wochen nachweisbar', '(Fachinformation Wegovy)'], hl: 7, gone: 'nach etwa 5 Wochen weitgehend abgebaut', side: 'left' },
    ];
    let b = '';
    const top0 = 150, rh = 126, ph = 76;
    b += gridX([0, 7, 14, 21, 28, 35, 42, 49], px, top0 - 4, top0 + 2 * rh + ph + 6, () => '', 0);
    b += [0, 7, 14, 21, 28, 35, 42, 49].map((d) => T(px(d), top0 + 2 * rh + ph + 32, d === 0 ? 'letzte Dosis' : `Woche ${d / 7}`, { st: 'axis', size: F.axis, fill: C.ink3, anchor: d === 49 ? 'end' : 'middle' })).join('');
    rows.forEach((row, i) => {
      const top = top0 + i * rh, base = top + ph;
      const py = (f) => base - f * ph;
      b += L(px(0), base, px(49), base, { c: C.ink3, w: 1.2, g: true });
      b += L(px(0), top, px(49), top, { g: true });
      b += T(px(0) - 12, top + 5, '100 %', { st: 'axis', size: F.axis, fill: C.ink3, anchor: 'end' });
      b += T(px(0) - 12, base + 5, '0 %', { st: 'axis', size: F.axis, fill: C.ink3, anchor: 'end' });
      b += T(M, top + 16, row.name, { st: 'head', size: F.label });
      row.sub.forEach((s, j) => (b += T(M, top + 37 + j * 18, s, { size: F.small, fill: j ? C.ink3 : C.ink2 })));
      const pts = [];
      for (let d = 0; d <= 49; d += d < 6 ? 0.05 : 0.25) pts.push(`${pts.length ? 'L' : 'M'}${px(d).toFixed(1)} ${py(Math.pow(0.5, d / row.hl)).toFixed(1)}`);
      b += PATH(pts.join(' '), { c: C.ink, w: 2.6 });
      const d5 = 5 * row.hl;
      b += L(px(d5), top + 8, px(d5), base, { c: C.ink3, w: 1.2, dash: '2 4', g: true });
      b += DOT(px(d5), py(Math.pow(0.5, 5)), 5, C.ink);
      if (row.side === 'right') b += T(px(d5) + 12, top + 30, row.gone, { st: 'strong', size: F.small });
      else b += T(px(d5) - 12, top + 30, row.gone, { st: 'strong', size: F.small, anchor: 'end' });
    });
    b += P(M, 540, 'Vereinfachte Rechnung aus der Halbwertszeit: Nach jeder Halbwertszeit ist noch die Hälfte im Körper, nach etwa fünf Halbwertszeiten ist ein Wirkstoff weitgehend abgebaut. Die Wirkung auf den Appetit lässt schon vorher nach.', { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'wirkstoff-abbau-nach-letzter-dosis.svg',
      {
        title: 'Wirkstoffabbau nach der letzten Dosis: Tage oder Wochen',
        subtitle: 'Rechnerischer Anteil des Wirkstoffs im Körper, abgeleitet aus der Halbwertszeit laut Fachinformation',
        source: 'Fachinformationen Saxenda, Mounjaro, Wegovy, Ozempic (EMA-Produktinformationen); eigene Rechnung',
        alt: 'Drei Abbaukurven nach der letzten Dosis, gerechnet aus der Halbwertszeit laut Fachinformation: Liraglutid (Saxenda) hat eine Halbwertszeit von etwa 13 Stunden und ist nach etwa 3 Tagen weitgehend abgebaut; Tirzepatid (Mounjaro) etwa 5 Tage, weitgehend abgebaut nach etwa 25 Tagen; Semaglutid (Wegovy, Ozempic) etwa 1 Woche, weitgehend abgebaut nach etwa 5 Wochen und laut Fachinformation Wegovy bis etwa 7 Wochen nachweisbar. Faustregel: nach fünf Halbwertszeiten weitgehend abgebaut.',
      },
      b,
    );
  }

  /* N3. S-LiTE: Liraglutid mit und ohne Training (lundgren2021, jensen2024) */
  {
    let b = '';
    const cols = [
      { x: M, when: 'Woche 52 bis 104', whenSub: 'Jahr ohne Behandlung', big: '+6,0 kg', c: C.regain, h: 'mehr Zunahme nach Liraglutid allein', d: 'als nach Training allein (ohne Medikament)', ci: '95-%-KI 2,1 bis 10,0 kg' },
      { x: 446, when: 'Woche 0 bis 104', whenSub: 'Studienbeginn bis ein Jahr nach dem Ende', big: '−5,1 kg', c: C.lean, h: 'Gewicht mit Training plus Liraglutid', d: 'gegenüber Liraglutid allein', ci: '95-%-KI −10,0 bis −0,2 kg' },
      { x: 828, when: 'Woche 0 bis 104', whenSub: 'Studienbeginn bis ein Jahr nach dem Ende', big: '−2,3 Punkte', c: C.lean, h: 'Körperfettanteil mit Training plus Liraglutid', d: 'gegenüber Liraglutid allein (Prozentpunkte)', ci: '95-%-KI −4,3 bis −0,3 Prozentpunkte' },
    ];
    const cw = 306;
    const size = Math.min(...cols.map((c) => fit(c.big, cw, 'big', F.bigger)));
    const hl = Math.max(...cols.map((c) => wrap(c.h, cw, 'head', F.label).length));
    const dl = Math.max(...cols.map((c) => wrap(c.d, cw, 'body', F.small).length));
    cols.forEach((c, i) => {
      if (i) b += L(c.x - 24, 150, c.x - 24, 420);
      b += T(c.x, 164, c.when, { st: 'head', size: F.text, fill: C.ink2 });
      b += T(c.x, 184, c.whenSub, { size: F.small, fill: C.ink3 });
      b += T(c.x, 254, c.big, { st: 'big', size, fill: c.c });
      b += P(c.x, 292, c.h, { st: 'head', size: F.label, maxW: cw, lh: 24 }).svg;
      const dy = 292 + hl * 24 + 6;
      b += P(c.x, dy, c.d, { size: F.small, fill: C.ink2, maxW: cw, lh: 19 }).svg;
      b += T(c.x, dy + dl * 19 + 10, c.ci, { size: F.small, fill: C.ink3 });
    });
    b += P(M, 446, 'Nach Training, allein oder mit Liraglutid, blieben Gewicht und Körperzusammensetzung ein Jahr nach dem Ende erhalten; nach Liraglutid allein kam das Gewicht zurück.', { size: F.small, fill: C.ink2, lh: 19 }).svg;
    // Studienablauf als eigener Block unten
    b += L(M, 484, W - M, 484);
    b += T(M, 506, 'Studienablauf (Abschnitte nicht maßstäblich), Erwachsene mit Adipositas', { size: F.small, fill: C.ink3 });
    const steps = [
      ['Woche −8 bis 0', 'kalorienarme Diät', C.ink3],
      ['Woche 0 bis 52', 'Placebo, Training, Liraglutid oder beides', C.ink],
      ['Woche 52 bis 104', 'ohne jede Behandlung', C.regain],
    ];
    steps.forEach(([a, sub, c], i) => {
      const x = M + i * 362;
      b += T(x, 531, a, { st: 'strong', size: F.small });
      b += T(x, 550, sub, { size: F.small, fill: C.ink2 });
      b += L(x, 564, x + 342, 564, { c, w: 3, cap: 'butt' });
    });
    add(
      's-lite-liraglutid-und-training.svg',
      {
        title: 'Liraglutid mit oder ohne Training: was danach bleibt',
        subtitle: 'S-LiTE: nach einer Diät ein Jahr Behandlung, danach ein Jahr ohne; Vergleiche der Gruppen mit 95-%-Konfidenzintervall',
        source: 'Lundgren et al., S-LiTE, NEJM 2021; Jensen et al., S-LiTE follow-up, eClinicalMedicine 2024;69:102475',
        alt: 'Drei Kennzahlen aus der S-LiTE-Studie mit Liraglutid: Im Jahr ohne Behandlung (Woche 52 bis 104) nahmen Teilnehmende nach Liraglutid allein 6,0 Kilogramm mehr zu als nach Training allein ohne Medikament (95-Prozent-Konfidenzintervall 2,1 bis 10,0). Von Studienbeginn bis ein Jahr nach dem Ende (Woche 0 bis 104) lagen Teilnehmende mit Training plus Liraglutid 5,1 Kilogramm niedriger (minus 10,0 bis minus 0,2) und beim Körperfettanteil 2,3 Prozentpunkte niedriger (minus 4,3 bis minus 0,3) als nach Liraglutid allein. Nach Training blieben Gewicht und Körperzusammensetzung erhalten. Studienablauf: 8 Wochen Diät, 52 Wochen Behandlung, 52 Wochen ohne Behandlung.',
      },
      b,
    );
  }

  /* N4. Der Hunger kommt vor der Waage (fachinfoWegovy, sumithran2011, wu2025) */
  {
    const px = (w) => 380 + (w / 20) * 700;
    let b = '';
    b += gridX([0, 4, 8, 12, 16, 20], px, 156, 490, (w) => `Woche ${w}`, 146);
    const top = 168, base = 246;
    const py = (f) => base - f * (base - top);
    b += L(px(0), base, px(20), base, { c: C.ink3, w: 1.2, g: true });
    b += T(px(0) - 12, top + 5, '100 %', { st: 'axis', size: F.axis, fill: C.ink3, anchor: 'end' });
    b += T(px(0) - 12, base + 5, '0 %', { st: 'axis', size: F.axis, fill: C.ink3, anchor: 'end' });
    const pts = [];
    for (let w = 0; w <= 20.001; w += 0.1) pts.push(`${pts.length ? 'L' : 'M'}${px(w).toFixed(1)} ${py(Math.pow(0.5, w)).toFixed(1)}`);
    b += PATH(pts.join(' '), { c: C.ink, w: 2.6 });
    b += T(M, 196, 'Wirkstoff im Körper', { st: 'head', size: F.label });
    b += T(M, 218, 'Semaglutid, rechnerisch', { size: F.small, fill: C.ink3 });
    b += T(px(5) + 10, 214, 'nach etwa 5 bis 7 Wochen weitgehend abgebaut', { size: F.small, fill: C.ink2 });
    const lanes = [
      { y: 300, label: 'Appetit kommt zurück', sub: 'aus dem Wirkstoffspiegel', note: 'Woche 2 bis 5, mit sinkendem Wirkstoffspiegel; bleibt danach (abgeleitet, nicht gemessen)' },
      { y: 376, label: 'Hungerhormone verschoben', sub: 'nach einer Diät', note: 'mehr Ghrelin, weniger Leptin: nach einer Diät noch ein Jahr später messbar (Studie ohne Medikament)' },
      { y: 452, label: 'Zunahme messbar', sub: 'Meta-Analyse', note: 'ab etwa Woche 8 messbar, Anstieg bis etwa Woche 20 (Meta-Analyse randomisierter Studien)' },
    ];
    for (const ln of lanes) {
      b += T(M, ln.y + 6, ln.label, { st: 'head', size: F.label });
      b += T(M, ln.y + 26, ln.sub, { size: F.small, fill: C.ink3 });
      b += T(px(0), ln.y + 30, ln.note, { size: F.small, fill: C.ink2 });
    }
    b += R(px(2), lanes[0].y - 7, px(5) - px(2), 14, { fill: C.regain });
    b += L(px(5), lanes[0].y, px(20), lanes[0].y, { c: C.regain, w: 2 });
    b += L(px(0), lanes[1].y, px(20) - 4, lanes[1].y, { c: C.regain, w: 2 });
    b += ARROW_R(px(20) + 6, lanes[1].y, C.regain, 8);
    b += R(px(8), lanes[2].y - 7, px(20) - px(8), 14, { fill: C.regain });
    // Fenster: Hunger zurück, Waage noch ruhig
    b += R(px(2), 516, px(8) - px(2), 6, { fill: C.hl, mark: false, rx: 3 });
    b += T(px(2), 546, 'Woche 2 bis 8: Der Hunger ist zurück, die Waage zeigt noch wenig.', { st: 'strong', size: F.text });
    add(
      'heisshunger-vor-der-waage.svg',
      {
        title: 'Der Hunger kommt vor der Waage',
        subtitle: 'Die ersten 20 Wochen nach der letzten Dosis: Wirkstoff, Appetit, Hungerhormone, Gewicht',
        source: 'Fachinformation Wegovy (EMA); Sumithran et al., NEJM 2011; Wu et al., Meta-Analyse, BMC Medicine 2025',
        alt: 'Zeitachse über 20 Wochen nach der letzten Dosis: Semaglutid baut sich mit einer Halbwertszeit von etwa einer Woche ab und ist nach etwa 5 bis 7 Wochen weitgehend weg. Der Appetit kommt, abgeleitet aus dem sinkenden Wirkstoffspiegel, in Woche 2 bis 5 zurück und bleibt. Die Hungerhormone sind nach einer Diät verschoben, mehr Ghrelin und weniger Leptin, noch ein Jahr später messbar (Studie ohne Medikament). Die Gewichtszunahme ist erst ab etwa Woche 8 messbar und steigt bis etwa Woche 20. Markiert ist das Fenster von Woche 2 bis 8, in dem der Hunger zurück ist, die Waage aber noch wenig zeigt.',
      },
      b,
    );
  }

  /* N5. Schlaf und Hungerhormone (spiegel2004) */
  {
    const x0 = 560;
    const px = (p) => x0 + (p / 50) * 470;
    const rows = [
      { label: 'Leptin', sub: 'Sättigungshormon', v: -18 },
      { label: 'Ghrelin', sub: 'Hungerhormon', v: 28 },
      { label: 'Hunger', sub: 'eigene Einschätzung', v: 24 },
      { label: 'Appetit', sub: 'eigene Einschätzung', v: 23 },
      { label: 'Appetit auf Kalorienreiches', sub: 'mit viel Kohlenhydraten, etwa Süßes und Salziges', lo: 33, hi: 45 },
    ];
    let b = '';
    b += gridX([-10, 0, 10, 20, 30, 40, 50], px, 154, 486, (p) => `${p > 0 ? '+' : p < 0 ? '−' : ''}${Math.abs(p)} %`, 510, { zero: 0 });
    rows.forEach((row, i) => {
      const y = 184 + i * 66;
      b += T(M, y + 2, row.label, { st: 'head', size: F.label });
      b += P(M, y + 22, row.sub, { size: F.small, fill: C.ink3, maxW: 290, lh: 17 }).svg;
      if (row.v !== undefined) {
        b += R(px(0), y - 12, px(row.v) - px(0), 24, { fill: C.regain, rx: 1 });
        const lab = `${row.v > 0 ? '+' : '−'}${Math.abs(row.v)} %`;
        b += row.v > 0 ? T(px(row.v) + 10, y + 8, lab, { st: 'num', size: F.value, fill: C.regain }) : T(px(row.v) + 10, y + 8, lab, { st: 'num', size: F.value, fill: C.bg, inside: true });
      } else {
        b += R(px(0), y - 12, px(row.lo) - px(0), 24, { fill: C.regain, rx: 1 });
        b += dottedBar(px(row.lo), y - 12, px(row.hi) - px(row.lo), 24, C.regain);
        b += T(px(row.hi) + 10, y + 8, `+${row.lo} bis ${row.hi} %`, { st: 'num', size: F.value, fill: C.regain });
      }
    });
    b += T(M, 554, 'Kleine Studie unter Laborbedingungen mit festgelegter Kalorienzufuhr; sie zeigt die Richtung, nicht die Größe im Alltag.', { size: F.small, fill: C.ink3 });
    add(
      'schlaf-und-hungerhormone.svg',
      {
        title: 'Zwei kurze Nächte: Hungerhormone und Appetit',
        subtitle: 'Nach zwei Nächten mit 4 Stunden im Bett gegenüber zwei Nächten mit 10 Stunden; 12 gesunde junge Männer',
        source: 'Spiegel et al., Ann Intern Med 2004;141(11):846–850',
        alt: 'Balkendiagramm: Nach zwei Nächten mit 4 Stunden im Bett gegenüber zwei Nächten mit 10 Stunden sank das Sättigungshormon Leptin um 18 Prozent, das Hungerhormon Ghrelin stieg um 28 Prozent, der Hunger um 24 Prozent und der Appetit um 23 Prozent; der Appetit auf kalorienreiche Lebensmittel mit viel Kohlenhydraten stieg um 33 bis 45 Prozent. Kleine Studie mit 12 gesunden jungen Männern unter Laborbedingungen.',
      },
      b,
    );
  }

  /* N6. Absetzen im ersten Jahr (rodriguez2025) */
  {
    let b = '';
    const panels = [
      { x: M, pct: 64.8, h: 'ohne Typ-2-Diabetes', d: 'hatten die Therapie innerhalb eines Jahres beendet' },
      { x: 640, pct: 46.5, h: 'mit Typ-2-Diabetes', d: 'hatten die Therapie innerhalb eines Jahres beendet' },
    ];
    for (const p of panels) {
      const n = Math.round(p.pct);
      for (let k = 0; k < 100; k++) {
        const cx = p.x + 10 + (k % 10) * 25;
        const cy = 176 + Math.floor(k / 10) * 25;
        b += k < n ? DOT(cx, cy, 8.5, C.ink, { stroke: C.ink, sw: 0 }) : `<circle cx="${cx}" cy="${cy}" r="7.6" fill="none" stroke="${C.ink3}" stroke-width="1.3"/>`;
      }
      const tx = p.x + 282;
      const size = fit(`${de(p.pct)} %`, 206, 'big', F.bigger);
      b += T(tx, 296, `${de(p.pct)} %`, { st: 'big', size });
      b += T(tx, 332, p.h, { st: 'head', size: F.label });
      b += P(tx, 358, p.d, { size: F.small, fill: C.ink2, maxW: 200, lh: 19 }).svg;
    }
    b += DOT(M + 10, 456, 8.5, C.ink, { stroke: C.ink, sw: 0 });
    b += T(M + 28, 461, 'abgesetzt', { size: F.small, fill: C.ink2 });
    b += `<circle cx="${M + 130}" cy="456" r="7.6" fill="none" stroke="${C.ink3}" stroke-width="1.3"/>`;
    b += T(M + 148, 461, 'weiter behandelt', { size: F.small, fill: C.ink2 });
    b += T(M + 300, 461, '1 Punkt = 1 Prozent, gerundet', { size: F.small, fill: C.ink3 });
    b += L(M, 492, W - M, 492);
    b += P(M, 526, 'Auswertung von Versorgungsdaten Erwachsener mit Übergewicht oder Adipositas in den USA, die einen GLP-1-Rezeptoragonisten begonnen hatten. Gründe fürs Absetzen waren unter anderem Gewichtsverlust, Einkommen und Nebenwirkungen.', { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'absetzen-im-ersten-jahr.svg',
      {
        title: 'Wie viele die Abnehmspritze im ersten Jahr absetzen',
        subtitle: 'Anteil, der eine GLP-1-Therapie innerhalb eines Jahres beendet hatte; US-Versorgungsdaten von 125.474 Erwachsenen',
        source: 'Rodriguez et al., JAMA Netw Open 2025;8(1):e2457349',
        alt: 'Zwei Punktraster mit je 100 Punkten aus US-Versorgungsdaten von 125.474 Erwachsenen mit Übergewicht oder Adipositas: Von Menschen ohne Typ-2-Diabetes hatten 64,8 Prozent ihre GLP-1-Therapie innerhalb eines Jahres beendet, von Menschen mit Typ-2-Diabetes 46,5 Prozent.',
      },
      b,
    );
  }

  /* N7. STEP 2: Semaglutid bei Typ-2-Diabetes (davies2021step2) */
  {
    const py = (p) => 214 + (-p / 12) * 290;
    const bars = [
      { x: 230, label: 'Semaglutid 2,4 mg', v: -9.6, kind: 'ink' },
      { x: 470, label: 'Semaglutid 1,0 mg', v: -7.0, kind: 'ink' },
      { x: 710, label: 'Placebo', v: -3.4, kind: 'placebo' },
    ];
    let b = '';
    b += gridY([0, -5, -10], py, 200, 900, (p) => `${de(p, 0)} %`, { zero: 0 });
    for (const bar of bars) {
      const cx = bar.x + 80;
      b += T(cx, 192, bar.label, { st: 'head', size: F.label, anchor: 'middle' });
      b += bar.kind === 'placebo' ? placeboBar(bar.x, py(0), 160, py(bar.v) - py(0)) : R(bar.x, py(0), 160, py(bar.v) - py(0), { fill: C.ink, rx: 1 });
      b += T(cx, py(bar.v) + 40, `${de(bar.v)} %`, { st: 'num', size: F.big, fill: bar.kind === 'placebo' ? C.ink3 : C.ink, anchor: 'middle' });
    }
    const x = 950, mw = W - M - x;
    b += T(x, 250, 'Zum Einordnen', { st: 'head', size: F.label });
    b += P(x, 278, 'Weniger Verlust heißt weniger, was nach dem Absetzen zurückkommen kann. Am Mechanismus ändert das nichts.', { size: F.small, fill: C.ink2, maxW: mw, lh: 20 }).svg;
    b += T(M, 562, 'Mittelwerte nach 68 Wochen; randomisierte, placebokontrollierte Studie.', { size: F.small, fill: C.ink3 });
    add(
      'step-2-typ-2-diabetes.svg',
      {
        title: 'Semaglutid bei Typ-2-Diabetes: die Studie STEP 2',
        subtitle: 'Mittlere Änderung des Körpergewichts nach 68 Wochen, Erwachsene mit Übergewicht und Typ-2-Diabetes',
        source: 'Davies et al., STEP 2, Lancet 2021;397(10278):971–984',
        alt: 'Balkendiagramm aus der Studie STEP 2 mit Erwachsenen mit Übergewicht und Typ-2-Diabetes: Nach 68 Wochen lag das Gewicht unter Semaglutid 2,4 Milligramm im Mittel 9,6 Prozent niedriger, unter Semaglutid 1,0 Milligramm 7,0 Prozent und unter Placebo 3,4 Prozent. Weniger Verlust heißt weniger, was nach dem Absetzen zurückkommen kann.',
      },
      b,
    );
  }

  /* N8. Supplements (leidy2015, kreider2017, euClaims, dgeBallaststoffe, adaSoc2024, klartextNem, almandoz2024) */
  {
    const cols = [
      {
        h: 'Sinnvoll, mit Bedingung', c: C.lean, line: { c: C.lean, w: 4, cap: 'butt' },
        items: [
          ['Protein', 'zugelassene Angabe: Erhalt von Muskelmasse; sinnvoll, wenn 1,2 bis 1,6 g pro kg Körpergewicht am Tag über Mahlzeiten nicht zusammenkommen'],
          ['Kreatin-Monohydrat', 'zugelassene Angabe: Leistung bei Schnellkrafttraining; 3 g täglich, nur zusammen mit Krafttraining'],
          ['Ballaststoffe', 'Richtwert mindestens 30 g am Tag; wenn du darunter bleibst, Lebensmittel zuerst'],
        ],
      },
      {
        h: 'Nur bei Mangel oder Lücke', c: C.ink, line: { c: C.ink, w: 4, cap: 'butt' },
        items: [
          ['Vitamin D', 'nach Blutwert'],
          ['Vitamin B12', 'bei Metformin oder veganer Ernährung kontrollieren lassen'],
          ['Eisen', 'nur nach ärztlich gemessenem Wert, nie auf Verdacht'],
          ['Magnesium', 'nur bei Lücke, etwa bei sehr kleinen Portionen; Lebensmittel zuerst'],
        ],
      },
      {
        h: 'Kein Beleg für den versprochenen Nutzen', c: C.ink3, line: { c: C.placebo, w: 2.6, dash: '0.1 6.5', cap: 'round' },
        items: [
          ['Fatburner, Detox, Booster', 'keine Belege, teils riskante Inhaltsstoffe'],
          ['„Natürliche GLP-1-Booster“', 'Berberin, Extrakte: keine zugelassene Angabe, mögliche Wechselwirkungen'],
          ['Probiotika „gegen Jojo“', 'keine Belege für Gewichtserhalt'],
          ['Omega-3', 'kein Beleg für Gewicht oder Muskeln nach der Spritze'],
        ],
      },
    ];
    const cw = 326;
    let b = '';
    let maxY = 0;
    cols.forEach((col, i) => {
      const x = M + i * 373;
      if (i) b += L(x - 24, 196, x - 24, 512);
      b += T(x, 160, col.h, { st: 'head', size: fit(col.h, cw, 'head', F.label), fill: col.c });
      b += L(x, 176, x + cw, 176, col.line);
      let y = 210;
      for (const [name, cond] of col.items) {
        b += T(x, y, name, { st: 'strong', size: F.text });
        const p = P(x, y + 21, cond, { size: F.small, fill: C.ink2, maxW: cw, lh: 19 });
        b += p.svg;
        y = p.bottom + 32;
      }
      maxY = Math.max(maxY, y);
    });
    if (maxY > 540) warn(`supplements-was-belegt-ist: Spalten zu lang (${maxY})`);
    b += P(M, 548, 'Nahrungsergänzungsmittel sind Lebensmittel und werden nicht auf Wirksamkeit geprüft. Vitamine und Mineralstoffe: erst messen, dann ergänzen.', { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'supplements-was-belegt-ist.svg',
      {
        title: 'Supplements nach der Abnehmspritze: was belegt ist',
        subtitle: 'Drei Stufen nach Datenlage; alles nur als Ergänzung zu Ernährung und Training',
        source: 'Leidy 2015; Kreider 2017; EU-Register Health Claims; DGE; ADA 2024; Verbraucherzentrale; Almandoz 2024',
        alt: 'Drei Spalten zu Supplements nach der Abnehmspritze. Sinnvoll, mit Bedingung: Protein (zugelassene Angabe: Erhalt von Muskelmasse), wenn 1,2 bis 1,6 Gramm pro Kilogramm Körpergewicht am Tag über Mahlzeiten nicht zusammenkommen; Kreatin-Monohydrat (zugelassene Angabe: Leistung bei Schnellkrafttraining), 3 Gramm täglich, nur mit Krafttraining; Ballaststoffe, wenn man unter dem Richtwert von 30 Gramm am Tag bleibt. Nur bei Mangel oder Lücke: Vitamin D nach Blutwert, Vitamin B12 bei Metformin oder veganer Ernährung kontrollieren, Eisen nur nach gemessenem Wert, Magnesium bei Lücke wie sehr kleinen Portionen. Kein Beleg für den versprochenen Nutzen: Fatburner, Detox und Booster, sogenannte natürliche GLP-1-Booster wie Berberin, Probiotika gegen den Jojo-Effekt, Omega-3 für Gewicht oder Muskeln.',
      },
      b,
    );
  }

  /* N9. Versorgung in Deutschland (nvs2, rabenberg2015) */
  {
    const x0 = 400;
    const px = (p) => x0 + (p / 100) * 640;
    const A = [
      ['Magnesium, Männer', 26],
      ['Magnesium, Frauen', 29],
      ['Eisen, Männer', 14],
      ['Eisen, Frauen', 58],
    ];
    const B = [
      ['unter 30 nmol/l (Mangel)', 30.2],
      ['unter 50 nmol/l', 61.6],
    ];
    let b = '';
    b += gridX([0, 25, 50, 75, 100], px, 182, 334, () => '', 0);
    b += gridX([0, 25, 50, 75, 100], px, 396, 476, (p) => `${p} %`, 500);
    b += T(M, 166, 'Zufuhr unter der Empfehlung', { st: 'head', size: F.label });
    b += T(M + tw('Zufuhr unter der Empfehlung', 'head', F.label) + 12, 166, 'Nationale Verzehrsstudie II', { size: F.small, fill: C.ink3 });
    A.forEach(([lab, v], i) => {
      const y = 202 + i * 38;
      b += T(M, y + 6, lab, { size: F.text });
      b += R(x0, y - 11, px(v) - x0, 22, { fill: C.ink, rx: 1 });
      b += T(px(v) + 10, y + 8, `${de(v, 0)} %`, { st: 'num', size: F.value });
    });
    b += T(M, 378, 'Vitamin-D-Wert im Blut', { st: 'head', size: F.label });
    b += T(M + tw('Vitamin-D-Wert im Blut', 'head', F.label) + 12, 378, 'Gesundheitsstudie DEGS1', { size: F.small, fill: C.ink3 });
    B.forEach(([lab, v], i) => {
      const y = 416 + i * 38;
      b += T(M, y + 6, lab, { size: F.text });
      b += R(x0, y - 11, px(v) - x0, 22, { fill: C.ink, rx: 1 });
      b += T(px(v) + 10, y + 8, `${de(v)} %`, { st: 'num', size: F.value });
    });
    b += P(M, 536, 'Erhoben vor der Zeit der GLP-1-Medikamente; Vitamin D im Winter deutlich niedriger als im Sommer. Wer unter der Spritze kleine Portionen isst, startet von dieser Ausgangslage.', { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'versorgung-in-deutschland.svg',
      {
        title: 'Wo die Versorgung in Deutschland ohnehin knapp ist',
        subtitle: 'Anteil der Erwachsenen unter der Zufuhrempfehlung bzw. mit niedrigem Vitamin-D-Wert im Blut',
        source: 'Max Rubner-Institut, Nationale Verzehrsstudie II, 2008; Rabenberg et al., DEGS1, BMC Public Health 2015',
        alt: 'Balkendiagramm zur Versorgung Erwachsener in Deutschland: Unter der Zufuhrempfehlung lagen bei Magnesium 26 Prozent der Männer und 29 Prozent der Frauen, bei Eisen 14 Prozent der Männer und 58 Prozent der Frauen (Nationale Verzehrsstudie II). Beim Vitamin-D-Wert im Blut lagen 30,2 Prozent unter 30 Nanomol pro Liter (Mangel) und 61,6 Prozent unter 50 Nanomol pro Liter (DEGS1). Erhoben vor der Zeit der GLP-1-Medikamente.',
      },
      b,
    );
  }

  /* N10. Fett und fettfreie Masse in zwei DXA-Substudien (wilding2021dxa, look2025surmount1dxa) */
  {
    const x0 = M, w = W - 2 * M;
    const rows = [
      { y: 172, name: 'STEP 1, Semaglutid', sub: 'DXA-Substudie mit 140 Teilnehmenden, 68 Wochen', fat: 60 },
      { y: 326, name: 'SURMOUNT-1, Tirzepatid', sub: 'DXA-Substudie mit 160 Teilnehmenden, 72 Wochen', fat: 75 },
    ];
    let b = '';
    for (const row of rows) {
      b += T(x0, row.y, row.name, { st: 'head', size: F.label });
      b += T(x0 + tw(row.name, 'head', F.label) + 14, row.y, row.sub, { size: F.small, fill: C.ink3 });
      const by = row.y + 18, bh = 90, fw = (w * row.fat) / 100;
      b += R(x0, by, fw, bh, { fill: C.fat, stroke: C.fatEdge, sw: 1.4, rx: 3 });
      b += R(x0 + fw, by, w - fw, bh, { fill: C.lean, rx: 3 });
      b += T(x0 + 22, by + 48, `rund ${row.fat} %`, { st: 'num', size: F.big, inside: true });
      b += T(x0 + 22, by + 74, 'Fettmasse', { st: 'head', size: F.text, inside: true });
      b += T(x0 + fw + 22, by + 48, `rund ${100 - row.fat} %`, { st: 'num', size: F.big, fill: C.bg, inside: true });
      b += T(x0 + fw + 22, by + 74, 'fettfreie Masse', { st: 'head', size: F.text, fill: C.bg, inside: true });
    }
    b += P(x0, 484, 'SURMOUNT-1 unter Tirzepatid: Körpergewicht −21,3 %, Fettmasse −33,9 %, fettfreie Masse −10,9 % (Placebo −5,3 %, −8,2 %, −2,6 %); das Verhältnis von Fett zu fettfreier Masse war unter Tirzepatid und Placebo ähnlich.', { size: F.text, fill: C.ink2, lh: 22 }).svg;
    b += P(x0, 548, 'Fettfreie Masse heißt Muskeln, Organe, Knochen, Wasser. Zwei verschiedene Studien, kein direkter Vergleich der Wirkstoffe; Anteile gerundet.', { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'fett-und-fettfreie-masse-zwei-studien.svg',
      {
        title: 'Wie viel vom verlorenen Gewicht Fett war',
        subtitle: 'Anteile am Gewichtsverlust in zwei DXA-Substudien: Semaglutid in STEP 1, Tirzepatid in SURMOUNT-1',
        source: 'Wilding et al., STEP 1 body composition, J Endocr Soc 2021; Look et al., SURMOUNT-1, Diabetes Obes Metab 2025',
        alt: 'Zwei Balken, die den Gewichtsverlust aufteilen: In der STEP-1-Substudie mit Semaglutid (140 Teilnehmende, 68 Wochen) entfielen rund 60 Prozent auf Fettmasse und rund 40 Prozent auf fettfreie Masse, in der SURMOUNT-1-Substudie mit Tirzepatid (160 Teilnehmende, 72 Wochen) rund 75 Prozent auf Fettmasse und rund 25 Prozent auf fettfreie Masse. Unter Tirzepatid sanken Körpergewicht um 21,3 Prozent, Fettmasse um 33,9 Prozent und fettfreie Masse um 10,9 Prozent (Placebo 5,3, 8,2 und 2,6 Prozent). Zwei verschiedene Studien, kein direkter Vergleich.',
      },
      b,
    );
  }

  /* N11. Trainingsart beim Abnehmen (villareal2017) */
  {
    let b = '';
    const A = [
      ['Krafttraining', 1.0],
      ['Kraft plus Ausdauer', 1.7],
      ['Ausdauertraining', 2.7],
    ];
    b += T(M, 168, 'Verlust an fettfreier Masse', { st: 'head', size: F.label });
    const pxA = (kg) => 290 + (kg / 3) * 230;
    b += L(pxA(0), 190, pxA(0), 386, { c: C.ink3, w: 1.2 });
    A.forEach(([lab, v], i) => {
      const y = 222 + i * 62;
      b += T(M, y + 6, lab, { st: 'head', size: F.text });
      b += R(pxA(0), y - 13, pxA(v) - pxA(0), 26, { fill: C.lean, rx: 1 });
      b += T(pxA(v) + 10, y + 8, `−${de(v)} kg`, { st: 'num', size: F.value, fill: C.lean });
    });
    b += L(616, 150, 616, 404);
    const x = 650;
    const B = [
      ['Krafttraining', null],
      ['Kraft plus Ausdauer', 1.1],
      ['Ausdauertraining', 2.6],
    ];
    b += T(x, 168, 'Knochendichte der Hüfte', { st: 'head', size: F.label });
    const pxB = (p) => 860 + (p / 3) * 200;
    b += L(pxB(0), 190, pxB(0), 386, { c: C.ink3, w: 1.2 });
    B.forEach(([lab, v], i) => {
      const y = 222 + i * 62;
      b += T(x, y + 6, lab, { st: 'head', size: F.text });
      if (v === null) {
        b += dottedBar(pxB(0), y - 13, pxB(1) - pxB(0), 26, C.ink3);
        b += T(pxB(1) + 10, y + 6, 'unter 1 %, n. s.', { size: F.small, fill: C.ink2 });
      } else {
        b += R(pxB(0), y - 13, pxB(v) - pxB(0), 26, { fill: C.ink, rx: 1 });
        b += T(pxB(v) + 10, y + 8, `−${de(v)} %`, { st: 'num', size: F.value });
      }
    });
    b += L(M, 436, W - M, 436);
    b += P(M, 474, 'Bei gleicher Diät verlor die Krafttrainingsgruppe am wenigsten fettfreie Masse; die Knochendichte der Hüfte sank mit Ausdauertraining am stärksten, mit Krafttraining um weniger als 1 %.', { size: F.label, lh: 26 }).svg;
    b += T(M, 558, 'Beide Geschlechter; fettfreie Masse in kg, Knochendichte in Prozent gegenüber dem Start; n. s. = nicht signifikant.', { size: F.small, fill: C.ink3 });
    add(
      'training-art-fettfreie-masse.svg',
      {
        title: 'Kraft oder Ausdauer: fettfreie Masse und Knochen beim Abnehmen',
        subtitle: 'Randomisierte Studie: 160 Erwachsene ab 65 Jahren mit Adipositas, 26 Wochen Diät, Gewicht im Mittel −9 %',
        source: 'Villareal et al., NEJM 2017;376(20):1943–1955',
        alt: 'Zwei Balkengruppen aus einer randomisierten Studie mit 160 Erwachsenen ab 65 Jahren mit Adipositas, 26 Wochen Diät und im Mittel 9 Prozent Gewichtsverlust: Verlust an fettfreier Masse mit Krafttraining 1,0 Kilogramm, mit Kraft plus Ausdauer 1,7 Kilogramm, mit Ausdauertraining 2,7 Kilogramm. Knochendichte der Hüfte: minus 2,6 Prozent mit Ausdauertraining, minus 1,1 Prozent mit Kraft plus Ausdauer, mit Krafttraining weniger als 1 Prozent und nicht signifikant.',
      },
      b,
    );
  }

  /* N12. Wiegen mit Zonen, STOP Regain (wing2006; daley2019) */
  {
    const px = (kg) => M + (kg / 3) * (W - 2 * M);
    let b = '';
    b += T(px(0), 166, 'Gewicht nach der Abnahme (Studienbeginn)', { size: F.small, fill: C.ink3 });
    b += T(px(1.4), 166, '+1,4 kg', { st: 'axis', size: F.axis, fill: C.ink3, anchor: 'middle' });
    b += T(px(2.3), 166, '+2,3 kg', { st: 'axis', size: F.axis, fill: C.ink3, anchor: 'middle' });
    b += R(px(0), 180, px(1.4) - px(0), 60, { fill: C.lean, rx: 0 });
    b += R(px(1.4), 180, px(2.3) - px(1.4), 60, { fill: C.hl, rx: 0 });
    b += R(px(2.3), 180, px(3) - px(2.3), 60, { fill: C.regain, rx: 0 });
    b += T(px(0) + 16, 206, 'bis +1,4 kg', { st: 'head', size: F.label, fill: C.bg, inside: true });
    b += T(px(0) + 16, 228, 'Zone grün', { size: F.small, fill: C.bg, inside: true });
    b += T(px(1.4) + 16, 206, 'bis +2,3 kg', { st: 'head', size: F.label, inside: true });
    b += T(px(1.4) + 16, 228, 'Zone gelb', { size: F.small, inside: true });
    b += T(px(2.3) + 16, 206, 'ab +2,3 kg', { st: 'head', size: F.label, fill: C.bg, inside: true });
    b += T(px(2.3) + 16, 228, 'obere Zone (in der Studie: rot)', { size: F.small, fill: C.bg, inside: true });
    b += T(M, 294, 'Anteil, der 2,3 kg oder mehr wieder zunahm', { st: 'head', size: F.label });
    const x0 = 470;
    const pr = (p) => x0 + (p / 100) * 560;
    b += gridX([0, 25, 50, 75, 100], pr, 312, 440, (p) => `${p} %`, 464);
    b += T(M, 346, 'Wiegen mit Zonen', { st: 'head', size: F.text });
    b += T(M, 366, 'persönlich betreute Gruppe', { size: F.small, fill: C.ink3 });
    b += R(x0, 334, pr(45.7) - x0, 30, { fill: C.regain, rx: 1 });
    b += T(pr(45.7) + 10, 357, '45,7 %', { st: 'num', size: F.value, fill: C.regain });
    b += T(M, 408, 'Kontrollgruppe', { st: 'head', size: F.text });
    b += T(M, 428, 'ohne dieses Programm', { size: F.small, fill: C.ink3 });
    b += placeboBar(x0, 396, pr(72.4) - x0, 30);
    b += T(pr(72.4) + 10, 419, '72,4 %', { st: 'num', size: F.value, fill: C.ink3 });
    b += P(M, 512, 'Zu jeder Zone gehörte eine vorher festgelegte Reaktion. Wiegen ohne festgelegte Reaktion verhinderte die Wiederzunahme in einer späteren Studie nicht (LIMIT, 2019).', { size: F.text, fill: C.ink2, lh: 22 }).svg;
    add(
      'wiegen-zonen-stop-regain.svg',
      {
        title: 'Wiegen mit Zonen: was die STOP-Regain-Studie zeigt',
        subtitle: '314 Erwachsene nach mindestens 10 % Gewichtsverlust, 18 Monate; tägliches Wiegen mit festgelegter Reaktion je Zone',
        source: 'Wing et al., STOP Regain, NEJM 2006;355(15):1563–1571; Daley et al., LIMIT, Public Health Res 2019',
        alt: 'Zonen der STOP-Regain-Studie bezogen auf das Gewicht nach der Abnahme, zu Studienbeginn: grün bis plus 1,4 Kilogramm, gelb bis plus 2,3 Kilogramm, obere Zone (in der Studie rot) ab plus 2,3 Kilogramm, jeweils mit vorher festgelegter Reaktion. Nach 18 Monaten hatten in der persönlich betreuten Gruppe 45,7 Prozent 2,3 Kilogramm oder mehr wieder zugenommen, in der Kontrollgruppe 72,4 Prozent. Wiegen ohne festgelegte Reaktion verhinderte die Wiederzunahme in einer späteren Studie nicht.',
      },
      b,
    );
  }

  /* N13. Feiertage (helander2016, turicchi2020, mason2018) */
  {
    const z = 600;
    const pA = (p) => z + (p / 1.5) * 420;
    const pB = (kg) => z + (kg / 0.5) * 420;
    let b = '';
    b += L(z, 176, z, 334, { c: C.ink3, w: 1.2 });
    b += L(z, 410, z, 508, { c: C.ink3, w: 1.2 });
    b += T(M, 160, 'Gewicht nach den Feiertagen gegenüber davor', { st: 'head', size: F.label });
    const A = [
      ['Deutschland, Weihnachten', 'vernetzte Waagen, 10 Tage danach gegenüber 10 Tagen davor', 0.6],
      ['Deutschland, Ostern', 'gleiche Messung', 0.2],
      ['Haltephase nach Gewichtsverlust, Weihnachten', 'europäische Studie, vorher mindestens 5 % abgenommen', 1.35],
    ];
    A.forEach(([lab, sub, v], i) => {
      const y = 202 + i * 52;
      b += T(M, y + 2, lab, { st: 'head', size: F.text });
      b += T(M, y + 21, sub, { size: F.small, fill: C.ink3 });
      b += R(z, y - 10, pA(v) - z, 22, { fill: C.regain, rx: 1 });
      b += T(pA(v) + 10, y + 8, `+${de(v, v === 1.35 ? 2 : 1)} %`, { st: 'num', size: F.value, fill: C.regain });
    });
    b += T(M, 392, 'Wiegen über die Feiertage', { st: 'head', size: F.label });
    b += T(M + tw('Wiegen über die Feiertage', 'head', F.label) + 12, 392, 'randomisierte Studie, zwei Weihnachtsperioden', { size: F.small, fill: C.ink3 });
    b += T(M, 432, 'mindestens zweimal pro Woche wiegen,', { st: 'head', size: F.text });
    b += T(M, 451, 'notieren, zehn Tipps', { st: 'head', size: F.text });
    b += R(pB(-0.13), 425, z - pB(-0.13), 22, { fill: C.lean, rx: 1 });
    b += T(pB(-0.13) - 10, 443, '−0,13 kg', { st: 'num', size: F.value, fill: C.lean, anchor: 'end' });
    b += T(M, 490, 'Vergleichsgruppe', { st: 'head', size: F.text });
    b += placeboBar(z, 477, pB(0.37) - z, 22);
    b += T(pB(0.37) + 10, 495, '+0,37 kg', { st: 'num', size: F.value, fill: C.ink3 });
    b += P(M, 538, 'Unterschied in der randomisierten Studie: 0,49 kg. In der Waagen-Studie war etwa die Hälfte der Zunahme kurz danach wieder weg; die andere Hälfte blieb bis in den Sommer oder länger.', { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'feiertage-gewicht.svg',
      {
        title: 'Weihnachten auf der Waage: was Studien messen',
        subtitle: 'Gewichtsänderung über die Feiertage in drei Studien, Mittelwerte',
        source: 'Helander et al., NEJM 2016; Turicchi et al., NoHoW, PLoS ONE 2020; Mason et al., BMJ 2018',
        alt: 'Zwei Balkengruppen: Zehn Tage nach Weihnachten lag das Gewicht in Deutschland im Mittel 0,6 Prozent höher als zehn Tage davor, zu Ostern 0,2 Prozent. In einer europäischen Studie mit Menschen in der Haltephase nach mindestens 5 Prozent Gewichtsverlust stieg es über Weihnachten um 1,35 Prozent. In einer randomisierten Studie wog die Gruppe, die sich mindestens zweimal pro Woche wog, notierte und zehn Tipps bekam, nach den Feiertagen 0,13 Kilogramm weniger, die Vergleichsgruppe 0,37 Kilogramm mehr; Unterschied 0,49 Kilogramm.',
      },
      b,
    );
  }

  /* N14. Wechseljahre: Körperzusammensetzung (greendale2019) */
  {
    let b = '';
    b += T(M, 168, 'Fettmasse pro Jahr', { st: 'head', size: F.label });
    const baseA = 440, scA = 220 / 0.5;
    const fat = [
      ['vor dem Übergang', 0.25, 120],
      ['im Übergang', 0.45, 330],
    ];
    b += L(M, baseA, 560, baseA, { c: C.ink3, w: 1.2 });
    for (const [lab, v, x] of fat) {
      b += R(x, baseA - v * scA, 140, v * scA, { fill: C.fat, stroke: C.fatEdge, sw: 1.4, rx: 1 });
      b += T(x + 70, baseA - v * scA - 14, `+${de(v, 2)} kg`, { st: 'num', size: F.big, anchor: 'middle' });
      b += T(x + 70, baseA + 26, lab, { st: 'head', size: F.text, fill: C.ink2, anchor: 'middle' });
    }
    b += L(610, 150, 610, 480);
    b += T(650, 168, 'Fettfreie Masse pro Jahr', { st: 'head', size: F.label });
    const z = 324, scB = 100 / 0.2;
    b += L(650, z, W - M, z, { c: C.ink3, w: 1.2 });
    b += R(720, z - 0.2 * scB, 140, 0.2 * scB, { fill: C.lean, rx: 1 });
    b += T(790, z - 0.2 * scB - 14, '+0,2 %', { st: 'num', size: F.big, fill: C.lean, anchor: 'middle' });
    b += R(930, z, 140, 0.2 * scB, { fill: C.lean, rx: 1 });
    b += T(1000, z + 0.2 * scB + 36, '−0,2 %', { st: 'num', size: F.big, fill: C.lean, anchor: 'middle' });
    b += T(790, z + 26, 'vor dem Übergang', { st: 'head', size: F.text, fill: C.ink2, anchor: 'middle' });
    b += T(1000, z - 14, 'im Übergang', { st: 'head', size: F.text, fill: C.ink2, anchor: 'middle' });
    b += P(M, 524, 'Beides lief bis etwa zwei Jahre nach der letzten Regelblutung weiter. Das Gewicht selbst stieg im Übergang nicht schneller als vorher.', { size: F.text, lh: 23 }).svg;
    add(
      'wechseljahre-koerperzusammensetzung.svg',
      {
        title: 'Wechseljahre: was sich am Körper verschiebt',
        subtitle: 'SWAN-Studie mit DXA-Messungen bei 1.246 Frauen: jährliche Veränderung vor dem Übergang und im Übergang',
        source: 'Greendale et al., SWAN, JCI Insight 2019;4(5):e124865',
        alt: 'Zwei Balkengruppen aus der SWAN-Studie mit 1.246 Frauen: Der jährliche Zuwachs an Fettmasse stieg von 0,25 Kilogramm vor dem Übergang auf 0,45 Kilogramm im Übergang. Die fettfreie Masse nahm vor dem Übergang um 0,2 Prozent pro Jahr zu und sank im Übergang um 0,2 Prozent pro Jahr. Beides lief bis etwa zwei Jahre nach der letzten Regelblutung weiter; das Gewicht selbst stieg nicht schneller als vorher.',
      },
      b,
    );
  }

  /* N15. Protein verteilen (mamerow2014, leidy2015) */
  {
    let b = '';
    const base = 456, sc = 220 / 65;
    const charts = [
      { x: M, h: 'Gleichmäßig', sub: 'etwa 30 g pro Mahlzeit', v: [30, 30, 30] },
      { x: 470, h: 'Abendlastig', sub: 'etwa 10, 15 und 65 g', v: [10, 15, 65] },
    ];
    for (const ch of charts) {
      b += T(ch.x, 168, ch.h, { st: 'head', size: F.label });
      b += T(ch.x, 190, ch.sub, { size: F.small, fill: C.ink2 });
      b += L(ch.x, base, ch.x + 340, base, { c: C.ink3, w: 1.2 });
      ch.v.forEach((v, i) => {
        const x = ch.x + 10 + i * 115;
        b += R(x, base - v * sc, 90, v * sc, { fill: C.ink, rx: 1 });
        b += T(x + 45, base - v * sc - 12, `${v} g`, { st: 'num', size: F.value, anchor: 'middle' });
        b += T(x + 45, base + 24, ['Frühstück', 'Mittag', 'Abend'][i], { size: F.small, fill: C.ink3, anchor: 'middle' });
      });
    }
    b += L(860, 150, 860, 490);
    const rx = 896;
    b += T(rx, 300, '+25 %', { st: 'big', size: fit('+25 %', W - M - rx, 'big', F.huge), fill: C.lean });
    b += T(rx, 338, 'Muskelproteinsynthese', { st: 'head', size: F.label });
    b += P(rx, 364, 'über 24 Stunden bei gleichmäßiger Verteilung, gegenüber abendlastig', { size: F.small, fill: C.ink2, maxW: W - M - rx, lh: 20 }).svg;
    b += P(M, 532, 'Kleine Studie; gemessen wurde die Muskelproteinsynthese, nicht die Muskelmasse. Empfehlung für Gewichtsabnahme und -erhalt: mindestens etwa 25 bis 30 g Protein pro Mahlzeit.', { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'protein-verteilung.svg',
      {
        title: 'Protein verteilen: gleich viel zu jeder Mahlzeit',
        subtitle: 'Gleiche Tagesmenge, zwei Verteilungen; Muskelproteinsynthese über 24 Stunden bei gesunden Erwachsenen',
        source: 'Mamerow et al., J Nutr 2014;144(6):876–880; Leidy et al., Am J Clin Nutr 2015',
        alt: 'Zwei Balkengruppen: gleichmäßige Verteilung mit etwa 30 Gramm Protein zu Frühstück, Mittag und Abend gegenüber abendlastiger Verteilung mit etwa 10, 15 und 65 Gramm bei gleicher Tagesmenge. Bei gleichmäßiger Verteilung lag die Muskelproteinsynthese über 24 Stunden um 25 Prozent höher. Kleine Studie, gemessen wurde die Muskelproteinsynthese, nicht die Muskelmasse. Empfehlung für Gewichtsabnahme und -erhalt: mindestens etwa 25 bis 30 Gramm Protein pro Mahlzeit.',
      },
      b,
    );
  }

  /* N16. Kalorienbedarf: zwei Effekte (mifflin1990, dgeEnergie, leibel1995, rosenbaum2010, martins2020) */
  {
    // Frau, 45 Jahre, 170 cm: Mifflin-St-Jeor mal 1,4 (eigene Rechnung wie im Artikel)
    const tag = (kg) => (10 * kg + 6.25 * 170 - 5 * 45 - 161) * 1.4;
    const v95 = Math.round(tag(95)), v80 = Math.round(tag(80));
    const lo = v80 - 400, hi = v80 - 300;
    const base = 470, sc = 300 / 2500;
    const y = (k) => base - k * sc;
    const xs = [220, 420, 620, 820, 1020];
    const bw = 130;
    let b = '';
    b += gridY([0, 500, 1000, 1500, 2000, 2500], y, 150, W - M, (k) => (k === 2500 ? '2.500 kcal' : tsd(k)), { zero: 0 });
    b += R(xs[0] - bw / 2, y(v95), bw, v95 * sc, { fill: C.ink, rx: 1 });
    b += T(xs[0], y(v95) - 12, `${tsd(v95)} kcal`, { st: 'num', size: F.label, anchor: 'middle' });
    b += L(xs[0] + bw / 2, y(v95), xs[1] - bw / 2, y(v95), { c: C.ink3, dash: '3 4' });
    b += R(xs[1] - bw / 2, y(v95), bw, (v95 - v80) * sc, { fill: C.bg2, stroke: C.ink3, sw: 1.4, rx: 1 });
    b += T(xs[1], y(v95) - 12, `−${v95 - v80} kcal`, { st: 'num', size: F.label, fill: C.ink2, anchor: 'middle' });
    b += L(xs[1] + bw / 2, y(v80), xs[2] - bw / 2, y(v80), { c: C.ink3, dash: '3 4' });
    b += R(xs[2] - bw / 2, y(v80), bw, v80 * sc, { fill: C.ink, rx: 1 });
    b += T(xs[2], y(v80) - 12, `${tsd(v80)} kcal`, { st: 'num', size: F.label, anchor: 'middle' });
    b += L(xs[2] + bw / 2, y(v80), xs[3] - bw / 2, y(v80), { c: C.ink3, dash: '3 4' });
    b += R(xs[3] - bw / 2, y(v80), bw, 300 * sc, { fill: C.regain, rx: 1 });
    b += dottedBar(xs[3] - bw / 2, y(hi), bw, 100 * sc, C.regain);
    b += T(xs[3], y(v80) - 12, '−300 bis −400 kcal', { st: 'num', size: F.label, fill: C.regain, anchor: 'middle' });
    b += L(xs[3] + bw / 2, y(hi), xs[4] - bw / 2, y(hi), { c: C.ink3, dash: '3 4' });
    b += R(xs[4] - bw / 2, y(lo), bw, lo * sc, { fill: C.ink, rx: 1 });
    b += dottedBar(xs[4] - bw / 2, y(hi), bw, 100 * sc, C.ink);
    b += T(xs[4], y(hi) - 34, 'rund 1.700 bis', { st: 'num', size: F.label, anchor: 'middle' });
    b += T(xs[4], y(hi) - 12, '1.800 kcal', { st: 'num', size: F.label, anchor: 'middle' });
    const caps = [['Vorher', '95 kg'], ['Leichterer', 'Körper'], ['Formel', 'für 80 kg'], ['Anpassung', 'nach dem Abnehmen'], ['Realistisch', 'mit Anpassung']];
    caps.forEach(([a, c], i) => {
      b += T(xs[i], base + 24, a, { st: 'head', size: F.text, anchor: 'middle' });
      b += T(xs[i], base + 43, c, { size: F.small, fill: C.ink2, anchor: 'middle' });
    });
    b += P(M, 548, 'Formel: Mifflin-St-Jeor mal 1,4, eigene Rechnung, gerundet. Anpassung: 300 bis 400 kcal Gesamtverbrauch in Messungen nach 10 % Gewichtsverlust; beim Ruheumsatz in einer anderen Studie deutlich weniger (Martins 2020: 92 kcal am Tag).', { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'kalorienbedarf-zwei-effekte.svg',
      {
        title: 'Warum nach dem Abnehmen weniger Energie gebraucht wird',
        subtitle: 'Rechenbeispiel: Frau, 45 Jahre, 170 cm, von 95 auf 80 kg; Tagesbedarf in kcal bei Aktivitätsfaktor 1,4',
        source: 'Mifflin et al. 1990; DGE-Referenzwerte Energie; Leibel et al. 1995; Rosenbaum und Leibel 2010; Martins et al. 2020',
        alt: `Wasserfalldiagramm für eine Frau mit 45 Jahren und 170 Zentimetern: Vor dem Abnehmen mit 95 Kilogramm liegt der Tagesbedarf laut Formel bei ${tsd(v95)} kcal. Der leichtere Körper senkt ihn um ${v95 - v80} kcal auf ${tsd(v80)} kcal bei 80 Kilogramm. Die Anpassung nach Gewichtsverlust senkt den tatsächlichen Verbrauch in Messungen um weitere 300 bis 400 kcal, auf rund 1.700 bis 1.800 kcal; beim Ruheumsatz war die Anpassung in einer anderen Studie deutlich kleiner (92 kcal am Tag). Formel nach Mifflin-St-Jeor mal Aktivitätsfaktor 1,4, gerundet.`,
      },
      b,
    );
  }

  /* N17. Ein Tag mit rund 100 g Protein (leidy2015, bls) */
  {
    const px = (g) => M + (g / 130) * (W - 2 * M);
    const meals = [
      ['Morgens', 24, `200${NB}g Skyr, Beeren, 2${NB}EL Haferflocken`],
      ['Mittags', 30, `Salat oder Gemüse, 120${NB}g Hähnchen, Fisch oder Tofu, 1${NB}Scheibe Vollkornbrot`],
      ['Nachmittags', 20, 'Hüttenkäse oder Protein-Shake, ein Apfel'],
      ['Abends', 30, `Linsen- oder Bohneneintopf, 2${NB}Eier oder 150${NB}g Fisch`],
    ];
    let b = '';
    b += T(px(96), 168, 'Ziel bei 80 kg: 96 bis 128 g', { st: 'strong', size: F.small, fill: C.lean });
    b += `<path d="M${px(96)} 190 V180 H${px(128)} V190" fill="none" stroke="${C.lean}" stroke-width="2.4"/>`;
    let g = 0;
    for (const [lab, v, food] of meals) {
      const x1 = px(g), x2 = px(g + v);
      b += T(x1, 210, lab, { st: 'head', size: F.text });
      b += R(x1, 224, x2 - x1 - 3, 64, { fill: C.ink, rx: 1 });
      b += T(x1 + 14, 266, `ca. ${v} g`, { st: 'num', size: F.value, fill: C.bg, inside: true });
      b += P(x1, 368, food, { size: F.small, fill: C.ink2, maxW: x2 - x1 - 16, lh: 19 }).svg;
      g += v;
    }
    b += T(px(g) + 12, 266, '= rund 100 g', { st: 'num', size: F.value });
    b += L(px(0), 300, px(130), 300, { c: C.ink3, w: 1.2 });
    for (const t of [0, 25, 50, 75, 100, 125]) {
      b += L(px(t), 300, px(t), 307, { c: C.ink3, w: 1.2 });
      b += T(px(t), 326, `${t} g`, { st: 'axis', size: F.axis, fill: C.ink3, anchor: t === 0 ? 'start' : 'middle' });
    }
    b += P(M, 500, 'Zusammen rund 100 g Protein und 30 g Ballaststoffe, ohne Kalorienzählen. Beispiel für 80 kg Körpergewicht, Zielbereich 1,2 bis 1,6 g Protein pro kg und Tag. Mit Tofu statt Hähnchen oder Fisch liegt das Mittagessen niedriger. Proteinwerte aus dem Bundeslebensmittelschlüssel, gerundet.', { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'protein-tag-beispiel.svg',
      {
        title: 'Ein Tag mit rund 100 g Protein bei 80 kg',
        subtitle: 'Die vier Mahlzeiten aus dem Beispieltag mit ihrem Proteingehalt, gegenüber dem Zielbereich',
        source: 'Leidy et al., Am J Clin Nutr 2015; Bundeslebensmittelschlüssel (BLS 3.02), gerundet',
        alt: 'Gestapelter Balken eines Beispieltags bei 80 Kilogramm Körpergewicht: morgens 200 Gramm Skyr mit Beeren und 2 Esslöffeln Haferflocken, etwa 24 Gramm Protein; mittags Salat oder Gemüse mit 120 Gramm Hähnchen, Fisch oder Tofu und einer Scheibe Vollkornbrot, etwa 30 Gramm (mit Tofu weniger); nachmittags Hüttenkäse oder ein Protein-Shake und ein Apfel, etwa 20 Gramm; abends Linsen- oder Bohneneintopf mit 2 Eiern oder 150 Gramm Fisch, etwa 30 Gramm. Zusammen rund 100 Gramm Protein, im Zielbereich von 96 bis 128 Gramm (1,2 bis 1,6 Gramm pro Kilogramm), und rund 30 Gramm Ballaststoffe.',
      },
      b,
    );
  }

  /* N18. Ballaststoffe je Portion (bls, dgeBallaststoffe, euClaims) */
  {
    const x0 = 470;
    const px = (g) => x0 + (g / 10) * 600;
    const rows = [
      ['Linsen, gekocht', '150 g', 8],
      ['Vollkornbrot', '2 Scheiben (100 g)', 8],
      ['Himbeeren', '125 g', 6],
      ['Brokkoli, gegart', '200 g', 6],
      ['Haferflocken', '50 g', 5],
      ['Leinsamen, geschrotet', '1 EL (10 g)', 4],
      ['Glucomannan', 'Tagesmenge laut Angabe', 3, true],
    ];
    let b = '';
    b += gridX([0, 2, 4, 6, 8, 10], px, 156, 432, (g) => `${g} g`, 146);
    rows.forEach(([lab, sub, v, supp], i) => {
      const y = 176 + i * 40;
      b += T(M, y + 7, lab, { st: 'head', size: F.text });
      b += T(M + tw(lab, 'head', F.text) + 10, y + 7, sub, { size: F.small, fill: C.ink3 });
      b += supp ? R(x0, y - 11, px(v) - x0, 22, { fill: C.bg2, stroke: C.ink, sw: 1.6, rx: 1 }) : R(x0, y - 11, px(v) - x0, 22, { fill: C.lean, rx: 1 });
      b += T(px(v) + 10, y + 8, `${v} g`, { st: 'num', size: F.value, fill: supp ? C.ink : C.lean });
    });
    b += T(M, 462, 'Richtwert: mindestens 30 g am Tag', { st: 'strong', size: F.small });
    for (let k = 0; k < 30; k++) b += R(M + k * 26, 474, 21, 21, k < 3 ? { stroke: C.ink, sw: 1.6, fill: C.bg2, rx: 2, mark: false } : { fill: C.lean, rx: 2, mark: false });
    b += T(M + 30 * 26 + 14, 490, 'die 3 g Glucomannan: ein Zehntel', { size: F.small, fill: C.ink2 });
    b += P(M, 524, `1 Kästchen = 1 g; Werte aus dem Bundeslebensmittelschlüssel, gerundet. Die Angabe zu Glucomannan gilt für 3${NB}g am Tag in drei Portionen zu je 1${NB}g mit ein bis zwei Gläsern Wasser vor den Mahlzeiten, bei kalorienarmer Ernährung; nie ohne reichlich Wasser (Erstickungsgefahr).`, { size: F.small, fill: C.ink3, lh: 19 }).svg;
    add(
      'ballaststoffe-portionen.svg',
      {
        title: 'Ballaststoffe: was eine Portion liefert',
        subtitle: 'Ungefähre Werte je Portion, dazu die Tagesmenge der zugelassenen Angabe für Glucomannan',
        source: 'Bundeslebensmittelschlüssel (BLS 3.02), gerundet; DGE, Richtwert Ballaststoffe; EU-Register zugelassener Angaben',
        alt: 'Balkendiagramm der Ballaststoffe je Portion: Linsen gekocht 150 Gramm etwa 8 Gramm, Vollkornbrot 2 Scheiben etwa 8 Gramm, Himbeeren 125 Gramm etwa 6 Gramm, Brokkoli gegart 200 Gramm etwa 6 Gramm, Haferflocken 50 Gramm etwa 5 Gramm, Leinsamen 1 Esslöffel etwa 4 Gramm, Glucomannan als Tagesmenge laut zugelassener Angabe 3 Gramm. Richtwert mindestens 30 Gramm am Tag; die 3 Gramm Glucomannan sind ein Zehntel davon. Die Angabe zu Glucomannan gilt für drei Portionen zu je 1 Gramm mit ein bis zwei Gläsern Wasser vor den Mahlzeiten bei kalorienarmer Ernährung; nie ohne reichlich Wasser einnehmen (Erstickungsgefahr).',
      },
      b,
    );
  }

  return figures;
}
