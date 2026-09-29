#!/usr/bin/env node
/**
 * Textprüfung über den gebauten Output (dist/):
 * 1. fehlende Leerzeichen (Astro schneidet Leerzeichen an Zeilenumbrüchen vor Ausdrücken und Inline-Elementen weg)
 * 2. Platzhalter in eckigen Klammern
 * 3. verbotene Formulierungen (Health-Claims, „fachlich geprüft“ ohne Prüfer)
 * 4. Frontmatter-Längen der Artikel (metaTitle ≤ 65, description ≤ 165)
 * Aufruf: npm run check:text   (nach npm run build)
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let problems = 0;
const report = (file, label, ctx) => { problems++; console.log(`${file} | ${label} | …${ctx}…`); };

// ---- 4. Frontmatter-Längen
const contentDir = path.join(root, 'src/content/wissen');
for (const f of fs.readdirSync(contentDir)) {
  if (!f.endsWith('.md')) continue;
  const t = fs.readFileSync(path.join(contentDir, f), 'utf8');
  const g = (k) => (t.match(new RegExp(`^${k}: "(.*)"$`, 'm')) || [])[1] ?? '';
  if ([...g('metaTitle')].length > 65) report(f, 'metaTitle > 65', g('metaTitle'));
  if ([...g('description')].length > 165) report(f, 'description > 165', g('description'));
  if (!/^sources: \[/m.test(t)) report(f, 'keine sources im Frontmatter', '');
}

// ---- 1.–3. gebaute Seiten
const dist = path.join(root, 'dist');
if (!fs.existsSync(dist)) { console.error('dist/ fehlt – erst npm run build'); process.exit(2); }
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
const forbidden = [
  [/fachlich gepr[üu]ft/i, '„fachlich geprüft“ ohne Prüfer'],
  [/verhindert den jojo/i, 'verbotener Claim „verhindert den Jojo-Effekt“'],
  [/ersetzt die (abnehm)?spritze/i, 'verbotener Claim „ersetzt die Spritze“'],
  [/von [äa]rzt(en|innen) empfohlen/i, 'verbotener Claim „von Ärzten empfohlen“'],
  [/kurbelt den stoffwechsel/i, 'verbotener Claim „Stoffwechsel ankurbeln“'],
  [/\[(vorname|qualifikation|plz|straße|link)/i, 'Platzhalter'],
];
const spacing = [
  [/[a-zäöüß:][A-ZÄÖÜ][a-zäöü]{2,}/, 'Großbuchstabe ohne Leerzeichen'],
  [/[a-zäöüß:][0-9]/, 'Zahl ohne Leerzeichen'],
  [/[a-zäöüß]\.[A-ZÄÖÜ][a-zäöü]/, 'Punkt ohne Leerzeichen'],
  [/[,;:][A-Za-zäöü]{2,}/, 'Satzzeichen ohne Leerzeichen'],
  [/  /, 'Doppeltes Leerzeichen'],
  [/[a-zäöüß][€%]/, 'Einheit ohne Leerzeichen'],
];
const ignore = (c) => /@|http|M\.Sc|eClinicalMedicine|g\/kg|Stresemannstr|Vita2You|nachderspritz-21/.test(c);
const seen = new Set();
for (const file of walk(dist)) {
  let raw = fs.readFileSync(file, 'utf8');
  const rel = path.relative(dist, file);
  raw = raw.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>|<sup>[\s\S]*?<\/sup>|<title>[\s\S]*?<\/title>|<ol class="mt-3 space-y-2[\s\S]*?<\/ol>/g, '');
  const text = decode(raw.replace(/<\/(p|li|h[1-6]|td|th|tr|div|section|article|summary|details|blockquote|label|span|a|button|nav|time|strong)>/g, '\n').replace(/<[^>]+>/g, ''));
  for (const [rx, label] of forbidden) {
    const m = text.match(rx);
    if (m) { const k = rel + label; if (!seen.has(k)) { seen.add(k); report(rel, label, m[0]); } }
  }
  for (let line of text.split('\n')) {
    line = line.trim().replace(/[ \t]+/g, ' ');
    for (const [rx, label] of spacing) {
      const m = line.match(rx);
      if (!m) continue;
      const i = m.index ?? 0;
      const ctx = line.slice(Math.max(0, i - 25), i + m[0].length + 25);
      if (ignore(ctx)) continue;
      const k = label + ctx;
      if (!seen.has(k)) { seen.add(k); report(rel, label, ctx); }
    }
  }
}
console.log(problems ? `${problems} Treffer – bitte prüfen` : 'Textprüfung: keine Treffer');
process.exit(problems ? 1 : 0);
