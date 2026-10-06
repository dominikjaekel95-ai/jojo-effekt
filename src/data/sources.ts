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
    note: 'Versorgungsdaten von 125.474 Erwachsenen in den USA: Ein Jahr nach Therapiebeginn hatten 64,8 % der Menschen ohne Typ-2-Diabetes abgesetzt und 46,5 % der Menschen mit Typ-2-Diabetes (über alle Gruppen: 53,6 %).',
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
    note: 'Ein Jahr nach dem Absetzen waren im Mittel zwei Drittel des verlorenen Gewichts wieder da: nach 68 Wochen Semaglutid −17,3 % (Placebo −2,0 %), nach 120 Wochen −5,6 % (Placebo −0,1 %), also 11,6 Prozentpunkte zurück.',
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
    note: 'Ein Jahr nach Therapieende: Wer trainiert hatte, hielt Gewicht und Körperzusammensetzung; nach Liraglutid allein kam das Gewicht zurück (6,0 kg mehr Zunahme als nach Training allein, 95-%-KI 2,1 bis 10,0; 2,5 kg mehr als nach Training plus Liraglutid, −1,5 bis 6,5, nicht signifikant). Von Studienbeginn bis Woche 104 lag die Gruppe mit Training plus Liraglutid 5,1 kg (−10,0 bis −0,2) und beim Körperfettanteil 2,3 Prozentpunkte (−4,3 bis −0,3) unter Liraglutid allein.',
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
    note: 'Empfiehlt für Gewichtsabnahme und -erhalt eine Proteinzufuhr von 1,2–1,6 g pro kg Körpergewicht und Tag, mit mindestens etwa 25 bis 30 g pro Mahlzeit.',
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
    note: 'Grundlage aller gesundheitsbezogenen Aussagen zu Lebensmitteln und Nahrungsergänzung auf dieser Seite.',
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
    note: 'Bei Typ-2-Diabetes: −9,6 % unter 2,4 mg, −7,0 % unter 1,0 mg, −3,4 % unter Placebo nach 68 Wochen.',
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
    note: 'Zwei Nächte mit vier Stunden im Bett gegenüber zwei Nächten mit zehn Stunden, 12 gesunde junge Männer: Leptin −18 %, Ghrelin +28 %, Hunger +24 %, Appetit +23 %, Appetit auf kalorienreiche Lebensmittel mit viel Kohlenhydraten +33 bis 45 %.',
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
    note: 'Fünf Dosisstufen von 0,25 bis 2,4 mg; Halbwertszeit etwa eine Woche; nach der letzten Dosis von 2,4 mg etwa sieben Wochen im Blut nachweisbar; bei geplanter Schwangerschaft mindestens zwei Monate vorher absetzen.',
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
    note: 'Gleichmäßige Verteilung (etwa 30 g pro Mahlzeit) erhöhte die 24-Stunden-Muskelproteinsynthese um rund 25 % gegenüber einer abendlastigen Verteilung (etwa 10, 15 und 65 g).',
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
    note: 'Übersicht: diffuser Haarausfall etwa zwei bis drei Monate nach einem Auslöser (u. a. schneller Gewichtsverlust), meist selbstlimitierend; die akute Form klingt meist innerhalb von etwa sechs Monaten ab.',
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
  greendale2019: {
    id: 'greendale2019',
    short: 'Greendale et al., SWAN, JCI Insight 2019',
    full: 'Greendale GA, Sternfeld B, Huang M, et al. Changes in body composition and weight during the menopause transition. JCI Insight. 2019;4(5):e124865.',
    url: 'https://doi.org/10.1172/jci.insight.124865',
    note: 'SWAN-Kohorte, 1246 Frauen mit DXA-Messungen: Im Übergang verdoppelte sich der jährliche Fettzuwachs von 0,25 auf 0,45 kg, die fettfreie Masse sank um 0,2 % pro Jahr (vorher +0,2 %); beides lief bis etwa zwei Jahre nach der letzten Regelblutung weiter. Das Gewicht selbst stieg nicht schneller als vor dem Übergang.',
  },
  lovejoy2008: {
    id: 'lovejoy2008',
    short: 'Lovejoy et al., Int J Obes 2008',
    full: 'Lovejoy JC, Champagne CM, de Jonge L, Xie H, Smith SR. Increased visceral fat and decreased energy expenditure during the menopausal transition. Int J Obes (Lond). 2008;32(6):949–958.',
    url: 'https://doi.org/10.1038/ijo.2008.25',
    note: 'Längsschnittstudie über vier Jahre mit 156 anfangs prämenopausalen Frauen: Nur die Frauen, die postmenopausal wurden, legten signifikant an viszeralem Fett zu; ihr Energieumsatz im Schlaf sank um 7,9 % (prämenopausal geblieben: 5,3 %), die Fettoxidation um 32 %. Die körperliche Aktivität nahm schon zwei Jahre vor der Menopause ab.',
  },
  davis2012: {
    id: 'davis2012',
    short: 'Davis et al., International Menopause Society, Climacteric 2012',
    full: 'Davis SR, Castelo-Branco C, Chedraui P, et al.; Writing Group of the International Menopause Society for World Menopause Day 2012. Understanding weight gain at menopause. Climacteric. 2012;15(5):419–429.',
    url: 'https://doi.org/10.3109/13697137.2012.707385',
    note: 'Übersicht der International Menopause Society: Die Gewichtszunahme in der Lebensmitte ist nicht der Menopause selbst zuzuschreiben; die hormonelle Umstellung geht aber mit mehr Gesamt- und Bauchfett einher. Die Bewertung von Hormontherapien in der Übersicht wird auf dieser Seite nicht übernommen.',
  },
  tchang2025: {
    id: 'tchang2025',
    short: 'Tchang et al., SURMOUNT post hoc, Obesity 2025',
    full: 'Tchang BG, et al. Body weight reduction in women treated with tirzepatide by reproductive stage: a post hoc analysis from the SURMOUNT program. Obesity (Silver Spring). 2025;33(5):851–860.',
    url: 'https://doi.org/10.1002/oby.24254',
    note: 'Nachträgliche Auswertung von 2542 Frauen aus SURMOUNT-1, -3 und -4: Die Gewichtsabnahme unter Tirzepatid war vor, während und nach den Wechseljahren ähnlich groß (SURMOUNT-1, Woche 72: 26 %, 23 %, 23 % gegenüber 2 bis 3 % unter Placebo).',
  },
  yang2025: {
    id: 'yang2025',
    short: 'Yang et al., Meta-Analyse, J Diabetes 2025',
    full: 'Yang [et al.]. Sex differences in the efficacy of glucagon-like peptide-1 receptor agonists for weight reduction: a systematic review and meta-analysis. J Diabetes. 2025;17(3):e70063.',
    url: 'https://doi.org/10.1111/1753-0407.70063',
    note: 'Meta-Analyse von 14 Studien: Frauen verloren unter GLP-1-Rezeptoragonisten im Mittel 1,04 kg (95-%-KI 0,70 bis 1,38) bzw. 1,69 Prozentpunkte mehr als Männer; für Semaglutid 1,04 kg.',
  },
  zibellini2015: {
    id: 'zibellini2015',
    short: 'Zibellini et al., Meta-Analyse, J Bone Miner Res 2015',
    full: 'Zibellini J, Seimon RV, Lee CMY, et al. Does diet-induced weight loss lead to bone loss in overweight or obese adults? A systematic review and meta-analysis of clinical trials. J Bone Miner Res. 2015;30(12):2168–2178.',
    url: 'https://doi.org/10.1002/jbmr.2564',
    note: 'Meta-Analyse klinischer Studien mit DXA: Diätbedingter Gewichtsverlust senkte die Knochendichte der Gesamthüfte um 0,010 bis 0,015 g/cm² bei Interventionen über 6, 12 oder 24 Monate; an der Lendenwirbelsäule kein messbarer Effekt.',
  },
  villareal2017: {
    id: 'villareal2017',
    short: 'Villareal et al., NEJM 2017',
    full: 'Villareal DT, Aguirre L, Gurney AB, et al. Aerobic or resistance exercise, or both, in dieting obese older adults. N Engl J Med. 2017;376(20):1943–1955.',
    url: 'https://doi.org/10.1056/NEJMoa1616338',
    note: 'Randomisierte Studie mit 160 adipösen Erwachsenen ab 65 Jahren, 26 Wochen Diät (−9 % Gewicht): Mit Krafttraining ging 1,0 kg fettfreie Masse verloren, mit Ausdauertraining 2,7 kg, mit beidem 1,7 kg; die Knochendichte der Hüfte sank mit Ausdauertraining um 2,6 %, mit beidem um 1,1 %, mit Krafttraining um weniger als 1 % (nicht signifikant). Beide Geschlechter.',
  },
  jensen2024bone: {
    id: 'jensen2024bone',
    short: 'Jensen et al., S-LiTE Knochen, JAMA Netw Open 2024',
    full: 'Jensen SBK, et al. Bone health after exercise alone, GLP-1 receptor agonist treatment, or combination treatment: a secondary analysis of a randomized clinical trial. JAMA Netw Open. 2024;7(6):e2416775.',
    url: 'https://doi.org/10.1001/jamanetworkopen.2024.16775',
    note: 'Sekundäranalyse der S-LiTE-Studie mit 195 Erwachsenen mit Adipositas, ein Jahr nach Formuladiät: Liraglutid allein senkte die Knochendichte an Hüfte und Wirbelsäule gegenüber Training allein; die Kombination aus Training und Liraglutid hielt die Knochendichte an Hüfte, Wirbelsäule und Unterarm trotz des größten Gewichtsverlusts (16,9 kg) stabil.',
  },
  khalafi2023: {
    id: 'khalafi2023',
    short: 'Khalafi et al., Meta-Analyse, Front Endocrinol 2023',
    full: 'Khalafi M, et al. The effects of exercise training on body composition in postmenopausal women: a systematic review and meta-analysis. Front Endocrinol (Lausanne). 2023;14:1183765.',
    url: 'https://doi.org/10.3389/fendo.2023.1183765',
    note: 'Meta-Analyse von 101 randomisierten Studien mit 5697 Frauen nach den Wechseljahren: Training erhöhte Muskelmasse und fettfreie Masse und senkte Fettmasse, Taillenumfang und viszerales Fett; Krafttraining und kombiniertes Training wirkten am stärksten auf die Muskelmasse, Ausdauer und Kombination am stärksten auf die Fettmasse.',
  },
  mojtahedi2011: {
    id: 'mojtahedi2011',
    short: 'Mojtahedi et al., J Gerontol A 2011',
    full: 'Mojtahedi MC, Thorpe MP, Karampinos DC, et al. The effects of a higher protein intake during energy restriction on changes in body composition and physical function in older women. J Gerontol A Biol Sci Med Sci. 2011;66(11):1218–1225.',
    url: 'https://doi.org/10.1093/gerona/glr120',
    note: 'Doppelblinde randomisierte Studie mit 31 Frauen nach den Wechseljahren (im Mittel 65 Jahre), 24 Wochen Kalorienreduktion: Mit zusätzlichem Molkenprotein (erreicht 1,1 statt 0,8 g pro kg und Tag) blieb pro verlorenem Kilo mehr Muskel erhalten, und die körperliche Funktion verbesserte sich stärker.',
  },
  gibson2023: {
    id: 'gibson2023',
    short: 'Gibson et al., SWAN, Menopause 2023',
    full: 'Gibson CJ, Shiozawa A, Epstein AJ, Han W, Mancuso S. Association between vasomotor symptom frequency and weight gain in the Study of Women\'s Health Across the Nation. Menopause. 2023;30(7):709–716.',
    url: 'https://doi.org/10.1097/GME.0000000000002198',
    note: 'SWAN-Längsschnitt mit 2361 Frauen: Häufigere Hitzewallungen gingen einer Zunahme von 0,24 kg Gewicht und 0,20 cm Taillenumfang voraus; über zehn Jahresvisiten mit häufigen Beschwerden +3,0 cm Taille. Gleichzeitige Schlafprobleme erklärten höchstens 27 % davon. Beobachtungsdaten, keine Kausalität.',
  },
  dgeEnergie: {
    id: 'dgeEnergie',
    short: 'DGE-Referenzwerte: Energie',
    full: 'Deutsche Gesellschaft für Ernährung e. V. Referenzwerte für die Nährstoffzufuhr: Energie. Bonn, Revision 2015.',
    url: 'https://www.dge.de/wissenschaft/referenzwerte/energie/',
    note: 'Richtwerte für die Energiezufuhr, abgeleitet aus geschätztem Ruheenergieverbrauch mal Aktivitätsfaktor (PAL); 25 bis unter 51 Jahre bei PAL 1,4: 1.800 kcal (Frauen), 2.300 kcal (Männer), bei PAL 1,6: 2.100 bzw. 2.700 kcal. Die Richtwerte gelten für Normalgewicht; Schätzformeln liefern Näherungswerte.',
  },
  leibel1995: {
    id: 'leibel1995',
    short: 'Leibel et al., NEJM 1995',
    full: 'Leibel RL, Rosenbaum M, Hirsch J. Changes in energy expenditure resulting from altered body weight. N Engl J Med. 1995;332(10):621–628.',
    url: 'https://doi.org/10.1056/NEJM199503093321001',
    note: 'Stationäre Messungen an 41 Personen: Nach Halten eines um mindestens 10 % reduzierten Gewichts lag der Gesamtenergieverbrauch 6 bis 8 kcal pro Kilogramm fettfreier Masse und Tag unter dem erwarteten Wert; Ruhe- und Aktivitätsverbrauch trugen je 3 bis 4 kcal pro Kilogramm bei. Bei 10 % über dem üblichen Gewicht lag er 8 bis 9 kcal pro Kilogramm darüber.',
  },
  rosenbaum2008: {
    id: 'rosenbaum2008',
    short: 'Rosenbaum et al., Am J Clin Nutr 2008',
    full: 'Rosenbaum M, Hirsch J, Gallagher DA, Leibel RL. Long-term persistence of adaptive thermogenesis in subjects who have maintained a reduced body weight. Am J Clin Nutr. 2008;88(4):906–912.',
    url: 'https://doi.org/10.1093/ajcn/88.4.906',
    note: '21 Personen in sieben gematchten Trios, stationär gemessen: Wer ein um mindestens 10 % reduziertes Gewicht länger als ein Jahr gehalten hatte, verbrauchte weiterhin weniger Energie als für Gewicht und Körperzusammensetzung erwartet, in ähnlichem Ausmaß wie direkt nach dem Abnehmen.',
  },
  martins2020: {
    id: 'martins2020',
    short: 'Martins et al., Am J Clin Nutr 2020',
    full: 'Martins C, Gower BA, Hill JO, Hunter GR. Metabolic adaptation is not a major barrier to weight-loss maintenance. Am J Clin Nutr. 2020;112(3):558–565.',
    url: 'https://doi.org/10.1093/ajcn/nqaa086',
    note: 'Frauen mit Übergewicht nach etwa 14 kg Diätverlust: Der Ruheenergieverbrauch lag 92 kcal am Tag unter dem erwarteten Wert, nach vier Wochen Gewichtsstabilisierung noch 38 kcal; nach einem Jahr waren 29 % des Verlusts wieder zugenommen, und die Größe der Anpassung sagte die Wiederzunahme nicht voraus.',
  },
  blundell2017: {
    id: 'blundell2017',
    short: 'Blundell et al., Diabetes Obes Metab 2017',
    full: 'Blundell J, Finlayson G, Axelsen M, et al. Effects of once-weekly semaglutide on appetite, energy intake, control of eating, food preference and body weight in subjects with obesity. Diabetes Obes Metab. 2017;19(9):1242–1251.',
    url: 'https://doi.org/10.1111/dom.12932',
    note: 'Randomisierte, placebokontrollierte Crossover-Studie mit 30 Erwachsenen mit Adipositas über 12 Wochen: Semaglutid senkte die Energieaufnahme bei freiem Essen um 24 % gegenüber Placebo; der Ruheenergieverbrauch bezogen auf die fettfreie Masse blieb unverändert; Gewicht −5,0 kg, überwiegend Fettmasse.',
  },
  ravussin2025: {
    id: 'ravussin2025',
    short: 'Ravussin et al., Cell Metab 2025',
    full: 'Ravussin E, et al. Tirzepatide did not impact metabolic adaptation in people with obesity, but increased fat oxidation. Cell Metab. 2025;37(5):1060–1074.',
    url: 'https://doi.org/10.1016/j.cmet.2025.03.011',
    note: 'Phase-1-Studie mit 55 Erwachsenen mit Adipositas ohne Diabetes, 18 Wochen, Stoffwechselkammer: Gewicht −16,7 kg unter Tirzepatid gegenüber −8,3 kg unter Placebo mit Diät; der Rückgang von Schlaf- und 24-Stunden-Energieverbrauch nach Adjustierung für Gewicht und Körperzusammensetzung war in beiden Gruppen gleich, also keine Wirkung auf die metabolische Adaptation.',
  },
  helander2016: {
    id: 'helander2016',
    short: 'Helander et al., NEJM 2016',
    full: 'Helander EE, Wansink B, Chieh A. Weight gain over the holidays in three countries. N Engl J Med. 2016;375(12):1200–1202.',
    url: 'https://doi.org/10.1056/NEJMc1602012',
    note: '2924 Erwachsene mit vernetzten Waagen, darunter 760 in Deutschland: Zehn Tage nach Weihnachten lag das Gewicht in Deutschland im Mittel 0,6 % höher als zehn Tage davor, zu Ostern 0,2 %. Etwa die Hälfte der Zunahme war kurz danach wieder weg, die andere Hälfte blieb bis in den Sommer oder länger.',
  },
  yanovski2000: {
    id: 'yanovski2000',
    short: 'Yanovski et al., NEJM 2000',
    full: 'Yanovski JA, Yanovski SZ, Sovik KN, Nguyen TT, O\'Neil PM, Sebring NG. A prospective study of holiday weight gain. N Engl J Med. 2000;342(12):861–867.',
    url: 'https://doi.org/10.1056/NEJM200003233421206',
    note: 'Prospektive Studie mit 195 Erwachsenen in den USA: zwischen Thanksgiving und Neujahr im Mittel 0,37 kg Zunahme; 14 % nahmen mehr als 2,3 kg zu, Menschen mit Übergewicht häufiger. Ein Jahr später war die Zunahme nicht wieder abgebaut.',
  },
  diazzavala2017: {
    id: 'diazzavala2017',
    short: 'Díaz-Zavala et al., Review, J Obes 2017',
    full: 'Díaz-Zavala RG, Castro-Cantú MF, Valencia ME, Álvarez-Hernández G, Haby MM, Esparza-Romero J. Effect of the holiday season on weight gain: a narrative review. J Obes. 2017;2017:2085136.',
    url: 'https://doi.org/10.1155/2017/2085136',
    note: 'Narrativer Review: Erwachsene nehmen zwischen Ende November und Anfang Januar in den ausgewerteten Studien 0,4 bis 0,9 kg zu; auch Teilnehmende von Abnehmprogrammen nehmen zu (0,3 bis 0,9 kg). Selbstkontrolle über die Feiertage schien die Zunahme zu verhindern.',
  },
  turicchi2020: {
    id: 'turicchi2020',
    short: 'Turicchi et al., NoHoW, PLoS ONE 2020',
    full: 'Turicchi J, O\'Driscoll R, Horgan G, et al. Weekly, seasonal and holiday body weight fluctuation patterns among individuals engaged in a European multi-centre behavioural weight loss maintenance intervention. PLoS ONE. 2020;15(4):e0232152.',
    url: 'https://doi.org/10.1371/journal.pone.0232152',
    note: 'Europäische Studie mit 1062 Erwachsenen in der Haltephase nach mindestens 5 % Gewichtsverlust, vernetzte Waagen: Über Weihnachten stieg das Gewicht im Mittel um 1,35 % und wurde in den Folgemonaten nicht vollständig ausgeglichen.',
  },
  mason2018: {
    id: 'mason2018',
    short: 'Mason et al., Winter Weight Watch, BMJ 2018',
    full: 'Mason F, Farley A, Pallan M, Sitch A, Easter C, Daley AJ. Effectiveness of a brief behavioural intervention to prevent weight gain over the Christmas holiday period: randomised controlled trial. BMJ. 2018;363:k4867.',
    url: 'https://doi.org/10.1136/bmj.k4867',
    note: 'Randomisierte Studie mit 272 Erwachsenen über zwei Weihnachtsperioden: Wer sich mindestens zweimal pro Woche wog, das Gewicht notierte und zehn Tipps bekam, wog nach den Feiertagen 0,49 kg weniger als die Vergleichsgruppe (−0,13 kg gegenüber +0,37 kg).',
  },
  kwok2019: {
    id: 'kwok2019',
    short: 'Kwok et al., Meta-Analyse, Br J Nutr 2019',
    full: 'Kwok A, Dordevic AL, Paton G, Page MJ, Truby H. Effect of alcohol consumption on food energy intake: a systematic review and meta-analysis. Br J Nutr. 2019;121(5):481–495.',
    url: 'https://doi.org/10.1017/S0007114518003677',
    note: 'Meta-Analyse von zwölf Experimentalstudien mit gesunden Erwachsenen (18 bis 37 Jahre): Mit Alkohol wurde bei der Mahlzeit rund 343 kJ (etwa 82 kcal) mehr gegessen und insgesamt rund 1072 kJ (etwa 256 kcal) mehr aufgenommen als mit einem alkoholfreien Vergleichsgetränk.',
  },
  butryn2007: {
    id: 'butryn2007',
    short: 'Butryn et al., National Weight Control Registry, Obesity 2007',
    full: 'Butryn ML, Phelan S, Hill JO, Wing RR. Consistent self-monitoring of weight: a key component of successful weight loss maintenance. Obesity (Silver Spring). 2007;15(12):3091–3096.',
    url: 'https://doi.org/10.1038/oby.2007.368',
    note: 'Beobachtungsdaten von 3003 Menschen, die mindestens 13,6 kg abgenommen und ein Jahr gehalten hatten: Wer im Folgejahr seltener auf die Waage stieg als zuvor, nahm im Mittel 4,0 kg zu, wer häufiger wog 1,1 kg. Selbstauskunft, keine Randomisierung.',
  },
  zheng2016: {
    id: 'zheng2016',
    short: 'Zheng et al., Int J Obes 2016',
    full: 'Zheng Y, Sereika SM, Ewing LJ, et al. Patterns of self-weighing behavior and weight change in a weight loss trial. Int J Obes (Lond). 2016;40(9):1392–1396.',
    url: 'https://doi.org/10.1038/ijo.2016.68',
    note: '148 Teilnehmende eines zwölfmonatigen Abnehmprogramms mit vernetzter Waage: Wer konstant an mehr als sechs Tagen pro Woche wog (75 %), lag nach einem Jahr bei −9,9 %; wer das Wiegen weitgehend aufgab (9 %), bei +0,65 %. Beobachtung, keine Zuteilung der Wiegehäufigkeit.',
  },
  vuorinen2021: {
    id: 'vuorinen2021',
    short: 'Vuorinen et al., J Med Internet Res 2021',
    full: 'Vuorinen AL, Helander E, Pietilä J, Korhonen I. Frequency of self-weighing and weight change: cohort study with 10,000 smart scale users. J Med Internet Res. 2021;23(6):e25529.',
    url: 'https://doi.org/10.2196/25529',
    note: 'Alltagsdaten von 10 000 Nutzern vernetzter Waagen über im Mittel rund drei Jahre: Häufigeres Wiegen ging mit günstigerer Gewichtsentwicklung einher, am deutlichsten bei Adipositas. In Wiegepausen von mindestens 30 Tagen stieg das Gewicht bei Adipositas im Mittel um 1,37 kg. Beobachtung, keine Randomisierung.',
  },
  madigan2015: {
    id: 'madigan2015',
    short: 'Madigan et al., Meta-Analyse, Int J Behav Nutr Phys Act 2015',
    full: 'Madigan CD, Daley AJ, Lewis AL, Aveyard P, Jolly K. Is self-weighing an effective tool for weight loss: a systematic literature review and meta-analysis. Int J Behav Nutr Phys Act. 2015;12:104. Erratum 2016.',
    url: 'https://doi.org/10.1186/s12966-015-0267-4',
    note: 'Meta-Analyse randomisierter Studien: Wiegen als alleinige Maßnahme brachte keinen nachweisbaren Effekt; als Baustein eines Verhaltensprogramms 1,7 kg mehr Gewichtsverlust (95-%-KI 0,8 bis 2,6) als dasselbe Programm ohne Wiegen. Zahlen nach dem Erratum von 2016.',
  },
  daley2019: {
    id: 'daley2019',
    short: 'Daley et al., LIMIT, Public Health Res 2019',
    full: 'Daley AJ, Jolly K, Madigan CD, et al. A brief behavioural intervention to promote regular self-weighing to prevent weight regain after weight loss: a RCT. Public Health Res. 2019;7(7).',
    url: 'https://pubmed.ncbi.nlm.nih.gov/31042335/',
    note: 'Randomisierte Studie mit 583 Erwachsenen nach mindestens 5 % Gewichtsverlust in einem kommunalen Programm: Drei kurze Telefonate, eine Protokollkarte für tägliches Wiegen und SMS verhinderten die Wiederzunahme nicht (44,7 % gegenüber 45,9 % blieben innerhalb von 1 kg). Wiegen ohne festgelegte Reaktion reicht demnach nicht.',
  },
  steinberg2014: {
    id: 'steinberg2014',
    short: 'Steinberg et al., Am J Prev Med 2014',
    full: 'Steinberg DM, Tate DF, Bennett GG, Ennett S, Samuel-Hodge C, Ward DS. Daily self-weighing and adverse psychological outcomes: a randomized controlled trial. Am J Prev Med. 2014;46(1):24–29.',
    url: 'https://doi.org/10.1016/j.amepre.2013.08.006',
    note: 'Randomisierte Studie mit 91 Erwachsenen mit Übergewicht über sechs Monate: Tägliches Wiegen erhöhte weder Depressivität noch Essstörungssymptome, Enthemmung oder Hungeranfälligkeit, auch nicht bei denen, die kein Gewicht verloren.',
  },
  benn2016: {
    id: 'benn2016',
    short: 'Benn et al., Meta-Analyse, Health Psychol Rev 2016',
    full: 'Benn Y, et al. What is the psychological impact of self-weighing? A meta-analysis. Health Psychol Rev. 2016;10(2):187–203.',
    url: 'https://doi.org/10.1080/17437199.2016.1138871',
    note: 'Meta-Analyse von 29 unabhängigen Tests: Wiegen war insgesamt nicht mit schlechterer Stimmung, Körpereinstellung oder gestörtem Essverhalten verbunden, aber mit einem kleinen negativen Zusammenhang zu Selbstwert und psychischem Funktionieren. Bei Jüngeren ungünstiger, bei höherem Gewicht eher günstig.',
  },
  pacanowski2023: {
    id: 'pacanowski2023',
    short: 'Pacanowski et al., Appl Psychol Health Well Being 2023',
    full: 'Pacanowski CR, et al. Daily self-weighing compared with an active control causes greater negative affective lability in emerging adult women: a randomized trial. Appl Psychol Health Well Being. 2023;15(4):1695–1713.',
    url: 'https://doi.org/10.1111/aphw.12463',
    note: 'Randomisierte Studie mit 69 jungen Frauen (18 bis 22 Jahre) ohne Übergewicht über zwei Wochen: Tägliches Wiegen erhöhte den gewichtsbezogenen Stress und senkte die Körperzufriedenheit gegenüber täglichem Fiebermessen. Andere Zielgruppe als Menschen nach Gewichtsverlust.',
  },
  zheng2015: {
    id: 'zheng2015',
    short: 'Zheng et al., Review, Obesity 2015',
    full: 'Zheng Y, Klem ML, Sereika SM, Danford CA, Ewing LJ, Burke LE. Self-weighing in weight management: a systematic literature review. Obesity (Silver Spring). 2015;23(2):256–265.',
    url: 'https://doi.org/10.1002/oby.20946',
    note: 'Systematischer Review von 17 Längsschnittstudien an Erwachsenen in Abnehmprogrammen: Regelmäßiges Wiegen ging mit mehr Gewichtsverlust einher und nicht mit mehr Depressivität oder Angst.',
  },
  hultman1996: {
    id: 'hultman1996',
    short: 'Hultman et al., J Appl Physiol 1996',
    full: 'Hultman E, Söderlund K, Timmons JA, Cederblad G, Greenhaff PL. Muscle creatine loading in men. J Appl Physiol. 1996;81(1):232–237.',
    url: 'https://doi.org/10.1152/jappl.1996.81.1.232',
    note: '31 Männer, Muskelbiopsien: 20 g Kreatin pro Tag über 6 Tage erhöhten das Gesamtkreatin im Muskel um etwa 20 %; 3 g pro Tag erreichten denselben Anstieg allmählich über 28 Tage. Ohne weitere Einnahme lag der Wert 30 Tage nach dem Ende wieder beim Ausgangswert.',
  },
};

export function getSources(ids: readonly string[]): Source[] {
  return ids.map((id) => {
    const s = sources[id];
    if (!s) throw new Error(`Unbekannte Quelle: ${id}`);
    return s;
  });
}
