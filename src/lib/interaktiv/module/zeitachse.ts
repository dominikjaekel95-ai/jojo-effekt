/**
 * Zeitachse Woche für Woche nach der letzten Dosis. Jede Zeile ist eine Woche: Balken = Anteil des Wirkstoffs im Körper
 * (0,5^(Tage/HWZ), Fachinformation), rechts das, was in dieser Woche passiert. Die Zeilen werden beim Lesen aktiv
 * (Scroll-Fortschritt, data-ia-scrub). Ab Woche 8 ist die Zunahme in Studien messbar, bis etwa Woche 20 (wu2025).
 * Optionen: data-wirkstoffe="semaglutid,tirzepatid", data-start, data-weihnachten="ja" (Feiertage-Artikel),
 * data-variante="haar" (telogenes Effluvium in Monaten, malkud2015).
 */
import { type Attr, type Ctx, de, erste, esc, fn, fns, ja, liste, proWahl, rahmen, wahl } from '../basis';
import { type Wirkstoff, type WirkstoffId, wirkstoffe, wu2025 } from '../daten';

const anteil = (woche: number, w: Wirkstoff) => 100 * Math.pow(0.5, (woche * 7) / w.hwzTage);
const anteilText = (v: number) => (v >= 99.5 ? '100 %' : v >= 10 ? `${de(v, 0)} %` : v >= 1 ? `${de(v, 1)} %` : 'unter 1 %');

/** Text je Woche und Wirkstoff (ohne Fußnoten, weil er beim Umschalten getauscht wird) */
function ereignis(woche: number, w: Wirkstoff): string {
  const fuenf = Math.ceil((5 * w.hwzTage) / 7);
  if (woche === 0) return w.hwzTage < 1 ? 'Letzte Dosis. Nach knapp drei Tagen ist Liraglutid weitgehend abgebaut.' : 'Letzte Dosis.';
  if (w.hwzTage < 1) return woche === 1 ? 'Der Wirkstoff ist praktisch weg. Ab jetzt zählen Ernährung und Bewegung.' : '';
  if (woche === 1) return w.hwzTage >= 7 ? 'Noch die Hälfte im Körper. Viele merken kaum einen Unterschied.' : 'Weniger als die Hälfte im Körper. Viele merken gegen Ende der Woche mehr Appetit.';
  if (woche === 2) return w.hwzTage >= 7 ? 'Noch ein Viertel. Der Appetit kommt zurück, abgeleitet aus dem Wirkstoffabbau etwa zwischen Woche 2 und 5.' : 'Der Appetit ist weitgehend zurück.';
  if (woche === fuenf) return `Fünf Halbwertszeiten vorbei: ${w.name} ist weitgehend abgebaut.`;
  return '';
}
const fenster = (woche: number, w: Wirkstoff) =>
  w.hwzTage < 1 ? woche === 0 : w.hwzTage >= 7 ? woche >= 2 && woche <= 5 : woche >= 2 && woche <= 4;

const XMAS: { wert: string; label: string; wochen: number[]; satz: string }[] = [
  { wert: 'okt', label: '1. Oktober', wochen: [12], satz: 'Weihnachten liegt in Woche 12: Der Appetit ist seit Wochen zurück, die Zunahme in Studien seit etwa Woche 8 messbar.' },
  { wert: 'nov', label: '1. November', wochen: [7, 8], satz: 'Weihnachten liegt in Woche 7 bis 8: Der Wirkstoff ist weitgehend abgebaut, die Zunahme beginnt messbar zu werden.' },
  { wert: 'dez', label: '1. Dezember', wochen: [3], satz: 'Weihnachten liegt in Woche 3: Auswaschphase, der Wirkstoff ist noch teilweise da, der Appetit kommt zurück.' },
];

function absetzen(a: Attr, ctx: Ctx): string {
  const ws = (liste(a, 'wirkstoffe', ['semaglutid']) as WirkstoffId[]).map((id) => {
    const w = wirkstoffe[id];
    if (!w) throw new Error(`zeitachse: unbekannter Wirkstoff ${id}`);
    return w;
  });
  const start = wirkstoffe[(a.start as WirkstoffId) ?? ws[0].id] ?? ws[0];
  const xmas = ja(a, 'weihnachten');
  const xmasStart = XMAS.find((x) => x.wert === (a['xmas-start'] ?? 'nov')) ?? XMAS[1];
  const fnWu = fn(ctx, wu2025.quelle);
  const fnAlle = fns(ctx, ws.map((w) => erste(ctx, w.quellen)));
  const by = (f: (w: Wirkstoff) => string) => Object.fromEntries(ws.map((w) => [w.id, f(w)]));
  const wochen = [...Array.from({ length: 13 }, (_, i) => i), 20];
  const n = wochen.length;
  const reihen = wochen
    .map((woche, i) => {
      const lev = by((w) => `scaleX(${(anteil(woche, w) / 100).toFixed(4)})`);
      const pct = by((w) => anteilText(anteil(woche, w)));
      const ev = by((w) => ereignis(woche, w));
      const fen = by((w) => (fenster(woche, w) ? 'z-fenster' : ''));
      const studien =
        woche === wu2025.abWoche
          ? `<span class="z-studie">Die Zunahme wird in Studien messbar.${fnWu}</span>`
          : woche === wu2025.bisWoche
            ? `<span class="z-studie">Bis etwa hier steigt das Gewicht in Studien weiter.${fnWu}</span>`
            : '';
      const zunahme = woche >= wu2025.abWoche ? ' z-zunahme' : '';
      const xk = xmas
        ? proWahl('k', 'datum', Object.fromEntries(XMAS.map((x) => [x.wert, x.wochen.includes(woche) ? 'z-xmas' : ''])))
        : '';
      const xKlasse = xmas && xmasStart.wochen.includes(woche) ? ' z-xmas' : '';
      const lauf = woche === 20 ? ' z-sprung' : '';
      return (
        `<div class="z-reihe${zunahme}${fen[start.id] ? ` ${fen[start.id]}` : ''}${xKlasse}${lauf}" data-ia-ab="${(i / n).toFixed(3)}"${proWahl('k', 'wirkstoff', fen)}${xk}>` +
        `<span class="z-w">Woche ${woche}</span>` +
        `<span class="z-spur"><span class="z-ein"><span class="z-bar" style="transform:${lev[start.id]}"${proWahl('m', 'wirkstoff', lev)}></span></span></span>` +
        `<span class="z-pct"${proWahl('x', 'wirkstoff', pct)}>${pct[start.id]}</span>` +
        `<span class="z-ev"><span${proWahl('x', 'wirkstoff', ev)}>${esc(ev[start.id])}</span>${studien}</span>` +
        `</div>`
      );
    })
    .join('');
  const umschalter =
    (ws.length > 1 ? wahl(ctx, 'wirkstoff', 'Wirkstoff', ws.map((w) => ({ wert: w.id, label: w.name })), start.id) : '') +
    (xmas
      ? wahl(ctx, 'datum', 'Letzte Dosis am', XMAS.map((x) => ({ wert: x.wert, label: x.label })), xmasStart.wert, 'z-datum') +
        `<p class="z-datum-satz" aria-live="polite"${proWahl('x', 'datum', Object.fromEntries(XMAS.map((x) => [x.wert, x.satz])))}>${esc(xmasStart.satz)}</p>`
      : '');
  const fensterSatz = ja(a, 'fenster')
    ? `<p class="z-fenster-satz">Das Fenster: Der Appetit kommt zurück, bevor die Waage etwas zeigt. In diesen Wochen macht Struktur den Unterschied.</p>`
    : '';
  const legende =
    `<div class="ia-legende">` +
    `<span><i class="ia-lg z-lg-bar"></i>Wirkstoff im Körper</span>` +
    `<span><i class="ia-lg z-lg-fenster"></i>Appetit kommt zurück</span>` +
    `<span><i class="ia-lg ia-lg-clay"></i>Zunahme in Studien messbar</span>` +
    (xmas ? `<span><i class="ia-lg z-lg-xmas"></i>Weihnachten</span>` : '') +
    `</div>`;
  const attrs: Record<string, string> = { 'data-wirkstoff': start.id };
  if (xmas) attrs['data-datum'] = xmasStart.wert;
  return rahmen({
    ctx,
    name: 'zeitachse',
    titel: xmas ? 'Wo Weihnachten auf der Zeitachse nach der letzten Dosis liegt' : 'Woche für Woche nach der letzten Dosis',
    unter: 'Balken: Anteil des Wirkstoffs, der noch im Körper ist',
    attrs,
    inhalt: umschalter + fensterSatz + `<div class="z-liste" data-ia-scrub>${reihen}</div>` + legende,
    fuss: `Anteil vereinfacht aus der Halbwertszeit laut Fachinformation gerechnet.${fnAlle} Zunahme laut Meta-Analyse randomisierter Studien.${fnWu} Individuell weicht der Verlauf ab.`,
  });
}

function haar(ctx: Ctx): string {
  const q = fn(ctx, 'malkud2015');
  const zeilen: { m: string; text: string; klasse?: string; fn?: boolean }[] = [
    { m: 'Monat 0', text: 'Auslöser: Die schnelle Abnahme beginnt. Viele Haare wechseln in die Ruhephase; sichtbar ist noch nichts.' },
    { m: 'Monat 1', text: '' },
    { m: 'Monat 2', text: 'Zwei bis drei Monate später beginnt der Ausfall: mehr Haare in Bürste und Dusche.', klasse: 'z-fenster', fn: true },
    { m: 'Monat 3', text: '', klasse: 'z-fenster' },
    { m: 'Monat 4', text: 'Der Ausfall bleibt eine Zeit lang stark, dann lässt er nach.', klasse: 'z-fenster' },
    { m: 'Monat 5', text: '', klasse: 'z-fenster' },
    { m: 'Monat 6', text: '', klasse: 'z-fenster' },
    { m: 'Monat 7', text: '', klasse: 'z-fenster' },
    { m: 'Monat 8', text: 'Etwa sechs Monate nach Beginn ist er in der Regel abgeklungen, wenn der Auslöser weggefallen ist.', klasse: 'z-fenster', fn: true },
    { m: 'Monat 9', text: 'Nachwachsende Haare werden sichtbar.', klasse: 'z-nach' },
    { m: 'Monat 10', text: '', klasse: 'z-nach' },
    { m: 'Monat 11', text: '', klasse: 'z-nach' },
    { m: 'Monat 12', text: 'Bis zur alten Länge dauert es länger.', klasse: 'z-nach' },
  ];
  const n = zeilen.length;
  const reihen = zeilen
    .map(
      (z, i) =>
        `<div class="z-reihe z-ohnebar${z.klasse ? ` ${z.klasse}` : ''}" data-ia-ab="${(i / n).toFixed(3)}">` +
        `<span class="z-w">${z.m}</span><span class="z-ev">${esc(z.text)}${z.fn ? q : ''}</span></div>`,
    )
    .join('');
  return rahmen({
    ctx,
    name: 'zeitachse',
    klasse: 'z-haar',
    titel: 'Der Zeitplan des Haarausfalls nach schneller Abnahme',
    unter: 'Telogenes Effluvium, typischer Verlauf in Monaten nach dem Auslöser',
    inhalt:
      `<div class="z-leiste" aria-hidden="true">${zeilen.map((zl, i) => `<i class="${zl.klasse ?? 'z-ruhe'}" style="--i:${i}"></i>`).join('')}</div>` +
      `<div class="z-leiste-l" aria-hidden="true"><span>Auslöser</span><span>Ausfall sichtbar</span><span>Nachwachsen</span></div>` +
      `<div class="z-liste" data-ia-scrub>${reihen}</div>` +
      `<div class="ia-legende"><span><i class="ia-lg z-lg-fenster"></i>Ausfall sichtbar</span><span><i class="ia-lg ia-lg-moss"></i>Haare wachsen nach</span></div>`,
    fuss: `Typischer Verlauf laut Übersichtsarbeit; einzelne Verläufe weichen ab.${q} Länger als sechs Monate, fleckig oder mit Müdigkeit und Frieren: ärztlich abklären.`,
  });
}

export function zeitachse(a: Attr, ctx: Ctx): string {
  return a.variante === 'haar' ? haar(ctx) : absetzen(a, ctx);
}
