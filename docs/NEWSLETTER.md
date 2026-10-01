# Newsletter, Checkliste und Teilen: Konzept, Einwilligungstexte, Einrichtung

Stand: 30. September 2026. Zuständig: Dominik.

**Status:** Das optionale Kästchen „Newsletter“ steht in den Tally-Formularen `b5bO9o` (Vorbestellung), `ODOJWR` (Erfahrungen) und `WOxpjv` (Checkliste, noch Entwurf). Die Häkchen sammeln Einwilligungen. Versanddienst ist MailerLite mit aktivem Double-Opt-in; die Übergabe von Tally an MailerLite macht die Vercel-Funktion `api/newsletter.js` (Abschnitt 3). Verschickt wird, sobald Webhooks und Umgebungsvariablen stehen und `src/data/site.ts` den Dienst nennt (Abschnitt 6). Die Datenschutzerklärung beschreibt den Newsletter bereits (Abschnitt 4c) und sagt bis dahin, dass noch nichts verschickt wird.

## 1. Regeln

Die Vorbestell-Liste darf nur Neuigkeiten zum Set bekommen; so steht es im Formular und in der Datenschutzerklärung. Alles andere (neue Artikel, Studien, Marktradar) braucht eine eigene, ausdrückliche Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 7 Abs. 2 Nr. 2 UWG). Deshalb:

- Ein optionales Kästchen „Newsletter“ in jedem Formular. Nicht vorangekreuzt, nicht Pflicht, nicht mit der Datenschutz-Einwilligung zusammengelegt.
- Wer nur vorbestellt, bekommt nur Set-Mails. Wer das Kästchen ankreuzt, bekommt zusätzlich den Newsletter, aber erst nach bestätigter Anmeldung (Double-Opt-in).
- Einträge, die vor dem 30.09.2026 ohne Kästchen eingegangen sind, bekommen keinen Newsletter. Die erste Set-Mail an sie darf einen Link „Newsletter abonnieren“ enthalten; mehr nicht.
- Kein Versand, solange kein Double-Opt-in-Tool steht. Die Häkchen werden nur gespeichert.

## 2. Tally

### 2a. Vorbestell-Formular `b5bO9o` und Erfahrungsformular `ODOJWR` (erledigt)

Feld vom Typ Checkbox, Fragetitel „Newsletter“, optional, nach der Datenschutz-Einwilligung. Wortlaut:

> Ja, schickt mir etwa alle zwei Wochen den Newsletter von Nach der Spritze: neue Artikel, Studien und Entwicklungen zur Zeit nach der Abnehmspritze. Abmelden geht in jeder Mail. Datenschutz: nachderspritze.de/datenschutz/

Exportspalte: `Newsletter`. Weiterleitung nach dem Absenden bleibt `https://nachderspritze.de/danke/`.

### 2b. Checklisten-Formular `WOxpjv` (Entwurf, noch zu veröffentlichen)

Felder in dieser Reihenfolge:

1. **E-Mail-Adresse**, Typ E-Mail, Pflicht.
2. **Datenschutz**, Checkbox, Pflicht: „Ich bin einverstanden, dass meine E-Mail-Adresse gespeichert wird, um mir die Checkliste zu schicken. Widerruf jederzeit. Datenschutz: nachderspritze.de/datenschutz/“
3. **Newsletter**, Checkbox, optional, Wortlaut wie in 2a.

Einstellungen: „Redirect on completion“ auf **`https://nachderspritze.de/checkliste/danke/`**. Titel und Beschreibung im Formular ausblenden (die Seite zeigt sie). Die Danke-Seite bietet das PDF sofort zum Download an; ein Mailversand aus Tally ist nicht nötig. Optional: Tally → Integrations → E-Mail-Benachrichtigung an den Absender mit dem Link `https://nachderspritze.de/downloads/checkliste-8-wochen.pdf`.

Nach dem Veröffentlichen in `src/data/site.ts` den Schalter setzen: `checklistForm: { id: 'WOxpjv', live: true }`. Bis dahin zeigt `/checkliste/` den Weg per E-Mail an Dominik, und der Datenschutz-Abschnitt 4b bleibt ausgeblendet.

## 3. Versanddienst: MailerLite mit Double-Opt-in, Übergabe per Webhook

Tally hat keine native MailerLite-Anbindung. Der Weg: Tally-Webhook → Vercel-Funktion `api/newsletter.js` → MailerLite-API `POST /api/subscribers` mit `status: unconfirmed` und den Gruppen-IDs. Double-Opt-in ist im MailerLite-Konto für API und Integrationen aktiv, die Bestätigungs-Mail geht automatisch raus. Die Funktion überträgt nur Einträge mit gesetztem Newsletter-Häkchen, prüft die Tally-Signatur, legt bereits aktive Adressen nur in die Gruppen und reaktiviert keine abgemeldeten. Sie loggt keine E-Mail-Adressen.

Gruppen: alle Einträge kommen in „Newsletter“, Einträge aus dem Checklisten-Formular `WOxpjv` zusätzlich in „Checkliste“. Zusätzlich schreibt die Funktion das Feld `quelle` (vorbestellung, erfahrungen, checkliste), falls es im Konto existiert.

### 3a. MailerLite (Stand und Gruppen-IDs in `docs/NEWSLETTER-SETUP.md`)

Erledigt von der Browser-Instanz am 30.09.2026: Domain authentifiziert (DKIM, SPF bei INWX), Absender `dominik@nachderspritze.de`, Gruppen „Newsletter“ und „Checkliste“, Double-Opt-in für API an, Impressum-Footer aus dem Firmenprofil. Die Bestätigungs-Mail ist im Free-Plan die englische Standardvorlage; deutsch wird sie erst mit dem bezahlten Plan.

Noch offen bei Dominik: Auftragsverarbeitungsvertrag im Konto ablegen; optional Feld `quelle` (Text) anlegen; API-Schlüssel unter Integrations → API erzeugen und nur in Vercel ablegen (3b), nie ins Repo.

### 3b. Vercel (Dominik)

Project → Settings → Environment Variables, für Production (und Preview, falls dort getestet wird):

| Variable | Wert |
|---|---|
| `MAILERLITE_API_KEY` | API-Schlüssel aus MailerLite |
| `MAILERLITE_GROUP_NEWSLETTER` | ID der Gruppe „Newsletter“ (siehe `docs/NEWSLETTER-SETUP.md`) |
| `MAILERLITE_GROUP_CHECKLISTE` | ID der Gruppe „Checkliste“ |
| `TALLY_SIGNING_SECRET` | frei gewählte lange Zeichenkette; derselbe Wert in allen drei Tally-Webhooks |

Nach dem Eintragen einmal neu deployen (Deployments → Redeploy), damit die Funktion die Werte bekommt.

### 3c. Tally (andere Instanz)

In jedem der drei Formulare unter Integrations → Webhooks:

- URL: `https://nachderspritze.de/api/newsletter/` (mit Schrägstrich am Ende; die Seite leitet sonst um)
- Signing secret: der Wert aus `TALLY_SIGNING_SECRET`
- Ereignis: Formular-Antwort (Standard)

Test: Formular mit eigener Adresse und gesetztem Häkchen absenden. Erwartung: Bestätigungs-Mail von MailerLite innerhalb einer Minute; in Vercel → Logs eine Zeile `newsletter: <Formular-ID> (<quelle>) → angelegt (201)`. Ohne Häkchen: `… ohne Häkchen, übersprungen`. Bei `401` stimmt das Signing Secret nicht überein, bei `500` fehlt eine Umgebungsvariable.

### 3d. Newsletter-Button im Header (seit 01.10.2026)

Oben rechts auf jeder Seite steht „Newsletter“; der Klick klappt ein Feld aus mit Anmeldung und Kontaktangebot (`src/components/NewsletterPanel.astro`). Das Formular postet ohne Skripte Dritter an `api/anmeldung.js`: E-Mail-Adresse, Einwilligungs-Kästchen (Pflicht, Wortlaut wie 2a), Honigtopf-Feld gegen Bots. Die Funktion legt die Adresse wie der Tally-Webhook mit Status `unconfirmed` in der Gruppe „Newsletter“ an (Feld `quelle` = `header`), MailerLite schickt die Bestätigungs-Mail, die Website leitet auf `/newsletter/danke/` weiter (noindex). Plausible: Ereignis „Newsletter Klick“ (Button), „Kontakt Klick“ (Mail-Link), Seitenaufruf-Ziel `/newsletter/danke/`.

Das Kontaktangebot („Du strauchelst gerade nach dem Absetzen? Schreib uns“) führt auf `dominik@nachderspritze.de` mit Betreff „Nach der Spritze: meine Frage“. Auf dem Desktop gibt es dafür zusätzlich den Header-Button „Kontakt“, der die Mail direkt öffnet; auf dem Handy steht das Angebot nur im Newsletter-Feld. Wortlaut des Kontaktabsatzes hat Dominik am 01.10.2026 festgelegt, einschließlich „unter Beratung erfahrener Medizinerinnen und Mediziner“ (statt „führende Medizinexperten“) und „Die ersten Nutzerinnen und Nutzer können sie kostenlos testen“; beides ist eine bewusste Entscheidung des Betreibers und wird nicht ohne ihn geändert. Zweck: Gespräche in der Prototyp-Phase, um zu verstehen, was Menschen nach dem Absetzen brauchen. Regeln für die Antworten, weil sonst Heilmittelwerberecht und Heilkunde-Vorbehalt greifen:

- Zuhören, einordnen, auf Artikel und Checkliste verweisen, nach dem Bedarf fragen. Keine individuelle medizinische Beratung, keine Dosierungs- oder Absetzempfehlung, keine Diagnose.
- Nie „unser Arzt sagt“ oder „laut unserem Ärztenetzwerk“. Fachlicher Rat aus dem Netzwerk fließt in Artikel ein, nicht in Einzelantworten.
- Jede Antwort endet mit dem Pflichtsatz, sobald es um das Medikament geht.
- Antworten sind kostenlos und ohne Verkaufsabsicht; das Set wird nur erwähnt, wenn danach gefragt wird.
- Erkenntnisse aus den Gesprächen (anonymisiert, ohne Zitat) kommen in die Themenliste in `docs/REDAKTION.md` als neue Artikelideen.

## 4. Nachweis und Abmeldung

Tally speichert je Antwort den Zeitpunkt und den Wortlaut der Felder; das ist der Nachweis der ersten Einwilligung. Die Bestätigung (Double-Opt-in) protokolliert MailerLite. Abmeldungen laufen über den Link in jeder Mail; Abmeldewünsche per E-Mail an `hallo@` von Hand in MailerLite austragen und in Tally die Antwort löschen.

Fallback, falls der Webhook einmal ausfällt: Tally → Formular → Responses → Export CSV, Zeilen mit `Newsletter = Yes` behalten, in MailerLite mit „Bestätigung anfordern“ importieren. Nie ohne Double-Opt-in importieren.

## 5. Inhalt und Rhythmus

Etwa alle zwei Wochen, immer gleicher Aufbau, 300 bis 500 Wörter, Betreff ohne Superlative:

1. **Ein Artikel** der letzten zwei Wochen mit zwei Sätzen, warum er wichtig ist.
2. **Eine Studie** aus dem Studien-Tracker oder den Radar-Kandidaten, in drei Sätzen: Was wurde gemessen, was kam heraus, was heißt das für die Zeit nach dem Absetzen.
3. **Eine Marktmeldung** aus dem Marktradar (Zulassung, Preis, Kassenregel, Lieferbarkeit).
4. **Ein Satz zum Set**: Stand der Vorbestellungen, nächster Schritt. Nur die Aussagen aus `CLAIMS.md`.
5. Fußzeile: Arztsatz aus `site.doctorSentence`, Impressum, Abmeldelink.

Regeln wie auf der Seite: keine Dosierungen, keine Absetz-Anleitung, keine Bewertung von Medikamenten, keine Erfahrungsberichte ohne Freigabe. Medikamentennamen sind im Newsletter erlaubt, wenn es um Studien oder Marktmeldungen geht; im Set-Absatz nicht.

Messung: Öffnungen und Klicks im Versanddienst; Klicks auf die Seite kommen mit `?utm_source=newsletter&utm_medium=email&utm_campaign=<datum>` bei Plausible an.

## 6. Schalter in `src/data/site.ts`

```ts
checklistForm: { id: 'WOxpjv', live: true },          // sobald WOxpjv in Tally veröffentlicht ist
newsletter: {
  // Anschrift beim Einrichten mit dem Auftragsverarbeitungsvertrag im MailerLite-Konto abgleichen
  provider: { name: 'MailerLite', address: 'MailerLite Limited, 88 Harcourt Street, Dublin 2, D02 DK18, Irland', url: 'https://www.mailerlite.com/legal/privacy-policy' },
  cadence: 'etwa alle zwei Wochen',
},
```

Was dann automatisch passiert: `/datenschutz/` zeigt Abschnitt 4b (Checkliste) und nennt in 4c den Versanddienst als Auftragsverarbeiter; `/danke/` und `/checkliste/danke/` sprechen vom bestätigten Newsletter statt von „startet, sobald der Versand eingerichtet ist“; `/checkliste/` bettet das Formular ein. Beim Umschalten das „Stand“-Datum in `src/pages/datenschutz.astro` anpassen. Beide Dateien stehen auf der Liste „Nur Dominik“.

## 7. Teilen-Buttons

`src/components/ShareButtons.astro` liegt auf `/danke/`: WhatsApp, E-Mail, LinkedIn und „Link kopieren“, ohne Skripte von Drittanbietern. Der geteilte Link führt auf die Startseite mit `utm_source=empfehlung`, damit Plausible Empfehlungen als Quelle zeigt. Der vorgeschriebene Text nennt keine Markennamen von Arzneimitteln und keine Claims außerhalb von `CLAIMS.md`; wer ihn ändert, hält das ein.

## 8. Checkliste als PDF

`/checkliste/` ist als Seite lesbar und druckbar. Das PDF unter `/downloads/checkliste-8-wochen.pdf` entsteht aus der gebauten Seite mit `npm run pdf:checkliste` (Playwright, Chromium) und wird mit committet. Nach jeder Änderung an `src/pages/checkliste/index.astro` neu erzeugen. `/downloads/` trägt `X-Robots-Tag: noindex` (`vercel.json`), damit das PDF nicht neben der Seite rankt.
