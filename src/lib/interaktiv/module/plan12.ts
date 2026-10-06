/**
 * Zwölf Wochen als Raster. data-vorlage="training": Steigerung aus dem Artikel Krafttraining (Sätze × Wiederholungen je
 * zwei Wochen), 24 Einheiten. data-vorlage="halten": die drei Phasen aus „Gewicht halten“, zwei Einheiten und ein
 * Wiegetag pro Woche, Woche 8 (wu2025). Blöcke bzw. Phasen sind antippbar und zeigen ihr Ziel.
 */
import { type Attr, type Ctx, esc, fn, hat, proWahl, rahmen, zahl } from '../basis';
import { wu2025 } from '../daten';

const BLOECKE = [
  { w: '1–2', s: 2, r: 8, txt: '2 × 8', ziel: 'Bewegungen lernen, Technik, leichte Belastung. Muskelkater ist kein Ziel.' },
  { w: '3–4', s: 2, r: 10, txt: '2 × 10', ziel: 'Belastung so wählen, dass die letzten zwei Wiederholungen schwer sind.' },
  { w: '5–6', s: 3, r: 8, txt: '3 × 8', ziel: 'Der dritte Satz kommt dazu.' },
  { w: '7–8', s: 3, r: 10, txt: '3 × 10', ziel: 'Stärkeres Band oder mehr Gewicht bei Kniebeuge, Rudern und Hüftstrecken.' },
  { w: '9–10', s: 3, r: 12, txt: '3 × 12', ziel: 'Zuhause-Varianten auf die nächste Stufe, zum Beispiel Liegestütz tiefer.' },
  { w: '11–12', s: 3, r: 8, txt: '3 × 8', ziel: 'Widerstand erhöhen, Wiederholungen zurück auf 8: das ist die eigentliche Steigerung.', schwer: true },
];

function training(ctx: Ctx): string {
  const max = 36;
  const ziele = Object.fromEntries(BLOECKE.map((b, i) => [String(i + 1), `Woche ${b.w}, ${b.txt}${b.schwer ? ', schwerer' : ''}: ${b.ziel}`]));
  const spalten = BLOECKE.map((b, i) => {
    const h = ((b.s * b.r) / max) * 100;
    const punkte = Array.from({ length: 4 }, (_, k) => `<i class="pl-e" style="--d:${(i * 4 + k) * 45}ms"></i>`).join('');
    return (
      `<button type="button" class="pl-block${b.schwer ? ' pl-schwer' : ''}" value="${i + 1}" aria-pressed="${i === 0}" style="--i:${i}">` +
      `<span class="pl-saeule"><span class="pl-bar" style="height:${h.toFixed(1)}%"></span></span>` +
      `<span class="pl-txt">${b.txt}</span>` +
      `<span class="pl-punkte" aria-hidden="true">${punkte}</span>` +
      `<span class="pl-w">Woche ${b.w}</span>` +
      `</button>`
    );
  }).join('');
  return rahmen({
    ctx,
    name: 'plan12',
    titel: '12 Wochen mit Steigerung',
    unter: 'Sätze × Wiederholungen je Übung; ein Punkt ist eine Einheit',
    attrs: { 'data-block': '1' },
    inhalt:
      `<div class="pl-stat"><p class="ia-gross">${zahl('24')}<small> Einheiten</small></p><p class="ia-klein">in zwölf Wochen, zwei pro Woche à 30 Minuten.${hat(ctx, 'who2020') ? fn(ctx, 'who2020') : ''}</p></div>` +
      `<div class="pl-raster" data-ia-wahl="block" role="group" aria-label="Zwei-Wochen-Blöcke">${spalten}</div>` +
      `<div class="ia-legende"><span><i class="ia-lg ia-lg-punkt pl-lg-e"></i>Krafteinheit</span><span><i class="ia-lg pl-lg-schwer"></i>Woche 11 und 12: mehr Widerstand</span></div>` +
      `<p class="pl-ziel" aria-live="polite"${proWahl('x', 'block', ziele)}>${esc(ziele['1'])}</p>`,
    fuss: `Tippe einen Block an. Regel für die ganze Zeit: Schaffst du in allen Sätzen 12 saubere Wiederholungen, wird die Übung beim nächsten Mal schwerer, nie länger.${hat(ctx, 'acsm2009') ? ` Das ACSM empfiehlt Einsteigern 8 bis 12 Wiederholungen in 1 bis 3 Sätzen;${fn(ctx, 'acsm2009')} der Plan nutzt 2 bis 3.` : ''}`,
  });
}

const PHASEN = [
  { n: 1, titel: 'Routinen bauen', wochen: [1, 2, 3, 4], ziel: 'Ziel am Ende von Phase 1: acht Trainingseinheiten absolviert, Protein an mindestens fünf von sieben Tagen erreicht, ein Wiege-Protokoll mit vier Einträgen.' },
  { n: 2, titel: 'Den Appetit auffangen', wochen: [5, 6, 7, 8], ziel: 'Ziel am Ende von Phase 2: Gewicht innerhalb von 2 kg um den Ausgangswert, Kreatin-Wasser eingerechnet. Wenn nicht: Protein und Training ehrlich prüfen.' },
  { n: 3, titel: 'Stabilisieren, Regeln für danach', wochen: [9, 10, 11, 12], ziel: 'Ziel am Ende von Phase 3: Gewicht stabil, Training seit zwölf Wochen regelmäßig, eine schriftliche Regel für die Zeit danach, ein Arzttermin hinter dir.' },
];

function halten(ctx: Ctx): string {
  const fnWu = fn(ctx, wu2025.quelle);
  const ziele = Object.fromEntries(PHASEN.map((p) => [String(p.n), p.ziel]));
  let d = 0;
  const phasen = PHASEN.map(
    (p) =>
      `<button type="button" class="pl-phase" value="${p.n}" aria-pressed="${p.n === 1}">` +
      `<span class="pl-ph-t"><span class="pl-ph-n">Phase ${p.n}</span>${p.titel}</span>` +
      `<span class="pl-wochen" aria-hidden="true">` +
      p.wochen
        .map((w) => {
          const marke = w === wu2025.abWoche ? ' pl-acht' : '';
          const termin = w >= 8 ? ' pl-termin' : '';
          const e = `<i class="pl-e" style="--d:${d++ * 40}ms"></i><i class="pl-e" style="--d:${d++ * 40}ms"></i><i class="pl-wg" style="--d:${d++ * 40}ms"></i>`;
          return `<span class="pl-woche${marke}${termin}"><span class="pl-wn">${w}</span>${e}</span>`;
        })
        .join('') +
      `</span></button>`,
  ).join('');
  return rahmen({
    ctx,
    name: 'plan12',
    klasse: 'pl-halten',
    titel: 'Der Plan in drei Phasen',
    unter: 'Zwölf Wochen nach der letzten Dosis, Woche für Woche',
    attrs: { 'data-phase': '1' },
    inhalt:
      `<div class="pl-phasen" data-ia-wahl="phase" role="group" aria-label="Phasen">${phasen}</div>` +
      `<div class="ia-legende"><span><i class="ia-lg ia-lg-punkt pl-lg-e"></i>Krafteinheit</span><span><i class="ia-lg ia-lg-punkt pl-lg-wg"></i>Wiegetag</span><span><i class="ia-lg ia-lg-clay"></i>ab Woche 8: Zunahme in Studien messbar${fnWu}</span><span><i class="ia-lg pl-lg-termin"></i>Kontrolltermin Woche 8 bis 12</span></div>` +
      `<p class="pl-ziel" aria-live="polite"${proWahl('x', 'phase', ziele)}>${esc(ziele['1'])}</p>`,
    fuss: `Tippe eine Phase an.${hat(ctx, 'who2020') ? ` Zwei Krafteinheiten pro Woche entsprechen der WHO-Empfehlung.${fn(ctx, 'who2020')}` : ''}`,
  });
}

export function plan12(a: Attr, ctx: Ctx): string {
  return a.vorlage === 'halten' ? halten(ctx) : training(ctx);
}
