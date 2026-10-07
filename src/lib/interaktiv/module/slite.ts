/**
 * S-LiTE-Nachbeobachtung (jensen2024): Unterschied der Wiederzunahme im Jahr nach Therapieende, in kg, mit
 * 95-%-Konfidenzintervall. Balken wachsen vom Nullpunkt, das Intervall erscheint danach.
 */
import { type Attr, type Ctx, de, deVz, fn, rahmen, tick, zahl } from '../basis';
import { slite as daten } from '../daten';

const MIN = -2;
const MAX = 10;
const pc = (v: number) => (((v - MIN) / (MAX - MIN)) * 100).toFixed(2);

export function slite(_a: Attr, ctx: Ctx): string {
  const q = fn(ctx, daten.quelle);
  const null0 = pc(0);
  const zeilen = daten.zeilen
    .map(
      (z, i) =>
        `<div class="sl-zeile${z.signifikant ? '' : ' sl-ns'}" style="--i:${i}">` +
        `<p class="sl-l">${z.label}</p>` +
        `<div class="sl-spur" aria-hidden="true">` +
        `<span class="sl-null" style="left:${null0}%"></span>` +
        `<span class="sl-ci" style="left:${pc(z.ci[0])}%;width:${(Number(pc(z.ci[1])) - Number(pc(z.ci[0]))).toFixed(2)}%"></span>` +
        `<span class="sl-bar" style="left:${null0}%;width:${(Number(pc(z.wert)) - Number(null0)).toFixed(2)}%"></span>` +
        `</div>` +
        `<p class="sl-w"><span class="sl-wz">${zahl(deVz(z.wert, 1))} kg</span><span class="sl-wci">95-%-Intervall ${de(z.ci[0], 1)} bis ${de(z.ci[1], 1)}${z.signifikant ? '' : ', nicht signifikant'}</span></p>` +
        `</div>`,
    )
    .join('');
  const ticks = [-2, 0, 2, 4, 6, 8, 10]
    .map((t) => tick(Number(pc(t)), t === 10 ? '10 kg' : t < 0 ? `−${Math.abs(t)}` : String(t)))
    .join('');
  return rahmen({
    ctx,
    name: 'slite',
    titel: 'Training während der Therapie: was ein Jahr danach bleibt',
    unter: 'S-LiTE-Studie: mehr Wiederzunahme im Jahr nach Therapieende, in kg',
    inhalt:
      `<div class="ia-stats sl-stats"><div class="ia-stat ia-stat-clay"><p class="ia-gross">${zahl(de(daten.zeilen[0].wert, 1))}<small> kg</small></p>` +
      `<p class="ia-klein">mehr Wiederzunahme nach Liraglutid allein als nach dem Trainingsprogramm.${q}</p></div>` +
      `<div class="ia-stat ia-stat-moss sl-gehalten"><p class="sl-gt">Gehalten</p><p class="ia-klein">Wer trainiert hatte, allein oder zusätzlich zum Medikament, hielt Gewicht und Körperzusammensetzung.</p></div></div>` +
      `<div class="sl-zeilen">${zeilen}<div class="sl-zeile sl-achse" aria-hidden="true"><span></span><div class="sl-ticks">${ticks}</div><span></span></div></div>`,
    fuss: `Dänische Studie: Nach einer Diät bekamen Erwachsene ein Jahr lang Liraglutid, ein betreutes Trainingsprogramm, beides oder Placebo; danach wurde ein Jahr ohne Behandlung beobachtet. Linie: 95-%-Konfidenzintervall.${q}`,
  });
}
