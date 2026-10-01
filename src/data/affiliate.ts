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
    magnesiumBisglycinat: {
      name: 'natural elements Magnesium Bisglycinat, 180 Kapseln',
      asin: 'B07NS14648',
      hint: 'Magnesiumbisglycinat, 100 mg Magnesium pro Kapsel. Das BfR empfiehlt aus Nahrungsergänzung höchstens 250 mg am Tag. Magnesium trägt zu einer normalen Muskelfunktion und zur Verringerung von Müdigkeit bei.',
    },
    vitaminB12Drops: {
      name: 'natural elements Vitamin B12 Tropfen, 50 ml',
      asin: 'B07JVP37J5',
      hint: '500 µg B12 pro Tropfen (Methyl- und Adenosylcobalamin), vegan. Das liegt deutlich über den 25 µg, die das BfR für Nahrungsergänzung empfiehlt; hohe Dosen sind bei einem Mangel üblich, den der Blutwert zeigt. Vitamin B12 trägt zur Verringerung von Müdigkeit bei.',
    },
    vitaminD3Drops: {
      name: "Dr. Jacob's Vitamin D3 K2 Öl, 20 ml",
      asin: 'B016RCXAHE',
      hint: '800 I.E. (20 µg) Vitamin D3 plus 20 µg K2 pro Tropfen; 20 µg entsprechen der Höchstmenge, die das BfR für Nahrungsergänzung empfiehlt. Vitamin D trägt zur Erhaltung normaler Knochen und einer normalen Muskelfunktion bei.',
    },
    omega3Fish: {
      name: 'natural elements Omega 3 Fischöl, 365 Kapseln',
      asin: 'B082FH6GDL',
      hint: '2000 mg Fischöl pro Tagesdosis, EPA und DHA in Triglycerid-Form. EPA und DHA tragen zu einer normalen Herzfunktion bei (ab 250 mg täglich).',
    },
    omega3Algae: {
      name: 'natural elements Omega 3 Vegan (Algenöl), 60 Kapseln',
      asin: 'B0D9YT9QNL',
      hint: 'Algenöl, laut Hersteller 800 mg DHA und 400 mg EPA pro Tagesdosis, vegan. EPA und DHA tragen zu einer normalen Herzfunktion bei (ab 250 mg täglich).',
    },
    gripDynamometer: {
      name: 'CAMRY Digitales Hand-Dynamometer, bis 90 kg',
      asin: 'B0CB3NK4HK',
      hint: 'Misst die Griffkraft digital; einmal pro Woche messen und notieren zeigt, ob die Kraft hält.',
    },
  },
} as const;

export type AffiliateKey = keyof typeof affiliate.products;

export function affiliateUrl(asin: string): string {
  return `https://www.amazon.de/dp/${asin}?tag=${affiliate.tag}`;
}
