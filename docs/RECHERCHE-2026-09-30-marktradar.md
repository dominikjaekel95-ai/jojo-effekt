# Recherche 30.09.2026: Reviewer, Erfahrungsformular, Preisdaten, Keyword-Volumen, Analytics

Ergebnis der ausgelagerten Punkte aus dem Marktradar-/Glossar-Plan (Coding-Instanz, 30.09.2026). Preise, Kassenregeln und Datenquellen stehen in `docs/MARKTRADAR-ERHEBUNG.md` (Vorlage plus Erstbefüllung). Hier: alles andere.

## 1. Reviewer-Suche (Apothekerin oder Arzt)

### Profil

- Approbierte Apothekerin/Apotheker **oder** Ärztin/Arzt (Innere Medizin, Endokrinologie/Diabetologie, Ernährungsmedizin oder Allgemeinmedizin). Eine Apothekerin ist für unsere Texte die bessere erste Wahl: Arzneimittelwissen (Halbwertszeit, Auswaschphase, Wechselwirkungen), Nahrungsergänzung und Health Claims sind Kernkompetenz, das Honorar liegt niedriger, und die berufsrechtliche Werbe-Schranke ist weniger scharf als bei Ärzten (§ 27 MBO-Ä).
- Freiberuflich, bereit, mit Name, Foto, Qualifikation und Datum auf den Artikeln zu erscheinen („Fachlich geprüft von …“). Ohne Namen bringt der Reviewer für Google (E-E-A-T) und für Leser nichts.
- Nicht Michi: als Mitgründer und Klinikarzt hat er einen Interessenkonflikt und eine Nebentätigkeitsfrage; er bleibt interner Faktencheck, nie der genannte Reviewer.
- Interessenkonflikt-Erklärung im Profil: Honorar pro Artikel, keine Beteiligung am Produkt, keine Beteiligung am Umsatz.

### Kanäle, in dieser Reihenfolge

1. **Michis Umfeld:** Kolleginnen aus Klinikapotheke oder Ambulanz, Ernährungsmedizin, Diabetologie. Persönliche Empfehlung ist der schnellste Weg und die höchste Qualität.
2. **LinkedIn:** Suche „Apothekerin freiberuflich Medical Writer“, „Fachlektorat Medizin“, „Pharmazeutin Texterin“. Direktnachricht mit Briefing-Link.
3. **Freelancer-Plattformen:** freelance.de (Profil-Beispiel: „Medical Writer, Fachtexter, Pharmazeut“), freelancermap.de (Kategorie Medical Writing), Malt. Projekt ausschreiben, nicht nur suchen.
4. **EMWA Freelance Directory** (European Medical Writers Association, viele deutschsprachige Mitglieder) und DocCheck-Community.
5. **Agentur als Fallback:** Medizinlektorat-Agenturen (z. B. sanofeld.de: Korrektorat ab 4,50 €, Fachlektorat ab 9 € je Normseite à 1.500 Zeichen, Stundensatz ab 70 €). Teurer pro Artikel, aber sofort verfügbar; Nachteil: kein Name auf der Seite.

### Honorar pro Artikel (Größenordnungen, Stand 30.09.2026)

| Modell | Umfang | Honorar |
|---|---|---|
| Fachlektorat (Agentur-Benchmark) | 1.500 Wörter ≈ 10.000 Zeichen ≈ 7 Normseiten | 60 bis 70 € (nur Sprach- und Fachkorrektur, kein Quellencheck) |
| Apothekerin freiberuflich, Review mit Quellencheck | 1 bis 1,5 h à 60 bis 90 € (Schätzung, Marktspanne freiberuflicher Pharmazeuten) | 80 bis 150 € |
| Ärztin/Arzt freiberuflich, Review mit Quellencheck | 1 bis 2 h à 90 bis 150 € (Schätzung; Honorarärzte liegen „deutlich über“ Angestelltengehalt, facharztvermittlung.de) | 120 bis 250 € |

Empfehlung: **Pauschale 120 € je Artikel bis 1.500 Wörter**, inklusive Quellencheck gegen die Studienliste, eine Korrekturrunde, Rückmeldung innerhalb von 5 Werktagen; längere Artikel 150 €. Startpaket: 10 bestehende Artikel für 1.000 € (Rabatt gegen Volumen), dann laufend 3 Artikel pro Woche aus der Dienstags-Routine (etwa 360 € pro Woche, Budgetfrage für Dominik). Alternative: Monatsretainer 400 € für bis zu 4 Artikel plus Monatscheck des Marktradars. Alle Beträge netto; Freiberufler stellen Rechnung (§ 18 EStG), oft ohne Umsatzsteuer (Kleinunternehmer).

### Recht und Darstellung (was der Reviewer darf und was nicht)

- **Nur auf Ratgeber-Artikeln**, nie auf Startseite, Produktseite, /danke/ oder neben Affiliate-Listen. Grund: HCVO Art. 12 c verbietet gesundheitsbezogene Angaben, die auf Empfehlungen einzelner Ärzte oder Fachleute verweisen; ein Reviewer neben dem Set wirkt wie „von Ärzten geprüft“. Auf Artikeln mit Produkt-Teaser: Reviewer-Zeile oben am Text, Teaser unten, dazwischen Inhalt. Der Reviewer prüft die Fakten des Artikels, nicht das Produkt, und das steht so im Profil.
- Zeile auf dem Artikel: „Fachlich geprüft von <Name>, <Apothekerin/Fachärztin für …>, am <Datum>“ mit Link auf das Profil. Kein Zitat, das das Set empfiehlt.
- **Profil-Seite** (z. B. `/redaktion/`): Name, Qualifikation (Approbation, Fachgebiet, Berufsjahre), was geprüft wird, Interessenkonflikt-Erklärung, Hinweis „keine individuelle Beratung; bei Beschwerden zur Ärztin oder zum Arzt“. Schema.org `Person` mit `jobTitle`, Artikel bekommen `reviewedBy` im JSON-LD.
- **Impressum-Zusatz:** rechtlich nicht nötig. Diensteanbieter (§ 5 DDG) und Verantwortlicher für journalistisch-redaktionelle Inhalte (§ 18 Abs. 2 MStV) bleiben Dominik. Der Reviewer gehört auf die Profil- oder Redaktionsseite, nicht ins Impressum; er trägt keine presserechtliche Verantwortung.
- **Ärzte zusätzlich:** § 27 MBO-Ä (berufswidrige Werbung). Fachliche Prüfung von Aufklärungstexten ist erlaubt, Produktwerbung mit dem Arztnamen nicht. Deshalb Trennung von Produkt und Reviewer auch aus seiner Sicht zwingend. Für Klinikärzte gilt die Nebentätigkeitsanzeige beim Arbeitgeber.
- **Vertrag:** kurze Honorarvereinbarung (Werkvertrag): Leistung (Prüfung auf fachliche Richtigkeit nach aktuellem Stand und gegen die genannten Quellen), Frist, Honorar, Namensnennung und Foto (mit Widerrufsrecht für die Zukunft, bestehende Artikel bleiben mit Prüfdatum), Interessenkonflikt-Erklärung, Haftungsbegrenzung auf Vorsatz und grobe Fahrlässigkeit, keine Beratung von Lesern.

### Prüfliste für das Briefing (was der Reviewer je Artikel bestätigt)

1. Jede Zahl und jede Studienaussage ist durch die verlinkte Quelle gedeckt (Studiendaten in `src/data/studien.ts`).
2. Keine Aussage geht über die freigegebenen Claims in `CLAIMS.md` hinaus; Formulierungen zu Protein, Kreatin, Ballaststoffen exakt im Claim-Wortlaut.
3. Dosis-, Zeit- und Warnhinweise sind korrekt und vollständig (Kreatin 3 g/Tag, Glucomannan 3 × 1 g mit Wasser, Erstickungswarnung; Ausschleichen nur mit Arzt).
4. Kein Heilversprechen, keine Diagnose, kein Rat, der die ärztliche Entscheidung ersetzt; Verweis auf Ärztin/Arzt an den richtigen Stellen.
5. Fachbegriffe stimmen (Halbwertszeit, Auswaschphase, Rebound, telogenes Effluvium usw.), Laienübersetzung ist nicht falsch vereinfacht.
6. Rückgabe: Liste der Änderungen mit Begründung und Quelle; „geprüft am“ wird erst nach Einarbeitung gesetzt.

## 2. Tally-Formular „Erfahrung einreichen“

Gebaut am 30.09.2026 in Dominiks Tally-Konto, Workspace „My workspace“.

- **Form-ID:** `ODOJWR` (Editor: `https://tally.so/forms/ODOJWR/edit`, nach Veröffentlichung: `https://tally.so/r/ODOJWR`, Einbettung `https://tally.so/embed/ODOJWR?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`, gleiche Mechanik wie das Vorbestell-Formular `b5bO9o` in `src/data/site.ts`).
- **Status: Entwurf.** Veröffentlichen ist ein Klick auf „Publish“ im Editor; Dominik entscheidet. Ohne Veröffentlichung nimmt das Formular keine Einträge an.
- Titel: „Deine Erfahrung nach der Abnehmspritze“. Sprache: Deutsch (Systemtexte, Fehlermeldungen). E-Mail-Benachrichtigung an dominik.jaekel95@gmail.com bei jedem Eintrag: an. Eigene Dankeseite mit Hinweis auf Kürzung, Anonymisierung und Widerruf.
- Felder in Reihenfolge: Präparat (Wegovy Spritze / Wegovy-Tablette / Ozempic / Mounjaro / Saxenda / anderes, Pflicht) · Einnahmedauer (4 Stufen, Pflicht) · Zeit seit der letzten Dosis (6 Stufen inkl. „schleiche gerade aus“, Pflicht) · Gewicht seit dem Absetzen (5 Stufen, Pflicht) · Bericht (Freitext, Pflicht) · Rat an andere (Freitext) · Vorname oder Pseudonym · Altersgruppe (5 Stufen) · E-Mail für Rückfragen · drei Pflicht-Checkboxen: eigene Erfahrung; **ausdrückliche Einwilligung** in Speicherung und anonymisierte Veröffentlichung inklusive Gesundheitsangaben (Art. 9 Abs. 2 a DSGVO), mit Widerruf per E-Mail; Datenschutzerklärung gelesen.
- Einleitung nennt: keine medizinische Beratung, keine Namen von Ärzten oder Kliniken, keine Dosierungsempfehlungen an andere.

Vor dem Einbau noch nötig (Coding-Instanz):

1. `src/pages/datenschutz.astro`: Absatz „Erfahrungsberichte“: Zweck (Veröffentlichung anonymisierter Berichte), Rechtsgrundlage Art. 6 Abs. 1 a und Art. 9 Abs. 2 a DSGVO, Verarbeitung über Tally (steht schon als Auftragsverarbeiter drin), Speicherdauer (bis Widerruf, E-Mail nur für Rückfragen und danach gelöscht), Widerruf per E-Mail.
2. Redaktionsregel in `docs/REDAKTION.md`: Berichte werden gekürzt, nie inhaltlich verändert, nur mit Vorname/Pseudonym und Altersgruppe veröffentlicht, ohne Präparat-Dosis-Angaben, die als Anleitung lesbar wären; keine Berichte mit Arzt- oder Klinikname; kein Bericht neben dem Produkt-Teaser (sonst wirkt er als Testimonial für das Set, HWG/UWG); Berichte sind keine Belege für Wirkungen, nur Erfahrungen.
3. Seite `/erfahrungen/` mit Einbettung und Hinweis „Bericht einreichen“, verlinkt aus den Ratgeber-Artikeln, nicht von der Startseite (Vorbestell-Test nicht verwässern).
4. Zwei Testeinträge von Dominik nach dem Publish, dann Löschen in Tally.

## 3. Preis- und Kassenregel-Erhebung

Vorlage mit Ablauf und erster Erhebung: `docs/MARKTRADAR-ERHEBUNG.md`. Kurzfassung der Erstbefüllung (Selbstzahler, niedrigster Versandpreis, 4 Wochen): Wegovy 2,4 mg ca. 280 €, Mounjaro 2,5 mg ca. 205 € bis 15 mg ca. 490 €, Ozempic ca. 100 €, Wegovy-Tabletten 175 bis 280 € je 30 Stück (Marktstart 01.09.2026). GKV zahlt bei Adipositas nicht (§ 34 SGB V), bei Typ-2-Diabetes ja; PKV im Einzelfall, Rechtsprechung uneinheitlich (LG Hanau pro, LG Nürnberg-Fürth contra). BfArM hat die Ozempic/Trulicity-Empfehlungen am 30.03.2026 aufgehoben.

## 4. Keyword-Volumen für Glossar und Pille-Cluster (Semrush-Alternative)

Semrush ist nicht lizenziert. Reihenfolge, die ohne Kosten dieselbe Entscheidung erlaubt:

1. **Search Console, Bericht „Leistung“** (eigene Daten, exakt): Impressionen je Suchanfrage, Filter „Suchanfragen enthält …“. Für Begriffe, für die wir schon erscheinen, ist das die verlässlichste Zahl. Wöchentlich als CSV exportieren (Bericht → Export), Glossar-Begriffe daran messen.
2. **Google Ads Keyword-Planer** (kostenlos mit dem Ads-Konto, das für die 200-€-Kampagne ohnehin entsteht): ohne laufende Kampagne nur Spannen („100 bis 1.000“), mit aktiver Kampagne exakte Monatswerte. Reicht für die Sortierung nach Größe.
3. **Semrush Free-Konto:** nach meiner Kenntnis 10 Abfragen pro Tag in Keyword Overview/Keyword Magic Tool (Limits ändern sich; vor Nutzung prüfen). Für 40 Begriffe sind das vier Tage, kein Geld.
4. **Google Trends** für relative Verläufe und Saisonalität (Vergleich „Abnehmspritze absetzen“ gegen „Abnehmpille absetzen“), keine absoluten Zahlen.

Interpretation: Die Glossar-Begriffe (Set-Point, adaptive Thermogenese, sarkopene Adipositas, Leucin-Schwelle, NEAT, hedonischer Hunger) haben einzeln kleines Volumen; ihr Wert ist Themenautorität und interne Verlinkung, nicht Traffic. Entscheidung nicht am Volumen festmachen, sondern an der Lücke (siehe `docs/SERP-LUECKEN-2026-09-30.md`). Der Pille-Cluster („Abnehmpille absetzen“, „Wegovy Tablette absetzen“, „Tablette oder Spritze“) ist neu und wächst; Volumen entsteht seit dem Marktstart am 01.09.2026, deshalb heute zu früh für Semrush-Zahlen, Search-Console-Impressionen nach vier Wochen sind aussagekräftiger.

## 5. Search Console und Plausible, Stand 30.09.2026

**Plausible** (Site nachderspritze.de, neues Skript `pa-kXdw31zjWlqdlJXD8QACc`, Snippet in `src/layouts/Base.astro`):

- Optionale Messungen in den Site-Einstellungen: **Outbound links an**, File downloads an, Form submissions an. Custom Events per Klassen-Tagging (`plausible-event-name=…`) funktionieren mit dem neuen Skript: Testklick am 30.09.2026 wurde als „Vorbestellen Klick“ gezählt. „Tagged events“ muss also nicht separat aktiviert werden; wer die Einstellung kontrollieren will: Site settings → General → Optional measurements.
- Goals: Vorbestellen Klick, Affiliate Klick (Properties `asin`, `position`), Pageview-Ziel /danke/; Funnel Startseite → Vorbestellen Klick → /danke/; Shared Link für Michi liegt in Site settings → Shared links.
- Offen (Dominik): einmal mit dem normalen Browser die Seite aufrufen und prüfen, dass Pageviews ankommen (der Browser-Pane hier zählt nicht, versteckte Tabs werden ignoriert); eigene IP unter Site settings → Shields ausschließen.

**Search Console** (Property nachderspritze.de, Apex-Host ist kanonisch):

- Sitemap eingereicht (18 URLs). Indexierung beantragt: 13 URLs früher plus /wissen/krafttraining-nach-abnehmspritze/ und /ueber/ am 30.09.; die restlichen 8 aus `docs/INDEXIERUNG.md` sind für 23:20 Uhr eingeplant (Kontingent ~10 Anfragen je 24 h). Ab 01.10. täglich 09:10 Uhr die Routine, wöchentlich sobald alles angemeldet ist.
- Keine API für „Indexierung beantragen“; die Routine klickt in der Oberfläche. IndexNow-Workflow meldet neue URLs an Bing.
- Bing Webmaster Tools: Import aus der Search Console erledigt, Sitemap eingereicht, 13 URLs manuell gemeldet.

## 6. Offene Entscheidungen für Dominik

1. Tally-Formular `ODOJWR` veröffentlichen (ein Klick oder ein „Ja“ an mich).
2. Reviewer-Budget: 120 € je Artikel bei 3 Artikeln pro Woche sind rund 1.500 € im Monat. Wenn zu viel: erst die 10 rankenden Artikel prüfen lassen, neue Artikel erst nach dem Vorbestell-Readout am 20.10.
3. Michi fragen, ob er eine Apothekerin oder Kollegin aus seinem Umfeld empfehlen kann, bevor Plattformen ausgeschrieben werden.
