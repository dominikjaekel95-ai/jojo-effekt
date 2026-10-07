/**
 * Energiebedarf schätzen: Mifflin-St-Jeor-Formel (mifflin1990) mal Aktivitätsfaktor 1,4 oder 1,6 (dgeEnergie), dazu
 * die Größenordnung der Anpassung nach 10 % Gewichtsverlust: 300 bis 400 kcal weniger (rosenbaum2010).
 * Ein Startwert, keine Vorgabe. Rechnet nur im Browser, speichert nichts.
 */
import { type Attr, type Ctx, fn, num, rahmen, regler, wahl, zahl } from '../basis';

const ACHSE = 4000;
const fmt = (n: number) => n.toLocaleString('de-DE');
const strecke = (von: number, bis: number) =>
  `translateX(${((von / ACHSE) * 100).toFixed(2)}%) scaleX(${Math.max(0.0001, (bis - von) / ACHSE).toFixed(4)})`;

export function bedarf(a: Attr, ctx: Ctx): string {
  const alter = num(a, 'alter', 45);
  const cm = num(a, 'cm', 170);
  const kg = num(a, 'kg', 80);
  const mann = a.geschlecht === 'mann';
  const f = 1.4;
  const reeRoh = 10 * kg + 6.25 * cm - 5 * alter + (mann ? 5 : -161);
  const ree = Math.round(reeRoh);
  const tag = Math.round(reeRoh * f);
  const ticks = [0, 1000, 2000, 3000, 4000]
    .map((t, i, arr) => `<span style="left:${(t / ACHSE) * 100}%">${i === arr.length - 1 ? `${fmt(t)} kcal` : fmt(t)}</span>`)
    .join('');
  return rahmen({
    ctx,
    name: 'bedarf',
    titel: 'Deinen Bedarf schätzen, und warum er niedriger liegt',
    unter: 'Ruheenergieverbrauch nach Formel, Tagesbedarf und die Anpassung nach Gewichtsverlust',
    attrs: { 'data-geschlecht': mann ? 'mann' : 'frau', 'data-faktor': '14', 'data-achse': String(ACHSE) },
    inhalt:
      `<div class="be-wahl">` +
      wahl(ctx, 'geschlecht', 'Geschlecht', [{ wert: 'frau', label: 'Frau' }, { wert: 'mann', label: 'Mann' }], mann ? 'mann' : 'frau') +
      wahl(ctx, 'faktor', 'Alltag', [{ wert: '14', label: 'viel Sitzen' }, { wert: '16', label: 'mit Bewegung' }], '14') +
      `</div>` +
      `<div class="be-regler">` +
      regler(ctx, 'alter', 'Alter', { min: 20, max: 80, step: 1, wert: alter, einheit: 'Jahre' }) +
      regler(ctx, 'cm', 'Größe', { min: 145, max: 205, step: 1, wert: cm, einheit: 'cm' }) +
      regler(ctx, 'kg', 'Gewicht heute', { min: 45, max: 160, step: 1, wert: kg, einheit: 'kg' }) +
      `</div>` +
      `<div class="ia-stats be-stats">` +
      `<div class="ia-stat"><p class="ia-gross">${zahl(fmt(ree), '', 'data-b-ree')}<small> kcal</small></p><p class="ia-klein">Ruheenergieverbrauch laut Formel${fn(ctx, 'mifflin1990')}</p></div>` +
      `<div class="ia-stat"><p class="ia-gross">${zahl(fmt(tag), '', 'data-b-tag')}<small> kcal</small></p><p class="ia-klein">Tagesbedarf mit Aktivitätsfaktor${fn(ctx, 'dgeEnergie')}</p></div>` +
      `</div>` +
      `<div class="be-achse" aria-hidden="true">` +
      `<div class="be-zeile"><span class="be-l">Ruhe</span><span class="be-spur"><span class="be-ein"><span class="be-bar be-ree" data-b-ree-bar style="transform:${strecke(0, ree)}"></span></span></span></div>` +
      `<div class="be-zeile"><span class="be-l">Tag</span><span class="be-spur"><span class="be-ein"><span class="be-bar" data-b-bar style="transform:${strecke(0, tag)}"></span></span></span></div>` +
      `<div class="be-zeile"><span class="be-l">eher</span><span class="be-spur"><span class="be-ein be-ein2"><span class="be-bar be-eher" data-b-eher style="transform:${strecke(0, tag - 400)}"></span><span class="be-band" data-b-band style="transform:${strecke(tag - 400, tag - 300)}"></span></span></span></div>` +
      `<div class="be-ticks">${ticks}</div></div>` +
      `<p class="be-satz">Nach mindestens 10 % Gewichtsverlust liegt der Verbrauch in Messungen etwa 300 bis 400 kcal unter dem Wert der Formel${fn(ctx, 'rosenbaum2010')}, hier also eher bei <strong>${zahl(fmt(tag - 400), '', 'data-b-lo')} bis ${zahl(fmt(tag - 300), '', 'data-b-hi')} kcal</strong>. Ein Startwert: Was die Waage in vier Wochen zeigt, entscheidet.</p>`,
    fuss: 'Eigene Rechnung mit der Formel aus dem Artikel; Faktor 1,4 bei überwiegend sitzender Tätigkeit, 1,6 mit regelmäßiger Bewegung. Keine Kalorienvorgabe und kein Diätplan. Das Werkzeug rechnet nur in deinem Browser und speichert nichts.',
  });
}
