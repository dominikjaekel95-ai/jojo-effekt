/**
 * Woraus der Gewichtsverlust besteht: 100 Felder = 100 % des verlorenen Gewichts, Sand = Fettmasse, Grün = fettfreie
 * Masse (Muskeln, Organe, Wasser). STEP 1 rund 40 % (wilding2021dxa), SURMOUNT-1 rund 25 % (look2025surmount1dxa).
 * Optionen: data-studien="step1,surmount1", data-start, data-rechner="ja" (eigener Gewichtsverlust in kg).
 */
import { type Attr, type Ctx, de, fn, fns, hat, ja, liste, num, proWahl, rahmen, regler, wahl } from '../basis';
import { type Zusammensetzung, zusammensetzung as daten } from '../daten';

export function zusammensetzung(a: Attr, ctx: Ctx): string {
  const studien = liste(a, 'studien', ['step1']).map((id) => {
    const s = daten[id];
    if (!s) throw new Error(`zusammensetzung: unbekannte Studie ${id}`);
    return s;
  });
  const start = daten[a.start ?? studien[0].id] ?? studien[0];
  const rechner = ja(a, 'rechner');
  const kg = num(a, 'kg', 15);
  const by = (f: (s: Zusammensetzung) => string) => Object.fromEntries(studien.map((s) => [s.id, f(s)]));
  const fnAlle = fns(ctx, studien.map((s) => s.quelle));
  const felder = Array.from({ length: 100 }, (_, i) => {
    const k = by((s) => (i >= 100 - s.fettfrei ? 'ff' : ''));
    const an = i >= 100 - start.fettfrei;
    return `<i class="zs-c${an ? ' ff' : ''}" style="--i:${i}"${studien.length > 1 ? proWahl('k', 'studie', k) : ''}></i>`;
  }).join('');
  const attrs: Record<string, string> = { 'data-studie': start.id };
  studien.forEach((s) => (attrs[`data-ff-${s.id}`] = String(s.fettfrei)));
  const umschalter =
    studien.length > 1
      ? wahl(ctx, 'studie', 'Studie', studien.map((s) => ({ wert: s.id, label: `${s.wirkstoff}` })), start.id)
      : '';
  const xs = (f: (s: Zusammensetzung) => string) => proWahl('x', 'studie', by(f));
  const zahlen =
    `<div class="zs-zahlen">` +
    `<div class="zs-z zs-z-fett"><p class="ia-gross">≈ <span class="ia-z" data-ia-zahl${xs((s) => String(100 - s.fettfrei))}>${100 - start.fettfrei}</span><small> %</small></p><p class="ia-klein">Fettmasse</p></div>` +
    `<div class="zs-z zs-z-ff"><p class="ia-gross">≈ <span class="ia-z" data-ia-zahl data-ia-verz="900"${xs((s) => String(s.fettfrei))}>${start.fettfrei}</span><small> %</small></p><p class="ia-klein">fettfreie Masse: Muskeln, Organe, Wasser. Wie viel davon Muskel war, wurde nicht getrennt gemessen.</p></div>` +
    (rechner
      ? `<div class="zs-rechner">${regler(ctx, 'kg', 'Dein Gewichtsverlust', { min: 5, max: 40, step: 1, wert: kg, einheit: 'kg' })}` +
        `<p class="zs-satz">Davon wären rechnerisch etwa <strong><span data-zs-ff>${de((kg * start.fettfrei) / 100, 1)}</span> kg</strong> fettfreie Masse und <span data-zs-fett>${de((kg * (100 - start.fettfrei)) / 100, 1)}</span> kg Fett.</p></div>`
      : '') +
    `</div>`;
  return rahmen({
    ctx,
    name: 'zusammensetzung',
    titel: 'Woraus das verlorene Gewicht bestand',
    unter: `<span${xs((s) => `${s.studie}: ${s.text}`)}>${start.studie}: ${start.text}</span>`,
    attrs,
    inhalt:
      umschalter +
      `<div class="zs-buehne"><div class="zs-feld" role="img" aria-label="100 Felder stehen für 100 Prozent des verlorenen Gewichts."><span class="zs-feld-in">${felder}</span></div>${zahlen}</div>`,
    fuss:
      `Ein Feld steht für 1 % des verlorenen Gewichts. DXA-Messungen, Mittelwerte.${fnAlle}` +
      (hat(ctx, 'sardeli2018') ? ` Krafttraining während einer Kalorienreduktion verhinderte den Verlust an fettfreier Masse in einer Meta-Analyse weitgehend.${fn(ctx, 'sardeli2018')}` : ''),
  });
}
