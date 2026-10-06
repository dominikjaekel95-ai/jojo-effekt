#!/usr/bin/env node
/**
 * Erzeugt die 56 Ernährungspläne als PDF: public/downloads/ernaehrungsplan/<id>.pdf aus den gebauten Seiten
 * dist/ernaehrungsplan/plan/<id>/index.html (Vorlage src/pages/ernaehrungsplan/plan/[id].astro, Daten
 * src/data/ernaehrungsplan.ts, Ansicht src/lib/ernaehrungsplan-ansicht.ts). Gedruckt wird der Grundplan ohne Vorlieben.
 * Dazu 18 einseitige Hinweis-PDFs ep01 bis ep18 für Links aus Mails vor dem 06.10.2026 (Verweis auf den neuen Plan).
 *
 * Kurzform: npm run pdf:ernaehrungsplan (baut vorher). Die PDFs werden mit committet; neu erzeugen nach jeder Änderung an
 * Plänen, Vorlage oder Quellen. Die Dateinamen (ek01 bis ek56, ep01 bis ep18) stehen in MailerLite-Mails und dürfen sich
 * nie ändern. Voraussetzungen wie scripts/checkliste-pdf.mjs (Playwright und Chromium). Lädt keine externen Ressourcen.
 *
 * Schrift: Chromium bettet variable Schriften als Type-3-Glyphen ein (rund 900 kB pro Plan). Deshalb ersetzt das Skript
 * Mona Sans beim Drucken durch fünf statische Schnitte daraus (scripts/fonts/nds-druck-*.woff2, Breite/Gewicht im
 * Dateinamen, lateinische Untermenge, wegen des Reserved Font Name „Mona“ umbenannt in „NDS Druck“, Lizenz OFL in
 * scripts/fonts/OFL.txt). Erzeugt mit fontTools (varLib.instancer) aus @fontsource-variable/mona-sans; neue Schnitte
 * nur, wenn die Druck-CSS neue Breiten oder Gewichte braucht.
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
// Optional nur einzelne Pläne: node scripts/ernaehrungsplan-pdf.mjs ek13 ep01 (zum Prüfen; committet werden alle)
const nur = new Set(process.argv.slice(2));
const alle = fs.readdirSync(planDir).sort();
let ids = alle.filter((d) => /^ek\d{2}$/.test(d));
let alt = alle.filter((d) => /^ep\d{2}$/.test(d));
if (ids.length !== 56 || alt.length !== 18) {
  console.error(`Erwartet 56 Pläne und 18 Hinweise, gefunden ${ids.length} und ${alt.length}.`);
  process.exit(1);
}
if (nur.size) {
  ids = ids.filter((id) => nur.has(id));
  alt = alt.filter((id) => nur.has(id));
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
  const footer =
    '<div style="width:100%;font-family:Helvetica,Arial,sans-serif;font-size:7.5px;color:#5e605a;padding:0 14mm;display:flex;justify-content:space-between">' +
    '<span>nachderspritze.de · Allgemeiner Beispielplan für gesunde Erwachsene, keine ärztliche oder ernährungstherapeutische Beratung.</span>' +
    '<span>Seite <span class="pageNumber"></span> von <span class="totalPages"></span></span></div>';
  for (const liste of [ids, alt]) {
    for (const id of liste) {
      // ?druck: Die Hinweisseiten ep01 bis ep18 leiten sonst sofort auf den neuen Plan weiter.
      await page.goto(`http://127.0.0.1:${port}/ernaehrungsplan/plan/${id}/?druck`, { waitUntil: 'networkidle' });
      await page.emulateMedia({ media: 'print' });
      await page.addStyleTag({ content: druckCss });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(150);
      const out = path.join(outDir, `${id}.pdf`);
      await page.pdf({
        path: out,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        margin: { top: '14mm', right: '14mm', bottom: '16mm', left: '14mm' },
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate: footer,
      });
      console.log(`PDF geschrieben: ${path.relative(process.cwd(), out)} (${Math.round(fs.statSync(out).size / 1024)} kB)`);
    }
  }
} finally {
  await browser?.close();
  server.close();
}
