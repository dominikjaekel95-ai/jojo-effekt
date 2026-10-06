/**
 * Supplements sortiert nach Belegen, aus der Tabelle des Supplement-Artikels: Beim Erscheinen fliegen die Einträge
 * aus einem Stapel in ihre Spalten (FLIP in client.ts). Jeder Eintrag klappt seine Begründung auf (<details>, ohne JS).
 */
import { type Attr, type Ctx, fn, hat, rahmen } from '../basis';

interface Eintrag {
  name: string;
  warum: string;
  quelle?: string;
  link?: string;
}

export function sortierung(_a: Attr, ctx: Ctx): string {
  const f = (id: string) => (hat(ctx, id) ? fn(ctx, id) : '');
  const spalten: { id: string; titel: string; satz: string; eintraege: Eintrag[] }[] = [
    {
      id: 'ja',
      titel: 'Sinnvoll',
      satz: 'als Ergänzung zu Essen und Training',
      eintraege: [
        { name: 'Proteinpulver', warum: 'Wenn 1,2 bis 1,6 g pro kg über Lebensmittel nicht zusammenkommen; 20 bis 30 g pro Portion.', quelle: 'leidy2015', link: '/wissen/protein-abnehmspritze/' },
        { name: 'Kreatin-Monohydrat', warum: 'Nur mit Krafttraining; 3 g täglich, auch an trainingsfreien Tagen.', quelle: 'kreider2017', link: '/wissen/kreatin-abnehmspritze/' },
        { name: 'Ballaststoffe', warum: 'Wenn du trotz Gemüse und Vollkorn unter 30 g am Tag bleibst; langsam steigern, viel Wasser.', quelle: 'dgeBallaststoffe', link: '/wissen/glucomannan-abnehmspritze/' },
      ],
    },
    {
      id: 'mangel',
      titel: 'Bei Mangel oder Lücke',
      satz: 'erst Blutwert oder Ernährung prüfen',
      eintraege: [
        { name: 'Vitamin D', warum: 'Mangel ist in Deutschland häufig; ein Effekt auf das Gewicht ist nicht belegt.', link: '/wissen/vitamin-d-abnehmspritze/' },
        { name: 'Vitamin B12', warum: 'Bei Metformin oder wenig tierischen Lebensmitteln; nach Blutwert.', quelle: 'adaSoc2024', link: '/wissen/vitamin-b12-abnehmspritze/' },
        { name: 'Eisen', warum: 'Nie auf Verdacht: Überschuss schadet. Nur ärztlich, nach Ferritin.', link: '/wissen/eisen-abnehmspritze/' },
        { name: 'Magnesium', warum: 'Bei sehr kleinen Portionen oft knapp; gegen Krämpfe kein belegter Nutzen.', link: '/wissen/magnesium-abnehmspritze/' },
      ],
    },
    {
      id: 'nein',
      titel: 'Nicht nötig',
      satz: 'für das Gewicht nach dem Absetzen',
      eintraege: [
        { name: 'Elektrolyte', warum: 'Sinnvoll bei Erbrechen oder Durchfall unter der Therapie, nach dem Absetzen unnötig.' },
        { name: 'Omega-3', warum: 'Keine Belege für Gewicht oder Muskeln nach GLP-1; Fisch ein- bis zweimal pro Woche reicht.', link: '/wissen/omega-3-abnehmspritze/' },
        { name: 'Probiotika gegen den Jojo-Effekt', warum: 'Keine Belege für das Halten des Gewichts.' },
        { name: '„Natürliche GLP-1-Booster“', warum: 'Keine zugelassene Angabe, keine Studien in der Größenordnung der Medikamente, mögliche Wechselwirkungen.' },
        { name: 'Fatburner und Detox', warum: 'Keine Belege, teils riskante Inhaltsstoffe.' },
      ],
    },
  ];
  const html = spalten
    .map(
      (s) =>
        `<div class="so-spalte so-${s.id}"><p class="so-kopf"><span class="so-t">${s.titel}</span><span class="so-s">${s.satz}</span></p>` +
        s.eintraege
          .map(
            (e) =>
              `<details class="so-item" data-so-item><summary><i aria-hidden="true"></i>${e.name}</summary>` +
              `<p>${e.warum}${e.quelle ? f(e.quelle) : ''}${e.link ? ` <a href="${e.link}">Mehr dazu</a>` : ''}</p></details>`,
          )
          .join('') +
        `</div>`,
    )
    .join('');
  return rahmen({
    ctx,
    name: 'sortierung',
    titel: 'Zwölf Mittel, nach Belegen sortiert',
    unter: 'Tippe einen Eintrag an, um die Begründung zu sehen',
    inhalt: `<div class="so-start" data-so-start aria-hidden="true"></div><div class="so-raster">${html}</div>`,
    fuss: `Nahrungsergänzungsmittel sind Lebensmittel und werden nicht auf Wirksamkeit geprüft.${f('klartextNem')} Die Einzelheiten mit Dosis und Quellen stehen in der Tabelle unten.`,
  });
}
