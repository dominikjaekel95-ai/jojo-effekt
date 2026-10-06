/**
 * Gemeinsames Skript der interaktiven Elemente (eingebunden über src/components/interaktiv/Interaktiv.astro).
 *
 * - Erscheinen: IntersectionObserver setzt .ia-in, CSS spielt die Bewegung ab (Linien zeichnen, Punkte füllen).
 * - Zahlen mit data-ia-zahl zählen beim Erscheinen und beim Umschalten (Endwert steht im HTML).
 * - Scroll-Fortschritt: [data-ia-scrub] bekommt --p (0…1), Kinder mit data-ia-ab werden ab ihrem Wert aktiv.
 * - Umschalter [data-ia-wahl] und Schalter [data-ia-schalter] ohne Code je Modul (siehe basis.ts).
 * - Rechner je Modul: protein, zonen, bedarf, teller, wirkstoffspiegel, kreatin, zusammensetzung.
 * Ohne dieses Skript und bei reduzierter Bewegung bleibt alles im Endzustand; html.ia-an steuert die Startzustände.
 */
type W = Window & { __ia?: boolean };
(window as W).__ia = true;

const html = document.documentElement;
const RM = html.classList.contains('rm') || !html.classList.contains('ia-an');
const EASE = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/* ---------------- Zahlen ---------------- */
interface Zahl {
  v: number;
  dec: number;
  plus: boolean;
  gruppe: boolean;
}
const lies = (s: string): Zahl | null => {
  const t = s.trim();
  if (!/^[−+-]?\d[\d.]*(,\d+)?$/.test(t)) return null;
  const neg = /^[−-]/.test(t);
  const body = t.replace(/^[−+-]/, '');
  const dec = (body.split(',')[1] ?? '').length;
  const v = Number(body.replace(/\./g, '').replace(',', '.'));
  return { v: neg ? -v : v, dec, plus: t.startsWith('+'), gruppe: /\d\.\d{3}/.test(body) };
};
const schreib = (v: number, z: Zahl) => {
  const a = Math.abs(v).toLocaleString('de-DE', {
    minimumFractionDigits: z.dec,
    maximumFractionDigits: z.dec,
    useGrouping: z.gruppe || Math.abs(v) >= 10000,
  });
  const n = Number(a.replace(/\./g, '').replace(',', '.'));
  if (n === 0) return a;
  return (v < 0 ? '−' : z.plus ? '+' : '') + a;
};

const laufend = new WeakMap<HTMLElement, number>();
function zaehle(el: HTMLElement, ziel: string, von?: number, verz = 0) {
  const z = lies(ziel);
  if (!z || RM) {
    el.textContent = ziel;
    return;
  }
  const start = von ?? (z.v >= 0 ? 0 : 0);
  const alt = laufend.get(el);
  if (alt) cancelAnimationFrame(alt);
  const dauer = 1100;
  // Breite halten, damit nichts springt
  el.style.minWidth = '';
  el.textContent = ziel;
  el.style.minWidth = `${el.getBoundingClientRect().width}px`;
  el.textContent = schreib(start, z);
  let t0 = 0;
  const schritt = (t: number) => {
    if (!t0) t0 = t + verz;
    const k = clamp((t - t0) / dauer, 0, 1);
    el.textContent = k >= 1 ? ziel : schreib(start + (z.v - start) * EASE(k), z);
    if (k < 1) laufend.set(el, requestAnimationFrame(schritt));
    else {
      laufend.delete(el);
      el.style.minWidth = '';
    }
  };
  laufend.set(el, requestAnimationFrame(schritt));
}
let stumm = false;
const setzeText = (el: HTMLElement, text: string) => {
  if (el.hasAttribute('data-ia-zahl') && !stumm) {
    const alt = lies(el.textContent ?? '');
    if (alt && lies(text)) return zaehle(el, text, alt.v);
  }
  el.textContent = text;
};

/* ---------------- Umschalten ---------------- */
function waehle(root: HTMLElement, g: string, v: string) {
  const knoepfe = Array.from(root.querySelectorAll<HTMLButtonElement>(`[data-ia-wahl="${g}"] button`));
  const extra = (root.getAttribute(`data-opt-${g}`) ?? '').split(',').filter(Boolean);
  const optionen = Array.from(new Set([...knoepfe.map((b) => b.value), ...extra]));
  root.setAttribute(`data-${g}`, v);
  knoepfe.forEach((b) => b.setAttribute('aria-pressed', String(b.value === v)));
  root.querySelectorAll<HTMLElement>(`[data-x-${g}-${v}]`).forEach((el) => setzeText(el, el.getAttribute(`data-x-${g}-${v}`) ?? ''));
  root.querySelectorAll<HTMLElement | SVGElement>(`[data-m-${g}-${v}]`).forEach((el) => {
    (el as HTMLElement).style.transform = el.getAttribute(`data-m-${g}-${v}`) ?? '';
  });
  root.querySelectorAll<HTMLElement | SVGElement>(`[data-o-${g}-${v}]`).forEach((el) => {
    (el as HTMLElement).style.opacity = el.getAttribute(`data-o-${g}-${v}`) ?? '';
  });
  root.querySelectorAll<HTMLElement | SVGElement>(`[data-k-${g}-${v}]`).forEach((el) => {
    optionen.forEach((o) => {
      const c = el.getAttribute(`data-k-${g}-${o}`);
      if (c) el.classList.remove(...c.split(' '));
    });
    const c = el.getAttribute(`data-k-${g}-${v}`);
    if (c) el.classList.add(...c.split(' '));
  });
  root.dispatchEvent(new CustomEvent('ia-wahl', { detail: { g, v } }));
}

/* ---------------- Rechner je Modul ---------------- */
const de = (n: number, dec = 0) =>
  n.toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec }).replace('-', '−');
const q = <T extends Element = HTMLElement>(root: Element, s: string) => root.querySelector<T & HTMLElement>(s);
const qa = <T extends Element = HTMLElement>(root: Element, s: string) => Array.from(root.querySelectorAll<T & HTMLElement>(s));
const regler = (root: Element, name: string) => q<HTMLInputElement>(root, `[data-ia-regler="${name}"]`);
const wert = (root: Element, name: string, d: number) => Number(regler(root, name)?.value ?? d);
const ausgabe = (root: Element, name: string, text: string) => {
  qa(root, `[data-ia-out="${name}"]`).forEach((o) => (o.textContent = text));
};
const reglerText = (input: HTMLInputElement) => {
  const dec = Number(input.dataset.dec ?? 0);
  return `${de(Number(input.value), dec)} ${input.dataset.einheit ?? ''}`.trim();
};
const setzeZahl = (root: Element, sel: string, text: string, zaehlen = true) => {
  qa(root, sel).forEach((el) => (zaehlen ? setzeText(el, text) : (el.textContent = text)));
};
/** Position auf einer Achse als Transform: Element ist so breit wie die Achse */
const schiebe = (el: HTMLElement | null, anteil: number) => {
  if (el) el.style.transform = `translateX(${((clamp(anteil, 0, 1) - 1) * 100).toFixed(2)}%)`;
};
const strecke = (el: HTMLElement | null, von: number, bis: number) => {
  if (!el) return;
  const a = clamp(von, 0, 1);
  const b = clamp(bis, 0, 1);
  el.style.transform = `translateX(${(a * 100).toFixed(2)}%) scaleX(${Math.max(0.0001, b - a).toFixed(4)})`;
};

const rechner: Record<string, (root: HTMLElement) => void> = {
  protein(root) {
    const kg = wert(root, 'kg', 80);
    const max = Number(root.dataset.achse ?? 250);
    const lo = Math.round(kg * 1.2);
    const hi = Math.round(kg * 1.6);
    setzeZahl(root, '[data-p-lo]', String(lo));
    setzeZahl(root, '[data-p-hi]', String(hi));
    strecke(q(root, '[data-p-band]'), lo / max, hi / max);
    schiebe(q(root, '[data-p-dge]'), (kg * 0.8) / max);
    setzeZahl(root, '[data-p-dgew]', String(Math.round(kg * 0.8)), false);
    const mz = Number(root.dataset.mahlzeiten ?? 4);
    setzeZahl(root, '[data-p-mlo]', String(Math.round(lo / mz)), false);
    setzeZahl(root, '[data-p-mhi]', String(Math.round(hi / mz)), false);
    const ist = regler(root, 'ist');
    if (ist) {
      const g = Number(ist.value);
      schiebe(q(root, '[data-p-ist]'), g / max);
      const luecke = q(root, '[data-p-luecke]');
      const text = q(root, '[data-p-ltext]');
      if (g >= lo) {
        strecke(luecke, g / max, g / max);
        if (text) text.textContent = g > hi ? 'Du liegst über dem Bereich.' : 'Du liegst im Zielbereich. Ein Pulver brauchst du dafür nicht.';
      } else {
        strecke(luecke, g / max, lo / max);
        if (text) text.textContent = `Bis zum unteren Rand fehlen ${lo - g} g. Erst Mahlzeiten prüfen, dann einen Shake erwägen.`;
      }
    }
  },
  zonen(root) {
    const kg = wert(root, 'kg', 80);
    const plus = wert(root, 'plus', 0.8);
    const max = Number(root.dataset.max ?? 3);
    schiebe(q(root, '[data-z-marke]'), plus / max);
    const zone = plus < 1.4 ? 'gruen' : plus < 2.3 ? 'gelb' : 'rot';
    if (root.getAttribute('data-zone') !== zone) waehle(root, 'zone', zone);
    setzeZahl(root, '[data-z-g1]', de(kg + 1.4, 1), false);
    setzeZahl(root, '[data-z-g2]', de(kg + 2.3, 1), false);
    setzeZahl(root, '[data-z-ist]', de(kg + plus, 1), false);
  },
  bedarf(root) {
    const mann = root.getAttribute('data-geschlecht') === 'mann';
    const alter = wert(root, 'alter', 45);
    const cm = wert(root, 'cm', 170);
    const kg = wert(root, 'kg', 80);
    const f = root.getAttribute('data-faktor') === '16' ? 1.6 : 1.4;
    const reeRoh = 10 * kg + 6.25 * cm - 5 * alter + (mann ? 5 : -161);
    const ree = Math.round(reeRoh);
    const tag = Math.round(reeRoh * f);
    const fmt = (n: number) => n.toLocaleString('de-DE');
    setzeZahl(root, '[data-b-ree]', fmt(ree));
    setzeZahl(root, '[data-b-tag]', fmt(tag));
    setzeZahl(root, '[data-b-lo]', fmt(tag - 400));
    setzeZahl(root, '[data-b-hi]', fmt(tag - 300));
    const max = Number(root.dataset.achse ?? 4000);
    strecke(q(root, '[data-b-bar]'), 0, tag / max);
    strecke(q(root, '[data-b-ree-bar]'), 0, ree / max);
    strecke(q(root, '[data-b-band]'), (tag - 400) / max, (tag - 300) / max);
    strecke(q(root, '[data-b-eher]'), 0, (tag - 400) / max);
  },
  teller(root) {
    const gruppe = root.getAttribute('data-gruppe');
    const ziel = Number((gruppe && root.getAttribute(`data-ziel-${gruppe}`)) || root.getAttribute('data-ziel') || 1);
    const dec = Number(root.dataset.dec ?? 0);
    const achse = ziel * 2;
    let lo = 0;
    let hi = 0;
    qa(root, '[data-t-speise]').forEach((b) => {
      const an = b.getAttribute('aria-pressed') === 'true';
      const mn = Number(b.dataset.min);
      const mx = Number(b.dataset.max ?? b.dataset.min);
      const seg = q(root, `[data-t-seg="${b.dataset.tSpeise}"]`);
      if (seg) {
        if (an) {
          strecke(seg, lo / achse, Math.max(lo / achse, (lo + mn) / achse - 0.004));
          seg.style.opacity = '1';
        } else {
          strecke(seg, lo / achse, lo / achse);
          seg.style.opacity = '0';
        }
      }
      if (an) {
        lo += mn;
        hi += mx;
      }
    });
    strecke(q(root, '[data-t-ext]'), lo / achse, hi / achse);
    const r5 = root.dataset.rund === '5';
    const txt = hi > lo ? `${r5 ? 'rund ' : ''}${de(r5 ? Math.round(lo / 5) * 5 : lo, dec)} bis ${de(r5 ? Math.round(hi / 5) * 5 : hi, dec)}` : de(lo, dec);
    setzeZahl(root, '[data-t-summe]', txt, hi === lo);
    const anteil = Math.round((lo / ziel) * 100);
    setzeZahl(root, '[data-t-anteil]', String(anteil));
    const s = q(root, '[data-t-satz]');
    if (s) {
      const fehlt = ziel - lo;
      s.textContent =
        lo >= ziel
          ? lo >= ziel * 3
            ? `Das ist das ${de(lo / ziel, 0)}-Fache des Werts.`
            : 'Der Wert ist erreicht.'
          : `Bis zum Wert fehlen ${de(fehlt, dec)}\u00a0${root.dataset.einheit ?? ''}.`;
    }
  },
  wirkstoffspiegel(root) {
    const tag = wert(root, 'tag', 14);
    const v = root.getAttribute('data-wirkstoff') ?? 'semaglutid';
    const hwz = Number(root.getAttribute(`data-hwz-${v}`) ?? 7);
    const rest = 100 * Math.pow(0.5, tag / hwz);
    const txt = rest >= 10 ? de(rest, 0) : rest >= 1 ? de(rest, 1) : rest >= 0.1 ? de(rest, 1) : 'unter 0,1';
    qa(root, '[data-s-rest]').forEach((z) => (z.textContent = txt));
    qa(root, '[data-s-tagtext]').forEach((z) => (z.textContent = tag === 0 ? 'Am Tag der letzten Dosis' : tag === 1 ? 'Nach einem Tag' : `Nach ${tag} Tagen`));
    const tage = Number(root.dataset.tage ?? 56);
    qa(root, '[data-s-cursor]').forEach((c) => schiebe(c, tag / tage));
    qa(root, '[data-s-cpunkt]').forEach((p) => (p.style.transform = `translateY(${(100 - rest).toFixed(2)}%)`));
  },
  kreatin(root) {
    const kg = wert(root, 'kg', 80);
    setzeZahl(root, '[data-k-lo]', de(kg + 0.5, 1), false);
    setzeZahl(root, '[data-k-hi]', de(kg + 2, 1), false);
  },
  zusammensetzung(root) {
    const kg = wert(root, 'kg', 15);
    const v = root.getAttribute('data-studie') ?? 'step1';
    const anteil = Number(root.getAttribute(`data-ff-${v}`) ?? 40) / 100;
    setzeZahl(root, '[data-zs-ff]', de(kg * anteil, 1), false);
    setzeZahl(root, '[data-zs-fett]', de(kg * (1 - anteil), 1), false);
  },
};

/* ---------------- Sortieren (FLIP): Einträge fliegen aus einem Stapel in ihre Spalten ---------------- */
function sortiere(root: HTMLElement) {
  if (RM) return;
  const items = qa(root, '[data-so-item]');
  const start = q(root, '[data-so-start]');
  if (!start || !items.length) return;
  const s = start.getBoundingClientRect();
  items.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    const dx = s.left - r.left;
    const dy = s.top - r.top + (i % 4) * 6;
    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 },
        { transform: `translate(${dx}px, ${dy}px)`, opacity: 1, offset: 0.25 },
        { transform: 'translate(0, 0)', opacity: 1 },
      ],
      { duration: 1100, delay: 120 + i * 70, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'backwards' },
    );
  });
}

/* ---------------- Start ---------------- */
const wurzeln = Array.from(document.querySelectorAll<HTMLElement>('[data-ia]'));

wurzeln.forEach((root) => {
  const name = root.dataset.ia ?? '';
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const knopf = t.closest<HTMLButtonElement>('[data-ia-wahl] button');
    if (knopf && root.contains(knopf)) {
      const g = knopf.closest<HTMLElement>('[data-ia-wahl]')?.dataset.iaWahl;
      if (g && knopf.getAttribute('aria-pressed') !== 'true') waehle(root, g, knopf.value);
      return;
    }
    const schalter = t.closest<HTMLButtonElement>('[data-ia-schalter]');
    if (schalter) {
      const an = schalter.getAttribute('aria-pressed') !== 'true';
      schalter.setAttribute('aria-pressed', String(an));
      root.classList.toggle(`ia-${schalter.dataset.iaSchalter}`, !an);
      return;
    }
    const speise = t.closest<HTMLButtonElement>('[data-t-speise]');
    if (speise) {
      speise.setAttribute('aria-pressed', String(speise.getAttribute('aria-pressed') !== 'true'));
      rechner.teller?.(root);
    }
  });
  root.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement;
    if (!input.matches('[data-ia-regler]')) return;
    ausgabe(root, input.dataset.iaRegler ?? '', reglerText(input));
    rechner[name]?.(root);
  });
  root.addEventListener('ia-wahl', () => rechner[name]?.(root));
  // Formularwerte nach „Zurück“ im Browser übernehmen
  if (rechner[name] && root.querySelector('[data-ia-regler]')) {
    qa<HTMLInputElement>(root, '[data-ia-regler]').forEach((i) => ausgabe(root, i.dataset.iaRegler ?? '', reglerText(i)));
    stumm = true;
    rechner[name]?.(root);
    stumm = false;
  }
});

function erscheint(root: HTMLElement) {
  root.classList.add('ia-in');
  window.setTimeout(() => root.classList.add('ia-fertig'), 5200);
  qa(root, '[data-ia-zahl]').forEach((el) => {
    if (el.closest('[data-ia-scrub]')) return;
    zaehle(el, el.textContent ?? '', undefined, Number(el.dataset.iaVerz ?? 0));
  });
  if (root.dataset.ia === 'sortierung') sortiere(root);
}

if (!RM && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          io.unobserve(e.target);
          erscheint(e.target as HTMLElement);
        }
      }),
    { rootMargin: '0px 0px -18% 0px', threshold: 0.2 },
  );
  wurzeln.forEach((w) => io.observe(w));
} else {
  wurzeln.forEach((w) => w.classList.add('ia-in', 'ia-fertig'));
}

/* ---------------- Scroll-Fortschritt ---------------- */
const scrubs = Array.from(document.querySelectorAll<HTMLElement>('[data-ia-scrub]'));
if (!RM && scrubs.length) {
  const teile = scrubs.map((s) => ({ s, ab: qa(s, '[data-ia-ab]').map((el) => ({ el, ab: Number(el.dataset.iaAb) })) }));
  let tick = false;
  const lauf = () => {
    tick = false;
    const vh = window.innerHeight;
    const ende = window.scrollY + vh >= document.documentElement.scrollHeight - 4;
    teile.forEach(({ s, ab }) => {
      const r = s.getBoundingClientRect();
      const linie = vh * 0.62;
      const p = ende ? 1 : clamp((linie - r.top) / Math.max(1, r.height), 0, 1);
      s.style.setProperty('--p', p.toFixed(4));
      ab.forEach(({ el, ab: a }) => el.classList.toggle('ia-an', p >= a));
    });
  };
  const anfordern = () => {
    if (!tick) {
      tick = true;
      requestAnimationFrame(lauf);
    }
  };
  window.addEventListener('scroll', anfordern, { passive: true });
  window.addEventListener('resize', anfordern);
  lauf();
}

/* ---------------- Inhaltsverzeichnis: aktueller Abschnitt ---------------- */
const toc = document.querySelector<HTMLElement>('[data-toc]');
if (toc && 'IntersectionObserver' in window) {
  const links = qa<HTMLAnchorElement>(toc, 'a[href^="#"]');
  const ziele = links
    .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
    .filter((x): x is HTMLElement => Boolean(x));
  const sichtbar = new Map<Element, boolean>();
  const markiere = () => {
    let aktiv: Element | undefined;
    for (const z of ziele) {
      if (z.getBoundingClientRect().top < window.innerHeight * 0.3) aktiv = z;
    }
    links.forEach((a) => a.toggleAttribute('aria-current', aktiv !== undefined && a.hash === `#${aktiv.id}`));
  };
  const io2 = new IntersectionObserver((es) => {
    es.forEach((e) => sichtbar.set(e.target, e.isIntersecting));
    markiere();
  });
  ziele.forEach((z) => io2.observe(z));
  let t2 = false;
  window.addEventListener(
    'scroll',
    () => {
      if (t2) return;
      t2 = true;
      requestAnimationFrame(() => {
        t2 = false;
        markiere();
      });
    },
    { passive: true },
  );
  markiere();
}
