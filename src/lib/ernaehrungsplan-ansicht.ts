/**
 * Ernährungsplan: HTML für den veränderlichen Teil der Planseite (14 Tage auf einen Blick, zwei Wochen mit
 * Einkaufslisten, Rezeptkarten, Rechengrundlage). Eine Funktion für Build und Browser: Die Seite
 * /ernaehrungsplan/plan/<id>/ rendert damit den Grundplan, das Skript derselben Seite rendert damit den Plan mit
 * Vorlieben (?v=…) neu. Stile: <style is:global> in src/pages/ernaehrungsplan/plan/[id].astro (Klassen ep-…).
 * Keine <header>/<footer>/<section>-Elemente: Die globale Druck-CSS blendet header/footer aus.
 */
import { zahl, type Plan, type Tag, type Woche, type KarteImPlan } from '../data/ernaehrungsplan';
import { karten as rezeptKarten } from '../data/ernaehrungsplan-karten';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
const fnRef = (n: number, id: string) => `<sup><a href="#fn-${id}" class="fn" aria-label="Quelle ${n}">${n}</a></sup>`;
const aufzaehlung = (xs: (string | number)[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} und ${xs[xs.length - 1]}`);

export interface AnsichtOptionen { fnBls: number }

/** 14 Tage auf einen Blick: Protein pro Tag als Balken, Ziel als Linie, Rechenweg des Tagesfaktors. */
export function blickHtml(plan: Plan) {
  const oben = Math.max(plan.ziel + 25, ...plan.tage.map((t) => t.protein + 5));
  const pct = (g: number) => Math.round((g / oben) * 1000) / 10;
  const min = Math.min(...plan.tage.map((t) => t.protein));
  const max = Math.max(...plan.tage.map((t) => t.protein));
  const balken = plan.tage
    .map((t, i) => {
      const snack = t.mahlzeiten.filter((m) => m.slot === 'snack').reduce((s, m) => s + m.protein, 0);
      const haupt = t.protein - snack;
      return `<li style="--i:${i}"><i style="--h:${pct(t.protein) / 100}"><b style="flex-grow:${haupt}"></b>${snack ? `<b class="ep-s" style="flex-grow:${snack}"></b>` : ''}</i><span class="ep-blick-tag">${t.nr}</span></li>`;
    })
    .join('');
  const hatSnacks = plan.tage.some((t) => t.mahlzeiten.some((m) => m.slot === 'snack'));
  return `<figure class="ep-blick" data-ep-blick>
<div class="ep-blick-kopf"><p class="ep-blick-titel">14 Tage auf einen Blick</p><p class="ep-legende"><span><i class="ep-l-h"></i>Frühstück, Mittag, Abend</span>${hatSnacks ? '<span><i class="ep-l-s"></i>Zwischenmahlzeiten</span>' : ''}<span><i class="ep-l-z"></i>Ziel ${plan.ziel} g</span></p></div>
<div class="ep-blick-flaeche" role="img" aria-label="Protein an 14 Tagen: zwischen ${min} und ${max} Gramm pro Tag, Ziel ${plan.ziel} Gramm.">
<span class="ep-blick-ziel" style="bottom:${pct(plan.ziel)}%"></span>
<ol class="ep-blick-tage">${balken}</ol>
</div>
<figcaption class="ep-klein">Protein pro Tag in Gramm. Jeder Tag liegt zwischen ${min} und ${max} g. Die Grundrezepte sind für eine normale Portion gerechnet; ein Faktor je Tag passt die Mengen von Frühstück, Mittag und Abend an, bei dir zwischen ${zahl(plan.faktor.min, 2)} und ${zahl(plan.faktor.max, 2)}. Zwischenmahlzeiten haben eine feste Portion.</figcaption>
</figure>`;
}

function tag(plan: Plan, t: Tag) {
  const oben = Math.max(plan.ziel, t.protein) * 1.06;
  const pct = (g: number) => Math.round((g / oben) * 1000) / 10;
  let acc = 0;
  const segs = t.mahlzeiten
    .map((m) => {
      const s = `<b class="${m.slot === 'snack' ? 'ep-s' : ''}" style="left:${pct(acc)}%;width:${pct(m.protein)}%"></b>`;
      acc += m.protein;
      return s;
    })
    .join('');
  const zeilen = t.mahlzeiten
    .map((m) => {
      const zutaten = m.positionen.map((p) => esc(p.text)).join(', ');
      return `<li class="ep-mz${m.slot === 'snack' ? ' ep-mz-snack' : ''}${m.bevorzugt ? ' ep-fav' : ''}"><span class="ep-mz-zeit">${esc(m.titel)}</span><span class="ep-mz-inhalt"><span class="ep-mz-name">${esc(m.name)}</span> <span class="ep-mz-zutaten">${zutaten}</span>${m.dazu ? ` <span class="ep-mz-dazu">dazu ${esc(m.dazu)}</span>` : ''}</span><span class="ep-mz-g">${m.protein} g</span></li>`;
    })
    .join('');
  return `<div class="ep-tag" id="tag-${t.nr}">
<div class="ep-tag-kopf"><h3>Tag ${t.nr}</h3><p><strong>${t.protein} g</strong> Protein</p></div>
<div class="ep-tag-balken" aria-hidden="true">${segs}<span class="ep-tag-ziel" style="left:${pct(plan.ziel)}%"></span></div>
<ol class="ep-mahlzeiten">${zeilen}</ol>
</div>`;
}

function woche(plan: Plan, w: Woche) {
  const gruppen = w.einkauf
    .map((g) => `<div class="ep-eg"><h4>${esc(g.name)}</h4><ul>${g.posten.map((p) => `<li><span class="ep-kasten" aria-hidden="true"></span>${esc(p)}</li>`).join('')}</ul></div>`)
    .join('');
  return `<div class="ep-woche" id="woche-${w.nr}">
<div class="ep-woche-kopf"><h2 class="ep-h2">Woche ${w.nr}</h2><p class="ep-klein">Tag ${w.tage[0].nr} bis ${w.tage[w.tage.length - 1].nr}</p></div>
<div class="ep-tage">${w.tage.map((t) => tag(plan, t)).join('')}</div>
<div class="ep-einkauf">
<h3>Einkaufsliste für Woche ${w.nr}</h3>
<p class="ep-klein">Summen aus Tag ${w.tage[0].nr} bis ${w.tage[w.tage.length - 1].nr}, auf 50 g aufgerundet. Gekochte Hülsenfrüchte gibt es im Glas oder in der Dose.</p>
<div class="ep-einkauf-gruppen">${gruppen}</div>
<p class="ep-einkauf-dazu"><strong>Außerdem, ohne feste Menge:</strong> ${esc(w.dazu.join(', '))}</p>
</div>
</div>`;
}

function karte(k: KarteImPlan) {
  const r = rezeptKarten[k.mahlzeit.id];
  const m = k.mahlzeit;
  const wann = k.anzahl > 1 ? `${k.anzahl}-mal im Plan, an Tag ${aufzaehlung(k.tage)}` : `an Tag ${k.tage[0]}`;
  return `<article class="ep-karte${m.bevorzugt ? ' ep-fav' : ''}">
<h3 class="ep-karte-name"><span class="ep-mz-name">${esc(m.name)}</span></h3>
<p class="ep-karte-meta">${r ? `etwa ${r.zeit} Minuten · ` : ''}${wann} · rund ${m.protein} g Protein</p>
<div class="ep-karte-spalten">
<div><p class="ep-karte-h">Zutaten wie an Tag ${k.tage[0]}</p><ul>${m.positionen.map((p) => `<li>${esc(p.text)}</li>`).join('')}${m.dazu ? `<li class="ep-mz-dazu">dazu ${esc(m.dazu)}</li>` : ''}</ul></div>
${r ? `<div><p class="ep-karte-h">So geht’s</p><ol>${r.schritte.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>${r.tipp ? `<p class="ep-karte-tipp">${esc(r.tipp)}</p>` : ''}</div>` : ''}
</div>
</article>`;
}

/** Der veränderliche Teil der Planseite ab Woche 1 als HTML (der Überblick steht weiter oben, siehe blickHtml). */
export function planHtml(plan: Plan, o: AnsichtOptionen): string {
  return `${plan.wochen.map((w) => woche(plan, w)).join('\n')}
<div class="ep-rezepte" id="rezepte">
<h2 class="ep-h2">Rezeptkarten</h2>
<p class="ep-klein ep-rezepte-intro">Die ${plan.karten.length} Gerichte, die in deinem Plan am häufigsten vorkommen. Die Mengen gelten für den genannten Tag; an anderen Tagen weichen sie etwas ab.</p>
<div class="ep-karten">${plan.karten.map(karte).join('')}</div>
</div>
<div class="ep-grundlage" id="rechengrundlage">
<h2 class="ep-h2">Rechengrundlage</h2>
<p class="ep-klein">Protein je 100 g oder 100 ml, bei Eiern und Wraps je Stück. Gerundete Durchschnittswerte aus dem Bundeslebensmittelschlüssel${fnRef(o.fnBls, 'bls')}; Proteinpulver und Räuchertofu nach typischen Herstellerangaben (mit * markiert). Gemüse und Obst unter „dazu“ zählen nicht mit.</p>
<ul class="ep-grundlage-liste">${plan.grundlage.map((g) => `<li><span>${esc(g.name)}${g.quelle === 'hersteller' ? ' *' : ''}</span><span>${esc(g.wert)}</span></li>`).join('')}</ul>
</div>`;
}
