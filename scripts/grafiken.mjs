#!/usr/bin/env node
/**
 * Erzeugt die Studien-Grafiken unter public/grafiken/ (SVG und PNG) im Design „Kalk“, dazu die OG-Bilder
 * (public/og-default.png, public/og-studien.png) und das Icon (public/favicon.svg, public/apple-touch-icon.png).
 *
 * Alle Zahlen stammen aus src/data/sources.ts bzw. src/data/studien.ts (Quellen-IDs in den Kommentaren der Module)
 * oder aus src/data/markt/preise.json (Preisgrafik). Aufruf: `npm run grafiken`; nur einzelne Grafiken:
 * `npm run grafiken -- absetzkurve-step-1 wiegen-zonen`; nur OG-Bilder und Icon: `npm run grafiken -- --og`.
 *
 * Aufbau: grafiken-lib.mjs (Farben, Schrift, Textmaße, Rahmen), grafiken-bestand.mjs (die Grafiken von vor dem
 * Redesign, gleiche Dateinamen), grafiken-neu.mjs (neue Grafiken je Artikel), grafiken-hoch.mjs (Hochformat-Fassungen
 * 1080 × 1350 fürs Handy, <id>-hoch.svg/.png; `npm run grafiken -- <id>` erzeugt sie mit), grafiken-og.mjs (OG-Bilder, Icon).
 * Die SVGs laufen ohne Webfont (Ersatzschrift system-ui); die PNG-Fassungen werden mit Mona Sans gerendert
 * (Querformat mit Faktor 1,5 als 1800 × 1013, Hochformat mit Faktor 1 als 1080 × 1350).
 * Nach dem Rendern prüft das Skript jede Grafik: Text innerhalb des Bildes, keine Überlappung von Texten, kein Text
 * über Balken (außer ausdrücklich innen beschrifteten), Schrift mindestens 13 px (Hochformat 28 px). Treffer werden ausgegeben.
 * Die Liste wird von src/data/grafiken.ts gespiegelt (Seite /grafiken/); Datentabellen in src/data/grafiken-daten.json.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { W, H, WH, HH, FH, FONT, ST, CHARSET, setMetrics, unsafeChars } from './grafiken-lib.mjs';
import { bestand } from './grafiken-bestand.mjs';
import { neu } from './grafiken-neu.mjs';
import { hoch } from './grafiken-hoch.mjs';
import { ogBilder } from './grafiken-og.mjs';

const OUT = resolve('public/grafiken');
mkdirSync(OUT, { recursive: true });
const preise = JSON.parse(readFileSync(resolve('src/data/markt/preise.json'), 'utf8'));
const studienTs = readFileSync(resolve('src/data/studien.ts'), 'utf8');
const studienAnzahl = (studienTs.slice(studienTs.indexOf('export const studien:')).match(/sourceId:/g) || []).length;
const args = process.argv.slice(2);
const nurOg = args.includes('--og');
const nur = args.filter((a) => !a.startsWith('--')).map((a) => a.replace(/\.(svg|png)$/, ''));

const fmtDate = (iso) => {
  const [y, m, d] = iso.split('-');
  return `${Number(d)}. ${['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][Number(m) - 1]} ${y}`;
};

/* Mona Sans (Breite 75–125 %, Gewicht 200–900) für Messung und PNG-Fassungen einbetten */
const fontDir = resolve('node_modules/@fontsource-variable/mona-sans/files');
const fontCss = ['mona-sans-latin-standard-normal.woff2', 'mona-sans-latin-ext-standard-normal.woff2']
  .map((f) => resolve(fontDir, f))
  .filter((p) => existsSync(p))
  .map((p) => `@font-face{font-family:'Mona Sans Variable';font-style:normal;font-weight:200 900;font-stretch:75% 125%;src:url(data:font/woff2;base64,${readFileSync(p).toString('base64')}) format('woff2')}`)
  .join('');
if (!fontCss) console.warn('Mona Sans nicht gefunden (node_modules/@fontsource-variable/mona-sans); PNGs nutzen die Systemschrift.');

async function loadPlaywright() {
  const candidates = ['playwright', process.env.PLAYWRIGHT_PATH, '/opt/node22/lib/node_modules/playwright/index.mjs', '/usr/lib/node_modules/playwright/index.mjs'].filter(Boolean);
  for (const c of candidates) {
    try {
      return await import(c.startsWith('/') ? pathToFileURL(c).href : c);
    } catch {
      /* nächster Kandidat */
    }
  }
  throw new Error('Playwright nicht gefunden. `npm i -g playwright` oder PLAYWRIGHT_PATH setzen.');
}

let browser = null;
let page = null;
try {
  const { chromium } = await loadPlaywright();
  const known = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].filter((p) => p && existsSync(p));
  try {
    browser = await chromium.launch();
  } catch (e) {
    if (!known[0]) throw e;
    browser = await chromium.launch({ executablePath: known[0] });
  }
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1.5 });
  page = await ctx.newPage();
  // Zeichenbreiten je Schnitt messen (für Titel-Anpassung und Umbruch)
  await page.setContent(`<!doctype html><html><head><style>${fontCss}body{margin:0;font-family:${FONT}}</style></head><body>${Object.entries(ST)
    .map(([, s]) => `<span style="font-weight:${s.w};font-stretch:${s.s}%">Aa0</span>`)
    .join('')}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  const metrics = await page.evaluate(
    ({ ST, chars, font }) => {
      const out = {};
      const span = document.createElement('span');
      span.style.cssText = `font-family:${font};font-size:100px;white-space:pre;position:absolute;left:0;top:0`;
      document.body.appendChild(span);
      for (const [k, s] of Object.entries(ST)) {
        span.style.fontWeight = String(s.w);
        span.style.fontStretch = `${s.s}%`;
        out[k] = {};
        for (const ch of chars) {
          span.textContent = ch;
          out[k][ch] = span.getBoundingClientRect().width;
        }
      }
      return out;
    },
    { ST, chars: [...CHARSET], font: FONT },
  );
  setMetrics(metrics);
} catch (e) {
  console.warn('Kein Browser für Messung und PNGs:', e.message);
  console.warn('Die SVGs werden mit geschätzten Textbreiten erzeugt; die PNGs bleiben auf dem alten Stand.');
}

const hinweise = [];
const warn = (m) => hinweise.push(m);
const ctx = { preise, fmtDate, warn, studienAnzahl };

let figures = nurOg ? [] : [...bestand(ctx), ...neu(ctx)];
if (!nurOg) figures.push(...hoch(ctx, figures));
// eine Hochformat-Fassung entsteht mit, wenn ihre Hauptgrafik genannt ist
if (nur.length) figures = figures.filter((f) => nur.includes(f.file.replace('.svg', '')) || (f.hoch && nur.includes(f.file.replace('-hoch.svg', ''))));

for (const f of figures) {
  const bad = unsafeChars(f.svg.replace(/<title[\s\S]*?<\/desc>/, '').replace(/<[^>]+>/g, '')).filter((ch) => !/\s/.test(ch));
  if (bad.length) warn(`${f.file}: Zeichen ohne Glyphe in Mona Sans: ${[...new Set(bad)].join(' ')}`);
  writeFileSync(resolve(OUT, f.file), f.svg);
}
if (figures.length) console.log(`SVG geschrieben: ${figures.length}`);

/** Prüft eine gerenderte Grafik im Browser: Ränder, Überlappungen, Schriftgröße (Hochformat: eigene Maße, mindestens 28 px) */
async function pruefen(pg, f) {
  return pg.evaluate(
    ({ W, H, file, minFs }) => {
      const svg = document.querySelector('svg');
      const issues = [];
      const shrink = (b, fs) => ({ x: b.x + 0.5, y: b.y + fs * 0.16, w: b.width - 1, h: b.height - fs * 0.3 });
      const texts = [...svg.querySelectorAll('text')].map((t) => {
        const fs = parseFloat(t.getAttribute('font-size'));
        return { s: t.textContent, fs, inside: t.classList.contains('in'), foot: t.classList.contains('ft'), b: shrink(t.getBBox(), fs) };
      });
      const marks = [...svg.querySelectorAll('.mk')].map((e) => e.getBBox());
      const fyEl = svg.querySelector('line.fy');
      const FY = fyEl ? parseFloat(fyEl.getAttribute('y1')) : H;
      const M = 64;
      const hit = (a, b, pad = 0) => a.x < b.x + b.width - pad && a.x + a.w > b.x + pad && a.y < b.y + b.height - pad && a.y + a.h > b.y + pad;
      for (const t of texts) {
        if (t.fs < minFs) issues.push(`Schrift ${t.fs}px: „${t.s}“`);
        if (t.b.x < M - 2 || t.b.x + t.b.w > W - M + 2 || t.b.y < 8 || t.b.y + t.b.h > H - 4) issues.push(`über den Rand (64 px): „${t.s}“`);
        if (!t.foot && t.b.y + t.b.h > FY - 20) issues.push(`zu nah an der Fußlinie: „${t.s}“`);
        if (!t.inside) for (const m of marks) if (hit(t.b, m, 1)) issues.push(`Text über Fläche: „${t.s}“`);
      }
      for (const m of marks) if (m.y + m.height > FY - 20) issues.push(`Fläche zu nah an der Fußlinie (y ${Math.round(m.y + m.height)})`);
      // Text gegen Linie: keine Linie (Gitter, Achse, Trenner) darf durch eine Beschriftung laufen
      const lines = [...svg.querySelectorAll('line')].filter((l) => !l.classList.contains('fy')).map((l) => ['x1', 'y1', 'x2', 'y2'].map((k) => parseFloat(l.getAttribute(k))));
      for (const t of texts) {
        if (t.foot || t.inside) continue; // Text in Flächen: Linien liegen hinter der Fläche
        const b = t.b;
        for (const [x1, y1, x2, y2] of lines) {
          const horiz = Math.abs(y1 - y2) < 0.5, vert = Math.abs(x1 - x2) < 0.5;
          if (horiz && y1 > b.y + 1 && y1 < b.y + b.h - 1 && Math.min(Math.max(x1, x2), b.x + b.w) - Math.max(Math.min(x1, x2), b.x) > 2) { issues.push(`Linie durch Text: „${t.s}“`); break; }
          if (vert && x1 > b.x + 1 && x1 < b.x + b.w - 1 && Math.min(Math.max(y1, y2), b.y + b.h) - Math.max(Math.min(y1, y2), b.y) > 2) { issues.push(`Linie durch Text: „${t.s}“`); break; }
        }
      }
      for (let i = 0; i < texts.length; i++)
        for (let j = i + 1; j < texts.length; j++) {
          const a = texts[i].b, c = texts[j].b;
          const ox = Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x);
          const oy = Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y);
          if (ox > 1 && oy > 1) issues.push(`Überlappung: „${texts[i].s}“ / „${texts[j].s}“`);
        }
      return issues.map((m) => `${file}: ${m}`);
    },
    f.hoch ? { W: WH, H: HH, file: f.file, minFs: FH.foot } : { W, H, file: f.file, minFs: 13 },
  );
}

if (page) {
  // Hochformat in eigener Seite: 1080 × 1350 mit Faktor 1 (am Handy rund 360 px breit bei dreifacher Pixeldichte)
  const pageHoch = figures.some((f) => f.hoch) ? await (await browser.newContext({ viewport: { width: WH, height: HH }, deviceScaleFactor: 1 })).newPage() : null;
  for (const f of figures) {
    const pg = f.hoch ? pageHoch : page;
    await pg.setContent(`<!doctype html><html><head><style>${fontCss}body{margin:0}</style></head><body>${f.svg.replace(/^<\?xml[^>]*>\s*/, '')}</body></html>`);
    await pg.evaluate(() => document.fonts.ready);
    hinweise.push(...(await pruefen(pg, f)));
    await pg.screenshot({ path: resolve(OUT, f.file.replace('.svg', '.png')), clip: { x: 0, y: 0, width: f.hoch ? WH : W, height: f.hoch ? HH : H } });
  }
  if (figures.length) console.log(`PNG-Fassungen erzeugt: ${figures.length}`);
  if (nurOg || !nur.length) await ogBilder({ page, fontCss, studienAnzahl, warn });
  await browser.close();
}

if (hinweise.length) {
  console.log(`\nPrüfhinweise (${hinweise.length}):`);
  for (const h of hinweise) console.log(' -', h);
} else console.log('Prüfung: keine Hinweise.');
