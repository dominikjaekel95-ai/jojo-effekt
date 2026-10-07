/**
 * Ernährungsplan als echtes PDF im Browser: kleiner Schriftsatz auf pdf-lib (Zeilenumbruch, Läufe mit Schnitt, Farbe,
 * Markierung und Hochstellung, Blöcke, Seitenfluss, Fußzeile). Inhalt und Gestaltung: ./pdf.ts.
 * Nur über ./pdf.ts geladen, und das nur per import() beim Klick (pdf-lib und @pdf-lib/fontkit sind groß).
 *
 * Maße in pt, von oben gezählt (pdf-lib zählt von unten; umgerechnet wird nur hier). Schriftgrößen wie die Druck-CSS
 * (src/styles/ernaehrungsplan-druck.css) in px × 0,75: 10, 12, 14, 18, 28, 48 px → 7,5 bis 36 pt, Abstände im 8-px-Raster.
 * Schrift „NDS Druck“: statische Schnitte aus Mona Sans (OFL), als TTF unter public/fonts/druck/ (Lizenz OFL.txt daneben),
 * eingebettet als Untermenge (TrueType, keine Type-3-Schriften).
 */
import { PDFDocument, PDFName, PDFString, rgb, setCharacterSpacing, type PDFFont, type PDFPage, type RGB } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { SCHNITTE, type Schnitt, type Schriften } from './schriften.ts';

const hex = (h: string) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
/** Farben der Druckfassung: Tinte, Text 3, Grün (Protein), Linie, Markierung (Vorlieben) */
export const FARBE = { ink: hex('#141513'), hell: hex('#5e605a'), gruen: hex('#2e5944'), linie: hex('#d3d4cd'), mark: hex('#f3e9b5') };
export const PX = 0.75;
export const MM = 72 / 25.4;
/** Schriftgrößen 1 bis 6 (10, 12, 14, 18, 28, 48 px) */
export const G = { 1: 7.5, 2: 9, 3: 10.5, 4: 13.5, 5: 21, 6: 36 } as const;

export interface Format {
  name: 'a4' | 'handy';
  breite: number;
  hoehe: number;
  rand: { oben: number; rechts: number; unten: number; links: number };
  /** Maßstab des Inhalts (Handy 0,97 wie die fertigen PDFs aus Chromium); Fußzeile immer 7,5 pt */
  m: number;
}
export const A4: Format = { name: 'a4', breite: 210 * MM, hoehe: 297 * MM, rand: { oben: 14 * MM, rechts: 14 * MM, unten: 16 * MM, links: 14 * MM }, m: 1 };
/** Handy: 90 mm breit, Höhe je Plan (mindestens 160 mm, siehe pdf.ts). Inhalt auf 97 %, so groß wie in den fertigen
 *  Handy-PDFs (Chromium verkleinert dort auf die Breite der längsten Zeile). */
export const handy = (hoeheMm: number): Format => ({ name: 'handy', breite: 90 * MM, hoehe: hoeheMm * MM, rand: { oben: 8 * MM, rechts: 7 * MM, unten: 15 * MM, links: 7 * MM }, m: 0.97 });

/** Ein Stück Text mit eigenem Stil. `hoch` = Fußnotenzahl (klein, hochgestellt, hell). */
export interface Lauf {
  t: string;
  s?: Schnitt;
  c?: RGB;
  /** eigene Schriftgröße (sonst die des Absatzes) */
  g?: number;
  mark?: boolean;
  hoch?: boolean;
  url?: string;
}
/** Steht für den gezeichneten Pfeil (die Schrift hat kein →) */
export const PFEIL = '\u2192';
/** Stil eines Absatzes: Größe, Zeilenhöhe (Faktor), Grundschnitt, Grundfarbe, Laufweite (em) */
export interface Stil {
  g: number;
  lh: number;
  s?: Schnitt;
  c?: RGB;
  sp?: number;
  /** Zeilen ausgleichen wie text-wrap: balance (Überschriften der Druck-CSS) */
  balance?: boolean;
}

interface Stueck {
  t: string;
  l: Lauf;
  w: number;
  g: number;
}
interface Zeile {
  teile: { st: Stueck; x: number }[];
  w: number;
}

/** Ein gesetzter Block: Höhe und Zeichenfunktion (x, y = linke obere Ecke im Inhaltsbereich). */
export interface Block {
  h: number;
  zeichne: (x: number, y: number) => void;
}

export class Satz {
  doc!: PDFDocument;
  f!: Format;
  fonts = {} as Record<Schnitt, PDFFont>;
  seiten: PDFPage[] = [];
  seite!: PDFPage;
  /** Position im Inhaltsbereich der aktuellen Seite, von oben */
  y = 0;
  /** Ober- und Unterlänge (Anteil der Schriftgröße) aus der Tabelle hhea */
  asc = 1.09;
  desc = 0.32;
  private links: { seite: PDFPage; x: number; y: number; w: number; h: number; url: string }[] = [];

  static async neu(schriften: Schriften, f: Format) {
    const s = new Satz();
    s.doc = await PDFDocument.create();
    s.doc.registerFontkit(fontkit);
    s.f = f;
    for (const k of Object.keys(SCHNITTE) as Schnitt[]) s.fonts[k] = await s.doc.embedFont(schriften[k], { subset: true });
    const m = metriken(schriften.text);
    if (m) [s.asc, s.desc] = m;
    return s;
  }

  /** Breite und Höhe des Inhaltsbereichs im Maßstab des Inhalts */
  get breite() {
    return (this.f.breite - this.f.rand.links - this.f.rand.rechts) / this.f.m;
  }
  get hoehe() {
    return (this.f.hoehe - this.f.rand.oben - this.f.rand.unten) / this.f.m;
  }
  get rest() {
    return this.hoehe - this.y;
  }

  neueSeite() {
    this.seite = this.doc.addPage([this.f.breite, this.f.hoehe]);
    this.seiten.push(this.seite);
    this.y = 0;
    return this.seite;
  }

  // ---- Messen

  breiteVon(t: string, schnitt: Schnitt, g: number, sp = 0) {
    if (!t) return 0;
    return this.fonts[schnitt].widthOfTextAtSize(t, g) + sp * g * [...t].length;
  }
  /** Abstand der Grundlinie von der Oberkante einer Zeile (CSS: halber Durchschuss oben) */
  grundlinie(g: number, lh: number) {
    return (lh * g - (this.asc + this.desc) * g) / 2 + this.asc * g;
  }

  // ---- Zeichnen (Koordinaten im Inhaltsbereich, von oben)

  private px(x: number) {
    return this.f.rand.links + x * this.f.m;
  }
  private py(y: number) {
    return this.f.hoehe - this.f.rand.oben - y * this.f.m;
  }
  text(t: string, x: number, yGrund: number, g: number, schnitt: Schnitt = 'text', c: RGB = FARBE.ink, sp = 0, seite = this.seite) {
    if (!t) return;
    const m = this.f.m;
    if (sp) seite.pushOperators(setCharacterSpacing(sp * g * m));
    seite.drawText(t, { x: this.px(x), y: this.py(yGrund), size: g * m, font: this.fonts[schnitt], color: c });
    if (sp) seite.pushOperators(setCharacterSpacing(0));
  }
  /** Text rechtsbündig an x */
  textRechts(t: string, xRechts: number, yGrund: number, g: number, schnitt: Schnitt = 'text', c: RGB = FARBE.ink) {
    this.text(t, xRechts - this.breiteVon(t, schnitt, g), yGrund, g, schnitt, c);
  }
  linie(x1: number, y: number, x2: number, c: RGB = FARBE.linie, dicke = 0.75, seite = this.seite) {
    seite.drawLine({ start: { x: this.px(x1), y: this.py(y) }, end: { x: this.px(x2), y: this.py(y) }, thickness: dicke * this.f.m, color: c });
  }
  flaeche(x: number, y: number, w: number, h: number, c: RGB, seite = this.seite) {
    seite.drawRectangle({ x: this.px(x), y: this.py(y + h), width: w * this.f.m, height: h * this.f.m, color: c });
  }
  kasten(x: number, y: number, w: number, c: RGB = FARBE.hell) {
    this.seite.drawRectangle({ x: this.px(x), y: this.py(y + w), width: w * this.f.m, height: w * this.f.m, borderColor: c, borderWidth: 0.75 * this.f.m });
  }
  /** Pfeil wie Pfeil.astro (Linie und Spitze), Breite `w`, Mitte auf yMitte */
  pfeil(x: number, yMitte: number, w: number, c: RGB = FARBE.hell) {
    // Pfad im 18er-Raster wie das SVG; die Strichstärke gilt im selben Raster (1,6)
    this.seite.drawSvgPath('M2 9h13M10 4l5 5-5 5', { x: this.px(x), y: this.py(yMitte - w / 2), scale: (w * this.f.m) / 18, borderColor: c, borderWidth: 1.6 });
  }
  link(x: number, y: number, w: number, h: number, url: string) {
    this.links.push({ seite: this.seite, x: this.px(x), y: this.py(y + h), w: w * this.f.m, h: h * this.f.m, url });
  }

  // ---- Absätze

  /** Läufe in Zeilen umbrechen (an Leerzeichen; überlange Wörter an / . - ? & = oder zeichenweise). */
  umbrechen(laeufe: Lauf[], stil: Stil, breite: number): Zeile[] {
    const g = stil.g;
    const sp = stil.sp ?? 0;
    const groesse = (l: Lauf) => (l.hoch ? g * 0.7 : l.g ?? g);
    const schnitt = (l: Lauf) => l.s ?? stil.s ?? 'text';
    const mess = (t: string, l: Lauf) => (t === PFEIL ? pfeilBreite(groesse(l)) : this.breiteVon(t, schnitt(l), groesse(l), l.hoch ? 0 : sp));
    // Wörter aus Stücken (ein Wort kann über mehrere Läufe gehen, z. B. „Tag.¹“)
    type Wort = { teile: Stueck[]; w: number; leer: Stueck | null };
    const woerter: Wort[] = [];
    let wort: Wort = { teile: [], w: 0, leer: null };
    for (const l of laeufe)
      for (const teil of l.t.split(/( +)/)) {
        if (!teil) continue;
        if (teil.startsWith(' ')) {
          if (wort.teile.length) {
            wort.leer = { t: ' ', l, w: mess(' ', l), g: groesse(l) };
            woerter.push(wort);
            wort = { teile: [], w: 0, leer: null };
          }
          continue;
        }
        const st = { t: teil, l, w: mess(teil, l), g: groesse(l) };
        wort.teile.push(st);
        wort.w += st.w;
      }
    if (wort.teile.length) woerter.push(wort);

    // Überlange Wörter teilen
    const teileWort = (w: Wort): Wort[] => {
      if (w.w <= breite) return [w];
      const out: Wort[] = [];
      let cur: Wort = { teile: [], w: 0, leer: null };
      for (const st of w.teile) {
        const stuecke = st.t.match(/[^/.\-?&=_]*[/.\-?&=_]?/g)?.filter(Boolean) ?? [st.t];
        for (let s of stuecke) {
          while (s) {
            let n = s.length;
            let wd = mess(s, st.l);
            if (cur.w + wd > breite) {
              if (cur.teile.length) {
                out.push(cur);
                cur = { teile: [], w: 0, leer: null };
              }
              while (n > 1 && mess(s.slice(0, n), st.l) > breite) n--;
              wd = mess(s.slice(0, n), st.l);
            }
            cur.teile.push({ t: s.slice(0, n), l: st.l, w: wd, g: st.g });
            cur.w += wd;
            s = s.slice(n);
          }
        }
      }
      cur.leer = w.leer;
      out.push(cur);
      return out;
    };
    const alle = woerter.flatMap(teileWort);

    const zeilen: Zeile[] = [];
    let z: Zeile = { teile: [], w: 0 };
    let offenesLeer: Stueck | null = null;
    for (const w of alle) {
      const lw = offenesLeer && z.teile.length ? offenesLeer.w : 0;
      if (z.teile.length && z.w + lw + w.w > breite + 0.01) {
        zeilen.push(z);
        z = { teile: [], w: 0 };
      } else if (z.teile.length && offenesLeer) {
        z.teile.push({ st: offenesLeer, x: z.w });
        z.w += offenesLeer.w;
      }
      for (const st of w.teile) {
        z.teile.push({ st, x: z.w });
        z.w += st.w;
      }
      offenesLeer = w.leer;
    }
    if (z.teile.length) zeilen.push(z);
    return zeilen;
  }

  /** Absatz als Block. `ausrichtung` rechts: jede Zeile rechtsbündig. */
  absatz(laeufe: Lauf[] | string, stil: Stil, breite = this.breite, o: { rechts?: boolean } = {}): Block & { zeilen: number; breiteMax: number } {
    const ls = typeof laeufe === 'string' ? [{ t: laeufe }] : laeufe;
    let zeilen = this.umbrechen(ls, stil, breite);
    if (stil.balance && zeilen.length > 1) {
      // schmalste Breite mit derselben Zeilenzahl suchen
      let unten = 0;
      let oben = breite;
      for (let i = 0; i < 12; i++) {
        const mitte = (unten + oben) / 2;
        if (this.umbrechen(ls, stil, mitte).length <= zeilen.length) oben = mitte;
        else unten = mitte;
      }
      zeilen = this.umbrechen(ls, stil, oben);
    }
    const zh = stil.g * stil.lh;
    const basis = this.grundlinie(stil.g, stil.lh);
    return {
      h: zeilen.length * zh,
      zeilen: zeilen.length,
      breiteMax: Math.max(0, ...zeilen.map((z) => z.w)),
      zeichne: (x, y) => {
        zeilen.forEach((z, i) => {
          const y0 = y + i * zh + basis;
          const dx = o.rechts ? breite - z.w : 0;
          // Markierung (Vorlieben) zuerst, durchgehend über Leerzeichen zwischen markierten Stücken
          z.teile.forEach(({ st, x: sx }, j) => {
            const nach = z.teile[j + 1];
            const markiert = st.l.mark && (st.t !== ' ' || (j > 0 && z.teile[j - 1].st.l.mark && nach?.st.l.mark));
            if (!markiert) return;
            const unten = y0 + this.desc * st.g;
            this.flaeche(x + dx + sx, unten - 0.42 * st.g, st.w + (nach?.st.l.mark ? 0.3 : 0), 0.42 * st.g, FARBE.mark);
          });
          for (const { st, x: sx } of z.teile) {
            if (st.t === ' ') continue;
            const l = st.l;
            if (st.t === PFEIL) {
              this.pfeil(x + dx + sx + st.g * 0.3, y0 - st.g * 0.33, st.g);
              continue;
            }
            const c = l.c ?? (l.hoch ? FARBE.hell : stil.c ?? FARBE.ink);
            this.text(st.t, x + dx + sx, l.hoch ? y0 - stil.g * 0.35 : y0, st.g, l.s ?? stil.s ?? 'text', c, l.hoch ? 0 : stil.sp ?? 0);
            if (l.url) this.link(x + dx + sx, y0 - st.g * this.asc, st.w, st.g * (this.asc + this.desc), l.url);
          }
        });
      },
    };
  }

  // ---- Fluss

  /** Blöcke, die selbst auf einer leeren Seite nicht passen (sollte nie vorkommen; Prüfung in test:plan) */
  ueberlauf = 0;

  /** Block an der aktuellen Position setzen; passt er nicht mehr (zusammen mit `danach`), auf eine neue Seite. */
  setze(b: Block, o: { vorher?: number; danach?: number; x?: number } = {}): void {
    const vorher = this.y > 0 ? (o.vorher ?? 0) : 0;
    if (this.y > 0 && vorher + b.h + (o.danach ?? 0) > this.rest + 0.01) {
      this.neueSeite();
      return this.setze(b, { ...o, vorher: 0 });
    }
    if (b.h > this.rest + 0.01) this.ueberlauf++;
    this.y += vorher;
    b.zeichne(o.x ?? 0, this.y);
    this.y += b.h;
  }

  /** Mehrere Blöcke untereinander als ein Block (Abstand `luft` dazwischen). */
  stapel(bs: Block[], luft = 0): Block {
    const h = bs.reduce((s, b) => s + b.h, 0) + Math.max(0, bs.length - 1) * luft;
    return {
      h,
      zeichne: (x, y) => {
        let yy = y;
        for (const b of bs) {
          b.zeichne(x, yy);
          yy += b.h + luft;
        }
      },
    };
  }

  // ---- Abschluss

  /** Fußzeile auf jeder Seite (links Hinweis, rechts Seitenzahl), Links eintragen, PDF speichern. */
  async fertig(fuss: { links: string; rechts: (n: number, von: number) => string }, meta: { titel: string; thema: string }) {
    const n = this.seiten.length;
    const g = 7.5;
    const f = this.f;
    const font = this.fonts.text;
    const innen = f.breite - f.rand.links - f.rand.rechts;
    const oben = f.hoehe - f.rand.unten + (f.name === 'a4' ? 4 : 3) * MM;
    const breiteR = font.widthOfTextAtSize(fuss.rechts(n, n).replace(/\d/g, '0'), g);
    // Links der Hinweis, rechts neben der ersten Zeile die Seitenzahl (Folgezeilen volle Breite); ungeskaliert wie die
    // Randfelder im Druck
    const m = f.m;
    f.m = 1;
    const ersteZeile = this.umbrechen([{ t: fuss.links }], { g, lh: 1.3 }, innen - breiteR - 6)[0];
    const erste = ersteZeile.teile.map((t) => t.st.t).join('');
    const rest = fuss.links.slice(erste.length).trim();
    const zeilen = [erste, ...(rest ? this.umbrechen([{ t: rest }], { g, lh: 1.3 }, innen).map((z) => z.teile.map((t) => t.st.t).join('')) : [])];
    f.m = m;
    this.seiten.forEach((seite, i) => {
      const grund = (j: number) => f.hoehe - oben - g - j * g * 1.3;
      zeilen.forEach((z, j) => seite.drawText(z, { x: f.rand.links, y: grund(j), size: g, font, color: FARBE.hell }));
      const rechts = fuss.rechts(i + 1, n);
      seite.drawText(rechts, { x: f.breite - f.rand.rechts - font.widthOfTextAtSize(rechts, g), y: grund(0), size: g, font, color: FARBE.hell });
    });
    for (const l of this.links) {
      const annot = this.doc.context.obj({
        Type: 'Annot',
        Subtype: 'Link',
        Rect: [l.x, l.y, l.x + l.w, l.y + l.h],
        Border: [0, 0, 0],
        A: { Type: 'Action', S: 'URI', URI: PDFString.of(l.url) },
      });
      l.seite.node.addAnnot(this.doc.context.register(annot));
    }
    this.doc.setTitle(meta.titel);
    this.doc.setSubject(meta.thema);
    this.doc.setAuthor('Nach der Spritze');
    this.doc.setCreator('nachderspritze.de');
    this.doc.setProducer('nachderspritze.de (pdf-lib)');
    this.doc.setLanguage('de-DE');
    this.doc.catalog.set(PDFName.of('ViewerPreferences'), this.doc.context.obj({ DisplayDocTitle: true }));
    return this.doc.save({ useObjectStreams: true });
  }
}

/** Pfeil 1 em breit plus 0,3 em Luft auf jeder Seite (wie .ed-pfeil: 14 px mit 4 px Rand bei 14 px Text) */
const pfeilBreite = (g: number) => g * 1.6;

/** Ober- und Unterlänge aus hhea (Anteil der Schriftgröße), wie sie der Browser für die Zeilenhöhe nimmt. */
function metriken(daten: ArrayBuffer | Uint8Array): [number, number] | null {
  const u8 = daten instanceof Uint8Array ? daten : new Uint8Array(daten);
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const n = dv.getUint16(4);
  let head = -1;
  let hhea = -1;
  for (let i = 0; i < n; i++) {
    const o = 12 + i * 16;
    const tag = String.fromCharCode(u8[o], u8[o + 1], u8[o + 2], u8[o + 3]);
    if (tag === 'head') head = dv.getUint32(o + 8);
    if (tag === 'hhea') hhea = dv.getUint32(o + 8);
  }
  if (head < 0 || hhea < 0) return null;
  const upm = dv.getUint16(head + 18);
  return [dv.getInt16(hhea + 4) / upm, -dv.getInt16(hhea + 6) / upm];
}
