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

Tally hat keine native MailerLite-Anbindung. Der Weg: Tally-Webhook → Vercel-Funktion `api/newsletter.js` → MailerLite-API `POST /api/subscribers` mit `status: unconfirmed` und der Gruppen-ID. Double-Opt-in ist im MailerLite-Konto aktiv, die Bestätigungs-Mail geht automatisch raus. Die Funktion überträgt nur Einträge mit gesetztem Newsletter-Häkchen, prüft die Tally-Signatur, legt bereits aktive Adressen nur in die Gruppe und reaktiviert keine abgemeldeten. Sie loggt keine E-Mail-Adressen.

### 3a. MailerLite (Dominik)

1. Absenderadresse `hallo@nachderspritze.de` verifizieren; bei INWX die von MailerLite genannten DNS-Einträge (DKIM, ggf. DMARC) setzen und SPF ergänzen, damit die Mails nicht im Spam landen.
2. Auftragsverarbeitungsvertrag im Konto akzeptieren und ablegen.
3. Gruppe „Newsletter“ anlegen. Die Gruppen-ID steht in der URL der Gruppe.
4. Feld `quelle` (Text) anlegen; die Funktion schreibt `vorbestellung`, `erfahrungen` oder `checkliste` hinein. Fehlt das Feld, legt sie die Adresse trotzdem an, nur ohne Quelle.
5. Double-Opt-in-Mail prüfen: Betreff „Bitte bestätige deine Anmeldung“, ein Satz, ein Link, Impressum. Erst wer klickt, ist im Verteiler; MailerLite protokolliert Zeitpunkt und IP der Bestätigung.
6. Impressum-Block für die Fußzeile jeder Mail: Name, Anschrift, E-Mail aus `src/data/site.ts` (`owner`, `email`), plus Abmeldelink. Pflicht nach § 5 DDG und § 7 UWG.
7. API-Schlüssel unter Integrations → API erzeugen und nur in Vercel ablegen (3b), nie ins Repo.

### 3b. Vercel (Dominik)

Project → Settings → Environment Variables, für Production (und Preview, falls dort getestet wird):

| Variable | Wert |
|---|---|
| `MAILERLITE_API_KEY` | API-Schlüssel aus MailerLite |
| `MAILERLITE_GROUP_ID` | ID der Gruppe „Newsletter“ |
| `TALLY_SIGNING_SECRET` | frei gewählte lange Zeichenkette; derselbe Wert in allen drei Tally-Webhooks |

Nach dem Eintragen einmal neu deployen (Deployments → Redeploy), damit die Funktion die Werte bekommt.

### 3c. Tally (andere Instanz)

In jedem der drei Formulare unter Integrations → Webhooks:

- URL: `https://nachderspritze.de/api/newsletter/` (mit Schrägstrich am Ende; die Seite leitet sonst um)
- Signing secret: der Wert aus `TALLY_SIGNING_SECRET`
- Ereignis: Formular-Antwort (Standard)

Test: Formular mit eigener Adresse und gesetztem Häkchen absenden. Erwartung: Bestätigungs-Mail von MailerLite innerhalb einer Minute; in Vercel → Logs eine Zeile `newsletter: <Formular-ID> (<quelle>) → angelegt (201)`. Ohne Häkchen: `… ohne Häkchen, übersprungen`. Bei `401` stimmt das Signing Secret nicht überein, bei `500` fehlt eine Umgebungsvariable.

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
  provider: { name: 'MailerLite', address: 'MailerLite Limited, Ground Floor, 71 Lower Baggot Street, Dublin 2, D02 P593, Irland', url: 'https://www.mailerlite.com/legal/privacy-policy' },
  cadence: 'etwa alle zwei Wochen',
},
```

Was dann automatisch passiert: `/datenschutz/` zeigt Abschnitt 4b (Checkliste) und nennt in 4c den Versanddienst als Auftragsverarbeiter; `/danke/` und `/checkliste/danke/` sprechen vom bestätigten Newsletter statt von „startet, sobald der Versand eingerichtet ist“; `/checkliste/` bettet das Formular ein. Beim Umschalten das „Stand“-Datum in `src/pages/datenschutz.astro` anpassen. Beide Dateien stehen auf der Liste „Nur Dominik“.

## 7. Teilen-Buttons

`src/components/ShareButtons.astro` liegt auf `/danke/`: WhatsApp, E-Mail, LinkedIn und „Link kopieren“, ohne Skripte von Drittanbietern. Der geteilte Link führt auf die Startseite mit `utm_source=empfehlung`, damit Plausible Empfehlungen als Quelle zeigt. Der vorgeschriebene Text nennt keine Markennamen von Arzneimitteln und keine Claims außerhalb von `CLAIMS.md`; wer ihn ändert, hält das ein.

## 8. Checkliste als PDF

`/checkliste/` ist als Seite lesbar und druckbar. Das PDF unter `/downloads/checkliste-8-wochen.pdf` entsteht aus der gebauten Seite mit `npm run pdf:checkliste` (Playwright, Chromium) und wird mit committet. Nach jeder Änderung an `src/pages/checkliste/index.astro` neu erzeugen. `/downloads/` trägt `X-Robots-Tag: noindex` (`vercel.json`), damit das PDF nicht neben der Seite rankt.
