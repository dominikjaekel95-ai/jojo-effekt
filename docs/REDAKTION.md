# Redaktions-Playbook: wöchentliche Artikel

Gilt für jede Person und jede automatische Routine, die Artikel in `src/content/wissen/` anlegt. Ziel: bis etwa **25 veröffentlichte Artikel** (ohne Entwürfe), drei pro Woche, dann Stopp und Pflege statt Wachstum.

Nur die Dienstags-Routine pusht direkt auf den Produktions-Branch. Alle anderen (Personen und Agenten) arbeiten über Branch, Vercel-Preview und Pull Request, siehe [`CLAUDE.md`](../CLAUDE.md).

## 1. Ablauf einer Ausgabe (drei Artikel)

1. `git pull` auf dem Produktions-Branch. Zählen: `ls src/content/wissen/*.md`, minus Dateien mit `draft: true`. Sind es **25 oder mehr**, keine neuen Artikel; stattdessen Abschnitt 6 (Pflege) und die Routine deaktivieren.
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

## 4. Themenliste (Reihenfolge = Priorität)

Status-Werte: `offen` (frei; die Routine nimmt die obersten drei davon), `in Arbeit · <Name> · <Datum>` (beansprucht, die Routine überspringt es), `live YYYY-MM-DD · <slug>`. Wer ein Thema manuell schreibt, setzt es vorher auf `in Arbeit` und mergt diese Zeile sofort.

| # | Thema / Arbeitstitel | Hauptkeyword | Warum | Status |
|---|---|---|---|---|
| 1 | Krafttraining nach der Abnehmspritze: 30-Minuten-Plan | krafttraining nach abnehmspritze | Lücke, führt ins Programm | live 2026-10-01 · krafttraining-nach-abnehmspritze |
| 2 | Heißhunger nach dem Absetzen | heißhunger nach abnehmspritze | Schmerzfrage ohne Antwort | live 2026-10-01 · heisshunger-nach-abnehmspritze |
| 3 | Saxenda absetzen | saxenda absetzen | Null Wettbewerb, S-LiTE ist Liraglutid | live 2026-10-01 · saxenda-absetzen |
| 4 | Ballaststoffe bei der Abnehmspritze: 30 g schaffen, Verstopfung vermeiden · /wissen/ballaststoffe-abnehmspritze/ | ballaststoffe abnehmspritze | SERP-Check: STARK, direkter Bezug zum Stick; nur DGE-Zahlen und zugelassener Glucomannan-Claim, Verstopfung als Fachinfo-Zitat, nicht bewertet; mit Ernährungsartikel gegenseitig verlinken | offen |
| 5 | Proteinshake bei der Abnehmspritze: welcher, wie viel, wann · /wissen/proteinshake-abnehmspritze/ | proteinshake abnehmspritze | SERP-Check: STARK, Kaufintention; Abgrenzung zum Protein-Artikel über Intention „Produktwahl“ statt „Bedarf“ | offen |
| 6 | Abnehmspritze pausieren: Urlaub, Lieferengpass, Krankheit · /wissen/abnehmspritze-pausieren/ | abnehmspritze pausieren | SERP-Check: STARK; rein informativ, Fachinfo-Angaben zu versäumten Dosen wörtlich zitieren, keine eigene Dosierempfehlung, Pflichtsatz oben | offen |
| 7 | Wie lange sollte man die Abnehmspritze nehmen? Was Studien und Fachinformation sagen · /wissen/abnehmspritze-wie-lange-nehmen/ | wie lange abnehmspritze nehmen | Dominik 30.09.: hohe Nachfrage. Nur Studienlage (STEP-1-Extension, SELECT, S-LiTE, SURMOUNT-4) und wörtliche Fachinfo-Kriterien zur Weiterbehandlung; keine eigene Dauer-Empfehlung, keine Dosierung, Pflichtsatz oben. Abgrenzung: #10 (Ausschleichen) ist das „Wie“, dieser Artikel das „Wie lange“ | offen |
| 8 | Abnehmspritze und Alkohol: was sich unter und nach der Therapie ändert · /wissen/abnehmspritze-alkohol/ | abnehmspritze alkohol | Dominik 30.09.: hohe Nachfrage. Kein Nebenwirkungsartikel. Studien zu verringertem Alkoholkonsum unter Semaglutid (z. B. Hendershot 2025, JAMA Psychiatry) nur als Forschungsstand, kein Off-Label-Hinweis, keine Empfehlung zum Trinken unter Therapie; Fachinfo-Angaben (Unterzuckerung mit Insulin/Sulfonylharnstoffen) wörtlich. Schwerpunkt: Alkohol als Kalorienquelle und Verlangen nach dem Absetzen | offen |
| 9 | Muskeln wieder aufbauen nach der Abnehmspritze | muskeln aufbauen nach abnehmspritze | Umkehrfrage zu Muskelabbau | offen |
| 10 | Abnehmspritze ausschleichen: Was die Studien zeigen | abnehmspritze ausschleichen | SERP-Check: MITTEL, widersprüchlich; streng ohne Schema, nur Studienlage | offen |
| 11 | Gewicht halten ohne Abnehmspritze | gewicht halten ohne abnehmspritze | Oviva besetzt „abnehmen ohne“, „halten ohne“ ist frei | offen |
| 12 | Abnehmspritze absetzen: Checkliste für das Arztgespräch | abnehmspritze absetzen arzt fragen | Nutzwert, stärkt den Pflichtsatz | offen |
| 13 | Wegovy oder Mounjaro: Unterschiede beim Absetzen | wegovy mounjaro absetzen unterschied | Vergleich rein faktisch (Halbwertszeit, Studien), keine Bewertung | offen |
| 14 | Blutzucker nach dem Absetzen der Abnehmspritze bei Typ-2-Diabetes | abnehmspritze absetzen blutzucker | Diabetes-Gruppe, hohe Relevanz | offen |
| 15 | Schlaf und Gewicht nach der Abnehmspritze | schlaf abnehmspritze gewicht | Spiegel 2004 u. a., kaum bedient | offen |
| 16 | Sarkopenie: Abnehmspritze ab 60 und Muskelerhalt | abnehmspritze ab 60 muskeln | Ältere Zielgruppe, Kreatin-55+-Angabe | offen |
| 17 | Abnehmspritze absetzen wegen Kosten: Optionen ehrlich sortiert | abnehmspritze zu teuer absetzen | Häufigster Absetzgrund; Preise nur als Größenordnung | offen |
| 18 | Erfahrungen (Vorlage liegt als Entwurf) | abnehmspritze absetzen erfahrungen | Erst mit ≥ 5 echten Berichten | wartet auf Berichte |

**Nicht anfassen** (SERP-Check 30.09.): Erhaltungsdosis (Dosierung, HWG), Schwangerschaft (medizinisch heikel), Plateau (Thema „während“, ZAVA hat es), Head-Terms (nur über Autorität). Details und die Bewertung aller 33 Anfragen: `docs/SERP-LUECKEN-2026-09-30.md`.

Nach Nummer 17 sind es 28 Artikel. Die Routine stoppt bei 25 veröffentlichten Artikeln; was dann noch „offen“ ist, schreiben Dominik oder Michi manuell über einen Pull Request. Neue Themen von Dominik werden nach Nachfrage einsortiert, nicht automatisch ans Ende gehängt.

## 4a. Schnelle Gewinne in bestehenden Artikeln (Stand 01.10.2026)

Erledigt: Kreatin-Artikel mit Abschnitten Wegovy/Mounjaro/Ozempic und drei FAQ; Muskelabbau-Artikel mit „Woran du Muskelabbau erkennst“ und prominentem Kreatin-Link; Absetzen-Artikel mit „Was beim Absetzen körperlich passiert“ und „Wiedereinstieg“; Präparate-Links aus Jojo- und Absetzen-Artikel. Offen: Erfahrungen-Seite (wartet auf Berichte).

## 5. Nach dem Push (Dominik, 5 Minuten)

- Search Console → URL-Prüfung → „Indexierung beantragen“ für jede URL mit Status „offen“ in `docs/INDEXIERUNG.md`; danach dort „angemeldet YYYY-MM-DD“ eintragen.
- Ein Community-Post pro Woche mit einem der neuen Artikel, sachlich (siehe `ADS.md` Abschnitt 5).

## 6. Pflege statt Wachstum (ab 25 Artikeln)

- Monatlich: Search Console lesen; Artikel mit vielen Impressionen und wenigen Klicks bekommen einen besseren Title/Description.
- Alle zwei Wochen: einen bestehenden Artikel aktualisieren (neuer Absatz, neue Studie), `updatedDate` setzen.
- Bei jeder neuen Absetz-Studie: Tracker ergänzen.
- Erfahrungsberichte veröffentlichen, sobald fünf echte vorliegen.
