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

// ---- 4. Frontmatter-Längen (Artikel und Glossar)
for (const sub of ['src/content/wissen', 'src/content/glossar']) {
  const contentDir = path.join(root, sub);
  if (!fs.existsSync(contentDir)) continue;
  for (const f of fs.readdirSync(contentDir)) {
    if (!f.endsWith('.md')) continue;
    const t = fs.readFileSync(path.join(contentDir, f), 'utf8');
    const g = (k) => (t.match(new RegExp(`^${k}: "(.*)"$`, 'm')) || [])[1] ?? '';
    if ([...g('metaTitle')].length > 65) report(f, 'metaTitle > 65', g('metaTitle'));
    if ([...g('description')].length > 165) report(f, 'description > 165', g('description'));
    if ([...g('short')].length > 260) report(f, 'short > 260', g('short'));
    if (!/^sources: \[/m.test(t)) report(f, 'keine sources im Frontmatter', '');
  }
}
// Startseiten-Teaser des Marktradars dürfen keine Markennamen von Arzneimitteln enthalten
{
  const radar = JSON.parse(fs.readFileSync(path.join(root, 'src/data/markt/radar.json'), 'utf8'));
  for (const e of radar.eintraege) {
    const m = String(e.teaser).match(/wegovy|ozempic|mounjaro|saxenda|rybelsus|foundayo|zepbound/i);
    if (m) report('radar.json', `Markenname im teaser (${e.id})`, m[0]);
  }
}

// ---- 5. Astro-Whitespace im Quelltext: eine Zeile endet mit Text, die nächste beginnt mit {…} oder einem Inline-Element.
// Astro entfernt den Zeilenumbruch samt Leerzeichen; im Output kleben die Wörter zusammen („E-Mail andominik@…“).
{
  const walkSrc = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walkSrc(path.join(d, e.name)) : e.name.endsWith('.astro') ? [path.join(d, e.name)] : []);
  for (const file of walkSrc(path.join(root, 'src'))) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    let i = 0;
    if (lines[0]?.trim() === '---') { i = 1; while (i < lines.length && lines[i].trim() !== '---') i++; i++; }
    for (; i < lines.length - 1; i++) {
      const cur = lines[i].trimEnd();
      const next = lines[i + 1].trimStart();
      if (!/[A-Za-zÄÖÜäöüß0-9,.:;»“]$/.test(cur)) continue;
      if (!/^(\{|<(a|span|strong|em|b|i|code|time|abbr)\b)/.test(next)) continue;
      report(`${path.relative(root, file)}:${i + 2}`, 'Astro-Whitespace: Zeilenumbruch vor Ausdruck oder Inline-Element', `${cur.slice(-30)} ⏎ ${next.slice(0, 25)}`);
    }
  }
}

// ---- 6. Startseite ohne Markennamen von Arzneimitteln (Regel aus CLAUDE.md)
{
  const idx = path.join(root, 'dist/index.html');
  if (fs.existsSync(idx)) {
    const txt = fs.readFileSync(idx, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
    const m = txt.match(/wegovy|ozempic|mounjaro|saxenda|rybelsus|foundayo|zepbound|victoza|trulicity/i);
    if (m) report('index.html', 'Markenname auf der Startseite', m[0]);
  }
}

// ---- 1.–3. gebaute Seiten
const dist = path.join(root, 'dist');
if (!fs.existsSync(dist)) { console.error('dist/ fehlt – erst npm run build'); process.exit(2); }
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
const forbidden = [
  [/fachlich gepr[üu]ft/i, '„fachlich geprüft“ ohne Prüfer'],
  // Verneinungen („verhindert den Jojo-Effekt nicht“) sind erlaubt und ausgenommen
  [/verhindert den jojo-effekt(?! nicht)/i, 'verbotener Claim „verhindert den Jojo-Effekt“'],
  [/(?<!weder )ersetzt die (abnehm)?spritze(?! nicht)/i, 'verbotener Claim „ersetzt die Spritze“'],
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
const ignore = (c) => /@|http|M\.Sc|eClinicalMedicine|g\/kg|Stresemannstr|Vita2You|nachderspritz-21|PharmNet|BioSpace|ClinicalTrials|PubMed|KwikPen|FlexTouch|WhatsApp|LinkedIn/.test(c);
const seen = new Set();
for (const file of walk(dist)) {
  let raw = fs.readFileSync(file, 'utf8');
  const rel = path.relative(dist, file);
  raw = raw.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>|<sup>[\s\S]*?<\/sup>|<title>[\s\S]*?<\/title>|<ol class="mt-3 space-y-2[\s\S]*?<\/ol>/g, '');
  const text = decode(raw.replace(/<\/(p|li|h[1-6]|td|th|tr|dt|dd|dl|div|section|article|aside|summary|details|blockquote|label|span|a|button|nav|time|strong|small|em|figcaption|caption)>/g, '\n').replace(/<[^>]+>/g, ''));
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
