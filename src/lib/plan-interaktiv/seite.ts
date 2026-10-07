/**
 * Interaktive Planseite /ernaehrungsplan/plan/<id>/: Tagesansicht (Handy ein Tag pro Bildschirm mit Wischen, Desktop
 * die Woche als Raster), Verschieben (Ziehen oder Menü „Mit Tag … tauschen“), Tauschen und „Nicht mein Fall“,
 * Proteinbalken je Tag mit Vorschlag, Appetit-Regler, Einkaufsliste mit Häkchen, Rezepte am Gericht. „Als PDF senden“
 * und „PDF herunterladen“ (echtes PDF aus dem aktuellen Zustand, A4 und Handy): senden.ts. Regeln und URL-Zustand:
 * modell.ts; Ziehen: ziehen.ts; Stile: src/styles/plan-interaktiv.css (Klassen pi-…). Strg+P druckt weiter die
 * Druckfassung mit dem aktuellen Zustand.
 *
 * Ohne JavaScript bleibt der statische Plan aus dem Build stehen; dieses Skript ersetzt nur den Wochenteil. Nichts verlässt
 * den Browser: Der Zustand steht in der Adresse (?v=…&s=…, history.replaceState nur nach einer Aktion), die Häkchen der
 * Einkaufsliste zusätzlich im localStorage (try/catch). Erst „Als PDF senden“ schickt Plan, Vorlieben und Zustand an
 * api/ernaehrungsplan.js. Plausible: „Plan interaktiv“ mit `aktion` (bei pdf zusätzlich `format`), einmal je Aktionstyp
 * und Seitenaufruf, ohne Planinhalte.
 */
import { erstellePlan, kombination, leseVorlieben, planId, vorliebeLabel, zutatName, type Antworten, type GeplanteMahlzeit, type Plan, type Vorliebe } from '../../data/ernaehrungsplan.ts';
import { karten } from '../../data/ernaehrungsplan-karten.ts';
import { blickHtml, grundlageHtml } from '../ernaehrungsplan-ansicht.ts';
import { druckHtml, einkaufDaten, type EinkaufPosten } from '../ernaehrungsplan-druck.ts';
import * as M from './modell.ts';
import { ziehen } from './ziehen.ts';
import { verbindeSenden } from './senden.ts';

type Aktion = 'verschieben' | 'tauschen' | 'appetit' | 'einkauf' | 'pdf' | 'senden';
type Plausible = (name: string, o?: { props?: Record<string, string>; callback?: () => void }) => void;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
const nb = '\u00a0';
/** Pfeil für Zeilenlisten wie src/components/Pfeil.astro */
const PFEIL = '<svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h13M10 4l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
const rm = () => document.documentElement.classList.contains('rm');

const speicher = {
  lies<T>(key: string): T | null {
    try {
      return JSON.parse(localStorage.getItem(key) ?? 'null') as T | null;
    } catch {
      return null;
    }
  },
  schreib(key: string, wert: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(wert));
    } catch {
      /* ohne Speicher (privates Fenster, gesperrt): Häkchen gelten bis zum Neuladen */
    }
  },
};

/** Plausible-Ereignis einmal je Aktionstyp und Seitenaufruf (pdf einmal je Format); `danach` läuft spätestens nach
 *  400 ms (vor einem Seitenwechsel). `extra`: weitere Properties ohne Planinhalte (format=a4|handy). */
const gemeldet = new Set<string>();
function melde(aktion: Aktion, danach?: () => void, extra: Record<string, string> = {}) {
  const p = (window as unknown as { plausible?: Plausible }).plausible;
  const schluessel = [aktion, ...Object.values(extra)].join(':');
  if (gemeldet.has(schluessel) || typeof p !== 'function') return danach?.();
  gemeldet.add(schluessel);
  const props = { aktion, ...extra };
  if (!danach) return p('Plan interaktiv', { props });
  let fertig = false;
  const weiter = () => {
    if (fertig) return;
    fertig = true;
    danach();
  };
  p('Plan interaktiv', { props, callback: weiter });
  setTimeout(weiter, 400);
}

/** Mengen einer Mahlzeit für n Portionen, z. B. „360 g Skyr natur“ */
const mengen = (m: GeplanteMahlzeit, lf: boolean, n: number) =>
  m.positionen.map((p) => (p.einheit === 'Stück' ? `${p.menge * n}${nb}${zutatName(p.key, lf, p.menge * n !== 1)}` : `${p.menge * n}${nb}${p.einheit} ${zutatName(p.key, lf)}`));

const platzVon = (el: Element) => {
  const [d, code] = (el.closest<HTMLElement>('[data-platz]')?.dataset.platz ?? '').split('-');
  return { d: Number(d), code };
};

export function starte(root: HTMLElement) {
  const kombi = kombination(root.dataset.id ?? '');
  const m0 = root.querySelector<HTMLElement>('[data-pi]');
  const s0 = root.querySelector<HTMLElement>('[data-ep-dyn]');
  const b0 = root.querySelector<HTMLElement>('[data-ep-dyn-blick]');
  if (!kombi || !m0 || !s0 || !b0) return;
  const mount: HTMLElement = m0;
  const statisch: HTMLElement = s0;
  const blickEl: HTMLElement = b0;
  const html = document.documentElement;
  const params = new URLSearchParams(location.search);
  const bereit = () => [statisch, blickEl].forEach((el) => el.classList.add('ep-bereit'));
  // PDF-Erzeugung (scripts/ernaehrungsplan-pdf.mjs, ?druck): Grundplan aus dem Build drucken, nichts umbauen
  if (params.has('druck')) return bereit();

  const grundlageEl = root.querySelector<HTMLElement>('[data-ep-grundlage]');
  const rezepteEl = root.querySelector<HTMLElement>('[data-ep-rezepte]');
  const druckEl = root.querySelector<HTMLElement>('[data-ep-druck-dyn]');
  const stand = root.querySelector<HTMLElement>('[data-ep-druck]')?.dataset.stand ?? '';
  const fnBls = Number(root.dataset.fnBls) || 1;
  const vText = root.querySelector<HTMLElement>('[data-ep-v-text]');
  const boxen = [...root.querySelectorAll<HTMLInputElement>('[data-ep-vorlieben] input')];
  const varianten = root.querySelector<HTMLFormElement>('[data-ep-varianten]');

  let v = leseVorlieben(params.get('v') ?? '', kombi.ernaehrung, kombi.laktosefrei) as Vorliebe[];
  let k = M.kontext(erstellePlan({ ...(kombi as Antworten), vorlieben: v }));
  let z = M.dekodiere(k, params.get('s') ?? '');
  let vorher: M.Zustand | null = null;
  let plan: Plan = M.alsPlan(k, z);
  let druckAlt = true;
  let tag = 0;
  let einkaufWoche = 0;
  const desktop = window.matchMedia('(min-width: 1100px)');
  const einkaufKey = `nds-einkauf-${k.plan.id}`;
  let haken = speicher.lies<Record<string, Record<string, 'x' | 'v'>>>(einkaufKey) ?? {};
  const ziel = k.ziel;
  const skala = (g: number) => Math.min(1, g / (ziel + 30));

  // ---------------------------------------------------------------------------------------------------------
  // Gerüst

  const schalter = (attr: string, werte: string[], an: number, label: string) =>
    `<div class="pi-schalter" role="group" aria-label="${label}" data-an="${an}">${werte.map((w, i) => `<button type="button" ${attr}="${i}" aria-pressed="${i === an}">${w}</button>`).join('')}<i aria-hidden="true"></i></div>`;
  mount.innerHTML = `<div class="pi-plan">
<div class="pi-kopf">
<h2 class="ep-h2">Tag für Tag</h2>
<p class="pi-hilfe">Tipp auf ein Gericht, um es zu tauschen. Zum Verschieben den Griff <span class="pi-griff-bild" aria-hidden="true"></span> kurz halten und auf einen anderen Tag ziehen.</p>
<label class="pi-appetit"><span class="pi-ap-l">Appetit</span><span class="pi-ap-t pi-ap-klein">noch klein</span><input type="checkbox" role="switch" data-pi-appetit aria-label="Appetit wieder normal"${k.plan.appetit === 'normal' ? ' checked' : ''}><span class="pi-ap-spur" aria-hidden="true"></span><span class="pi-ap-t pi-ap-normal">wieder normal</span></label>
</div>
<div class="pi-wochen">${schalter('data-woche', ['Woche 1', 'Woche 2'], 0, 'Woche')}</div>
<div class="pi-chips" role="group" aria-label="Tag">${z.tage.map((_, d) => `<button type="button" class="pi-chip" data-aktion="tag" data-d="${d}" data-ziel-tag="${d}">${d + 1}</button>`).join('')}</div>
<div class="pi-spalten" aria-hidden="true"><span></span><span>Frühstück</span><span>Mittag</span><span>Abend</span><span>Zwischendurch</span></div>
<div class="pi-tage">${z.tage.map((_, d) => `<div class="pi-tag" data-d="${d}" role="group" aria-labelledby="pi-t${d}"></div>`).join('')}</div>
<div class="pi-fuss"><p class="pi-aus" data-pi-aus hidden></p><button type="button" class="pi-text-knopf" data-aktion="reset" hidden>Plan zurücksetzen</button></div>
</div>
<div class="pi-einkauf" id="einkaufsliste">
<div class="pi-ek-kopf"><h2 class="ep-h2">Einkaufsliste</h2>${schalter('data-ekwoche', ['Woche 1', 'Woche 2'], 0, 'Woche der Einkaufsliste')}</div>
<p class="ep-klein pi-ek-intro" data-pi-ek-intro></p>
<div class="pi-ek-liste" data-pi-ek></div>
<div class="pi-ek-aktionen"><button type="button" class="btn-secondary" data-aktion="teilen">Als Text teilen</button><p class="ep-klein" role="status" data-pi-ek-status></p></div>
<textarea class="pi-ek-text" data-pi-ek-text readonly hidden aria-label="Einkaufsliste als Text"></textarea>
</div>
<dialog class="pi-blatt" aria-labelledby="pi-blatt-name"></dialog>
<div class="pi-toast" data-pi-toast hidden><p data-pi-toast-text></p><button type="button" data-aktion="zurueck">Rückgängig</button><button type="button" data-pi-toast-extra hidden></button></div>
<p class="sr-only" role="status" data-pi-live></p>`;

  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => mount.querySelector<T>(sel)!;
  const tageEl = $('.pi-tage');
  const blatt = $<HTMLDialogElement>('.pi-blatt');
  const toast = $('[data-pi-toast]');
  const tagEl = (d: number) => tageEl.children[d] as HTMLElement;
  const platzEl = (d: number, code: string) => mount.querySelector<HTMLElement>(`[data-platz="${d}-${code}"]`);
  const druecke = (gruppe: HTMLElement, an: number) => {
    gruppe.dataset.an = String(an);
    gruppe.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', String(i === an)));
  };

  // ---------------------------------------------------------------------------------------------------------
  // Tage

  function statusHtml(d: number) {
    const g = M.tagProtein(k, z, d);
    if (M.imZiel(k, g)) return `<span class="pi-ok">Im Zielbereich</span>`;
    const abstand = g < ziel ? `${ziel - g}${nb}g unter dem Ziel` : `${g - ziel}${nb}g über dem Ziel`;
    const vs = M.vorschlag(k, z, d);
    if (!vs) return `${abstand}. Ein Gericht mit ${g < ziel ? 'mehr' : 'weniger'} Protein bringt den Tag zurück.`;
    return `${abstand}. Tausch „${esc(M.gerichtName(vs.von))}“ gegen „${esc(M.gerichtName(vs.nach))}“, dann passt es.<br><button type="button" class="pi-vorschlag" data-aktion="vorschlag" data-d="${d}">Tauschen</button>`;
  }

  function mzHtml(d: number, p: M.Platz, neu: boolean) {
    const m = M.mahlzeit(k, p);
    const karte = p.slot === 'snack' ? undefined : karten[p.id];
    return `<li class="pi-mz pi-${p.code}${p.slot === 'snack' ? ' pi-snack' : ''}${m.bevorzugt ? ' ep-fav' : ''}${neu ? ' pi-neu' : ''}" data-platz="${d}-${p.code}" data-ziel-tag="${d}">
<p class="pi-mz-zeit">${esc(p.titel)}</p><p class="pi-mz-g">${m.protein}${nb}g</p>
<button type="button" class="pi-mz-knopf" data-aktion="blatt" aria-haspopup="dialog"><span class="pi-mz-name ep-mz-name">${esc(m.name)}</span> <span class="pi-mz-menge">${esc(mengen(m, k.lf, 1).join(', '))}${m.dazu ? `<span class="pi-mz-dazu"> · dazu ${esc(m.dazu)}</span>` : ''}</span><span class="sr-only">. Tauschen oder verschieben</span></button>
<button type="button" class="pi-griff" data-aktion="griff" aria-haspopup="dialog" aria-label="${esc(p.titel)} von Tag ${d + 1} verschieben"></button>
${karte ? `<details class="pi-rezept"><summary>Rezept · ${karte.zeit} Minuten</summary><div class="pi-rezept-in"></div></details>` : ''}
</li>`;
  }

  /** Tag zeichnen: Kopf nur aktualisieren (der Balken gleitet), Liste neu; geänderte Plätze bekommen eine Markierung. */
  function zeichneTag(d: number, alt?: M.Zustand | null) {
    const el = tagEl(d);
    const g = M.tagProtein(k, z, d);
    const ok = M.imZiel(k, g);
    if (!el.firstElementChild) {
      el.innerHTML = `<div class="pi-tag-kopf"><h3 class="pi-tag-h" id="pi-t${d}">Tag ${d + 1}</h3><p class="pi-tag-g"><b data-pi-g></b>${nb}g <span>Protein</span></p>
<div class="pi-balken" aria-hidden="true"><i class="pi-balken-f"></i><i class="pi-balken-z" style="left:${(skala(ziel) * 100).toFixed(1)}%"></i></div>
<p class="pi-tag-status" data-pi-status></p></div><ol class="pi-liste"></ol>`;
    }
    el.classList.toggle('pi-raus', !ok);
    el.querySelector('[data-pi-g]')!.textContent = String(g);
    el.querySelector<HTMLElement>('.pi-balken-f')!.style.transform = `scaleX(${skala(g).toFixed(3)})`;
    el.querySelector('[data-pi-status]')!.innerHTML = statusHtml(d);
    el.querySelector('.pi-liste')!.innerHTML = z.tage[d].map((p, i) => mzHtml(d, p, !!alt && (alt.tage[d][i].id !== p.id || alt.tage[d][i].f !== p.f))).join('');
    const chip = mount.querySelector<HTMLElement>(`.pi-chip[data-d="${d}"]`)!;
    chip.setAttribute('aria-label', `Tag ${d + 1}, ${g} Gramm Protein${ok ? '' : ', außerhalb des Zielbereichs'}`);
    chip.classList.toggle('pi-chip-raus', !ok);
  }

  // ---------------------------------------------------------------------------------------------------------
  // Woche und Tag; am Handy wischen (scroll-snap), am Desktop die Woche als Raster

  function setzeTag(d: number) {
    tag = d;
    const w = Math.floor(d / 7);
    mount.querySelectorAll<HTMLElement>('.pi-chip').forEach((c) => c.setAttribute('aria-pressed', String(Number(c.dataset.d) === d)));
    tageEl.dataset.w = String(w);
    $('.pi-chips').dataset.w = String(w);
    druecke($('.pi-wochen .pi-schalter'), w);
    // Am Handy ist nur der sichtbare Tag bedienbar (Tabulator springt nicht durch 14 Tage); am Desktop die ganze Woche
    Array.from(tageEl.children).forEach((el, i) => ((el as HTMLElement).inert = !desktop.matches && i !== d));
  }

  function geheZuTag(d: number) {
    setzeTag(d);
    if (!desktop.matches) tageEl.scrollTo({ left: d * tageEl.clientWidth, behavior: rm() ? 'auto' : 'smooth' });
  }

  let rahmen = 0;
  tageEl.addEventListener(
    'scroll',
    () => {
      if (desktop.matches || rahmen) return;
      rahmen = requestAnimationFrame(() => {
        rahmen = 0;
        const d = Math.round(tageEl.scrollLeft / Math.max(1, tageEl.clientWidth));
        if (d !== tag && d >= 0 && d < z.tage.length) setzeTag(d);
      });
    },
    { passive: true },
  );
  desktop.addEventListener('change', () => geheZuTag(tag));

  // ---------------------------------------------------------------------------------------------------------
  // Überblick, Rechengrundlage, Fuß, Adresse, Ansagen

  let blickIn = false;
  function zeichneBlick() {
    blickEl.innerHTML = blickHtml(plan);
    const fig = blickEl.querySelector<HTMLElement>('[data-ep-blick]');
    if (!fig) return;
    if (blickIn || rm() || !('IntersectionObserver' in window)) return void fig.classList.add('in');
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      fig.classList.add('in');
      blickIn = true;
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(fig);
  }

  function zeichneFuss() {
    const aus = $('[data-pi-aus]');
    aus.hidden = !z.aus.length;
    aus.innerHTML = z.aus.length
      ? `Nicht dein Fall: ${z.aus.map((id) => `<span class="pi-aus-eintrag">${esc(M.gerichtName(id))} <button type="button" class="pi-text-knopf" data-aktion="wieder" data-id="${id}">wieder anbieten</button></span>`).join(' ')}`
      : '';
    $('[data-aktion="reset"]').hidden = !M.geaendert(k, z);
  }

  function schreibeAdresse() {
    const s = M.kodiere(k, z);
    const teile = [v.length ? `v=${v.join(',')}` : '', s ? `s=${s}` : ''].filter(Boolean);
    history.replaceState(null, '', `${location.pathname}${teile.length ? `?${teile.join('&')}` : ''}${location.hash}`);
  }

  let toastZeit = 0;
  function versteckeToast() {
    toast.classList.remove('an');
    setTimeout(() => !toast.classList.contains('an') && (toast.hidden = true), rm() ? 0 : 300);
  }
  /** Sichtbar kurz (mit „Rückgängig“ oder einer anderen Aktion), für Screenreader mit dem Protein der betroffenen Tage. */
  let toastAktion: (() => void) | null = null;
  function sage(kurz: string, rueckgaengig: boolean, lang = kurz, aktion?: { text: string; fn: () => void }) {
    const live = $('[data-pi-live]');
    live.textContent = '';
    setTimeout(() => (live.textContent = lang), 50);
    $('[data-pi-toast-text]').textContent = kurz;
    $('[data-aktion="zurueck"]').hidden = !rueckgaengig;
    const extra = $('[data-pi-toast-extra]');
    extra.hidden = !aktion;
    extra.textContent = aktion?.text ?? '';
    toastAktion = aktion?.fn ?? null;
    toast.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('an')));
    clearTimeout(toastZeit);
    toastZeit = window.setTimeout(versteckeToast, 5000);
  }
  toast.addEventListener('focusin', () => clearTimeout(toastZeit));
  $('[data-pi-toast-extra]').addEventListener('click', () => {
    toastAktion?.();
    versteckeToast();
  });
  toast.addEventListener('pointerenter', () => clearTimeout(toastZeit));

  const tagText = (d: number) => {
    const g = M.tagProtein(k, z, d);
    return `Tag ${d + 1}: ${g}${nb}g Protein, ${M.imZiel(k, g) ? 'im Zielbereich' : g < ziel ? `${ziel - g}${nb}g unter dem Ziel` : `${g - ziel}${nb}g über dem Ziel`}.`;
  };

  /** Neuer Zustand nach einer Aktion: Adresse, Tage, Überblick, Einkaufsliste, Ansage (mit „Rückgängig“). `tage`: Tage, deren
   *  Protein angesagt wird. */
  function setze(neu: M.Zustand, meldung: string, tage: number[], o: { rueckgaengig?: boolean; markieren?: boolean } = {}) {
    const alt = z;
    vorher = o.rueckgaengig === false ? null : alt;
    z = neu;
    plan = M.alsPlan(k, z);
    druckAlt = true;
    schreibeAdresse();
    z.tage.forEach((_, d) => zeichneTag(d, o.markieren === false ? null : alt));
    zeichneBlick();
    if (grundlageEl) grundlageEl.innerHTML = grundlageHtml(plan, { fnBls });
    zeichneFuss();
    zeichneEinkauf();
    sage(meldung, !!vorher, `${meldung} ${tage.map(tagText).join(' ')}`.trim());
  }

  // ---------------------------------------------------------------------------------------------------------
  // Blatt: Tauschen, Mit Tag … tauschen, Nicht mein Fall

  let blattPlatz: { d: number; code: string } | null = null;
  let blattAusloeser: HTMLElement | null = null;

  function oeffneBlatt(d: number, code: string, ausloeser: HTMLElement, fokus: 'tauschen' | 'mit') {
    const i = M.finde(z, d, code);
    if (i < 0) return;
    const p = z.tage[d][i];
    const m = M.mahlzeit(k, p);
    const alt = M.alternativen(k, z, d, code);
    const ziele = M.zielTage(z, d, code);
    const art = p.slot === 'snack' ? 'Zwischenmahlzeit' : p.titel;
    blattPlatz = { d, code };
    blattAusloeser = ausloeser;
    blatt.innerHTML = `<div class="pi-blatt-in">
<div class="pi-blatt-kopf"><p class="pi-blatt-wo">Tag ${d + 1} · ${esc(p.titel)} · ${m.protein}${nb}g Protein</p><button type="button" class="pi-zu" data-aktion="zu">Schließen</button>
<h2 class="pi-blatt-name${m.bevorzugt ? ' ep-fav' : ''}" id="pi-blatt-name"><span class="ep-mz-name">${esc(m.name)}</span></h2></div>
<div class="pi-blatt-teil" data-teil="tauschen"><h3 class="pi-blatt-h">Tauschen gegen</h3>${
      alt.length
        ? `<ul class="pi-alt">${alt.map((a) => `<li${a.bevorzugt ? ' class="ep-fav"' : ''}><button type="button" data-aktion="nimm" data-id="${a.id}"><span class="ep-mz-name">${esc(a.name)}</span><span class="pi-alt-g">${a.protein}${nb}g${PFEIL}</span></button></li>`).join('')}</ul>`
        : ''
    }<p class="ep-klein">${
      alt.length
        ? `Gleiche Mahlzeit, ähnlich viel Protein (höchstens ${M.TAUSCH_G}${nb}g Unterschied)${alt.some((a) => a.bevorzugt) ? '; gelb markiert: mit deinen Vorlieben' : ''}.`
        : `Für diese ${esc(art)} gibt es kein anderes Gericht mit ähnlich viel Protein. „Nicht mein Fall“ ersetzt sie durch das nächstbeste.`
    }</p></div>
<div class="pi-blatt-teil" data-teil="mit"><h3 class="pi-blatt-h"><label for="pi-mit-tag">Mit Tag … tauschen</label></h3>${
      ziele.length
        ? `<div class="pi-mit"><select id="pi-mit-tag">${ziele.map((e) => `<option value="${e}">Tag ${e + 1}: ${esc(M.gerichtName(z.tage[e][M.finde(z, e, code)].id))}</option>`).join('')}</select><button type="button" class="btn-secondary" data-aktion="mit">Tauschen</button></div>
<p class="ep-klein">Die beiden Tage tauschen ${p.slot === 'snack' ? 'diese Zwischenmahlzeit' : `ihr ${esc(p.titel === 'Frühstück' ? 'Frühstück' : `${p.titel}essen`)}`}, jedes Gericht mit seinen Mengen.</p>`
        : `<p class="ep-klein" id="pi-mit-tag" tabindex="-1">An keinem anderen Tag geht ein Tausch, ohne dass ein Gericht doppelt am Tag stünde.</p>`
    }</div>
<div class="pi-blatt-teil"><button type="button" class="pi-text-knopf pi-nicht" data-aktion="aus">Nicht mein Fall</button><p class="ep-klein">Blendet „${esc(m.name)}“ im ganzen Plan aus und ersetzt es an jedem Tag durch ein passendes Gericht.</p></div>
</div>`;
    if (fokus === 'mit') blatt.querySelector('[data-teil="tauschen"]')!.before(blatt.querySelector('[data-teil="mit"]')!);
    if (!blatt.open) blatt.showModal();
    blatt.querySelector('.pi-blatt-in')!.scrollTop = 0;
    requestAnimationFrame(() => blatt.classList.add('auf'));
    const f = fokus === 'mit' ? blatt.querySelector<HTMLElement>('#pi-mit-tag') : blatt.querySelector<HTMLElement>('[data-aktion="nimm"]');
    (f ?? blatt.querySelector<HTMLElement>('[data-aktion="zu"]'))?.focus();
  }

  /** Blatt schließen (gleitet hinaus); danach Fokus auf `fokus` oder zurück auf den Auslöser. */
  function schliesseBlatt(fokus?: () => HTMLElement | null) {
    if (!blatt.open) return;
    blatt.classList.remove('auf');
    const zu = () => {
      blatt.close();
      const el = fokus ? fokus() : blattAusloeser;
      if (el?.isConnected) el.focus({ preventScroll: true });
    };
    if (rm()) zu();
    else setTimeout(zu, 200);
  }
  blatt.addEventListener('cancel', (e) => {
    e.preventDefault();
    schliesseBlatt();
  });

  function aktionVerschieben(d: number, e: number, code: string) {
    const neu = M.verschiebe(z, d, e, code);
    if (!neu) return;
    const titel = z.tage[d][M.finde(z, d, code)].titel;
    melde('verschieben');
    setze(neu, `${titel} von Tag ${d + 1} und Tag ${e + 1} getauscht.`, [d, e]);
  }

  function aktionTauschen(d: number, code: string, id: string, wie = 'Getauscht') {
    const neu = M.tausche(k, z, d, code, id);
    if (!neu) return;
    melde('tauschen');
    setze(neu, `${wie}: ${M.gerichtName(id)}.`, [d]);
  }

  blatt.addEventListener('click', (e) => {
    if (e.target === blatt) return schliesseBlatt();
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-aktion]');
    if (!t || !blattPlatz) return;
    const { d, code } = blattPlatz;
    const a = t.dataset.aktion;
    const knopf = () => platzEl(d, code)?.querySelector<HTMLElement>('.pi-mz-knopf') ?? null;
    if (a === 'zu') return schliesseBlatt();
    if (a === 'nimm') {
      aktionTauschen(d, code, t.dataset.id!);
      return schliesseBlatt(knopf);
    }
    if (a === 'mit') {
      aktionVerschieben(d, Number(blatt.querySelector<HTMLSelectElement>('#pi-mit-tag')!.value), code);
      return schliesseBlatt(knopf);
    }
    if (a === 'aus') {
      const id = z.tage[d][M.finde(z, d, code)].id;
      const neu = M.blendeAus(k, z, id);
      if (!neu) {
        sage(`Für „${M.gerichtName(id)}“ gibt es im Plan keinen Ersatz.`, false);
        return schliesseBlatt();
      }
      const n = z.tage.filter((t2) => t2.some((q) => q.id === id)).length;
      melde('tauschen');
      setze(neu, `„${M.gerichtName(id)}“ ausgeblendet und an ${n === 1 ? 'einem Tag' : `${n} Tagen`} ersetzt.`, [d]);
      return schliesseBlatt(knopf);
    }
  });

  // ---------------------------------------------------------------------------------------------------------
  // Rezepte am Gericht

  function setzePort(box: HTMLElement, n: number) {
    const { d, code } = platzVon(box);
    const p = z.tage[d][M.finde(z, d, code)];
    const m = M.mahlzeit(k, p);
    const r = karten[p.id];
    const schritte = (k.lf && r.schritteLaktosefrei) || r.schritte;
    box.innerHTML = `${schalter('data-n', ['1 Portion', '2 Portionen'], n - 1, 'Portionen')}
<div class="pi-rz-spalten"><div><p class="pi-rz-h">Zutaten für ${n === 1 ? 'eine Portion' : 'zwei Portionen'}</p><ul>${mengen(m, k.lf, n).map((x) => `<li>${esc(x)}</li>`).join('')}${m.dazu ? `<li class="pi-mz-dazu">dazu ${esc(m.dazu)}</li>` : ''}</ul></div>
<div><p class="pi-rz-h">So geht’s</p><ol>${schritte.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>${r.tipp ? `<p class="pi-rz-tipp">${esc(r.tipp)}</p>` : ''}</div></div>`;
  }
  mount.addEventListener(
    'toggle',
    (e) => {
      const det = e.target as HTMLDetailsElement;
      if (!det.classList?.contains('pi-rezept') || !det.open) return;
      const box = det.querySelector<HTMLElement>('.pi-rezept-in')!;
      if (!box.firstChild) setzePort(box, 1);
    },
    true,
  );

  // ---------------------------------------------------------------------------------------------------------
  // Einkaufsliste

  function postenListe(w: number) {
    const daten = einkaufDaten(plan.wochen[w], k.lf);
    const st = haken[w + 1] ?? {};
    const gruppen = [...daten.gruppen, { titel: 'Obst, Gemüse und Kräuter', posten: daten.frisch }]
      .map((g) => ({ ...g, posten: g.posten.filter((p) => st[p.key] !== 'v') }))
      .filter((g) => g.posten.length);
    const vorrat = [...daten.gruppen.flatMap((g) => g.posten), ...daten.frisch].filter((p) => st[p.key] === 'v');
    return { gruppen, vorrat, ausVorrat: daten.vorrat, st };
  }

  function zeichneEinkauf() {
    const w = einkaufWoche;
    const { gruppen, vorrat, ausVorrat, st } = postenListe(w);
    druecke($('.pi-ek-kopf .pi-schalter'), w);
    $('[data-pi-ek-intro]').textContent = `Für Tag ${w * 7 + 1} bis ${w * 7 + 7}, aus deinem Plan, wie er gerade ist. Auf ganze Packungen aufgerundet, klein dahinter die Menge im Plan; Obst, Gemüse und Kräuter nach Hunger.`;
    const zeile = (p: EinkaufPosten, schon: boolean) =>
      `<li class="pi-ek${st[p.key] === 'x' ? ' pi-ek-ab' : ''}" data-key="${esc(p.key)}">${
        schon ? `<span class="pi-ek-t">${esc(p.text)}</span>` : `<label><input type="checkbox"${st[p.key] === 'x' ? ' checked' : ''}><span class="pi-ek-t">${esc(p.text)}${p.klein ? ` <span class="pi-ek-k">${esc(p.klein)}</span>` : ''}</span></label>`
      }<button type="button" class="pi-text-knopf" data-aktion="${schon ? 'kaufen' : 'vorrat'}"${schon ? '' : ` aria-label="${esc(p.text)}: hab ich schon"`}>${schon ? 'doch kaufen' : 'Hab ich schon'}</button></li>`;
    $('[data-pi-ek]').innerHTML = `${gruppen.map((g) => `<div class="pi-ek-gruppe"><h3 class="pi-ek-h">${esc(g.titel)}</h3><ul>${g.posten.map((p) => zeile(p, false)).join('')}</ul></div>`).join('')}
${ausVorrat.length ? `<p class="pi-ek-vorrat"><span>Aus dem Vorrat</span> ${esc(ausVorrat.join(', '))}</p>` : ''}
${vorrat.length ? `<div class="pi-ek-gruppe pi-ek-schon"><h3 class="pi-ek-h">Hast du schon</h3><ul>${vorrat.map((p) => zeile(p, true)).join('')}</ul></div>` : ''}`;
  }

  function hake(key: string, wert: 'x' | 'v' | null) {
    const w = String(einkaufWoche + 1);
    const st = { ...(haken[w] ?? {}) };
    if (wert) st[key] = wert;
    else delete st[key];
    haken = { ...haken, [w]: st };
    speicher.schreib(einkaufKey, haken);
    melde('einkauf');
  }

  function einkaufText() {
    const w = einkaufWoche;
    const { gruppen, ausVorrat, st } = postenListe(w);
    const zeilen = [`Einkaufsliste Woche ${w + 1} (Tag ${w * 7 + 1} bis ${w * 7 + 7})`];
    for (const g of gruppen) {
      const offen = g.posten.filter((p) => st[p.key] !== 'x');
      if (offen.length) zeilen.push('', g.titel, ...offen.map((p) => `- ${p.text}`));
    }
    if (ausVorrat.length) zeilen.push('', `Aus dem Vorrat: ${ausVorrat.join(', ')}`);
    return zeilen.join('\n');
  }

  async function teile() {
    melde('einkauf');
    const text = einkaufText();
    const status = $('[data-pi-ek-status]');
    const feld = $<HTMLTextAreaElement>('[data-pi-ek-text]');
    feld.hidden = true;
    status.textContent = '';
    const nav = navigator as Navigator & { share?: (d: { title?: string; text?: string }) => Promise<void> };
    if (typeof nav.share === 'function') {
      try {
        await nav.share({ title: `Einkaufsliste Woche ${einkaufWoche + 1}`, text });
        status.textContent = 'Geteilt.';
        return;
      } catch (e) {
        if ((e as Error)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Liste kopiert. Du kannst sie jetzt in eine Nachricht oder Notiz einfügen.';
    } catch {
      feld.value = text;
      feld.hidden = false;
      feld.rows = Math.min(16, text.split('\n').length + 1);
      feld.focus();
      feld.select();
      status.textContent = 'Automatisch kopieren ging nicht. Der Text ist markiert; kopiere ihn von Hand.';
    }
  }

  // ---------------------------------------------------------------------------------------------------------
  // Druck (Strg+P) aus dem aktuellen Zustand; die PDF-Knöpfe erzeugen echte PDFs (senden.ts)

  function aktualisiereDruck() {
    if (!druckAlt || !druckEl) return;
    druckEl.innerHTML = druckHtml(plan, { stand });
    druckAlt = false;
  }
  window.addEventListener('beforeprint', aktualisiereDruck);

  // ---------------------------------------------------------------------------------------------------------
  // Vorlieben (auf der Seite) und Varianten (anderer Plan, Zustand wird übertragen)

  function zeigeVorlieben() {
    if (vText) vText.textContent = v.length ? v.map((x) => vorliebeLabel(x, k.lf)).join(', ') : 'keine angegeben';
    boxen.forEach((b) => (b.checked = v.includes(b.value as Vorliebe)));
  }

  function wechsle(a: Antworten, aktion?: Aktion) {
    const id = planId(a.ernaehrung, a.appetit, a.gewicht, a.laktosefrei);
    if (!id) return;
    const neuV = leseVorlieben(v, a.ernaehrung, a.ernaehrung === 'vegan' || a.laktosefrei);
    const kNeu = M.kontext(erstellePlan({ ...a, vorlieben: neuV }));
    const s = M.kodiere(kNeu, M.uebertrage(k, z, kNeu));
    const teile = [neuV.length ? `v=${neuV.join(',')}` : '', s ? `s=${s}` : ''].filter(Boolean);
    const ziel = `/ernaehrungsplan/plan/${id}/${teile.length ? `?${teile.join('&')}` : ''}#tag-fuer-tag`;
    if (aktion) melde(aktion, () => location.assign(ziel));
    else location.assign(ziel);
  }

  boxen.forEach((b) =>
    b.addEventListener('change', () => {
      v = leseVorlieben(boxen.filter((x) => x.checked).map((x) => x.value), k.plan.ernaehrung, k.lf) as Vorliebe[];
      const kNeu = M.kontext(erstellePlan({ ...(kombi as Antworten), vorlieben: v }));
      const zNeu = M.uebertrage(k, z, kNeu);
      k = kNeu;
      zeigeVorlieben();
      setze(zNeu, 'Vorlieben übernommen.', [], { rueckgaengig: false, markieren: false });
    }),
  );

  varianten?.addEventListener('change', () => {
    const f = new FormData(varianten);
    const e = String(f.get('e') ?? k.plan.ernaehrung) as Antworten['ernaehrung'];
    wechsle({ ernaehrung: e, appetit: k.plan.appetit, gewicht: String(f.get('g') ?? k.plan.gewicht) as Antworten['gewicht'], laktosefrei: e === 'vegan' || f.get('lf') === 'ja' });
  });

  const regler = $<HTMLInputElement>('[data-pi-appetit]');
  regler.addEventListener('change', () => {
    const appetit = regler.checked ? 'normal' : 'klein';
    if (appetit !== k.plan.appetit) wechsle({ ernaehrung: k.plan.ernaehrung, appetit, gewicht: k.plan.gewicht, laktosefrei: k.plan.laktosefrei }, 'appetit');
  });

  // ---------------------------------------------------------------------------------------------------------
  // Ziehen und Klicks

  const zieh = ziehen($('.pi-plan'), {
    start: (g) => {
      const { d, code } = platzVon(g);
      return M.zielTage(z, d, code).flatMap((e) => [mount.querySelector<HTMLElement>(`.pi-chip[data-d="${e}"]`)!, platzEl(e, code)!]);
    },
    ablegen: (g, e) => {
      const { d, code } = platzVon(g);
      aktionVerschieben(d, e, code);
      if (!desktop.matches) geheZuTag(e);
    },
    name: (g) => g.closest('[data-platz]')?.querySelector('.pi-mz-name')?.textContent ?? '',
  });

  mount.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-aktion], [data-woche], [data-ekwoche], [data-n]');
    if (!t || t.closest('.pi-blatt')) return;
    const a = t.dataset.aktion;
    if (a === 'blatt' || a === 'griff') {
      if (a === 'griff' && zieh.gezogen()) return;
      const { d, code } = platzVon(t);
      return oeffneBlatt(d, code, t, a === 'griff' ? 'mit' : 'tauschen');
    }
    if (a === 'tag') return geheZuTag(Number(t.dataset.d));
    if (t.dataset.woche !== undefined) return geheZuTag((tag % 7) + Number(t.dataset.woche) * 7);
    if (a === 'vorschlag') {
      const d = Number(t.dataset.d);
      const vs = M.vorschlag(k, z, d);
      if (vs) aktionTauschen(d, vs.code, vs.nach, 'Vorschlag übernommen');
      return;
    }
    if (a === 'reset') return setze(M.zuruecksetzen(k), 'Plan zurückgesetzt.', []);
    if (a === 'wieder') return setze(M.zeigeWieder(z, t.dataset.id!), `„${M.gerichtName(t.dataset.id!)}“ wird wieder angeboten.`, [], { markieren: false });
    if (a === 'zurueck' && vorher) return setze(vorher, 'Rückgängig gemacht.', [], { rueckgaengig: false });
    if (t.dataset.n !== undefined) {
      const box = t.closest<HTMLElement>('.pi-rezept-in')!;
      setzePort(box, Number(t.dataset.n) + 1);
      return box.querySelector<HTMLElement>(`[data-n="${t.dataset.n}"]`)?.focus();
    }
    if (t.dataset.ekwoche !== undefined) {
      einkaufWoche = Number(t.dataset.ekwoche);
      $('[data-pi-ek-status]').textContent = '';
      $('[data-pi-ek-text]').hidden = true;
      return zeichneEinkauf();
    }
    if (a === 'vorrat' || a === 'kaufen') {
      hake(t.closest<HTMLElement>('[data-key]')!.dataset.key!, a === 'vorrat' ? 'v' : null);
      return zeichneEinkauf();
    }
    if (a === 'teilen') return void teile();
  });

  mount.addEventListener('change', (e) => {
    const box = e.target as HTMLInputElement;
    const li = box.closest<HTMLElement>('.pi-ek');
    if (!li || box.type !== 'checkbox') return;
    hake(li.dataset.key!, box.checked ? 'x' : null);
    li.classList.toggle('pi-ek-ab', box.checked);
  });

  // ---------------------------------------------------------------------------------------------------------
  // Start

  if (rezepteEl) rezepteEl.hidden = true;
  zeigeVorlieben();
  z.tage.forEach((_, d) => zeichneTag(d));
  zeichneBlick();
  if (grundlageEl && (v.length || M.geaendert(k, z))) grundlageEl.innerHTML = grundlageHtml(plan, { fnBls });
  zeichneFuss();
  zeichneEinkauf();
  statisch.hidden = true;
  mount.hidden = false;
  const start = /^#tag-(\d+)$/.exec(location.hash);
  const d0 = start ? Math.min(13, Math.max(0, Number(start[1]) - 1)) : 0;
  setzeTag(d0);
  if (d0 && !desktop.matches) tageEl.scrollLeft = d0 * tageEl.clientWidth;
  bereit();
  html.classList.add('pi-an');

  verbindeSenden({
    root,
    plan: () => plan,
    vorlieben: () => v,
    zustand: () => M.kodiere(k, z),
    stand,
    melde: (aktion, props, danach) => melde(aktion, danach, props),
    sage: (text, aktion) => sage(text, false, text, aktion),
  });
}
