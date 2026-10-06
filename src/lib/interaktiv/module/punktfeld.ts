/**
 * Punktfeld: „x von 100“ (oder von 1.000) als Punkte, die sich gestaffelt füllen. Vorlagen mit Quelle in daten.ts.
 * Mehrere Gruppen (z. B. Frauen/Männer) werden umgeschaltet; die Punkte verwandeln sich, statt neu zu erscheinen.
 * Option: data-vorlage="absetzrate" | "stop-regain" | "eisen" | "magnesium" | "vitamin-d" | "b12", data-start.
 */
import { type Attr, type Ctx, fns, proWahl, rahmen, wahl } from '../basis';
import { type Punktgruppe, punktfelder } from '../daten';

export function punktfeld(a: Attr, ctx: Ctx): string {
  const v = punktfelder[a.vorlage ?? ''];
  if (!v) throw new Error(`punktfeld: unbekannte Vorlage "${a.vorlage}" in ${ctx.artikel}`);
  const fnAlle = fns(ctx, v.quellen);
  const start = v.gruppen.find((g) => g.wert === a.start) ?? v.gruppen[0];
  const mehr = v.gruppen.length > 1;
  const maxAn = Math.max(...v.gruppen.map((g) => g.an + (g.an2 ?? 0)));
  const klasse = (g: Punktgruppe, i: number) => (i < g.an ? 'an' : g.an2 && i < g.an + g.an2 ? 'an2' : '');
  // Staffelung: die eingeschalteten Punkte erscheinen in gut einer Sekunde
  const takt = Math.max(4, Math.round(1100 / Math.max(1, maxAn)));
  const punkte = Array.from({ length: v.basis }, (_, i) => {
    const k = klasse(start, i);
    const wahlAttr =
      mehr && i < maxAn ? proWahl('k', 'gruppe', Object.fromEntries(v.gruppen.map((g) => [g.wert, klasse(g, i)]))) : '';
    const d = i < maxAn ? ` style="--d:${i * takt}ms"` : '';
    return `<i class="pf-d${k ? ` ${k}` : ''}"${d}${wahlAttr}></i>`;
  }).join('');
  const by = (f: (g: Punktgruppe) => string) => Object.fromEntries(v.gruppen.map((g) => [g.wert, f(g)]));
  const umschalter = mehr
    ? wahl(ctx, 'gruppe', v.wahlLabel ?? 'Gruppe', v.gruppen.map((g) => ({ wert: g.wert, label: g.label })), start.wert)
    : '';
  const legende = v.legende
    ? `<div class="ia-legende"><span><i class="ia-lg ia-lg-punkt"></i>${v.legende[0]}</span>${v.legende[1] ? `<span><i class="ia-lg ia-lg-punkt pf-lg2"></i>${v.legende[1]}</span>` : ''}</div>`
    : '';
  return rahmen({
    ctx,
    name: 'punktfeld',
    klasse: `pf-${v.farbe} pf-${v.basis}`,
    titel: v.titel,
    attrs: { 'data-gruppe': start.wert },
    inhalt:
      umschalter +
      `<div class="pf-buehne">` +
      `<div class="pf-text"><p class="ia-gross"><span class="ia-z" data-ia-zahl${proWahl('x', 'gruppe', by((g) => g.zahl))}>${start.zahl}</span><small> %</small></p>` +
      `<p class="ia-klein"><span${proWahl('x', 'gruppe', by((g) => g.satz))}>${start.satz}</span>${fnAlle}</p></div>` +
      `<div class="pf-feld" role="img" aria-label="${v.basis === 1000 ? 'Ein Punkt steht für einen von 1.000 Menschen.' : 'Ein Punkt steht für einen von 100 Menschen.'}">${punkte}</div>` +
      `</div>` +
      legende,
    fuss: v.fuss,
  });
}
