/**
 * Quellenregister. Jede Zahl auf der Seite verweist per Fußnote auf einen Eintrag hier.
 * IDs werden in Komponenten und Artikeln referenziert; Reihenfolge der Fußnoten pro Seite
 * ergibt sich aus der Nennung.
 */
export type Source = {
  id: string;
  short: string; // Kurzform für Fußnote
  full: string; // Vollzitat
  url?: string;
  note?: string; // z. B. „Kongressdaten“, „exploratorische Analyse“
};

export const sources: Record<string, Source> = {
  rodriguez2025: {
    id: 'rodriguez2025',
    short: 'Rodriguez et al., JAMA Netw Open 2025',
    full:
      'Rodriguez PJ, Zhang V, Gratzl S, et al. Discontinuation and Reinitiation of Dual-Labeled GLP-1 Receptor Agonists Among US Adults With Overweight or Obesity. JAMA Netw Open. 2025;8(1):e2457349.',
    url: 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2829779',
    note: 'Ein Jahr nach Therapiebeginn hatten 64,8 % der Menschen ohne Typ-2-Diabetes abgesetzt (über alle Gruppen: 53,6 %).',
  },
  wilding2021dxa: {
    id: 'wilding2021dxa',
    short: 'Wilding et al., STEP 1 Körperzusammensetzung, J Endocr Soc 2021',
    full:
      'Wilding JPH, Batterham RL, Calanna S, et al. Impact of Semaglutide on Body Composition in Adults With Overweight or Obesity: Exploratory Analysis of the STEP 1 Study. J Endocr Soc. 2021;5(Suppl 1):A16–A17.',
    url: 'https://academic.oup.com/jes/article/5/Supplement_1/A16/6240360',
    note: 'DXA-Substudie mit 140 Teilnehmenden; exploratorische Analyse. Rund 40 % des Gewichtsverlusts entfielen auf fettfreie Masse.',
  },
  wilding2022ext: {
    id: 'wilding2022ext',
    short: 'Wilding et al., STEP 1 Extension, Diabetes Obes Metab 2022',
    full:
      'Wilding JPH, Batterham RL, Davies M, et al. Weight regain and cardiometabolic effects after withdrawal of semaglutide: The STEP 1 trial extension. Diabetes Obes Metab. 2022;24(8):1553–1564.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9542252/',
    note: 'Ein Jahr nach dem Absetzen waren im Mittel zwei Drittel des verlorenen Gewichts wieder da.',
  },
  rubino2021: {
    id: 'rubino2021',
    short: 'Rubino et al., STEP 4, JAMA 2021',
    full:
      'Rubino D, Abrahamsson N, Davies M, et al. Effect of Continued Weekly Subcutaneous Semaglutide vs Placebo on Weight Loss Maintenance in Adults With Overweight or Obesity: The STEP 4 Randomized Clinical Trial. JAMA. 2021;325(14):1414–1425.',
    url: 'https://jamanetwork.com/journals/jama/fullarticle/2777886',
    note: 'Wechsel auf Placebo nach 20 Wochen: +6,9 % Körpergewicht in 48 Wochen; unter Fortführung −7,9 %.',
  },
  aronne2024: {
    id: 'aronne2024',
    short: 'Aronne et al., SURMOUNT-4, JAMA 2024',
    full:
      'Aronne LJ, Sattar N, Horn DB, et al. Continued Treatment With Tirzepatide for Maintenance of Weight Reduction in Adults With Obesity: The SURMOUNT-4 Randomized Clinical Trial. JAMA. 2024;331(1):38–48.',
    url: 'https://jamanetwork.com/journals/jama/fullarticle/2812936',
    note: 'Nach Wechsel auf Placebo: +14 % Körpergewicht in 52 Wochen; unter Fortführung −5,5 %.',
  },
  wu2025: {
    id: 'wu2025',
    short: 'Wu et al., Meta-Analyse, BMC Medicine 2025',
    full:
      'Wu H, Yang W, Guo T, et al. Trajectory of the body weight after drug discontinuation in the treatment of anti-obesity medications. BMC Med. 2025;23:398.',
    url: 'https://link.springer.com/article/10.1186/s12916-025-04200-0',
    note: 'Meta-Analyse von RCTs: Ab etwa Woche 8 nach dem Absetzen ist die Gewichtszunahme messbar, sie setzt sich bis etwa Woche 20 fort.',
  },
  eclinmed2026: {
    id: 'eclinmed2026',
    short: 'Systematischer Review, eClinicalMedicine 2026',
    full:
      'Trajectory of weight regain after cessation of GLP-1 receptor agonists: a systematic review and nonlinear meta-regression. eClinicalMedicine. 2026.',
    url: 'https://www.thelancet.com/journals/eclinm/article/PIIS2589-5370(26)00043-X/fulltext',
    note: 'Aktuellste Zusammenfassung der Verlaufskurve nach dem Absetzen von GLP-1-Rezeptoragonisten.',
  },
  jensen2024: {
    id: 'jensen2024',
    short: 'Jensen et al., S-LiTE Nachbeobachtung, eClinicalMedicine 2024',
    full:
      'Jensen SBK, Blond MB, Sandsdal RM, et al. Healthy weight loss maintenance with exercise, GLP-1 receptor agonist, or both combined followed by one year without treatment: a post-treatment analysis of a randomised placebo-controlled trial. eClinicalMedicine. 2024;69:102475.',
    url: 'https://www.thelancet.com/journals/eclinm/article/PIIS2589-5370(24)00054-3/fulltext',
    note: 'Ein Jahr nach Therapieende: Wer trainiert hatte, hielt Gewicht und Körperzusammensetzung; nach Liraglutid allein kam das Gewicht zurück (6,0 kg mehr Zunahme als nach Training).',
  },
  lundgren2021: {
    id: 'lundgren2021',
    short: 'Lundgren et al., S-LiTE, NEJM 2021',
    full:
      'Lundgren JR, Janus C, Jensen SBK, et al. Healthy Weight Loss Maintenance with Exercise, Liraglutide, or Both Combined. N Engl J Med. 2021;384(18):1719–1730.',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2028198',
  },
  sardeli2018: {
    id: 'sardeli2018',
    short: 'Sardeli et al., Meta-Analyse, Nutrients 2018',
    full:
      'Sardeli AV, Komatsu TR, Mori MA, Gáspari AF, Chacon-Mikahil MPT. Resistance Training Prevents Muscle Loss Induced by Caloric Restriction in Obese Elderly Individuals: A Systematic Review and Meta-Analysis. Nutrients. 2018;10(4):423.',
    url: 'https://www.mdpi.com/2072-6643/10/4/423',
    note: 'Krafttraining während einer Kalorienreduktion verhinderte den Verlust an fettfreier Masse weitgehend.',
  },
  leidy2015: {
    id: 'leidy2015',
    short: 'Leidy et al., Am J Clin Nutr 2015',
    full:
      'Leidy HJ, Clifton PM, Astrup A, et al. The role of protein in weight loss and maintenance. Am J Clin Nutr. 2015;101(6):1320S–1329S.',
    url: 'https://doi.org/10.3945/ajcn.114.084038',
    note: 'Empfiehlt für Gewichtsabnahme und -erhalt eine Proteinzufuhr von 1,2–1,6 g pro kg Körpergewicht und Tag.',
  },
  dgeProtein: {
    id: 'dgeProtein',
    short: 'DGE, Referenzwerte Protein',
    full: 'Deutsche Gesellschaft für Ernährung e. V. Referenzwerte für die Nährstoffzufuhr: Protein. Bonn.',
    url: 'https://www.dge.de/wissenschaft/referenzwerte/protein/',
    note: 'Erwachsene 0,8 g/kg/Tag, ab 65 Jahren 1,0 g/kg/Tag (Schätzwert).',
  },
  dgeBallaststoffe: {
    id: 'dgeBallaststoffe',
    short: 'DGE, Richtwert Ballaststoffe',
    full: 'Deutsche Gesellschaft für Ernährung e. V. Referenzwerte für die Nährstoffzufuhr: Ballaststoffe. Bonn.',
    url: 'https://www.dge.de/wissenschaft/referenzwerte/ballaststoffe/',
    note: 'Richtwert mindestens 30 g pro Tag für Erwachsene.',
  },
  euClaims: {
    id: 'euClaims',
    short: 'EU-Register zugelassener Health Claims (VO (EU) Nr. 432/2012, VO (EU) 2017/672)',
    full:
      'Verordnung (EU) Nr. 432/2012 der Kommission zur Festlegung einer Liste zulässiger anderer gesundheitsbezogener Angaben über Lebensmittel; ergänzt u. a. durch Verordnung (EU) 2017/672 (Kreatin und Krafttraining ab 55 Jahren).',
    url: 'https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32012R0432',
    note: 'Grundlage aller gesundheitsbezogenen Aussagen zum Set, siehe CLAIMS.md.',
  },
  kreider2017: {
    id: 'kreider2017',
    short: 'Kreider et al., ISSN Position Stand Kreatin, 2017',
    full:
      'Kreider RB, Kalman DS, Antonio J, et al. International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine. J Int Soc Sports Nutr. 2017;14:18.',
    url: 'https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z',
    note: 'Kreatin-Monohydrat gilt bei gesunden Erwachsenen in üblichen Dosen (3–5 g/Tag) als sicher und gut untersucht.',
  },
  who2020: {
    id: 'who2020',
    short: 'WHO-Bewegungsempfehlungen 2020',
    full:
      'World Health Organization. WHO guidelines on physical activity and sedentary behaviour. Genf: WHO; 2020.',
    url: 'https://www.who.int/publications/i/item/9789240015128',
    note: 'Erwachsene: an mindestens zwei Tagen pro Woche muskelkräftigende Aktivitäten für alle großen Muskelgruppen.',
  },
  sumithran2011: {
    id: 'sumithran2011',
    short: 'Sumithran et al., NEJM 2011',
    full:
      'Sumithran P, Prendergast LA, Delbridge E, et al. Long-Term Persistence of Hormonal Adaptations to Weight Loss. N Engl J Med. 2011;365:1597–1604.',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1105816',
    note: 'Ein Jahr nach einer Diät waren appetitsteigernde Hormonveränderungen (u. a. mehr Ghrelin, weniger Leptin) weiterhin messbar.',
  },
  fothergill2016: {
    id: 'fothergill2016',
    short: 'Fothergill et al., Obesity 2016',
    full:
      'Fothergill E, Guo J, Howard L, et al. Persistent metabolic adaptation 6 years after "The Biggest Loser" competition. Obesity. 2016;24(8):1612–1619.',
    url: 'https://onlinelibrary.wiley.com/doi/10.1002/oby.21538',
    note: 'Der Ruheenergieverbrauch blieb sechs Jahre nach starkem Gewichtsverlust deutlich abgesenkt.',
  },
  dagLeitlinie: {
    id: 'dagLeitlinie',
    short: 'S3-Leitlinie Adipositas (DAG) 2024',
    full:
      'Deutsche Adipositas-Gesellschaft e. V. et al. S3-Leitlinie Prävention und Therapie der Adipositas, Version 5.0, 2024. AWMF-Register Nr. 050-001.',
    url: 'https://register.awmf.org/de/leitlinien/detail/050-001',
    note: 'Empfiehlt Ernährungs-, Bewegungs- und Verhaltenstherapie als Basis; Medikamente als Ergänzung.',
  },
  wilding2021step1: {
    id: 'wilding2021step1',
    short: 'Wilding et al., STEP 1, NEJM 2021',
    full:
      'Wilding JPH, Batterham RL, Calanna S, et al. Once-Weekly Semaglutide in Adults with Overweight or Obesity. N Engl J Med. 2021;384(11):989–1002.',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2032183',
    note: 'Zulassungsstudie Semaglutid 2,4 mg: −14,9 % Körpergewicht nach 68 Wochen gegenüber −2,4 % unter Placebo.',
  },
  davies2021step2: {
    id: 'davies2021step2',
    short: 'Davies et al., STEP 2, Lancet 2021',
    full:
      'Davies M, Færch L, Jeppesen OK, et al. Semaglutide 2·4 mg once a week in adults with overweight or obesity, and type 2 diabetes (STEP 2): a randomised, double-blind, double-dummy, placebo-controlled, phase 3 trial. Lancet. 2021;397(10278):971–984.',
    url: 'https://doi.org/10.1016/S0140-6736(21)00213-0',
    note: 'Bei Typ-2-Diabetes: −9,6 % unter 2,4 mg, −7,0 % unter 1,0 mg (Ozempic-Dosis), −3,4 % unter Placebo nach 68 Wochen.',
  },
  jastreboff2022: {
    id: 'jastreboff2022',
    short: 'Jastreboff et al., SURMOUNT-1, NEJM 2022',
    full:
      'Jastreboff AM, Aronne LJ, Ahmad NN, et al. Tirzepatide Once Weekly for the Treatment of Obesity. N Engl J Med. 2022;387(3):205–216.',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2206038',
    note: 'Zulassungsstudie Tirzepatid: −15,0 % (5 mg), −19,5 % (10 mg), −20,9 % (15 mg) gegenüber −3,1 % unter Placebo nach 72 Wochen.',
  },
  aronne2025surmount5: {
    id: 'aronne2025surmount5',
    short: 'Aronne et al., SURMOUNT-5, NEJM 2025',
    full:
      'Aronne LJ, Horn DB, le Roux CW, et al. Tirzepatide as Compared with Semaglutide for the Treatment of Obesity. N Engl J Med. 2025;393(1):26–36.',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2416394',
    note: 'Direkter Vergleich über 72 Wochen: −20,2 % unter Tirzepatid, −13,7 % unter Semaglutid 2,4 mg.',
  },
  fachinfoWegovy: {
    id: 'fachinfoWegovy',
    short: 'Fachinformation Wegovy (EMA-Produktinformation)',
    full: 'Europäische Arzneimittel-Agentur. Wegovy (Semaglutid): Zusammenfassung der Merkmale des Arzneimittels. Amsterdam: EMA.',
    url: 'https://www.ema.europa.eu/en/medicines/human/EPAR/wegovy',
    note: 'Dosisstufen 0,25 / 0,5 / 1 / 1,7 / 2,4 mg je vier Wochen; Halbwertszeit etwa eine Woche; bei geplanter Schwangerschaft mindestens zwei Monate vorher absetzen.',
  },
  fachinfoOzempic: {
    id: 'fachinfoOzempic',
    short: 'Fachinformation Ozempic (EMA-Produktinformation)',
    full: 'Europäische Arzneimittel-Agentur. Ozempic (Semaglutid): Zusammenfassung der Merkmale des Arzneimittels. Amsterdam: EMA.',
    url: 'https://www.ema.europa.eu/en/medicines/human/EPAR/ozempic',
    note: 'Zugelassen zur Behandlung des Typ-2-Diabetes; Dosisstufen 0,25 / 0,5 / 1 / 2 mg; Halbwertszeit etwa eine Woche.',
  },
  fachinfoMounjaro: {
    id: 'fachinfoMounjaro',
    short: 'Fachinformation Mounjaro (EMA-Produktinformation)',
    full: 'Europäische Arzneimittel-Agentur. Mounjaro (Tirzepatid): Zusammenfassung der Merkmale des Arzneimittels. Amsterdam: EMA.',
    url: 'https://www.ema.europa.eu/en/medicines/human/EPAR/mounjaro',
    note: 'Dosisstufen 2,5 bis 15 mg in Schritten von 2,5 mg je vier Wochen; Halbwertszeit etwa fünf Tage.',
  },
  apothekerzeitung2026: {
    id: 'apothekerzeitung2026',
    short: 'Apothekerzeitung 2/2026: Protein und Kreatin',
    full: 'Apothekerzeitung, Ausgabe 2/2026: Beitrag zu Protein und Kreatin bei GLP-1-Therapie. [Link und genaue Fundstelle ergänzen]',
    note: 'Fundstelle aus dem Projektplan; vor Launch verifizieren und verlinken.',
  },
};

export function getSources(ids: readonly string[]): Source[] {
  return ids.map((id) => {
    const s = sources[id];
    if (!s) throw new Error(`Unbekannte Quelle: ${id}`);
    return s;
  });
}
