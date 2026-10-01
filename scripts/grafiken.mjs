#!/usr/bin/env node
/**
 * Erzeugt die Studien-Grafiken unter public/grafiken/*.svg.
 *
 * Alle Zahlen stammen aus src/data/sources.ts bzw. src/data/studien.ts (Quellen-IDs in den Kommentaren) oder aus
 * src/data/markt/preise.json (Preisgrafik, Stand aus der Datei). Aufruf: `npm run grafiken`. Die SVGs sind reine
 * Dateien ohne Skripte, laufen ohne Webfonts (system-ui) und tragen Titel, Quelle und Domain im Bild, damit sie
 * zitierfähig bleiben. Die Liste `figures` wird auch von src/data/grafiken.ts gespiegelt (Seite /grafiken/).
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const OUT = resolve('public/grafiken');
mkdirSync(OUT, { recursive: true });
const preise = JSON.parse(readFileSync(resolve('src/data/markt/preise.json'), 'utf8'));

/* Farben = Theme d1 aus src/styles/global.css (html[data-theme="d1"]): Grafiken sehen aus wie Karten der Website. */
const C = {
  paper: '#ffffff', // Kartenweiß
  ink: '#1a1a1a',
  ink2: '#4b4b4b',
  ink3: '#6f6f6f',
  line: '#dedbd4',
  moss: '#4f6b57',
  mossLight: '#e3eae4',
  clay: '#a35f4d',
  clayLight: '#f3e4df',
  amber: '#c27a4a',
  sand: '#edebe6', // paper-2: Flächen in Karten
};
/* Schrift wie im Theme d1 (Hanken Grotesk). Die PNG-Fassungen werden mit der eingebetteten Schrift gerendert; die SVG-Dateien
 * fallen beim Betrachter ohne diese Schrift auf system-ui zurück. */
const FONT = "'Hanken Grotesk Variable', 'Hanken Grotesk', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const W = 1200;
const H = 675;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const de = (n, d = 1) => n.toFixed(d).replace('-', '−').replace('.', ',');
const text = (x, y, s, { size = 18, weight = 400, fill = C.ink, anchor = 'start', extra = '' } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" ${extra}>${esc(s)}</text>`;
const fmtDate = (iso) => {
  const [y, m, d] = iso.split('-');
  return `${Number(d)}. ${['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][Number(m) - 1]} ${y}`;
};

function frame({ title, subtitle, source, alt, body }) {
  // Quellenzeile links, Domain rechts: bei langen Quellen kleiner, damit sich beides nie überlagert
  const srcSize = source.length > 100 ? 12.5 : source.length > 85 ? 13.5 : 15;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d" font-family="${FONT}">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(alt)}</desc>
<rect width="${W}" height="${H}" fill="${C.paper}"/>
${text(56, 62, title, { size: 32, weight: 700 })}
${text(56, 98, subtitle, { size: 19, fill: C.ink2 })}
${body}
<line x1="56" y1="${H - 52}" x2="${W - 56}" y2="${H - 52}" stroke="${C.line}" stroke-width="1"/>
${text(56, H - 24, `Quelle: ${source}`, { size: srcSize, fill: C.ink3 })}
${text(W - 56, H - 24, 'nachderspritze.de', { size: 15, weight: 600, fill: C.moss, anchor: 'end' })}
</svg>
`;
}

const figures = [];

/* 1. Absetzkurve STEP-1-Verlängerung (wilding2022ext) */
{
  const px = (w) => 120 + (w / 120) * 980;
  const py = (p) => 170 + (-p / 20) * 380;
  const sema = [[0, 0], [68, -17.3], [120, -5.6]];
  const plac = [[0, 0], [68, -2.0], [120, -0.1]];
  const path = (pts) => pts.map(([w, p], i) => `${i ? 'L' : 'M'}${px(w)} ${py(p)}`).join(' ');
  let body = '';
  body += `<rect x="${px(0)}" y="160" width="${px(68) - px(0)}" height="400" fill="${C.mossLight}" opacity="0.45"/>`;
  body += text((px(0) + px(68)) / 2, 150, 'Behandlung: 68 Wochen', { size: 16, weight: 600, fill: C.moss, anchor: 'middle' });
  body += text((px(68) + px(120)) / 2, 150, 'Ohne Medikament: 52 Wochen', { size: 16, weight: 600, fill: C.clay, anchor: 'middle' });
  for (const p of [0, -5, -10, -15, -20]) {
    body += `<line x1="${px(0)}" y1="${py(p)}" x2="${px(120)}" y2="${py(p)}" stroke="${C.line}" stroke-width="1"/>`;
    body += text(px(0) - 12, py(p) + 6, `${de(p, 0)} %`, { size: 15, fill: C.ink3, anchor: 'end' });
  }
  for (const w of [0, 20, 40, 68, 80, 100, 120]) {
    body += `<line x1="${px(w)}" y1="${py(0)}" x2="${px(w)}" y2="${py(-20) + 6}" stroke="${C.line}" stroke-width="1"/>`;
    body += text(px(w), py(-20) + 28, `Woche ${w}`, { size: 14, fill: C.ink3, anchor: 'middle' });
  }
  body += `<path d="${path(plac)}" fill="none" stroke="${C.clay}" stroke-width="4" stroke-linejoin="round"/>`;
  body += `<path d="${path(sema)}" fill="none" stroke="${C.moss}" stroke-width="5" stroke-linejoin="round"/>`;
  for (const [w, p] of sema) body += `<circle cx="${px(w)}" cy="${py(p)}" r="7" fill="${C.moss}" stroke="${C.paper}" stroke-width="3"/>`;
  for (const [w, p] of plac) body += `<circle cx="${px(w)}" cy="${py(p)}" r="6" fill="${C.clay}" stroke="${C.paper}" stroke-width="3"/>`;
  body += text(px(68) - 14, py(-17.3) + 30, '−17,3 %', { size: 20, weight: 700, fill: C.moss, anchor: 'end' });
  body += text(px(120) + 10, py(-5.6) + 7, '−5,6 %', { size: 20, weight: 700, fill: C.moss });
  body += text(px(68) + 10, py(-2.0) + 24, 'Placebo −2,0 %', { size: 15, weight: 600, fill: C.clay });
  body += text(px(120) + 10, py(-0.1) - 10, '−0,1 %', { size: 15, weight: 600, fill: C.clay });
  body += text(px(101), py(-14.0), 'Ein Jahr ohne Medikament:', { size: 17, weight: 700, anchor: 'middle' });
  body += text(px(101), py(-15.3), 'zwei Drittel des Verlusts wieder da', { size: 17, weight: 700, anchor: 'middle' });
  body += text(px(101), py(-16.6), '(+11,6 Prozentpunkte)', { size: 16, fill: C.ink2, anchor: 'middle' });
  body += text(56, 128, 'Semaglutid 2,4 mg (STEP-1-Verlängerung) gegenüber Placebo; Messpunkte Woche 0, 68 und 120, Verbindungslinien schematisch', { size: 14, fill: C.ink3 });
  figures.push({
    file: 'absetzkurve-step-1.svg',
    svg: frame({
      title: 'Gewicht nach dem Absetzen der Abnehmspritze',
      subtitle: 'Mittlere Gewichtsänderung gegenüber dem Start: 68 Wochen Semaglutid, danach 52 Wochen ohne Medikament',
      source: 'Wilding et al., STEP 1 trial extension, Diabetes Obes Metab 2022;24(8):1553–1564',
      alt: 'Liniendiagramm: Unter Semaglutid 2,4 mg sinkt das Gewicht in 68 Wochen im Mittel um 17,3 Prozent, unter Placebo um 2,0 Prozent. In den 52 Wochen nach dem Absetzen steigt es wieder; nach insgesamt 120 Wochen liegt es bei minus 5,6 Prozent (Semaglutid) und minus 0,1 Prozent (Placebo). Zwei Drittel des Verlusts sind nach einem Jahr ohne Medikament wieder da.',
      body,
    }),
  });
}

/* 1b. Alternative: Säulen „verloren, zurück, bleibt“ (wilding2022ext) */
{
  const py = (p) => 200 + (-p / 20) * 340;
  const col = (x, w) => `x="${x}" width="${w}"`;
  let body = '';
  for (const p of [0, -5, -10, -15, -20]) {
    body += `<line x1="200" y1="${py(p)}" x2="1140" y2="${py(p)}" stroke="${C.line}" stroke-width="1"/>`;
    body += text(188, py(p) + 5, `${de(p, 0)} %`, { size: 15, fill: C.ink3, anchor: 'end' });
  }
  // Säule 1: nach 68 Wochen
  body += `<rect ${col(300, 220)} y="${py(0)}" height="${py(-17.3) - py(0)}" rx="8" fill="${C.moss}"/>`;
  body += text(410, py(-17.3) + 34, '−17,3 % verloren', { size: 20, weight: 700, fill: C.moss, anchor: 'middle' });
  body += text(410, 590, 'Nach 68 Wochen Semaglutid', { size: 18, weight: 700, anchor: 'middle' });
  // Säule 2: nach 120 Wochen
  body += `<rect ${col(760, 220)} y="${py(0)}" height="${py(-5.6) - py(0)}" rx="8" fill="${C.moss}"/>`;
  body += `<rect ${col(760, 220)} y="${py(-5.6)}" height="${py(-17.3) - py(-5.6)}" rx="8" fill="${C.clay}" opacity="0.85"/>`;
  body += text(870, py(-2.8) + 7, '−5,6 % bleibt', { size: 19, weight: 700, fill: C.paper, anchor: 'middle' });
  body += text(870, py(-11.5) - 4, '+11,6 Punkte', { size: 19, weight: 700, fill: C.paper, anchor: 'middle' });
  body += text(870, py(-11.5) + 20, 'wieder zurück', { size: 17, fill: C.paper, anchor: 'middle' });
  body += text(870, 590, 'Ein Jahr nach dem Absetzen', { size: 18, weight: 700, anchor: 'middle' });
  body += text(870, 614, '(Woche 120, ohne Medikament)', { size: 14, fill: C.ink3, anchor: 'middle' });
  body += text(410, 614, '(Woche 68, Ende der Behandlung)', { size: 14, fill: C.ink3, anchor: 'middle' });
  // Klammer
  body += `<path d="M560 ${py(-17.3)} L600 ${py(-17.3)} L600 ${py(-5.6)} L560 ${py(-5.6)}" fill="none" stroke="${C.ink3}" stroke-width="1.5"/>`;
  body += text(585, (py(-17.3) + py(-5.6)) / 2 - 6, 'zwei', { size: 15, fill: C.ink2, anchor: 'middle' });
  body += text(585, (py(-17.3) + py(-5.6)) / 2 + 14, 'Drittel', { size: 15, fill: C.ink2, anchor: 'middle' });
  body += text(56, 140, 'Mittlere Gewichtsänderung gegenüber dem Start, Semaglutid-Gruppe der STEP-1-Verlängerung', { size: 14, fill: C.ink3 });
  figures.push({
    file: 'absetzkurve-step-1-saeulen.svg',
    svg: frame({
      title: 'Was nach dem Absetzen bleibt: ein Drittel',
      subtitle: 'STEP-1-Verlängerung: 68 Wochen Semaglutid, danach 52 Wochen ohne Medikament',
      source: 'Wilding et al., STEP 1 trial extension, Diabetes Obes Metab 2022;24(8):1553–1564',
      alt: 'Zwei Säulen: Nach 68 Wochen Semaglutid sind im Mittel 17,3 Prozent des Gewichts verloren. Ein Jahr nach dem Absetzen sind 11,6 Prozentpunkte wieder zurück, 5,6 Prozent bleiben; das entspricht zwei Dritteln des Verlusts, die zurückkommen.',
      body,
    }),
  });
}

/* 1c. Alternative: Drei Zahlen (wilding2022ext) */
{
  let body = '';
  const card = (x, big, l1, l2, color) => {
    let s = `<rect x="${x}" y="200" width="320" height="260" rx="16" fill="${C.sand}"/>`;
    s += text(x + 160, 310, big, { size: 64, weight: 700, fill: color, anchor: 'middle' });
    s += text(x + 160, 370, l1, { size: 19, weight: 600, anchor: 'middle' });
    s += text(x + 160, 400, l2, { size: 16, fill: C.ink2, anchor: 'middle' });
    return s;
  };
  body += card(56, '−17,3 %', 'nach 68 Wochen', 'Semaglutid 2,4 mg', C.moss);
  body += `<polygon points="392,330 430,310 430,350" fill="${C.ink3}"/>`;
  body += card(440, '−5,6 %', 'ein Jahr später', 'ohne Medikament', C.moss);
  body += `<polygon points="776,330 814,310 814,350" fill="${C.ink3}"/>`;
  body += card(824, '⅔', 'des Verlusts zurück', 'in 52 Wochen', C.clay);
  body += text(56, 520, 'Placebo-Gruppe zum Vergleich: −2,0 % nach 68 Wochen, −0,1 % nach 120 Wochen.', { size: 17, fill: C.ink2 });
  body += text(56, 550, 'Mittelwerte; die Streuung zwischen einzelnen Menschen ist groß.', { size: 15, fill: C.ink3 });
  figures.push({
    file: 'absetzkurve-step-1-kompakt.svg',
    svg: frame({
      title: 'Die Absetzkurve in drei Zahlen',
      subtitle: 'Was die STEP-1-Verlängerung über das Jahr nach der letzten Dosis zeigt',
      source: 'Wilding et al., STEP 1 trial extension, Diabetes Obes Metab 2022;24(8):1553–1564',
      alt: 'Drei Kennzahlen aus der STEP-1-Verlängerung: minus 17,3 Prozent Gewicht nach 68 Wochen Semaglutid, minus 5,6 Prozent ein Jahr nach dem Absetzen, zwei Drittel des Verlusts in 52 Wochen zurück. Placebo: minus 2,0 und minus 0,1 Prozent.',
      body,
    }),
  });
}

/* 2. Zeitachse (fachinfoWegovy, fachinfoMounjaro, wu2025) */
{
  const px = (w) => 330 + (w / 20) * 790;
  const rows = [
    { y: 190, label: 'Wirkstoff im Körper', from: 0, to: 7, color: C.moss, note: 'nach etwa fünf Halbwertszeiten weitgehend abgebaut (Semaglutid ≈ 1 Woche, Tirzepatid ≈ 5 Tage)', fade: true },
    { y: 290, label: 'Appetit kommt zurück', from: 2, to: 5, color: C.clay, note: 'Woche 2 bis 5, mit sinkendem Wirkstoffspiegel; bleibt danach', tail: 20 },
    { y: 390, label: 'Zunahme messbar', from: 8, to: 20, color: C.clay, note: 'ab Woche 8 signifikant, Anstieg bis etwa Woche 20 (Meta-Analyse randomisierter Studien)', arrow: true },
    { y: 490, label: 'Kontrolltermin', from: 8, to: 12, color: C.ink3, note: 'Empfehlung im Artikel: 8 bis 12 Wochen nach der letzten Dosis, wenn die Zunahme beginnt', thin: true },
  ];
  let body = '';
  for (const w of [0, 4, 8, 12, 16, 20]) {
    body += `<line x1="${px(w)}" y1="150" x2="${px(w)}" y2="540" stroke="${C.line}" stroke-width="1"/>`;
    body += text(px(w), 142, `Woche ${w}`, { size: 14, fill: C.ink3, anchor: 'middle' });
  }
  body += `<defs><linearGradient id="fade" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${C.moss}"/><stop offset="1" stop-color="${C.moss}" stop-opacity="0.08"/></linearGradient></defs>`;
  for (const r of rows) {
    body += text(56, r.y + 8, r.label, { size: 20, weight: 700 });
    if (r.tail) body += `<rect x="${px(r.to)}" y="${r.y - 14}" width="${px(r.tail) - px(r.to)}" height="28" rx="6" fill="${r.color}" opacity="0.18"/>`;
    const h = r.thin ? 14 : 28;
    body += `<rect x="${px(r.from)}" y="${r.y - h / 2}" width="${px(r.to) - px(r.from)}" height="${h}" rx="6" fill="${r.fade ? 'url(#fade)' : r.color}"/>`;
    if (r.arrow) body += `<polygon points="${px(r.to)},${r.y - 22} ${px(r.to) + 18},${r.y} ${px(r.to)},${r.y + 22}" fill="${r.color}"/>`;
    body += text(px(0), r.y + 44, r.note, { size: 15, fill: C.ink2 });
  }
  figures.push({
    file: 'zeitachse-nach-letzter-dosis.svg',
    svg: frame({
      title: 'Die ersten 20 Wochen nach der letzten Dosis',
      subtitle: 'Was aus Pharmakologie und Studien ableitbar ist; der individuelle Verlauf weicht ab',
      source: 'Fachinformationen Wegovy und Mounjaro (EMA); Wu et al., Meta-Analyse, BMC Medicine 2025',
      alt: 'Zeitachse über 20 Wochen nach der letzten Dosis einer Abnehmspritze: Der Wirkstoff ist nach etwa fünf bis sieben Wochen weitgehend abgebaut, der Appetit kehrt ab Woche 2 bis 5 zurück, die Gewichtszunahme ist ab Woche 8 messbar und steigt bis etwa Woche 20. Ein Kontrolltermin 8 bis 12 Wochen nach der letzten Dosis ist markiert.',
      body,
    }),
  });
}

/* 2b. Alternative: vier Phasen als Karten */
{
  const phases = [
    { t: 'Woche 1 bis 2', h: ['Noch wenig', 'Veränderung'], d: ['Genug Wirkstoff im Körper;', 'viele merken keinen', 'Unterschied.'], c: C.moss },
    { t: 'Woche 2 bis 5', h: ['Der Appetit', 'kommt zurück'], d: ['Wirkstoffspiegel sinkt, der', 'Magen arbeitet schneller,', 'Sättigung kommt später.'], c: C.clay },
    { t: 'Woche 5 bis 8', h: ['Wirkstoff', 'praktisch weg'], d: ['Nach etwa fünf', 'Halbwertszeiten weitgehend', 'abgebaut.'], c: C.ink3 },
    { t: 'Ab Woche 8', h: ['Zunahme', 'messbar'], d: ['In Studien ab Woche 8', 'signifikant, Anstieg bis', 'etwa Woche 20.'], c: C.clay },
  ];
  let body = '';
  phases.forEach((p, i) => {
    const x = 56 + i * 274;
    body += `<rect x="${x}" y="160" width="250" height="300" rx="14" fill="${C.sand}"/>`;
    body += `<rect x="${x}" y="160" width="250" height="10" rx="5" fill="${p.c}"/>`;
    body += text(x + 20, 205, p.t, { size: 16, weight: 600, fill: p.c });
    p.h.forEach((line, j) => (body += text(x + 20, 245 + j * 27, line, { size: 20, weight: 700 })));
    p.d.forEach((line, j) => (body += text(x + 20, 318 + j * 23, line, { size: 14, fill: C.ink2 })));
    if (i < 3) body += `<polygon points="${x + 256},300 ${x + 270},310 ${x + 256},320" fill="${C.ink3}"/>`;
  });
  body += text(56, 510, 'Halbwertszeiten laut Fachinformation (Semaglutid etwa eine Woche, Tirzepatid etwa fünf Tage); Zunahme laut Meta-Analyse randomisierter Studien.', { size: 15, fill: C.ink3 });
  figures.push({
    file: 'zeitachse-phasen.svg',
    svg: frame({
      title: 'Nach der letzten Dosis: vier Phasen',
      subtitle: 'Der typische Verlauf, wie er aus Pharmakologie und Studien ableitbar ist',
      source: 'Fachinformationen Wegovy und Mounjaro (EMA); Wu et al., Meta-Analyse, BMC Medicine 2025',
      alt: 'Vier Phasen nach der letzten Dosis einer Abnehmspritze: Woche 1 bis 2 noch wenig Veränderung, Woche 2 bis 5 kehrt der Appetit zurück, Woche 5 bis 8 ist der Wirkstoff praktisch abgebaut, ab Woche 8 ist die Gewichtszunahme messbar und steigt bis etwa Woche 20.',
      body,
    }),
  });
}

/* 3. Körperzusammensetzung (wilding2021dxa; who2020; leidy2015) */
{
  let body = '';
  const x0 = 56, w = 1088, y = 230, h = 110;
  const fat = Math.round(w * 0.6);
  body += `<rect x="${x0}" y="${y}" width="${fat}" height="${h}" rx="10" fill="${C.moss}"/>`;
  body += `<rect x="${x0 + fat}" y="${y}" width="${w - fat}" height="${h}" rx="10" fill="${C.clay}"/>`;
  body += `<rect x="${x0 + fat - 10}" y="${y}" width="20" height="${h}" fill="${C.clay}"/>`;
  body += `<rect x="${x0 + fat - 10}" y="${y}" width="10" height="${h}" fill="${C.moss}"/>`;
  body += text(x0 + fat / 2, y + 48, 'rund 60 %', { size: 30, weight: 700, fill: C.paper, anchor: 'middle' });
  body += text(x0 + fat / 2, y + 82, 'Fettmasse', { size: 20, fill: C.paper, anchor: 'middle' });
  body += text(x0 + fat + (w - fat) / 2, y + 48, 'rund 40 %', { size: 30, weight: 700, fill: C.paper, anchor: 'middle' });
  body += text(x0 + fat + (w - fat) / 2, y + 82, 'fettfreie Masse', { size: 20, fill: C.paper, anchor: 'middle' });
  body += text(x0, 400, 'Fettfreie Masse heißt: Muskeln, Organe, Knochen, Wasser. Ein Teil davon ist Muskel, und der fehlt nach dem Absetzen.', { size: 18 });
  body += text(x0, 434, 'Was den Anteil klein hält, ist belegt: Krafttraining an mindestens zwei Tagen pro Woche', { size: 18 });
  body += text(x0, 464, 'und 1,2 bis 1,6 g Protein pro kg Körpergewicht am Tag.', { size: 18 });
  body += text(x0, 512, 'DXA-Substudie mit 140 Teilnehmenden, exploratorische Analyse; Anteile gerundet.', { size: 15, fill: C.ink3 });
  figures.push({
    file: 'koerperzusammensetzung-step-1.svg',
    svg: frame({
      title: 'Was beim Abnehmen mit Semaglutid verloren geht',
      subtitle: 'Anteil am Gewichtsverlust nach 68 Wochen, STEP-1-Substudie mit DXA-Messung',
      source: 'Wilding et al., STEP 1 body composition, J Endocr Soc 2021;5(Suppl 1):A16–A17; WHO 2020; Leidy et al. 2015',
      alt: 'Balken, der den Gewichtsverlust unter Semaglutid aufteilt: rund 60 Prozent Fettmasse und rund 40 Prozent fettfreie Masse, also Muskeln, Organe, Knochen und Wasser. Krafttraining und 1,2 bis 1,6 Gramm Protein pro Kilogramm halten den Anteil klein.',
      body,
    }),
  });
}

/* 4. S-LiTE (jensen2024) */
{
  let body = '';
  const base = 470, scale = 40;
  const bar = (x, kg, color, label, sub) => {
    const hgt = kg * scale;
    let s = kg > 0
      ? `<rect x="${x}" y="${base - hgt}" width="220" height="${hgt}" rx="8" fill="${color}"/>`
      : `<rect x="${x}" y="${base - 6}" width="220" height="6" rx="3" fill="${color}"/>`;
    s += text(x + 110, base - hgt - 16, kg > 0 ? `+${de(kg)} kg mehr` : 'Gewicht gehalten', { size: 24, weight: 700, fill: color, anchor: 'middle' });
    s += text(x + 110, base + 34, label, { size: 19, weight: 700, anchor: 'middle' });
    s += text(x + 110, base + 60, sub, { size: 15, fill: C.ink2, anchor: 'middle' });
    return s;
  };
  body += `<line x1="140" y1="${base}" x2="1060" y2="${base}" stroke="${C.ink3}" stroke-width="1.5"/>`;
  body += bar(260, 0, C.moss, 'Mit Trainingsprogramm', 'Gewicht und Körperzusammensetzung gehalten');
  body += bar(720, 6.0, C.clay, 'Liraglutid allein', 'Zunahme 6,0 kg höher als nach Training');
  body += text(56, 150, 'Ein Jahr nach dem Ende der Behandlung, nach vorherigem Gewichtsverlust durch eine kalorienarme Diät und 52 Wochen Therapie', { size: 15, fill: C.ink3 });
  figures.push({
    file: 'training-s-lite.svg',
    svg: frame({
      title: 'Training entscheidet, was nach dem Absetzen bleibt',
      subtitle: 'S-LiTE-Nachbeobachtung: Zunahme ein Jahr nach Therapieende, Unterschied zur Trainingsgruppe',
      source: 'Jensen et al., S-LiTE follow-up, eClinicalMedicine 2024',
      alt: 'Balkendiagramm aus der S-LiTE-Nachbeobachtung: Teilnehmende mit Trainingsprogramm hielten ein Jahr nach Therapieende Gewicht und Körperzusammensetzung. Nach Liraglutid allein lag die Zunahme 6,0 Kilogramm höher als nach Training.',
      body,
    }),
  });
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
  const x0 = 380;
  const px = (p) => x0 + (-p / 22) * 740;
  let body = '';
  for (const p of [0, -5, -10, -15, -20]) {
    body += `<line x1="${px(p)}" y1="140" x2="${px(p)}" y2="560" stroke="${C.line}" stroke-width="1"/>`;
    body += text(px(p), 132, `${de(p, 0)} %`, { size: 14, fill: C.ink3, anchor: 'middle' });
  }
  rows.forEach((r, i) => {
    const y = 160 + i * 82;
    body += text(56, y + 22, r.name, { size: 20, weight: 700 });
    body += text(56, y + 46, r.sub, { size: 14, fill: C.ink3 });
    body += `<rect x="${x0}" y="${y}" width="${px(r.drug) - x0}" height="26" rx="5" fill="${C.moss}"/>`;
    body += text(px(r.drug) + 8, y + 19, `${de(r.drug)} %`, { size: 16, weight: 700, fill: C.moss });
    body += `<rect x="${x0}" y="${y + 32}" width="${px(r.plac) - x0}" height="18" rx="4" fill="${C.clay}"/>`;
    body += text(px(r.plac) + 8, y + 46, `Placebo ${de(r.plac)} %`, { size: 14, fill: C.clay });
  });
  body += text(56, 590, 'Verschiedene Studien mit verschiedenen Teilnehmenden und Laufzeiten; kein direkter Vergleich zwischen den Präparaten.', { size: 15, fill: C.ink3 });
  figures.push({
    file: 'wirksamkeit-zulassungsstudien.svg',
    svg: frame({
      title: 'Wie viel Gewicht in den Zulassungsstudien verloren ging',
      subtitle: 'Mittlere Änderung des Körpergewichts, Wirkstoff gegenüber Placebo',
      source: 'STEP 1 (NEJM 2021), OASIS 4 (NEJM 2025), OASIS 1 (Lancet 2023), SURMOUNT-1 (NEJM 2022), SCALE (NEJM 2015)',
      alt: 'Balkendiagramm der Zulassungsstudien: STEP 1 minus 14,9 Prozent gegenüber minus 2,4 Prozent unter Placebo; OASIS 4 minus 13,6 gegenüber minus 2,2; OASIS 1 minus 15,1 gegenüber minus 2,4; SURMOUNT-1 minus 20,9 gegenüber minus 3,1; SCALE minus 8,0 gegenüber minus 2,6 Prozent. Kein direkter Vergleich zwischen den Studien.',
      body,
    }),
  });
}

/* 6. Weiter oder Placebo (rubino2021, aronne2024) */
{
  const groups = [
    { name: 'STEP 4', sub: 'Semaglutid 2,4 mg, 48 Wochen nach dem Wechsel', cont: -7.9, plac: 6.9 },
    { name: 'SURMOUNT-4', sub: 'Tirzepatid, 52 Wochen nach dem Wechsel', cont: -5.5, plac: 14 },
  ];
  const y0 = 390;
  const py = (p) => y0 - p * 13;
  let body = '';
  for (const p of [-10, -5, 0, 5, 10, 15]) {
    body += `<line x1="200" y1="${py(p)}" x2="1140" y2="${py(p)}" stroke="${p === 0 ? C.ink3 : C.line}" stroke-width="${p === 0 ? 1.5 : 1}"/>`;
    body += text(188, py(p) + 5, `${p > 0 ? '+' : p < 0 ? '−' : ''}${Math.abs(p)} %`, { size: 14, fill: C.ink3, anchor: 'end' });
  }
  groups.forEach((g, i) => {
    const gx = 300 + i * 470;
    const bar = (x, p, color, label) => {
      const top = Math.min(py(0), py(p));
      const hgt = Math.abs(py(p) - py(0));
      let s = `<rect x="${x}" y="${top}" width="150" height="${hgt}" rx="6" fill="${color}"/>`;
      s += text(x + 75, p > 0 ? top - 12 : top + hgt + 26, `${p > 0 ? '+' : '−'}${String(Math.abs(p)).replace('.', ',')} %`, { size: 22, weight: 700, fill: color, anchor: 'middle' });
      s += text(x + 75, p > 0 ? top + hgt + 26 : top - 12, label, { size: 15, weight: 600, fill: C.ink2, anchor: 'middle' });
      return s;
    };
    body += bar(gx, g.cont, C.moss, 'Weiter behandelt');
    body += bar(gx + 190, g.plac, C.clay, 'Wechsel auf Placebo');
    body += text(gx + 170, 580, g.name, { size: 22, weight: 700, anchor: 'middle' });
    body += text(gx + 170, 604, g.sub, { size: 14, fill: C.ink3, anchor: 'middle' });
  });
  body += text(56, 140, 'Änderung des Körpergewichts ab dem Zeitpunkt des Wechsels; alle Teilnehmenden hatten davor mit dem Medikament abgenommen.', { size: 15, fill: C.ink3 });
  figures.push({
    file: 'weiter-oder-placebo.svg',
    svg: frame({
      title: 'Weiter behandeln oder absetzen: zwei randomisierte Studien',
      subtitle: 'Gewicht nach dem Wechsel auf Placebo gegenüber Fortführung',
      source: 'Rubino et al., STEP 4, JAMA 2021; Aronne et al., SURMOUNT-4, JAMA 2024',
      alt: 'Balkendiagramm: In STEP 4 nahmen Teilnehmende unter fortgeführtem Semaglutid in 48 Wochen weitere 7,9 Prozent ab, nach dem Wechsel auf Placebo nahmen sie 6,9 Prozent zu. In SURMOUNT-4 nahmen Teilnehmende unter fortgeführtem Tirzepatid in 52 Wochen weitere 5,5 Prozent ab, nach dem Wechsel auf Placebo nahmen sie 14 Prozent zu.',
      body,
    }),
  });
}

/* 7. Halbwertszeiten (fachinfoWegovy, fachinfoOzempic, fachinfoRybelsus, fachinfoMounjaro, fachinfoSaxenda) */
{
  const rows = [
    { name: 'Semaglutid', sub: ['Wegovy (Spritze und Tablette),', 'Ozempic, Rybelsus'], hl: 7, hlLabel: 'etwa 1 Woche', gone: 'etwa 5 Wochen' },
    { name: 'Tirzepatid', sub: ['Mounjaro'], hl: 5, hlLabel: 'etwa 5 Tage', gone: 'etwa 25 Tage' },
    { name: 'Liraglutid', sub: ['Saxenda'], hl: 13 / 24, hlLabel: 'etwa 13 Stunden', gone: 'etwa 3 Tage' },
  ];
  const x0 = 380;
  const px = (d) => x0 + (d / 40) * 740;
  let body = '';
  for (const d of [0, 7, 14, 21, 28, 35]) {
    body += `<line x1="${px(d)}" y1="150" x2="${px(d)}" y2="520" stroke="${C.line}" stroke-width="1"/>`;
    body += text(px(d), 142, d === 0 ? 'letzte Dosis' : `Tag ${d}`, { size: 14, fill: C.ink3, anchor: 'middle' });
  }
  rows.forEach((r, i) => {
    const y = 180 + i * 110;
    body += text(56, y + 20, r.name, { size: 22, weight: 700 });
    r.sub.forEach((line, j) => (body += text(56, y + 44 + j * 18, line, { size: 14, fill: C.ink3 })));
    body += `<rect x="${x0}" y="${y}" width="${Math.max(px(r.hl) - x0, 6)}" height="24" rx="5" fill="${C.moss}"/>`;
    body += text(px(r.hl) + 8, y + 18, `Halbwertszeit ${r.hlLabel}`, { size: 15, weight: 600, fill: C.moss });
    const breit = Math.max(px(r.hl * 5) - x0, 6);
    body += `<rect x="${x0}" y="${y + 32}" width="${breit}" height="24" rx="5" fill="${C.clayLight}" stroke="${C.clay}" stroke-width="1.5"/>`;
    // Beschriftung im Balken, wenn er breit genug ist; sonst rechts daneben (kurze Balken)
    if (breit > 380) body += text(x0 + breit - 10, y + 50, `weitgehend abgebaut nach ${r.gone}`, { size: 15, weight: 600, fill: C.clay, anchor: 'end' });
    else body += text(x0 + breit + 8, y + 50, `weitgehend abgebaut nach ${r.gone}`, { size: 15, weight: 600, fill: C.clay });
  });
  body += text(56, 560, 'Faustregel: Nach etwa fünf Halbwertszeiten ist ein Wirkstoff weitgehend abgebaut. Die Wirkung auf den Appetit lässt schon vorher spürbar nach.', { size: 15, fill: C.ink3 });
  figures.push({
    file: 'halbwertszeiten-praeparate.svg',
    svg: frame({
      title: 'Wie lange die Abnehmspritze nach der letzten Dosis nachwirkt',
      subtitle: 'Halbwertszeit laut Fachinformation und daraus abgeleitete Zeit bis zum weitgehenden Abbau',
      source: 'Fachinformationen Wegovy, Ozempic, Rybelsus, Mounjaro, Saxenda (EMA-Produktinformationen)',
      alt: 'Balkendiagramm der Halbwertszeiten: Semaglutid etwa eine Woche, weitgehend abgebaut nach etwa fünf Wochen; Tirzepatid etwa fünf Tage, abgebaut nach etwa 25 Tagen; Liraglutid etwa 13 Stunden, abgebaut nach etwa drei Tagen. Faustregel: fünf Halbwertszeiten.',
      body,
    }),
  });
}

/* 8. Warum der Körper gegenarbeitet (fachinfos, sumithran2011, fothergill2016, wilding2021dxa) */
{
  const cards = [
    { big: '5–7 Wochen', h: ['Die Appetitbremse', 'fällt weg'], d: ['Nach etwa fünf Halbwerts-', 'zeiten ist der Wirkstoff', 'weitgehend abgebaut.'], src: 'Fachinformationen (EMA)' },
    { big: 'Ghrelin ↑  Leptin ↓', h: ['Hungerhormone', 'bleiben verschoben'], d: ['Noch ein Jahr nach einer', 'Diät messbar: mehr Hunger,', 'weniger Sättigung.'], src: 'Sumithran et al., NEJM 2011' },
    { big: '6 Jahre', h: ['Weniger Energie', 'in Ruhe'], d: ['Der Ruheenergieverbrauch', 'blieb nach starkem Gewichts-', 'verlust abgesenkt.'], src: 'Fothergill et al., Obesity 2016' },
    { big: 'rund 40 %', h: ['Ein Teil des Verlusts', 'war Muskel'], d: ['des Gewichtsverlusts unter', 'Semaglutid entfielen auf', 'fettfreie Masse.'], src: 'STEP-1-DXA-Substudie 2021' },
  ];
  let body = '';
  cards.forEach((c, i) => {
    const x = 56 + i * 274;
    body += `<rect x="${x}" y="150" width="250" height="330" rx="14" fill="${C.sand}"/>`;
    body += text(x + 125, 212, c.big, { size: c.big.length > 12 ? 22 : 26, weight: 700, fill: i === 3 ? C.clay : C.moss, anchor: 'middle' });
    body += `<line x1="${x + 24}" y1="236" x2="${x + 226}" y2="236" stroke="${C.line}" stroke-width="1.5"/>`;
    c.h.forEach((line, j) => (body += text(x + 24, 272 + j * 24, line, { size: 18, weight: 700 })));
    c.d.forEach((line, j) => (body += text(x + 24, 340 + j * 22, line, { size: 13.5, fill: C.ink2 })));
    body += text(x + 24, 455, c.src, { size: 12, fill: C.ink3 });
  });
  body += text(56, 530, 'Vier Mechanismen, die zusammen den Jojo-Effekt erklären. Was dagegen belegt ist: Krafttraining, Protein, feste Mahlzeiten.', { size: 15, fill: C.ink3 });
  figures.push({
    file: 'warum-das-gewicht-zurueckkommt.svg',
    svg: frame({
      title: 'Warum das Gewicht nach dem Absetzen zurückkommt',
      subtitle: 'Vier belegte Mechanismen hinter dem Jojo-Effekt nach der Abnehmspritze',
      source: 'Fachinformationen (EMA); Sumithran et al. 2011; Fothergill et al. 2016; Wilding et al. 2021',
      alt: 'Vier Karten mit den Mechanismen des Jojo-Effekts nach der Abnehmspritze: Die Appetitbremse fällt nach fünf bis sieben Wochen weg; die Hungerhormone Ghrelin und Leptin bleiben noch ein Jahr nach einer Diät verschoben; der Ruheenergieverbrauch blieb in einer Studie sechs Jahre nach starkem Gewichtsverlust abgesenkt; rund 40 Prozent des Gewichtsverlusts unter Semaglutid entfielen auf fettfreie Masse.',
      body,
    }),
  });
}

/* 9. Proteinbedarf (leidy2015) */
{
  const kgs = [60, 70, 80, 90, 100];
  const x0 = 300;
  const px = (g) => x0 + (g / 200) * 800;
  let body = '';
  for (const g of [0, 50, 100, 150, 200]) {
    body += `<line x1="${px(g)}" y1="150" x2="${px(g)}" y2="470" stroke="${C.line}" stroke-width="1"/>`;
    body += text(px(g), 142, `${g} g`, { size: 14, fill: C.ink3, anchor: 'middle' });
  }
  kgs.forEach((kg, i) => {
    const y = 165 + i * 60;
    const lo = kg * 1.2, hi = kg * 1.6;
    body += text(56, y + 22, `${kg} kg`, { size: 20, weight: 700 });
    body += text(140, y + 22, 'Körpergewicht', { size: 14, fill: C.ink3 });
    body += `<rect x="${px(0)}" y="${y + 4}" width="${px(lo) - px(0)}" height="28" rx="6" fill="${C.mossLight}"/>`;
    body += `<rect x="${px(lo)}" y="${y + 4}" width="${px(hi) - px(lo)}" height="28" rx="6" fill="${C.moss}"/>`;
    body += text(px(hi) + 10, y + 24, `${Math.round(lo)} bis ${Math.round(hi)} g am Tag`, { size: 16, weight: 700, fill: C.moss });
  });
  body += text(56, 520, 'Empfehlung für Gewichtsabnahme und -erhalt: 1,2 bis 1,6 g Protein pro kg Körpergewicht und Tag.', { size: 17 });
  body += text(56, 550, 'Verteilt auf drei bis vier Mahlzeiten sind das 25 bis 35 g pro Mahlzeit; bei Nierenerkrankungen vorher ärztlich klären.', { size: 15, fill: C.ink3 });
  figures.push({
    file: 'proteinbedarf-nach-abnehmspritze.svg',
    svg: frame({
      title: 'Wie viel Protein nach der Abnehmspritze',
      subtitle: 'Tagesmenge nach Körpergewicht, Zielkorridor aus Übersichtsarbeiten',
      source: 'Leidy et al., Am J Clin Nutr 2015;101(6):1320S–1329S',
      alt: 'Balkendiagramm des Proteinbedarfs von 1,2 bis 1,6 Gramm pro Kilogramm Körpergewicht: bei 60 Kilogramm 72 bis 96 Gramm am Tag, bei 70 Kilogramm 84 bis 112, bei 80 Kilogramm 96 bis 128, bei 90 Kilogramm 108 bis 144, bei 100 Kilogramm 120 bis 160 Gramm. Verteilt auf drei bis vier Mahlzeiten sind das 25 bis 35 Gramm pro Mahlzeit.',
      body,
    }),
  });
}

/* 10. Preise im Monat (src/data/markt/preise.json) */
{
  const rows = preise.zeilen.map((z) => ({
    name: z.praeparat,
    eur: Number(String(z.monat).replace(/[^0-9]/g, '')),
    flag: /Anbieterangabe/.test(z.hinweis) ? '*' : '',
    kasse: /Kassenleistung/.test(z.hinweis),
  }));
  const x0 = 470;
  const max = 500;
  const px = (e) => x0 + (e / max) * 640;
  let body = '';
  for (const e of [0, 100, 200, 300, 400, 500]) {
    body += `<line x1="${px(e)}" y1="140" x2="${px(e)}" y2="${150 + rows.length * 36}" stroke="${C.line}" stroke-width="1"/>`;
    body += text(px(e), 132, `${e} €`, { size: 13, fill: C.ink3, anchor: 'middle' });
  }
  rows.forEach((r, i) => {
    const y = 150 + i * 36;
    // Lange Präparatenamen auf zwei Zeilen umbrechen (am letzten Komma oder vor der Klammer), damit nichts in die Balken läuft
    if (r.name.length > 40) {
      const cut = Math.max(r.name.lastIndexOf(', ', 40), r.name.lastIndexOf(' (', 40));
      const l1 = cut > 0 ? r.name.slice(0, cut + (r.name[cut] === ',' ? 1 : 0)) : r.name.slice(0, 40);
      const l2 = cut > 0 ? r.name.slice(cut + (r.name[cut] === ',' ? 2 : 1)) : r.name.slice(40);
      body += text(56, y + 12, l1, { size: 12.5, weight: 600 });
      body += text(56, y + 26, l2, { size: 12.5, weight: 600 });
    } else {
      body += text(56, y + 18, r.name, { size: 14, weight: 600 });
    }
    body += `<rect x="${x0}" y="${y + 2}" width="${px(r.eur) - x0}" height="24" rx="5" fill="${r.kasse ? C.mossLight : C.moss}" ${r.kasse ? `stroke="${C.moss}" stroke-width="1.5"` : ''}/>`;
    body += text(px(r.eur) + 8, y + 19, `ca. ${r.eur} €${r.flag}`, { size: 15, weight: 700, fill: C.moss });
  });
  body += text(56, 150 + rows.length * 36 + 30, '* Anbieterangabe, Prüfung gegen den Preisvergleich folgt. Heller Balken: bei Typ-2-Diabetes Kassenleistung. Preise gerundet auf 5 €, niedrigster Versandpreis.', { size: 13, fill: C.ink3 });
  figures.push({
    file: 'preise-im-monat.svg',
    svg: frame({
      title: 'Was Abnehmspritzen und die Tablette im Monat kosten',
      subtitle: `Apothekenverkaufspreise für Selbstzahler als Größenordnung, Stand ${fmtDate(preise.stand)}`,
      source: 'Preisvergleich medipreis.de (niedrigster Versandpreis); Tabletten laut Presseberichten zum Marktstart 01.09.2026',
      alt: `Balkendiagramm der monatlichen Selbstzahlerpreise, Stand ${fmtDate(preise.stand)}: ${rows.map((r) => `${r.name} ca. ${r.eur} Euro`).join('; ')}. Größenordnungen, gerundet auf 5 Euro; Ozempic bei Typ-2-Diabetes Kassenleistung.`,
      body,
    }),
  });
}

/* 11. Haarausfall nach schnellem Gewichtsverlust (malkud2015, leidy2015, almandoz2024) */
{
  const px = (m) => 300 + (m / 9) * 820;
  let body = '';
  for (const m of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    body += `<line x1="${px(m)}" y1="150" x2="${px(m)}" y2="440" stroke="${C.line}" stroke-width="1"/>`;
    body += text(px(m), 142, m === 0 ? 'Auslöser' : `Monat ${m}`, { size: 13, fill: C.ink3, anchor: 'middle' });
  }
  body += `<defs><linearGradient id="hair" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${C.clay}"/><stop offset="1" stop-color="${C.clay}" stop-opacity="0.15"/></linearGradient></defs>`;
  const row = (y, label) => text(56, y + 8, label, { size: 19, weight: 700 });
  body += row(190, 'Schnelle Abnahme');
  body += `<rect x="${px(0)}" y="176" width="${px(2) - px(0)}" height="28" rx="6" fill="${C.moss}"/>`;
  body += text(px(0), 232, 'Der Auslöser: Viele Haare wechseln gleichzeitig in die Ruhephase; sichtbar ist noch nichts', { size: 14, fill: C.ink2 });
  body += row(290, 'Haare fallen aus');
  body += `<rect x="${px(2)}" y="276" width="${px(6) - px(2)}" height="28" rx="6" fill="url(#hair)"/>`;
  body += text(px(0), 332, 'Beginn zwei bis drei Monate nach dem Auslöser, diffus über den ganzen Kopf, dann abklingend', { size: 14, fill: C.ink2 });
  body += row(390, 'Haare wachsen nach');
  body += `<rect x="${px(5)}" y="376" width="${px(9) - px(5)}" height="28" rx="6" fill="${C.mossLight}" stroke="${C.moss}" stroke-width="1.5"/>`;
  body += text(px(0), 432, 'Meist innerhalb von etwa sechs Monaten abgeklungen, wenn der Auslöser weggefallen ist; bis zur alten Länge dauert es länger', { size: 14, fill: C.ink2 });
  body += `<rect x="56" y="470" width="1088" height="110" rx="12" fill="${C.sand}"/>`;
  body += text(76, 502, 'Was sich beeinflussen lässt', { size: 16, weight: 700 });
  body += text(76, 530, 'Protein 1,2 bis 1,6 g pro kg Körpergewicht am Tag · Eisenwert (Ferritin) prüfen lassen · Zink und Biotin nur bei nachgewiesener Lücke', { size: 15, fill: C.ink2 });
  body += text(76, 558, 'Ärztlich abklären: länger als sechs Monate, fleckig, oder mit Müdigkeit und Frieren (Eisen, Schilddrüse)', { size: 15, fill: C.ink2 });
  figures.push({
    file: 'haarausfall-zeitverlauf.svg',
    svg: frame({
      title: 'Haarausfall nach schnellem Gewichtsverlust: der Verlauf',
      subtitle: 'Telogenes Effluvium: verzögert, diffus, vorübergehend; Zeitangaben in Monaten nach dem Auslöser',
      source: 'Malkud, J Clin Diagn Res 2015; Leidy et al., Am J Clin Nutr 2015; Almandoz et al., Obesity 2024',
      alt: 'Zeitachse des telogenen Effluviums: Nach schnellem Gewichtsverlust wechseln viele Haare in die Ruhephase, zwei bis drei Monate später beginnt diffuser Haarausfall, der in der Regel innerhalb von etwa sechs Monaten abklingt; danach wachsen die Haare nach. Beeinflussbar sind Protein, Eisenwert, Zink und Biotin bei Lücke; länger als sechs Monate, fleckig oder mit Müdigkeit ärztlich abklären.',
      body,
    }),
  });
}

/* 12. Abnehmpille: belegt und offen (wharton2025oasis4, fachinfoRybelsus, wilding2022ext) */
{
  let body = '';
  // linkes Panel
  body += `<rect x="56" y="140" width="530" height="440" rx="14" fill="${C.sand}"/>`;
  body += text(80, 178, 'Belegt: Gewichtsverlust unter der Tablette', { size: 19, weight: 700, fill: C.moss });
  body += text(80, 204, 'OASIS 4, Semaglutid 25 mg, 64 Wochen, 307 Teilnehmende ohne Diabetes', { size: 13, fill: C.ink3 });
  const base = 480, sc = 15;
  const bar = (x, p, color, label) => {
    const h = Math.abs(p) * sc;
    let s = `<rect x="${x}" y="${base - h}" width="150" height="${h}" rx="6" fill="${color}"/>`;
    s += text(x + 75, base - h - 12, `${de(p)} %`, { size: 22, weight: 700, fill: color, anchor: 'middle' });
    s += text(x + 75, base + 26, label, { size: 14, weight: 600, fill: C.ink2, anchor: 'middle' });
    return s;
  };
  body += `<line x1="80" y1="${base}" x2="560" y2="${base}" stroke="${C.ink3}" stroke-width="1.5"/>`;
  body += bar(130, 13.6, C.moss, 'Semaglutid-Tablette');
  body += bar(360, 2.2, C.clay, 'Placebo');
  body += text(80, 548, 'Bei durchgehender Einnahme: −16,6 %. Mittelwerte gegenüber dem Start.', { size: 13, fill: C.ink3 });
  // rechtes Panel
  body += `<rect x="614" y="140" width="530" height="440" rx="14" fill="${C.paper}" stroke="${C.clay}" stroke-width="2" stroke-dasharray="8 6"/>`;
  body += text(638, 178, 'Offen: Verlauf nach dem Absetzen der Tablette', { size: 19, weight: 700, fill: C.clay });
  body += text(638, 204, 'Stand Oktober 2026', { size: 13, fill: C.ink3 });
  body += text(879, 290, 'Keine Studie', { size: 40, weight: 700, fill: C.clay, anchor: 'middle' });
  body += text(879, 324, 'zur Wiederzunahme nach der Tablette', { size: 17, fill: C.ink2, anchor: 'middle' });
  body += `<line x1="660" y1="356" x2="1098" y2="356" stroke="${C.line}" stroke-width="1.5"/>`;
  body += text(638, 392, 'Was sich übertragen lässt, mit Vorbehalt:', { size: 15, weight: 700 });
  body += text(638, 420, '• gleicher Wirkstoff, Halbwertszeit etwa eine Woche wie bei der Spritze', { size: 14, fill: C.ink2 });
  body += text(638, 446, '• Spritze: zwei Drittel des Verlusts ein Jahr nach dem Absetzen zurück', { size: 14, fill: C.ink2 });
  body += text(638, 472, '  (STEP-1-Verlängerung, −17,3 % → −5,6 %)', { size: 14, fill: C.ink2 });
  body += text(638, 498, '• Zunahme in Spritzen-Studien ab Woche 8 messbar', { size: 14, fill: C.ink2 });
  body += text(638, 548, 'Jede Aussage zur Tablette nach dem Absetzen ist ein Übertrag, keine Messung.', { size: 13, fill: C.ink3 });
  figures.push({
    file: 'abnehmpille-belegt-und-offen.svg',
    svg: frame({
      title: 'Abnehmpille absetzen: was belegt ist und was fehlt',
      subtitle: 'Die Zulassungsstudie der Semaglutid-Tablette gegenüber der Datenlage für die Zeit danach',
      source: 'OASIS 4 (NEJM 2025); Fachinformation Rybelsus (EMA); STEP-1-Verlängerung (2022); Wu et al. (2025)',
      alt: 'Zwei Felder: Links die Zulassungsstudie OASIS 4 der Semaglutid-Tablette mit minus 13,6 Prozent Gewicht gegenüber minus 2,2 Prozent unter Placebo nach 64 Wochen, bei durchgehender Einnahme minus 16,6 Prozent. Rechts der offene Punkt: Es gibt keine Studie zur Wiederzunahme nach dem Absetzen der Tablette; übertragbar mit Vorbehalt sind die Halbwertszeit von etwa einer Woche und die Spritzen-Daten, nach denen zwei Drittel des Verlusts nach einem Jahr zurück sind.',
      body,
    }),
  });
}

for (const f of figures) {
  writeFileSync(resolve(OUT, f.file), f.svg);
  console.log('geschrieben:', `public/grafiken/${f.file}`);
}

/* PNG-Fassungen (1800 × 1013) für Bildersuche, Teilen und Download; Playwright wird wie in checkliste-pdf.mjs gesucht. */
async function loadPlaywright() {
  const candidates = [
    'playwright',
    process.env.PLAYWRIGHT_PATH,
    '/opt/node22/lib/node_modules/playwright/index.mjs',
    '/usr/lib/node_modules/playwright/index.mjs',
  ].filter(Boolean);
  for (const c of candidates) {
    try {
      return await import(c.startsWith('/') ? pathToFileURL(c).href : c);
    } catch {
      /* nächster Kandidat */
    }
  }
  throw new Error('Playwright nicht gefunden. `npm i -g playwright` oder PLAYWRIGHT_PATH setzen.');
}

try {
  const { chromium } = await loadPlaywright();
  const known = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].filter((p) => p && existsSync(p));
  let browser;
  try {
    browser = await chromium.launch();
  } catch (e) {
    if (!known[0]) throw e;
    browser = await chromium.launch({ executablePath: known[0] });
  }
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1.5 });
  const page = await ctx.newPage();
  // Website-Schrift (Hanken Grotesk, Theme d1) für die PNG-Fassungen einbetten
  const fontDir = resolve('node_modules/@fontsource-variable/hanken-grotesk/files');
  const fontCss = ['hanken-grotesk-latin-wght-normal.woff2', 'hanken-grotesk-latin-ext-wght-normal.woff2']
    .map((f) => resolve(fontDir, f))
    .filter((p) => existsSync(p))
    .map((p) => `@font-face{font-family:'Hanken Grotesk Variable';font-style:normal;font-weight:100 900;src:url(data:font/woff2;base64,${readFileSync(p).toString('base64')}) format('woff2')}`)
    .join('');
  if (!fontCss) console.warn('Hanken Grotesk nicht gefunden (node_modules/@fontsource-variable/hanken-grotesk); PNGs nutzen die Systemschrift.');
  for (const f of figures) {
    await page.setContent(`<!doctype html><html><head><style>${fontCss}body{margin:0}</style></head><body>${f.svg.replace(/^<\?xml[^>]*>\s*/, '')}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: resolve(OUT, f.file.replace('.svg', '.png')), clip: { x: 0, y: 0, width: W, height: H } });
  }
  await browser.close();
  console.log(`PNG-Fassungen erzeugt: ${figures.length}`);
} catch (e) {
  console.warn('PNG-Fassungen nicht erzeugt (Playwright oder Chromium fehlt):', e.message);
  console.warn('Die SVGs sind geschrieben; die PNGs bleiben auf dem alten Stand.');
}
