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
  return sum + S.ls * size * [...str].length;
}

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

/** Text. o: st (Schnitt), size, fill, anchor, w (Gewicht), tnum, inside (Beschriftung in einer Fläche), cls */
export function T(x, y, s, o = {}) {
  const S = ST[o.st || 'body'];
  const size = o.size ?? 16;
  const style = `font-stretch:${S.s}%;letter-spacing:${S.ls}em${o.tnum ? ';font-variant-numeric:tabular-nums' : ''}`;
  const cls = [o.inside ? 'in' : '', o.cls || ''].filter(Boolean).join(' ');
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
export const L = (x1, y1, x2, y2, o = {}) =>
  `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${o.c ?? C.line}" stroke-width="${o.w ?? 1}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.cap ? ` stroke-linecap="${o.cap}"` : ''}/>`;

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

/** gepunktete Linie für Placebo/Vergleich */
export const DOTTED = { c: C.placebo, w: 2.6, dash: '0.1 6.5', cap: 'round' };
/** gepunkteter Rand für Placebo-/Vergleichsbalken */
export const placeboBar = (x, y, w, h) => R(x, y, w, h, { fill: C.bg2, stroke: C.placebo, sw: 1.6, dash: '0.1 4.2' });

/** Gelbe Markierung hinter einem Text (Textmarker-Band in der unteren Hälfte) */
export function HL(x, y, s, st, size, anchor = 'start') {
  const w = tw(s, st, size);
  const x0 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
  return `<rect x="${r(x0 - 5)}" y="${r(y - size * 0.5)}" width="${r(w + 10)}" height="${r(size * 0.62)}" rx="2" fill="${C.hl}"/>`;
}

/** Pfeilspitze nach rechts (statt Pfeilzeichen, die in der Schrift fehlen) */
export const ARROW_R = (x, y, color = C.ink, s = 9) => `<path d="M${r(x - s)} ${r(y - s)} L${r(x)} ${r(y)} L${r(x - s)} ${r(y + s)}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
export const ARROW_UP = (x, y, color = C.ink, s = 8) => `<path d="M${r(x - s)} ${r(y + s)} L${r(x)} ${r(y)} L${r(x + s)} ${r(y + s)}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
export const ARROW_DOWN = (x, y, color = C.ink, s = 8) => `<path d="M${r(x - s)} ${r(y - s)} L${r(x)} ${r(y)} L${r(x + s)} ${r(y - s)}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;

/** Senkrechte Klammer (eckig, ruhig) an x von y1 bis y2, Öffnung nach links */
export const BRACKET = (x, y1, y2, color = C.ink, tick = 8) =>
  `<path d="M${r(x - tick)} ${r(y1)} H${r(x)} V${r(y2)} H${r(x - tick)}" fill="none" stroke="${color}" stroke-width="1.6"/>`;

/** Legenden-Eintrag: Linie, gepunktete Linie, Fläche oder Punkt plus Text; gibt { svg, w } zurück */
export function legend(x, y, type, color, label, size = 14) {
  let s = '';
  if (type === 'line') s += L(x, y - 5, x + 26, y - 5, { c: color, w: 3, cap: 'round' });
  if (type === 'dotted') s += L(x, y - 5, x + 26, y - 5, DOTTED);
  if (type === 'box') s += R(x, y - 13, 26, 14, { fill: color, mark: false });
  if (type === 'placebo') s += R(x, y - 13, 26, 14, { fill: C.bg2, stroke: C.placebo, sw: 1.6, dash: '0.1 4.2', mark: false });
  if (type === 'fat') s += R(x, y - 13, 26, 14, { fill: C.fat, stroke: C.fatEdge, sw: 1.2, mark: false });
  s += T(x + 34, y, label, { size, fill: C.ink2 });
  return { svg: s, w: 34 + tw(label, 'body', size) };
}

/** Legende rechtsbündig bis xr */
export function legendRow(xr, y, items, gap = 26) {
  const parts = items.map(([type, color, label]) => legend(0, 0, type, color, label));
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

/** Horizontale Gitterlinien mit Beschriftung links */
export function gridY(vals, py, x1, x2, fmt, o = {}) {
  let s = '';
  for (const v of vals) {
    const zero = o.zero !== undefined && v === o.zero;
    s += L(x1, py(v), x2, py(v), zero ? { c: C.ink3, w: 1.2 } : {});
    s += T(x1 - (o.gap ?? 14), py(v) + 5, fmt(v), { st: 'axis', size: o.size ?? 14, fill: C.ink3, anchor: 'end', tnum: true });
  }
  return s;
}

/** Senkrechte Gitterlinien mit Beschriftung oben oder unten */
export function gridX(vals, px, y1, y2, fmt, labelY, o = {}) {
  let s = '';
  for (const v of vals) {
    s += L(px(v), y1, px(v), y2, o.zero !== undefined && v === o.zero ? { c: C.ink3, w: 1.2 } : {});
    const lab = fmt(v);
    if (lab) s += T(px(v), labelY, lab, { st: 'axis', size: o.size ?? 14, fill: C.ink3, anchor: o.anchor ?? 'middle', tnum: true });
  }
  return s;
}

/** Rahmen: Titel, Untertitel, Inhalt, Haarlinie, Quelle, Domain */
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
  const src = wrap(`Quelle: ${source}`, maxW - bw - 48, 'body', 14);
  if (src.length > 2) warn(`${file}: Quelle mehr als zwei Zeilen`);
  const fy = H - 62;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d" font-family="${esc(FONT)}">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(alt)}</desc>
<rect width="${W}" height="${H}" fill="${C.bg}"/>
${T(M, 72, title, { st: 'title', size: ts })}
${sub.map((l, i) => T(M, 106 + i * 22, l, { size: ss, fill: C.ink2 })).join('')}
${body}
${L(M, fy, W - M, fy)}
${src.map((l, i) => T(M, fy + 25 + i * 19, l, { size: 14, fill: C.ink3 })).join('')}
${T(W - M, fy + 25, brand, { st: 'brand', size: 15, anchor: 'end' })}
</svg>
`;
}
