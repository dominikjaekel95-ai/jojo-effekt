# Newsletter, Checkliste und Teilen: Konzept, Einwilligungstexte, Einrichtung

Stand: 30. September 2026. Zuständig: Dominik. Die Seite ist vorbereitet; live geht der Newsletter erst, wenn die Schalter in `src/data/site.ts` gesetzt sind (Abschnitt 6).

## 1. Warum ein Newsletter

Die Vorbestell-Liste darf nur Neuigkeiten zum Set bekommen; so steht es im Formular und in der Datenschutzerklärung. Alles andere (neue Artikel, Studien, Marktradar) braucht eine eigene, ausdrückliche Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 7 Abs. 2 Nr. 2 UWG). Deshalb:

- Ein optionales Kästchen „Newsletter“ im Vorbestell-Formular und im Checklisten-Formular. Nicht vorangekreuzt, nicht Pflicht, nicht mit der Datenschutz-Einwilligung zusammengelegt.
- Wer nur vorbestellt, bekommt nur Set-Mails. Wer das Kästchen ankreuzt, bekommt zusätzlich den Newsletter.
- Bestehende Einträge auf der Vorbestell-Liste dürfen keinen Newsletter bekommen. Die erste Set-Mail an sie darf einen Link „Newsletter abonnieren“ enthalten; mehr nicht.

## 2. Was in Tally zu ändern ist

### 2a. Vorbestell-Formular (ID `b5bO9o`)

Ein neues Feld vom Typ Checkbox, nach der Datenschutz-Einwilligung, **optional**:

> Ja, schickt mir etwa alle zwei Wochen den Newsletter von Nach der Spritze: neue Artikel, Studien und Entwicklungen zur Zeit nach der Abnehmspritze. Abmelden geht in jeder Mail. Datenschutz: nachderspritze.de/datenschutz/

Feldname (Exportspalte): `Newsletter`. Weiterleitung nach dem Absenden bleibt `https://nachderspritze.de/danke/`.

### 2b. Neues Formular „Checkliste als PDF“

Felder in dieser Reihenfolge:

1. **E-Mail-Adresse**, Typ E-Mail, Pflicht.
2. **Datenschutz**, Checkbox, Pflicht: „Ich bin einverstanden, dass meine E-Mail-Adresse gespeichert wird, um mir die Checkliste zu schicken. Widerruf jederzeit. Datenschutz: nachderspritze.de/datenschutz/“
3. **Newsletter**, Checkbox, optional, Text wie in 2a.

Einstellungen: „Redirect on completion“ auf `https://nachderspritze.de/checkliste/danke/`. Titel und Beschreibung im Formular ausblenden (die Seite zeigt sie). Die Danke-Seite bietet das PDF sofort zum Download an; ein Mailversand aus Tally ist nicht nötig. Wer das PDF per Mail will: Tally → Integrations → E-Mail-Benachrichtigung an den Absender mit dem Link `https://nachderspritze.de/downloads/checkliste-8-wochen.pdf` (optional).

Nach dem Veröffentlichen die Formular-ID in `src/data/site.ts` eintragen: `checklistForm: { id: '<ID>', live: true }`. Bis dahin zeigt `/checkliste/` den Weg per E-Mail an Dominik.

## 3. Versanddienst

Empfehlung: **Brevo** (früher Sendinblue; Server in der EU, Auftragsverarbeitungsvertrag im Konto abrufbar, kostenloser Tarif bis 300 Mails pro Tag, Double-Opt-in-Vorlagen, Abmeldelink automatisch). Alternativen mit Sitz in Deutschland: rapidmail, CleverReach. Kein Mailchimp (US-Anbieter, Verarbeitung außerhalb der EU nur mit Zusatzaufwand).

Einrichtung, einmalig:

1. Konto anlegen, Absenderadresse `hallo@nachderspritze.de` verifizieren, bei INWX die vom Dienst genannten DNS-Einträge (DKIM, ggf. DMARC) setzen, damit die Mails nicht im Spam landen. SPF bei INWX um den Dienst ergänzen.
2. Auftragsverarbeitungsvertrag im Konto akzeptieren und ablegen.
3. Liste „Newsletter“ anlegen. Attribute: `Quelle` (vorbestellung | checkliste), `Einwilligung am`.
4. Impressum-Block für die Fußzeile jeder Mail: Name, Anschrift, E-Mail aus `src/data/site.ts` (`owner`, `email`), plus Abmeldelink. Pflicht nach § 5 DDG und § 7 UWG.
5. Adresse und Datenschutz-URL des Dienstes in `site.ts` eintragen (Abschnitt 6). Beispiel für Brevo, beim Einrichten mit dem Auftragsverarbeitungsvertrag abgleichen: Sendinblue GmbH, Köpenicker Straße 126, 10179 Berlin, `https://www.brevo.com/de/legal/privacypolicy/`.

## 4. Adressen übernehmen (bis eine Automatik läuft)

Tally speichert je Antwort den Zeitpunkt und den Wortlaut der Felder; das ist der Einwilligungsnachweis. Ablauf alle zwei Wochen vor dem Versand:

1. Tally → Formular → Responses → Export CSV, für beide Formulare.
2. Nur Zeilen mit `Newsletter = Yes` behalten. Spalten: E-Mail, Datum, Quelle.
3. In Brevo in die Liste „Newsletter“ importieren (Duplikate werden zusammengeführt). Keine Adresse ohne gesetztes Kästchen.
4. Abmeldungen laufen über den Link in der Mail; zusätzlich Abmeldewünsche per E-Mail an `hallo@` von Hand austragen und in Tally die Antwort löschen.

Später möglich: Tally → Integrations → Brevo (nativ) oder ein Zap, das nur bei `Newsletter = Yes` überträgt. Erst einrichten, wenn der Handablauf zweimal gelaufen ist.

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
checklistForm: { id: '<Tally-ID>', live: true },
newsletter: {
  provider: { name: 'Brevo', address: 'Sendinblue GmbH, Köpenicker Straße 126, 10179 Berlin', url: 'https://www.brevo.com/de/legal/privacypolicy/' },
  cadence: 'etwa alle zwei Wochen',
},
```

Was dann automatisch passiert: `/datenschutz/` zeigt die Abschnitte 4b (Checkliste) und 4c (Newsletter); `/danke/` und `/checkliste/danke/` nennen den Newsletter; `/checkliste/` bettet das Formular ein. Beim Umschalten das „Stand“-Datum in `src/pages/datenschutz.astro` anpassen. Beide Dateien stehen auf der Liste „Nur Dominik“.

## 7. Teilen-Buttons

`src/components/ShareButtons.astro` liegt auf `/danke/`: WhatsApp, E-Mail, LinkedIn und „Link kopieren“, ohne Skripte von Drittanbietern. Der geteilte Link führt auf die Startseite mit `utm_source=empfehlung`, damit Plausible Empfehlungen als Quelle zeigt. Der vorgeschriebene Text nennt keine Markennamen von Arzneimitteln und keine Claims außerhalb von `CLAIMS.md`; wer ihn ändert, hält das ein.

## 8. Checkliste als PDF

`/checkliste/` ist als Seite lesbar und druckbar. Das PDF unter `/downloads/checkliste-8-wochen.pdf` entsteht aus der gebauten Seite mit `npm run pdf:checkliste` (Playwright, Chromium) und wird mit committet. Nach jeder Änderung an `src/pages/checkliste/index.astro` neu erzeugen. `/downloads/` trägt `X-Robots-Tag: noindex` (`vercel.json`), damit das PDF nicht neben der Seite rankt.
