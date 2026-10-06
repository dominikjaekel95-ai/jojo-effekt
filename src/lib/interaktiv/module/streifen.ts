/**
 * Streifen: eine Woche oder ein Jahr als Punktreihen, die sich gestaffelt füllen.
 * data-vorlage="kreatin-woche": Kreatin jeden Tag (3 g, euClaims), Krafttraining an zwei Tagen (who2020, wenn im Artikel).
 * data-vorlage="vitamin-d-jahr": Oktober bis März 20 µg am Tag ohne Blutwert (dgeReferenzwerte), April bis September Sonne.
 */
import { type Attr, type Ctx, fn, hat, rahmen } from '../basis';

interface Reihe {
  label: string;
  sub?: string;
  an: boolean[];
  farbe: 'ink' | 'moss' | 'amber';
}

function streifenHtml(kopf: string[], reihen: Reihe[]): string {
  const k = kopf.length;
  const kopfHtml = `<div class="st-kopf" aria-hidden="true"><span></span>${kopf.map((t) => `<span>${t}</span>`).join('')}</div>`;
  let lauf = 0;
  const zeilen = reihen
    .map((r) => {
      const zellen = r.an
        .map((an, i) => {
          const d = an ? ` style="--d:${(lauf++ * 70).toString()}ms"` : '';
          return `<i class="st-z${an ? ` an st-${r.farbe}` : ''}"${d} title="${kopf[i]}"></i>`;
        })
        .join('');
      return `<div class="st-reihe"><p class="st-l">${r.label}${r.sub ? ` <span>${r.sub}</span>` : ''}</p>${zellen}</div>`;
    })
    .join('');
  return `<div class="st-gitter" style="--k:${k}">${kopfHtml}${zeilen}</div>`;
}

export function streifen(a: Attr, ctx: Ctx): string {
  if (a.vorlage === 'vitamin-d-jahr') {
    const monate = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    const sommer = monate.map((_, i) => i >= 3 && i <= 8);
    return rahmen({
      ctx,
      name: 'streifen',
      klasse: 'st-jahr',
      titel: 'Die Winterregel für Vitamin D',
      unter: 'Wann die Sonne in Deutschland meist reicht und wann nicht',
      inhalt: streifenHtml(monate, [
        { label: 'Sonne reicht meist', sub: 'regelmäßig draußen', an: sommer, farbe: 'amber' },
        { label: '20 µg am Tag', sub: 'ohne bekannten Blutwert', an: sommer.map((s) => !s), farbe: 'ink' },
      ]),
      fuss: `20 µg (800 I.E.) am Tag setzt die DGE an, wenn die Haut kein Vitamin D bildet.${fn(ctx, 'dgeReferenzwerte')} Mehr nur nach Blutwert und ärztlicher Absprache.`,
    });
  }
  // Kreatin-Woche
  const tage = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const who = hat(ctx, 'who2020') ? fn(ctx, 'who2020') : '';
  return rahmen({
    ctx,
    name: 'streifen',
    klasse: 'st-woche',
    titel: 'Kreatin jeden Tag, Training an zwei',
    unter: 'Eine Woche, wie sie in den Studien aussieht',
    inhalt: streifenHtml(tage, [
      { label: 'Kreatin-Monohydrat', sub: '3 g', an: tage.map(() => true), farbe: 'ink' },
      { label: 'Krafttraining', sub: '30 Minuten', an: tage.map((_, i) => i === 1 || i === 4), farbe: 'moss' },
    ]),
    fuss: `3 g am Tag ist die Menge der zugelassenen Angaben, auch an trainingsfreien Tagen.${fn(ctx, 'euClaims')} Ohne Training bringt Kreatin fast nichts; empfohlen sind muskelkräftigende Aktivitäten an mindestens zwei Tagen pro Woche.${who}`,
  });
}
