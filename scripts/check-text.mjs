#!/usr/bin/env node
/**
 * Textprüfung über den gebauten Output (dist/):
 * 1. fehlende Leerzeichen (Astro schneidet Leerzeichen an Zeilenumbrüchen vor Ausdrücken und Inline-Elementen weg)
 * 2. Platzhalter in eckigen Klammern
 * 3. verbotene Formulierungen (Health-Claims, „fachlich geprüft“ ohne Prüfer)
 * 4. Frontmatter-Längen der Artikel (metaTitle ≤ 65, description ≤ 165)
 * 7. Ärzte und Angebot (CLAIMS.md Abschnitt H, seit 06.10.2026): Bezüge auf eigene Ärzte oder Mediziner im Team, Abwandlungen
 *    des Arztsatzes, Prüf-Versprechen („ärztlich geprüft“, „gegengelesen“), Set-Reste und Wirkversprechen zu Programm oder
 *    Starterpaket, im Build-Output (ohne datenschutz/ und ueber/, dessen Text nur Dominik ändert) und in den Markdown-Quellen von Wissen und Glossar (ohne Entwürfe).
 *    Ortsprüfung: Der Arztsatz (site.medicalTeamSentence) steht nur im Footer, in der AuthorBox und auf der Über-Seite, nie
 *    auf einer Danke-Seite. Erlaubt bleiben der Pflichtsatz site.doctorSentence und normale Sätze über Ärztinnen und Ärzte.
 * Aufruf: npm run check:text   (nach npm run build)
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let problems = 0;
const report = (file, label, ctx) => { problems++; console.log(`${file} | ${label} | …${ctx}…`); };
const seen = new Set();

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

// ---- 7. Ärzte und Angebot (CLAIMS.md Abschnitt H). In JavaScript gelten \b und \w nur für ASCII; `uni` ersetzt beide durch
// Unicode-Fassungen, damit „Ärztin“ und „ärztlich“ als Wörter erkannt werden.
const B = '(?:(?<![\\p{L}\\p{N}])(?=[\\p{L}\\p{N}])|(?<=[\\p{L}\\p{N}])(?![\\p{L}\\p{N}]))';
const uni = (src, flags = 'u') => new RegExp(src.replaceAll('\\w', '[\\p{L}\\p{N}_]').replaceAll('\\b', B), flags);
const arztSatz = (fs.readFileSync(path.join(root, 'src/data/site.ts'), 'utf8').match(/medicalTeamSentence:\s*'([^']+)'/) || [])[1] ?? '';
if (!arztSatz) report('src/data/site.ts', 'medicalTeamSentence nicht gefunden', '');
const arztKern = 'berät uns ein Arzt';
const aerzte = [
  [uni(String.raw`\b(unser|unsere|unserem|unseren|unserer|eigene|eigenen|eigener)\s+(Ärzt\w*|Arzt\w*|Mediziner\w*|Fachärzt\w*)`, 'iu'), 'Arztbezug: eigene Ärzte (nur der Satz aus CLAIMS H)'],
  [uni(String.raw`\b(Ärzt\w*|Arzt|Mediziner\w*)\s+(im|aus dem|aus unserem|in unserem)\s+(Team|Netzwerk|Beirat|Projekt)\b`, 'iu'), 'Arztbezug: Ärzte im Team (nur der Satz aus CLAIMS H)'],
  [uni(String.raw`\b(Ärzte|Mediziner|Medizin)(team|netzwerk|beirat|expert\w*)|\bmedizinische[nrs]?\s+(Beirat|Team|Expert\w*)\b`, 'iu'), 'Arztbezug: Ärzteteam, Netzwerk, Beirat, Experten'],
  [uni(String.raw`\b(studierte[nr]?|erfahrene[nr]?)\s+(Mediziner\w*|Ärzt\w*)`, 'iu'), 'Arztbezug: studierte oder erfahrene Mediziner'],
  [uni(String.raw`\bunter\s+(der\s+)?(Beratung|Begleitung|Leitung)\s+(von\s+)?(erfahrene[nr]?\s+)?(Ärzt|Mediziner)`, 'iu'), 'Arztbezug: unter Beratung von Ärzten'],
  [uni(String.raw`\b(berät|beraten|unterstützt|unterstützen|begleitet|begleiten|prüft|prüfen)\s+uns\b`, 'iu'), 'Arztsatz nicht wörtlich (nur site.medicalTeamSentence)'],
  [uni(String.raw`\b(ärztlich|medizinisch|klinisch)\s+(geprüft|empfohlen|betreut|begleitet|getestet)\w*`, 'iu'), 'Prüf-Versprechen „ärztlich/medizinisch/klinisch geprüft …“'],
  [uni(String.raw`\b(Ärzt\w*|Arzt|Mediziner\w*)\b[^.!?\n]{0,60}\b(geprüft|freigegeben|mitentwickelt)\b`, 'iu'), 'Prüf-Versprechen durch Ärzte'],
  [uni('gegengelesen', 'iu'), 'verboten: „gegengelesen“'],
];
const angebot = [
  [uni(String.raw`\b[Uu]nser(em)?\s+Set\b|[Vv]orbestell|\b43\s?€|\bCharge\b|\bim Stick\b|Rezeptur steht`), 'Set-Rest (Angebot ist seit 06.10.2026 das 12-Wochen-Programm)'],
  [uni(String.raw`\b(Programm|Starterpaket)\b[^.!?\n]{0,100}?\b(garantiert|[Mm]it Sicherheit|funktioniert|wirkt)\b(?!\s+nicht)`), 'Wirkversprechen zu Programm oder Starterpaket'],
];
/** Muster aus Abschnitt 7 auf einen Text anwenden; der wörtliche Arztsatz wird vorher herausgenommen. */
const pruefeAerzte = (text, where) => {
  const flat = text.replace(/[ \t]+/g, ' ').split(arztSatz).join(' ');
  for (const [rx, label] of [...aerzte, ...angebot]) {
    const m = flat.match(rx);
    if (!m) continue;
    const i = m.index ?? 0;
    const k = where + label;
    if (!seen.has(k)) { seen.add(k); report(where, label, flat.slice(Math.max(0, i - 30), i + m[0].length + 30).replace(/\n/g, ' ')); }
  }
};
// Markdown-Quellen (Wissen, Glossar) ohne Entwürfe; der Arztsatz gehört nie in den Artikeltext
for (const sub of ['src/content/wissen', 'src/content/glossar']) {
  const dir = path.join(root, sub);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    const t = fs.readFileSync(path.join(dir, f), 'utf8');
    if (/^draft:\s*true/m.test(t)) continue;
    if (t.includes(arztKern)) report(`${sub}/${f}`, 'Arztsatz im Artikeltext (steht automatisch in der AuthorBox)', arztKern);
    pruefeAerzte(t, `${sub}/${f}`);
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
const ignore = (c) => /@|http|M\.Sc|eClinicalMedicine|g\/kg|Stresemannstr|Vita2You|nachderspritz-21|PharmNet|BioSpace|ClinicalTrials|PubMed|KwikPen|FlexTouch|WhatsApp|LinkedIn|MailerLite/.test(c);
for (const file of walk(dist)) {
  let raw = fs.readFileSync(file, 'utf8');
  const rel = path.relative(dist, file).split(path.sep).join('/');
  // 7. Ortsprüfung Arztsatz: nur Footer, AuthorBox (<aside class="ab">) und Über-Seite, nie auf einer Danke-Seite
  {
    const zaehle = (html) => decode(html).split(arztKern).length - 1;
    if (/(^|\/)danke\/index\.html$/.test(rel)) {
      if (zaehle(raw)) report(rel, 'Arztsatz auf einer Danke-Seite (auch nicht im Footer: footerArzt={false})', arztKern);
    } else if (rel !== 'ueber/index.html' && zaehle(raw.replace(/<footer[\s\S]*?<\/footer>|<aside class="ab"[\s\S]*?<\/aside>/g, ''))) {
      report(rel, 'Arztsatz außerhalb von Footer, AuthorBox und Über-Seite', arztKern);
    }
  }
  raw = raw.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>|<sup>[\s\S]*?<\/sup>|<title>[\s\S]*?<\/title>|<ol class="mt-3 space-y-2[\s\S]*?<\/ol>/g, '');
  const text = decode(raw.replace(/<\/(p|li|h[1-6]|td|th|tr|dt|dd|dl|div|section|article|aside|summary|details|blockquote|label|span|a|button|nav|time|strong|small|em|figcaption|caption)>/g, '\n').replace(/<[^>]+>/g, ''));
  for (const [rx, label] of forbidden) {
    const m = text.match(rx);
    if (m) { const k = rel + label; if (!seen.has(k)) { seen.add(k); report(rel, label, m[0]); } }
  }
  // Über-Seite: Den Text schreibt und gibt nur Dominik frei (CLAUDE.md), deshalb keine Arztbezug-Prüfung dort.
  if (!rel.startsWith('datenschutz/') && !rel.startsWith('ueber/')) pruefeAerzte(text, rel);
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
