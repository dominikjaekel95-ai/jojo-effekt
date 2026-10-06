/**
 * Kreatin und die Waage: 3 g am Tag (euClaims), der Speicher im Muskel ist ohne Ladephase nach etwa vier Wochen voll;
 * in dieser Zeit bindet Kreatin zusätzlich Wasser in der Muskulatur. Seit 07.10.2026 ohne Kilogramm-Angabe (keine Spanne
 * mit Beleg in sources.ts; kreider2017 nur für die Sicherheit im Fuß), deshalb auch ohne Regler und ohne kg-Achse.
 * Der Verlauf ist schematisch und qualitativ, Plateau ab Woche 4.
 */
import { type Attr, type Ctx, fn, r1, rahmen, zahl } from '../basis';

function waage(mob: boolean): string {
  const W = mob ? 350 : 720;
  const H = mob ? 190 : 200;
  const m = mob ? { l: 44, r: 14, t: 16, b: 32 } : { l: 52, r: 20, t: 18, b: 36 };
  const x = (w: number) => r1(m.l + (w / 6) * (W - m.l - m.r));
  const y = (kg: number) => r1(m.t + ((2.6 - kg) / 2.6) * (H - m.t - m.b));
  const linie = `M${x(0)} ${y(0)} L${x(0.4)} ${y(0)} C${x(1.4)} ${y(0.55)} ${x(2.8)} ${y(1.22)} ${x(4)} ${y(1.25)} L${x(6)} ${y(1.25)}`;
  const wochen = [0, 1, 2, 3, 4, 5, 6];
  return (
    `<svg class="ia-svg ia-svg-${mob ? 'm' : 'd'}" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true" focusable="false">` +
    `<line class="ia-gl" x1="${m.l}" x2="${W - m.r}" y1="${y(0)}" y2="${y(0)}"/>` +
    `<text class="ia-ax" x="${m.l - 9}" y="${y(0) + 4}" text-anchor="end">Start</text>` +
    wochen
      .map((w, i) => `<text class="ia-ax" x="${x(w)}" y="${H - m.b + 22}" text-anchor="${i === 0 ? 'start' : i === 6 ? 'end' : 'middle'}">${i === 6 ? (mob ? '6 Wo.' : 'Woche 6') : w}</text>`)
      .join('') +
    `<path class="ia-line kr-linie" pathLength="1" d="${linie}"/>` +
    `<text class="ia-lab kr-t" x="${x(mob ? 2.2 : 2.6)}" y="${y(2) - 7}">${mob ? 'Wasser im Muskel' : 'Wasser im Muskel, kein Fett'}</text>` +
    `<text class="ia-ax kr-t2" x="${x(6)}" y="${y(1.25) + 20}" text-anchor="end">neuer Ausgangswert</text>` +
    `</svg>`
  );
}

export function kreatin(_a: Attr, ctx: Ctx): string {
  const qK = fn(ctx, 'kreider2017');
  const qE = fn(ctx, 'euClaims');
  const tage = Array.from({ length: 28 }, (_, i) => `<i class="kr-tag" style="--d:${i * 38}ms;--o:${(0.18 + (0.82 * i) / 27).toFixed(2)}"></i>`).join('');
  return rahmen({
    ctx,
    name: 'kreatin',
    titel: 'Was Kreatin in den ersten Wochen mit der Waage macht',
    unter: '3 g Kreatin-Monohydrat am Tag, zusammen mit Krafttraining',
    inhalt:
      `<div class="ia-stats">` +
      `<div class="ia-stat"><p class="ia-gross">${zahl('3')}<small> g am Tag</small></p><p class="ia-klein">die Menge der zugelassenen Angaben, jeden Tag, auch ohne Training an diesem Tag.${qE}</p></div>` +
      `<div class="ia-stat"><p class="ia-gross"><span class="ia-mark">Wasser</span></p><p class="ia-klein">Kreatin bindet in den ersten Wochen zusätzlich Wasser in der Muskulatur. Das zeigt die Waage, ist aber kein Fett.</p></div>` +
      `</div>` +
      `<div class="kr-speicher"><p class="kr-st">Der Speicher im Muskel füllt sich ohne Ladephase über etwa vier Wochen.</p>` +
      `<div class="kr-tage" aria-hidden="true">${tage}</div>` +
      `<div class="kr-wochen" aria-hidden="true"><span>Woche 1</span><span>Woche 2</span><span>Woche 3</span><span>Woche 4: voll</span></div></div>` +
      `<div class="ia-buehne kr-buehne">${waage(false)}${waage(true)}</div>` +
      `<p class="kr-satz">Was die Waage nach etwa vier Wochen zeigt, ist der neue Ausgangswert, von dem aus du misst.</p>`,
    fuss: `Verlauf schematisch; Kreatin-Monohydrat ist bei gesunden Erwachsenen in üblichen Dosen gut untersucht.${qK} Bei Nierenerkrankungen nur nach ärztlicher Rücksprache, und vor Blutabnahmen Bescheid sagen, weil der Kreatinin-Wert steigt.`,
  });
}
