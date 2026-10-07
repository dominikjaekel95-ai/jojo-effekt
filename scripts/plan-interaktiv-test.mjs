#!/usr/bin/env node
/**
 * Prüft die Logik der interaktiven Planseite (src/lib/plan-interaktiv/modell.ts) für alle 56 Pläne.
 * Aufruf: npm run test:plan   (oder node scripts/plan-interaktiv-test.mjs; Node 22.18 oder neuer, liest TypeScript direkt)
 * Nicht Teil von check:all. Braucht keinen Build und keinen Browser.
 *
 * 1. Grundzustand = Generator: Mahlzeiten, Mengen, Protein je Tag, „dazu“-Listen, Rechengrundlage und die Druckfassung
 *    (druckHtml) aus dem Zustand sind gleich wie aus erstellePlan.
 * 2. Alternativen (jeder Platz jedes Tages, ohne und mit Vorlieben): gleiche Mahlzeit, Ernährungsform, Laktose, nicht
 *    ausgeblendet, nicht schon am selben Tag, höchstens 5 g Unterschied; bevorzugte Gerichte werden nicht zugunsten
 *    nicht bevorzugter übergangen; Gerichte vom Vortag oder Folgetag nur, wenn es sonst weniger als zwei gäbe.
 * 3. Nach jeder Aktion (Verschieben, Tauschen, Nicht mein Fall, Vorschlag übernehmen, Appetit wechseln) stimmt das Protein
 *    jedes Tages mit einer unabhängigen Neuberechnung aus Rezepten und Zutaten (hier im Skript) überein.
 * 4. URL-Zustand: kodiere → dekodiere ergibt denselben Zustand, und dekodiere → kodiere dieselbe Zeichenkette.
 * 5. „Als PDF senden“: Zustand → Formularfeld `zustand` (senden.ts) → Prüfung der API → Link der Mail-Automation
 *    (…/plan/{$plan}/?v={$vorlieben}&s={$zustand}&pdf=1) → derselbe Zustand. Länge nach typischen Aktionen (drei Tausche,
 *    zwei Verschiebungen, einmal „Nicht mein Fall“) und nach den 24 Zufallsschritten aus 3., für alle Pläne; über 250
 *    Zeichen geht das Feld leer mit (Blatt sagt das, die Mail zeigt den Plan mit Vorlieben ohne die Änderungen).
 * 6. api/ernaehrungsplan.js mit nachgebautem MailerLite: Felder plan, vorlieben, zustand, quelle; Rückfall bei 422 (erst
 *    ohne quelle, dann ohne zustand); Warteliste nur mit Häkchen, ohne MAILERLITE_GROUP_WARTELISTE kommt der Plan trotzdem;
 *    keine Adressen und keine Zustände im Log.
 * 7. Browser-PDF (src/lib/plan-pdf/pdf.ts, hier in Node mit den Schriften aus public/fonts/druck/) für sechs Pläne mit
 *    Änderungen, A4 und Handy: kein Block größer als eine Seite, Mindestzahl Seiten, Seitengröße, nur eingebettete
 *    TrueType-Schriften (keine Type 3).
 */
import fs from 'node:fs';
import { PDFDocument, PDFDict, PDFName } from 'pdf-lib';
import { erstellePlan, pruefePlan } from '../src/data/ernaehrungsplan.ts';
import { alleKombinationen, erlaubteVorlieben, planId, kombination, leseVorlieben, RANG } from '../src/data/ernaehrungsplan-id.mjs';
import { zutaten, gerichte } from '../src/data/ernaehrungsplan-rezepte.ts';
import { druckHtml, rezepteImPlan } from '../src/lib/ernaehrungsplan-druck.ts';
import * as M from '../src/lib/plan-interaktiv/modell.ts';
import { zustandFeld, planAdresse, ZUSTAND_MAX } from '../src/lib/plan-interaktiv/senden.ts';
import { erzeugePdf } from '../src/lib/plan-pdf/pdf.ts';
import { SCHNITTE, schriftDatei } from '../src/lib/plan-pdf/schriften.ts';
import { leseZustand, feldsaetze, POST } from '../api/ernaehrungsplan.js';

const t0 = performance.now();
const fehler = [];
const melde = (text) => {
  if (fehler.length < 40) console.log('FEHLER', text);
  fehler.push(text);
};
const gleich = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const stat = { plaene: 0, aktionen: 0, alternativenGeprueft: 0, plaetze: 0, ohneAlternative: 0, eineAlternative: 0, rundreisen: 0, appetit: 0, vorschlaege: 0 };

// ---- Unabhängige Rechnung, nur aus den Rohdaten (nicht aus modell.ts)
const GERICHT = Object.fromEntries(gerichte.map((g) => [g.id, g]));
function rundeMenge(m, einheit) {
  if (einheit === 'Stück') return Math.max(1, Math.round(m));
  if (m < 50) return Math.max(5, Math.round(m / 5) * 5);
  return Math.round(m / 10) * 10;
}
function proteinUnabhaengig(id, faktor) {
  let s = 0;
  for (const [k, m] of GERICHT[id].zutaten) {
    const z = zutaten[k];
    const menge = faktor === 1 ? m : rundeMenge(m * faktor, z.einheit);
    s += z.einheit === 'Stück' ? menge * z.protein : (menge * z.protein) / 100;
  }
  return Math.round(s);
}
/** Protein je Tag aus dem Zustand: Hauptmahlzeiten mit dem Faktor ihres Faktortags im Grundplan, Zwischenmahlzeiten fest. */
const tageUnabhaengig = (grundplan, z) => z.tage.map((t) => t.reduce((s, p) => s + proteinUnabhaengig(p.id, p.slot === 'snack' ? 1 : grundplan.tage[p.f].faktor), 0));
const formVon = (id) => GERICHT[id].zutaten.reduce((r, [k]) => Math.min(r, RANG[zutaten[k].form]), 3);
const mitLaktose = (id) => GERICHT[id].zutaten.some(([k]) => zutaten[k].laktose === 'enthalten');
const basisVon = (id) => GERICHT[id].zutaten.reduce((s, [k, m]) => s + (zutaten[k].einheit === 'Stück' ? m * zutaten[k].protein : (m * zutaten[k].protein) / 100), 0);
/** Darf das Gericht in diesem Plan auf diesen Platz? (Ernährungsform, Laktose, Sojafassungen, kleine Zwischenmahlzeiten) */
function erlaubt(plan, id, slot) {
  const g = GERICHT[id];
  if (!g || !g.slots.includes(slot)) return false;
  if (formVon(id) < RANG[plan.ernaehrung]) return false;
  if (plan.laktosefrei && mitLaktose(id)) return false;
  if (g.ersatz && !plan.laktosefrei) return false;
  if (slot === 'snack' && plan.appetit === 'klein' && basisVon(id) < 8) return false;
  return true;
}

// ---- Prüfungen
function pruefeZustand(was, k, z) {
  const soll = tageUnabhaengig(k.plan, z);
  const plan = M.alsPlan(k, z);
  for (let d = 0; d < z.tage.length; d++) {
    const ist = M.tagProtein(k, z, d);
    if (ist !== soll[d] || plan.tage[d].protein !== soll[d]) melde(`${was}: Tag ${d + 1} Protein ${ist}/${plan.tage[d].protein} statt ${soll[d]}`);
    const ids = z.tage[d].map((p) => p.id);
    if (new Set(ids).size !== ids.length) melde(`${was}: Tag ${d + 1} hat ein Gericht doppelt`);
    for (const p of z.tage[d]) {
      if (!erlaubt(k.plan, p.id, p.slot)) melde(`${was}: Tag ${d + 1} ${p.titel}: ${p.id} passt nicht zum Plan`);
      if (z.aus.includes(p.id)) melde(`${was}: Tag ${d + 1}: ausgeblendetes ${p.id} steht im Plan`);
    }
  }
  // Rundreise über die URL
  const s = M.kodiere(k, z);
  if (!/^[0-9a-z.]*$/.test(s)) melde(`${was}: URL-Zustand mit unerlaubten Zeichen: ${s}`);
  const zurueck = M.dekodiere(k, s);
  if (!gleich(zurueck, z)) melde(`${was}: URL-Rundreise ändert den Zustand (${s})`);
  if (M.kodiere(k, zurueck) !== s) melde(`${was}: URL-Rundreise ändert die Zeichenkette (${s})`);
  stat.rundreisen++;
}

function pruefeAlternativen(was, k, z) {
  for (let d = 0; d < z.tage.length; d++) {
    for (const p of z.tage[d]) {
      stat.plaetze++;
      const alt = M.alternativen(k, z, d, p.code);
      if (alt.length === 0) stat.ohneAlternative++;
      if (alt.length === 1) stat.eineAlternative++;
      const f = p.slot === 'snack' ? 1 : k.plan.tage[p.f].faktor;
      const jetzt = proteinUnabhaengig(p.id, f);
      const heute = new Set(z.tage[d].filter((q) => q !== p).map((q) => q.id));
      const nachbarn = new Set([...(z.tage[d - 1] ?? []), ...(z.tage[d + 1] ?? [])].map((q) => q.id));
      for (const a of alt) {
        stat.alternativenGeprueft++;
        const wo = `${was} Tag ${d + 1} ${p.titel} ${p.id} → ${a.id}`;
        if (!erlaubt(k.plan, a.id, p.slot)) melde(`${wo}: Ernährungsform, Laktose oder Mahlzeit passt nicht`);
        if (z.aus.includes(a.id)) melde(`${wo}: ausgeblendet`);
        if (heute.has(a.id) || a.id === p.id) melde(`${wo}: schon am selben Tag`);
        const g = proteinUnabhaengig(a.id, f);
        if (Math.abs(g - jetzt) > M.TAUSCH_G) melde(`${wo}: ${g} g statt ${jetzt} ± ${M.TAUSCH_G} g`);
        if (g !== a.protein) melde(`${wo}: angezeigt ${a.protein} g, gerechnet ${g} g`);
      }
      // Vorlieben: Ein bevorzugtes passendes Gericht (gleiche Klasse: im Zielbereich, Nachbartag) wird nicht übergangen.
      const alle = M.kandidaten(k, z, d, p.code).filter((c) => Math.abs(c.diff) <= M.TAUSCH_G);
      const angeboten = new Set(alt.map((a) => a.id));
      for (const a of alt.filter((x) => !x.bevorzugt)) {
        const besser = alle.find((c) => c.bevorzugt && !angeboten.has(c.id) && c.imZiel === a.imZiel && c.nachbar === a.nachbar);
        if (besser) melde(`${was} Tag ${d + 1} ${p.titel}: Vorliebe ${besser.id} übergangen für ${a.id}`);
      }
      const ohneNachbar = alle.filter((c) => !nachbarn.has(c.id));
      if (ohneNachbar.length >= 2 && alt.some((a) => nachbarn.has(a.id))) melde(`${was} Tag ${d + 1} ${p.titel}: Gericht vom Nachbartag angeboten, obwohl vermeidbar`);
    }
  }
}

// ---- 5. Zustand → Formularfeld → Link aus der Mail → Zustand
const laengen = { typisch: [], zufall: [] };
const zuLang = [];
function pruefeSenden(was, kombi, vorlieben, k, z, art) {
  const s = M.kodiere(k, z);
  laengen[art].push(s.length);
  const feld = zustandFeld(s);
  if (leseZustand(feld) !== feld) melde(`${was}: API verwirft das Formularfeld (${feld})`);
  if (s.length > ZUSTAND_MAX) {
    zuLang.push(`${was} (${s.length})`);
    if (feld !== '') melde(`${was}: Zustand mit ${s.length} Zeichen geht nicht leer mit`);
  } else if (feld !== s) melde(`${was}: Formularfeld weicht vom Zustand ab`);
  // Link der MailerLite-Automation aus den Feldern plan, vorlieben, zustand
  const u = new URL(`https://nachderspritze.de/ernaehrungsplan/plan/${k.plan.id}/?v=${vorlieben.join(',')}&s=${leseZustand(feld)}&pdf=1`);
  const k2 = M.kontext(erstellePlan({ ...kombi, vorlieben: leseVorlieben(u.searchParams.get('v') ?? '', kombi.ernaehrung, kombi.laktosefrei) }));
  if (!gleich(M.dekodiere(k2, u.searchParams.get('s') ?? ''), feld ? z : k2.grund)) melde(`${was}: Link aus der Mail ergibt einen anderen Plan`);
  // Adresse auf dem Deckblatt des PDFs und in der Mail ohne Newsletter (ohne Längengrenze)
  const a = new URL(planAdresse(`https://nachderspritze.de/ernaehrungsplan/plan/${k.plan.id}/`, vorlieben, s));
  if (!gleich(M.dekodiere(k2, a.searchParams.get('s') ?? ''), z)) melde(`${was}: Planadresse ergibt einen anderen Plan`);
}

// Zufall mit festem Startwert (gleiches Ergebnis bei jedem Lauf)
let saat = 20261007;
const zufall = (n) => {
  saat = (saat * 1103515245 + 12345) % 2147483648;
  return saat % n;
};
const wahl = (xs) => xs[zufall(xs.length)];

for (const kombi of alleKombinationen()) {
  const erlaubtV = erlaubteVorlieben(kombi.ernaehrung, kombi.laktosefrei);
  const varianten = [[], [erlaubtV[zufall(erlaubtV.length)]], [erlaubtV[0], erlaubtV[erlaubtV.length - 1]]];
  for (const vorlieben of varianten) {
    const antworten = { ...kombi, vorlieben };
    const plan = erstellePlan(antworten);
    const k = M.kontext(plan);
    const was = `${plan.id}${vorlieben.length ? ` v=${vorlieben.join('+')}` : ''}`;
    stat.plaene++;

    // 1. Grundzustand = Generator
    const p0 = M.alsPlan(k, k.grund);
    if (!gleich(p0.tage, plan.tage)) melde(`${was}: Tage aus dem Zustand weichen vom Generator ab`);
    if (!gleich(p0.wochen.map((w) => w.dazu), plan.wochen.map((w) => w.dazu))) melde(`${was}: „dazu“-Liste weicht ab`);
    if (!gleich(p0.grundlage, plan.grundlage)) melde(`${was}: Rechengrundlage weicht ab`);
    if (!gleich(p0.faktor, plan.faktor)) melde(`${was}: Faktorbereich weicht ab`);
    if (druckHtml(p0, { stand: 'x' }) !== druckHtml(plan, { stand: 'x' })) melde(`${was}: Druckfassung aus dem Zustand weicht ab`);
    if (M.kodiere(k, k.grund) !== '') melde(`${was}: Grundzustand kodiert nicht leer`);
    if (pruefePlan({ ...plan }).length) melde(`${was}: Grundplan selbst fehlerhaft`);
    pruefeZustand(`${was} Grundzustand`, k, k.grund);
    pruefeAlternativen(`${was} Grundzustand`, k, k.grund);

    // 3. Aktionen in fester Zufallsfolge
    let z = k.grund;
    for (let schritt = 0; schritt < 24; schritt++) {
      const art = schritt % 6;
      const d = zufall(z.tage.length);
      const p = wahl(z.tage[d]);
      let neu = null;
      let name = '';
      if (art === 0 || art === 3) {
        const ziele = M.zielTage(z, d, p.code);
        const e = wahl(ziele);
        neu = M.verschiebe(z, d, e, p.code);
        name = `verschiebe Tag ${d + 1}↔${e + 1} ${p.code}`;
        if (neu) {
          const vorher = z.tage.flatMap((t) => t.filter((q) => q.code === p.code).map((q) => `${q.id}/${q.f}`)).sort();
          const nachher = neu.tage.flatMap((t) => t.filter((q) => q.code === p.code).map((q) => `${q.id}/${q.f}`)).sort();
          if (!gleich(vorher, nachher)) melde(`${was} ${name}: Gerichte gehen verloren`);
          const summeVorher = z.tage[d].concat(z.tage[e]).reduce((s, q) => s + M.platzProtein(k, q), 0);
          const summeNachher = neu.tage[d].concat(neu.tage[e]).reduce((s, q) => s + M.platzProtein(k, q), 0);
          if (summeVorher !== summeNachher) melde(`${was} ${name}: Protein beider Tage zusammen ändert sich`);
        }
      } else if (art === 1 || art === 4) {
        const alt = M.alternativen(k, z, d, p.code);
        if (alt.length) {
          const a = wahl(alt);
          neu = M.tausche(k, z, d, p.code, a.id);
          name = `tausche Tag ${d + 1} ${p.code} → ${a.id}`;
          if (neu && Math.abs(M.tagProtein(k, neu, d) - M.tagProtein(k, z, d)) > M.TAUSCH_G) melde(`${was} ${name}: Tag ändert sich um mehr als ${M.TAUSCH_G} g`);
        }
      } else if (art === 2) {
        neu = M.blendeAus(k, z, p.id);
        name = `nicht mein Fall ${p.id}`;
        if (neu && neu.tage.some((t) => t.some((q) => q.id === p.id))) melde(`${was} ${name}: Gericht steht noch im Plan`);
        if (neu && !neu.aus.includes(p.id)) melde(`${was} ${name}: nicht als ausgeblendet gemerkt`);
      } else {
        // Vorschlag für einen Tag außerhalb des Zielbereichs übernehmen
        const tag = z.tage.findIndex((_, x) => !M.imZiel(k, M.tagProtein(k, z, x)));
        if (tag >= 0) {
          const v = M.vorschlag(k, z, tag);
          if (v) {
            neu = M.tausche(k, z, tag, v.code, v.nach);
            name = `Vorschlag Tag ${tag + 1}`;
            stat.vorschlaege++;
            if (neu && !M.imZiel(k, M.tagProtein(k, neu, tag))) melde(`${was} ${name}: Tag danach nicht im Zielbereich`);
            if (neu && M.tagProtein(k, neu, tag) !== v.summe) melde(`${was} ${name}: angekündigte Summe stimmt nicht`);
          }
        }
      }
      if (!neu) continue;
      z = neu;
      stat.aktionen++;
      pruefeZustand(`${was} nach ${name}`, k, z);
      if (schritt % 6 === 5) pruefeAlternativen(`${was} nach ${name}`, k, z);
    }

    pruefeSenden(`${was} nach 24 Zufallsschritten`, kombi, vorlieben, k, z, 'zufall');

    // Appetit wechseln: gleiche Ernährungsform, Laktose, Gewicht; Zustand übertragen
    const anderer = kombi.appetit === 'klein' ? 'normal' : 'klein';
    const idNeu = planId(kombi.ernaehrung, anderer, kombi.gewicht, kombi.laktosefrei);
    const kNeu = M.kontext(erstellePlan({ ...antworten, appetit: anderer }));
    if (kNeu.plan.id !== idNeu) melde(`${was}: Appetitwechsel auf ${kNeu.plan.id} statt ${idNeu}`);
    const zNeu = M.uebertrage(k, z, kNeu);
    stat.appetit++;
    stat.aktionen++;
    if (!gleich(zNeu.aus, z.aus)) melde(`${was} Appetitwechsel: ausgeblendete Gerichte gehen verloren`);
    pruefeZustand(`${was} nach Appetitwechsel auf ${idNeu}`, kNeu, zNeu);
    pruefeAlternativen(`${was} nach Appetitwechsel auf ${idNeu}`, kNeu, zNeu);
    // Hin und zurück mit unverändertem Zustand ergibt wieder den Grundplan
    if (M.kodiere(kNeu, M.uebertrage(k, k.grund, kNeu)) !== '') melde(`${was}: Appetitwechsel ohne Änderungen ist nicht der Grundplan`);

    // Typische Sitzung vor „Als PDF senden“: drei Tausche, zwei Verschiebungen, einmal „Nicht mein Fall“
    let typ = k.grund;
    for (let i = 0; i < 3; i++) {
      const d = zufall(typ.tage.length);
      const p = wahl(typ.tage[d]);
      const alt = M.alternativen(k, typ, d, p.code);
      if (alt.length) typ = M.tausche(k, typ, d, p.code, wahl(alt).id) ?? typ;
    }
    for (let i = 0; i < 2; i++) {
      const d = zufall(typ.tage.length);
      const p = wahl(typ.tage[d]);
      const ziele = M.zielTage(typ, d, p.code);
      if (ziele.length) typ = M.verschiebe(typ, d, wahl(ziele), p.code) ?? typ;
    }
    typ = M.blendeAus(k, typ, wahl(typ.tage[zufall(typ.tage.length)]).id) ?? typ;
    pruefeSenden(`${was} typisch`, kombi, vorlieben, k, typ, 'typisch');
  }
}

// ---- 6. API mit nachgebautem MailerLite
{
  const z = '0ff101.1ff260';
  const faelle = [[z, z], ['', ''], ['0FF101', ''], ['0ff101<x>', ''], ['a'.repeat(250), 'a'.repeat(250)], ['a'.repeat(251), ''], [undefined, ''], [['0ff101'], '']];
  for (const [ein, aus] of faelle) if (leseZustand(ein) !== aus) melde(`API: leseZustand(${JSON.stringify(ein)?.slice(0, 20)}) ergibt „${leseZustand(ein)}“`);
  const reihe = feldsaetze('ek21', 'lachs', true, z).map((x) => Object.keys(x).join('+')).join(' > ');
  if (reihe !== 'plan+vorlieben+zustand+quelle > plan+vorlieben+zustand > plan+vorlieben+quelle > plan+vorlieben > plan+quelle > plan') melde(`API: Rückfall-Reihenfolge ${reihe}`);

  const aufrufe = [];
  let antworten = [];
  const fetchVorher = globalThis.fetch;
  globalThis.fetch = async (url, init = {}) => {
    aufrufe.push({ url: String(url), method: init.method ?? 'GET', body: init.body ? JSON.parse(init.body) : null });
    const r = antworten.shift() ?? { status: 200 };
    return new Response(r.status === 204 ? null : JSON.stringify(r.json ?? {}), { status: r.status });
  };
  const env = { MAILERLITE_API_KEY: 'test', MAILERLITE_GROUP_NEWSLETTER: 'nl', MAILERLITE_GROUP_ERNAEHRUNGSPLAN: 'ep', MAILERLITE_GROUP_WARTELISTE: 'wl' };
  const envVorher = Object.fromEntries(Object.keys(env).map((x) => [x, process.env[x]]));
  Object.assign(process.env, env);
  const logs = [];
  const konsole = { log: console.log, error: console.error };
  console.log = (...a) => logs.push(a.join(' '));
  console.error = (...a) => logs.push(a.join(' '));
  const sende = (felder) =>
    POST(new Request('https://nachderspritze.de/api/ernaehrungsplan/', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(felder) }));
  const basis = { ernaehrung: 'pescetarisch', appetit: 'klein', gewicht: '92', vorlieben: 'lachs', email: 'Test.Person@Example.org', eignung: 'ja', einwilligung: 'ja', website: '' };
  const api = [];
  try {
    // a) neue Adresse mit Warteliste; Feld zustand fehlt im Konto: 422, 422, dann ohne zustand
    aufrufe.length = 0;
    antworten = [{ status: 404 }, { status: 422 }, { status: 422 }, { status: 201, json: { data: { id: 'S1' } } }, { status: 200 }];
    let res = await sende({ ...basis, zustand: z, warteliste: 'ja' });
    let neu = aufrufe.filter((x) => x.method === 'POST' && x.url.endsWith('/subscribers'));
    if (res.status !== 303 || res.headers.get('location') !== '/ernaehrungsplan/danke/') api.push(`a) Antwort ${res.status} ${res.headers.get('location')}`);
    if (!gleich(neu.map((x) => x.body.fields), [{ plan: 'ek21', vorlieben: 'lachs', zustand: z, quelle: 'ernaehrungsplan' }, { plan: 'ek21', vorlieben: 'lachs', zustand: z }, { plan: 'ek21', vorlieben: 'lachs', quelle: 'ernaehrungsplan' }])) api.push(`a) Feldsätze ${JSON.stringify(neu.map((x) => x.body.fields))}`);
    if (!neu.every((x) => x.body.status === 'unconfirmed' && gleich(x.body.groups, ['nl', 'ep']) && x.body.email === 'test.person@example.org')) api.push('a) Status, Gruppen oder Adresse falsch');
    if (aufrufe.at(-1)?.url !== 'https://connect.mailerlite.com/api/subscribers/S1/groups/wl' || aufrufe.at(-1)?.method !== 'POST') api.push(`a) Warteliste nicht zugewiesen (${aufrufe.at(-1)?.url})`);
    // b) ohne Häkchen keine Warteliste
    aufrufe.length = 0;
    antworten = [{ status: 404 }, { status: 201, json: { data: { id: 'S2' } } }];
    res = await sende({ ...basis, zustand: z });
    if (aufrufe.some((x) => x.url.includes('/groups/wl'))) api.push('b) Warteliste ohne Häkchen');
    // c) Warteliste gewünscht, Variable fehlt: Plan kommt trotzdem, Log sagt es
    delete process.env.MAILERLITE_GROUP_WARTELISTE;
    aufrufe.length = 0;
    antworten = [{ status: 404 }, { status: 201, json: { data: { id: 'S3' } } }];
    res = await sende({ ...basis, zustand: z, warteliste: 'ja' });
    if (res.headers.get('location') !== '/ernaehrungsplan/danke/' || aufrufe.some((x) => x.url.includes('/groups/'))) api.push(`c) ohne Wartelisten-Gruppe: ${res.headers.get('location')}`);
    if (!logs.some((l) => l.includes('MAILERLITE_GROUP_WARTELISTE fehlt'))) api.push('c) fehlende Variable nicht im Log');
    process.env.MAILERLITE_GROUP_WARTELISTE = 'wl';
    // d) bestehende Adresse: Felder mit zustand aktualisieren, Gruppen neu, Warteliste
    aufrufe.length = 0;
    antworten = [{ status: 200, json: { data: { id: 'S4', status: 'active' } } }, { status: 200 }, { status: 204 }, { status: 200 }, { status: 200 }, { status: 200 }];
    res = await sende({ ...basis, zustand: z, warteliste: 'ja' });
    const put = aufrufe.find((x) => x.method === 'PUT');
    if (!gleich(put?.body?.fields, { plan: 'ek21', vorlieben: 'lachs', zustand: z })) api.push(`d) PUT ${JSON.stringify(put?.body)}`);
    if (aufrufe.at(-1)?.url !== 'https://connect.mailerlite.com/api/subscribers/S4/groups/wl') api.push('d) Warteliste fehlt');
    // e) ungültiger Zustand: Feld leer (löscht einen alten)
    aufrufe.length = 0;
    antworten = [{ status: 404 }, { status: 201, json: { data: { id: 'S5' } } }];
    res = await sende({ ...basis, zustand: '0ff101<script>' });
    if (aufrufe[1]?.body?.fields?.zustand !== '') api.push(`e) ungültiger Zustand übernommen: ${aufrufe[1]?.body?.fields?.zustand}`);
    // f) Pflicht-Häkchen fehlen
    res = await sende({ ...basis, einwilligung: '' });
    if (res.headers.get('location') !== '/ernaehrungsplan/danke/?fehler=eingabe') api.push('f) ohne Einwilligung angenommen');
    // Log: keine Adressen, keine Zustände
    if (logs.some((l) => /example\.org|0ff101/i.test(l))) api.push(`Log enthält Adresse oder Zustand: ${logs.find((l) => /example\.org|0ff101/i.test(l))}`);
  } finally {
    Object.assign(console, konsole);
    globalThis.fetch = fetchVorher;
    for (const [x, w] of Object.entries(envVorher)) if (w === undefined) delete process.env[x];
    else process.env[x] = w;
  }
  for (const a of api) melde(`API: ${a}`);
  stat.api = `${logs.length} Log-Zeilen, z. B. „${logs[0]}“`;
}

// ---- 7. Browser-PDF in Node: Überlauf, Seiten, Seitengröße, Schriften
const pdfStat = [];
{
  const schriften = Object.fromEntries(Object.keys(SCHNITTE).map((x) => [x, fs.readFileSync(new URL(`../public/fonts/druck/${schriftDatei(x)}`, import.meta.url))]));
  const schluss = { hinweise: [[{ t: 'Hinweis.', s: 'fett' }, { t: ' Text' }, { t: '1', hoch: true }]], grenzen: [[{ t: 'Grenzen und Pflichtsatz.' }]], quellen: [{ text: 'Quelle.', url: 'https://example.org/' }] };
  for (const id of ['ek01', 'ek08', 'ek11', 'ek24', 'ek40', 'ek52']) {
    const kombi = kombination(id);
    const vorlieben = erlaubteVorlieben(kombi.ernaehrung, kombi.laktosefrei).slice(-1);
    const k = M.kontext(erstellePlan({ ...kombi, vorlieben }));
    let z = k.grund;
    for (let d = 0; d < z.tage.length; d++)
      z.tage[d].forEach((p, i) => {
        if ((d + i) % 3) return;
        const a = M.alternativen(k, z, d, p.code)[0];
        if (a) z = M.tausche(k, z, d, p.code, a.id) ?? z;
      });
    const plan = M.alsPlan(k, z);
    const rezepte = rezepteImPlan(plan).length;
    for (const format of ['a4', 'handy']) {
      const b = {};
      const bytes = await erzeugePdf({ plan, format, stand: 'Oktober 2026', schluss, adresse: planAdresse(`https://nachderspritze.de/ernaehrungsplan/plan/${id}/`, vorlieben, M.kodiere(k, z)) }, schriften, b);
      const was = `PDF ${id} ${format}`;
      if (b.ueberlauf) melde(`${was}: ${b.ueberlauf} Block größer als eine Seite`);
      const doc = await PDFDocument.load(bytes);
      if (doc.getPageCount() !== b.seiten) melde(`${was}: ${doc.getPageCount()} statt ${b.seiten} Seiten`);
      // Mindestens: Deckblatt, je Woche Überblick, Einkauf und Tage (A4 vier Seiten, Handy sieben), Rezepte, Tauschen, Hinweise
      const min = format === 'a4' ? 1 + 2 * 6 + Math.ceil(rezepte / 2) + 2 : 2 + 2 * 9 + rezepte + 2;
      if (b.seiten < min) melde(`${was}: ${b.seiten} Seiten, erwartet mindestens ${min}`);
      const groessen = [...new Set(doc.getPages().map((p) => `${Math.round((p.getWidth() / 72) * 25.4)}x${Math.round((p.getHeight() / 72) * 25.4)}`))];
      if (format === 'a4' ? groessen.join() !== '210x297' : groessen.length !== 1 || groessen[0] !== `90x${b.hoeheMm}` || b.hoeheMm < 160) melde(`${was}: Seitengröße ${groessen.join(', ')} mm`);
      const typen = new Set();
      let dateien = 0;
      for (const [, obj] of doc.context.enumerateIndirectObjects()) {
        if (!(obj instanceof PDFDict)) continue;
        const typ = obj.get(PDFName.of('Type'))?.toString();
        if (typ === '/Font') typen.add(obj.get(PDFName.of('Subtype'))?.toString());
        if (typ === '/FontDescriptor' && obj.get(PDFName.of('FontFile2'))) dateien++;
      }
      if ([...typen].sort().join() !== '/CIDFontType2,/Type0' || dateien !== Object.keys(SCHNITTE).length) melde(`${was}: Schriften ${[...typen].join(', ')}, eingebettet ${dateien}`);
      pdfStat.push(`${id} ${format} ${b.seiten} S.${format === 'handy' ? ` ${b.hoeheMm} mm` : ''} ${Math.round(bytes.length / 1024)} kB`);
    }
  }
}

// URL: leere, kaputte und fremde Eingaben
{
  const k = M.kontext(erstellePlan({ ernaehrung: 'vegan', appetit: 'normal', gewicht: '70bis85', laktosefrei: true }));
  for (const s of ['', '...', 'x', 'xzz9', '0mh01', 'zmg01', '0fq99', 'e0fg01', '%3Cscript%3E', '0f' + 'g01'.repeat(50)])
    if (M.kodiere(k, M.dekodiere(k, s)) !== '') melde(`URL „${s}“ im veganen Plan nicht ignoriert`);
}

const ms = Math.round(performance.now() - t0);
const median = (xs) => xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)] ?? 0;
console.log(
  `Zustand für „Als PDF senden“ (Feld zustand, höchstens ${ZUSTAND_MAX} Zeichen): typisch Median ${median(laengen.typisch)}, max ${Math.max(...laengen.typisch)} · ` +
    `nach 24 Zufallsschritten Median ${median(laengen.zufall)}, max ${Math.max(...laengen.zufall)} · länger als ${ZUSTAND_MAX}: ${zuLang.length} von ${laengen.typisch.length + laengen.zufall.length}` +
    (zuLang.length ? ` (z. B. ${zuLang.slice(0, 3).join('; ')}; Feld geht leer mit, das Blatt sagt es)` : ''),
);
console.log(`API: ${stat.api}`);
console.log(`PDF: ${pdfStat.join(' · ')}`);
console.log(
  `Pläne ${stat.plaene} (56 Grundpläne, je ohne, mit einer und mit zwei Vorlieben) · Aktionen ${stat.aktionen} (davon ${stat.appetit} Appetitwechsel, ${stat.vorschlaege} Vorschläge) · ` +
    `Plätze ${stat.plaetze}, Alternativen geprüft ${stat.alternativenGeprueft}, Plätze ohne Alternative ${stat.ohneAlternative}, mit nur einer ${stat.eineAlternative} · URL-Rundreisen ${stat.rundreisen} · ${ms} ms`,
);
if (fehler.length) {
  console.log(`${fehler.length} Fehler`);
  process.exit(1);
}
console.log('Plan interaktiv: alle Prüfungen bestanden');
