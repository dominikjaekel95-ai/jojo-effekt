# Briefing: fachliche Prüfung der Artikel auf nachderspritze.de

Für eine freiberufliche Apothekerin, einen Apotheker oder eine Ärztin/einen Arzt, die oder der die Artikel gegen die zitierten Quellen prüft und mit Namen auf der Seite erscheint. Grundlage: `docs/RECHERCHE-2026-09-30-marktradar.md`, Abschnitt 1. Ansprechpartner: Dominik Jäkel, dominik@nachderspritze.de.

## Worum es geht

nachderspritze.de ist ein deutschsprachiger Wissensbereich zur Zeit nach dem Absetzen von GLP-1-Medikamenten (Semaglutid, Tirzepatid, Liraglutid): Jojo-Effekt, Muskelabbau, Protein, Krafttraining, Kreatin, Ballaststoffe. Jede Zahl verweist per Fußnote auf die Originalstudie (`src/data/sources.ts`). Daneben gibt es einen Studien-Tracker, ein Glossar und einen Marktradar. Die Seite wirbt für ein geplantes Lebensmittel-Set (Protein-, Ballaststoff-, Kreatin-Sticks plus Trainingsprogramm); es ist kein Medikament, und die Seite gibt keine Dosierungs- oder Absetz-Anleitungen.

Gesucht ist keine Sprachkorrektur, sondern eine fachliche Prüfung: Stimmt jede Aussage mit der genannten Quelle überein, und ist nichts dabei, was über die Quelle oder über das rechtlich Erlaubte hinausgeht?

## Was geprüft wird (je Artikel)

1. **Jede Zahl und jede Studienaussage ist durch die verlinkte Quelle gedeckt.** Studiendaten sind in `src/data/studien.ts` zusammengefasst; die Fußnoten stehen unter jedem Artikel mit Link.
2. **Keine Aussage geht über die freigegebenen Angaben in `CLAIMS.md` hinaus.** Formulierungen zu Protein, Kreatin und Ballaststoffen exakt im Wortlaut der EU-zugelassenen Health Claims (VO (EU) 432/2012, 2017/672).
3. **Mengen-, Zeit- und Warnhinweise sind korrekt und vollständig:** Kreatin 3 g pro Tag; Glucomannan 3 × 1 g mit ein bis zwei Gläsern Wasser vor den Mahlzeiten mit Erstickungswarnung; Halbwertszeiten laut Fachinformation; Ausschleichen und Absetzen nur mit Ärztin oder Arzt.
4. **Kein Heilversprechen, keine Diagnose, kein Rat, der die ärztliche Entscheidung ersetzt.** Der Verweis auf Ärztin oder Arzt steht an den richtigen Stellen.
5. **Fachbegriffe stimmen** (Halbwertszeit, Auswaschphase, Set-Point, telogenes Effluvium, sarkopene Adipositas usw.), und die Laienübersetzung ist nicht falsch vereinfacht. Die Definitionen stehen im Glossar (`src/content/glossar/`).
6. **Rückgabe:** Liste der Änderungen mit Begründung und Quelle. „Fachlich geprüft am …“ wird erst gesetzt, wenn die Änderungen eingearbeitet sind.

## Was der Reviewer nicht prüft

Das Produkt. Die Prüfung gilt den Ratgeber-Artikeln und dem Glossar. Die Reviewer-Zeile steht nur auf Artikeln, nie auf der Startseite, der Produktseite, der Danke-Seite oder neben Affiliate-Listen (HCVO Art. 12 c: keine gesundheitsbezogenen Angaben mit Verweis auf Empfehlungen einzelner Ärzte oder Fachleute). Auf Artikeln mit Produkt-Teaser steht die Reviewer-Zeile oben am Text, der Teaser unten.

## Darstellung auf der Seite

- Zeile auf dem Artikel: „Fachlich geprüft von <Name>, <Apothekerin / Fachärztin für …>, am <Datum>“, mit Link auf das Profil.
- Profil-Seite: Name, Qualifikation (Approbation, Fachgebiet, Berufsjahre), was geprüft wird, Interessenkonflikt-Erklärung (Honorar pro Artikel, keine Beteiligung am Produkt oder Umsatz), Hinweis „keine individuelle Beratung; bei Beschwerden zur Ärztin oder zum Arzt“. Schema.org `Person` mit `jobTitle`; Artikel bekommen `reviewedBy` im JSON-LD (technisch vorbereitet über `reviewer` in `src/data/site.ts`).
- Kein Impressum-Eintrag nötig; Diensteanbieter und Verantwortlicher nach § 18 Abs. 2 MStV bleibt Dominik Jäkel.
- Für Ärztinnen und Ärzte zusätzlich: § 27 MBO-Ä (berufswidrige Werbung). Fachliche Prüfung von Aufklärungstexten ist zulässig, Produktwerbung mit Arztnamen nicht; für Klinikärzte gilt die Nebentätigkeitsanzeige.

## Umfang, Honorar, Ablauf (Vorschlag)

| Position | Umfang | Honorar (netto) |
|---|---|---|
| Startpaket | 10 bestehende Artikel, je bis 1.500 Wörter | 1.000 € |
| Laufend | je Artikel bis 1.500 Wörter, inklusive Quellencheck, eine Korrekturrunde, Rückmeldung in 5 Werktagen | 120 € (längere Artikel 150 €) |
| Alternative | Monatsretainer: bis 4 Artikel plus Monatscheck des Marktradars | 400 € |

Ablauf: Artikel als Link (Live-Seite) plus Quellenliste; Rückgabe als Änderungsliste (Textstelle, Änderung, Begründung, Quelle) per E-Mail oder als Kommentar im Google-Doc; Einarbeitung durch die Redaktion; Freigabe durch den Reviewer; dann Datum und Name auf dem Artikel.

## Vertrag (Eckpunkte)

Kurze Honorarvereinbarung (Werkvertrag): Leistung (Prüfung auf fachliche Richtigkeit nach aktuellem Stand und gegen die genannten Quellen), Frist, Honorar, Namensnennung und Foto mit Widerrufsrecht für die Zukunft (bestehende Artikel behalten Prüfdatum und Name), Interessenkonflikt-Erklärung, Haftungsbegrenzung auf Vorsatz und grobe Fahrlässigkeit, keine Beratung von Lesern. Freiberufler stellen Rechnung (§ 18 EStG), häufig ohne Umsatzsteuer (Kleinunternehmer).

## Erste Artikel zur Prüfung (Vorschlag nach Sichtbarkeit)

1. /wissen/kreatin-abnehmspritze/ (rankt auf Platz 1 für „kreatin abnehmspritze“)
2. /wissen/muskelabbau-abnehmspritze/
3. /wissen/abnehmspritze-absetzen/
4. /wissen/jojo-effekt-abnehmspritze/
5. /wissen/protein-abnehmspritze/
6. /wissen/gewicht-halten-nach-abnehmspritze/
7. /wissen/wegovy-absetzen/
8. /wissen/krafttraining-nach-abnehmspritze/
9. /wissen/supplements-nach-abnehmspritze/
10. /wissen/ernaehrung-nach-abnehmspritze/

Danach das Glossar (20 Einträge, je 150 bis 300 Wörter) als ein Paket.

## Offen (Entscheidung Dominik)

- Budget: 120 € je Artikel bei drei Artikeln pro Woche sind rund 1.500 € im Monat. Alternative: erst die zehn rankenden Artikel, neue Artikel erst nach dem Vorbestell-Readout am 20.10.
- Kanal: zuerst Michis Umfeld (Klinikapotheke, Ernährungsmedizin, Diabetologie), dann LinkedIn, freelance.de, freelancermap, EMWA-Verzeichnis; Agentur nur als Fallback ohne Namensnennung.
- Michi selbst ist als Mitgründer und Klinikarzt nicht der genannte Reviewer (Interessenkonflikt, Nebentätigkeit); er bleibt interner Faktencheck.
