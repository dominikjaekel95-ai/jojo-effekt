# Launchplan „Nach der Spritze“

Stand Dienstag, 29.09.2026. Ziel: live am Donnerstag, 01.10.2026. Budget < 300 € (Domain ~6 €, Plausible 0 € im Testmonat, Anzeigen 200 €, Reserve).

## 0. Was fertig ist (Stand heute Abend)

- Website komplett gebaut: Startseite mit allen acht Sektionen, sechs Wissensartikel, Hub, Danke-, Impressum-, Datenschutz-, Über-uns- und 404-Seite. Build und Typprüfung grün, Lighthouse mobil: Performance 100 / SEO 100 / Best Practices 100.
- Formular als Tally-Einbettung vorbereitet (Platzhalter bis die ID da ist), Plausible-Event auf jedem „Vorbestellen“-Button, Danke-Seite mit ehrlichem Text.
- `CLAIMS.md` (Claim-Register), `ADS.md` (3 Anzeigen, Keywords, Negative, 2 Community-Posts), `README.md` (So geht es live + Checkliste), SEO-Strategie, Domain-Empfehlung, Wettbewerbs-Benchmark.
- Was fehlt, ist nur das, was nur du oder Michi liefern könnt: Anschrift, E-Mail, Michis Name/Qualifikation, Tally-ID, Plausible-Domain, Domain, Freigabe der Claims.

## 1. Zeitplan bis zum Launch

### Heute, Dienstag 29.09. (Dominik, 30 Minuten)

1. **Domain kaufen:** `nachderspritze.de` bei INWX (Begründung in `docs/DOMAIN-UND-WETTBEWERB.md`; vorher Whois bei DENIC prüfen). Dazu `nach-der-spritze.de`. Kein Nameserver-Wechsel nötig; DNS bleibt beim Registrar.
2. **Vercel-Konto** mit GitHub-Login; Repo `dominikjaekel95-ai/jojo-effekt` importieren, Region Frankfurt, Branch `claude/jojo-effekt-website-launch-5n0nls` als Preview ansehen (oder in `main` mergen).
3. **Tally-Konto**, Formular anlegen (Felder in `README.md` Schritt 4), Weiterleitung auf `/danke/`, ID kopieren.
4. **Plausible-Testkonto**, Site anlegen, Ziele „Vorbestellen Klick“ und `/danke/`.
5. **Google-Ads-Konto** anlegen und Zahlungsdaten hinterlegen. Noch keine Kampagne – nur, damit die Kontoprüfung heute Nacht läuft.
6. **Michi eine Nachricht** schicken mit Link auf `CLAIMS.md` und die Preview-URL: Protein g/kg, Kreatin 3 g, Ballaststoffe 5 g, Liste „Für wen nicht“, und ein Nein zu jedem Satz, den er nicht vertreten würde. Frist: Mittwoch 18 Uhr.
7. **Entscheidung Überschrift** (`CLAIMS.md` D1): Variante A „Muskeln behalten, Gewicht halten.“ (gebaut) oder B „Absetzen ohne Absturz.“ oder C „Das 12-Wochen-Set für die Zeit nach der Abnehmspritze.“ – Varianten stehen als Kommentar in `src/pages/index.astro`. Bei Wechsel auch OG-Bild neu erzeugen (Skript im Scratchpad, oder mir sagen).

### Mittwoch 30.09.

- **Vormittag (Dominik, 45 Minuten):** `src/data/site.ts` ausfüllen (Anschrift, PLZ, E-Mail, Michi), `.env`-Werte in Vercel eintragen (`SITE_URL`, `PUBLIC_TALLY_FORM_ID`, `PUBLIC_PLAUSIBLE_DOMAIN`), `public/robots.txt` Sitemap-Zeile prüfen, Domain in Vercel verbinden (CNAME beim Registrar). Deploy.
- **Mittag:** Search-Console-Property anlegen (DNS-Verifizierung), Sitemap einreichen, 13 URLs zur Indexierung anmelden. Bing Webmaster Tools importieren.
- **Nachmittag:** Google-Ads-Kampagne aus `ADS.md` einreichen (drei Anzeigengruppen, negative Keywords, Tagesbudget 10 €, Start Donnerstag 8 Uhr, Standort Deutschland, Sprache Deutsch, nur Suchnetzwerk, keine Display-Erweiterung). Freigabe dauert 1–2 Tage – deshalb heute.
- **Abend:** Michis Rückmeldung einarbeiten (ich ändere Zahlen/Formulierungen, du prüfst die Preview). Datenschutz gegenlesen. Checkliste in `README.md` abhaken. Test: Formular absenden → `/danke/` → Eintrag in Tally → Plausible zeigt Ziel.
- **Optional:** Meta-Ads-Konto anlegen, falls Google zickt.

### Donnerstag 01.10. – Launch

- 08:00 Letzter Check auf dem Handy: Startseite, Formular, ein Artikel. Cookies leer (DevTools). Anzeigenstatus prüfen.
- 09:00 Community-Post A (`ADS.md` Abschnitt 5) in einer Gruppe, nicht in allen gleichzeitig. Auf Antworten reagieren, innerhalb von Stunden.
- Tagsüber: Plausible-Echtzeit beobachten; Ads-Suchbegriffe am Abend prüfen und negative Keywords nachziehen.
- Falls Ads noch nicht freigegeben: nichts ändern, warten; Community-Post trägt den ersten Tag.

## 2. Testphase: Woche 1–3 (01.10.–22.10.)

| Wann | Was | Wer |
|---|---|---|
| täglich, 10 Min | Plausible: Besucher nach Quelle, Klickrate „Vorbestellen“, Tally-Einträge. Ads: Suchbegriffsbericht, negative Keywords, Ablehnungen | Dominik |
| Fr 03.10. | Erste Auswertung: Wenn Klickrate auf „Vorbestellen“ < 5 %, Überschrift auf Variante B tauschen (5 Minuten, ich mache das) | Dominik/Claude |
| Mo 06.10. | Community-Post B (Studienzusammenfassung) in zweiter Gruppe / Subreddit | Dominik |
| Mo 06.10. | Ads: Gebotsstrategie auf „Klicks maximieren“ mit Obergrenze 1,50 €, sobald ≥ 30 Klicks | Dominik |
| Wo 2 | Freitext-Antworten lesen und clustern (Was bräuchtest du?). Muster in ein Doc, das wird die Produkt-Roadmap | Dominik |
| Wo 2 | Michi: zweite Prüfrunde der Artikel; Aktualisierungsdatum setzen | Michi |
| Wo 2–3 | SEO-Grundlage: Search Console prüfen, ob alle URLs indexiert sind; Rich-Results-Test | Dominik |
| Wo 3 | Dritte Community-Wave nur, wenn die ersten beiden gut aufgenommen wurden | Dominik |
| Mi 22.10. | **Auswertung und Entscheidung** | Dominik + Michi |

### Entscheidungskriterien am 22.10.

| Kennzahl | Kill | Unklar | Go |
|---|---|---|---|
| Vorbestellungen (Tally-Einträge, bestätigt) | < 30 | 30–60 | > 60 |
| Anteil „Ich würde 129 € zahlen“ | < 40 % | 40–60 % | > 60 % |
| Klickrate Besucher → „Vorbestellen“-Klick | < 5 % | 5–10 % | > 10 % |
| Kosten pro Vorbestellung aus Ads | > 15 € | 7–15 € | < 7 € |
| Freitext: klares Muster (z. B. „Training“, „Protein bei Übelkeit“) | kein Muster | | klares Bedürfnis |

Bei „Unklar“: Test um zwei Wochen verlängern mit angepasster Überschrift/Preis (99 € testen) statt sofort abbrechen.

## 3. Nach dem Test

### Bei GO (ab 23.10.)

**Monat 2 (Nov):** Vorbesteller anschreiben (Danke, Zeitplan, erste Umfrage). Rezeptur mit Michi fixieren (Protein-Stick Molke/pflanzlich, Ballaststoff-Zusammensetzung → entscheidet über zulässige Claims, Kreatin 3 g). Lohnhersteller anfragen (Sticks: 3 Angebote, MOQ, Lieferzeit). Gewerbeanmeldung, Nebentätigkeitsklausel prüfen, Steuerberater. Marke „Nach der Spritze“ beim DPMA anmelden (~290 €). SEO: zwei Artikel (Erfahrungen, Studien-Tracker), Search-Console-Review.
**Monat 3 (Dez):** Programm ausformulieren (12 Wochen, zwei Einheiten, Rezepte, Check-in-Mails). Verpackung, LMIV-Etiketten, NemV-Pflichthinweise (`CLAIMS.md` F). Shop-Lösung wählen (Shopify oder Lemon Squeezy/Stripe mit einfacher Kasse), AGB, Widerruf, Preisangaben. Pre-Sale an die Liste mit echtem Zahlungsschritt (jetzt erst). SEO: Markenseiten Wegovy/Ozempic/Mounjaro absetzen (informativ).
**Monat 4–6:** Erste Charge, Versand, Check-in-Mails automatisieren. Erste Erfahrungsberichte einholen (mit Einwilligung, HCVO-konform: keine Wirkversprechen in Testimonials). SEO: Ernährung, Training, Dauer; Digital-PR mit eigenen Umfragedaten; Ziel 10–20 verweisende Domains.
**Monat 6–12:** Skalieren über Ads (mit echten Conversions), Kooperation mit Ernährungsberaterinnen und Praxen (Flyer „Nach der Spritze“ für Absetz-Gespräche – HWG-Prüfung vorher), Abo-Variante 49 €/Monat.

### Bei KILL

- Domain und Wissens-Hub behalten: Die Inhalte sind ein Asset. Optionen: (a) als Content-Seite weiterführen und später ein anderes Produkt testen (z. B. reines Programm ohne Supplements, 29 €), (b) Kooperation mit einem bestehenden Anbieter (Nupo, LEALY) als Content-Partner, (c) verkaufen.
- Die Freitext-Antworten sagen, warum es nicht gezogen hat: Preis, Vertrauen, Bedarf. Das ist das eigentliche Ergebnis.

## 4. Rollen

| Wer | Was |
|---|---|
| Dominik | Konten, Domain, Texte freigeben, Community, Ads, tägliche Auswertung, Entscheidung |
| Michi | Mengen, „Für wen nicht“, Veto auf Formulierungen, zweite Prüfrunde, Name/Qualifikation für die Seite |
| Claude Code (dieses Repo) | Änderungen an Texten/Seiten nach Rückmeldung, Überschriften-Variante, neue Artikel, OG-Bild, Auswertung von Tally-Exporten, Markenseiten in Monat 2–3 |

## 5. Risiken und was dann

| Risiko | Wahrscheinlichkeit | Gegenmaßnahme |
|---|---|---|
| Google lehnt Anzeigen ab (Gesundheit/Abnehmen) | mittel | Variante 3 aus `ADS.md` (neutral) einreichen; parallel Meta-Ads; Community-Posts tragen die erste Woche |
| Michi meldet sich nicht bis Mittwoch | mittel | Launch trotzdem, aber Autorbox zeigt „Fachliche Prüfung folgt“ statt Platzhalter (ich baue das um, wenn nötig); Artikel bleiben online, Set-Zahlen bleiben wie im Plan |
| Domain vergeben | niedrig | `haltephase.de` als zweite Wahl; nur `src/data/site.ts`, H1 und OG-Bild ändern |
| Abmahnung wegen Health Claims | niedrig, wenn `CLAIMS.md` eingehalten | Alle ⚠️-Punkte vor Launch klären; keine Änderung an Texten ohne Eintrag in `CLAIMS.md` |
| Tally/Plausible sperren oder zählen nicht | niedrig | Vor Launch mit echtem Test-Eintrag prüfen (Checkliste); Formbricks als Ersatz |
| Zu wenig Traffic für eine Aussage (< 500 Besucher in 3 Wochen) | mittel | Ads-Budget nicht erhöhen, sondern Community-Reichweite; Test um zwei Wochen verlängern statt Kill |
| Wenige Vorbestellungen, aber viele Artikel-Leser | mittel | Das ist selbst ein Ergebnis: Informationsbedarf hoch, Zahlungsbereitschaft niedrig → Programm-only-Variante testen |

## 6. Was ich als Nächstes tun kann (auf Zuruf)

- Überschrift auf Variante B oder C umstellen und OG-Bild neu erzeugen
- Michis Zahlen einpflegen und `CLAIMS.md` aktualisieren
- Tally-ID und Plausible-Domain einbauen, sobald da (oder du trägst sie direkt in Vercel ein – kein Code nötig)
- „Fachliche Prüfung folgt“-Variante der Autorbox, falls Michi später kommt
- Artikel 7–9 (Erfahrungen, Studien-Tracker, Wegovy/Ozempic/Mounjaro absetzen) ab Woche 2
- Auswertung der Tally-CSV nach dem Test (Cluster der Freitexte, Kennzahlen-Tabelle)
