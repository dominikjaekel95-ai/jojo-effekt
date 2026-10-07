/**
 * Planseite: „Als PDF senden“ und „PDF herunterladen“ (Knöpfe ganz oben, Leiste bleibt beim Scrollen stehen).
 *
 * - Als PDF senden: Blatt mit Formular an api/ernaehrungsplan.js (E-Mail, Ausschlusskriterien, Einwilligung „Plan plus
 *   Newsletter“ mit Plannummer und Auswahl der Gerichte, freiwillig und nicht vorausgewählt: Warteliste). Versteckt
 *   mitgeschickt: Plan-Antworten, Vorlieben und der Zustand `zustand` (= ?s=, höchstens ZUSTAND_MAX Zeichen; ist er länger,
 *   geht er leer mit, und das Blatt sagt das). Weiterleitung auf /ernaehrungsplan/danke/. Daneben der Weg ohne Newsletter:
 *   Mail an Dominik mit Plannummer, Vorlieben und Link auf genau diesen Plan.
 * - PDF herunterladen: echtes PDF im Browser (src/lib/plan-pdf/pdf.ts mit pdf-lib, per import() erst beim ersten Bedarf;
 *   Schriften von /fonts/druck/), Format nach Gerät (schmaler Bildschirm oder grober Zeiger: Handy, sonst A4), Umschalter
 *   „A4 / Handy“. Download über eine Blob-Adresse; die Meldung danach bietet „Öffnen“ (neuer Tab), falls ein Browser
 *   (etwa in einer App) den Download nicht anzeigt. Mit ?pdf=1 (Link aus der Mail) steht oben „Dein PDF“ mit Knopf
 *   (sichtbar per Klasse ep-pdf1 aus dem Inline-Skript der Seite); automatisch lädt nichts herunter.
 * Plausible über `melde`: „Plan interaktiv“ mit aktion=senden bzw. aktion=pdf und format=a4|handy; keine Inhalte.
 */
import type { Plan } from '../../data/ernaehrungsplan.ts';
import { ladeSchriften, type Schriften } from '../plan-pdf/schriften.ts';

/** Längster Zustand, den das Formular mitschickt (MailerLite-Feld `zustand`, api/ernaehrungsplan.js prüft dasselbe) */
export const ZUSTAND_MAX = 250;
export const ZUSTAND_MUSTER = /^[0-9a-z.]*$/;
/** Wert für das Formularfeld `zustand`: der Zustand aus der Adresse, wenn er gültig und kurz genug ist, sonst leer */
export const zustandFeld = (s: string) => (s.length <= ZUSTAND_MAX && ZUSTAND_MUSTER.test(s) ? s : '');

export type Format = 'a4' | 'handy';
export interface SendenKontext {
  root: HTMLElement;
  plan: () => Plan;
  vorlieben: () => string[];
  zustand: () => string;
  stand: string;
  melde: (aktion: 'senden' | 'pdf', props?: Record<string, string>, danach?: () => void) => void;
  sage: (text: string, aktion?: { text: string; fn: () => void }) => void;
}

/** Adresse der Planseite mit Vorlieben und Zustand (kanonische Domain, auch in der Vorschau) */
export function planAdresse(basis: string, v: string[], s: string) {
  const teile = [v.length ? `v=${v.join(',')}` : '', s ? `s=${s}` : ''].filter(Boolean);
  return `${basis}${teile.length ? `?${teile.join('&')}` : ''}`;
}

let pdfModul: Promise<typeof import('../plan-pdf/pdf.ts')> | null = null;
let schriften: Promise<Schriften> | null = null;
/** PDF-Code und Schriften laden (einmal; bei Fehler beim nächsten Versuch neu) */
function vorladen() {
  pdfModul ??= import('../plan-pdf/pdf.ts').catch((e) => {
    pdfModul = null;
    throw e;
  });
  schriften ??= ladeSchriften().catch((e) => {
    schriften = null;
    throw e;
  });
  return Promise.all([pdfModul, schriften]);
}

export function verbindeSenden(ctx: SendenKontext) {
  const { root } = ctx;
  const blatt = root.querySelector<HTMLDialogElement>('[data-ep-senden-blatt]');
  const form = blatt?.querySelector<HTMLFormElement>('form');
  const schalter = [...root.querySelectorAll<HTMLElement>('[data-ep-format]')];
  const status = root.querySelector<HTMLElement>('[data-ep-pdf-status]');
  const basis = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? `${location.origin}${location.pathname}`;
  const rm = () => document.documentElement.classList.contains('rm');

  // ---- Format: nach Gerät, umschaltbar
  const handyGeraet = window.matchMedia('(max-width: 699px), (pointer: coarse)').matches;
  let format: Format = handyGeraet ? 'handy' : 'a4';
  // Mehrere Umschalter (oben bei „Dein PDF“ und unter dem Profil) zeigen dieselbe Wahl
  const zeigeFormat = () =>
    schalter.forEach((sch) => {
      sch.dataset.an = format === 'a4' ? '0' : '1';
      sch.querySelectorAll<HTMLButtonElement>('[data-format]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.format === format)));
    });
  schalter.forEach((sch) =>
    sch.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-format]');
      if (!b) return;
      format = b.dataset.format === 'handy' ? 'handy' : 'a4';
      zeigeFormat();
    }),
  );
  zeigeFormat();

  // ---- PDF herunterladen
  let laeuft = false;
  let letzteUrl = '';
  const knoepfe = [...root.querySelectorAll<HTMLButtonElement>('[data-ep-laden]')];
  const setzeStatus = (text: string) => status && (status.textContent = text);
  async function ladePdf(knopf: HTMLButtonElement) {
    if (laeuft) return;
    laeuft = true;
    const text = knopf.textContent;
    const fmt = format;
    knoepfe.forEach((k) => k.setAttribute('aria-busy', 'true'));
    knopf.textContent = 'PDF wird erstellt …';
    setzeStatus('PDF wird erstellt …');
    try {
      const [m, sch] = await vorladen();
      const plan = ctx.plan();
      const schlussEl = root.querySelector('.ed-schluss');
      if (!schlussEl) throw new Error('Hinweise fehlen');
      const bytes = await m.erzeugePdf({ plan, format: fmt, stand: ctx.stand, schluss: m.schlussAusSeite(schlussEl), adresse: planAdresse(basis, ctx.vorlieben(), ctx.zustand()) }, sch);
      const name = m.dateiname(plan, fmt);
      if (letzteUrl) URL.revokeObjectURL(letzteUrl);
      letzteUrl = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = letzteUrl;
      a.download = name;
      a.rel = 'noopener';
      document.body.append(a);
      a.click();
      a.remove();
      const url = letzteUrl;
      setzeStatus(`Fertig: ${name} (${fmt === 'a4' ? 'A4' : 'fürs Handy'}).`);
      ctx.sage(`PDF gespeichert: ${name}`, { text: 'Öffnen', fn: () => window.open(url, '_blank', 'noopener') });
      ctx.melde('pdf', { format: fmt });
    } catch (e) {
      console.error('PDF', e);
      setzeStatus('Das PDF ließ sich gerade nicht erstellen. Versuch es noch einmal oder nimm die fertigen PDFs darunter.');
      ctx.sage('Das PDF ließ sich gerade nicht erstellen.');
    } finally {
      knopf.textContent = text;
      knoepfe.forEach((k) => k.removeAttribute('aria-busy'));
      laeuft = false;
    }
  }
  for (const k of knoepfe) {
    k.addEventListener('click', () => void ladePdf(k));
    // Code und Schriften schon laden, wenn der Finger oder die Maus den Knopf erreicht
    for (const ev of ['pointerenter', 'focus', 'touchstart'] as const) k.addEventListener(ev, () => void vorladen().catch(() => {}), { once: true, passive: true });
  }

  // ---- Als PDF senden: Blatt mit Formular
  if (!blatt || !form) return;
  const zuLang = blatt.querySelector<HTMLElement>('[data-ep-zu-lang]');
  const ohne = blatt.querySelector<HTMLAnchorElement>('[data-ep-ohne]');
  const feld = (name: string) => form.querySelector<HTMLInputElement>(`input[name="${name}"]`)!;
  let ausloeser: HTMLElement | null = null;

  function fuelle() {
    const v = ctx.vorlieben();
    const s = ctx.zustand();
    const plan = ctx.plan();
    feld('vorlieben').value = v.join(',');
    feld('zustand').value = zustandFeld(s);
    if (zuLang) zuLang.hidden = !s || zustandFeld(s) === s;
    if (ohne) {
      const text = `Hallo Dominik,\n\nich hätte gern meinen Ernährungsplan per Mail, aber ohne Newsletter.\n\nPlan: ${plan.id}\nVorlieben: ${v.length ? v.join(', ') : 'keine'}\nMein Plan mit meinen Gerichten: ${planAdresse(basis, v, s)}\n`;
      ohne.href = `mailto:${ohne.textContent?.trim()}?subject=${encodeURIComponent('Ernährungsplan ohne Newsletter')}&body=${encodeURIComponent(text)}`;
    }
  }

  function oeffne(von: HTMLElement) {
    ausloeser = von;
    fuelle();
    if (!blatt!.open) blatt!.showModal();
    requestAnimationFrame(() => blatt!.classList.add('auf'));
    blatt!.querySelector<HTMLInputElement>('input[type="email"]')?.focus();
  }
  function schliesse() {
    if (!blatt!.open) return;
    blatt!.classList.remove('auf');
    const zu = () => {
      blatt!.close();
      if (ausloeser?.isConnected) ausloeser.focus({ preventScroll: true });
    };
    if (rm()) zu();
    else setTimeout(zu, 200);
  }
  root.querySelectorAll<HTMLElement>('[data-ep-senden]').forEach((b) => b.addEventListener('click', () => oeffne(b)));
  blatt.addEventListener('cancel', (e) => {
    e.preventDefault();
    schliesse();
  });
  blatt.addEventListener('click', (e) => {
    if (e.target === blatt || (e.target as HTMLElement).closest('[data-ep-zu]')) schliesse();
  });
  // Absenden: Zustand frisch eintragen, Ereignis melden (höchstens 400 ms warten), dann wirklich absenden
  let gesendet = false;
  form.addEventListener('submit', (e) => {
    if (gesendet) return;
    e.preventDefault();
    fuelle();
    gesendet = true;
    ctx.melde('senden', undefined, () => form.submit());
  });
  // Zurück aus dem Verlauf (bfcache): wieder absendbar
  window.addEventListener('pageshow', () => (gesendet = false));
}
