/**
 * Hochformat-Fassungen (1080 × 1350) der meistgesehenen Grafiken für schmale Bildschirme. Gleiche Daten, Farben, Quelle
 * und Lizenzzeile wie die Hauptgrafik; das Layout ist fürs Hochformat neu gesetzt (Spalten untereinander, Beschriftung
 * über oder neben kurzen Balken, Grundtext 30 px). Titel, Untertitel, Quelle und Alt-Text kommen aus der Hauptgrafik
 * (meta der figures aus grafiken-bestand.mjs und grafiken-neu.mjs), die Zahlen aus denselben Datenobjekten dort.
 * Dateien <id>-hoch.svg/.png; Register: src/data/grafiken.ts (Einträge mit `hochformat: true`); ausgeliefert per
 * <picture> unter 640 px Breite (src/lib/grafik-daten.ts, mitHochformat).
 */
import { C, M, WH, FH, T, P, PM, L, R, placeboBar, tw, wrap, de, frameHoch, rahmenHoch } from './grafiken-lib.mjs';
import { WEITER, WARUM, preisZeilen, PREISE_HINWEIS } from './grafiken-bestand.mjs';
import { STEP2, VERSORGUNG } from './grafiken-neu.mjs';

/** Rechte Inhaltskante und Satzbreite */
const X1 = WH - M;
const MW = WH - 2 * M;
/** Absatz über die volle Satzbreite des Hochformats (P rechnet sonst mit der Breite des Querformats) */
const PH = (x, y, s, o = {}) => P(x, y, s, { maxW: MW, ...o });

/** Senkrechte Gitterlinien (werden hinter Beschriftungen ausgespart) */
const gitterX = (vals, px, y1, y2, zero) => vals.map((v) => L(px(v), y1, px(v), y2, v === zero ? { c: C.ink3, w: 1.4, g: true } : { g: true })).join('');

export function hoch({ preise, warn }, haupt) {
  const figures = [];
  const meta = (id) => {
    const f = haupt.find((g) => g.file === `${id}.svg`);
    if (!f) throw new Error(`Hochformat: Hauptgrafik ${id} fehlt`);
    return f.meta;
  };
  const add = (id, body) => {
    const file = `${id}-hoch.svg`;
    figures.push({ file, meta: meta(id), hoch: true, svg: frameHoch({ file, ...meta(id), body, warn }) });
  };
  /** Meldet, wenn der Inhalt in die Fußzone läuft */
  const passt = (id, y, k) => {
    if (y > k.bottom) warn(`${id}-hoch: Inhalt zu lang (${Math.round(y)} > ${k.bottom})`);
  };

  /* H1. Preise im Monat (src/data/markt/preise.json): Präparat links, Stufe daneben, Balken mit Wert */
  {
    const id = 'preise-im-monat';
    const k = rahmenHoch(meta(id));
    const size = FH.text;
    // „Präparat, Stufe (Zusatz)“ zerlegen; aufeinanderfolgende Zeilen desselben Präparats bilden eine Gruppe
    const rows = preisZeilen(preise).map((row) => {
      const m = row.name.match(/^([^,(]+?)\s*(?:,\s*(.*?))?\s*(?:\((.*)\))?$/);
      return { ...row, gruppe: m[1].trim(), stufe: (m[2] || '').trim(), zusatz: (m[3] || '').trim() };
    });
    const gruppen = [];
    for (const row of rows) {
      const g = gruppen[gruppen.length - 1];
      if (g && g.name === row.gruppe) g.rows.push(row);
      else gruppen.push({ name: row.gruppe, rows: [row] });
    }
    // Spalten: Präparat (Wörter untereinander), Stufe, Balken mit Wert
    const GW = Math.max(...gruppen.flatMap((g) => g.name.split(' ').map((w) => tw(w, 'strong', size))));
    for (const g of gruppen) {
      const z = g.rows[0].zusatz;
      g.zusatz = z && g.rows.every((row) => row.zusatz === z) ? z : '';
      for (const row of g.rows) row.label = g.zusatz || !row.zusatz ? row.stufe : `${row.stufe} (${row.zusatz})`.trim();
      g.links = wrap(g.name, GW, 'strong', size);
      const zl = g.zusatz ? wrap(g.zusatz, GW, 'body', FH.small) : [];
      // Zusatz unter dem Namen, wenn dort Platz ist; sonst als Zeile unter den Balken der Gruppe
      g.zusatzLinks = g.links.length + zl.length <= g.rows.length ? zl : [];
    }
    const xs = M + GW + 24;
    const SW = Math.max(...rows.map((row) => tw(row.label, 'body', size)));
    const x0 = xs + SW + 24;
    const wert = (row) => `ca. ${row.eur} €${row.flag}`;
    const VW = Math.max(...rows.map((row) => tw(wert(row), 'strong', size)));
    const emax = Math.ceil(Math.max(...rows.map((row) => row.eur)) / 100) * 100;
    const px = (e) => x0 + (e / emax) * (X1 - x0 - VW - 14);
    for (const g of gruppen) {
      g.notiz = g.zusatz && !g.zusatzLinks.length ? wrap(g.zusatz, X1 - xs, 'body', FH.small) : [];
      g.zeilen = Math.max(g.links.length + g.zusatzLinks.length, g.rows.length + g.notiz.length);
    }
    const hinweis = wrap(PREISE_HINWEIS, WH - 2 * M, 'body', FH.small);
    const GAP = 26;
    const zeilen = gruppen.reduce((a, g) => a + g.zeilen, 0);
    // Zeilenabstand aus dem freien Platz: erste Grundlinie bis letzte Hinweiszeile
    const rest = k.bottom - (k.top + 30) - (gruppen.length - 1) * GAP - 89 - (hinweis.length - 1) * 37;
    const lh = Math.min(50, Math.floor(rest / Math.max(1, zeilen - 1)));
    if (lh < 40) warn(`${id}-hoch: Zeilen zu eng (${lh})`);
    let b = '';
    let y = k.top + 30;
    gruppen.forEach((g, gi) => {
      // Haarlinie zwischen den Präparaten, mittig zwischen letzter Zeile und nächster Zeile
      if (gi) b += L(M, y - (lh + GAP) / 2 - 9, X1, y - (lh + GAP) / 2 - 9);
      g.links.forEach((l, j) => (b += T(M, y + j * lh, l, { st: 'strong', size })));
      g.zusatzLinks.forEach((l, j) => (b += T(M, y + (g.links.length + j) * lh, l, { size: FH.small, fill: C.ink3 })));
      g.rows.forEach((row, j) => {
        const yy = y + j * lh;
        if (row.label) b += T(xs, yy, row.label, { size, fill: C.ink2 });
        b += R(x0, yy - 24, px(row.eur) - x0, 26, row.kasse ? { fill: C.bg2, stroke: C.ink, sw: 1.4 } : { fill: C.ink });
        b += T(px(row.eur) + 12, yy, wert(row), { st: 'strong', size });
      });
      g.notiz.forEach((l, j) => (b += T(xs, y + (g.rows.length + j) * lh, l, { size: FH.small, fill: C.ink3 })));
      y += g.zeilen * lh + GAP;
    });
    y += -GAP - lh + 52 + 37;
    const h = PH(M, y, PREISE_HINWEIS, { size: FH.small, fill: C.ink3, lh: 37 });
    b += h.svg;
    passt(id, h.bottom, k);
    add(id, b);
  }

  /* H2. Weiter oder Placebo (rubino2021, aronne2024): je Studie zwei waagerechte Balken ab der Nulllinie */
  {
    const id = 'weiter-oder-placebo';
    const k = rahmenHoch(meta(id));
    const lo = -10, hi = 15;
    const xa = M + 46, xb = X1 - 46;
    const px = (p) => xa + ((p - lo) / (hi - lo)) * (xb - xa);
    const vz = (p) => `${p > 0 ? '+' : '−'}${String(Math.abs(p)).replace('.', ',')} %`;
    const intro = PH(M, k.top + 26, WEITER.hinweis, { size: FH.small, fill: C.ink3, lh: 37 });
    // Höhe eines Studienblocks ohne Balken: Name, Untertitel, zwei Beschriftungen; der Rest geht an die Balken
    const fest = 44 + 62 + 16 + 50 + 16;
    const frei = k.bottom - (intro.bottom + 86) - 2 * fest - 92 - 50;
    const bh = Math.max(44, Math.min(64, Math.floor(frei / 4)));
    let b = intro.svg;
    let y = intro.bottom + 86;
    let last = 0;
    WEITER.gruppen.forEach((g, i) => {
      if (i) y = last + 92;
      b += T(M, y, g.name, { st: 'head', size: 40 });
      b += T(M, y + 44, g.sub, { size: FH.text, fill: C.ink3 });
      let yl = y + 44 + 62;
      const oben = yl + 16;
      let s = '';
      for (const [p, farbe, label] of [[g.cont, C.ink, WEITER.weiter], [g.plac, C.regain, WEITER.placebo]]) {
        const neg = p < 0;
        s += T(neg ? px(0) - 14 : px(0) + 14, yl, label, { st: 'head', size: FH.text, fill: C.ink2, anchor: neg ? 'end' : 'start' });
        const top = yl + 16;
        s += R(px(0), top, px(p) - px(0), bh, { fill: farbe, rx: 1 });
        const v = vz(p);
        const breit = Math.abs(px(p) - px(0));
        if (tw(v, 'num', 40) + 28 <= breit) s += T((px(0) + px(p)) / 2, top + bh / 2 + 14, v, { st: 'num', size: 40, fill: C.bg, anchor: 'middle', inside: true });
        else s += T(neg ? px(p) - 12 : px(p) + 12, top + bh / 2 + 14, v, { st: 'num', size: 40, anchor: neg ? 'end' : 'start' });
        last = top + bh;
        yl = last + 50;
      }
      b += gitterX([-10, -5, 0, 5, 10, 15], px, oben - 10, last + 10, 0) + s;
    });
    for (const p of [-10, -5, 0, 5, 10, 15]) b += T(px(p), last + 50, `${p > 0 ? '+' : p < 0 ? '−' : ''}${Math.abs(p)} %`, { st: 'axis', size: FH.axis, fill: C.ink3, anchor: 'middle' });
    passt(id, last + 50, k);
    add(id, b);
  }

  /* H3. Warum das Gewicht zurückkommt (fachinfos, sumithran2011, fothergill2016, wilding2021dxa): vier Zeilen statt Spalten */
  {
    const id = 'warum-das-gewicht-zurueckkommt';
    const k = rahmenHoch(meta(id));
    const LW = 290, xr = M + LW + 32, RW = X1 - xr;
    const zeile = (c, y) => {
      const big = PH(M, y, c.big, { st: 'num', size: 42, fill: c.c, maxW: LW, lh: 48 });
      const ry = big.bottom + 18;
      // Lange Bindestrich-Wörter (z. B. „STEP-1-DXA-Substudie“) dürfen in der schmalen Spalte nach dem Bindestrich umbrechen
      const src = PH(M, ry + 38, c.src.replace(/(DXA-)(Substudie)/, '$1 $2'), { size: FH.small, fill: C.ink3, maxW: LW, lh: 34 });
      const txt = PM(xr, y, [{ s: `${c.h}.`, st: 'head' }, { s: c.d, fill: C.ink2 }], { size: FH.text, maxW: RW, lh: 40 });
      const svg = big.svg + L(M, ry, M + LW, ry, { c: c.c, w: 3, cap: 'butt' }) + src.svg + txt.svg;
      return { svg, bottom: Math.max(src.bottom, txt.bottom) };
    };
    // Probelauf für die Höhen, dann den freien Platz gleichmäßig auf die Abstände verteilen
    const hoehen = WARUM.cols.map((c) => zeile(c, 0).bottom);
    const halten = wrap(WARUM.halten, WH - 2 * M, 'body', FH.text);
    const summe = hoehen.reduce((a, h) => a + h, 0) + (halten.length - 1) * 40;
    const gap = Math.min(96, Math.floor((k.bottom - (k.top + 36) - summe) / 4));
    if (gap < 56) warn(`${id}-hoch: Abstände zu knapp (${gap})`);
    let b = '';
    let y = k.top + 36;
    WARUM.cols.forEach((c, i) => {
      const z = zeile(c, y);
      b += z.svg;
      y = z.bottom + gap;
      // Haarlinie mittig zwischen Unterkante der Zeile und Oberkante der nächsten (Zahl 42 px bzw. Text 30 px)
      const mitte = (z.bottom + 8 + y - (i < WARUM.cols.length - 1 ? 31 : 22)) / 2;
      b += L(M, mitte, X1, mitte, i < WARUM.cols.length - 1 ? {} : { c: C.ink3 });
    });
    const h = PH(M, y, WARUM.halten, { size: FH.text, fill: C.ink2, lh: 40 });
    b += h.svg;
    passt(id, h.bottom, k);
    add(id, b);
  }

  /* H4. STEP 2 (davies2021step2): drei Säulen, Einordnung und Hinweis darunter */
  {
    const id = 'step-2-typ-2-diabetes';
    const k = rahmenHoch(meta(id));
    const xa = M + 104;
    const cw = (X1 - xa) / 3;
    const bw = 188;
    // Zahl und Einheit bleiben zusammen („Semaglutid“ / „2,4 mg“)
    const labs = STEP2.bars.map((bar) => wrap(bar.label.replace(/(\d) (mg)/g, '$1 $2'), cw - 12, 'head', FH.label));
    const nl = Math.max(...labs.map((l) => l.length));
    const ein = wrap(STEP2.einordnen, WH - 2 * M, 'body', FH.text);
    const hin = wrap(STEP2.hinweis, WH - 2 * M, 'body', FH.small);
    const y0 = k.top + 34 + (nl - 1) * 42 + 30;
    const minv = Math.min(...STEP2.bars.map((bar) => bar.v));
    // Säulenhöhe aus dem freien Platz: Wert unter der tiefsten Säule, dann Einordnung und Hinweis
    const unten = 60 + 96 + 46 + (ein.length - 1) * 40 + 62 + (hin.length - 1) * 36;
    const hb = Math.min(440, Math.floor((k.bottom - y0 - unten) / (-minv / 10)));
    const py = (p) => y0 + (-p / 10) * hb;
    let b = '';
    for (const p of [0, -5, -10]) {
      b += L(xa, py(p), X1, py(p), p === 0 ? { c: C.ink3, w: 1.4, g: true } : { g: true });
      b += T(xa - 22, py(p) + 10, `${de(p, 0)} %`, { st: 'axis', size: FH.axis, fill: C.ink3, anchor: 'end' });
    }
    STEP2.bars.forEach((bar, i) => {
      const cx = xa + cw * (i + 0.5);
      labs[i].forEach((l, j) => (b += T(cx, k.top + 34 + (nl - labs[i].length + j) * 42, l, { st: 'head', size: FH.label, anchor: 'middle' })));
      b += bar.kind === 'placebo' ? placeboBar(cx - bw / 2, py(0), bw, py(bar.v) - py(0)) : R(cx - bw / 2, py(0), bw, py(bar.v) - py(0), { fill: C.ink, rx: 1 });
      b += T(cx, py(bar.v) + 56, `${de(bar.v)} %`, { st: 'num', size: FH.big, fill: bar.kind === 'placebo' ? C.ink3 : C.ink, anchor: 'middle' });
    });
    let y = Math.max(py(-10), py(minv) + 56) + 96;
    b += T(M, y, STEP2.einordnenH, { st: 'head', size: FH.label });
    const e = PH(M, y + 46, STEP2.einordnen, { size: FH.text, fill: C.ink2, lh: 40 });
    b += e.svg;
    const h = PH(M, e.bottom + 62, STEP2.hinweis, { size: FH.small, fill: C.ink3, lh: 36 });
    b += h.svg;
    passt(id, h.bottom, k);
    add(id, b);
  }

  /* H5. Versorgung in Deutschland (nvs2, rabenberg2015): Beschriftung links, Balken bis 100 % */
  {
    const id = 'versorgung-in-deutschland';
    const k = rahmenHoch(meta(id));
    const size = FH.text;
    const alle = VERSORGUNG.teile.flatMap((t) => t.rows);
    const x0 = M + Math.max(...alle.map(([lab]) => tw(lab, 'body', size))) + 28;
    const S = X1 - x0 - 44;
    const px = (p) => x0 + (p / 100) * S;
    const hin = wrap(VERSORGUNG.hinweis, WH - 2 * M, 'body', FH.small);
    // Zeilenabstand aus dem freien Platz
    const fest = VERSORGUNG.teile.length * (40 + 62) + 80 + 52 + 72 + (hin.length - 1) * 36;
    const rp = Math.max(52, Math.min(76,Math.floor((k.bottom - (k.top + 36) - fest) / (alle.length - VERSORGUNG.teile.length))));
    let b = '';
    let y = k.top + 36;
    let last = 0;
    VERSORGUNG.teile.forEach((t, ti) => {
      if (ti) y = last + 80;
      b += T(M, y, t.h, { st: 'head', size: FH.label });
      b += T(M, y + 40, t.studie, { size: FH.small, fill: C.ink3 });
      const y1 = y + 40 + 62;
      b += gitterX([0, 25, 50, 75, 100], px, y1 - 36, y1 + (t.rows.length - 1) * rp + 14, -1);
      t.rows.forEach(([lab, v], i) => {
        const yy = y1 + i * rp;
        b += T(M, yy, lab, { size });
        b += R(x0, yy - 26, px(v) - x0, 30, { fill: C.ink, rx: 1 });
        b += T(px(v) + 14, yy + 4, `${de(v, t.d)} %`, { st: 'num', size: 40 });
      });
      last = y1 + (t.rows.length - 1) * rp;
    });
    for (const p of [0, 25, 50, 75, 100]) b += T(px(p), last + 52, `${p} %`, { st: 'axis', size: FH.axis, fill: C.ink3, anchor: 'middle' });
    const h = PH(M, last + 52 + 72, VERSORGUNG.hinweis, { size: FH.small, fill: C.ink3, lh: 36 });
    b += h.svg;
    passt(id, h.bottom, k);
    add(id, b);
  }

  return figures;
}
