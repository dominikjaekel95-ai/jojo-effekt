#!/usr/bin/env node
/**
 * Erzeugt public/downloads/checkliste-8-wochen.pdf aus der gebauten Seite dist/checkliste/index.html.
 *
 * Ablauf: npm run build → node scripts/checkliste-pdf.mjs → npm run build (damit das PDF in dist/ liegt).
 * Kurzform: npm run pdf:checkliste (baut vorher). Das PDF wird mit committet; es ändert sich nur, wenn
 * src/pages/checkliste/index.astro geändert wird.
 *
 * Voraussetzungen: Playwright (im Projekt, global oder über PLAYWRIGHT_PATH) und ein Chromium (Playwright findet es
 * über PLAYWRIGHT_BROWSERS_PATH; sonst CHROMIUM_PATH setzen). Lädt keine externen Ressourcen: Tally- und
 * Plausible-Requests werden abgebrochen, die Seite ist ohne sie vollständig.
 *
 * Schrift: Chromium bettet variable Schriften als Type-3-Glyphen ein. Deshalb ersetzt das Skript Mona Sans beim Drucken
 * durch die statischen Schnitte „NDS Druck“ aus scripts/fonts/ (gleicher Mechanismus wie scripts/ernaehrungsplan-pdf.mjs,
 * Lizenz OFL in scripts/fonts/OFL.txt).
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve('dist');
const out = path.resolve('public/downloads/checkliste-8-wochen.pdf');
const pagePath = '/checkliste/';

if (!fs.existsSync(path.join(root, 'checkliste', 'index.html'))) {
  console.error('dist/checkliste/index.html fehlt. Erst `npm run build` ausführen.');
  process.exit(1);
}

async function loadPlaywright() {
  const candidates = [
    'playwright',
    process.env.PLAYWRIGHT_PATH,
    '/opt/node22/lib/node_modules/playwright/index.mjs',
    '/usr/lib/node_modules/playwright/index.mjs',
  ].filter(Boolean);
  for (const c of candidates) {
    try {
      const spec = c.startsWith('/') ? pathToFileURL(c).href : c;
      return await import(spec);
    } catch {
      /* nächster Kandidat */
    }
  }
  throw new Error('Playwright nicht gefunden. `npm i -g playwright` oder PLAYWRIGHT_PATH setzen.');
}

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
};

/** Minimaler statischer Server für dist/, damit absolute Pfade (/_astro/…) funktionieren. */
function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
      if (p.endsWith('/')) p += 'index.html';
      const file = path.join(root, p);
      if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.writeHead(200, { 'content-type': mime[path.extname(file)] ?? 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

// Statische Druckschnitte als @font-face; die Auswahl nach font-stretch und font-weight übernimmt der Browser.
const fontDir = path.resolve('scripts/fonts');
const druckCss =
  fs
    .readdirSync(fontDir)
    .filter((f) => /^nds-druck-w\d+-g\d+\.woff2$/.test(f))
    .map((f) => {
      const [, w, g] = f.match(/w(\d+)-g(\d+)/);
      const b64 = fs.readFileSync(path.join(fontDir, f)).toString('base64');
      return `@font-face{font-family:"NDS Druck";src:url(data:font/woff2;base64,${b64}) format("woff2");font-weight:${g};font-stretch:${w}%;font-style:normal}`;
    })
    .join('\n') + '\n*{font-family:"NDS Druck",Helvetica,Arial,sans-serif !important;font-synthesis:none !important}';

const { chromium } = await loadPlaywright();
const { server, port } = await serve();
const url = `http://127.0.0.1:${port}${pagePath}`;
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  });
  const page = await browser.newPage();
  // Keine Requests an Dritte: alles außer dem lokalen Server abbrechen.
  await page.route('**/*', (route) => (route.request().url().startsWith(`http://127.0.0.1:${port}/`) ? route.continue() : route.abort()));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.addStyleTag({ content: druckCss });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: '16mm', right: '16mm', bottom: '18mm', left: '16mm' },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate:
      '<div style="width:100%;font-family:sans-serif;font-size:8px;color:#6b6b6b;padding:0 16mm;display:flex;justify-content:space-between">' +
      '<span>nachderspritze.de/checkliste/ · Keine ärztliche Beratung. Ob und wie du dein Medikament absetzt, besprichst du mit deiner Ärztin oder deinem Arzt.</span>' +
      '<span>Seite <span class="pageNumber"></span> von <span class="totalPages"></span></span></div>',
  });
  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(`PDF geschrieben: ${path.relative(process.cwd(), out)} (${kb} kB)`);
} finally {
  await browser?.close();
  server.close();
}
