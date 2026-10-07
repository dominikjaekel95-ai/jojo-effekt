/**
 * OG-Bilder (1200 × 630) und Icon im Design „Kalk“: public/og-default.png, public/og-studien.png, public/favicon.svg,
 * public/apple-touch-icon.png (180 × 180). Wortmarke „Nach der Spritze“ in Mona Sans breit; das Bildzeichen ist die
 * Absetzkurve (fällt unter der Spritze, steigt danach), Punkt in Gelb als Markierung.
 * Zahlen auf og-studien.png: wilding2022ext (zwei Drittel), aronne2024 (+14 %), wu2025 (Woche 8); Anzahl der Studien
 * aus src/data/studien.ts.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { C, FONT, T, P, L, HL, PATH, DOT, DOTTED, tw, fit, esc, clearBoxes } from './grafiken-lib.mjs';

/** Bildzeichen: Absetzkurve auf Tinte (viewBox 64 × 64) */
export function iconSvg({ rounded = true } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64"${rounded ? ' rx="14"' : ''} fill="${C.ink}"/><path d="M13 17 C18 37 24 46 31 46 C38 46 43 38 50 31" fill="none" stroke="${C.bg}" stroke-width="7" stroke-linecap="round"/><circle cx="50.5" cy="30.5" r="5.5" fill="${C.hl}"/></svg>\n`;
}

function ogFrame(body, w = 1200, h = 630) {
  clearBoxes();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="${esc(FONT)}"><rect width="${w}" height="${h}" fill="${C.bg}"/>${body}</svg>`;
}

export async function ogBilder({ page, fontCss, studienAnzahl, warn }) {
  const PUB = resolve('public');
  const browser = page.context().browser();
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const shot = async (svg, file, w, h) => {
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<!doctype html><html><head><style>${fontCss}body{margin:0}</style></head><body>${svg}</body></html>`);
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: resolve(PUB, file), clip: { x: 0, y: 0, width: w, height: h } });
  };
  const X = 72;

  /* og-default.png: Wortmarke, Leitsatz, Programm, ruhige Absetzkurve rechts */
  {
    let b = '';
    b += T(X, 92, 'Nach der Spritze', { st: 'brand', size: 28 });
    const hs = Math.min(fit('Dein neues Gewicht', 640, 'title', 88), fit('braucht einen Plan.', 640, 'title', 88));
    b += T(X, 268, 'Dein neues Gewicht', { st: 'title', size: hs });
    b += T(X, 268 + hs * 1.02, 'braucht einen Plan.', { st: 'title', size: hs });
    b += P(X, 268 + hs * 1.02 + 70, 'Das 12-Wochen-Programm für die Zeit nach der Abnehmspritze.', { size: 27, fill: C.ink2, maxW: 600, lh: 37 }).svg;
    b += T(X, 572, 'nachderspritze.de', { st: 'brand', size: 20, fill: C.ink2 });
    // Kurve: Haarlinien, Placebo gepunktet, Gewicht in Tinte, Wiederzunahme in Braun
    const x0 = 770, x1 = 1130, yt = 190, yb = 470;
    for (const yy of [yt, (yt + yb) / 2, yb]) b += L(x0, yy, x1, yy);
    const xd = x0 + (x1 - x0) * 0.57;
    b += L(xd, yt - 30, xd, yb + 10, { c: C.ink, w: 1.2 });
    b += PATH(`M${x0} ${yt} C${x0 + 60} ${yt + 14} ${xd - 80} ${yt + 18} ${xd} ${yt + 18} C${xd + 60} ${yt + 18} ${x1 - 50} ${yt + 6} ${x1} ${yt + 2}`, DOTTED);
    b += PATH(`M${x0} ${yt} C${x0 + 40} ${yt + 190} ${xd - 90} ${yb - 30} ${xd} ${yb - 30}`, { c: C.ink, w: 3.5 });
    // Endpunkt: zwei Drittel des Verlusts zurück wie in der STEP-1-Verlängerung (11,6 von 17,3 Prozentpunkten)
    const ye = Math.round(yb - 30 - ((yb - 30 - yt) * 2) / 3);
    b += PATH(`M${xd} ${yb - 30} C${xd + 40} ${yb - 30} ${x1 - 80} ${ye + 17} ${x1} ${ye}`, { c: C.regain, w: 3.5 });
    b += DOT(x0, yt, 6, C.ink) + DOT(xd, yb - 30, 7, C.ink);
    b += `<circle cx="${x1}" cy="${ye}" r="9" fill="${C.hl}" stroke="${C.regain}" stroke-width="3"/>`;
    await shot(ogFrame(b), 'og-default.png', 1200, 630);
  }

  /* og-studien.png: Studien-Tracker mit drei Kernzahlen */
  {
    let b = '';
    b += T(X, 92, 'Nach der Spritze', { st: 'brand', size: 26 });
    b += T(X + tw('Nach der Spritze', 'brand', 26) + 18, 92, 'Studien-Tracker', { size: 22, fill: C.ink3 });
    const head = P(X, 196, 'Was nach dem Absetzen der Abnehmspritze passiert: alle Ergebnisse in einer Tabelle', { st: 'title', size: 54, maxW: 1056, lh: 62 });
    b += head.svg;
    const cols = [
      { big: '2/3', d: ['des Verlusts nach einem Jahr', 'zurück (STEP-1-Verlängerung)'], fill: C.ink, hl: true },
      { big: '+14 %', d: ['in 52 Wochen nach Wechsel', 'auf Placebo (SURMOUNT-4)'], fill: C.regain },
      { big: 'Woche 8', d: ['Beginn der messbaren', 'Zunahme (Meta-Analyse 2025)'], fill: C.ink },
    ];
    const by = head.bottom + 128;
    cols.forEach((c, i) => {
      const x = X + i * 356;
      if (c.hl) b += HL(x, by, c.big, 'big', 66);
      b += T(x, by, c.big, { st: 'big', size: 66, fill: c.fill, halo: !c.hl });
      c.d.forEach((l, j) => (b += T(x, by + 42 + j * 28, l, { size: 21, fill: C.ink2 })));
    });
    if (by + 42 + 28 > 540) warn(`og-studien.png: Kernzahlen zu tief (${by})`);
    b += L(X, 562, 1200 - X, 562);
    b += T(X, 596, `${studienAnzahl} Studien · Kernzahl · Link zum Original · CC BY 4.0 · nachderspritze.de/wissen/studien/`, { size: 20, fill: C.ink2 });
    await shot(ogFrame(b), 'og-studien.png', 1200, 630);
  }

  /* Icon */
  writeFileSync(resolve(PUB, 'favicon.svg'), iconSvg());
  await shot(iconSvg({ rounded: false }).replace('<svg ', '<svg width="180" height="180" '), 'apple-touch-icon.png', 180, 180);
  await ctx.close();
  console.log('OG-Bilder und Icon erzeugt: og-default.png, og-studien.png, favicon.svg, apple-touch-icon.png');
}
