/**
 * Amazon-Partnerprogramm: Produktregister für die Affiliate-Listen (Danke-Seite, Artikel).
 *
 * Regeln (Amazon-Teilnahmevereinbarung + HWG/HCVO), siehe CLAIMS.md Abschnitt E:
 * - Jeder Link ist als „Werbung“ gekennzeichnet, rel="sponsored nofollow", neues Fenster.
 * - Unter jeder Liste steht der Pflichtsatz `disclosure`.
 * - Keine Preise, keine Sternebewertungen im Text (veralten; Amazon erlaubt sie nur per API).
 * - `hint` enthält nur faktische Angaben oder den zugelassenen Claim-Wortlaut, keine Wirkversprechen.
 * - Links nur auf der Website – nie in E-Mails, PDFs oder Social-Posts (Amazon-Verbot).
 */
export const affiliate = {
  tag: 'nachderspritz-21',
  disclosure: 'Als Amazon-Partner verdiene ich an qualifizierten Verkäufen. Preise und Verfügbarkeit siehe Amazon.',
  products: {
    wheyNeutral: {
      name: 'natural elements Whey Protein Pulver Neutral, 1 kg',
      asin: 'B0D8L72SY7',
      hint: '25 g Protein pro Portion, ohne Süßungsmittel und Aromen – zum Einrühren in Joghurt, Quark oder Suppe.',
    },
    wheyEsn: {
      name: 'ESN Designer Whey Protein, Natural, 1 kg',
      asin: 'B0057DUWNK',
      hint: 'Bis zu 23 g Protein pro Portion, Molkenprotein, hergestellt in Deutschland.',
    },
    wheyIsolate: {
      name: 'Optimum Nutrition Gold Standard 100 % Whey Isolate, 930 g',
      asin: 'B07QXZ7DWK',
      hint: 'Isolat, dadurch sehr laktosearm – eine Option bei empfindlichem Magen.',
    },
    creatineEsn: {
      name: 'ESN Ultrapure Creatine Monohydrate, 500 g',
      asin: 'B0057ED9AM',
      hint: 'Kreatin-Monohydrat, geschmacksneutral, 3 g pro Portion.',
    },
    creatineNe: {
      name: 'natural elements Creatin Monohydrat, 500 g',
      asin: 'B0863QGX3P',
      hint: 'Kreatin-Monohydrat, ultrafein gemahlen, laborgeprüft.',
    },
    psyllium: {
      name: 'Flohsamenschalen Bio, 99 % rein, 500 g',
      asin: 'B01LZGXOG3',
      hint: 'Reich an Ballaststoffen; immer mit einem großen Glas Wasser einnehmen.',
    },
    glucomannan: {
      name: 'Vita2You Konjakmehl (Glucomannan-Pulver), 250 g',
      asin: 'B08CMV6TLP',
      hint:
        'Glucomannan trägt im Rahmen einer kalorienarmen Ernährung zu Gewichtsverlust bei. Die Wirkung stellt sich bei täglich 3 g ein, in drei Portionen zu je 1 g mit ein bis zwei Gläsern Wasser vor den Mahlzeiten. Nicht bei Schluckbeschwerden – Erstickungsgefahr bei zu wenig Flüssigkeit.',
    },
  },
} as const;

export type AffiliateKey = keyof typeof affiliate.products;

export function affiliateUrl(asin: string): string {
  return `https://www.amazon.de/dp/${asin}?tag=${affiliate.tag}`;
}
