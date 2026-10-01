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
    note: 'Grundlage aller gesundheitsbezogenen Aussagen zum Set.',
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
  almandoz2024: {
    id: 'almandoz2024',
    short: 'Almandoz et al., Obesity 2024',
    full:
      'Almandoz JP, Wadden TA, Tewksbury C, et al. Nutritional considerations with antiobesity medications. Obesity (Silver Spring). 2024;32(9):1613–1631.',
    url: 'https://doi.org/10.1002/oby.24067',
    note: 'Expertenempfehlungen zu Ernährung unter Adipositas-Medikamenten: Protein, Ballaststoffe, Flüssigkeit, Mikronährstoffe bei sehr geringer Energiezufuhr.',
  },
  dgeEmpfehlungen: {
    id: 'dgeEmpfehlungen',
    short: 'DGE-Empfehlungen „Gut essen und trinken“',
    full: 'Deutsche Gesellschaft für Ernährung e. V. Gut essen und trinken – die DGE-Empfehlungen. Bonn, 2024.',
    url: 'https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/',
    note: 'Obst und Gemüse, Vollkorn, Hülsenfrüchte, wenig Zucker und Alkohol, Wasser als Getränk.',
  },
  klartextNem: {
    id: 'klartextNem',
    short: 'Verbraucherzentrale, Klartext Nahrungsergänzung',
    full: 'Verbraucherzentralen. Klartext Nahrungsergänzung: unabhängige Informationen zu Nahrungsergänzungsmitteln.',
    url: 'https://www.klartext-nahrungsergaenzung.de/',
    note: 'Nahrungsergänzungsmittel sind Lebensmittel, werden nicht auf Wirksamkeit geprüft und sind bei ausgewogener Ernährung meist unnötig.',
  },
  adaSoc2024: {
    id: 'adaSoc2024',
    short: 'ADA Standards of Care 2024',
    full: 'American Diabetes Association Professional Practice Committee. Standards of Care in Diabetes—2024. Diabetes Care. 2024;47(Suppl 1).',
    url: 'https://diabetesjournals.org/care/issue/47/Supplement_1',
    note: 'Empfiehlt bei Metformin-Therapie regelmäßige Kontrolle des Vitamin-B12-Spiegels.',
  },
  acsm2009: {
    id: 'acsm2009',
    short: 'ACSM Position Stand Krafttraining, 2009',
    full:
      'American College of Sports Medicine. Progression Models in Resistance Training for Healthy Adults (Position Stand). Med Sci Sports Exerc. 2009;41(3):687–708.',
    url: 'https://doi.org/10.1249/MSS.0b013e3181915670',
    note: 'Einsteiger: 8–12 Wiederholungen, 1–3 Sätze, 2–3 Einheiten pro Woche, Belastung schrittweise steigern.',
  },
  schoenfeld2016: {
    id: 'schoenfeld2016',
    short: 'Schoenfeld et al., Meta-Analyse Trainingsfrequenz, Sports Med 2016',
    full:
      'Schoenfeld BJ, Ogborn D, Krieger JW. Effects of Resistance Training Frequency on Measures of Muscle Hypertrophy: A Systematic Review and Meta-Analysis. Sports Med. 2016;46(11):1689–1697.',
    url: 'https://doi.org/10.1007/s40279-016-0543-8',
    note: 'Zwei Einheiten pro Muskelgruppe und Woche bringen mehr Muskelzuwachs als eine.',
  },
  spiegel2004: {
    id: 'spiegel2004',
    short: 'Spiegel et al., Ann Intern Med 2004',
    full:
      'Spiegel K, Tasali E, Penev P, Van Cauter E. Brief Communication: Sleep Curtailment in Healthy Young Men Is Associated with Decreased Leptin Levels, Elevated Ghrelin Levels, and Increased Hunger and Appetite. Ann Intern Med. 2004;141(11):846–850.',
    url: 'https://doi.org/10.7326/0003-4819-141-11-200412070-00008',
    note: 'Zwei Nächte mit vier Stunden Schlaf: Leptin sank, Ghrelin stieg, Hunger und Appetit nahmen zu.',
  },
  fachinfoSaxenda: {
    id: 'fachinfoSaxenda',
    short: 'Fachinformation Saxenda (EMA-Produktinformation)',
    full: 'Europäische Arzneimittel-Agentur. Saxenda (Liraglutid): Zusammenfassung der Merkmale des Arzneimittels. Amsterdam: EMA.',
    url: 'https://www.ema.europa.eu/en/medicines/human/EPAR/saxenda',
    note: 'Tägliche Injektion, Dosisstufen 0,6 bis 3,0 mg; Halbwertszeit etwa 13 Stunden; zugelassen ab 12 Jahren.',
  },
  pisunyer2015: {
    id: 'pisunyer2015',
    short: 'Pi-Sunyer et al., SCALE, NEJM 2015',
    full:
      'Pi-Sunyer X, Astrup A, Fujioka K, et al. A Randomized, Controlled Trial of 3.0 mg of Liraglutide in Weight Management. N Engl J Med. 2015;373(1):11–22.',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1411892',
    note: 'Zulassungsstudie Liraglutid 3 mg: −8,0 % Körpergewicht nach 56 Wochen gegenüber −2,6 % unter Placebo.',
  },
  fachinfoWegovy: {
    id: 'fachinfoWegovy',
    short: 'Fachinformation Wegovy (EMA-Produktinformation)',
    full: 'Europäische Arzneimittel-Agentur. Wegovy (Semaglutid): Zusammenfassung der Merkmale des Arzneimittels. Amsterdam: EMA.',
    url: 'https://www.ema.europa.eu/en/medicines/human/EPAR/wegovy',
    note: 'Fünf Dosisstufen von 0,25 bis 2,4 mg; Halbwertszeit etwa eine Woche; bei geplanter Schwangerschaft mindestens zwei Monate vorher absetzen.',
  },
  fachinfoOzempic: {
    id: 'fachinfoOzempic',
    short: 'Fachinformation Ozempic (EMA-Produktinformation)',
    full: 'Europäische Arzneimittel-Agentur. Ozempic (Semaglutid): Zusammenfassung der Merkmale des Arzneimittels. Amsterdam: EMA.',
    url: 'https://www.ema.europa.eu/en/medicines/human/EPAR/ozempic',
    note: 'Zugelassen zur Behandlung des Typ-2-Diabetes; vier Dosisstufen von 0,25 bis 2 mg; Halbwertszeit etwa eine Woche.',
  },
  fachinfoMounjaro: {
    id: 'fachinfoMounjaro',
    short: 'Fachinformation Mounjaro (EMA-Produktinformation)',
    full: 'Europäische Arzneimittel-Agentur. Mounjaro (Tirzepatid): Zusammenfassung der Merkmale des Arzneimittels. Amsterdam: EMA.',
    url: 'https://www.ema.europa.eu/en/medicines/human/EPAR/mounjaro',
    note: 'Sechs Dosisstufen von 2,5 bis 15 mg; Halbwertszeit etwa fünf Tage.',
  },
  // --- Glossar (Körperzusammensetzung, Regulation, Messung)
  donini2022: {
    id: 'donini2022',
    short: 'Donini et al., ESPEN/EASO-Konsens sarkopene Adipositas, Obes Facts 2022',
    full:
      'Donini LM, Busetto L, Bischoff SC, et al. Definition and Diagnostic Criteria for Sarcopenic Obesity: ESPEN and EASO Consensus Statement. Obes Facts. 2022;15(3):321–335.',
    url: 'https://doi.org/10.1159/000521241',
    note: 'Europäische Definition: Screening über BMI oder Taillenumfang plus Verdacht, Diagnose über Muskelfunktion (z. B. Griffkraft) und Körperzusammensetzung.',
  },
  moore2015: {
    id: 'moore2015',
    short: 'Moore et al., J Gerontol A 2015',
    full:
      'Moore DR, Churchward-Venne TA, Witard O, et al. Protein Ingestion to Stimulate Myofibrillar Protein Synthesis Requires Greater Relative Protein Intakes in Healthy Older Versus Younger Men. J Gerontol A Biol Sci Med Sci. 2015;70(1):57–62.',
    url: 'https://doi.org/10.1093/gerona/glu103',
    note: 'Pro Mahlzeit etwa 0,24 g Protein pro kg Körpergewicht bei jüngeren und 0,40 g/kg bei älteren Männern, um die Muskelproteinsynthese maximal anzuregen.',
  },
  mamerow2014: {
    id: 'mamerow2014',
    short: 'Mamerow et al., J Nutr 2014',
    full:
      'Mamerow MM, Mettler JA, English KL, et al. Dietary Protein Distribution Positively Influences 24-h Muscle Protein Synthesis in Healthy Adults. J Nutr. 2014;144(6):876–880.',
    url: 'https://doi.org/10.3945/jn.113.185280',
    note: 'Gleichmäßige Verteilung (etwa 30 g pro Mahlzeit) erhöhte die 24-Stunden-Muskelproteinsynthese um rund 25 % gegenüber einer abendlastigen Verteilung.',
  },
  lowe2007: {
    id: 'lowe2007',
    short: 'Lowe & Butryn, Physiol Behav 2007',
    full: 'Lowe MR, Butryn ML. Hedonic hunger: a new dimension of appetite? Physiol Behav. 2007;91(4):432–439.',
    url: 'https://doi.org/10.1016/j.physbeh.2007.04.006',
    note: 'Führt den Begriff des hedonischen Hungers ein: Essverlangen aus Belohnung, unabhängig vom Energiebedarf.',
  },
  levine2002: {
    id: 'levine2002',
    short: 'Levine, Best Pract Res Clin Endocrinol Metab 2002',
    full: 'Levine JA. Non-exercise activity thermogenesis (NEAT). Best Pract Res Clin Endocrinol Metab. 2002;16(4):679–702.',
    url: 'https://doi.org/10.1053/beem.2002.0227',
    note: 'Der Energieverbrauch durch Alltagsbewegung kann zwischen Menschen um bis zu 2.000 kcal pro Tag schwanken.',
  },
  kyle2004: {
    id: 'kyle2004',
    short: 'Kyle et al., ESPEN-Leitlinie Bioimpedanz, Clin Nutr 2004',
    full:
      'Kyle UG, Bosaeus I, De Lorenzo AD, et al. Bioelectrical impedance analysis—part I: review of principles and methods. Clin Nutr. 2004;23(5):1226–1243.',
    url: 'https://doi.org/10.1016/j.clnu.2004.06.004',
    note: 'Grundlagen der Bioimpedanzanalyse; Genauigkeit hängt von Hydratation und standardisierten Messbedingungen ab.',
  },
  leong2015: {
    id: 'leong2015',
    short: 'Leong et al., PURE, Lancet 2015',
    full:
      'Leong DP, Teo KK, Rangarajan S, et al. Prognostic value of grip strength: findings from the Prospective Urban Rural Epidemiology (PURE) study. Lancet. 2015;386(9990):266–273.',
    url: 'https://doi.org/10.1016/S0140-6736(14)62000-6',
    note: 'Je 5 kg weniger Griffkraft war die Gesamtsterblichkeit um 16 % höher (rund 140.000 Teilnehmende in 17 Ländern).',
  },
  rosenbaum2010: {
    id: 'rosenbaum2010',
    short: 'Rosenbaum & Leibel, Int J Obes 2010',
    full: 'Rosenbaum M, Leibel RL. Adaptive thermogenesis in humans. Int J Obes (Lond). 2010;34(Suppl 1):S47–S55.',
    url: 'https://doi.org/10.1038/ijo.2010.184',
    note: 'Nach einem Gewichtsverlust von 10 % liegt der Energieverbrauch um etwa 300 bis 400 kcal pro Tag unter dem für das neue Gewicht erwarteten Wert.',
  },
  malkud2015: {
    id: 'malkud2015',
    short: 'Malkud, J Clin Diagn Res 2015',
    full: 'Malkud S. Telogen Effluvium: A Review. J Clin Diagn Res. 2015;9(9):WE01–WE03.',
    url: 'https://doi.org/10.7860/JCDR/2015/15219.6492',
    note: 'Übersicht: diffuser Haarausfall etwa zwei bis drei Monate nach einem Auslöser (u. a. schneller Gewichtsverlust), meist selbstlimitierend.',
  },
  burd2013: {
    id: 'burd2013',
    short: 'Burd et al., Exerc Sport Sci Rev 2013',
    full: 'Burd NA, Gorissen SH, van Loon LJ. Anabolic resistance of muscle protein synthesis with aging. Exerc Sport Sci Rev. 2013;41(3):169–173.',
    url: 'https://doi.org/10.1097/JES.0b013e318292f3d5',
    note: 'Ältere Muskeln reagieren schwächer auf Protein; Inaktivität verstärkt den Effekt, Training macht den Muskel wieder empfänglicher.',
  },
  cruzjentoft2019: {
    id: 'cruzjentoft2019',
    short: 'Cruz-Jentoft et al., EWGSOP2, Age Ageing 2019',
    full: 'Cruz-Jentoft AJ, Bahat G, Bauer J, et al. Sarcopenia: revised European consensus on definition and diagnosis. Age Ageing. 2019;48(1):16–31.',
    url: 'https://doi.org/10.1093/ageing/afy169',
    note: 'Europäische Definition der Sarkopenie: geringe Muskelkraft als Leitkriterium (Griffkraft unter 27 kg bei Männern, unter 16 kg bei Frauen), Bestätigung über Muskelmasse, Schweregrad über Gehgeschwindigkeit.',
  },
  mifflin1990: {
    id: 'mifflin1990',
    short: 'Mifflin et al., Am J Clin Nutr 1990',
    full: 'Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241–247.',
    url: 'https://doi.org/10.1093/ajcn/51.2.241',
    note: 'Schätzformel für den Ruheenergieverbrauch aus Gewicht, Größe, Alter und Geschlecht (Mifflin-St-Jeor-Formel).',
  },
  holst2007: {
    id: 'holst2007',
    short: 'Holst, Physiol Rev 2007',
    full: 'Holst JJ. The physiology of glucagon-like peptide 1. Physiol Rev. 2007;87(4):1409–1439.',
    url: 'https://doi.org/10.1152/physrev.00034.2006',
    note: 'Physiologie des Darmhormons GLP-1: Ausschüttung nach Mahlzeiten, Wirkung auf Insulin, Magenentleerung und Appetit, Halbwertszeit im Bereich von Minuten.',
  },
  fernandezelias2015: {
    id: 'fernandezelias2015',
    short: 'Fernández-Elías et al., Eur J Appl Physiol 2015',
    full: 'Fernández-Elías VE, Ortega JF, Nelson RK, Mora-Rodriguez R. Relationship between muscle water and glycogen recovery after prolonged exercise in the heat in humans. Eur J Appl Physiol. 2015;115(9):1919–1926.',
    url: 'https://doi.org/10.1007/s00421-015-3175-z',
    note: 'Pro Gramm gespeichertem Glykogen bindet der Muskel etwa drei Gramm Wasser.',
  },
  who2008waist: {
    id: 'who2008waist',
    short: 'WHO, Taillenumfang, Expertenkonsultation 2008',
    full: 'World Health Organization. Waist circumference and waist–hip ratio: report of a WHO expert consultation, Geneva, 8–11 December 2008. Genf: WHO; 2011.',
    url: 'https://www.who.int/publications/i/item/9789241501491',
    note: 'Grenzwerte für erhöhtes Risiko: Taillenumfang ab 94 cm (Männer) bzw. 80 cm (Frauen), deutlich erhöht ab 102 bzw. 88 cm; Messung in der Mitte zwischen unterem Rippenbogen und Beckenkamm.',
  },
  speakman2011: {
    id: 'speakman2011',
    short: 'Speakman et al., Dis Model Mech 2011',
    full:
      'Speakman JR, Levitsky DA, Allison DB, et al. Set points, settling points and some alternative models: theoretical options to understand how genes and environments combine to regulate body adiposity. Dis Model Mech. 2011;4(6):733–745.',
    url: 'https://doi.org/10.1242/dmm.008698',
    note: 'Übersicht der Modelle zur Gewichtsregulation: Set Point, Settling Point und Mischmodelle.',
  },
  wharton2025oasis4: {
    id: 'wharton2025oasis4',
    short: 'OASIS 4, N Engl J Med 2025',
    full: 'Oral Semaglutide at a Dose of 25 mg in Adults with Overweight or Obesity (OASIS 4). N Engl J Med. 2025;393(11):1077–1087.',
    url: 'https://doi.org/10.1056/NEJMoa2500969',
    note: 'Zulassungsstudie der Semaglutid-Tablette 25 mg: 307 Teilnehmende ohne Diabetes; nach 64 Wochen −13,6 % gegenüber −2,2 % unter Placebo, bei durchgehender Einnahme −16,6 %. Gewichtsdaten nach dem Ende der Einnahme berichtet die Studie nicht.',
  },
  knop2023oasis1: {
    id: 'knop2023oasis1',
    short: 'Knop et al., OASIS 1, Lancet 2023',
    full: 'Knop FK, Aroda VR, do Vale RD, et al. Oral semaglutide 50 mg taken once per day in adults with overweight or obesity (OASIS 1): a randomised, double-blind, placebo-controlled, phase 3 trial. Lancet. 2023;402(10403):705–719.',
    url: 'https://doi.org/10.1016/S0140-6736(23)01185-6',
    note: 'Semaglutid-Tablette 50 mg: nach 68 Wochen −15,1 % gegenüber −2,4 % unter Placebo. Die 50-mg-Tablette kam nicht auf den Markt; zugelassen wurde die 25-mg-Tablette (OASIS 4).',
  },
  wharton2025attain1: {
    id: 'wharton2025attain1',
    short: 'ATTAIN-1, N Engl J Med 2025',
    full: 'Orforglipron, an Oral Small-Molecule GLP-1 Receptor Agonist for Obesity Treatment (ATTAIN-1). N Engl J Med. 2025;393(18):1796–1806.',
    url: 'https://doi.org/10.1056/NEJMoa2511774',
    note: 'Orforglipron (Eli Lilly), 3.127 Teilnehmende ohne Diabetes: nach 72 Wochen −12,4 % unter 36 mg (Wirksamkeitsschätzer) gegenüber Placebo. In der EU nicht zugelassen (Stand September 2026).',
  },
  fachinfoRybelsus: {
    id: 'fachinfoRybelsus',
    short: 'Fachinformation Rybelsus (EMA-Produktinformation)',
    full: 'Europäische Arzneimittel-Agentur. Rybelsus (Semaglutid, Tabletten): Zusammenfassung der Merkmale des Arzneimittels. Amsterdam: EMA.',
    url: 'https://www.ema.europa.eu/en/medicines/human/EPAR/rybelsus',
    note: 'Semaglutid-Tablette für Typ-2-Diabetes, EU-Zulassung 2020. Einnahme einmal täglich nüchtern; nur ein kleiner Teil des Wirkstoffs wird aufgenommen; Eliminationshalbwertszeit etwa eine Woche, wie bei der Injektion.',
  },
  ecWegovyTablette2026: {
    id: 'ecWegovyTablette2026',
    short: 'Novo Nordisk: EU-Zulassung der Wegovy-Tablette, Juli 2026',
    full: 'Novo Nordisk. Novo Nordisk receives European Commission approval of Wegovy pill as first oral GLP-1 for weight management in the EU. Pressemitteilung, 15. Juli 2026.',
    url: 'https://www.biospace.com/press-releases/novo-nordisk-receives-european-commission-approval-of-wegovy-pill-as-first-oral-glp-1-for-weight-management-in-the-eu-single-ready-to-use-pen-for-higher-dose-7-2-mg-also-approved',
    note: 'Herstellermitteilung zur Zulassung der Semaglutid-Tablette 25 mg (einmal täglich) nach positiver CHMP-Empfehlung im Mai 2026. Für Studienzahlen gilt die Originalpublikation (OASIS 4).',
  },
  tabletteApotheken2026: {
    id: 'tabletteApotheken2026',
    short: 'Euronews: Wegovy-Tablette in deutschen Apotheken, September 2026',
    full: 'Euronews Health. Weight-loss pill Wegovy available in German pharmacies from 1 September. 2. September 2026.',
    url: 'https://www.euronews.com/health/2026/09/02/weight-loss-pill-wegovy-available-in-german-pharmacies-from-1-september',
    note: 'Marktstart in Deutschland am 1. September 2026, verschreibungspflichtig, für Selbstzahler. Preise zum Marktstart nur als Größenordnung; aktueller Stand im Marktradar.',
  },
  fdaOrforglipron2026: {
    id: 'fdaOrforglipron2026',
    short: 'Eli Lilly: FDA-Zulassung von Orforglipron (Foundayo), April 2026',
    full: 'Eli Lilly and Company. FDA approves Lilly’s Foundayo (orforglipron). Pressemitteilung, April 2026.',
    url: 'https://investor.lilly.com/news-releases/news-release-details/fda-approves-lillys-foundayotm-orforglipron-only-glp-1-pill',
    note: 'US-Zulassung für Erwachsene mit Adipositas oder Übergewicht mit Begleiterkrankung; tägliche Tablette ohne Nüchternregel. Keine EU-Zulassung (Stand September 2026).',
  },
  dgeReferenzwerte: {
    id: 'dgeReferenzwerte',
    short: 'DGE-Referenzwerte für die Nährstoffzufuhr',
    full: 'Deutsche Gesellschaft für Ernährung e. V. Referenzwerte für die Nährstoffzufuhr (D-A-CH). Bonn, laufend aktualisiert.',
    url: 'https://www.dge.de/wissenschaft/referenzwerte/',
    note: 'Verwendete Werte für Erwachsene: Magnesium 300 mg (Frauen) bzw. 350 mg (Männer); Vitamin D 20 µg bei fehlender Eigensynthese; Vitamin B12 4 µg; Vitamin C 95 mg (Frauen) bzw. 110 mg (Männer); Zink 7 bis 10 mg (Frauen) bzw. 11 bis 16 mg (Männer) je nach Phytatzufuhr; Biotin 40 µg (Schätzwert). Eisen: Frauen vor den Wechseljahren brauchen deutlich mehr als Männer; Werte je Alter und Geschlecht auf der DGE-Seite.',
  },
  nvs2: {
    id: 'nvs2',
    short: 'Nationale Verzehrsstudie II (MRI 2008)',
    full: 'Max Rubner-Institut. Nationale Verzehrsstudie II. Ergebnisbericht, Teil 2: Die bundesweite Befragung zur Ernährung von Jugendlichen und Erwachsenen. Karlsruhe, 2008.',
    url: 'https://www.mri.bund.de/fileadmin/MRI/Institute/EV/NVSII_Abschlussbericht_Teil_2.pdf',
    note: 'Zufuhr unter der Empfehlung bei Magnesium: 26 % der Männer und 29 % der Frauen; bei Eisen: 14 % der Männer und 58 % der Frauen. Daten aus der Zeit vor GLP-1-Medikamenten.',
  },
  bls: {
    id: 'bls',
    short: 'Bundeslebensmittelschlüssel (BLS)',
    full: 'Max Rubner-Institut. Bundeslebensmittelschlüssel (BLS), Version 3.02. Karlsruhe.',
    url: 'https://www.blsdb.de/',
    note: 'Nährstoffgehalte je 100 g; Portionsangaben in den Artikeln sind daraus gerundet und mit „etwa“ gekennzeichnet.',
  },
  bfrHoechstmengen2021: {
    id: 'bfrHoechstmengen2021',
    short: 'BfR: Höchstmengen für Vitamine und Mineralstoffe in Nahrungsergänzungsmitteln (2021)',
    full: 'Bundesinstitut für Risikobewertung. Aktualisierte Höchstmengenvorschläge für Vitamine und Mineralstoffe in Nahrungsergänzungsmitteln und angereicherten Lebensmitteln. Berlin, 2021.',
    url: 'https://www.bfr.bund.de/cm/343/hoechstmengenvorschlaege-fuer-vitamine-und-mineralstoffe-in-nahrungsergaenzungsmitteln.pdf',
    note: 'Vorgeschlagene Tageshöchstmengen in Nahrungsergänzungsmitteln u. a.: Vitamin D 20 µg, Magnesium 250 mg, Zink 6,5 mg, Eisen 6 mg, Vitamin B12 25 µg.',
  },
  garrison2020: {
    id: 'garrison2020',
    short: 'Garrison et al., Cochrane Review 2020',
    full: 'Garrison SR, Korownyk CS, Kolber MR, et al. Magnesium for skeletal muscle cramps. Cochrane Database Syst Rev. 2020;9:CD009402.',
    url: 'https://doi.org/10.1002/14651858.CD009402.pub3',
    note: 'Magnesium hilft gegen Muskelkrämpfe bei älteren Erwachsenen wahrscheinlich nicht; für Krämpfe in der Schwangerschaft ist die Lage unklar.',
  },
  rabenberg2015: {
    id: 'rabenberg2015',
    short: 'Rabenberg et al., DEGS1, BMC Public Health 2015',
    full: 'Rabenberg M, Scheidt-Nave C, Busch MA, et al. Vitamin D status among adults in Germany: results from the German Health Interview and Examination Survey for Adults (DEGS1). BMC Public Health. 2015;15:641.',
    url: 'https://doi.org/10.1186/s12889-015-2016-7',
    note: '30,2 % der Erwachsenen in Deutschland lagen unter 30 nmol/l (Mangel), 61,6 % unter 50 nmol/l; im Winter deutlich mehr als im Sommer.',
  },
  aroda2016: {
    id: 'aroda2016',
    short: 'Aroda et al., DPPOS, J Clin Endocrinol Metab 2016',
    full: 'Aroda VR, Edelstein SL, Goldberg RB, et al. Long-term Metformin Use and Vitamin B12 Deficiency in the Diabetes Prevention Program Outcomes Study. J Clin Endocrinol Metab. 2016;101(4):1754–1761.',
    url: 'https://doi.org/10.1210/jc.2015-3754',
    note: 'Nach fünf Jahren Metformin hatten 4,3 % einen Vitamin-B12-Mangel gegenüber 2,3 % unter Placebo; das Risiko steigt mit der Einnahmedauer.',
  },
  efsa2010fats: {
    id: 'efsa2010fats',
    short: 'EFSA, Referenzwerte für Fette, 2010',
    full: 'EFSA Panel on Dietetic Products, Nutrition and Allergies. Scientific Opinion on Dietary Reference Values for fats, including saturated fatty acids, polyunsaturated fatty acids, monounsaturated fatty acids, trans fatty acids, and cholesterol. EFSA Journal. 2010;8(3):1461.',
    url: 'https://doi.org/10.2903/j.efsa.2010.1461',
    note: 'Referenzwert für Erwachsene: 250 mg EPA plus DHA pro Tag.',
  },
  efsa2010glucomannan: {
    id: 'efsa2010glucomannan',
    short: 'EFSA, Glucomannan und Gewichtsverlust, 2010',
    full: 'EFSA Panel on Dietetic Products, Nutrition and Allergies. Scientific Opinion on the substantiation of health claims related to konjac mannan (glucomannan) and reduction of body weight, reduction of post-prandial glycaemic responses, maintenance of normal blood glucose concentrations, maintenance of normal (fasting) blood concentrations of triglycerides, maintenance of normal blood cholesterol concentrations, maintenance of normal bowel function and decreasing potentially pathogenic gastro-intestinal microorganisms pursuant to Article 13(1) of Regulation (EC) No 1924/2006. EFSA Journal. 2010;8(10):1798.',
    url: 'https://doi.org/10.2903/j.efsa.2010.1798',
    note: 'Bewertung, auf der die zugelassene Angabe beruht: Gewichtsverlust im Rahmen einer kalorienarmen Ernährung bei 3 g Glucomannan täglich in drei Portionen mit Wasser vor den Mahlzeiten.',
  },
  proksch2014: {
    id: 'proksch2014',
    short: 'Proksch et al., Skin Pharmacol Physiol 2014',
    full: 'Proksch E, Segger D, Degwert J, Schunck M, Zague V, Oesser S. Oral supplementation of specific collagen peptides has beneficial effects on human skin physiology: a double-blind, placebo-controlled study. Skin Pharmacol Physiol. 2014;27(1):47–55.',
    url: 'https://doi.org/10.1159/000351376',
    note: '69 Frauen zwischen 35 und 55 Jahren, 2,5 oder 5 g Kollagenpeptide täglich über acht Wochen; Hautelastizität nahm gegenüber Placebo zu. Kleine, herstellerfinanzierte Studie.',
  },
  medipreis2026: {
    id: 'medipreis2026',
    short: 'Preisvergleich medipreis.de, September 2026',
    full: 'medipreis.de. Preisvergleich für Wegovy, Mounjaro und Ozempic (niedrigster Versandpreis, gerundet). Abgerufen am 30. September 2026.',
    url: 'https://www.medipreis.de/',
    note: 'Größenordnung für Selbstzahler; Tagespreise schwanken. Laufend aktualisierter Stand mit Datum im Marktradar (/marktradar/#preise).',
  },
  wing2006: {
    id: 'wing2006',
    short: 'Wing et al., STOP Regain, NEJM 2006',
    full: 'Wing RR, Tate DF, Gorin AA, Raynor HA, Fava JL. A self-regulation program for maintenance of weight loss. N Engl J Med. 2006;355(15):1563–1571.',
    url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa061883',
    note: 'Randomisierte Studie, 314 Erwachsene nach mindestens 10 % Gewichtsverlust, 18 Monate: tägliches Wiegen mit Zonen (grün bis +1,4 kg, gelb bis +2,3 kg, rot ab +2,3 kg) und festgelegter Reaktion. 45,7 % der persönlich betreuten Gruppe nahmen 2,3 kg oder mehr wieder zu, 72,4 % der Kontrollgruppe.',
  },
  look2025surmount1dxa: {
    id: 'look2025surmount1dxa',
    short: 'Look et al., SURMOUNT-1 Körperzusammensetzung, Diabetes Obes Metab 2025',
    full: 'Look M, Dunn JP, Kushner RF, et al. Body composition changes during weight reduction with tirzepatide in the SURMOUNT-1 study of adults with obesity or overweight. Diabetes Obes Metab. 2025;27(5):2720–2729.',
    url: 'https://dom-pubs.onlinelibrary.wiley.com/doi/10.1111/dom.16275',
    note: 'DXA-Substudie mit 160 Teilnehmenden (124 Tirzepatid, 36 Placebo) über 72 Wochen: Körpergewicht −21,3 %, Fettmasse −33,9 %, fettfreie Masse −10,9 % unter Tirzepatid (Placebo −5,3 %, −8,2 %, −2,6 %); rund 75 % des verlorenen Gewichts waren Fett, rund 25 % fettfreie Masse, in beiden Gruppen.',
  },
};

export function getSources(ids: readonly string[]): Source[] {
  return ids.map((id) => {
    const s = sources[id];
    if (!s) throw new Error(`Unbekannte Quelle: ${id}`);
    return s;
  });
}
