/**
 * Weiterbehandeln oder absetzen: Nach einer gemeinsamen Therapiephase wurde ein Teil der Teilnehmenden auf Placebo
 * umgestellt. Zwei Linien gehen ab dem Wechsel auseinander. Endpunkte aus STEP 4 (rubino2021) und SURMOUNT-4
 * (aronne2024), Verlauf dazwischen schematisch. Umschalten verwandelt die Linien (Transformation), statt sie neu zu
 * zeichnen. Optionen: data-studien="step4,surmount4", data-start="surmount4".
 */
import { type Attr, type Ctx, de, deVz, fns, liste, proWahl, r1, rahmen, wahl } from '../basis';
import { type Gabelung, gabelungen } from '../daten';

type Pt = [number, number];
const BASIS_W = 52;
// Grundform je Linie (Woche, %), bezogen auf Endpunkt (52 | 14) bzw. (52 | −5,5); andere Studien werden skaliert
const FORM_PLA: Pt[] = [[0, 0], [13, 0.4], [21, 13.2], [52, 14]];
const FORM_WEI: Pt[] = [[0, 0], [14, -3.1], [30, -5.3], [52, -5.5]];

function svg(mob: boolean, studien: Gabelung[], start: Gabelung): string {
  const W = mob ? 350 : 720;
  const H = mob ? 300 : 340;
  const m = mob ? { l: 40, r: 64, t: 30, b: 34 } : { l: 52, r: 120, t: 30, b: 40 };
  const yMax = 16;
  const yMin = -10;
  const x = (w: number) => r1(m.l + (w / BASIS_W) * (W - m.l - m.r));
  const y = (v: number) => r1(m.t + ((yMax - v) / (yMax - yMin)) * (H - m.t - m.b));
  const P = (pts: Pt[]) => `M${x(pts[0][0])} ${y(pts[0][1])} C${pts.slice(1).map((p) => `${x(p[0])} ${y(p[1])}`).join(' ')}`;
  const ox = x(0);
  const oy = y(0);
  const basisPla = FORM_PLA[3][1];
  const basisWei = FORM_WEI[3][1];
  const sk = (s: Gabelung, ziel: number, basis: number) =>
    `scale(${(s.wochen / BASIS_W).toFixed(4)}, ${(ziel / basis).toFixed(4)})`;
  const mPla = Object.fromEntries(studien.map((s) => [s.id, sk(s, s.placebo, basisPla)]));
  const mWei = Object.fromEntries(studien.map((s) => [s.id, sk(s, s.weiter, basisWei)]));
  // Endpunkte: Verschiebung gegenüber dem Endpunkt der Grundform
  const versatz = (s: Gabelung, wert: number, basis: number) =>
    `translate(${r1(x(s.wochen) - x(BASIS_W))}px, ${r1(y(wert) - y(basis))}px)`;
  const tPla = Object.fromEntries(studien.map((s) => [s.id, versatz(s, s.placebo, basisPla)]));
  const tWei = Object.fromEntries(studien.map((s) => [s.id, versatz(s, s.weiter, basisWei)]));
  const xPla = Object.fromEntries(studien.map((s) => [s.id, `${deVz(s.placebo, s.placebo % 1 ? 1 : 0)} %`]));
  const xWei = Object.fromEntries(studien.map((s) => [s.id, `${deVz(s.weiter, 1)} %`]));
  const grid = [15, 10, 5, 0, -5, -10];
  const gl = (v: number) => (v === 0 ? '0' : v > 0 ? `+${v}${v === 15 ? ' %' : ''}` : `−${Math.abs(v)}${v === -10 ? ' %' : ''}`);
  const xs: [number, string, string][] = [
    [0, 'Wechsel', 'start'],
    [24, mob ? '24' : 'Woche 24', 'middle'],
    [52, mob ? '52 Wo.' : '52 Wochen', 'end'],
  ];
  const transOrigin = `transform-origin:${ox}px ${oy}px`;
  const startPla = mPla[start.id];
  const startWei = mWei[start.id];
  return (
    `<svg class="ia-svg ia-svg-${mob ? 'm' : 'd'}" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true" focusable="false">` +
    `<g class="g-grid">` +
    grid.map((v) => `<line class="${v === 0 ? 'ia-null' : 'ia-gl'}" x1="${m.l}" x2="${W - m.r + 6}" y1="${y(v)}" y2="${y(v)}"/>`).join('') +
    grid.map((v) => `<text class="ia-ax" x="${m.l - 9}" y="${y(v) + 4}" text-anchor="end">${gl(v)}</text>`).join('') +
    xs.map(([w, t, an]) => `<text class="ia-ax" x="${x(w)}" y="${H - m.b + 22}" text-anchor="${an}">${t}</text>`).join('') +
    `</g>` +
    `<g class="g-open" style="${transOrigin}"><path class="ia-line ia-line-clay g-pla" style="${transOrigin};transform:${startPla}"${proWahl('m', 'studie', mPla)} d="${P(FORM_PLA)}"/></g>` +
    `<g class="g-open" style="${transOrigin}"><path class="ia-line g-wei" style="${transOrigin};transform:${startWei}"${proWahl('m', 'studie', mWei)} d="${P(FORM_WEI)}"/></g>` +
    `<circle class="ia-dot" cx="${ox}" cy="${oy}" r="5"/>` +
    `<g class="g-end" style="transform:${tPla[start.id]}"${proWahl('m', 'studie', tPla)}>` +
    `<circle class="ia-dot ia-dot-clay" cx="${x(BASIS_W)}" cy="${y(basisPla)}" r="5.5"/>` +
    `<text class="ia-lab ia-lab-clay" x="${x(BASIS_W) + 11}" y="${y(basisPla) + 5}"${proWahl('x', 'studie', xPla)}>${xPla[start.id]}</text></g>` +
    `<g class="g-end" style="transform:${tWei[start.id]}"${proWahl('m', 'studie', tWei)}>` +
    `<circle class="ia-dot" cx="${x(BASIS_W)}" cy="${y(basisWei)}" r="5.5"/>` +
    `<text class="ia-lab" x="${x(BASIS_W) + 11}" y="${y(basisWei) + 5}"${proWahl('x', 'studie', xWei)}>${xWei[start.id]}</text></g>` +
    `</svg>`
  );
}

export function gabelung(a: Attr, ctx: Ctx): string {
  const studien = liste(a, 'studien', ['step4', 'surmount4']).map((id) => {
    const s = gabelungen[id];
    if (!s) throw new Error(`gabelung: unbekannte Studie ${id}`);
    return s;
  });
  const start = gabelungen[a.start ?? studien[0].id] ?? studien[0];
  const by = (f: (s: Gabelung) => string) => Object.fromEntries(studien.map((s) => [s.id, f(s)]));
  const fnAlle = fns(ctx, studien.map((s) => s.quelle));
  const umschalter =
    studien.length > 1
      ? wahl(ctx, 'studie', 'Studie', studien.map((s) => ({ wert: s.id, label: s.name })), start.id)
      : '';
  const xs = (f: (s: Gabelung) => string) => proWahl('x', 'studie', by(f));
  const stats =
    `<div class="ia-stats">` +
    `<div class="ia-stat"><p class="ia-gross"><span class="ia-z" data-ia-zahl${xs((s) => de(s.weiter, 1))}>${de(start.weiter, 1)}</span><small> %</small></p>` +
    `<p class="ia-klein">weiter behandelt, <span${xs((s) => `in ${s.wochen} Wochen`)}>in ${start.wochen} Wochen</span></p></div>` +
    `<div class="ia-stat ia-stat-clay"><p class="ia-gross"><span class="ia-z" data-ia-zahl${xs((s) => deVz(s.placebo, s.placebo % 1 ? 1 : 0))}>${deVz(start.placebo, start.placebo % 1 ? 1 : 0)}</span><small> %</small></p>` +
    `<p class="ia-klein">nach dem Wechsel auf Placebo, <span${xs((s) => `in ${s.wochen} Wochen`)}>in ${start.wochen} Wochen</span></p></div>` +
    `</div>`;
  const legende =
    `<div class="ia-legende"><span><i class="ia-lg"></i>weiter behandelt</span><span><i class="ia-lg ia-lg-clay"></i>Wechsel auf Placebo</span>` +
    `<span class="ia-hinweis"${xs((s) => `${s.name}, ${s.wirkstoff}. ${s.vorher}`)}>${start.name}, ${start.wirkstoff}. ${start.vorher}</span></div>`;
  return rahmen({
    ctx,
    name: 'gabelung',
    titel: 'Weiter behandeln oder absetzen: wie die Gewichtskurven auseinandergehen',
    unter: 'Gewichtsänderung ab dem Wechsel, in Prozent',
    attrs: { 'data-studie': start.id },
    inhalt: umschalter + stats + `<div class="ia-buehne">${svg(false, studien, start)}${svg(true, studien, start)}</div>` + legende,
    fuss: `Mittelwerte; Endpunkte aus den Studien, der Verlauf dazwischen ist schematisch.${fnAlle}`,
  });
}
