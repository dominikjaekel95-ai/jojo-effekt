/**
 * Teller: Lebensmittel antippen, bis der Tageswert erreicht ist. Werte aus den Tabellen der Artikel (BLS, gerundet),
 * Ziel aus der genannten Quelle. Die Leiste ist doppelt so lang wie das Ziel; die Marke in der Mitte ist der Wert.
 * data-vorlage: magnesium | vitamin-c | omega-3 | b12 | ballaststoffe | protein-lebensmittel | protein-tag-muskeln |
 * protein-tag-ernaehrung.
 */
import { type Attr, type Ctx, de, esc, fn, proWahl, rahmen, wahl } from '../basis';
import { teller as vorlagen } from '../daten';

export function teller(a: Attr, ctx: Ctx): string {
  const v = vorlagen[a.vorlage ?? ''];
  if (!v) throw new Error(`teller: unbekannte Vorlage "${a.vorlage}" in ${ctx.artikel}`);
  const start = v.ziele[0];
  const ziel = start.ziel;
  const achse = ziel * 2;
  const qZ = fn(ctx, v.zielQuelle);
  const qS = v.speisenQuelle ? fn(ctx, v.speisenQuelle) : '';
  const an = new Set(v.start);
  let lo = 0;
  let hi = 0;
  const segs: string[] = [];
  v.speisen.forEach((s, i) => {
    const on = an.has(i);
    const von = lo;
    if (on) {
      lo += s.min;
      hi += s.max ?? s.min;
    }
    const bis = on ? Math.max(von, von + s.min - 0.004 * achse) : von;
    const tr = `translateX(${((Math.min(von, achse) / achse) * 100).toFixed(2)}%) scaleX(${Math.max(0.0001, (Math.min(bis, achse) - Math.min(von, achse)) / achse).toFixed(4)})`;
    segs.push(`<span class="te-seg${i % 2 ? ' te-seg2' : ''}" data-t-seg="${i}" style="transform:${tr};opacity:${on ? 1 : 0}"></span>`);
  });
  const ext = `translateX(${((Math.min(lo, achse) / achse) * 100).toFixed(2)}%) scaleX(${Math.max(0.0001, (Math.min(hi, achse) - Math.min(lo, achse)) / achse).toFixed(4)})`;
  const rund = (n: number, auf: (x: number) => number) => (v.tag ? auf(n / 5) * 5 : n);
  const summe = hi > lo ? `${v.tag ? 'rund ' : ''}${de(rund(lo, Math.round), v.dec)} bis ${de(rund(hi, Math.round), v.dec)}` : de(lo, v.dec);
  const satz =
    lo >= ziel
      ? lo >= ziel * 3
        ? `Das ist das ${de(lo / ziel, 0)}-Fache des Werts.`
        : 'Der Wert ist erreicht.'
      : `Bis zum Wert fehlen ${de(ziel - lo, v.dec)}\u00a0${v.einheit}.`;
  const mehr = v.ziele.length > 1;
  const attrs: Record<string, string> = {
    'data-gruppe': start.wert,
    'data-ziel': String(ziel),
    'data-dec': String(v.dec),
    'data-einheit': v.einheit,
  };
  if (v.tag) attrs['data-rund'] = '5';
  v.ziele.forEach((z) => (attrs[`data-ziel-${z.wert}`] = String(z.ziel)));
  const knoepfe = v.speisen
    .map(
      (s, i) =>
        `<button type="button" class="ia-speise" data-t-speise="${i}" data-min="${s.min}"${s.max !== undefined ? ` data-max="${s.max}"` : ''} aria-pressed="${an.has(i)}">` +
        `<span class="te-k" aria-hidden="true"></span>` +
        `<span class="te-n">${esc(s.name)}${s.menge ? ` <span class="te-m">${esc(s.menge)}</span>` : ''}</span>` +
        `<span class="te-w">${s.min === 0 && s.hinweis ? esc(s.hinweis) : `${de(s.min, v.dec)}${s.max !== undefined ? `–${de(s.max, v.dec)}` : ''} ${esc(v.einheit)}`}${s.min > 0 && s.hinweis ? ` <span class="te-m">${esc(s.hinweis)}</span>` : ''}</span>` +
        `</button>`,
    )
    .join('');
  const zielText = Object.fromEntries(v.ziele.map((z) => [z.wert, z.zielText]));
  return rahmen({
    ctx,
    name: 'teller',
    klasse: v.tag ? 'te-tag' : '',
    titel: v.titel,
    attrs,
    inhalt:
      (mehr ? wahl(ctx, 'gruppe', 'Wert für', v.ziele.map((z) => ({ wert: z.wert, label: z.label })), start.wert) : '') +
      `<div class="te-kopf"><p class="ia-gross"><span data-t-summe class="ia-z" data-ia-zahl>${summe}</span><small> ${esc(v.einheit)}</small></p>` +
      `<p class="ia-klein">${esc(v.naehrstoff)} aus deiner Auswahl. ${esc(v.zielLabel ?? 'Tageswert')}: <span${proWahl('x', 'gruppe', zielText)}>${esc(start.zielText)}</span>${qZ}. <span data-t-satz>${satz}</span></p></div>` +
      `<div class="te-leiste" aria-hidden="true"><div class="te-spur"><div class="te-ein">${segs.join('')}<span class="te-ext" data-t-ext style="transform:${ext}"></span></div><span class="te-ziel"></span></div>` +
      `<div class="te-skala"><span>0</span><span class="te-skala-m"${proWahl('x', 'gruppe', Object.fromEntries(v.ziele.map((z) => [z.wert, `${de(z.ziel, v.dec)} ${v.einheit}`])))}>${de(ziel, v.dec)} ${esc(v.einheit)}</span><span${proWahl('x', 'gruppe', Object.fromEntries(v.ziele.map((z) => [z.wert, `${de(z.ziel * 2, v.dec)} ${v.einheit}`])))}>${de(ziel * 2, v.dec)} ${esc(v.einheit)}</span></div></div>` +
      `<div class="te-liste" role="group" aria-label="${v.tag ? 'Mahlzeiten' : 'Lebensmittel'}">${knoepfe}</div>`,
    fuss: `${esc(v.fuss)}${qS}`,
  });
}
