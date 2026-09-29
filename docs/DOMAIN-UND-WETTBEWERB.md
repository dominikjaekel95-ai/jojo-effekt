# Domain-Entscheidung und Wettbewerbs-Benchmark

Stand 29.09.2026. Benchmark-Basis: 15 Suchanfragen, je einmal (drei zweimal) über ein US-basiertes Such-Tool ausgeführt; Positionen sind deshalb Näherungen, österreichische und Schweizer Domains tauchen vermutlich stärker auf als auf Google.de. Vor der Content-Planung die Kernseiten einmal manuell in Google.de (Inkognito, Standort Deutschland) gegenprüfen.

## 1. Domain: Empfehlung

**Kaufen: `nachderspritze.de`** (plus `nach-der-spritze.de` als Weiterleitung, `.com` wenn günstig).

Warum nicht `jojo-effekt-vermeiden.de`:

| Kriterium | jojo-effekt-vermeiden.de | nachderspritze.de |
|---|---|---|
| Ranking-Bonus durch Keyword in der Domain | Seit dem Exact-Match-Domain-Update (2012) praktisch null; Google bewertet Inhalt und Links, nicht den Domainnamen | ebenfalls null – aber auch kein Nachteil |
| Rechtliches (Health-Claims-VO Art. 1 Abs. 3) | „Jojo-Effekt vermeiden“ ist ein Wirkversprechen. Als Marke/Domain eines Supplement-Anbieters kann es als gesundheitsbezogene Angabe gelten und bräuchte einen zugelassenen Begleit-Claim, den es nicht gibt. Genau die Aussage, die der Plan verbietet, stünde in jeder URL | beschreibt eine Lebensphase, kein Versprechen |
| Suchintention | „Jojo-Effekt vermeiden“ ist ein generisches Diät-Keyword (AOK, Barmer, ZAVA, UGB, Women's Health ranken dafür); nicht GLP-1-spezifisch, sehr umkämpft | trifft die Zielgruppe (Absetzer) exakt, passt zu H1, Anzeigen, Marke |
| Vertrauen/Klickrate | Dreifach-Bindestrich-Domains wirken wie Affiliate-Seiten – im Gesundheitsbereich (YMYL) ein Klick-Nachteil in den Suchergebnissen | kurz, aussprechbar, merkbar, als Marke schützbar |
| Markenfähigkeit | Nicht schützbar (beschreibend), nicht ausbaubar über GLP-1 hinaus | als Wortmarke beim DPMA voraussichtlich eintragbar (Klassen 5, 29, 41); Erweiterung möglich („Nach der OP“, „Nach der Diät“) |

Fazit: Der Domainname bringt für das Ranking nichts; die Inhalte, die Prüfung durch einen Fachmann und Links entscheiden. Deshalb Markendomain statt Keyword-Domain.

### Shortlist mit Bewertung

| Rang | Domain | Pro | Contra | Verfügbarkeit |
|---|---|---|---|---|
| 1 | **nachderspritze.de** | Marke = Domain = H1; beschreibt Zielgruppe und Moment; kein Claim; keine Kollision gefunden (weder Website noch Marke in den Suchergebnissen) | „Spritze“ ist umgangssprachlich; für Kassen-/Arzt-Kooperationen später evtl. eine zweite, neutrale Marke | DNS löst nicht auf (Indiz für frei); **bei DENIC/INWX prüfen** |
| 2 | nach-der-spritze.de | Tippvariante | nur als Weiterleitung | prüfen |
| 3 | haltephase.de | markenfähig, neutral, über GLP-1 hinaus nutzbar | kein Bezug zur Spritze; braucht Erklärung | prüfen |
| 4 | absetzphase.de | beschreibt den Moment, neutral | klingt nach Medikamenten-Thema (HWG-Nähe), weniger warm | prüfen |
| 5 | spritzefrei.de (aus dem Plan) | kurz | liest sich als „gegen die Spritze“ / Versprechen „frei von“; Ärztinnen könnten es als Absetz-Aufforderung lesen | prüfen |
| 6 | abnehmspritze-absetzen.de | stärkster Suchintent im Namen | Exact-Match ohne Markenwert, Bindestrich, spammig, HWG-Nähe (Absetzen eines Rx-Medikaments als Domain eines Produkts) | prüfen |
| 7 | jojo-effekt-vermeiden.de | – | siehe Tabelle oben | DNS löst nicht auf; nicht empfohlen |
| – | jojofrei.de / ohnejojo.de / kein-jojo.de | kurz | **Kollision:** Buch „endlich jojofrei“ (Kowalski/Korn, BoD) und „JoJo-frei Training“ (mindfellow.de); jojofrei.de ist registriert. Zudem Versprechen | nicht empfohlen |

**Hinweis zur Prüfung:** Aus dieser Umgebung war die DENIC-Abfrage gesperrt (Netzwerk-Policy). Prüfen unter denic.de → Whois oder direkt beim Registrar. Empfehlung Registrar für .de: INWX (deutsch, ~6 €/Jahr, DNS inklusive). Zusätzlich: DPMA-Registerauskunft (register.dpma.de) auf „Nach der Spritze“ – 5 Minuten, kostenlos.

**Was zu tun ist, wenn nachderspritze.de vergeben ist:** haltephase.de prüfen; sonst nachderspritze.com/.info als Notlösung meiden und stattdessen `nachderspritze-set.de` oder `nds-set.de` … nein: dann lieber eine neue kurze Marke (z. B. „Haltephase“) und die Texte anpassen (nur `src/data/site.ts` und die H1).

## 2. Wettbewerb in den Suchergebnissen

### Wer rankt wofür (15 Queries, Häufigkeit in den Top-Ergebnissen)

| Domain | Treffer / 15 | Typ | Stärken | Schwächen für unsere Nische |
|---|---|---|---|---|
| viszera.de | 8 | Adipositas-Klinik München (Prof. Horbach) | langer Absetzen-Guide, Arzt-E-E-A-T, nennt Protein und Ballaststoffe, Themencluster | verkauft Endosleeve/Magenballon; kein Programm für Nicht-OP-Patienten; kein Kreatin, kein Trainingsplan |
| oviva.com | 7 | Kassenfinanzierte Ernährungstherapie (App) | starke Domain, viele Absetzen-/Wegovy-Seiten | Ziel: Rekrutierung ins Kassenprogramm (Rezept nötig); generisch „Ernährung und Bewegung“ |
| golighter.de | 7 | Telehealth (GLP-1-Rezept + Coaching) | größtes Cluster (/abnehmspritze-absetzen, /wegovy/behandlungsende, /kreatin, /proteinpulver) | verkauft die Spritze → Interessenkonflikt beim Absetzen; Kreatin-/Protein-Seiten nicht GLP-1-spezifisch |
| yazen.com | 5 | Telehealth (SE) | drei Absetzen-Artikel, nüchtern | Botschaft „langfristig weiter spritzen“; kein Produkt, keine Praxis-Anleitung |
| zavamed.com | 5 | Telehealth | wegovy-absetzen, mounjaro-absetzen, gewicht-halten-Seiten, Ärzte-Review | verkauft Wegovy/Mounjaro; Tipps generisch |
| herzstiftung.de | 5 | Stiftung | hohe Autorität, zitiert Meta-Analyse | News, keine Anleitung |
| docmorris.de | 5 | Online-Apotheke (Abnehm-Blog) | Erfahrungsserie „Vorbereitung auf das Therapieende“, „Muskelverlust vorbeugen“ | Blog-Charakter; Aussagen zu Absetz-Symptomen widersprechen der Studienlage |
| apotheken-umschau.de | 4 | Health-Publisher | beste Muskelabbau-Seite (25–40 % fettfreie Masse, 1,1–1,6 g/kg, Krafttraining) | keine Absetzen-/Jojo-Seite in den Top-Ergebnissen; kein Kreatin |
| aponet.de, fitbook.de | je 3 | Apothekenportal / Lifestyle | Studienmeldungen (S-LiTE, Muskeln) | kurz |
| nupo.de | 3 | Mahlzeitenersatz-Shop | einziger Shop mit GLP-1-Ratgeber-Cluster (Protein 1,2–1,6 g/kg) | Fokus „während“ der Spritze, nicht danach; kein Kreatin, kein Training |
| science.orf.at, aerzteblatt.de, tagesspiegel.de, derstandard.de | 2–3 | News | Autorität | Studienmeldungen ohne Praxis |
| doc-padberg.de | 2 | Arzt-Blog | Titel „Jojo-Effekt vermeiden“, Arzt | Einzelpraxis, wenig Reichweite |
| je 1×: niiu.me, apomeds.com, medical.lilly.com, myvoy.de, deutschemedz.de, zanadio.de, youtube.com (SWR-Doku), srf.ch, t-online.de, doktorschelle.de, beewell-ernaehrungsberatung.de, adipositas24.de (Forum) u. a. | 1 | gemischt | | |

Nicht in den Top-Ergebnissen aufgetaucht, obwohl erwartet: ndr.de, quarks.de, netdoktor.de, aok.de, tk.de, fernarzt.com, doktorabc.com, Reddit.

### Struktur der Suchergebnisse

1. **„Absetzen“-Anfragen gehören Telehealth-Anbietern und Kassenprogrammen.** Alle mit Interessenkonflikt (Weiterbehandlung), alle ohne physisches Produkt.
2. **„Muskelabbau/Protein“-Anfragen gehören Publishern und Apotheken.** Guter Fachinhalt, ohne Kaufoption, ohne Bezug zum Absetz-Zeitpunkt.
3. **Niemand verbindet beide Cluster** („Absetzen/Jojo“ + „Muskelerhalt mit Protein, Kreatin, Training, Ballaststoffen“) auf einer Seite oder in einem Produkt. Das ist die Lücke, die die Seite besetzt.
4. **Widersprüche beim Ausschleichen:** ZAVA/DocMorris/viszera empfehlen Tapering, Yazen sagt „nicht nötig“, SRF/Oviva „schrittweise scheint besser“. Eine evidenzbasierte Einordnung fehlte – der Artikel „Abnehmspritze absetzen“ liefert sie.
5. **Keyword-Lücken mit null dedizierten deutschen Seiten:** „kreatin abnehmspritze“ (jetzt: /wissen/kreatin-abnehmspritze/), „abnehmspritze absetzen plan / 12 wochen“ (jetzt: /wissen/gewicht-halten-nach-abnehmspritze/), „abnehmspritze absetzen erfahrungen“ (nur ein Forum-Thread und zwei Privatblogs – Chance für strukturierte Erfahrungsberichte aus der Vorbestell-Liste).
6. **E-E-A-T-Messlatte:** Apotheken Umschau, Herzstiftung, Ärzteblatt, viszera (Arzt), Yazen/ZAVA (Ärzte-Review). Ohne benannten fachlichen Prüfer mit Qualifikation wird die Seite bei YMYL-Anfragen nicht in die Top 10 kommen.

### Wiederkehrende Studien in den Wettbewerber-Texten (alle in `src/data/sources.ts`)

STEP-1-Extension (Wilding 2022), SURMOUNT-4 (Aronne 2024), Meta-Analyse zum Verlauf nach Absetzen (Wu 2025, BMC Medicine; in der Presse oft als „BMJ-Studie“ zitiert – wir zitieren das Original), S-LiTE (Lundgren 2021, Jensen 2024), STEP-1-Körperzusammensetzung (Wilding 2021), Bimagrumab-Ansatz (t-online; für uns irrelevant).

## 3. Produkt-Wettbewerber

**Kernbefund: Im DACH-Raum gibt es kein Produkt, das als Set für die Zeit nach der Abnehmspritze positioniert ist** (Protein + Ballaststoffe + Kreatin + Trainingsprogramm). Nächste Substitute:

| Anbieter | Positionierung | Preis | Enthält | Abgrenzung |
|---|---|---|---|---|
| LEALY (CH) | „Begleitprogramm zur Abnehmspritze“, Frauen 40–75, Gewicht auch nach Absetzen halten | n. a., kostenloses Analysegespräch | App, Community, Coaches, Kurs; keine Supplements | reines Verhaltensprogramm |
| Oviva, zanadio | Kassenprogramm/DiGA, Content zu Absetzen | Kasse (Rezept) | App + Ernährungsfachkraft | keine Produkte, Rezept nötig |
| Nupo | „Nupo Diet & GLP-1“, GLP-1-Ratgeber | One Meal 15,99 € | Protein-/Ballaststoff-Shakes (Mahlzeitenersatz) | Fokus Einnahmephase, kein Kreatin, kein Training |
| WLS Products | Bariatrie-Supplements mit GLP-1-Kategorie | n. a. | Ballaststoffe, „Gut Balance“ | Shop ohne Programm |
| Telehealth (ZAVA, GoLighter, Yazen, Voy, Juniper ab 172 €/Monat, apomeds, DeutscheMedz) | Medikament + App-Coaching; „Gewicht halten“ als Retention-Content | Juniper ab 172 €/Monat; Wegovy ca. 280 €/Monat | Medikament + Coaching | verkaufen das Gegenteil von Absetzen |
| Noom GLP-1 Companion (US) | explizites „Off-Ramp“-Narrativ; Nutzer nahmen nach Absetzen dreimal weniger zu (modelliert) | App | Lektionen nach Medikamentenende | kein Produkt, kein DE-Fokus |
| International: Herbalife GLP-1 Companion, The Vitamin Shoppe GLP-1 Support (Protein 30 g, Fiber 15 g), DaVinci Labs GLP-1 Companion Bundle, 1st Phorm GLP-1 Support, Celebrate Vitamins, casa de sante, SoWell („Off-Ramp starter pack“-Framing) | „GLP-1 companion“ – Einnahmephase | 40–80 $ | Protein, Ballaststoffe, teils Kreatin | US-Markt, kein Programm, keine Absetz-Positionierung |

Ableitung für den Test: Das Set hat keinen direkten Wettbewerber; das ist entweder eine Lücke oder ein Zeichen, dass die Zahlungsbereitschaft fehlt. Genau das misst der Fake-Door-Test. Der Preisanker „43 € im Monat gegen 170–280 € für die Spritze“ ist plausibel; Nupo (16 € pro Produkt) und Juniper (172 €) rahmen ihn.

## 4. Suchvolumen (Stand der Recherche)

Keine belastbaren veröffentlichten Monatszahlen gefunden. Indizien: GoLighter-Städtevergleich (Keyword-Planner-Daten, Abnehmspritzen-Suchen +52 % in Essen Jan 2025 → Jan 2026, klassische Diät-Suchen −41 % in Frankfurt), ZAVA-Report (Abnehm-Suchen 2021–2022 stark gestiegen), und die Tatsache, dass mindestens acht Anbieter eigene „absetzen“-Landingpages pflegen. **To-do:** Google Keyword Planner im Ads-Konto (nach Anlage) für die 21 Keywords aus `ADS.md` abfragen und hier eintragen; das ist die einzige kostenlose verlässliche Quelle.
