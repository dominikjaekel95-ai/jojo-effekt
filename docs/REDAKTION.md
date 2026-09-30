# Redaktions-Playbook: wöchentliche Artikel

Gilt für jede Person und jede automatische Routine, die Artikel in `src/content/wissen/` anlegt. Ziel: bis etwa **35 veröffentlichte Artikel** (ohne Entwürfe), drei pro Woche, dann Stopp und Pflege statt Wachstum.

Nur die Dienstags-Routine pusht direkt auf den Produktions-Branch. Alle anderen (Personen und Agenten) arbeiten über Branch, Vercel-Preview und Pull Request, siehe [`CLAUDE.md`](../CLAUDE.md).

## 1. Ablauf einer Ausgabe (drei Artikel)

1. `git pull` auf dem Produktions-Branch. Zählen: `ls src/content/wissen/*.md`, minus Dateien mit `draft: true`. Sind es **35 oder mehr** oder ist kein Thema mehr „offen“, keine neuen Artikel; stattdessen Abschnitt 6 (Pflege) und Abschnitt 7 (Glossar, Marktradar); bei 35 oder mehr die Routine deaktivieren.
2. Aus der Themenliste (Abschnitt 4) die **obersten drei mit Status „offen“** nehmen. Reihenfolge einhalten, sie ist nach Lücke und Nutzen sortiert.
3. Pro Thema recherchieren: Welche Studien belegen die Kernaussagen? Nur zitieren, was in `src/data/sources.ts` steht oder mit vollständigem Zitat und URL neu angelegt wird (Originalarbeit, nicht Pressemeldung). Zahlen ohne Quelle gibt es nicht.
4. Artikel schreiben nach Abschnitt 2, Regeln aus Abschnitt 3 einhalten.
5. Verlinkung: `related` im Frontmatter (drei Slugs), und in **mindestens zwei bestehenden Artikeln** einen Satz mit Link auf den neuen Artikel einfügen, wo er inhaltlich passt.
6. `CLAIMS.md`: pro Artikel eine Zeile in Abschnitt C oder D (welche Aussagen, welche Quelle, Status).
7. Neue Studie im Register? Dann Zeile in `src/data/studien.ts` (Tabelle + `studienLog`) und `studienUpdated` hochsetzen.
8. `npm run check:all` muss ohne Fehler und ohne Treffer durchlaufen (Build, Typen, Textprüfung).
9. Themenliste aktualisieren: Status „offen“ → „live YYYY-MM-DD“ mit Slug. Die neuen URLs als Zeilen mit Status „offen“ in `docs/INDEXIERUNG.md` anhängen.
10. Commit mit Titel „Wochenartikel: <drei Slugs>“, Push auf den Produktions-Branch. Vercel deployt automatisch.
11. Kurzer Bericht: drei URLs, Quellen, was in bestehenden Artikeln geändert wurde, offene Fragen. Hinweis an Dominik: die drei URLs in der Search Console zur Indexierung anmelden.

## 2. Aufbau eines Artikels

Vorlage: jeder bestehende Artikel, z. B. `src/content/wissen/kreatin-abnehmspritze.md`.

- **Frontmatter:** `title` (H1, bis 100 Zeichen), `metaTitle` (≤ 65), `description` (≤ 165), `category` (Jojo-Effekt · Absetzen · Muskeln · Ernährung · Präparate · Plan · Erfahrungen), `order` (nächste freie Zahl), `pubDate` (heute), `keywords` (5–8, Hauptkeyword zuerst), `sources` (IDs in Zitierreihenfolge), `related` (3 Slugs), `faq` (4–6 Fragen mit HTML-Antworten, jede Antwort 2–4 Sätze).
- **Einstieg:** zwei bis vier Sätze, die die Frage des Lesers aufnehmen; Link auf den passenden Grundlagenartikel.
- **„Kurz gesagt“-Blockquote** mit den zwei bis drei Kernzahlen und Fußnoten.
- **Hauptteil:** 900 bis 1.500 Wörter, H2/H3, mindestens eine Tabelle, wo Daten verglichen werden; Fußnoten als `<sup><a href="#fn-ID">n</a></sup>`, Nummer = Position der ID in `sources`.
- **Abschnitt „Wann du zur Ärztin gehst“** oder gleichwertig bei jedem medizinnahen Thema.
- **Schluss (kursiv):** allgemeine Information, kein Ersatz für ärztliche Beratung; Set als „Lebensmittel mit Programm, kein Medikament“. Bei Präparate-Artikeln zusätzlich: keine Werbung für ein Arzneimittel, Markeninhaber nennen.
- Ton: nüchtern, direkt, „du“, keine Superlative, keine Ausrufezeichen, keine Emojis, kein Verkaufston. Sätze unter 25 Wörtern.

## 3. Regeln, die nie gebrochen werden

- **Kein Health Claim für das Set** außer dem zugelassenen Wortlaut (siehe `CLAIMS.md` A). Nie: „verhindert den Jojo-Effekt“, „ersetzt die Spritze“, „von Ärzten empfohlen“, „kurbelt den Stoffwechsel an“.
- **Keine Dosierungsschemata** für Medikamente: keine Titrations-, Ausschleich- oder Wiedereinstiegsschemata. Nur „Dosisstufen laut Fachinformation von x bis y mg“ und „legt die Ärztin fest“.
- **Keine Absetz-Anleitung.** Der Satz „Ob und wie du dein Medikament absetzt, besprichst du mit deiner Ärztin oder deinem Arzt“ steht in der Kurz-gesagt-Box oder im Einstieg, nicht öfter als zweimal pro Artikel.
- **Keine Bewertung von Medikamenten**, keine Bezugsquellen, keine Preise außer als Größenordnung mit „etwa“.
- **Kein „fachlich geprüft“**, solange `reviewer` in `src/data/site.ts` null ist.
- **Keine Nebenwirkungs-, Rezept- oder Kauf-Themen** (Telehealth-Terrain, HWG-Risiko).
- **Keine erfundenen Erfahrungen**, keine Personen, keine Zitate ohne Einwilligung.
- **Jede Zahl mit Quelle.** Ist die Quelle nicht verifizierbar, fällt die Zahl weg, nicht die Quelle wird geschätzt.
- Medikamentennamen nur in Präparate-Artikeln und in Keywords, nie auf der Startseite, nie in Anzeigentexten.
- Ein Suchintent = eine URL. Vor dem Schreiben prüfen, ob ein bestehender Artikel das Thema schon abdeckt; dann dort erweitern statt neu anlegen.
- **Erfahrungsberichte** (Tally-Formular `ODOJWR`, noch Entwurf): werden gekürzt, nie inhaltlich verändert, nur mit Vorname oder Pseudonym und Altersgruppe veröffentlicht, ohne Dosisangaben, die als Anleitung lesbar wären, ohne Arzt- oder Klinikname, nie neben dem Produkt-Teaser (sonst Testimonial für das Set, HWG/UWG). Berichte sind Erfahrungen, keine Belege für Wirkungen. Details: `docs/RECHERCHE-2026-09-30-marktradar.md`, Abschnitt 2.
- **Reviewer** (sobald vorhanden): nur auf Ratgeber-Artikeln, nie auf Startseite, Produktseite, Danke-Seite oder neben Affiliate-Listen (HCVO Art. 12 c). Der Reviewer prüft die Fakten des Artikels, nicht das Produkt. Details: `docs/RECHERCHE-2026-09-30-marktradar.md`, Abschnitt 1.

## 4. Themenliste (Reihenfolge = Priorität)

Status-Werte: `offen` (frei; die Routine nimmt die obersten drei davon), `in Arbeit · <Name> · <Datum>` (beansprucht, die Routine überspringt es), `live YYYY-MM-DD · <slug>`. Wer ein Thema manuell schreibt, setzt es vorher auf `in Arbeit` und mergt diese Zeile sofort.

Grundsatz für die Reihenfolge (Dominik, 30.09.2026): **Lücken zuerst, Head-Terms später.** Anfragen, die in `docs/SERP-LUECKEN-2026-09-30.md` als STARK oder MITTEL stehen, kommen vor den dichten Head-Terms, die nur mit Autorität zu gewinnen sind. Der Abnehmpillen-Cluster (Themen 4 bis 8) hat Vorrang: Die Wegovy-Tablette ist seit September 2026 auf dem Markt, das Suchvolumen entsteht gerade, und noch hat niemand Absetz-Inhalte dazu; wer im Oktober dort steht, hält die Plätze. Neue Themen kommen unten an die Liste, außer es ist eine STARK-Lücke mit Produktbezug; die kommt direkt hinter den Pillen-Cluster. Nie ein Thema aus der Mitte vorziehen, nur weil es leichter ist.

| # | Thema / Arbeitstitel | Hauptkeyword | Warum | Status |
|---|---|---|---|---|
| 1 | Krafttraining nach der Abnehmspritze: 30-Minuten-Plan | krafttraining nach abnehmspritze | Lücke, führt ins Programm | live 2026-10-01 · krafttraining-nach-abnehmspritze |
| 2 | Heißhunger nach dem Absetzen | heißhunger nach abnehmspritze | Schmerzfrage ohne Antwort | live 2026-10-01 · heisshunger-nach-abnehmspritze |
| 3 | Saxenda absetzen | saxenda absetzen | Null Wettbewerb, S-LiTE ist Liraglutid | live 2026-10-01 · saxenda-absetzen |
| 4 | Abnehmpille absetzen: was aus den Spritzen-Studien übertragbar ist und was nicht · /wissen/abnehmpille-absetzen/ | abnehmpille absetzen | Dominik 30.09.: Cluster vorgezogen. Wegovy-Tablette (Semaglutid 25 mg) seit 1.9.2026 in deutschen Apotheken (EU-Zulassung 15.7.2026), Lilly-Tablette Orforglipron (USA seit 4/2026) nur als Ausblick, keine EU-Zulassung. Kernaussage: Absetz-Daten gibt es nur für die Spritze (STEP-1-Extension, S-LiTE), für die Tablette noch keine; gleicher Wirkstoff, Halbwertszeit laut Fachinfo. Einnahmeregeln (nüchtern) höchstens als ein Fachinfo-Satz, keine Anleitung. Preise nur als Größenordnung. Markeninhaber nennen | offen |
| 5 | Wegovy-Tablette absetzen: Studienlage und Fachinformation · /wissen/wegovy-tablette-absetzen/ | wegovy tablette absetzen | Markenseite wie wegovy-absetzen, aber für die Tablette: OASIS-4-Ergebnisse (Gewichtsverlust, Abbruchraten, Nebenwirkungen nur als Zahl aus der Studie), keine Absetz-Studie, Verweis auf STEP-1-Extension. Keywords auch „wegovy pille absetzen“, „wegovy tabletten absetzen“. Rybelsus (Semaglutid-Tablette für Typ-2-Diabetes, seit 2020) als Abschnitt erwähnen, eigener Artikel nur bei Nachfrage | offen |
| 6 | Tablette oder Spritze: Unterschiede für die Zeit danach · /wissen/abnehmpille-oder-spritze/ | abnehmpille oder spritze | Rein faktischer Vergleich: Wirksamkeit laut Studien (OASIS 4, STEP 1, STEP UP, SURMOUNT-1), Halbwertszeit, Alltag laut Fachinfo, Datenlage nach dem Absetzen; keine Bewertung, keine Empfehlung, keine Preise außer Größenordnung | offen |
| 7 | Abnehmpille und Muskelabbau · /wissen/abnehmpille-muskelabbau/ | abnehmpille muskelabbau | Körperzusammensetzung: nur, was OASIS 4 berichtet (prüfen, ob DXA-Daten publiziert sind); sonst Übertrag aus der STEP-1-DXA-Substudie mit klarer Kennzeichnung als Übertrag; Links auf Protein-, Krafttraining- und Kreatin-Artikel | offen |
| 8 | Abnehmpille und Jojo-Effekt · /wissen/abnehmpille-jojo-effekt/ | abnehmpille jojo effekt | Nur schreiben, wenn die Abgrenzung zu #4 klar ist: hier Mechanismus und Zahlen zur Wiederzunahme (Set-Point, STEP-1-Extension), in #4 der Ablauf und die Datenlücke. Sonst als Abschnitt in #4 und Thema auf „entfällt“ setzen | offen |
| 9 | Ballaststoffe bei der Abnehmspritze: 30 g schaffen, Verstopfung vermeiden · /wissen/ballaststoffe-abnehmspritze/ | ballaststoffe abnehmspritze | SERP-Check: STARK, direkter Bezug zum Stick; nur DGE-Zahlen und zugelassener Glucomannan-Claim, Verstopfung als Fachinfo-Zitat, nicht bewertet; mit Ernährungsartikel gegenseitig verlinken | offen |
| 10 | Proteinshake bei der Abnehmspritze: welcher, wie viel, wann · /wissen/proteinshake-abnehmspritze/ | proteinshake abnehmspritze | SERP-Check: STARK, Kaufintention; Abgrenzung zum Protein-Artikel über Intention „Produktwahl“ statt „Bedarf“ | offen |
| 11 | Abnehmspritze pausieren: Urlaub, Lieferengpass, Krankheit · /wissen/abnehmspritze-pausieren/ | abnehmspritze pausieren | SERP-Check: STARK; rein informativ, Fachinfo-Angaben zu versäumten Dosen wörtlich zitieren, keine eigene Dosierempfehlung, Pflichtsatz oben | offen |
| 12 | Wie lange sollte man die Abnehmspritze nehmen? Was Studien und Fachinformation sagen · /wissen/abnehmspritze-wie-lange-nehmen/ | wie lange abnehmspritze nehmen | Dominik 30.09.: hohe Nachfrage. Nur Studienlage (STEP-1-Extension, SELECT, S-LiTE, SURMOUNT-4) und wörtliche Fachinfo-Kriterien zur Weiterbehandlung; keine eigene Dauer-Empfehlung, keine Dosierung, Pflichtsatz oben. Abgrenzung: #15 (Ausschleichen) ist das „Wie“, dieser Artikel das „Wie lange“ | offen |
| 13 | Abnehmspritze und Alkohol: was sich unter und nach der Therapie ändert · /wissen/abnehmspritze-alkohol/ | abnehmspritze alkohol | Dominik 30.09.: hohe Nachfrage. Kein Nebenwirkungsartikel. Studien zu verringertem Alkoholkonsum unter Semaglutid (z. B. Hendershot 2025, JAMA Psychiatry) nur als Forschungsstand, kein Off-Label-Hinweis, keine Empfehlung zum Trinken unter Therapie; Fachinfo-Angaben (Unterzuckerung mit Insulin/Sulfonylharnstoffen) wörtlich. Schwerpunkt: Alkohol als Kalorienquelle und Verlangen nach dem Absetzen | offen |
| 14 | Muskeln wieder aufbauen nach der Abnehmspritze | muskeln aufbauen nach abnehmspritze | Umkehrfrage zu Muskelabbau | offen |
| 15 | Abnehmspritze ausschleichen: Was die Studien zeigen | abnehmspritze ausschleichen | SERP-Check: MITTEL, widersprüchlich; streng ohne Schema, nur Studienlage | offen |
| 16 | Gewicht halten ohne Abnehmspritze | gewicht halten ohne abnehmspritze | Oviva besetzt „abnehmen ohne“, „halten ohne“ ist frei | offen |
| 17 | Abnehmspritze absetzen: Checkliste für das Arztgespräch | abnehmspritze absetzen arzt fragen | Nutzwert, stärkt den Pflichtsatz | offen |
| 18 | Wegovy oder Mounjaro: Unterschiede beim Absetzen | wegovy mounjaro absetzen unterschied | Vergleich rein faktisch (Halbwertszeit, Studien), keine Bewertung | offen |
| 19 | Blutzucker nach dem Absetzen der Abnehmspritze bei Typ-2-Diabetes | abnehmspritze absetzen blutzucker | Diabetes-Gruppe, hohe Relevanz | offen |
| 20 | Schlaf und Gewicht nach der Abnehmspritze | schlaf abnehmspritze gewicht | Spiegel 2004 u. a., kaum bedient | offen |
| 21 | Sarkopenie: Abnehmspritze ab 60 und Muskelerhalt | abnehmspritze ab 60 muskeln | Ältere Zielgruppe, Kreatin-55+-Angabe | offen |
| 22 | Abnehmspritze absetzen wegen Kosten: Optionen ehrlich sortiert | abnehmspritze zu teuer absetzen | Häufigster Absetzgrund; Preise nur als Größenordnung | offen |
| 23 | Erfahrungen (Vorlage liegt als Entwurf) | abnehmspritze absetzen erfahrungen | Erst mit ≥ 5 echten Berichten | wartet auf Berichte |

**Nicht anfassen** (SERP-Check 30.09.): Erhaltungsdosis (Dosierung, HWG), Schwangerschaft (medizinisch heikel), Plateau (Thema „während“, ZAVA hat es), Head-Terms (nur über Autorität). Details und die Bewertung aller 33 Anfragen: `docs/SERP-LUECKEN-2026-09-30.md`.

Stand 30.09.: 14 Artikel live, 19 Themen offen. Die Routine schreibt drei pro Dienstag (6.10.: #4–#6, 13.10.: #7–#9, 20.10.: #10–#12, 27.10.: #13–#15, danach weiter) und stoppt bei 35 veröffentlichten Artikeln oder wenn kein Thema mehr „offen“ ist; dann Pflege. Neue Themen von Dominik werden nach Nachfrage einsortiert, nicht automatisch ans Ende gehängt.

Regeln für den Abnehmpille-Cluster (#4–#8), zusätzlich zu Abschnitt 3: Die Tablette ist ein verschreibungspflichtiges Arzneimittel wie die Spritze. Einnahmeregeln höchstens als ein Satz „laut Fachinformation“, keine Anleitung. Nebenwirkungen nur als Studienzahl (OASIS 4), nicht als Ratgeber. Absetz-Daten für die Tablette gibt es noch nicht; das ist die Kernaussage jedes Artikels, nicht ein Nebensatz. Keine Aussage, dass die Tablette „leichter abzusetzen“ sei.

## 4a. Schnelle Gewinne in bestehenden Artikeln (Stand 01.10.2026)

Erledigt: Kreatin-Artikel mit Abschnitten Wegovy/Mounjaro/Ozempic und drei FAQ; Muskelabbau-Artikel mit „Woran du Muskelabbau erkennst“ und prominentem Kreatin-Link; Absetzen-Artikel mit „Was beim Absetzen körperlich passiert“ und „Wiedereinstieg“; Präparate-Links aus Jojo- und Absetzen-Artikel. Offen: Erfahrungen-Seite (wartet auf Berichte).

Offen (Vorschlag als erste Aufgabe für Michis Agenten, per Pull Request):
- `wegovy-absetzen.md`: Abschnitt „Gilt das auch für die Wegovy-Tablette?“ (seit 1.9.2026 in Apotheken; gleicher Wirkstoff; Absetz-Daten nur für die Spritze; Link auf #5, sobald live, vorher auf #4).
- `ozempic-absetzen.md` und `mounjaro-absetzen.md`: je ein Satz zur Tablettenlage (Ozempic: Rybelsus ist die Tabletten-Form für Typ-2-Diabetes; Mounjaro: keine Tablette, Orforglipron ohne EU-Zulassung).
- `src/data/studien.ts`: OASIS 4 aufnehmen mit Vermerk „keine Absetz-Daten“, `studienUpdated` hochsetzen.
- `abnehmspritze-absetzen.md` und `jojo-effekt-abnehmspritze.md`: je ein Satz, dass die Aussagen zur Zeit danach aus Spritzen-Studien stammen und für die Tablette noch nicht untersucht sind.

## 5. Nach dem Push (Dominik, 5 Minuten)

- Search Console → URL-Prüfung → „Indexierung beantragen“ für jede URL mit Status „offen“ in `docs/INDEXIERUNG.md`; danach dort „angemeldet YYYY-MM-DD“ eintragen.
- Ein Community-Post pro Woche mit einem der neuen Artikel, sachlich (siehe `ADS.md` Abschnitt 5).

## 7. Glossar und Marktradar (jede Ausgabe)

- **Glossar-Begriffe verwenden.** Jeder neue Artikel nutzt mindestens zwei Begriffe aus `src/content/glossar/` wörtlich (Haltephase, Absetzkurve, fettfreie Masse, Halbwertszeit, Auswaschphase, Set-Point, Muskelproteinsynthese usw.). Die Box „Begriffe in diesem Artikel“ verlinkt sie automatisch, und die Glossar-Seite listet den Artikel unter „Vertiefende Artikel“. Das ist die interne Verlinkung, die ohne Handarbeit wächst.
- **Fehlender Begriff:** Eintrag nach der Vorlage `src/content/glossar/set-point-theorie.md` anlegen (150–300 Wörter, eine Zahl mit Quelle, Link auf den vertiefenden Artikel; `metaTitle` ≤ 65, `description` ≤ 165, `short` ≤ 260; `own: false`). URL in `docs/INDEXIERUNG.md` eintragen. Keine neuen eigenen Begriffe ohne Dominik.
- **Marktradar-Kandidaten prüfen.** `docs/RADAR-KANDIDATEN.json` enthält montags automatisch gesammelte Studien und Behördenmeldungen (Status „neu“, Vorsortierung `relevanz`). Der Abruf kommt als Pull Request „Marktradar: automatischer Abruf“ und ist erst nach Dominiks Merge im Repo; ist er am Dienstag noch offen, mit dem vorhandenen Stand arbeiten und im Bericht darauf hinweisen. Pro Kandidat die Originalquelle öffnen. Relevant sind: Absetzen und Zeit danach, Körperzusammensetzung, Zulassungen, Marktstarts, Kassenregeln, Lieferbarkeit. Relevante Kandidaten (höchstens drei pro Woche) als Eintrag in `src/data/markt/radar.json` anlegen: Felder wie die bestehenden, `teaser` ohne Markennamen von Arzneimitteln, `summary` mit Zahlen aus der Originalquelle, `source` mit URL, `type` aus zulassung/markt/preis/kasse/lieferbarkeit/studie; `stand` auf das heutige Datum. Status in der Kandidatendatei auf „geprueft“ oder „verworfen“ setzen. Neue Absetz-Studien zusätzlich in `src/data/studien.ts` und `src/data/sources.ts`. Nichts ungeprüft übernehmen.
- **Nicht anfassen:** `src/data/markt/preise.json`, `kassen.json`, `zulassungen.json` (Dominik, mit Stand-Datum) und `lieferbarkeit.json` (schreibt die Aktion).

## 6. Pflege statt Wachstum (ab 35 Artikeln)

- Monatlich: Search Console lesen; Artikel mit vielen Impressionen und wenigen Klicks bekommen einen besseren Title/Description.
- Alle zwei Wochen: einen bestehenden Artikel aktualisieren (neuer Absatz, neue Studie), `updatedDate` setzen.
- Bei jeder neuen Absetz-Studie: Tracker ergänzen.
- Erfahrungsberichte veröffentlichen, sobald fünf echte vorliegen.
