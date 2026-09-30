#!/usr/bin/env node
/**
 * Marktradar: automatischer Abruf. Läuft montags in .github/workflows/marktradar.yml und per Hand:
 *   node scripts/marktradar-fetch.mjs
 *
 * 1. PubMed (E-utilities): neue Studien der letzten 21 Tage zu GLP-1-Absetzen, Gewicht halten, Muskelmasse
 * 2. ClinicalTrials.gov (API v2): Studien mit Aktualisierung in den letzten 21 Tagen
 * 3. EMA-Produktseiten (EPAR): Änderungsdatum je Präparat; Änderung = Kandidat
 * 4. EMA-News (RSS, nach bestem Bemühen)
 *    → 1–4 landen in docs/RADAR-KANDIDATEN.json (Status „neu“; die Redaktions-Routine prüft und schreibt Einträge)
 * 5. BfArM / PharmNet.Bund, Lieferengpassmeldungen: Fundstellen je Wirkstoff
 *    → src/data/markt/lieferbarkeit.json (Zählung mit Datum; die Datenbank hat keine Schnittstelle, der Abruf kann scheitern)
 *
 * Es wird nichts ungeprüft als Text veröffentlicht. Jeder Schritt ist gegen Ausfälle abgesichert; das Skript endet
 * immer mit Exit 0, damit Teilergebnisse committet werden. Fehler stehen im Log der Datei und in der Konsole.
 */
import fs from 'node:fs';

const SUBSTANCES_EN = ['semaglutide', 'tirzepatide', 'liraglutide', 'orforglipron', 'retatrutide', 'cagrilintide'];
const NEWS_TERMS = ['semaglutid', 'tirzepatid', 'liraglutid', 'orforglipron', 'retatrutid', 'cagrilintid', 'wegovy', 'ozempic', 'mounjaro', 'saxenda', 'rybelsus', 'glp-1', 'obesity', 'weight management'];
const EPARS = {
  wegovy: 'https://www.ema.europa.eu/en/medicines/human/EPAR/wegovy',
  ozempic: 'https://www.ema.europa.eu/en/medicines/human/EPAR/ozempic',
  rybelsus: 'https://www.ema.europa.eu/en/medicines/human/EPAR/rybelsus',
  mounjaro: 'https://www.ema.europa.eu/en/medicines/human/EPAR/mounjaro',
  saxenda: 'https://www.ema.europa.eu/en/medicines/human/EPAR/saxenda',
};
const KAND = 'docs/RADAR-KANDIDATEN.json';
const LIEFER = 'src/data/markt/lieferbarkeit.json';
const DAYS = 21;
const today = new Date().toISOString().slice(0, 10);
const cutoff = new Date(Date.now() - DAYS * 864e5).toISOString().slice(0, 10);
const UA = 'nachderspritze-marktradar/1.0 (+https://nachderspritze.de/marktradar/)';

const say = (m) => console.log(m);

async function get(url, type = 'text') {
  const r = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: type === 'json' ? 'application/json' : 'text/html,application/xml,text/xml,*/*' },
    signal: AbortSignal.timeout(30000),
    redirect: 'follow',
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return type === 'json' ? r.json() : r.text();
}

const stripTags = (h) =>
  String(h)
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// ---- Kandidaten laden und mergen
const kand = fs.existsSync(KAND)
  ? JSON.parse(fs.readFileSync(KAND, 'utf8'))
  : { hinweis: 'Automatisch gesammelte Kandidaten für den Marktradar. Status: neu | geprueft | verworfen.', generated: null, items: [] };
kand.items = Array.isArray(kand.items) ? kand.items : [];
kand.emaState = kand.emaState && typeof kand.emaState === 'object' ? kand.emaState : {};
const known = new Map(kand.items.map((i) => [i.id, i]));
let added = 0;
function addCandidate(c) {
  if (known.has(c.id)) return false;
  known.set(c.id, { ...c, status: 'neu', found: today });
  added++;
  return true;
}

// ---- 1. PubMed
async function pubmed() {
  const query =
    `(${SUBSTANCES_EN.join(' OR ')} OR "GLP-1 receptor agonist" OR "GLP-1 receptor agonists") AND ` +
    `(discontinuation OR withdrawal OR cessation OR "weight regain" OR "weight maintenance" OR "lean mass" OR "muscle mass" OR "body composition")`;
  const base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
  const es = await get(`${base}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&reldate=${DAYS}&datetype=edat&retmax=40&sort=date&retmode=json`, 'json');
  const ids = es.esearchresult?.idlist ?? [];
  say(`PubMed: ${ids.length} Treffer in den letzten ${DAYS} Tagen`);
  if (!ids.length) return;
  const sum = await get(`${base}/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`, 'json');
  let n = 0;
  for (const id of ids) {
    const d = sum.result?.[id];
    if (!d || !d.title) continue;
    const doi = (d.articleids || []).find((a) => a.idtype === 'doi')?.value;
    const date = (d.sortpubdate || d.pubdate || '').slice(0, 10).replace(/\//g, '-');
    const pubtypes = Array.isArray(d.pubtype) ? d.pubtype.join(', ') : '';
    if (
      addCandidate({
        id: `pubmed:${id}`,
        quelle: 'PubMed',
        title: d.title,
        journal: d.fulljournalname || d.source || '',
        date,
        authors: (d.authors || []).slice(0, 3).map((a) => a.name).join(', '),
        pubtypes,
        doi: doi || null,
        url: doi ? `https://doi.org/${doi}` : `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      })
    )
      n++;
  }
  say(`PubMed: ${n} neue Kandidaten`);
}

// ---- 2. ClinicalTrials.gov
async function ctgov() {
  const q = `(${SUBSTANCES_EN.join(' OR ')}) AND (discontinuation OR withdrawal OR "weight regain" OR "weight maintenance" OR "off-treatment" OR "body composition")`;
  const url = `https://clinicaltrials.gov/api/v2/studies?query.term=${encodeURIComponent(q)}&fields=NCTId,BriefTitle,OverallStatus,LastUpdatePostDate,StartDate&pageSize=25&sort=LastUpdatePostDate:desc&format=json`;
  const j = await get(url, 'json');
  const studies = j.studies || [];
  let n = 0;
  for (const s of studies) {
    const p = s.protocolSection || {};
    const id = p.identificationModule?.nctId;
    const title = p.identificationModule?.briefTitle;
    const status = p.statusModule?.overallStatus;
    const lu = p.statusModule?.lastUpdatePostDateStruct?.date;
    if (!id || !lu || lu < cutoff) continue;
    if (addCandidate({ id: `ctgov:${id}:${lu}`, quelle: 'ClinicalTrials.gov', title: `${title} (${status})`, date: lu, url: `https://clinicaltrials.gov/study/${id}` })) n++;
  }
  say(`ClinicalTrials.gov: ${studies.length} Studien, ${n} neue Kandidaten (Aktualisierung seit ${cutoff})`);
}

// ---- 3. EMA-Produktseiten: Änderungsdatum
async function emaEpar() {
  for (const [name, url] of Object.entries(EPARS)) {
    try {
      const text = stripTags(await get(url));
      const m = text.match(/(?:Last updated|Latest update|Updated)[:\s]*([0-9]{1,2}[/.][0-9]{1,2}[/.][0-9]{4}|[0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{1,2} [A-Z][a-z]+ [0-9]{4})/i);
      const stamp = m ? m[1] : null;
      const prev = kand.emaState[name];
      if (stamp && prev && stamp !== prev) {
        addCandidate({ id: `ema:${name}:${stamp}`, quelle: 'EMA', title: `EMA-Produktinformation ${name} geändert (${prev} → ${stamp})`, date: today, url });
      }
      if (stamp) kand.emaState[name] = stamp;
      say(`EMA ${name}: ${stamp ?? 'kein Änderungsdatum gefunden'}`);
    } catch (e) {
      say(`EMA ${name}: ${e.message}`);
    }
  }
}

// ---- 4. EMA-News (RSS, best effort)
async function emaRss() {
  const feeds = ['https://www.ema.europa.eu/en/rss.xml', 'https://www.ema.europa.eu/en/news/rss.xml', 'https://www.ema.europa.eu/en/rss/news.xml'];
  for (const f of feeds) {
    try {
      const xml = await get(f);
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
      if (!items.length) {
        say(`EMA-News: ${f} ohne Einträge`);
        continue;
      }
      let n = 0;
      for (const it of items) {
        const pick = (tag) => (it.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`)) || [])[1]?.trim() || '';
        const t = stripTags(pick('title'));
        const link = pick('link');
        const desc = stripTags(pick('description'));
        const hay = `${t} ${desc}`.toLowerCase();
        if (!NEWS_TERMS.some((k) => hay.includes(k))) continue;
        let d = today;
        try { d = new Date(pick('pubDate')).toISOString().slice(0, 10); } catch { /* Datum bleibt heute */ }
        if (addCandidate({ id: `ema-news:${link || t}`, quelle: 'EMA', title: t, date: d, url: link, summary: desc.slice(0, 300) })) n++;
      }
      say(`EMA-News: ${f}: ${items.length} Meldungen, ${n} neue Kandidaten`);
      return;
    } catch (e) {
      say(`EMA-News: ${f} nicht erreichbar (${e.message})`);
    }
  }
}

// ---- 5. BfArM / PharmNet.Bund
async function bfarm() {
  const data = JSON.parse(fs.readFileSync(LIEFER, 'utf8'));
  data.log = Array.isArray(data.log) ? data.log : [];
  try {
    const text = stripTags(await get(data.quelle.url));
    const hasTable = /PZN/i.test(text) && /Wirkstoff/i.test(text) && /Meldung/i.test(text);
    if (!hasTable) {
      data.status = 'Übersichtsseite ohne Meldungstabelle abgerufen; Zählung nicht möglich';
      data.log.unshift({ date: today, text: 'Abruf ok, aber die Seite enthält keine Meldungstabelle (Formular oder Skript nötig). Fundstellen unverändert.' });
      say('BfArM: Seite ohne Tabelle');
    } else {
      for (const w of data.wirkstoffe) {
        const rx = new RegExp(`[^.;]{0,120}\\b${w.wirkstoff}\\w*[^.;]{0,160}`, 'gi');
        const found = [...new Set((text.match(rx) || []).map((s) => s.trim()))].slice(0, 5);
        w.treffer = found.length;
        w.zeilen = found;
        say(`BfArM: ${w.wirkstoff}: ${found.length} Fundstellen`);
      }
      data.stand = today;
      data.status = 'ok';
      data.log.unshift({ date: today, text: `Abruf ok. Fundstellen: ${data.wirkstoffe.map((w) => `${w.wirkstoff} ${w.treffer}`).join(', ')}.` });
    }
  } catch (e) {
    data.status = `Abruf fehlgeschlagen (${String(e.message).slice(0, 80)})`;
    data.log.unshift({ date: today, text: `Abruf fehlgeschlagen: ${String(e.message).slice(0, 120)}. Geprüfter Stand bleibt stehen.` });
    say(`BfArM: Fehler ${e.message}`);
  }
  data.log = data.log.slice(0, 12);
  fs.writeFileSync(LIEFER, JSON.stringify(data, null, 2) + '\n');
}

// ---- Ablauf
for (const [name, fn] of [['PubMed', pubmed], ['ClinicalTrials.gov', ctgov], ['EMA-EPAR', emaEpar], ['EMA-News', emaRss], ['BfArM', bfarm]]) {
  try {
    await fn();
  } catch (e) {
    say(`${name}: Fehler ${e.message}`);
  }
}
kand.generated = today;
kand.items = [...known.values()]
  .sort((a, b) => String(b.found || '').localeCompare(String(a.found || '')) || String(b.date || '').localeCompare(String(a.date || '')))
  .slice(0, 200);
fs.writeFileSync(KAND, JSON.stringify(kand, null, 2) + '\n');
say(`Kandidaten: ${added} neu, ${kand.items.length} insgesamt (${kand.items.filter((i) => i.status === 'neu').length} ungeprüft)`);
