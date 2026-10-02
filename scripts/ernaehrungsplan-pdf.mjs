#!/usr/bin/env node
/**
 * Erzeugt die 18 Ernährungspläne als PDF: public/downloads/ernaehrungsplan/<id>.pdf aus den gebauten Seiten
 * dist/ernaehrungsplan/plan/<id>/index.html (Vorlage src/pages/ernaehrungsplan/plan/[id].astro,
 * Daten src/data/ernaehrungsplan.ts).
 *
 * Kurzform: npm run pdf:ernaehrungsplan (baut vorher). Die PDFs werden mit committet; neu erzeugen nach jeder Änderung an
 * Plänen, Vorlage oder Quellen. Die Dateinamen (ep01 bis ep18) stehen in MailerLite-Mails und dürfen sich nie ändern.
 * Voraussetzungen wie scripts/checkliste-pdf.mjs (Playwright und Chromium). Lädt keine externen Ressourcen.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve('dist');
const planDir = path.join(root, 'ernaehrungsplan', 'plan');
const outDir = path.resolve('public/downloads/ernaehrungsplan');

if (!fs.existsSync(planDir)) {
  console.error('dist/ernaehrungsplan/plan/ fehlt. Erst `npm run build` ausführen.');
  process.exit(1);
}
const ids = fs.readdirSync(planDir).filter((d) => /^ep\d{2}$/.test(d)).sort();
if (ids.length !== 18) {
  console.error(`Erwartet 18 Pläne, gefunden ${ids.length}.`);
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

const { chromium } = await loadPlaywright();
const { server, port } = await serve();
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  });
  const page = await browser.newPage();
  // Keine Requests an Dritte: alles außer dem lokalen Server abbrechen.
  await page.route('**/*', (route) => (route.request().url().startsWith(`http://127.0.0.1:${port}/`) ? route.continue() : route.abort()));
  fs.mkdirSync(outDir, { recursive: true });
  for (const id of ids) {
    await page.goto(`http://127.0.0.1:${port}/ernaehrungsplan/plan/${id}/`, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(outDir, `${id}.pdf`);
    await page.pdf({
      path: out,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: '14mm', right: '14mm', bottom: '16mm', left: '14mm' },
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate:
        '<div style="width:100%;font-family:sans-serif;font-size:8px;color:#6b6b6b;padding:0 14mm;display:flex;justify-content:space-between">' +
        '<span>nachderspritze.de · Allgemeiner Beispielplan, keine ärztliche oder ernährungstherapeutische Beratung.</span>' +
        '<span>Seite <span class="pageNumber"></span> von <span class="totalPages"></span></span></div>',
    });
    console.log(`PDF geschrieben: ${path.relative(process.cwd(), out)} (${Math.round(fs.statSync(out).size / 1024)} kB)`);
  }
} finally {
  await browser?.close();
  server.close();
}
