/**
 * Ernährungsplan: Druckfassung (PDF A4 und PDF fürs Handy) als HTML. Eine Funktion für Build und Browser: Die Planseite
 * /ernaehrungsplan/plan/<id>/ rendert damit den Grundplan, ihr Skript rendert mit Vorlieben (?v=…) neu. Auf dem
 * Bildschirm unsichtbar; im Druck ersetzt sie die Webansicht (Stile: src/styles/ernaehrungsplan-druck.css, Klassen ed-…).
 * `npm run pdf:ernaehrungsplan` druckt daraus <id>.pdf (A4) und <id>-handy.pdf (Klasse ed-handy auf <html>).
 *
 * Aufbau: Deckblatt (Planname, drei Zahlen, drei Regeln) · je Woche „auf einen Blick“ (7 Tage × 4 Mahlzeiten, nur
 * Gerichtnamen), Einkaufsliste (Packungen aus ernaehrungsplan-packungen.ts) und die Tage (A4: zwei pro Seite, Handy:
 * einer pro Seite) · Rezepte (nur Gerichte mit mindestens REZEPT_AB_MINUTEN Zubereitung) · Tauschen. Die letzte Seite
 * (Hinweise, Ausschlusskriterien, Pflichtsatz, Quellen) ist statisch und steht in plan/[id].astro.
 * Nur Darstellung: Generator, Gerichte und Zielwerte bleiben unverändert. Keine Kalorien, keine Präparatenamen.
 * Keine <header>/<footer>/<section>-Elemente (die globale Druck-CSS blendet header/footer aus und hält section zusammen).
 */
import { RANG } from '../data/ernaehrungsplan-id.mjs';
import { zahl, zutatName, gewichtLabel, ernaehrungOptionen, appetitOptionen, vorliebeLabel, type Plan, type Tag, type Woche, type GeplanteMahlzeit, type ZutatKey } from '../data/ernaehrungsplan.ts';
import { zutaten, type Einheit, type Zutat } from '../data/ernaehrungsplan-rezepte.ts';
import { karten, type Karte } from '../data/ernaehrungsplan-karten.ts';
import { packungen, packArtMehrzahl, abteilungen, vorrat, dazuEinkauf } from '../data/ernaehrungsplan-packungen.ts';

/** Rezept im PDF nur für Gerichte mit mindestens so vielen Minuten Zubereitung (Kochen, Braten, Backen). Schnelle,
 *  kalte Gerichte (Skyr-Bowl, Brot mit Belag, Salat aus dem Glas) stehen nur mit Zutaten auf der Tagesseite. */
export const REZEPT_AB_MINUTEN = 15;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
const nb = '\u00a0';
export const aufzaehlung = (xs: (string | number)[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} und ${xs[xs.length - 1]}`);
const pfeil = '<svg class="ed-pfeil" width="14" height="14" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h13M10 4l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';

function mengeText(n: number, einheit: Einheit) {
  if (einheit === 'Stück') return `${n}${nb}Stück`;
  if (n >= 1000) return `${zahl(n / 1000, 2)}${nb}${einheit === 'ml' ? 'l' : 'kg'}`;
  return `${n}${nb}${einheit}`;
}
const zt = (k: ZutatKey): Zutat => zutaten[k];
const proteinVon = (k: ZutatKey, menge: number) => (zt(k).einheit === 'Stück' ? menge * zt(k).protein : (menge / 100) * zt(k).protein);

/** Kurze Namen für Tagesseiten, Rezepte und „Tauschen“ (die vollen stehen in der Einkaufsliste): [Einzahl, Mehrzahl]. */
const KURZ: Partial<Record<ZutatKey, [string, string?]>> = {
  linsenGekocht: ['Linsen, gekocht'], kichererbsen: ['Kichererbsen, gekocht'], kidney: ['Kidneybohnen, gekocht'], weisseBohnen: ['Weiße Bohnen, gekocht'],
  thunfisch: ['Thunfisch, abgetropft'], edamame: ['Edamame (TK)'], garnelen: ['Garnelen (TK)'], ei: ['Ei', 'Eier'],
};
export function kurzName(k: ZutatKey, lf: boolean, mehrzahl = false) {
  const e = KURZ[k];
  return e ? (mehrzahl && e[1] ? e[1] : e[0]) : zutatName(k, lf, mehrzahl);
}
/** „120 g Linsen, gekocht“, „2 Eier“ */
export function portionText(k: ZutatKey, menge: number, lf: boolean) {
  const x = zt(k);
  return x.einheit === 'Stück' ? `${menge}${nb}${kurzName(k, lf, menge !== 1)}` : `${mengeText(menge, x.einheit)} ${kurzName(k, lf)}`;
}

export interface DruckOptionen { stand: string }

// ---------------------------------------------------------------------------------------------------------------
// Deckblatt

function deckblatt(plan: Plan, o: DruckOptionen) {
  const form = ernaehrungOptionen.find((x) => x.value === plan.ernaehrung)!.label;
  const appetit = appetitOptionen.find((x) => x.value === plan.appetit)!.label;
  const unter = [`Appetit ${appetit.toLowerCase()}`, gewichtLabel[plan.gewicht]];
  if (plan.vorlieben.length) unter.push(`Vorlieben: ${plan.vorlieben.map((v) => vorliebeLabel(v, plan.laktosefrei)).join(', ')}`);
  const lf = plan.laktosefrei && plan.ernaehrung !== 'vegan';
  const regel2 =
    plan.appetit === 'klein'
      ? '<strong>Kleine Portionen sind Absicht.</strong> Dafür gibt es proteinreiche Zwischenmahlzeiten; schaffst du eine Mahlzeit nicht, iss zuerst den Proteinteil.'
      : '<strong>Satt ist genug.</strong> Die Mengen sind Richtwerte: Bist du vorher satt, lass die Beilage liegen, nicht das Protein.';
  return `<div class="ed-deck">
<p class="ed-marke"><span>Nach der Spritze · Ernährungsplan</span><span>Stand ${esc(o.stand)}</span></p>
<h1 class="ed-titel">Dein Ernährungsplan</h1>
<p class="ed-unter">${esc(unter.join(' · '))}</p>
<dl class="ed-zahlen">
<div><dt>Ernährungsform</dt><dd>${esc(form)}${lf ? '<span class="ed-zahl-zusatz">laktosefrei</span>' : ''}</dd></div>
<div><dt>Tage</dt><dd>${plan.tage.length}</dd></div>
<div class="ed-zahl-protein"><dt>Protein pro Tag</dt><dd>${plan.ziel}${nb}g</dd></div>
</dl>
<div class="ed-regeln">
<h2 class="ed-h4">Drei Regeln</h2>
<ol>
<li><strong>Protein zuerst.</strong> Iss bei jeder Mahlzeit zuerst die Proteinquelle, dann das Gemüse, dann den Rest.</li>
<li>${regel2}</li>
<li><strong>Tauschen ist erlaubt.</strong> Tage dürfen die Reihenfolge wechseln; Proteinquellen tauschst du mit der Liste „Tauschen“ am Ende.</li>
</ol>
</div>
<p class="ed-aufbau">So ist der Plan aufgebaut: für jede Woche zuerst der Überblick<span class="ed-nur-a4"> zum Aufhängen</span>, dann die Einkaufsliste, dann <span class="ed-nur-a4">zwei Tage pro Seite</span><span class="ed-nur-handy">ein Tag pro Seite</span>. Danach Rezepte, Tauschen und Hinweise.</p>
</div>`;
}

// ---------------------------------------------------------------------------------------------------------------
// Woche auf einen Blick: 7 Tage × 4 Mahlzeiten, nur Gerichtnamen

const name = (m: GeplanteMahlzeit) => `<span class="ed-bl-n">${m.bevorzugt ? `<span class="ed-fav">${esc(m.name)}</span>` : esc(m.name)}</span>`;

function blick(w: Woche) {
  const spalten: [string, (t: Tag) => GeplanteMahlzeit[]][] = [
    ['Frühstück', (t) => t.mahlzeiten.filter((m) => m.slot === 'fruehstueck')],
    ['Mittag', (t) => t.mahlzeiten.filter((m) => m.slot === 'mittag')],
    ['Abend', (t) => t.mahlzeiten.filter((m) => m.slot === 'abend')],
    ['Zwischendurch', (t) => t.mahlzeiten.filter((m) => m.slot === 'snack')],
  ];
  const zeilen = w.tage
    .map(
      (t) =>
        `<div class="ed-bl-zeile"><p class="ed-bl-tag">Tag ${t.nr}</p>${spalten
          .map(([titel, f]) => {
            const ms = f(t);
            return `<p class="ed-bl-zelle"><span class="ed-bl-l">${titel}</span>${ms.length ? ms.map(name).join('') : '<span class="ed-bl-n ed-hell">–</span>'}</p>`;
          })
          .join('')}</div>`,
    )
    .join('');
  return `<div class="ed-blick">
<div class="ed-kopf"><h2 class="ed-h">Woche ${w.nr} auf einen Blick</h2><p class="ed-kopf-r">Tag ${w.tage[0].nr} bis ${w.tage[w.tage.length - 1].nr}</p></div>
<div class="ed-bl-raster">
<div class="ed-bl-zeile ed-bl-spalten" aria-hidden="true"><p></p>${spalten.map(([t]) => `<p>${t}</p>`).join('')}</div>
${zeilen}
</div>
</div>`;
}

// ---------------------------------------------------------------------------------------------------------------
// Einkaufsliste: Packungen statt Grammzahlen, wo es Sinn ergibt

export interface Posten { text: string; klein?: string }

function posten(k: ZutatKey, menge: number, lf: boolean): Posten {
  const x = zt(k);
  const pk = packungen[k];
  if (pk) {
    const name = lf && x.laktose === 'ersetzbar' ? pk.nameLaktosefrei ?? zutatName(k, true) : pk.name ?? (x.einheit === 'Stück' && x.plural ? x.plural : x.name);
    // Gleiche Packungen einer Größe: die kleinste Gesamtmenge, die reicht; bei Gleichstand weniger Packungen
    const { groesse, n } = pk.groessen
      .map((g) => ({ groesse: g, n: Math.ceil(menge / g) }))
      .sort((a, b) => a.groesse * a.n - b.groesse * b.n || a.n - b.n)[0];
    // Stückware (Eier, Wraps): die Stückzahl der Packungen, z. B. „10 Eier (Größe M)“
    if (x.einheit === 'Stück') return { text: `${n * groesse}${nb}${name}`, klein: `im Plan ${menge}` };
    let text = `${n}${nb}${n === 1 ? pk.art : packArtMehrzahl[pk.art]} ${name}`;
    if (pk.zeigen !== false) text += `, ${n > 1 ? 'je ' : ''}${pk.etwa ? 'etwa ' : ''}${mengeText(groesse, x.einheit)}${pk.zusatz ? ` ${pk.zusatz}` : ''}`;
    return { text, klein: `im Plan ${mengeText(menge, x.einheit)}` };
  }
  if (x.einheit === 'Stück') return { text: `${Math.ceil(menge)}${nb}${zutatName(k, lf, Math.ceil(menge) !== 1)}` };
  return { text: `${mengeText(Math.ceil(menge / 50) * 50, x.einheit)} ${zutatName(k, lf)}` };
}

const kasten = '<span class="ed-kasten" aria-hidden="true"></span>';
const postenHtml = (p: Posten) => `<li>${kasten}<span class="ed-ek-text">${esc(p.text)}${p.klein ? ` <span class="ed-ek-klein">${esc(p.klein)}</span>` : ''}</span></li>`;

/** Ein Posten der Einkaufsliste mit Schlüssel (Zutat oder „dazu:Name“), z. B. für die Häkchen der Planseite. */
export interface EinkaufPosten extends Posten { key: string }
export interface EinkaufDaten { gruppen: { titel: string; posten: EinkaufPosten[] }[]; frisch: EinkaufPosten[]; vorrat: string[] }

/** Einkaufsliste einer Woche als Daten: Abteilungen mit Packungen, Obst/Gemüse/Kräuter, Vorrat. Druckfassung und
 *  interaktive Planseite (src/lib/plan-interaktiv/) nutzen dieselbe Rechnung. */
export function einkaufDaten(w: Woche, lf: boolean): EinkaufDaten {
  const summen = new Map<ZutatKey, number>();
  for (const t of w.tage) for (const mz of t.mahlzeiten) for (const p of mz.positionen) summen.set(p.key, (summen.get(p.key) ?? 0) + p.menge);
  const sortiert = (keys: ZutatKey[]): EinkaufPosten[] =>
    keys.map((k) => ({ k, p: posten(k, summen.get(k)!, lf) })).sort((a, b) => zutatName(a.k, lf).localeCompare(zutatName(b.k, lf), 'de')).map((x) => ({ key: x.k, ...x.p }));
  const gruppen = abteilungen
    .map(([ab, titel]) => ({ titel: titel as string, posten: sortiert([...summen.keys()].filter((k) => zt(k).abteilung === ab)) }))
    .filter((g) => g.posten.length);
  const gemuese = sortiert([...summen.keys()].filter((k) => zt(k).abteilung === 'gemuese'));
  const fuer = (aus: boolean) => [...new Set(w.dazu.filter((d) => vorrat.has(d) === aus).map((d) => dazuEinkauf[d] ?? d))].sort((a, b) => a.localeCompare(b, 'de'));
  return { gruppen, frisch: [...gemuese, ...fuer(false).map((d) => ({ key: `dazu:${d}`, text: d }))], vorrat: fuer(true) };
}

function einkauf(w: Woche, lf: boolean) {
  const { gruppen, frisch, vorrat: ausVorrat } = einkaufDaten(w, lf);
  return `<div class="ed-einkauf">
<div class="ed-kopf"><h2 class="ed-h">Einkaufsliste Woche ${w.nr}</h2><p class="ed-kopf-r">für Tag ${w.tage[0].nr} bis ${w.tage[w.tage.length - 1].nr}</p></div>
<p class="ed-intro">Auf ganze Packungen aufgerundet, klein dahinter die Menge im Plan; lose Ware auf 50${nb}g.</p>
<div class="ed-ek-gruppen">${gruppen.map((g) => `<div class="ed-ek-gruppe"><h3 class="ed-label">${g.titel}</h3><ul>${g.posten.map(postenHtml).join('')}</ul></div>`).join('')}</div>
<div class="ed-ek-frisch"><h3 class="ed-label">Obst, Gemüse und Kräuter <span class="ed-hell">· ohne feste Menge, nach Hunger</span></h3><ul>${frisch.map(postenHtml).join('')}</ul></div>
${ausVorrat.length ? `<p class="ed-ek-vorrat"><span class="ed-label">Aus dem Vorrat</span> ${esc(ausVorrat.join(', '))}</p>` : ''}
</div>`;
}

// ---------------------------------------------------------------------------------------------------------------
// Tage: Gerichtname groß, Mengen in einer hellen zweiten Zeile, Protein als kleine Zahl rechts

function tag(t: Tag, rezeptNr: Map<string, number>, lf: boolean) {
  const zeilen = t.mahlzeiten
    .map((m) => {
      const mengen = m.positionen.map((p) => esc(portionText(p.key, p.menge, lf))).join(', ');
      const nr = rezeptNr.get(m.id);
      const zusatz = [m.dazu ? `dazu ${esc(m.dazu)}` : '', nr ? `Rezept ${nr}` : ''].filter(Boolean);
      return `<li class="ed-mz${m.slot === 'snack' ? ' ed-mz-snack' : ''}"><p class="ed-mz-zeit">${esc(m.titel)}</p><p class="ed-mz-g">${m.protein}${nb}g</p><p class="ed-mz-name"><span class="${m.bevorzugt ? 'ed-fav' : ''}">${esc(m.name)}</span></p><p class="ed-mz-menge"><span class="ed-mz-zeit-kurz">${esc(m.titel)} · </span>${mengen}${zusatz.length ? ` · ${zusatz.join(' · ')}` : ''}</p></li>`;
    })
    .join('');
  return `<div class="ed-tag">
<div class="ed-kopf"><h2 class="ed-h">Tag ${t.nr}</h2><p class="ed-kopf-r">${t.protein}${nb}g Protein</p></div>
<ol class="ed-mz-liste">${zeilen}</ol>
</div>`;
}

// ---------------------------------------------------------------------------------------------------------------
// Rezepte: nur Gerichte, die eins brauchen; in der Reihenfolge des ersten Vorkommens

interface Rezept { nr: number; m: GeplanteMahlzeit; karte: Karte; tage: number[] }

export function rezepteImPlan(plan: Plan): Rezept[] {
  const liste: Rezept[] = [];
  const bekannt = new Map<string, Rezept>();
  for (const t of plan.tage)
    for (const m of t.mahlzeiten) {
      if (m.slot === 'snack') continue;
      const karte = karten[m.id];
      if (!karte || karte.zeit < REZEPT_AB_MINUTEN) continue;
      const r = bekannt.get(m.id);
      if (r) r.tage.push(t.nr);
      else {
        const neu = { nr: liste.length + 1, m, karte, tage: [t.nr] };
        bekannt.set(m.id, neu);
        liste.push(neu);
      }
    }
  return liste;
}

function rezept(r: Rezept, lf: boolean, kopf: string) {
  const schritte = (lf && r.karte.schritteLaktosefrei) || r.karte.schritte;
  const zutatenListe = r.m.positionen.map((p) => `<li>${esc(kurzName(p.key, lf, p.menge > 1))}</li>`).join('');
  return `<div class="ed-rz">${kopf}
<p class="ed-rz-nr">Rezept ${r.nr}</p>
<h3 class="ed-rz-name"><span class="${r.m.bevorzugt ? 'ed-fav' : ''}">${esc(r.m.name)}</span></h3>
<p class="ed-rz-meta">etwa ${r.karte.zeit} Minuten · an Tag ${aufzaehlung(r.tage)} · Mengen auf der Tagesseite</p>
<div class="ed-rz-spalten">
<div><p class="ed-label">Zutaten</p><ul class="ed-rz-zutaten">${zutatenListe}${r.m.dazu ? `<li class="ed-hell">dazu ${esc(r.m.dazu)}</li>` : ''}</ul></div>
<div><p class="ed-label">So geht’s</p><ol class="ed-rz-schritte">${schritte.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>${r.karte.tipp ? `<p class="ed-rz-tipp">${esc(r.karte.tipp)}</p>` : ''}</div>
</div>
</div>`;
}

function rezepte(plan: Plan, liste: Rezept[]) {
  if (!liste.length) return '';
  const kopf = `<div class="ed-kopf"><h2 class="ed-h">Rezepte</h2><p class="ed-kopf-r">${liste.length} Gerichte</p></div>
<p class="ed-intro">Für die Gerichte, die gekocht, gebraten oder gebacken werden. Die Nummer steht auch auf der Tagesseite. Die Mengen ändern sich von Tag zu Tag ein wenig; sie stehen beim jeweiligen Tag.</p>`;
  const seiten: string[] = [];
  for (let i = 0; i < liste.length; i += 2)
    seiten.push(`<div class="ed-rz-seite">${liste.slice(i, i + 2).map((r, j) => rezept(r, plan.laktosefrei, i + j === 0 ? kopf : '')).join('')}</div>`);
  return `<div class="ed-rezepte">${seiten.join('')}</div>`;
}

// ---------------------------------------------------------------------------------------------------------------
// Tauschen: „statt X → Y oder Z“ mit etwa gleich viel Protein (± 3 g), passend zu Ernährungsform und Laktose

type Kat = 'fleisch' | 'fisch' | 'milch' | 'ei' | 'soja' | 'huelsen' | 'pulver';
/** Proteinquellen, die in „Tauschen“ vorkommen können, nach Art (die Reihenfolge ist auch die der Zeilen). */
const KATEGORIE: Partial<Record<ZutatKey, Kat>> = {
  haehnchen: 'fleisch', pute: 'fleisch', rinderhack: 'fleisch',
  lachs: 'fisch', raeucherlachs: 'fisch', kabeljau: 'fisch', thunfisch: 'fisch', garnelen: 'fisch',
  magerquark: 'milch', skyr: 'milch', huettenkaese: 'milch', kaese: 'milch', feta: 'milch',
  ei: 'ei',
  tofu: 'soja', raeuchertofu: 'soja', tempeh: 'soja', edamame: 'soja', sojagranulat: 'soja',
  linsenGekocht: 'huelsen', kichererbsen: 'huelsen', kidney: 'huelsen', weisseBohnen: 'huelsen', roteLinsen: 'huelsen', hummus: 'huelsen',
  molkenprotein: 'pulver', erbsenprotein: 'pulver',
};
const KAT_FOLGE: Kat[] = ['fleisch', 'fisch', 'milch', 'ei', 'soja', 'huelsen', 'pulver'];
/** Reihenfolge, in der Tauschpartner gesucht werden: erst ähnlich (Y), dann eine andere Art (Z). */
const NAEHE: Record<Kat, Kat[]> = {
  fleisch: ['fleisch', 'soja', 'fisch', 'ei'],
  fisch: ['fisch', 'soja', 'ei', 'fleisch'],
  milch: ['milch', 'ei', 'soja'],
  ei: ['milch', 'soja', 'huelsen'],
  soja: ['soja', 'huelsen'],
  huelsen: ['huelsen', 'soja'],
  pulver: ['milch', 'soja', 'pulver'],
};
/** Sinnvolle Portionen als Tauschpartner (g, ml oder Stück); sonst 40 bis 300. */
const GRENZE: Partial<Record<ZutatKey, [number, number]>> = { kaese: [20, 60], ei: [1, 4], sojagranulat: [20, 80], molkenprotein: [15, 40], erbsenprotein: [15, 40] };
/** Partner, die nur nehmen soll, wer nichts Näheres findet (Käse in großer Menge, trockenes Sojagranulat). */
const NACHRANG: Partial<Record<ZutatKey, number>> = { kaese: 2, sojagranulat: 1.5 };
function rundePortion(a: number, einheit: Einheit) {
  if (einheit === 'Stück') return Math.round(a);
  return a >= 100 ? Math.round(a / 10) * 10 : Math.round(a / 5) * 5;
}
export interface TauschZeile { statt: string; durch: string[]; protein: number }

/** Bis zu zwölf Zeilen „statt X → Y oder Z“ für die Proteinquellen, die im Plan am häufigsten vorkommen. X in der
 *  häufigsten Menge des Plans; Y und Z liefern höchstens 3 g mehr oder weniger Protein und passen zu Ernährungsform
 *  und Laktose (vegan: nur vegane Partner). */
export function tauschZeilen(plan: Plan): TauschZeile[] {
  const lf = plan.laktosefrei;
  const erlaubt = (k: ZutatKey) => RANG[zt(k).form] >= RANG[plan.ernaehrung] && !(lf && zt(k).laktose === 'enthalten');
  // Wie oft und in welcher Menge jede Proteinquelle im Plan vorkommt
  const nutzung = new Map<ZutatKey, number[]>();
  for (const t of plan.tage) for (const m of t.mahlzeiten) for (const p of m.positionen) if (KATEGORIE[p.key]) nutzung.set(p.key, [...(nutzung.get(p.key) ?? []), p.menge]);
  const partner = (Object.keys(KATEGORIE) as ZutatKey[]).filter((k) => zt(k).tausch && erlaubt(k));
  const zeilen: (TauschZeile & { n: number; kat: Kat })[] = [];
  for (const [k, mengen] of nutzung) {
    const haeufig = new Map<number, number>();
    for (const m of mengen) haeufig.set(m, (haeufig.get(m) ?? 0) + 1);
    const portion = [...haeufig.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0][0];
    const p = proteinVon(k, portion);
    if (p < 8) continue;
    const kandidaten = partner
      .filter((c) => c !== k)
      .map((c) => {
        const menge = rundePortion(zt(c).einheit === 'Stück' ? p / zt(c).protein : (p / zt(c).protein) * 100, zt(c).einheit);
        const [lo, hi] = GRENZE[c] ?? [40, 300];
        const abw = Math.abs(proteinVon(c, menge) - p);
        return { c, menge, ok: menge >= lo && menge <= hi && abw <= 3, wert: abw / 3 + (nutzung.has(c) ? 0 : 1) + (NACHRANG[c] ?? 0) };
      })
      .filter((c) => c.ok)
      .sort((a, b) => a.wert - b.wert);
    const wahl: typeof kandidaten = [];
    for (const kat of NAEHE[KATEGORIE[k]!]) {
      const c = kandidaten.find((c) => KATEGORIE[c.c] === kat);
      if (c) wahl.push(c);
      if (wahl.length === 2) break;
    }
    if (!wahl.length) continue;
    zeilen.push({ statt: portionText(k, portion, lf), durch: wahl.map((w) => portionText(w.c, w.menge, lf)), protein: Math.round(p), n: mengen.length, kat: KATEGORIE[k]! });
  }
  // Reihum je Art die häufigste, damit Fleisch, Fisch, Milch, Eier und Pflanzliches vorkommen; dann nach Art geordnet
  zeilen.sort((a, b) => b.n - a.n || b.protein - a.protein);
  const gewaehlt: typeof zeilen = [];
  for (let runde = 0; gewaehlt.length < 12 && runde < zeilen.length; runde++)
    for (const kat of KAT_FOLGE) {
      const z = zeilen.filter((x) => x.kat === kat)[runde];
      if (z && gewaehlt.length < 12) gewaehlt.push(z);
    }
  return gewaehlt
    .sort((a, b) => KAT_FOLGE.indexOf(a.kat) - KAT_FOLGE.indexOf(b.kat) || b.n - a.n)
    .map(({ statt, durch, protein }) => ({ statt, durch, protein }));
}

function tauschen(plan: Plan) {
  const zeilen = tauschZeilen(plan);
  return `<div class="ed-tausch">
<div class="ed-kopf"><h2 class="ed-h">Tauschen</h2><p class="ed-kopf-r">etwa gleich viel Protein</p></div>
<p class="ed-intro">Jede Zeile liefert etwa gleich viel Protein (höchstens 3${nb}g Unterschied). Tausche innerhalb einer Mahlzeit; Beilagen und Gemüse bleiben.</p>
<ul class="ed-ts-liste">${zeilen
    .map((z) => `<li><p class="ed-ts-text"><span class="ed-ts-statt">statt ${esc(z.statt)}</span> ${pfeil} <span>${z.durch.map(esc).join(' oder ')}</span></p><p class="ed-ts-g">${z.protein}${nb}g</p></li>`)
    .join('')}</ul>
</div>`;
}

// ---------------------------------------------------------------------------------------------------------------

/** Die Druckfassung bis „Tauschen“ (die letzte Seite mit Hinweisen und Quellen steht statisch in plan/[id].astro). */
export function druckHtml(plan: Plan, o: DruckOptionen): string {
  const liste = rezepteImPlan(plan);
  const rezeptNr = new Map(liste.map((r) => [r.m.id, r.nr]));
  const wochen = plan.wochen
    .map((w) => {
      const paare: string[] = [];
      for (let i = 0; i < w.tage.length; i += 2) paare.push(`<div class="ed-tage">${w.tage.slice(i, i + 2).map((t) => tag(t, rezeptNr, plan.laktosefrei)).join('')}</div>`);
      return `<div class="ed-woche">${blick(w)}${einkauf(w, plan.laktosefrei)}${paare.join('')}</div>`;
    })
    .join('');
  return `${deckblatt(plan, o)}${wochen}${rezepte(plan, liste)}${tauschen(plan)}`;
}
