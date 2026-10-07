/**
 * Interaktive Planseite: Gerichte ziehen (Pointer Events, Finger und Maus). Gezogen wird am Griff eines Gerichts; die
 * Ziele liefert `start` (Elemente mit `data-ziel-tag`: am Handy die Tagesknöpfe, am Desktop dieselbe Mahlzeit an den
 * anderen Tagen). Ein Tipp ohne Bewegung zählt als Klick (öffnet das Menü „Mit Tag … tauschen“).
 * Mit dem Finger beginnt das Ziehen erst nach kurzem Halten (HALTEN); wer gleich wischt, scrollt die Seite wie gewohnt.
 * Bewegt wird nur der Schatten (transform); am Rand des Fensters scrollt die Seite mit.
 */
export interface ZiehOptionen {
  /** Ziele des Gerichts (Elemente mit data-ziel-tag) */
  start: (griff: HTMLElement) => HTMLElement[];
  /** Ablegen auf Tag `ziel` */
  ablegen: (griff: HTMLElement, ziel: number) => void;
  /** Text des Schattens */
  name: (griff: HTMLElement) => string;
}

const SCHWELLE = 6;
const HALTEN = 220;

export function ziehen(bereich: HTMLElement, o: ZiehOptionen) {
  let griff: HTMLElement | null = null;
  let pointer = -1;
  let x0 = 0;
  let y0 = 0;
  let y = 0;
  /** Finger: lange genug gehalten; Maus und Stift: sofort */
  let bereit = false;
  let uhr = 0;
  let aktiv = false;
  let geist: HTMLElement | null = null;
  let ueber: HTMLElement | null = null;
  let ziele: HTMLElement[] = [];
  let scrollen = 0;
  /** Nach einem Ziehen den folgenden Klick verschlucken */
  let gezogen = false;

  const markiere = (an: boolean) => ziele.forEach((el) => el.classList.toggle('pi-ziel', an));

  const rand = () => {
    const h = window.innerHeight;
    const v = y < 72 ? -1 : y > h - 72 ? 1 : 0;
    if (v) window.scrollBy(0, v * 12);
    scrollen = v && aktiv ? requestAnimationFrame(rand) : 0;
  };

  const ende = (ablegen: boolean) => {
    clearTimeout(uhr);
    griff?.classList.remove('pi-bereit');
    if (aktiv && griff) {
      const ziel = ablegen && ueber ? Number(ueber.dataset.zielTag) : -1;
      gezogen = true;
      setTimeout(() => (gezogen = false), 0);
      markiere(false);
      ueber?.classList.remove('pi-ziel-an');
      geist?.remove();
      griff.closest('.pi-mz')?.classList.remove('pi-zieht');
      document.documentElement.classList.remove('pi-ziehen');
      if (ziel >= 0) o.ablegen(griff, ziel);
    }
    if (scrollen) cancelAnimationFrame(scrollen);
    scrollen = 0;
    griff = null;
    pointer = -1;
    aktiv = false;
    bereit = false;
    geist = null;
    ueber = null;
  };

  bereich.addEventListener('pointerdown', (e) => {
    const g = (e.target as HTMLElement).closest<HTMLElement>('.pi-griff');
    if (!g || e.button !== 0 || griff) return;
    griff = g;
    pointer = e.pointerId;
    x0 = e.clientX;
    y0 = e.clientY;
    bereit = e.pointerType !== 'touch';
    if (!bereit)
      uhr = window.setTimeout(() => {
        if (griff !== g) return;
        bereit = true;
        g.classList.add('pi-bereit');
      }, HALTEN);
    try {
      g.setPointerCapture(e.pointerId);
    } catch {
      /* ältere Browser: Ziehen geht trotzdem, solange der Zeiger auf der Seite bleibt */
    }
  });

  bereich.addEventListener('pointermove', (e) => {
    if (!griff || e.pointerId !== pointer) return;
    y = e.clientY;
    if (!aktiv) {
      if (Math.hypot(e.clientX - x0, e.clientY - y0) < SCHWELLE) return;
      // Finger bewegt sich vor dem Halten: Das ist Scrollen, kein Ziehen
      if (!bereit) return ende(false);
      aktiv = true;
      ziele = o.start(griff);
      griff.closest('.pi-mz')?.classList.add('pi-zieht');
      document.documentElement.classList.add('pi-ziehen');
      markiere(true);
      geist = document.createElement('div');
      geist.className = 'pi-geist';
      geist.setAttribute('aria-hidden', 'true');
      geist.textContent = o.name(griff);
      document.body.append(geist);
    }
    e.preventDefault();
    if (geist) geist.style.transform = `translate(${e.clientX + 14}px, ${e.clientY - 22}px)`;
    const unter = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('.pi-ziel') ?? null;
    if (unter !== ueber) {
      ueber?.classList.remove('pi-ziel-an');
      unter?.classList.add('pi-ziel-an');
      ueber = unter;
    }
    if (!scrollen) scrollen = requestAnimationFrame(rand);
  });

  // Nach dem Halten verhindert das die Seitenbewegung (der Griff erlaubt sonst Scrollen und Wischen)
  bereich.addEventListener('touchmove', (e) => griff && bereit && e.cancelable && e.preventDefault(), { passive: false });
  bereich.addEventListener('pointerup', (e) => e.pointerId === pointer && ende(true));
  bereich.addEventListener('pointercancel', (e) => e.pointerId === pointer && ende(false));
  bereich.addEventListener('lostpointercapture', (e) => e.pointerId === pointer && aktiv && ende(true));
  window.addEventListener('keydown', (e) => e.key === 'Escape' && aktiv && ende(false));

  return { gezogen: () => gezogen };
}
