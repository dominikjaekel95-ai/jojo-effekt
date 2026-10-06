/**
 * Wiegen mit Zonen aus STOP Regain (wing2006): grün bis +1,4 kg, gelb bis +2,3 kg, rot ab +2,3 kg über dem Gewicht am
 * Ende der Abnahme. Zwei Regler (Ausgangsgewicht, Wochenmittel) setzen die Marke; die Zone schaltet den Text um.
 * Routine-Hilfe, keine medizinische Einschätzung: Seit 07.10.2026 löst keine Zone eine Arzt-Empfehlung aus (rot: Plan prüfen).
 */
import { type Attr, type Ctx, de, fn, num, proWahl, rahmen, regler } from '../basis';

const MAX = 3;
const pc = (kg: number) => ((Math.min(MAX, Math.max(0, kg)) / MAX) * 100).toFixed(2);

const ZONEN = {
  gruen: { name: 'Grün: nichts tun.', text: 'Das ist der Bereich, in dem Wasser, Salz, Zyklus und Darminhalt schwanken.' },
  gelb: { name: 'Gelb: zwei Wochen gegensteuern.', text: 'Protein an jedem Tag prüfen, zwei Krafteinheiten, Flüssigkalorien streichen, auf Schlaf achten. Dann wieder wiegen.' },
  rot: { name: 'Rot: Plan prüfen.', text: 'Hat das Gegensteuern zwei Wochen lang nicht gewirkt: Protein, Training, Schlaf und Flüssigkalorien durchgehen; die Maßnahmen aus Gelb laufen weiter.' },
} as const;
type Zone = keyof typeof ZONEN;

export function zonen(a: Attr, ctx: Ctx): string {
  const q = fn(ctx, 'wing2006');
  const kg = num(a, 'kg', 80);
  const plus = num(a, 'plus', 0.8);
  const zone: Zone = plus < 1.4 ? 'gruen' : plus < 2.3 ? 'gelb' : 'rot';
  const by = (f: (z: Zone) => string) => Object.fromEntries((Object.keys(ZONEN) as Zone[]).map((z) => [z, f(z)]));
  const seg = (z: Zone, von: number, bis: number, label: string) =>
    `<span class="zo-seg zo-${z}${z === zone ? ' aktiv' : ''}" style="left:${pc(von)}%;width:${(Number(pc(bis)) - Number(pc(von))).toFixed(2)}%"${proWahl('k', 'zone', by((x) => (x === z ? 'aktiv' : '')))}><span>${label}</span></span>`;
  return rahmen({
    ctx,
    name: 'zonen',
    titel: 'Deine Zonen auf der Waage',
    unter: 'Wochenmittel über dem Gewicht am Ende der Abnahme',
    attrs: { 'data-zone': zone, 'data-opt-zone': 'gruen,gelb,rot', 'data-max': String(MAX) },
    inhalt:
      regler(ctx, 'kg', 'Gewicht am Ende der Abnahme', { min: 50, max: 150, step: 1, wert: kg, einheit: 'kg' }) +
      regler(ctx, 'plus', 'Dein Wochenmittel liegt darüber um', { min: 0, max: MAX, step: 0.1, wert: plus, einheit: 'kg', dec: 1 }) +
      `<div class="zo-band">` +
      `<div class="zo-spur">${seg('gruen', 0, 1.4, 'grün')}${seg('gelb', 1.4, 2.3, 'gelb')}${seg('rot', 2.3, MAX, 'rot')}` +
      `<div class="zo-marke" data-z-marke style="transform:translateX(${(Number(pc(plus)) - 100).toFixed(2)}%)" aria-hidden="true"><i></i></div></div>` +
      `<div class="zo-skala" aria-hidden="true"><span style="left:0">± 0</span><span style="left:${pc(1.4)}%">+1,4 kg <b><span data-z-g1>${de(kg + 1.4, 1)}</span> kg</b></span><span style="left:${pc(2.3)}%">+2,3 kg <b><span data-z-g2>${de(kg + 2.3, 1)}</span> kg</b></span></div>` +
      `</div>` +
      `<div class="zo-ergebnis" aria-live="polite"><p class="zo-name"${proWahl('x', 'zone', by((z) => ZONEN[z].name))}>${ZONEN[zone].name}</p>` +
      `<p class="zo-text"${proWahl('x', 'zone', by((z) => ZONEN[z].text))}>${ZONEN[zone].text}</p>` +
      `<p class="zo-ist">Dein Wochenmittel: <span data-z-ist>${de(kg + plus, 1)}</span> kg</p></div>`,
    fuss: `Zonen aus der STOP-Regain-Studie, in der sich Erwachsene nach mindestens 10 % Gewichtsverlust täglich wogen und je nach Zone festgelegt reagierten.${q} Die Studie lief ohne Medikament; die Übertragung auf die Zeit nach der Spritze ist plausibel, aber nicht geprüft. Für dein Startgewicht rechnet der <a href="/werkzeuge/gewichtskorridor/">Gewichtskorridor</a>.`,
  });
}
