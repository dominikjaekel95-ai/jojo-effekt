/**
 * Absetzkurve der STEP-1-Verlängerung: 68 Wochen Semaglutid, danach 52 Wochen ohne Medikament.
 * Messpunkte Woche 0, 68 und 120 (wilding2022ext); Linien dazwischen schematisch.
 * Optionen: data-placebo="nein", data-acht="ja" (Marke „ab Woche 8 messbar“, wu2025),
 * data-komposition="ja" (Zusammensetzung des Verlusts, wilding2021dxa).
 */
import { type Attr, type Ctx, de, fn, ja, r1, rahmen, zahl } from '../basis';
import { step1ext, wu2025 } from '../daten';

type Pt = [number, number];

function svg(mob: boolean, o: { placebo: boolean; acht: boolean; komposition: boolean }): string {
  const W = mob ? 350 : 720;
  const H = mob ? 320 : 380;
  const m = mob ? { l: 44, r: 70, t: 26, b: 34 } : { l: 52, r: 136, t: 30, b: 40 };
  const x = (w: number) => r1(m.l + (w / 120) * (W - m.l - m.r));
  const y = (v: number) => r1(m.t + ((2 - v) / 22) * (H - m.t - m.b));
  const { sema, placebo } = step1ext;
  const D: Record<string, Pt[]> = {
    s1: [[0, 0], [22, -10.5], [44, sema.w68 - 0.2], [68, sema.w68]],
    s2: [[68, sema.w68], [77, sema.w68 + 0.1], [86, -9.2], [120, sema.w120]],
    p1: [[0, 0], [16, -1.7], [40, -2.2], [68, placebo.w68]],
    p2: [[68, placebo.w68], [84, -1.8], [100, -0.6], [120, placebo.w120]],
  };
  const P = (pts: Pt[]) => `M${x(pts[0][0])} ${y(pts[0][1])} C${pts.slice(1).map((p) => `${x(p[0])} ${y(p[1])}`).join(' ')}`;
  const grid = [0, -5, -10, -15, -20];
  const gl = (v: number) => (v === 0 ? '0 %' : v === -20 ? '−20 %' : `−${Math.abs(v)}`);
  const xs: [number, string, string][] = [
    [0, '0', 'start'],
    [68, '68', 'middle'],
    [120, mob ? '120 Wo.' : '120 Wochen', 'end'],
  ];
  // Klammer rechts: von −17,3 bis −5,6 = zwei Drittel des Verlusts
  const bx = x(120) + (mob ? 12 : 20);
  const b1 = y(sema.w120);
  const b2 = y(sema.w68);
  const bm = r1((b1 + b2) / 2);
  const d = 7;
  const brace = `M${bx - d} ${b1} Q${bx} ${b1} ${bx} ${b1 + 11} L${bx} ${bm - 9} Q${bx} ${bm} ${bx + d} ${bm} Q${bx} ${bm} ${bx} ${bm + 9} L${bx} ${b2 - 11} Q${bx} ${b2} ${bx - d} ${b2}`;
  const hlW = mob ? 46 : 98;
  const hlH = mob ? 40 : 30;
  const hlX = bx + (mob ? 10 : 14);
  const by = y(sema.w68) + (mob ? 22 : 28);

  return (
    `<svg class="ia-svg ia-svg-${mob ? 'm' : 'd'}" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true" focusable="false">` +
    `<g class="k-grid">` +
    grid.map((v) => `<line class="ia-gl" x1="${m.l}" x2="${W - m.r + 6}" y1="${y(v)}" y2="${y(v)}"/>`).join('') +
    grid.map((v) => `<text class="ia-ax" x="${m.l - 9}" y="${y(v) + 4}" text-anchor="end">${gl(v)}</text>`).join('') +
    xs.map(([w, t, an]) => `<text class="ia-ax" x="${x(w)}" y="${H - m.b + 22}" text-anchor="${an}">${t}</text>`).join('') +
    `</g>` +
    (o.placebo
      ? `<g class="k-pla"><path class="ia-pla k-pla1" d="${P(D.p1)}"/><path class="ia-pla k-pla2" d="${P(D.p2)}"/>` +
        (mob ? '' : `<text class="ia-ax k-pla2" x="${x(120)}" y="${y(placebo.w120) - 11}" text-anchor="end">Placebo ${de(placebo.w120, 1)} %</text>`) +
        `</g>`
      : '') +
    `<g class="k-dose"><line class="ia-dose" x1="${x(68)}" x2="${x(68)}" y1="${m.t - 8}" y2="${H - m.b}"/>` +
    `<text class="ia-lab" x="${x(68) + 9}" y="${m.t + 6}">letzte Dosis</text></g>` +
    (o.acht
      ? `<g class="k-acht"><path class="ia-dose" fill="none" d="M${x(68)} ${by - 6} V${by} H${x(68 + wu2025.abWoche)} V${by - 6}"/>` +
        `<text class="ia-ax" x="${x(68 + wu2025.abWoche) + 7}" y="${by + 4}">${mob ? '8 Wo.' : 'ab Woche 8 messbar'}</text></g>`
      : '') +
    `<path class="ia-line k-l1" pathLength="1" d="${P(D.s1)}"/>` +
    `<path class="ia-line ia-line-clay k-l2" pathLength="1" d="${P(D.s2)}"/>` +
    `<g class="k-p1"><circle class="ia-dot" cx="${x(68)}" cy="${y(sema.w68)}" r="5.5"/>` +
    `<text class="ia-lab" x="${x(68) - 8}" y="${y(sema.w68) + (mob ? 19 : 22)}" text-anchor="end">${de(sema.w68, 1)} %</text></g>` +
    `<g class="k-p2"><circle class="ia-dot ia-dot-clay" cx="${x(120)}" cy="${y(sema.w120)}" r="5.5"/>` +
    `<text class="ia-lab ia-lab-clay" x="${x(120) - 12}" y="${y(sema.w120) - 12}" text-anchor="end">${de(sema.w120, 1)} %</text></g>` +
    `<path class="ia-brace k-brace" pathLength="1" d="${brace}"/>` +
    `<g class="k-hl"><rect class="ia-hl" x="${hlX}" y="${bm - hlH / 2}" width="${hlW}" height="${hlH}" rx="4"/>` +
    (mob
      ? `<text class="ia-hlt" x="${hlX + hlW / 2}" y="${bm - 3}" text-anchor="middle">2/3</text><text class="ia-hlt ia-hlt-s" x="${hlX + hlW / 2}" y="${bm + 12}" text-anchor="middle">zurück</text>`
      : `<text class="ia-hlt" x="${hlX + hlW / 2}" y="${bm + 5}" text-anchor="middle">2/3 zurück</text>`) +
    `</g>` +
    `</svg>`
  );
}

/** Woraus der Verlust bestand: geteilter Balken unter der Kurve (wilding2021dxa) */
function komposition(ctx: Ctx, verlust: number): string {
  return (
    `<div class="ia-komp">` +
    `<p class="ia-komp-t">Woraus die ${de(Math.abs(verlust), 1)} % Verlust bestanden${fn(ctx, 'wilding2021dxa')}</p>` +
    `<div class="ia-komp-bar" aria-hidden="true"><span class="ia-komp-fett" style="width:60%"></span><span class="ia-komp-ff" style="width:40%"></span></div>` +
    `<div class="ia-komp-l"><span class="ia-komp-lf">≈ 60 % Fettmasse</span><span class="ia-komp-lm">≈ 40 % fettfreie Masse</span></div>` +
    `</div>`
  );
}

export function absetzkurve(a: Attr, ctx: Ctx): string {
  const o = { placebo: ja(a, 'placebo', true), acht: ja(a, 'acht', false), komposition: ja(a, 'komposition', false) };
  const q = fn(ctx, step1ext.quelle);
  const { sema } = step1ext;
  const stats =
    `<div class="ia-stats">` +
    `<div class="ia-stat"><p class="ia-gross">${zahl(de(sema.w68, 1))}<small> %</small></p><p class="ia-klein">nach 68 Wochen Semaglutid, im Mittel</p></div>` +
    `<div class="ia-stat ia-stat-clay k-st2"><p class="ia-gross">${zahl(de(sema.w120, 1), '', 'data-ia-verz="2600"')}<small> %</small></p><p class="ia-klein">ein Jahr nach der letzten Dosis. Zwei Drittel des Verlusts waren zurück.${q}</p></div>` +
    `</div>`;
  const legende =
    `<div class="ia-legende">` +
    `<span><i class="ia-lg ia-lg-ink"></i>mit Semaglutid</span>` +
    `<span><i class="ia-lg ia-lg-clay"></i>nach der letzten Dosis</span>` +
    (o.placebo ? `<button type="button" class="ia-schalter" aria-pressed="true" data-ia-schalter="ohne-placebo"><i class="ia-lg ia-lg-pla"></i>Placebo</button>` : '') +
    `</div>`;
  const fuss =
    `Mittelwerte der STEP-1-Verlängerung; Messpunkte in Woche 0, 68 und 120, die Linien dazwischen sind schematisch.${q}` +
    (o.acht ? ` Ab etwa Woche 8 nach dem Absetzen ist die Zunahme in Studien messbar.${fn(ctx, wu2025.quelle)}` : '') +
    (o.komposition ? ' Fettfreie Masse umfasst Muskeln, Organe und Wasser; Zusammensetzung aus der DXA-Substudie von STEP 1, exploratorische Analyse.' : '');
  return rahmen({
    ctx,
    name: 'absetzkurve',
    titel: 'Was nach der letzten Dosis mit dem Gewicht passiert',
    unter: 'Gewichtsänderung gegenüber dem Start, in Prozent',
    inhalt:
      stats +
      `<div class="ia-buehne ia-buehne-kurve">${svg(false, o)}${svg(true, o)}</div>` +
      legende +
      (o.komposition ? komposition(ctx, sema.w68) : ''),
    fuss,
  });
}
