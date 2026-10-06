/**
 * Bewegung für die Unterseiten im Design „Kalk“ (Stufe 2D): Einblenden beim Scrollen, Werte zählen hoch, Balken zeichnen
 * sich, Linien wachsen mit dem Scroll-Fortschritt. Eingebunden über SeitenKopf.astro; Werkzeuge importieren `zaehle`.
 *
 * Regeln (Briefing): nur transform, opacity, stroke-dashoffset; Easing cubic-bezier(.65,0,.35,1). Ohne JavaScript oder mit
 * reduzierter Bewegung (Klasse `rm` auf <html>, gesetzt in Base.astro) steht sofort der Endzustand da. Zahlen stehen im
 * HTML schon als Endwert (Suchmaschinen, Drucken); das Skript zählt sie erst beim Einblenden von 0 hoch.
 *
 * Attribute:
 *   data-rv          blendet ein (CSS in src/styles/seiten.css), Staffelung über style="--i:n"
 *   data-draw        Behälter; enthaltene .k-bar zeichnen sich (scaleX) beim Einblenden
 *   data-count="12"  zählt beim Einblenden hoch; data-dec="1" Nachkommastellen
 *   data-progress    setzt --p (0 bis 1) aus dem Scroll-Fortschritt, z. B. für eine wachsende Zeitleiste
 */

export const reduziert = (): boolean => document.documentElement.classList.contains('rm');

/** Entspricht ungefähr cubic-bezier(.65,0,.35,1) */
export const ease = (k: number): number => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

export const zahlDe = (n: number, dec = 0): string =>
  n.toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec });

const laufend = new WeakMap<Element, number>();

/** Zählt den Text eines Elements von `von` auf `bis`. Ohne Bewegung: sofort der Endwert. */
export function zaehle(el: Element, von: number, bis: number, fmt: (n: number) => string = (n) => zahlDe(n), dauer = 900): void {
  const ende = fmt(bis);
  const alt = laufend.get(el);
  if (alt) cancelAnimationFrame(alt);
  if (reduziert() || von === bis || !Number.isFinite(von)) {
    el.textContent = ende;
    return;
  }
  const t0 = performance.now();
  const schritt = (t: number) => {
    const k = Math.min(1, (t - t0) / dauer);
    el.textContent = k < 1 ? fmt(von + (bis - von) * ease(k)) : ende;
    if (k < 1) laufend.set(el, requestAnimationFrame(schritt));
    else laufend.delete(el);
  };
  laufend.set(el, requestAnimationFrame(schritt));
}

function hochzaehlen(el: HTMLElement): void {
  const bis = Number(el.dataset.count);
  if (!Number.isFinite(bis)) return;
  const dec = Number(el.dataset.dec || 0);
  zaehle(el, 0, bis, (n) => zahlDe(n, dec), Number(el.dataset.dur || 1100));
}

let io: IntersectionObserver | null = null;

/** Beobachtet alle noch nicht eingeblendeten Elemente unterhalb von `root`. Mehrfach aufrufbar. */
export function beobachte(root: ParentNode = document): void {
  // html.bw: das Skript läuft. Ohne diese Klasse blendet seiten.css nach etwa 3 s alles ein (Skript blockiert oder fehlerhaft).
  document.documentElement.classList.add('bw');
  const els =root.querySelectorAll<HTMLElement>('[data-rv]:not(.in), [data-draw]:not(.in), [data-count]:not(.in)');
  if (reduziert() || !('IntersectionObserver' in window)) {
    els.forEach((e) => e.classList.add('in'));
    return;
  }
  io ??= new IntersectionObserver(
    (eintraege) => {
      eintraege.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        el.classList.add('in');
        if (el.dataset.count !== undefined) hochzaehlen(el);
        io?.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0 },
  );
  els.forEach((e) => io?.observe(e));
}

/** Setzt --p (0 bis 1) auf [data-progress]-Elementen: 0, wenn ihr Anfang die Bildschirmmitte erreicht, 1 am Ende. */
export function fortschritt(): void {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-progress]'));
  if (!els.length) return;
  if (reduziert()) {
    els.forEach((e) => e.style.setProperty('--p', '1'));
    return;
  }
  let tick = false;
  const rechne = () => {
    tick = false;
    const vh = window.innerHeight;
    els.forEach((e) => {
      const r = e.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (vh * 0.65 - r.top) / Math.max(1, r.height)));
      e.style.setProperty('--p', p.toFixed(4));
    });
  };
  const anfordern = () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(rechne);
  };
  window.addEventListener('scroll', anfordern, { passive: true });
  window.addEventListener('resize', anfordern);
  rechne();
}
