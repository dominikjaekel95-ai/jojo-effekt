/**
 * Proteinregler: Körpergewicht → 1,2 bis 1,6 g pro kg und Tag (leidy2015), verteilt auf drei oder vier Mahlzeiten.
 * Optionen: data-dge="ja" (Marke 0,8 g/kg, dgeProtein), data-luecke="ja" (zweiter Regler: was du heute isst),
 * data-kg="80", data-mahlzeiten="4".
 */
import { type Attr, type Ctx, fn, ja, num, proWahl, rahmen, regler, wahl, zahl } from '../basis';

const ACHSE = 250;
const pc = (g: number) => ((Math.max(0, Math.min(ACHSE, g)) / ACHSE) * 100).toFixed(2);
const strecke = (von: number, bis: number) =>
  `translateX(${pc(von)}%) scaleX(${Math.max(0.0001, (bis - von) / ACHSE).toFixed(4)})`;

export function protein(a: Attr, ctx: Ctx): string {
  const kg = num(a, 'kg', 80);
  const dge = ja(a, 'dge');
  const luecke = ja(a, 'luecke');
  const mz = num(a, 'mahlzeiten', 4);
  const ist = num(a, 'ist', 60);
  const lo = Math.round(kg * 1.2);
  const hi = Math.round(kg * 1.6);
  const qL = fn(ctx, 'leidy2015');
  const ticks = [0, 50, 100, 150, 200, 250]
    .map((t, i, arr) => `<span style="left:${pc(t)}%"${i === arr.length - 1 ? ' class="p-t-end"' : ''}>${t}${i === arr.length - 1 ? ' g' : ''}</span>`)
    .join('');
  const luckeStart = ist >= lo ? ist : ist;
  const luckeEnde = ist >= lo ? ist : lo;
  const achse =
    `<div class="p-achse" aria-hidden="true"><div class="p-spur">` +
    `<div class="p-ein"><div class="p-band" data-p-band style="transform:${strecke(lo, hi)}"></div></div>` +
    (luecke ? `<div class="p-ein p-ein2"><div class="p-luecke" data-p-luecke style="transform:${strecke(luckeStart, luckeEnde)}"></div></div>` : '') +
    (dge ? `<div class="p-mark p-dge" data-p-dge style="transform:translateX(${(Number(pc(kg * 0.8)) - 100).toFixed(2)}%)"><span>DGE</span></div>` : '') +
    (luecke ? `<div class="p-mark p-ist" data-p-ist style="transform:translateX(${(Number(pc(ist)) - 100).toFixed(2)}%)"><span>dein Tag</span></div>` : '') +
    `</div><div class="p-ticks">${ticks}</div></div>`;
  const mahlzeiten =
    `<div class="p-mz">` +
    wahl(ctx, 'mahlzeiten', 'Mahlzeiten am Tag', [{ wert: '3', label: 'drei' }, { wert: '4', label: 'vier' }], String(mz), 'p-mz-wahl') +
    `<p class="p-mz-satz">Pro Mahlzeit: <strong><span data-p-mlo>${Math.round(lo / mz)}</span> bis <span data-p-mhi>${Math.round(hi / mz)}</span> g</strong> Protein.</p>` +
    `</div>` +
    `<div class="p-teller" aria-hidden="true">` +
    ['Morgens', 'Mittags', 'Nachmittags', 'Abends']
      .map(
        (m, i) =>
          `<div class="p-schale${i === 2 && mz === 3 ? ' aus' : ''}"${i === 2 ? proWahl('k', 'mahlzeiten', { '3': 'aus', '4': '' }) : ''} style="--i:${i}">` +
          `<span class="p-sch"><i data-p-schale style="transform:scaleY(${Math.min(1, hi / mz / 60).toFixed(3)})"></i></span>` +
          `<span class="p-sch-l">${m} <b><span data-p-mlo>${Math.round(lo / mz)}</span>–<span data-p-mhi>${Math.round(hi / mz)}</span> g</b></span></div>`,
      )
      .join('') +
    `</div>`;
  const lueckeHtml = luecke
    ? regler(ctx, 'ist', 'So viel Protein isst du an einem normalen Tag', { min: 20, max: 200, step: 5, wert: ist, einheit: 'g' }) +
      `<p class="p-ltext" data-p-ltext>${ist >= lo ? 'Du liegst im Zielbereich. Ein Pulver brauchst du dafür nicht.' : `Bis zum unteren Rand fehlen ${lo - ist} g. Erst Mahlzeiten prüfen, dann einen Shake erwägen.`}</p>`
    : '';
  const legende =
    `<div class="ia-legende"><span><i class="ia-lg p-lg-band"></i>1,2 bis 1,6 g pro kg</span>` +
    (dge ? `<span><i class="ia-lg p-lg-dge"></i>0,8 g pro kg, DGE-Wert für Erwachsene: <span data-p-dgew>${Math.round(kg * 0.8)}</span> g</span>` : '') +
    (luecke ? `<span><i class="ia-lg p-lg-luecke"></i>Lücke</span>` : '') +
    `</div>`;
  return rahmen({
    ctx,
    name: 'protein',
    titel: 'Wie viel Protein du am Tag brauchst',
    unter: 'Beim Abnehmen und beim Halten des Gewichts',
    attrs: { 'data-mahlzeiten': String(mz), 'data-achse': String(ACHSE) },
    inhalt:
      regler(ctx, 'kg', 'Dein Körpergewicht', { min: 50, max: 150, step: 1, wert: kg, einheit: 'kg' }) +
      `<div class="p-zahl"><p class="ia-gross">${zahl(String(lo), '', 'data-p-lo')}<small> bis </small>${zahl(String(hi), '', 'data-p-hi')}<small> g am Tag</small></p></div>` +
      achse +
      legende +
      lueckeHtml +
      mahlzeiten,
    fuss:
      `Empfehlung aus Übersichtsarbeiten für das Abnehmen und das Halten des Gewichts: 1,2 bis 1,6 g pro kg Körpergewicht und Tag.${qL}` +
      (dge ? ` Der DGE-Wert von 0,8 g pro kg gilt für Erwachsene, die ihr Gewicht halten, ab 65 Jahren 1,0 g.${fn(ctx, 'dgeProtein')}` : '') +
      ' Bei Nierenerkrankungen legt die Ärztin oder der Arzt die Menge fest. Den genauen Wert rechnet der <a href="/werkzeuge/proteinrechner/">Proteinrechner</a>.',
  });
}
