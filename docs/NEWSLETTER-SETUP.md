# Newsletter: Versand über MailerLite (Stand 30.09.2026, 15:15)

Eingerichtet von der Browser-Instanz in Dominiks MailerLite-Konto (Free-Plan, Login mit der Gmail-Adresse). Tally bleibt das Formular-Werkzeug; MailerLite ist nur Verteiler und Versand.

## Was steht

| Punkt | Stand |
|---|---|
| Sending-Domain `nachderspritze.de` | **authentifiziert** (DKIM-CNAME `litesrv._domainkey`, SPF um `include:_spf.mlsend.com` ergänzt, Verifizierungs-TXT; alles bei INWX gesetzt, ImprovMX-Weiterleitung unverändert) |
| Absender | Dominik von Nach der Spritze `<dominik@nachderspritze.de>` (Standard und für die Bestätigungsmail) |
| Gruppen | **Newsletter** `200039673188321227` · **Checkliste** `200039701111899565` |
| Double-Opt-in für API und Integrationen | **an** → jeder per API angelegte Abonnent bekommt die Bestätigungsmail und zählt erst nach dem Klick |
| Bestätigungsmail | MailerLite-Standard, **englisch** („Confirm your email address“); im Free-Plan nicht editierbar. Entscheidung Dominik: bleibt vorerst so; Upgrade „Growing Business“ (~10 €/Monat) macht sie deutsch und entfernt das Branding |
| Footer | Firmenprofil „Nach der Spritze · Dominik Jäkel, Stresemannstr. 76, 10963 Berlin“ wird automatisch eingefügt (§ 5 DDG) |
| Formular „Newsletter Website“ | angelegt, Gruppe Newsletter, Design Standard, nicht eingebettet (Tally übernimmt) |

## Anbindung Tally → MailerLite (Coding-Instanz)

Tally hat keine native MailerLite-Integration (nur Mailchimp, Make, Zapier, Webhooks). Empfohlen: Tally-Webhook → Vercel-Funktion → MailerLite-API.

- Endpoint: `POST https://connect.mailerlite.com/api/subscribers`, Header `Authorization: Bearer <MAILERLITE_API_KEY>`, Body `{ "email": "...", "groups": ["<Gruppen-ID>"], "status": "unconfirmed" }`. Mit `unconfirmed` plus der Konto-Einstellung oben geht die Bestätigungsmail automatisch raus.
- Nur Einträge übertragen, bei denen das Newsletter-Häkchen gesetzt ist (Feld „Newsletter“ in `b5bO9o`, `ODOJWR`, `WOxpjv`). Aus `WOxpjv` zusätzlich in die Gruppe Checkliste; aus den anderen beiden nur Newsletter.
- Tally-Webhook-Signatur prüfen (Signing Secret in Tally → Integrations → Webhooks), sonst kann jeder Adressen einspielen.
- Umgebungsvariablen in Vercel (nicht ins Repo): `MAILERLITE_API_KEY` (Dominik erzeugt ihn unter MailerLite → Integrations → API), `MAILERLITE_GROUP_NEWSLETTER=200039673188321227`, `MAILERLITE_GROUP_CHECKLISTE=200039701111899565`, `TALLY_SIGNING_SECRET`.
- Datenschutzerklärung: Absatz „Newsletter“ mit MailerLite (MailerLite Limited, Irland, EU) als Auftragsverarbeiter, Double-Opt-in, Protokollierung von Zeitpunkt und IP der Einwilligung, Abmeldung per Link, Speicherdauer bis Widerruf; Absatz „Checkliste“ (Zweck Bereitstellung und Aktualisierungen).

## Offen (Dominik)

1. API-Key erzeugen und in Vercel eintragen (5 Minuten), dann Coding-Instanz Bescheid geben.
2. Entscheidung Bestätigungsmail: englisch lassen oder Upgrade, sobald der Verteiler wächst.
3. Erste Ausgabe erst, wenn mindestens ein Dutzend bestätigte Adressen da sind; vorher Test an sich selbst.
