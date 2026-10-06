/**
 * Vergleiche als Balken (vergleich) und Zulassungsstudien als Hantel (zulassung): Placebo-Punkt grau, Linie zum
 * Wirkstoff-Punkt in Tinte. Balken wachsen vom Nullpunkt, Werte zählen. Daten und Quellen in daten.ts.
 * vergleich: data-vorlage="tchang" | "villareal" | "mason" | "anpassung".
 * zulassung: data-zeilen="oasis4,step1,…", data-filter="ja" (Tabletten/Spritzen hervorheben).
 */
import { type Attr, type Ctx, de, fn, fns, ja, liste, proWahl, rahmen, tick, wahl, zahl } from '../basis';
import { type Balken, type Zulassung, vergleiche, zulassungen } from '../daten';

const nf = (n: number) => (Math.abs(n % 1) > 0 ? (Math.abs((n * 10) % 1) > 0 ? 2 : 1) : 0);

export function vergleich(a: Attr, ctx: Ctx): string {
  const v = vergleiche[a.vorlage ?? ''];
  if (!v) throw new Error(`vergleich: unbekannte Vorlage "${a.vorlage}" in ${ctx.artikel}`);
  const pc = (x: number) => ((x - v.min) / (v.max - v.min)) * 100;
  const null0 = pc(0);
  let n = 0;
  const balken = (b: Balken) => {
    const i = n++;
    const von = Math.min(0, b.wert);
    const bis = Math.max(0, b.wert);
    const links = pc(von);
    const breite = pc(bis) - pc(von);
    const neg = b.wert < 0;
    const quelle = b.quelle ? fn(ctx, b.quelle) : '';
    const wertText = b.text.replace(/(−?\+?[\d.,]+)/, (m) => `\u0000${m}\u0001`);
    const [vor, rest] = wertText.split('\u0000');
    const [zahlTeil, nach] = (rest ?? '').split('\u0001');
    const wertHtml = rest !== undefined ? `${vor}${zahl(zahlTeil, '', `data-ia-verz="${150 + i * 140}"`)}${nach}` : b.text;
    return (
      `<div class="vg-zeile${b.blass ? ' vg-blass' : ''}${b.placebo !== undefined ? ' vg-mitpla' : ''}" style="--i:${i}">` +
      `<p class="vg-l">${b.label}${b.sub ? ` <span class="vg-sub">${b.sub}</span>` : ''}</p>` +
      `<div class="vg-spur" aria-hidden="true">` +
      (v.min < 0 ? `<span class="vg-null" style="left:${null0.toFixed(2)}%"></span>` : '') +
      (b.placebo !== undefined
        ? `<span class="vg-pla" style="left:${pc(b.placebo).toFixed(2)}%;width:${Math.max(0.8, pc(b.placeboBis ?? b.placebo) - pc(b.placebo)).toFixed(2)}%"></span>`
        : '') +
      `<span class="vg-bar vg-${b.farbe}${neg ? ' vg-neg' : ''}" style="left:${links.toFixed(2)}%;width:${breite.toFixed(2)}%"></span>` +
      (b.bis !== undefined
        ? `<span class="vg-bar vg-${b.farbe} vg-ext" style="left:${pc(b.wert).toFixed(2)}%;width:${(pc(b.bis) - pc(b.wert)).toFixed(2)}%"></span>`
        : '') +
      `</div>` +
      `<p class="vg-w"><span class="vg-wz">${wertHtml}${quelle}</span>${b.placeboText ? `<span class="vg-wp">${b.placeboText}</span>` : ''}</p>` +
      `</div>`
    );
  };
  const gruppen = v.gruppen
    .map((g) => `<div class="vg-gruppe">${g.titel ? `<p class="vg-gt">${g.titel}</p>` : ''}${g.balken.map(balken).join('')}</div>`)
    .join('');
  const ticks = v.ticks
    .map((t) => {
      const lab = `${t < 0 ? '−' : t > 0 && v.min < 0 ? '+' : ''}${de(Math.abs(t), nf(t))}`;
      return tick(pc(t), lab);
    })
    .join('');
  const hatPlacebo = v.gruppen.some((g) => g.balken.some((b) => b.placebo !== undefined));
  const ohneEigene = v.gruppen.every((g) => g.balken.every((b) => !b.quelle));
  const fnAlle = ohneEigene ? fns(ctx, v.quellen) : '';
  return rahmen({
    ctx,
    name: 'vergleich',
    titel: v.titel,
    unter: v.unter,
    inhalt:
      `<div class="vg-liste">${gruppen}<div class="vg-achse"><span class="vg-achse-l"></span><div class="vg-ticks" aria-hidden="true">${ticks}</div><span class="vg-achse-r">${v.einheit}</span></div></div>` +
      (hatPlacebo ? `<div class="ia-legende"><span><i class="ia-lg vg-lg-bar"></i>Wirkstoff</span><span><i class="ia-lg vg-lg-pla"></i>Placebo</span></div>` : ''),
    fuss: `${v.fuss}${fnAlle}`,
  });
}

/* ---------- Zulassungsstudien als Hantel ---------- */
const ZMIN = -22;
const zpc = (v: number) => ((v / ZMIN) * 100).toFixed(2);

export function zulassung(a: Attr, ctx: Ctx): string {
  const zeilen = liste(a, 'zeilen', ['oasis4', 'step1', 'oasis1', 'surmount1', 'scale']).map((id) => {
    const z = zulassungen[id];
    if (!z) throw new Error(`zulassung: unbekannte Studie ${id}`);
    return z;
  });
  const filter = ja(a, 'filter') && new Set(zeilen.map((z) => z.form)).size > 1;
  const op = (z: Zulassung) =>
    proWahl('o', 'form', { alle: '1', tablette: z.form === 'tablette' ? '1' : '0.28', spritze: z.form === 'spritze' ? '1' : '0.28' });
  const html = zeilen
    .map(
      (z, i) =>
        `<div class="zu-zeile" style="--i:${i}"${filter ? op(z) : ''}>` +
        `<p class="zu-l"><strong>${z.studie}</strong>${fn(ctx, z.quelle)} <span class="vg-sub">${z.praeparat}, ${z.wochen} Wochen</span></p>` +
        `<div class="zu-spur" aria-hidden="true">` +
        `<span class="zu-linie" style="left:${zpc(z.placebo)}%;width:${(Number(zpc(z.wirk)) - Number(zpc(z.placebo))).toFixed(2)}%"></span>` +
        `<span class="zu-p zu-pla" style="left:${zpc(z.placebo)}%"></span>` +
        `<span class="zu-p zu-wirk" style="left:${zpc(z.wirk)}%"></span>` +
        `</div>` +
        `<p class="zu-w">${zahl(de(z.wirk, 1), '', `data-ia-verz="${250 + i * 160}"`)} %<span class="vg-wp">Placebo ${de(z.placebo, 1)} %</span></p>` +
        `</div>`,
    )
    .join('');
  const ticks = [0, -5, -10, -15, -20].map((t) => tick(Number(zpc(t)), t === 0 ? '0' : `−${Math.abs(t)}`)).join('');
  return rahmen({
    ctx,
    name: 'zulassung',
    titel: zeilen.length > 2 ? 'Gewichtsverlust in den Zulassungsstudien' : 'Tablette und Spritze in ihren Zulassungsstudien',
    unter: 'Mittlere Gewichtsänderung, Wirkstoff gegenüber Placebo, in Prozent',
    attrs: filter ? { 'data-form': 'alle' } : {},
    inhalt:
      (filter
        ? wahl(ctx, 'form', 'Hervorheben', [
            { wert: 'alle', label: 'Alle' },
            { wert: 'tablette', label: 'Tabletten' },
            { wert: 'spritze', label: 'Spritzen' },
          ], 'alle')
        : '') +
      `<div class="vg-liste zu-liste">${html}<div class="vg-achse"><span class="vg-achse-l"></span><div class="vg-ticks" aria-hidden="true">${ticks}</div><span class="vg-achse-r">%</span></div></div>` +
      `<div class="ia-legende"><span><i class="ia-lg zu-lg-pla"></i>Placebo</span><span><i class="ia-lg zu-lg-wirk"></i>Wirkstoff</span></div>`,
    fuss: 'Jede Studie mit eigener Teilnehmergruppe, Dosis und Laufzeit; kein direkter Vergleich, die Zahlen sind Größenordnungen.',
  });
}
