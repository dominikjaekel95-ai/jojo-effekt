#!/usr/bin/env node
/**
 * Erzeugt aus einer gebauten Seite in dist/ ein PDF, zum Beispiel:
 *   node scripts/seite-pdf.mjs /ernaehrungsplan/ public/downloads/ernaehrungsplan-7-tage.pdf "nachderspritze.de/ernaehrungsplan/"
 * Kurzform für den Ernährungsplan: npm run pdf:ernaehrungsplan (baut vorher). Das PDF wird mit committet und ändert
 * sich nur, wenn die Seite geändert wird. Die Checkliste nutzt weiterhin scripts/checkliste-pdf.mjs; beide Skripte
 * arbeiten gleich (lokaler Server für dist/, Druckmedium, keine Requests an Dritte).
 *
 * Voraussetzungen: Playwright (im Projekt, global oder über PLAYWRIGHT_PATH) und ein Chromium (Playwright findet es
 * über PLAYWRIGHT_BROWSERS_PATH; sonst CHROMIUM_PATH setzen).
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [pagePath, outArg, fusszeile] = process.argv.slice(2);
if (!pagePath || !outArg) {
  console.error('Aufruf: node scripts/seite-pdf.mjs <Seitenpfad, z. B. /ernaehrungsplan/> <Ausgabedatei> [Fußzeilentext]');
  process.exit(1);
}
const root = path.resolve('dist');
const out = path.resolve(outArg);
const htmlFile = path.join(root, pagePath.replace(/^\//, ''), 'index.html');
if (!fs.existsSync(htmlFile)) {
  console.error(`${path.relative(process.cwd(), htmlFile)} fehlt. Erst \`npm run build\` ausführen.`);
  process.exit(1);
}

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

const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain', '.pdf': 'application/pdf' };

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

const { chromium } = await loadPlaywright();
const { server, port } = await serve();
const url = `http://127.0.0.1:${port}${pagePath}`;
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
  const page = await browser.newPage();
  // Keine Requests an Dritte: alles außer dem lokalen Server abbrechen.
  await page.route('**/*', (route) => (route.request().url().startsWith(`http://127.0.0.1:${port}/`) ? route.continue() : route.abort()));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const links = fusszeile ?? `nachderspritze.de${pagePath}`;
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
      `<span>${links} · Keine ärztliche Beratung. Ob und wie du dein Medikament absetzt, besprichst du mit deiner Ärztin oder deinem Arzt.</span>` +
      '<span>Seite <span class="pageNumber"></span> von <span class="totalPages"></span></span></div>',
  });
  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(`PDF geschrieben: ${path.relative(process.cwd(), out)} (${kb} kB)`);
} finally {
  await browser?.close();
  server.close();
}
