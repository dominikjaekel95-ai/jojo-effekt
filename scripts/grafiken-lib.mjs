/**
 * Bausteine für scripts/grafiken.mjs im Design „Kalk“: Farben mit fester Bedeutung, Mona Sans mit Breiten-Achse,
 * Textmaße (aus dem Browser gemessen, damit Titel passen und Absätze umbrechen), Rahmen mit Titel, Quelle und Domain.
 *
 * Farben (Bedeutung fest, gleiche Werte wie auf der Website):
 *   Tinte  = Gewicht, Medikament · Braun = Wiederzunahme · Grün = fettfreie Masse, Training, positiv
 *   Grau gepunktet = Placebo, Vergleich · Sand mit Kante = Fettmasse · Gelb nur als Markierung (nie Text auf Grund)
 */
export const C = {
  bg: '#EFEFEB',
  bg2: '#E5E5DF',
  white: '#FFFFFF',
  ink: '#141513',
  ink2: '#3F413C',
  ink3: '#5E605A',
  line: '#D3D4CD',
  regain: '#7A4718',
  lean: '#2E5944',
  placebo: '#878982',
  fat: '#B5A27C',
  fatEdge: '#6F6247',
  hl: '#E8CF55',
};

export const FONT = "'Mona Sans Variable', 'Mona Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
export const W = 1200;
export const H = 675;
/** Seitenrand links und rechts */
export const M = 64;

/** Schriftschnitte: Gewicht, Breite in %, Laufweite in em */
export const ST = {
  title: { w: 540, s: 116, ls: -0.02 },
  big: { w: 500, s: 125, ls: -0.025 },
  num: { w: 560, s: 118, ls: -0.01 },
  head: { w: 560, s: 108, ls: -0.005 },
  body: { w: 420, s: 100, ls: 0 },
  strong: { w: 580, s: 100, ls: 0 },
  axis: { w: 440, s: 100, ls: 0 },
  brand: { w: 600, s: 125, ls: -0.01 },
};

/** Zeichen, die in Mona Sans (latin, latin-ext) sicher vorhanden sind; alles andere fällt auf eine Ersatzschrift zurück */
export const CHARSET =
  " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~" +
  'ÄÖÜäöüßéèàáâçñóòôúùûíìîëïÉ€–—−„“”‚‘’…·×½°µ²³↑↓';

let METRICS = null;
export function setMetrics(m) {
  METRICS = m;
}

/** Breite eines Textes in px (gemessen je Zeichen, ohne Unterschneidung; reicht für Layout und Umbruch) */
export function tw(s, st = 'body', size = 16) {
  const S = ST[st];
  const str = String(s);
  let sum = 0;
  if (METRICS && METRICS[st]) {
    const m = METRICS[st];
    for (const ch of str) sum += m[ch] ?? m.n;
    sum = (sum * size) / 100;
  } else {
    sum = str.length * size * 0.56 * (S.s / 100);
  }
  // Zuschlag: gerendert läuft die Schrift in kleinen Größen gut 2 % breiter als die Messung bei 100 px
  return (sum + S.ls * size * [...str].length) * 1.03;
}

/** Feste Schriftstufen (px bei 1200 px Breite) */
export const F = { axis: 14, small: 14, text: 16, label: 18, value: 22, big: 30, bigger: 52, huge: 76 };
/** Fußlinie und unterste erlaubte Inhaltszeile (Mindestabstand zur Fußlinie) */
export const FY = 598;
export const BOTTOM = FY - 26;

/** Textboxen der aktuellen Grafik (für das Aussparen der Gitterlinien hinter Beschriftungen) */
const BOXES = [];
export const clearBoxes = () => (BOXES.length = 0);

/** Zeichen außerhalb des sicheren Satzes (werden beim Erzeugen gemeldet) */
export const unsafeChars = (s) => [...String(s)].filter((ch) => !CHARSET.includes(ch));

export const r = (n) => Math.round(n * 10) / 10;
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Dezimalzahl deutsch mit echtem Minuszeichen */
export const de = (n, d = 1) => `${n < 0 ? '−' : ''}${Math.abs(n).toFixed(d).replace('.', ',')}`;
/** mit Vorzeichen (+ / −) */
export const sg = (n, d = 1) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(d).replace('.', ',')}`;
/** Tausenderpunkt */
export const tsd = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Text. o: st (Schnitt), size, fill, anchor, w (Gewicht), inside (Beschriftung in einer Fläche), cls.
 * Keine Tabellenziffern: Mona Sans zeichnet die Null dort mit Schrägstrich („Ø“). */
export function T(x, y, s, o = {}) {
  const S = ST[o.st || 'body'];
  const size = o.size ?? 16;
  const style = `font-stretch:${S.s}%;letter-spacing:${S.ls}em`;
  const cls = [o.inside ? 'in' : '', o.cls || ''].filter(Boolean).join(' ');
  if (!o.inside) {
    const w = tw(s, o.st || 'body', size);
    const a = o.anchor ?? 'start';
    const x0 = a === 'start' ? x : a === 'end' ? x - w : x - w / 2;
    BOXES.push({ x0, x1: x0 + w, y0: y - size * 0.8, y1: y + size * 0.26 });
  }
  // Hof in Grundfarbe: Gitterlinien und Kurven laufen nicht durch die Schrift (nicht bei Text in Flächen oder auf Markierung)
  const halo = o.inside || o.halo === false ? '' : ` stroke="${C.bg}" stroke-width="${o.haloW ?? 5}" stroke-linejoin="round" paint-order="stroke"`;
  return `<text x="${r(x)}" y="${r(y)}" font-size="${size}" font-weight="${o.w ?? S.w}" fill="${o.fill ?? C.ink}" text-anchor="${o.anchor ?? 'start'}" style="${style}"${halo}${cls ? ` class="${cls}"` : ''}>${esc(s)}</text>`;
}

/** Greedy-Umbruch an Leerzeichen */
export function wrap(s, maxW, st = 'body', size = 16) {
  const words = String(s).split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (tw(test, st, size) <= maxW || !cur) cur = test;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Absatz mit Umbruch; gibt { svg, lines, bottom } zurück (bottom = Grundlinie der letzten Zeile) */
export function P(x, y, s, o = {}) {
  const size = o.size ?? 16;
  const lh = o.lh ?? Math.round(size * 1.4);
  const lines = wrap(s, o.maxW ?? W - 2 * M, o.st || 'body', size);
  const svg = lines.map((l, i) => T(x, y + i * lh, l, o)).join('');
  return { svg, lines, bottom: y + (lines.length - 1) * lh };
}

/** Größte Schriftgröße ≤ size, bei der s in maxW passt */
export function fit(s, maxW, st, size, min = 13) {
  let z = size;
  while (z > min && tw(s, st, z) > maxW) z -= 0.5;
  return z;
}


/* ---------- Formen ---------- */
/** Linie. o: c, w, dash, cap, g (Gitterlinie: wird hinter Beschriftungen ausgespart) */
export const L = (x1, y1, x2, y2, o = {}) =>
  `<line${o.g ? ' class="g"' : ''} x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${o.c ?? C.line}" stroke-width="${o.w ?? 1}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.cap ? ` stroke-linecap="${o.cap}"` : ''}/>`;

/** Rechteck (normiert negative Breiten/Höhen). o: fill, stroke, sw, dash, rx, mark (für die Überlappungsprüfung) */
export function R(x, y, w, h, o = {}) {
  if (w < 0) {
    x += w;
    w = -w;
  }
  if (h < 0) {
    y += h;
    h = -h;
  }
  const stroke = o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 1.5}"${o.dash ? ` stroke-dasharray="${o.dash}" stroke-linecap="round"` : ''}` : '';
  return `<rect${o.mark === false ? '' : ' class="mk"'} x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" rx="${o.rx ?? 2}" fill="${o.fill ?? 'none'}"${stroke}/>`;
}

export const PATH = (d, o = {}) =>
  `<path d="${d}" fill="${o.fill ?? 'none'}" stroke="${o.c ?? C.ink}" stroke-width="${o.w ?? 3}" stroke-linejoin="round" stroke-linecap="${o.cap ?? 'round'}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;

export const DOT = (x, y, rad = 5.5, fill = C.ink, o = {}) =>
  `<circle cx="${r(x)}" cy="${r(y)}" r="${rad}" fill="${fill}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 2.5}"` : ` stroke="${C.bg}" stroke-width="2"`}/>`;

/** Gepunktet heißt immer: Placebo/Vergleich (grau) oder unsicher/nicht signifikant/Spanne (in der Farbe der Reihe); ein Muster */
export const DOTS = '0.1 4.5';
/** gepunktete Linie für Placebo/Vergleich */
export const DOTTED = { c: C.placebo, w: 2.6, dash: '0.1 6.5', cap: 'round' };
/** gepunkteter Rand für Placebo-/Vergleichsbalken */
export const placeboBar = (x, y, w, h) => R(x, y, w, h, { fill: C.bg2, stroke: C.placebo, sw: 1.6, dash: DOTS });
/** gepunkteter Rand in einer Farbe (Spanne, unsicher, nicht signifikant) */
export const dottedBar = (x, y, w, h, c = C.ink) => R(x, y, w, h, { stroke: c, sw: 1.6, dash: DOTS });

/** Gelbe Markierung hinter einem Text (Textmarker-Band in der unteren Hälfte) */
export function HL(x, y, s, st, size, anchor = 'start') {
  const w = tw(s, st, size);
  const x0 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
  return `<rect x="${r(x0 - 5)}" y="${r(y - size * 0.5)}" width="${r(w + 10)}" height="${r(size * 0.62)}" rx="2" fill="${C.hl}"/>`;
}

/** Pfeilspitze nach rechts (statt Pfeilzeichen, die in der Schrift fehlen) */
export const ARROW_R = (x, y, color = C.ink, s = 9) => `<path d="M${r(x - s)} ${r(y - s)} L${r(x)} ${r(y)} L${r(x - s)} ${r(y + s)}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;

/** Senkrechte Klammer (eckig, ruhig) an x von y1 bis y2, Öffnung nach links */
export const BRACKET = (x, y1, y2, color = C.ink, tick = 8) =>
  `<path d="M${r(x - tick)} ${r(y1)} H${r(x)} V${r(y2)} H${r(x - tick)}" fill="none" stroke="${color}" stroke-width="1.6"/>`;

/** Legenden-Eintrag: Linie, gepunktete Linie, Fläche oder Punkt plus Text; gibt { svg, w } zurück */
export function legend(x, y, type, color, label, size = F.small) {
  let s = '';
  if (type === 'line') s += L(x, y - 5, x + 26, y - 5, { c: color, w: 3, cap: 'round' });
  if (type === 'dotted') s += L(x, y - 5, x + 26, y - 5, DOTTED);
  if (type === 'box') s += R(x, y - 13, 26, 14, { fill: color, mark: false });
  if (type === 'placebo') s += R(x, y - 13, 26, 14, { fill: C.bg2, stroke: C.placebo, sw: 1.6, dash: DOTS, mark: false });
  if (type === 'fat') s += R(x, y - 13, 26, 14, { fill: C.fat, stroke: C.fatEdge, sw: 1.2, mark: false });
  s += T(x + 34, y, label, { size, fill: C.ink2 });
  return { svg: s, w: 34 + tw(label, 'body', size) };
}

/** Legende rechtsbündig bis xr */
export function legendRow(xr, y, items, gap = 26) {
  const parts = items.map(([type, color, label]) => legend(-9999, -9999, type, color, label));
  clearBoxesFrom(parts.length);
  const total = parts.reduce((a, p) => a + p.w, 0) + gap * (parts.length - 1);
  let x = xr - total;
  let svg = '';
  for (const [type, color, label] of items) {
    const p = legend(x, y, type, color, label);
    svg += p.svg;
    x += p.w + gap;
  }
  return svg;
}
/** die letzten n registrierten Textboxen verwerfen (Messläufe) */
function clearBoxesFrom(n) {
  BOXES.splice(BOXES.length - n, n);
}

/** Horizontale Gitterlinien mit Beschriftung links */
export function gridY(vals, py, x1, x2, fmt, o = {}) {
  let s = '';
  for (const v of vals) {
    const zero = o.zero !== undefined && v === o.zero;
    s += L(x1, py(v), x2, py(v), zero ? { c: C.ink3, w: 1.2, g: true } : { g: true });
    s += T(x1 - (o.gap ?? 14), py(v) + 5, fmt(v), { st: 'axis', size: F.axis, fill: C.ink3, anchor: 'end' });
  }
  return s;
}

/** Senkrechte Gitterlinien mit Beschriftung oben oder unten */
export function gridX(vals, px, y1, y2, fmt, labelY, o = {}) {
  let s = '';
  for (const v of vals) {
    s += L(px(v), y1, px(v), y2, o.zero !== undefined && v === o.zero ? { c: C.ink3, w: 1.2, g: true } : { g: true });
    const lab = fmt(v);
    if (lab) s += T(px(v), labelY, lab, { st: 'axis', size: F.axis, fill: C.ink3, anchor: o.anchor ?? 'middle' });
  }
  return s;
}

/** Gitterlinien (class="g") hinter Beschriftungen aussparen: Linie in Teilstücke schneiden */
function knockout(body) {
  const pad = 4;
  return body.replace(/<line class="g" x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)"([^>]*)\/>/g, (m, a, b, c, d, rest) => {
    const [x1, y1, x2, y2] = [a, b, c, d].map(Number);
    const horiz = Math.abs(y1 - y2) < 0.01;
    const vert = Math.abs(x1 - x2) < 0.01;
    if (!horiz && !vert) return m;
    let segs = horiz ? [[Math.min(x1, x2), Math.max(x1, x2)]] : [[Math.min(y1, y2), Math.max(y1, y2)]];
    for (const bx of BOXES) {
      let cut;
      if (horiz && y1 >= bx.y0 - pad && y1 <= bx.y1 + pad) cut = [bx.x0 - pad, bx.x1 + pad];
      if (vert && x1 >= bx.x0 - pad && x1 <= bx.x1 + pad) cut = [bx.y0 - pad, bx.y1 + pad];
      if (!cut) continue;
      segs = segs.flatMap(([s0, s1]) => {
        if (cut[1] <= s0 || cut[0] >= s1) return [[s0, s1]];
        const out = [];
        if (cut[0] > s0) out.push([s0, cut[0]]);
        if (cut[1] < s1) out.push([cut[1], s1]);
        return out;
      });
    }
    return segs
      .filter(([s0, s1]) => s1 - s0 > 2)
      .map(([s0, s1]) => (horiz ? `<line class="g" x1="${r(s0)}" y1="${y1}" x2="${r(s1)}" y2="${y1}"${rest}/>` : `<line class="g" x1="${x1}" y1="${r(s0)}" x2="${x1}" y2="${r(s1)}"${rest}/>`))
      .join('');
  });
}

export const LIZENZ = 'Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe (CC BY 4.0)';

/** Rahmen: Titel, Untertitel, Inhalt, Fußlinie, Quelle, Lizenz, Domain */
export function frame({ file, title, subtitle, source, alt, body, warn = console.warn }) {
  const maxW = W - 2 * M;
  let ts = 34;
  while (ts > 26 && tw(title, 'title', ts) > maxW) ts -= 0.5;
  if (tw(title, 'title', ts) > maxW) warn(`${file}: Titel zu lang`);
  let ss = 18;
  while (ss > 16 && tw(subtitle, 'body', ss) > maxW) ss -= 0.5;
  const sub = wrap(subtitle, maxW, 'body', ss);
  if (sub.length > 1) warn(`${file}: Untertitel zweizeilig`);
  const brand = 'nachderspritze.de';
  const bw = tw(brand, 'brand', 15);
  const src = wrap(`Quelle: ${source}`, maxW - bw - 40, 'body', 14);
  if (src.length > 2) warn(`${file}: Quelle mehr als zwei Zeilen`);
  const lines = [...src, LIZENZ];
  const inner = knockout(body);
  clearBoxes();
  const head = T(M, 72, title, { st: 'title', size: ts }) + sub.map((l, i) => T(M, 106 + i * 22, l, { size: ss, fill: C.ink2 })).join('');
  const foot = lines.map((l, i) => T(M, FY + 24 + i * 19, l, { size: 14, fill: C.ink3, cls: 'ft' })).join('') + T(W - M, FY + 24, brand, { st: 'brand', size: 15, anchor: 'end', cls: 'ft' });
  clearBoxes();
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d" font-family="${esc(FONT)}">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(alt)}</desc>
<rect width="${W}" height="${H}" fill="${C.bg}"/>
${head}
${inner}
<line class="fy" x1="${M}" y1="${FY}" x2="${W - M}" y2="${FY}" stroke="${C.line}" stroke-width="1"/>
${foot}
</svg>
`;
}

/* ---------- Hochformat (1080 × 1350) für schmale Bildschirme ---------- */
/* Die Hochformat-Fassungen (grafiken-hoch.mjs, Dateien <id>-hoch.svg/.png) zeigen dieselben Daten wie die Hauptgrafik
 * und werden per <picture> unter 640 px Breite ausgeliefert. Am Handy steht das Bild etwa 360 px breit, also rund ein
 * Drittel der Pixelgröße: Grundtext 30 px (am Handy etwa 10 px), Fußzeile und Quellen 28 px. Die Prüfung in
 * grafiken.mjs meldet im Hochformat jede Schrift unter 28 px. */
export const WH = 1080;
export const HH = 1350;
export const FH = { foot: 28, small: 28, axis: 30, text: 30, label: 34, value: 44, big: 52, title: 50, sub: 28 };

/** Kopf und Fuß des Hochformats vorab setzen: Titel und Untertitel umbrechen, Quelle, Lizenzzeile und Domain im Fuß.
 * Gibt die Inhaltsfläche zurück: top (oberste Kante für Inhalt), bottom (tiefste Grundlinie), dazu FY (Fußlinie). */
export function rahmenHoch({ title, subtitle, source }) {
  const maxW = WH - 2 * M;
  const tl = wrap(title, maxW, 'title', FH.title);
  const tlh = Math.round(FH.title * 1.14);
  const ty = M + Math.round(FH.title * 0.74);
  const sl = wrap(subtitle, maxW, 'body', FH.sub);
  const slh = Math.round(FH.sub * 1.32);
  const sy = ty + (tl.length - 1) * tlh + Math.round(FH.sub * 1.9);
  const top = sy + (sl.length - 1) * slh + 40;
  const brand = 'nachderspritze.de';
  const bw = tw(brand, 'brand', FH.foot + 2);
  // „(CC BY 4.0)“ bricht nicht um (geschützte Leerzeichen)
  const fl = [...wrap(`Quelle: ${source}`, maxW, 'body', FH.foot), ...wrap(LIZENZ.replace('CC BY 4.0', 'CC BY 4.0'), maxW, 'body', FH.foot)];
  const brandOwnLine = tw(fl[fl.length - 1], 'body', FH.foot) + bw + 32 > maxW;
  const flh = Math.round(FH.foot * 1.3);
  const n = fl.length + (brandOwnLine ? 1 : 0);
  const FYh = HH - 40 - (n - 1) * flh - Math.round(FH.foot * 1.5);
  return { tl, tlh, ty, sl, slh, sy, top, fl, flh, brand, brandOwnLine, FY: FYh, bottom: FYh - 32 };
}

/** Rahmen im Hochformat: wie frame(), Titel und Untertitel mehrzeilig, Fuß mit Quelle, Lizenzzeile und Domain */
export function frameHoch({ file, title, subtitle, source, alt, body, warn = console.warn }) {
  const k = rahmenHoch({ title, subtitle, source });
  if (k.tl.length > 3) warn(`${file}: Titel länger als drei Zeilen`);
  if (k.sl.length > 3) warn(`${file}: Untertitel länger als drei Zeilen`);
  const inner = knockout(body);
  clearBoxes();
  const head =
    k.tl.map((l, i) => T(M, k.ty + i * k.tlh, l, { st: 'title', size: FH.title })).join('') +
    k.sl.map((l, i) => T(M, k.sy + i * k.slh, l, { size: FH.sub, fill: C.ink2 })).join('');
  const fy0 = k.FY + Math.round(FH.foot * 1.5);
  const last = fy0 + (k.fl.length - 1 + (k.brandOwnLine ? 1 : 0)) * k.flh;
  const foot =
    k.fl.map((l, i) => T(M, fy0 + i * k.flh, l, { size: FH.foot, fill: C.ink3, cls: 'ft' })).join('') +
    T(WH - M, last, k.brand, { st: 'brand', size: FH.foot + 2, anchor: 'end', cls: 'ft' });
  clearBoxes();
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WH}" height="${HH}" viewBox="0 0 ${WH} ${HH}" role="img" aria-labelledby="t d" font-family="${esc(FONT)}">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(alt)}</desc>
<rect width="${WH}" height="${HH}" fill="${C.bg}"/>
${head}
${inner}
<line class="fy" x1="${M}" y1="${k.FY}" x2="${WH - M}" y2="${k.FY}" stroke="${C.line}" stroke-width="1"/>
${foot}
</svg>
`;
}

/** Absatz aus Läufen mit eigenem Schnitt und eigener Farbe (etwa: Überschrift fett, dann Text), Umbruch an Leerzeichen.
 * runs: [{ s, st, fill }]; o: size, lh, maxW, fill (Grundfarbe). Gibt { svg, lines, bottom } zurück. */
export function PM(x, y, runs, o = {}) {
  const size = o.size ?? 16;
  const lh = o.lh ?? Math.round(size * 1.4);
  const maxW = o.maxW ?? W - 2 * M;
  const words = runs.flatMap((ru) => String(ru.s).split(' ').map((w) => ({ w, st: ru.st || 'body', fill: ru.fill ?? o.fill ?? C.ink })));
  const lines = [];
  let cur = [];
  for (const wd of words) {
    const test = [...cur, wd];
    if (!cur.length || lineW(test, size) <= maxW) cur = test;
    else {
      lines.push(cur);
      cur = [wd];
    }
  }
  if (cur.length) lines.push(cur);
  let svg = '';
  lines.forEach((ln, i) => {
    const yy = y + i * lh;
    BOXES.push({ x0: x, x1: x + lineW(ln, size), y0: yy - size * 0.8, y1: yy + size * 0.26 });
    // aufeinanderfolgende Wörter mit gleichem Schnitt und gleicher Farbe in einem tspan
    const parts = [];
    for (const wd of ln) {
      const p = parts[parts.length - 1];
      if (p && p.st === wd.st && p.fill === wd.fill) p.s += ` ${wd.w}`;
      else parts.push({ st: wd.st, fill: wd.fill, s: parts.length ? ` ${wd.w}` : wd.w });
    }
    const tsp = parts
      .map((p) => {
        const S = ST[p.st];
        return `<tspan font-weight="${S.w}" fill="${p.fill}" style="font-stretch:${S.s}%;letter-spacing:${S.ls}em">${esc(p.s)}</tspan>`;
      })
      .join('');
    svg += `<text x="${r(x)}" y="${r(yy)}" font-size="${size}" stroke="${C.bg}" stroke-width="5" stroke-linejoin="round" paint-order="stroke">${tsp}</text>`;
  });
  return { svg, lines, bottom: y + (lines.length - 1) * lh };
}
/** Breite einer Zeile aus Wörtern mit eigenem Schnitt (das Leerzeichen zählt zum folgenden Wort) */
function lineW(words, size) {
  return words.reduce((a, wd, i) => a + tw(i ? ` ${wd.w}` : wd.w, wd.st, size), 0);
}
