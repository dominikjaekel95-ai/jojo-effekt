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
 */
import { erstellePlan, pruefePlan } from '../src/data/ernaehrungsplan.ts';
import { alleKombinationen, erlaubteVorlieben, planId, RANG } from '../src/data/ernaehrungsplan-id.mjs';
import { zutaten, gerichte } from '../src/data/ernaehrungsplan-rezepte.ts';
import { druckHtml } from '../src/lib/ernaehrungsplan-druck.ts';
import * as M from '../src/lib/plan-interaktiv/modell.ts';

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
  }
}

// URL: leere, kaputte und fremde Eingaben
{
  const k = M.kontext(erstellePlan({ ernaehrung: 'vegan', appetit: 'normal', gewicht: '70bis85', laktosefrei: true }));
  for (const s of ['', '...', 'x', 'xzz9', '0mh01', 'zmg01', '0fq99', 'e0fg01', '%3Cscript%3E', '0f' + 'g01'.repeat(50)])
    if (M.kodiere(k, M.dekodiere(k, s)) !== '') melde(`URL „${s}“ im veganen Plan nicht ignoriert`);
}

const ms = Math.round(performance.now() - t0);
console.log(
  `Pläne ${stat.plaene} (56 Grundpläne, je ohne, mit einer und mit zwei Vorlieben) · Aktionen ${stat.aktionen} (davon ${stat.appetit} Appetitwechsel, ${stat.vorschlaege} Vorschläge) · ` +
    `Plätze ${stat.plaetze}, Alternativen geprüft ${stat.alternativenGeprueft}, Plätze ohne Alternative ${stat.ohneAlternative}, mit nur einer ${stat.eineAlternative} · URL-Rundreisen ${stat.rundreisen} · ${ms} ms`,
);
if (fehler.length) {
  console.log(`${fehler.length} Fehler`);
  process.exit(1);
}
console.log('Plan interaktiv: alle Prüfungen bestanden');
