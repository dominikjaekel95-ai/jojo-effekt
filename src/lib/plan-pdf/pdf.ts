/**
 * Ernährungsplan als echtes PDF, erzeugt im Browser aus dem aktuellen Zustand der Planseite (Verschiebungen, Tausche,
 * ausgeblendete Gerichte, Vorlieben). Kein Server, keine externen Requests: pdf-lib und @pdf-lib/fontkit kommen als
 * eigener Chunk erst beim Klick (import() in src/lib/plan-interaktiv/seite.ts), die Schriften von /fonts/druck/.
 *
 * Gestaltung wie die fertigen PDFs (src/lib/ernaehrungsplan-druck.ts, src/styles/ernaehrungsplan-druck.css,
 * scripts/ernaehrungsplan-pdf.mjs): Deckblatt (Planname, drei Zahlen, drei Regeln), je Woche „auf einen Blick“, Einkaufsliste
 * und die Tage (A4: zwei pro Seite, Handy: einer pro Seite), Rezepte (A4: zwei pro Seite), Tauschen, letzte Seite mit
 * Hinweisen, Ausschlusskriterien, Pflichtsatz und Quellen (Text aus der Druckfassung der Seite, .ed-schluss). Fußzeile
 * „Allgemeiner Beispielplan …“ und Seitenzahl. Formate: A4 (210 × 297 mm) und Handy (90 mm breit, Höhe nach dem längsten
 * Tag, mindestens 160 mm, in 5-mm-Schritten). Keine Kalorien, keine Präparatenamen.
 */
import { Satz, A4, handy, FARBE, G, MM, PFEIL, type Lauf, type Block, type Stil } from './satz.ts';
import type { Schriften } from './schriften.ts';
import { ernaehrungOptionen, appetitOptionen, gewichtLabel, vorliebeLabel, type Plan, type Tag, type Woche, type GeplanteMahlzeit } from '../../data/ernaehrungsplan.ts';
import { einkaufDaten, rezepteImPlan, tauschZeilen, portionText, kurzName, aufzaehlung, type EinkaufPosten } from '../ernaehrungsplan-druck.ts';


/** Letzte Seite: Hinweise (je ein Absatz aus Läufen), Grenzen mit Pflichtsatz und Kontakt, Quellen */
export interface SchlussDaten {
  hinweise: Lauf[][];
  grenzen: Lauf[][];
  quellen: { text: string; url?: string }[];
}
export interface PdfAuftrag {
  plan: Plan;
  format: 'a4' | 'handy';
  /** „Oktober 2026“ */
  stand: string;
  schluss: SchlussDaten;
  /** Adresse der Planseite mit diesem Zustand (steht klein auf dem Deckblatt, als Link) */
  adresse?: string;
}

const nb = '\u00a0';
const FUSS = 'Allgemeiner Beispielplan für gesunde Erwachsene, keine ärztliche oder ernährungstherapeutische Beratung.';
type Rezept = ReturnType<typeof rezepteImPlan>[number];

/** Dateiname, z. B. ernaehrungsplan-ek11-a4.pdf */
export const dateiname = (plan: Plan, format: 'a4' | 'handy') => `ernaehrungsplan-${plan.id}-${format}.pdf`;

/** Ergebnis fürs Testskript: Seitenzahl und Blöcke, die nicht auf eine Seite passten (soll 0 sein) */
export interface PdfBericht {
  seiten: number;
  ueberlauf: number;
  hoeheMm: number;
}

export async function erzeugePdf(a: PdfAuftrag, schriften: Schriften, bericht?: PdfBericht): Promise<Uint8Array> {
  const istHandy = a.format === 'handy';
  const liste = rezepteImPlan(a.plan);
  const rezeptNr = new Map(liste.map((r) => [r.m.id, r.nr]));
  // Handy: Seitenhöhe nach dem längsten Tag (wie scripts/ernaehrungsplan-pdf.mjs), dafür vorab messen
  let format = istHandy ? handy(160) : A4;
  if (istHandy) {
    const probe = await Satz.neu(schriften, format);
    const max = Math.max(...a.plan.tage.map((t) => tagBlock(probe, t, rezeptNr, a.plan.laktosefrei, true).h));
    format = handy(Math.max(160, Math.ceil(((max * format.m) / MM + 8 + 15 + 2) / 5) * 5));
  }
  const s = await Satz.neu(schriften, format);
  const lf = a.plan.laktosefrei;

  deckblatt(s, a, istHandy);
  for (const w of a.plan.wochen) {
    blick(s, w, istHandy);
    einkauf(s, w, lf, istHandy);
    tage(s, w, rezeptNr, lf, istHandy);
  }
  rezepte(s, liste, lf, istHandy);
  tauschen(s, a.plan, istHandy);
  schluss(s, a.schluss);

  if (bericht) Object.assign(bericht, { seiten: s.seiten.length, ueberlauf: s.ueberlauf, hoeheMm: Math.round(format.hoehe / MM) });
  return s.fertig(
    { links: istHandy ? FUSS : `nachderspritze.de · ${FUSS}`, rechts: (n, von) => (istHandy ? `${n} / ${von}` : `Seite ${n} von ${von}`) },
    { titel: `Dein Ernährungsplan (${a.plan.id}, ${istHandy ? 'Handy' : 'A4'})`, thema: 'Ernährungsplan für 14 Tage, Nach der Spritze' },
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Bausteine

const hell = (t: string, extra: Partial<Lauf> = {}): Lauf => ({ t, c: FARBE.hell, ...extra });
const STIL = {
  label: { g: G[2], lh: 1.5, c: FARBE.hell } as Stil,
  klein: { g: G[2], lh: 1.5, c: FARBE.hell } as Stil,
  text: { g: G[3], lh: 1.5 } as Stil,
  h: { g: G[5], lh: 1.15, s: 'kopf', sp: -0.02 } as Stil,
  h4: { g: G[4], lh: 1.3, s: 'kopf', sp: -0.01 } as Stil,
};

/** Seitenkopf: Überschrift links, kleiner Text rechts auf derselben Grundlinie (Handy: darunter). Mit Abstand danach. */
function kopf(s: Satz, titel: string, rechts: string, istHandy: boolean, danach = istHandy ? 12 : 18): Block {
  if (istHandy) {
    const h = s.absatz(titel, STIL.h);
    const r = rechts ? s.absatz(rechts, STIL.label) : null;
    const b = r ? s.stapel([h, r], 3) : h;
    return { h: b.h + danach, zeichne: b.zeichne };
  }
  const wr = rechts ? s.breiteVon(rechts, 'text', G[2]) : 0;
  const h = s.absatz(titel, STIL.h, s.breite - wr - 12);
  return {
    h: h.h + danach,
    zeichne: (x, y) => {
      h.zeichne(x, y);
      if (rechts) s.text(rechts, x + s.breite - wr, y + s.grundlinie(G[5], 1.15), G[2], 'text', FARBE.hell);
    },
  };
}

/** Einleitung unter dem Kopf (max. 560 px breit), mit Abstand danach */
function intro(s: Satz, text: string, istHandy: boolean): Block {
  const b = s.absatz(text, STIL.klein, Math.min(s.breite, 420));
  const nach = istHandy ? 12 : 18;
  return { h: b.h - 6 + nach, zeichne: (x, y) => b.zeichne(x, y - 6) };
}

/** Text eines Absatzes mit fett gesetztem Anfang („Protein zuerst. Iss bei …“) */
const mitFett = (fett: string, rest: string): Lauf[] => [{ t: fett, s: 'fett', c: FARBE.ink }, { t: ` ${rest}` }];

// ---------------------------------------------------------------------------------------------------------------
// Deckblatt

function deckblatt(s: Satz, a: PdfAuftrag, istHandy: boolean) {
  const plan = a.plan;
  const form = ernaehrungOptionen.find((x) => x.value === plan.ernaehrung)!.label;
  const appetit = appetitOptionen.find((x) => x.value === plan.appetit)!.label;
  const unter = [`Appetit ${appetit.toLowerCase()}`, gewichtLabel[plan.gewicht]];
  if (plan.vorlieben.length) unter.push(`Vorlieben: ${plan.vorlieben.map((v) => vorliebeLabel(v, plan.laktosefrei)).join(', ')}`);
  const lf = plan.laktosefrei && plan.ernaehrung !== 'vegan';
  const regeln: Lauf[][] = [
    mitFett('Protein zuerst.', 'Iss bei jeder Mahlzeit zuerst die Proteinquelle, dann das Gemüse, dann den Rest.'),
    plan.appetit === 'klein'
      ? mitFett('Kleine Portionen sind Absicht.', 'Dafür gibt es proteinreiche Zwischenmahlzeiten; schaffst du eine Mahlzeit nicht, iss zuerst den Proteinteil.')
      : mitFett('Satt ist genug.', 'Die Mengen sind Richtwerte: Bist du vorher satt, lass die Beilage liegen, nicht das Protein.'),
    mitFett('Tauschen ist erlaubt.', 'Tage dürfen die Reihenfolge wechseln; Proteinquellen tauschst du mit der Liste „Tauschen“ am Ende.'),
  ];
  const aufbau = `So ist der Plan aufgebaut: für jede Woche zuerst der Überblick${istHandy ? '' : ' zum Aufhängen'}, dann die Einkaufsliste, dann ${istHandy ? 'ein Tag' : 'zwei Tage'} pro Seite. Danach Rezepte, Tauschen und Hinweise.`;
  const fussBlock = (breite: number) => {
    const teile = [s.absatz(aufbau, STIL.klein, breite)];
    if (a.adresse) {
      const anzeige = a.adresse.replace(/^https?:\/\//, '');
      teile.push(s.absatz([{ t: 'Deine Planseite mit diesen Gerichten: ' }, { t: anzeige, url: a.adresse, c: FARBE.ink }], STIL.klein, breite));
    }
    return s.stapel(teile, 6);
  };

  s.neueSeite();
  // Marke
  if (istHandy) {
    s.setze(s.absatz('Nach der Spritze · Ernährungsplan', STIL.label));
    s.setze(s.absatz(`Stand ${a.stand}`, STIL.label));
  } else {
    s.text('Nach der Spritze · Ernährungsplan', 0, s.grundlinie(G[2], 1.5), G[2], 'text', FARBE.hell);
    s.textRechts(`Stand ${a.stand}`, s.breite, s.grundlinie(G[2], 1.5), G[2], 'text', FARBE.hell);
    s.y = G[2] * 1.5;
  }
  s.setze(s.absatz('Dein Ernährungsplan', istHandy ? STIL.h : { g: G[6], lh: 1.05, s: 'kopf', sp: -0.025 }), { vorher: istHandy ? 36 : 72 });
  s.setze(s.absatz(unter.join(' · '), { g: istHandy ? G[3] : G[4], lh: 1.4, c: FARBE.hell }), { vorher: istHandy ? 6 : 12 });

  // Drei Zahlen
  const gross = istHandy ? G[5] : G[6];
  const spalten: { dt: string; dd: string; zusatz?: string; gruen?: boolean }[] = [
    { dt: 'Ernährungsform', dd: form, zusatz: lf ? 'laktosefrei' : undefined },
    { dt: 'Tage', dd: String(plan.tage.length) },
    { dt: 'Protein pro Tag', dd: `${plan.ziel}${nb}g`, gruen: true },
  ];
  const zahlBlock = (sp: (typeof spalten)[number]): Block & { w: number } => {
    const dt = s.absatz(sp.dt, STIL.label);
    const ddStil: Stil = { g: gross, lh: 1, s: 'zahl', sp: -0.03, c: sp.gruen ? FARBE.gruen : FARBE.ink };
    const dd = s.absatz(sp.dd, ddStil);
    const teile = [dt, dd];
    if (sp.zusatz) teile.push(s.absatz(sp.zusatz, STIL.label));
    const b = s.stapel(teile, 6);
    return { ...b, w: Math.max(dt.breiteMax, dd.breiteMax) };
  };
  const zb = spalten.map(zahlBlock);
  if (istHandy) {
    zb.forEach((b, i) => s.setze(b, { vorher: i ? 18 : 36 }));
    s.neueSeite();
  } else {
    s.y += 48;
    let x = 0;
    for (const b of zb) {
      b.zeichne(x, s.y);
      x += b.w + 36;
    }
    s.y += Math.max(...zb.map((b) => b.h)) + 48;
  }

  // Drei Regeln
  const einzug = istHandy ? 18 : 30;
  const breite = Math.min(s.breite, 420);
  s.setze(s.absatz('Drei Regeln', STIL.h4));
  regeln.forEach((r, i) => {
    const text = s.absatz(r, STIL.text, breite - einzug);
    s.setze(
      {
        h: text.h,
        zeichne: (x, y) => {
          s.text(String(i + 1), x, y + s.grundlinie(G[3], 1.5), G[3], 'zahl', FARBE.gruen);
          text.zeichne(x + einzug, y);
        },
      },
      { vorher: 12 },
    );
  });

  // Aufbau (A4 unten auf der Seite) und Adresse der Planseite
  const fb = fussBlock(breite);
  if (istHandy) s.setze(fb, { vorher: 24 });
  else fb.zeichne(0, Math.max(s.y + 24, s.hoehe - fb.h));
}

// ---------------------------------------------------------------------------------------------------------------
// Woche auf einen Blick: 7 Tage × Frühstück, Mittag, Abend, Zwischendurch

const SPALTEN: [string, (t: Tag) => GeplanteMahlzeit[]][] = [
  ['Frühstück', (t) => t.mahlzeiten.filter((m) => m.slot === 'fruehstueck')],
  ['Mittag', (t) => t.mahlzeiten.filter((m) => m.slot === 'mittag')],
  ['Abend', (t) => t.mahlzeiten.filter((m) => m.slot === 'abend')],
  ['Zwischendurch', (t) => t.mahlzeiten.filter((m) => m.slot === 'snack')],
];

function namen(s: Satz, ms: GeplanteMahlzeit[], stil: Stil, breite: number, luft: number): Block {
  if (!ms.length) return s.absatz([hell('–')], stil, breite);
  return s.stapel(ms.map((m) => s.absatz([{ t: m.name, mark: m.bevorzugt }], stil, breite)), luft);
}

function blick(s: Satz, w: Woche, istHandy: boolean) {
  s.neueSeite();
  s.setze(kopf(s, `Woche${nb}${w.nr} auf einen Blick`, `Tag ${w.tage[0].nr} bis ${w.tage[w.tage.length - 1].nr}`, istHandy));
  if (istHandy) {
    const lw = 66;
    for (const t of w.tage) {
      const zeilen = SPALTEN.map(([titel, f]) => {
        const n = namen(s, f(t), { g: G[2], lh: 1.5 }, s.breite - lw - 6, 0);
        const l = s.absatz(titel, STIL.label, lw);
        return { h: Math.max(n.h, l.h), zeichne: (x: number, y: number) => (l.zeichne(x, y), n.zeichne(x + lw + 6, y)) };
      });
      const tag = s.absatz(`Tag${nb}${t.nr}`, { g: G[3], lh: 1.2, s: 'kopf', sp: -0.01 });
      const inhalt = s.stapel([tag, ...zeilen], 3);
      s.setze({ h: 6 + inhalt.h + 12, zeichne: (x, y) => (s.linie(x, y, x + s.breite), inhalt.zeichne(x, y + 6)) });
    }
    return;
  }
  // A4: Raster füllt die Seite; Zeilen gleich hoch, wo der Inhalt es erlaubt
  const tw = 48;
  const luft = 12;
  const fr = (s.breite - tw - 4 * luft) / 4.4;
  const xs = [0, tw + luft, tw + luft + fr + luft, tw + luft + 2 * (fr + luft), tw + luft + 3 * (fr + luft)];
  const ws = [tw, fr, fr, fr, fr * 1.4];
  const kopfH = G[2] * 1.5 + 6;
  SPALTEN.forEach(([titel], i) => s.text(titel, xs[i + 1], s.y + s.grundlinie(G[2], 1.5), G[2], 'text', FARBE.hell));
  s.y += kopfH;
  const zeilen = w.tage.map((t) => {
    const tag = s.absatz(`Tag${nb}${t.nr}`, { g: G[4], lh: 1.2, s: 'kopf', sp: -0.01 }, tw + luft);
    const zellen = SPALTEN.map(([, f], i) => namen(s, f(t), i === 3 ? { g: G[2], lh: 1.3 } : { g: G[3], lh: 1.35 }, ws[i + 1], 3));
    return { tag, zellen, h: 12 + Math.max(tag.h, ...zellen.map((z) => z.h)) };
  });
  // 1fr: gleiche Höhe, mindestens so hoch wie der Inhalt
  const verfuegbar = s.rest;
  let hs = zeilen.map((z) => z.h);
  if (hs.reduce((a, b) => a + b, 0) <= verfuegbar) {
    let gross = new Set<number>();
    for (let runde = 0; runde < 7; runde++) {
      const rest = verfuegbar - [...gross].reduce((a, i) => a + zeilen[i].h, 0);
      const anteil = rest / (zeilen.length - gross.size);
      const neu = new Set([...gross, ...zeilen.map((z, i) => (z.h > anteil ? i : -1)).filter((i) => i >= 0)]);
      hs = zeilen.map((z, i) => (neu.has(i) ? z.h : anteil));
      if (neu.size === gross.size) break;
      gross = neu;
    }
  }
  zeilen.forEach((z, i) => {
    s.setze({
      h: hs[i],
      zeichne: (x, y) => {
        s.linie(x, y, x + s.breite);
        z.tag.zeichne(x, y + 6);
        z.zellen.forEach((c, j) => c.zeichne(x + xs[j + 1], y + 6));
      },
    });
  });
}

// ---------------------------------------------------------------------------------------------------------------
// Einkaufsliste

function postenBlock(s: Satz, p: EinkaufPosten, breite: number): Block & { w: number } {
  const laeufe: Lauf[] = [{ t: p.text }];
  if (p.klein) laeufe.push(hell(` ${p.klein.replace(/ /g, nb)}`, { g: G[2] }));
  const text = s.absatz(laeufe, { g: G[3], lh: 1.35 }, breite - 15);
  return {
    h: text.h + 4.5,
    w: 15 + text.breiteMax,
    zeichne: (x, y) => {
      s.kasten(x, y + 2.25 + 3, 9);
      text.zeichne(x + 15, y + 2.25);
    },
  };
}

function einkauf(s: Satz, w: Woche, lf: boolean, istHandy: boolean) {
  const { gruppen, frisch, vorrat } = einkaufDaten(w, lf);
  const titel = `Einkaufsliste Woche${nb}${w.nr}`;
  const rechts = `für Tag ${w.tage[0].nr} bis ${w.tage[w.tage.length - 1].nr}`;
  s.neueSeite();
  s.setze(kopf(s, titel, rechts, istHandy));
  s.setze(intro(s, `Auf ganze Packungen aufgerundet, klein dahinter die Menge im Plan; lose Ware auf 50${nb}g.`, istHandy));
  const spalten = istHandy ? 1 : 2;
  const sw = (s.breite - (spalten - 1) * 18) / spalten;
  const bloecke = gruppen.map((g) => {
    const label = s.absatz(g.titel, STIL.label, sw);
    const posten = g.posten.map((p) => postenBlock(s, p, sw));
    return { label, posten, h: label.h + 3 + posten.reduce((a, b) => a + b.h, 0) + 12 };
  });
  const gruppeZeichnen = (b: (typeof bloecke)[number], x: number, y: number) => {
    b.label.zeichne(x, y);
    let yy = y + b.label.h + 3;
    for (const p of b.posten) {
      p.zeichne(x, yy);
      yy += p.h;
    }
  };
  if (istHandy) {
    // Einspaltig im Fluss; die Überschrift einer Gruppe bleibt bei ihrem ersten Posten
    for (const b of bloecke) {
      s.setze(b.label, { danach: 3 + (b.posten[0]?.h ?? 0) });
      s.y += 3;
      b.posten.forEach((p) => s.setze(p));
      s.y += 12;
    }
  } else {
    // Zwei Spalten, ausgeglichen wie CSS columns; passt es nicht auf die Seite, weiter auf der nächsten
    let offen = bloecke.slice();
    while (offen.length) {
      const platz = s.rest;
      const summe = (xs: typeof bloecke) => xs.reduce((a, b) => a + b.h, 0);
      let teilung = -1;
      let besser = Infinity;
      for (let k = 0; k <= offen.length; k++) {
        const h = Math.max(summe(offen.slice(0, k)), summe(offen.slice(k)));
        if (h < besser) [besser, teilung] = [h, k];
      }
      let spL = offen.slice(0, teilung);
      let spR = offen.slice(teilung);
      if (besser > platz) {
        // Seite füllen: links bis unten, rechts bis unten, Rest auf die nächste Seite
        spL = [];
        spR = [];
        let i = 0;
        while (i < offen.length && summe([...spL, offen[i]]) <= platz) spL.push(offen[i++]);
        while (i < offen.length && summe([...spR, offen[i]]) <= platz) spR.push(offen[i++]);
        if (!spL.length && !spR.length) spL.push(offen[i++]);
      }
      const y0 = s.y;
      let y = y0;
      for (const b of spL) (gruppeZeichnen(b, 0, y), (y += b.h));
      let y2 = y0;
      for (const b of spR) (gruppeZeichnen(b, sw + 18, y2), (y2 += b.h));
      s.y = Math.max(y, y2);
      offen = offen.slice(spL.length + spR.length);
      if (offen.length) {
        s.neueSeite();
        s.setze(kopf(s, titel, 'Fortsetzung', istHandy));
      }
    }
  }

  // Obst, Gemüse und Kräuter: ohne Menge, nebeneinander
  const label = s.absatz([{ t: 'Obst, Gemüse und Kräuter' }, { t: ' · ohne feste Menge, nach Hunger', c: FARBE.hell }], STIL.label);
  const posten = frisch.map((p) => postenBlock(s, p, s.breite));
  const gap = istHandy ? 12 : 18;
  const reihen: (typeof posten)[] = [[]];
  let breite = 0;
  for (const p of posten) {
    if (reihen[reihen.length - 1].length && breite + gap + p.w > s.breite) {
      reihen.push([]);
      breite = 0;
    }
    breite += (reihen[reihen.length - 1].length ? gap : 0) + p.w;
    reihen[reihen.length - 1].push(p);
  }
  const reiheH = (r: typeof posten) => Math.max(0, ...r.map((p) => p.h));
  s.setze(label, { vorher: 6, danach: 3 + reiheH(reihen[0]) });
  s.y += 3;
  for (const r of reihen)
    s.setze({
      h: reiheH(r),
      zeichne: (x, y) => {
        let xx = x;
        for (const p of r) (p.zeichne(xx, y), (xx += p.w + gap));
      },
    });
  if (vorrat.length) s.setze(s.absatz([{ t: 'Aus dem Vorrat', c: FARBE.ink }, { t: `${nb} ${vorrat.join(', ')}` }], STIL.klein), { vorher: 18 });
}

// ---------------------------------------------------------------------------------------------------------------
// Tage

function tagBlock(s: Satz, t: Tag, rezeptNr: Map<string, number>, lf: boolean, istHandy: boolean): Block {
  const kopfB = kopf(s, `Tag${nb}${t.nr}`, `${t.protein}${nb}g Protein`, false, 12);
  const viel = t.mahlzeiten.length > 5;
  const zw = 72;
  const gw = 36;
  const nameX = istHandy ? 0 : zw + 12;
  const nameW = s.breite - nameX - 12 - gw;
  const zeilen = t.mahlzeiten.map((m, i) => {
    const snack = m.slot === 'snack';
    const nameStil: Stil = snack ? { g: G[3], lh: 1.4, s: 'fett' } : { g: G[4], lh: 1.25, s: 'name', sp: -0.005 };
    const name = s.absatz([{ t: m.name, mark: m.bevorzugt }], nameStil, nameW);
    const nr = rezeptNr.get(m.id);
    const zusatz = [m.dazu ? `dazu ${m.dazu}` : '', nr ? `Rezept ${nr}` : ''].filter(Boolean);
    const mengen = m.positionen.map((p) => portionText(p.key, p.menge, lf)).join(', ') + (zusatz.length ? ` · ${zusatz.join(' · ')}` : '');
    const mengeLaeufe: Lauf[] = istHandy ? [{ t: `${m.titel} ·`, s: 'fett' }, { t: ` ${mengen}` }] : [{ t: mengen }];
    const menge = s.absatz(mengeLaeufe, { g: G[2], lh: 1.45, c: FARBE.hell }, istHandy ? s.breite : nameW);
    const zeit = istHandy ? null : s.absatz(m.titel, STIL.label, zw);
    const basis = s.grundlinie(nameStil.g, nameStil.lh);
    const nebenOben = basis - s.grundlinie(G[2], 1.5);
    const h = Math.max(name.h + 1.5 + menge.h, zeit ? nebenOben + zeit.h : 0);
    const vorher = i === 0 ? 0 : snack ? (viel || istHandy ? 6 : 12) : viel || istHandy ? 12 : 18;
    return {
      h: vorher + h,
      zeichne: (x: number, y: number) => {
        const y0 = y + vorher;
        zeit?.zeichne(x, y0 + nebenOben);
        name.zeichne(x + nameX, y0);
        s.textRechts(`${m.protein}${nb}g`, x + s.breite, y0 + basis, G[2], 'text', FARBE.gruen);
        menge.zeichne(x + nameX, y0 + name.h + 1.5);
      },
    };
  });
  return s.stapel([kopfB, ...zeilen]);
}

function tage(s: Satz, w: Woche, rezeptNr: Map<string, number>, lf: boolean, istHandy: boolean) {
  const bloecke = w.tage.map((t) => tagBlock(s, t, rezeptNr, lf, istHandy));
  if (istHandy) {
    for (const b of bloecke) {
      s.neueSeite();
      s.setze(b);
    }
    return;
  }
  for (let i = 0; i < bloecke.length; i += 2) {
    s.neueSeite();
    s.setze(bloecke[i]);
    const b = bloecke[i + 1];
    if (!b) continue;
    // Haarlinie zwischen den Tagen; passt der zweite Tag nicht mehr, kommt er auf eine eigene Seite
    const trenner: Block = { h: 18 + 18 + b.h, zeichne: (x, y) => (s.linie(x, y + 18, x + s.breite), b.zeichne(x, y + 36)) };
    if (trenner.h <= s.rest) s.setze(trenner);
    else (s.neueSeite(), s.setze(b));
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Rezepte

function rezeptBloecke(s: Satz, r: Rezept, lf: boolean, istHandy: boolean): Block[] {
  const schritte = (lf && r.karte.schritteLaktosefrei) || r.karte.schritte;
  const kopfTeile = s.stapel(
    [
      s.absatz(`Rezept ${r.nr}`, STIL.label),
      s.absatz([{ t: r.m.name, mark: r.m.bevorzugt }], STIL.h),
      s.absatz(`etwa ${r.karte.zeit} Minuten · an Tag ${aufzaehlung(r.tage)} · Mengen auf der Tagesseite`, STIL.label),
    ],
    6,
  );
  const zw = istHandy ? s.breite : 150;
  const sx = istHandy ? 0 : zw + 24;
  const sw = s.breite - sx;
  const einzug = istHandy ? 18 : 24;
  const zutaten = s.stapel(
    [
      s.absatz('Zutaten', STIL.label),
      s.stapel(
        [...r.m.positionen.map((p) => s.absatz(kurzName(p.key, lf, p.menge > 1), STIL.text, zw)), ...(r.m.dazu ? [s.absatz([hell(`dazu ${r.m.dazu}`)], STIL.text, zw)] : [])],
        3,
      ),
    ],
    6,
  );
  const schrittBloecke = schritte.map((t, i) => {
    const b = s.absatz(t, STIL.text, sw - einzug);
    return { h: b.h, zeichne: (x: number, y: number) => (s.text(String(i + 1), x, y + s.grundlinie(G[3], 1.5), G[3], 'zahl', FARBE.gruen), b.zeichne(x + einzug, y)) };
  });
  const tipp = r.karte.tipp ? s.absatz(r.karte.tipp, STIL.klein, sw - einzug) : null;
  const tippBlock: Block | null = tipp ? { h: tipp.h + 6, zeichne: (x, y) => tipp.zeichne(x + einzug, y + 6) } : null;
  const label = s.absatz('So geht’s', STIL.label);
  if (istHandy) {
    // Handy: Schritte einzeln in den Fluss (ein langes Rezept geht auf der nächsten Seite weiter), Label beim ersten Schritt
    const erster = schrittBloecke[0];
    return [
      kopfTeile,
      { h: 12 + zutaten.h, zeichne: (x, y) => zutaten.zeichne(x, y + 12) },
      { h: 12 + label.h + 6 + erster.h, zeichne: (x, y) => (label.zeichne(x, y + 12), erster.zeichne(x, y + 18 + label.h)) },
      ...schrittBloecke.slice(1).map((b) => ({ h: 6 + b.h, zeichne: (x: number, y: number) => b.zeichne(x, y + 6) })),
      ...(tippBlock ? [tippBlock] : []),
    ];
  }
  const sogehts = s.stapel([label, s.stapel(schrittBloecke, 6), ...(tippBlock ? [tippBlock] : [])], 6);
  const spalten: Block = { h: 18 + Math.max(zutaten.h, sogehts.h), zeichne: (x, y) => (zutaten.zeichne(x, y + 18), sogehts.zeichne(x + sx, y + 18)) };
  return [s.stapel([kopfTeile, spalten])];
}

function rezepte(s: Satz, liste: Rezept[], lf: boolean, istHandy: boolean) {
  if (!liste.length) return;
  const kopfB = s.stapel([
    kopf(s, 'Rezepte', `${liste.length} Gerichte`, istHandy),
    intro(s, 'Für die Gerichte, die gekocht, gebraten oder gebacken werden. Die Nummer steht auch auf der Tagesseite. Die Mengen ändern sich von Tag zu Tag ein wenig; sie stehen beim jeweiligen Tag.', istHandy),
  ]);
  if (istHandy) {
    liste.forEach((r, i) => {
      s.neueSeite();
      if (i === 0) s.setze(kopfB);
      rezeptBloecke(s, r, lf, true).forEach((b) => s.setze(b));
    });
    return;
  }
  // A4: zwei Rezepte pro Seite, jedes auf einer halben Seite; ist eins länger, fließt es weiter
  const halb = s.hoehe / 2;
  for (let i = 0; i < liste.length; i += 2) {
    s.neueSeite();
    const erstes = s.stapel([...(i === 0 ? [{ h: kopfB.h + 6, zeichne: kopfB.zeichne }] : []), ...rezeptBloecke(s, liste[i], lf, false)]);
    const zweites = liste[i + 1] ? rezeptBloecke(s, liste[i + 1], lf, false)[0] : null;
    if (erstes.h <= halb && (!zweites || zweites.h + 24 <= halb)) {
      erstes.zeichne(0, 0);
      if (zweites) (s.linie(0, halb, s.breite), zweites.zeichne(0, halb + 24));
      s.y = s.hoehe;
      continue;
    }
    s.setze(erstes);
    if (zweites) s.setze({ h: 48 + zweites.h, zeichne: (x, y) => (s.linie(x, y + 24, x + s.breite), zweites.zeichne(x, y + 48)) });
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Tauschen

function tauschen(s: Satz, plan: Plan, istHandy: boolean) {
  const zeilen = tauschZeilen(plan);
  s.neueSeite();
  s.setze(kopf(s, 'Tauschen', 'etwa gleich viel Protein', istHandy));
  s.setze(intro(s, `Jede Zeile liefert etwa gleich viel Protein (höchstens 3${nb}g Unterschied). Tausche innerhalb einer Mahlzeit; Beilagen und Gemüse bleiben.`, istHandy));
  const gw = 36;
  for (const z of zeilen) {
    const text = s.absatz([{ t: `statt ${z.statt}`, s: 'fett' }, { t: ` ${PFEIL} ` }, { t: z.durch.join(' oder ') }], STIL.text, s.breite - gw - 12);
    s.setze({
      h: text.h + 12,
      zeichne: (x, y) => {
        text.zeichne(x, y + 6);
        s.textRechts(`${z.protein}${nb}g`, x + s.breite, y + 6 + s.grundlinie(G[3], 1.5), G[2], 'text', FARBE.gruen);
      },
    });
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Letzte Seite

function schluss(s: Satz, d: SchlussDaten) {
  s.neueSeite();
  s.setze(kopf(s, 'Hinweise', '', false));
  d.hinweise.forEach((h, i) => s.setze(s.absatz(h, STIL.klein), { vorher: i ? 6 : 0 }));
  d.grenzen.forEach((p, i) => s.setze(s.absatz(p, STIL.klein), { vorher: i ? 6 : 18 }));
  if (!d.quellen.length) return;
  s.setze(s.absatz('Quellen', STIL.label), { vorher: 18, danach: 6 + 12 });
  d.quellen.forEach((q, i) => {
    const text = s.absatz([{ t: q.text }, ...(q.url ? [{ t: ` ${q.url}`, url: q.url }] : [])], { g: G[1], lh: 1.5, c: FARBE.hell }, s.breite - 12);
    s.setze({ h: text.h, zeichne: (x, y) => (s.text(String(i + 1), x, y + s.grundlinie(G[1], 1.5), G[1], 'text', FARBE.hell), text.zeichne(x + 12, y)) }, { vorher: i ? 3 : 6 });
  });
}

// ---------------------------------------------------------------------------------------------------------------
// Letzte Seite aus der Druckfassung der Planseite lesen (Browser)

/** Liest Hinweise, Grenzen (mit Pflichtsatz) und Quellen aus .ed-schluss (src/pages/ernaehrungsplan/plan/[id].astro). */
export function schlussAusSeite(el: Element): SchlussDaten {
  const laeufe = (wurzel: Element, basis: Partial<Lauf> = {}): Lauf[] => {
    const out: Lauf[] = [];
    const lauf = (n: Node, stil: Partial<Lauf>) => {
      if (n.nodeType === 3) {
        const t = (n.textContent ?? '').replace(/\s+/g, ' ');
        if (t) out.push({ ...stil, t });
        return;
      }
      if (n.nodeType !== 1) return;
      const e = n as Element;
      const tag = e.tagName.toLowerCase();
      const neu: Partial<Lauf> = tag === 'strong' || e.classList.contains('ed-arzt') ? { ...stil, s: 'fett', c: FARBE.ink } : tag === 'sup' ? { ...stil, hoch: true } : stil;
      e.childNodes.forEach((k) => lauf(k, neu));
    };
    wurzel.childNodes.forEach((k) => lauf(k, wurzel.classList.contains('ed-arzt') ? { ...basis, s: 'fett', c: FARBE.ink } : basis));
    // Leerzeichen am Rand und doppelte entfernen
    const zusammen: Lauf[] = [];
    for (const l of out) {
      const vorher = zusammen[zusammen.length - 1];
      const t = vorher && vorher.t.endsWith(' ') ? l.t.replace(/^ /, '') : l.t;
      if (t) zusammen.push({ ...l, t });
    }
    if (zusammen.length) {
      zusammen[0].t = zusammen[0].t.trimStart();
      zusammen[zusammen.length - 1].t = zusammen[zusammen.length - 1].t.trimEnd();
    }
    return zusammen.filter((l) => l.t);
  };
  return {
    hinweise: [...el.querySelectorAll('.ed-hinweise > li')].map((li) => laeufe(li)),
    grenzen: [...el.querySelectorAll('.ed-grenzen > p')].map((p) => laeufe(p)),
    quellen: [...el.querySelectorAll('.ed-quellen-liste > li')].map((li) => {
      const text = (li.lastElementChild?.childNodes[0]?.textContent ?? li.textContent ?? '').replace(/\s+/g, ' ').trim();
      const url = li.querySelector<HTMLAnchorElement>('a.ed-url')?.getAttribute('href') ?? undefined;
      return { text, url };
    }),
  };
}
