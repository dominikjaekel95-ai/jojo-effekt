# Ernährungsplan (Lead-Magnet)

Stand 02.10.2026. Kostenloser Plan für sieben Tage gegen Newsletter-Anmeldung, alternativ per persönlicher Mail an Dominik.

## Ablauf für Nutzer

1. Startseite (Band direkt nach dem Hero), Werkzeuge-Übersicht oder Ernährungs-Artikel → `/werkzeuge/ernaehrungsplan/`.
2. Drei Fragen: Ernährungsform (Mischkost, vegetarisch, vegan), Appetit (noch klein, wieder normal), Gewicht (Slider 45 bis 160 kg → drei Stufen). Die Vorschau zeigt Tag 1 des passenden Plans.
3. E-Mail, Häkchen „keins der Ausschlusskriterien“ (Nierenerkrankung, Schwangerschaft/Stillzeit, Essstörung, unter 18), Häkchen „Plan plus Newsletter“. Beides Pflicht.
4. `api/ernaehrungsplan.js` legt die Adresse bei MailerLite an (Status `unconfirmed`, Gruppen „Newsletter“ und „Ernährungsplan“, Feld `plan` = `ep01` bis `ep18`) und leitet auf `/werkzeuge/ernaehrungsplan/danke/` weiter.
5. MailerLite schickt die Bestätigungs-Mail (Double-Opt-in). Nach dem Klick ist die Adresse aktiv, die Automation schickt den Plan-Link.
6. Ohne Newsletter: Mail an `site.owner.email` (Link im Formular, mit den Antworten und der Plannummer vorausgefüllt). Dominik antwortet mit dem PDF aus `public/downloads/ernaehrungsplan/` (Tabelle unten).

## Einrichtung bei MailerLite (einmalig, vor dem Merge)

1. **Gruppe** anlegen: Subscribers → Groups → „Ernährungsplan“. Die ID steht in der URL der Gruppe.
2. **Feld** anlegen: Subscribers → Fields → Create field, Name `plan`, Typ Text. (Das Feld `quelle` gibt es schon; fehlt es, legt die Funktion ohne `quelle` an.)
3. **Automation** anlegen: Automations → Create → Trigger „When subscriber joins a group“ → „Ernährungsplan“. Ein Schritt: E-Mail.
   - Betreff: `Dein Ernährungsplan für sieben Tage`
   - Text (Vorschlag):
     > Hallo,
     >
     > hier ist dein Ernährungsplan: sieben Tage mit Mengen, Einkaufsliste und Austauschtabelle.
     >
     > [Button: Plan als PDF öffnen] → `https://nachderspritze.de/downloads/ernaehrungsplan/{$plan}.pdf`
     >
     > Der Plan ist ein allgemeiner Beispielplan für gesunde Erwachsene und ersetzt keine ärztliche oder ernährungstherapeutische Beratung. Ob und wie du dein Medikament absetzt, besprichst du mit deiner Ärztin oder deinem Arzt.
     >
     > Fragen? Antworte einfach auf diese Mail.
     >
     > Dominik von Nach der Spritze
   - Keine Affiliate-Links, keine Präparatenamen, kein Produkt-Teaser in dieser Mail.
   - In den Automation-Einstellungen erlauben, dass Abonnenten die Automation erneut durchlaufen (sonst bekommt niemand einen zweiten Plan, z. B. nach „Appetit wieder normal“).
   - Merge-Tag prüfen: In MailerLite heißt der Platzhalter für eigene Felder `{$plan}`. Beim Testversand muss im Link `ep…` stehen, nicht der Platzhalter.
4. Automation aktivieren.
5. Bestätigungs-Mail auf Deutsch umstellen (Forms/Settings → Double opt-in), falls noch nicht geschehen. Bis dahin sagt die Danke-Seite nichts zur Sprache; die Mail heißt „Confirm your email address“.

## Vercel

- Neue Umgebungsvariable `MAILERLITE_GROUP_ERNAEHRUNGSPLAN` = ID der Gruppe (Production und Preview). `MAILERLITE_API_KEY` und `MAILERLITE_GROUP_NEWSLETTER` gibt es schon.
- Ohne die neue Variable landet jede Anfrage auf `?fehler=technik`. Der Fehlerfall ist sicher: keine Adresse wird ohne Plan angelegt.
- Rewrite `/api/ernaehrungsplan/` → `/api/ernaehrungsplan` steht in `vercel.json`.

## Test (Preview, dann Produktion)

1. Formular mit einer eigenen Test-Adresse (z. B. `dominik+ep1@…`) absenden → Danke-Seite.
2. Vercel → Logs: `ernaehrungsplan: ep08 → angelegt (201)` o. Ä. Keine E-Mail-Adressen im Log.
3. MailerLite: Adresse in „Newsletter“ und „Ernährungsplan“, Status unconfirmed, Feld `plan` gesetzt.
4. Bestätigungslink klicken → innerhalb weniger Minuten Mail mit Plan-Link → PDF öffnet.
5. Gleiche Adresse mit anderen Antworten noch einmal → Feld `plan` wechselt, zweite Plan-Mail kommt (nur mit erlaubtem erneutem Durchlauf).
6. `curl -i https://nachderspritze.de/api/ernaehrungsplan/` → 405. Absenden ohne Häkchen → `?fehler=eingabe`.

## Die 18 Pläne

| Plan | Ernährung | Appetit | Gewicht | Protein/Tag |
|---|---|---|---|---|
| ep01 | Mischkost | klein | unter 75 kg | 80 g |
| ep02 | Mischkost | klein | 75 bis 95 kg | 100 g |
| ep03 | Mischkost | klein | über 95 kg | 120 g |
| ep04 | Mischkost | normal | unter 75 kg | 80 g |
| ep05 | Mischkost | normal | 75 bis 95 kg | 100 g |
| ep06 | Mischkost | normal | über 95 kg | 120 g |
| ep07 | vegetarisch | klein | unter 75 kg | 80 g |
| ep08 | vegetarisch | klein | 75 bis 95 kg | 100 g |
| ep09 | vegetarisch | klein | über 95 kg | 120 g |
| ep10 | vegetarisch | normal | unter 75 kg | 80 g |
| ep11 | vegetarisch | normal | 75 bis 95 kg | 100 g |
| ep12 | vegetarisch | normal | über 95 kg | 120 g |
| ep13 | vegan | klein | unter 75 kg | 80 g |
| ep14 | vegan | klein | 75 bis 95 kg | 100 g |
| ep15 | vegan | klein | über 95 kg | 120 g |
| ep16 | vegan | normal | unter 75 kg | 80 g |
| ep17 | vegan | normal | 75 bis 95 kg | 100 g |
| ep18 | vegan | normal | über 95 kg | 120 g |

PDF: `https://nachderspritze.de/downloads/ernaehrungsplan/<plan>.pdf`, Vorschau als Seite: `/werkzeuge/ernaehrungsplan/plan/<plan>/` (beides noindex).

## Pflege

- Daten und Generator: `src/data/ernaehrungsplan.ts` (Lebensmittel, Gerichte, Faktoren), Zuordnung: `src/data/ernaehrungsplan-id.mjs` (Reihenfolge nie ändern, sonst zeigen Links in verschickten Mails auf falsche Pläne).
- Proteinziel 1,2 g pro kg auf die Mitte der Gewichtsstufe (`leidy2015`), Lebensmittelwerte gerundet nach BLS (`bls`). Keine Kalorienvorgaben, keine Dosierungen, keine Medikamentennamen.
- Jeder Tag muss zwischen Ziel − 6 g und Ziel + 20 g Protein liegen. Der Build bricht sonst ab (`pruefePlaene()` in `plan/[id].astro`).
- Nach jeder Änderung an Daten, Vorlage oder Quellen: `npm run pdf:ernaehrungsplan`, die 18 PDFs mit committen.
- Datenschutz: Abschnitt 4d in `datenschutz.astro`. Gespeichert werden nur Adresse, Plannummer, Zeitpunkt und Herkunft, nicht Gewicht oder Antworten.
- Kopplung Plan an Newsletter ist transparent beschrieben, und es gibt den Weg ohne Newsletter (Mail). Diese Alternative nicht entfernen; sie ist das Argument gegen das Kopplungsverbot (Art. 7 Abs. 4 DSGVO).
- Die PDFs sind unter ihrer URL öffentlich erreichbar (wie die Checkliste). Das ist bewusst so: kein Login, keine Tokens.
