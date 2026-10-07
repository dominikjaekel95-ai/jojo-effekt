/**
 * Wirkstoffspiegel nach der letzten Dosis: Anteil, der nach t Tagen noch im Körper ist, vereinfacht als 0,5^(t/HWZ).
 * Halbwertszeiten laut Fachinformation (daten.ts). Keine Dosis, keine Wirkung, nur der Abbau. Die Kurven der Wirkstoffe
 * sind dieselbe Form in anderem Tempo; das Umschalten staucht die Kurve (scaleX) statt sie neu zu zeichnen.
 * Optionen: data-wirkstoffe="semaglutid,tirzepatid,liraglutid", data-start="semaglutid", data-tag="14".
 */
import { type Attr, type Ctx, de, erste, fns, liste, num, proWahl, r1, rahmen, regler, wahl } from '../basis';
import { type Wirkstoff, type WirkstoffId, wirkstoffe } from '../daten';

const TAGE = 56;
const BASIS_HWZ = 7;

const restProzent = (tag: number, hwz: number) => 100 * Math.pow(0.5, tag / hwz);
const restText = (r: number) => (r >= 10 ? de(r, 0) : r >= 0.1 ? de(r, 1) : 'unter 0,1');

function geometrie(mob: boolean) {
  const W = mob ? 350 : 720;
  const H = mob ? 250 : 290;
  const m = mob ? { l: 40, r: 18, t: 18, b: 34 } : { l: 52, r: 24, t: 20, b: 40 };
  const x = (t: number) => r1(m.l + (t / TAGE) * (W - m.l - m.r));
  const y = (v: number) => r1(m.t + ((100 - v) / 100) * (H - m.t - m.b));
  return { W, H, m, x, y };
}

function svg(mob: boolean, liste: Wirkstoff[], start: Wirkstoff, nr: number): string {
  const { W, H, m, x, y } = geometrie(mob);
  const pts: string[] = [];
  for (let t = 0; t <= 70; t += 0.5) pts.push(`${x(t)} ${y(restProzent(t, BASIS_HWZ))}`);
  // flacher Rest bis weit hinter den Rand: gestaucht (Liraglutid) reicht die Linie trotzdem bis rechts
  const d = `M${pts.join(' L')} L${x(TAGE * 14)} ${y(0)}`;
  const clip = `ia-clip-${mob ? 'm' : 'd'}-${nr}`;
  const ox = x(0);
  const sx = (w: Wirkstoff) => `scaleX(${(w.hwzTage / BASIS_HWZ).toFixed(4)})`;
  const mKurve = Object.fromEntries(liste.map((w) => [w.id, sx(w)]));
  const grid = [0, 25, 50, 75, 100];
  const wochen = mob ? [0, 2, 4, 6, 8] : [0, 1, 2, 3, 4, 5, 6, 7, 8];
  // Halbwertszeit-Punkte: k = 1…5
  const punkte = [1, 2, 3, 4, 5]
    .map((k) => {
      const v = 100 / 2 ** k;
      const tr = Object.fromEntries(liste.map((w) => [w.id, `translateX(${r1(x(k * w.hwzTage) - x(k * BASIS_HWZ))}px)`]));
      const sichtbar = Object.fromEntries(liste.map((w) => [w.id, x(w.hwzTage) - x(0) > (mob ? 22 : 30) ? '1' : '0']));
      const lab = k <= (mob ? 3 : 5) ? `<text class="ia-ax s-pl" x="${x(k * BASIS_HWZ) + 8}" y="${y(v) - 8}" style="opacity:${sichtbar[start.id]}"${proWahl('o', 'wirkstoff', sichtbar)}>${de(v, v % 1 ? 1 : 0)} %</text>` : '';
      return (
        `<g class="s-pk" style="--k:${k};transform:${tr[start.id]}"${proWahl('m', 'wirkstoff', tr)}>` +
        `<circle class="ia-dot" cx="${x(k * BASIS_HWZ)}" cy="${y(v)}" r="4.5"/>${lab}</g>`
      );
    })
    .join('');
  const fuenf = Object.fromEntries(liste.map((w) => [w.id, `translateX(${r1(x(5 * w.hwzTage) - x(5 * BASIS_HWZ))}px)`]));
  return (
    `<svg class="ia-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true" focusable="false">` +
    `<g class="s-grid">` +
    grid.map((v) => `<line class="ia-gl" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/>`).join('') +
    grid.map((v) => `<text class="ia-ax" x="${m.l - 9}" y="${y(v) + 4}" text-anchor="end">${v}${v === 100 ? ' %' : ''}</text>`).join('') +
    wochen
      .map(
        (w, i) =>
          `<text class="ia-ax" x="${x(w * 7)}" y="${H - m.b + 22}" text-anchor="${i === 0 ? 'start' : i === wochen.length - 1 ? 'end' : 'middle'}">${i === wochen.length - 1 ? `${w} Wochen` : w}</text>`,
      )
      .join('') +
    `</g>` +
    `<g class="s-fuenf" style="transform:${fuenf[start.id]}"${proWahl('m', 'wirkstoff', fuenf)}>` +
    `<line class="s-fl" x1="${x(5 * BASIS_HWZ)}" x2="${x(5 * BASIS_HWZ)}" y1="${m.t}" y2="${H - m.b}"/>` +
    `<text class="ia-lab" x="${x(5 * BASIS_HWZ) + 8}" y="${m.t + 14}">${mob ? '5 HWZ' : '5 Halbwertszeiten'}</text></g>` +
    `<clipPath id="${clip}"><rect x="${m.l - 4}" y="${m.t - 6}" width="${W - m.l - m.r + 8}" height="${H - m.t - m.b + 12}"/></clipPath>` +
    `<g clip-path="url(#${clip})"><g class="s-ein" style="transform-origin:${ox}px 0"><path class="ia-line s-kurve" vector-effect="non-scaling-stroke" style="transform-origin:${ox}px 0;transform:${mKurve[start.id]}"${proWahl('m', 'wirkstoff', mKurve)} d="${d}"/></g></g>` +
    punkte +
    `</svg>`
  );
}

/** Cursor über der Zeichenfläche (HTML), Lage in Prozent der SVG-Fläche */
function cursor(mob: boolean, tag: number, rest: number): string {
  const { W, H, m } = geometrie(mob);
  const box = `left:${((m.l / W) * 100).toFixed(2)}%;right:${((m.r / W) * 100).toFixed(2)}%;top:${((m.t / H) * 100).toFixed(2)}%;bottom:${((m.b / H) * 100).toFixed(2)}%`;
  return (
    `<div class="s-flaeche" style="${box}" aria-hidden="true">` +
    `<div class="s-cursor" data-s-cursor style="transform:translateX(${((tag / TAGE - 1) * 100).toFixed(2)}%)">` +
    `<div class="s-cpunkt" data-s-cpunkt style="transform:translateY(${(100 - rest).toFixed(2)}%)"></div></div></div>`
  );
}

export function wirkstoffspiegel(a: Attr, ctx: Ctx): string {
  const ids = liste(a, 'wirkstoffe', ['semaglutid', 'tirzepatid', 'liraglutid']) as WirkstoffId[];
  const ws = ids.map((id) => {
    const w = wirkstoffe[id];
    if (!w) throw new Error(`wirkstoffspiegel: unbekannter Wirkstoff ${id}`);
    return w;
  });
  const start = wirkstoffe[(a.start as WirkstoffId) ?? ws[0].id] ?? ws[0];
  const tag = num(a, 'tag', 14);
  const fnAlle = fns(ctx, ws.map((w) => erste(ctx, w.quellen)));
  const by = (f: (w: Wirkstoff) => string) => Object.fromEntries(ws.map((w) => [w.id, f(w)]));
  const hwzZahl = (w: Wirkstoff) => (w.hwzTage < 1 ? '13' : de(w.hwzTage, 0));
  const hwzEinheit = (w: Wirkstoff) => (w.hwzTage < 1 ? ' Stunden' : ' Tage');
  const fuenfZahl = (w: Wirkstoff) => de(5 * w.hwzTage, w.hwzTage < 1 ? 1 : 0);
  const attrs: Record<string, string> = { 'data-wirkstoff': start.id, 'data-tage': String(TAGE) };
  ws.forEach((w) => (attrs[`data-hwz-${w.id}`] = String(w.hwzTage)));
  const rest = restProzent(tag, start.hwzTage);
  const umschalter = ws.length > 1 ? wahl(ctx, 'wirkstoff', 'Wirkstoff', ws.map((w) => ({ wert: w.id, label: w.name })), start.id) : '';
  const stats =
    `<div class="ia-stats">` +
    `<div class="ia-stat"><p class="ia-gross"><span class="ia-z" data-ia-zahl${proWahl('x', 'wirkstoff', by(hwzZahl))}>${hwzZahl(start)}</span><small${proWahl('x', 'wirkstoff', by(hwzEinheit))}>${hwzEinheit(start)}</small></p>` +
    `<p class="ia-klein">Halbwertszeit von <span${proWahl('x', 'wirkstoff', by((w) => w.name))}>${start.name}</span>: Danach ist noch die Hälfte im Körper.</p></div>` +
    `<div class="ia-stat"><p class="ia-gross">≈ <span class="ia-z" data-ia-zahl${proWahl('x', 'wirkstoff', by(fuenfZahl))}>${fuenfZahl(start)}</span><small> Tage</small></p>` +
    `<p class="ia-klein">dauern fünf Halbwertszeiten. Dann sind noch etwa 3\u00a0% übrig.</p></div>` +
    `</div>`;
  const buehne =
    `<div class="ia-buehne s-buehne">` +
    `<div class="ia-svg-d s-wrap">${svg(false, ws, start, ctx.nr)}${cursor(false, tag, rest)}</div>` +
    `<div class="ia-svg-m s-wrap">${svg(true, ws, start, ctx.nr)}${cursor(true, tag, rest)}</div>` +
    `</div>`;
  const rechnen =
    regler(ctx, 'tag', 'Tage nach der letzten Dosis', { min: 0, max: TAGE, step: 1, wert: tag, einheit: 'Tage' }) +
    `<p class="s-satz"><span data-s-tagtext>${tag === 0 ? 'Am Tag der letzten Dosis' : tag === 1 ? 'Nach einem Tag' : `Nach ${tag} Tagen`}</span> ist rechnerisch noch etwa <strong><span data-s-rest>${restText(rest)}</span>\u00a0%</strong> des Wirkstoffs im Körper.</p>`;
  return rahmen({
    ctx,
    name: 'wirkstoffspiegel',
    titel: ws.length > 1 ? 'Wie schnell der Wirkstoff nach der letzten Dosis abgebaut wird' : `Wie schnell ${start.name} nach der letzten Dosis abgebaut wird`,
    unter: 'Anteil im Körper, bezogen auf den Tag der letzten Dosis',
    attrs,
    inhalt: umschalter + stats + buehne + rechnen,
    fuss: `Vereinfachte Rechnung: Nach jeder Halbwertszeit ist noch die Hälfte im Körper. Halbwertszeiten laut Fachinformation.${fnAlle} Die Kurve zeigt den Anteil, nicht die Wirkung, und keine Dosis; der Verlauf kann im Einzelfall abweichen.`,
  });
}
