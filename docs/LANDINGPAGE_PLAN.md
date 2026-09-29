# „Nach der Spritze" · Landingpage-Test · Plan für Claude Code
Stand 29.09.2026 · Ziel: live bis Donnerstag, 01.10.2026 · Budget < 300 € · Codename `nachderspritze`

## 0. Was der Test beweisen soll
Zahlen Menschen, die die Abnehmspritze absetzen (oder das vorhaben), 49 €/Monat bzw. 129 € für ein 12-Wochen-Set aus Protein-Stick, Ballaststoff-Stick, Kreatin und Programm? Messgröße: **Vorbestell-Absichten** (Klick auf „Vorbestellen" → E-Mail plus Häkchen „Ich würde 129 € zahlen"). Kill-Grenze: unter 30 Vorbestellungen nach 3 Wochen und 200 € Anzeigen. Kein Geld einziehen im Test (Fake-Door), das spart AGB, Widerruf, Gewerbe und Zahlungsabwicklung; das kommt erst, wenn der Test positiv ist.

## 1. Stack und Hosting (alles kostenlos, in Minuten)
- **Seite:** Astro (statisch, schnell, Tailwind), eine Seite plus `/impressum`, `/datenschutz`, `/danke`. Kein CMS.
- **Hosting:** GitHub-Repo → Vercel (kostenloser Hobby-Plan, Region Frankfurt wählen) oder Cloudflare Pages. Deploy bei jedem Push, Preview-URL sofort, eigene Domain per CNAME in 10 Minuten.
- **Domain:** bei INWX, Cloudflare Registrar oder Namecheap, 5–15 €/Jahr. Kandidaten prüfen: nachderspritze.de, nach-der-spritze.de, spritzefrei.de. Heute Abend kaufen, sonst wartet ihr auf DNS.
- **Formular (DSGVO-sicher, EU):** Tally (Belgien, kostenlos) eingebettet, oder Formbricks (Deutschland). Kein Formspree/Netlify Forms (US). Felder: E-Mail, „Ich nehme aktuell / habe abgesetzt / überlege", Häkchen „Ich würde 129 € für 12 Wochen zahlen", optional Freitext „Was bräuchtest du?".
- **Analytics ohne Cookie-Banner:** Plausible (EU, 9 €/Monat, 30 Tage kostenlos) oder Umami. Kein Google Analytics.
- **Bilder:** eigene Produkt-Mockups (Sachets, Box) mit generierten Bildern oder schlichte Illustrationen; keine Stock-Fotos von Spritzen, keine Markennamen der Medikamente.

## 2. Zeitplan
**Heute Abend (2–3 h):** Repo, Seite mit Platzhaltertext, Formular, Vercel-Preview. Domain kaufen.
**Mittwoch:** Texte final (Dominik), Impressum und Datenschutz, Domain verbinden, Plausible, Google-Ads-Konto anlegen und Kampagne einreichen (Freigabe dauert oft 1–2 Tage, deshalb Mittwoch, nicht Donnerstag). Meta-Ads als zweiter Kanal optional.
**Donnerstag:** live, Anzeigen laufen, erster Post in zwei bis drei deutschen GLP-1-Communities (Reddit r/Abnehmspritze o. ä., Facebook-Gruppen), sachlich, ohne Spam.
**Nach 3 Wochen:** Auswertung: Besucher, Klickrate auf „Vorbestellen", Formular-Abschlüsse, Anteil mit 129-€-Häkchen, Freitext-Muster.

## 3. Rechtliches auf der Seite (Pflicht, auch beim Test)
- **Impressum** (§ 5 DDG): voller Name, Anschrift, E-Mail. Solange kein Verkauf, reicht Dominik als Privatperson bzw. Projekt; ab dem ersten Verkauf braucht es ein Gewerbe und die Prüfung der Nebentätigkeitsklausel im Arbeitsvertrag.
- **Datenschutzerklärung:** Tally, Plausible, Vercel nennen; Zweck „Warteliste/Vorbestell-Interesse"; Double-Opt-in für die E-Mail-Liste; Löschung auf Anfrage.
- **Health Claims:** nur zugelassene Formulierungen. Erlaubt: „Protein trägt zur Erhaltung von Muskelmasse bei", „Kreatin erhöht die körperliche Leistung bei Schnellkrafttraining", Glucomannan-Gewichts-Claim nur mit 3 g/Tag und Hinweis auf kalorienarme Ernährung. Verboten: „verstärkt/ersetzt die Spritze", „verhindert den Jojo-Effekt", jede Krankheitsaussage, „von Ärzten empfohlen", Nennung von Medikamentennamen als Werbeaussage.
- **Kein Medizinprodukt, keine Heilkunde:** Die Seite verkauft Lebensmittel und ein Ernährungs-/Trainingsprogramm. Kein Arzt, keine Dosierung, keine Absetz-Anleitung für das Medikament. Wer absetzen will, wird auf das Gespräch mit der behandelnden Ärztin verwiesen (ein Satz, prominent).
- **Fake-Door ehrlich:** Button „Vorbestellen" führt auf: „Wir produzieren die erste Charge, sobald 100 Vorbestellungen zusammen sind. Kein Geld jetzt, du bekommst als Erste Bescheid." Kein Countdown, keine erfundene Knappheit.

## 4. Seitenaufbau (eine Seite, in dieser Reihenfolge)
1. **Hero:** Überschrift-Optionen: „Nach der Spritze: Muskeln behalten, Gewicht halten." / „Absetzen ohne Absturz." / „Das 12-Wochen-Set für die Zeit nach der Abnehmspritze." Unterzeile: Protein, Ballaststoffe, Kreatin, Programm. Button „Vorbestellen – 129 € für 12 Wochen".
2. **Problem, in drei Zahlen:** 64,8 % setzen innerhalb eines Jahres ab (JAMA Netw Open 2025); ohne Gegenmaßnahmen geht ein erheblicher Teil des verlorenen Gewichts als Muskelmasse verloren; Regain nach dem Absetzen ist die Regel, nicht die Ausnahme. Jede Zahl mit Quelle als Fußnote.
3. **Das Set:** drei Karten: Protein-Stick (≥ 20 g, 1,2 g/kg-Ziel erklärt), Ballaststoff-Stick (Sättigung, Verdauung), Kreatin (3–5 g, mit Krafttraining). Vierte Karte: 12-Wochen-Programm (2 Krafteinheiten/Woche, Wochen-Check-in, Rezepte für kleine Portionen).
4. **Warum das wirkt:** drei Absätze mit Quellen (Apothekerzeitung 2/2026: Protein und Kreatin; Health-Claim-Texte; Trainingsempfehlung). Nüchtern, keine Superlative.
5. **Für wen, für wen nicht:** für Menschen, die absetzen oder reduzieren und ihr Gewicht halten wollen; nicht für Schwangere, unter 18, bei Nierenerkrankung ohne ärztliche Rücksprache; und der Satz: „Ob und wie du dein Medikament absetzt, besprichst du mit deiner Ärztin oder deinem Arzt."
6. **Preis:** 129 € für 12 Wochen (entspricht 43 €/Monat) oder 49 €/Monat; Vergleich: die Spritze kostet 170–280 €/Monat. Vorbestell-Formular.
7. **FAQ:** Schmeckt das? Wann kommt es? Was passiert mit meiner E-Mail? Ist das ein Medikament? (Nein.) Kann ich das mit der Spritze nehmen? (Ernährung ja, aber Rücksprache mit Ärztin.)
8. **Footer:** Impressum, Datenschutz, „Ein Projekt von Dominik Jäkel, Berlin".

## 5. Anzeigen (200 €, drei Wochen)
- Google Ads, Suchkampagne, deutsch, nur Deutschland, Keywords: „abnehmspritze absetzen", „abnehmspritze muskelabbau", „abnehmspritze danach gewicht halten", „wegovy absetzen jojo" (Marken-Keywords sind als Suchbegriff meist erlaubt, im Anzeigentext nicht verwenden). Tagesbudget 10 €. Anzeigentext ohne Gesundheitsversprechen: „12-Wochen-Set für die Zeit nach der Abnehmspritze. Protein, Ballaststoffe, Kreatin, Programm. Jetzt vorbestellen."
- Google prüft Gesundheitsanzeigen streng; falls abgelehnt, Text neutraler fassen („nach der Diät", „Muskeln erhalten beim Abnehmen").
- Ohne Anzeigen: drei SEO-Artikel („Abnehmspritze absetzen: Was passiert danach?", „Muskelabbau bei Abnehmspritze vermeiden", „Protein bei Abnehmspritze: Wie viel?") als Content für die nächsten Monate; für den 3-Wochen-Test sind Anzeigen der Kanal.

## 6. Prompt für Claude Code (in leeren Ordner legen, `claude` starten, einfügen)

```
Lies LANDINGPAGE_PLAN.md vollständig. Baue die Landingpage „Nach der Spritze" als Astro-Projekt mit Tailwind,
statisch, deutsch, mobil zuerst. Arbeite in Stufen und halte nach jeder Stufe an, damit ich prüfen kann.

Stufe 1 – Grundgerüst: npm create astro (minimal, TypeScript), Tailwind, Seiten: index, impressum, datenschutz,
danke. Layout mit Header (Logo-Text „Nach der Spritze"), Footer mit Links. Lighthouse-Ziel: Performance > 95.
Stufe 2 – Inhalt: Sektionen 1–8 aus Abschnitt 4 des Plans mit echten deutschen Texten (keine Platzhalter),
Zahlen mit Fußnoten und Quellen-Links. Drei Überschriften-Varianten als auskommentierte Alternativen im Code.
Health-Claim-Regeln aus Abschnitt 3 einhalten; lege eine Datei CLAIMS.md an, in der jede gesundheitsbezogene
Aussage der Seite mit ihrer Zulassungsgrundlage steht, und prüfe die Seite dagegen.
Stufe 3 – Formular: Tally-Formular einbetten (ich gebe dir die Tally-ID; bis dahin ein Platzhalter mit gleichem
Layout), Felder wie in Abschnitt 1. Button „Vorbestellen" scrollt zum Formular; Klick-Event an Plausible
(data-attribute) senden. Danke-Seite mit ehrlichem Text (keine Zahlung, erste Charge ab 100 Vorbestellungen).
Stufe 4 – Rechtliches: Impressum- und Datenschutz-Seiten mit Textgerüst (Platzhalter nur für Name/Adresse),
Plausible-Snippet, kein Cookie-Banner nötig, weil keine Cookies gesetzt werden; prüfe das.
Stufe 5 – Deploy: .gitignore, README mit „So geht es live": GitHub-Repo anlegen, Vercel importieren, Region
Frankfurt, Domain per CNAME verbinden; plus Checkliste vor Launch (Impressum ausgefüllt, Datenschutz geprüft,
Formular getestet, Plausible zählt, Seite auf dem Handy geprüft, keine Medikamentennamen im Werbetext).
Stufe 6 – Anzeigen-Vorlagen: Datei ADS.md mit 3 Google-Ads-Anzeigentexten (Headline ≤ 30 Zeichen, Description
≤ 90 Zeichen), Keyword-Liste, negative Keywords, und 2 kurze Community-Posts (sachlich, ohne Werbeton).

Regeln: keine Bibliothek ohne Grund, keine externen Fonts außer einer Google-Font mit Fallback, Bilder als
SVG-Illustrationen oder Platzhalter-Mockups, alles in einem Repo. Nach jeder Stufe: npm run build muss
durchlaufen. Schreibe am Ende jeder Stufe drei Zeilen: was gebaut, wie ich es prüfe, was offen ist.
```

## 7. Was Dominik heute noch selbst macht (15 Minuten)
1. Domain kaufen. 2. GitHub-Konto und Vercel-Konto (Login mit GitHub). 3. Tally-Konto, Formular anlegen, ID kopieren. 4. Plausible-Testkonto. 5. Google-Ads-Konto anlegen (Zahlungsdaten hinterlegen, sonst keine Freigabe).

## 8. Was Michi liefert (eine Nachricht)
Protein g/kg, Kreatin-Dosis, Ballaststoff-Menge pro Stick, die Liste „für wen nicht", und ein Nein zu jeder Formulierung auf der Seite, die er nicht vertreten würde.
