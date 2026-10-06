/**
 * Kreatin und die Waage: 3 g am Tag (euClaims), der Speicher im Muskel ist ohne Ladephase nach etwa vier Wochen voll;
 * verteilt über diese Wochen zeigt die Waage 0,5 bis 2 kg mehr, Wasser im Muskel (Spanne ohne Beleg in sources.ts,
 * deshalb ohne Fußnote; kreider2017 nur für die Sicherheit im Fuß). Regler: eigenes Gewicht.
 * Der Verlauf ist schematisch, Plateau ab Woche 4.
 */
import { type Attr, type Ctx, de, fn, num, r1, rahmen, regler, zahl } from '../basis';

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
    `<rect class="kr-band" x="${x(4)}" y="${y(2)}" width="${r1(x(6) - x(4))}" height="${r1(y(0.5) - y(2))}"/>` +
    [0, 1, 2].map((v) => `<line class="ia-gl" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/>`).join('') +
    [0, 1, 2].map((v) => `<text class="ia-ax" x="${m.l - 9}" y="${y(v) + 4}" text-anchor="end">${v === 0 ? 'Start' : `+${v} kg`}</text>`).join('') +
    wochen
      .map((w, i) => `<text class="ia-ax" x="${x(w)}" y="${H - m.b + 22}" text-anchor="${i === 0 ? 'start' : i === 6 ? 'end' : 'middle'}">${i === 6 ? (mob ? '6 Wo.' : 'Woche 6') : w}</text>`)
      .join('') +
    `<path class="ia-line kr-linie" pathLength="1" d="${linie}"/>` +
    `<text class="ia-lab kr-t" x="${x(mob ? 2.2 : 2.6)}" y="${y(2) - 7}">${mob ? 'Wasser im Muskel' : 'Wasser im Muskel, kein Fett: 0,5 bis 2 kg'}</text>` +
    `<text class="ia-ax kr-t2" x="${x(6)}" y="${y(1.25) + 20}" text-anchor="end">neuer Ausgangswert</text>` +
    `</svg>`
  );
}

export function kreatin(a: Attr, ctx: Ctx): string {
  const kg = num(a, 'kg', 80);
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
      `<div class="ia-stat"><p class="ia-gross"><span class="ia-mark">${zahl('0,5')}<small> bis </small>${zahl('2', '', 'data-ia-verz="300"')}</span><small> kg</small></p><p class="ia-klein">mehr auf der Waage in den ersten Wochen, verteilt über etwa vier Wochen: Wasser in der Muskulatur, kein Fett.</p></div>` +
      `</div>` +
      `<div class="kr-speicher"><p class="kr-st">Der Speicher im Muskel füllt sich ohne Ladephase über etwa vier Wochen.</p>` +
      `<div class="kr-tage" aria-hidden="true">${tage}</div>` +
      `<div class="kr-wochen" aria-hidden="true"><span>Woche 1</span><span>Woche 2</span><span>Woche 3</span><span>Woche 4: voll</span></div></div>` +
      `<div class="ia-buehne kr-buehne">${waage(false)}${waage(true)}</div>` +
      regler(ctx, 'kg', 'Dein Gewicht vor dem Start', { min: 50, max: 150, step: 1, wert: kg, einheit: 'kg' }) +
      `<p class="kr-satz">Nach etwa vier Wochen zeigt die Waage dann eher <strong><span data-k-lo>${de(kg + 0.5, 1)}</span> bis <span data-k-hi>${de(kg + 2, 1)}</span> kg</strong>. Das ist der neue Ausgangswert, von dem aus du misst.</p>`,
    fuss: `Verlauf schematisch; Kreatin-Monohydrat ist bei gesunden Erwachsenen in üblichen Dosen gut untersucht.${qK} Bei Nierenerkrankungen nur nach ärztlicher Rücksprache, und vor Blutabnahmen Bescheid sagen, weil der Kreatinin-Wert steigt.`,
  });
}
