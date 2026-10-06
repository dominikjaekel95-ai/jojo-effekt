# Nach der Spritze – Landingpage und Wissens-Hub

Statische Website (Astro 7, Tailwind 4), live unter https://nachderspritze.de. Die Startseite stellt das 12-Wochen-Programm „für die Zeit nach der Abnehmspritze“ vor; ihr Ziel ist die Warteliste (E-Mail). Dazu ein Wissens-Hub für Suchanfragen rund um „Abnehmspritze absetzen / Jojo-Effekt / Muskelabbau“, Glossar, Marktradar, Werkzeuge, Grafiken, Checkliste und Ernährungsplan. Design „Kalk“ (seit 06.10.2026). Ein Projekt von Dominik Jäkel, Berlin.

- Plan und Hintergrund: [`docs/LANDINGPAGE_PLAN.md`](docs/LANDINGPAGE_PLAN.md) und Launchplan [`docs/LAUNCHPLAN.md`](docs/LAUNCHPLAN.md) (beide Stand 29.09.2026, vor dem Umbau vom Vorbestell-Test auf das Programm)
- SEO-Strategie und realistische Ranking-Erwartung: [`docs/SEO-STRATEGIE.md`](docs/SEO-STRATEGIE.md) · Indexierung: [`docs/INDEXIERUNG.md`](docs/INDEXIERUNG.md) · Redaktion: [`docs/REDAKTION.md`](docs/REDAKTION.md)
- Domain-Entscheidung und Wettbewerbs-Benchmark: [`docs/DOMAIN-UND-WETTBEWERB.md`](docs/DOMAIN-UND-WETTBEWERB.md)
- Health-Claim-Register: [`CLAIMS.md`](CLAIMS.md) · Anzeigen und Community-Posts: [`ADS.md`](ADS.md) (Stand Vorbestell-Test; vor jeder Schaltung auf das Programm und die Warteliste umschreiben)
- Newsletter und Formulare: [`docs/NEWSLETTER.md`](docs/NEWSLETTER.md), [`docs/NEWSLETTER-SETUP.md`](docs/NEWSLETTER-SETUP.md) · Ernährungsplan: [`docs/ERNAEHRUNGSPLAN.md`](docs/ERNAEHRUNGSPLAN.md) · Grafiken: [`docs/GRAFIKEN-EINBAU.md`](docs/GRAFIKEN-EINBAU.md) · Textvorschläge Über-Seite: [`docs/UEBER-VORSCHLAG.md`](docs/UEBER-VORSCHLAG.md)

## Lokal starten

```bash
npm install
cp .env.example .env      # optional: SITE_URL und Plausible-Skript-ID
npm run dev               # http://localhost:4321
npm run build             # statischer Build nach dist/
npm run check             # Typprüfung
npm run check:all         # Build + Typprüfung + Textprüfung – Pflicht vor jedem Push
npm run preview           # dist/ lokal ansehen
npm run grafiken          # Grafiken (SVG, PNG), OG-Bilder und Favicon neu erzeugen
npm run pdf:checkliste    # PDF der Checkliste neu erzeugen (baut zuerst)
npm run pdf:ernaehrungsplan  # PDFs der 56 Ernährungspläne neu erzeugen (baut zuerst)
```

Node ≥ 22. Die drei Skripte `grafiken` und `pdf:*` brauchen Playwright mit Chromium (Pfade bei Bedarf über `PLAYWRIGHT_PATH` und `CHROMIUM_PATH`). Schrift: Mona Sans Variable, selbst gehostet (`@fontsource-variable/mona-sans`), kein Google-Fonts-Request.

## Zusammenarbeit (mehrere Personen oder Agenten)

- Regeln für jede Claude-Session: [`CLAUDE.md`](CLAUDE.md) (wird von Claude Code automatisch geladen)
- Einstieg für einen weiteren Agenten: [`docs/ONBOARDING.md`](docs/ONBOARDING.md)
- Produktions-Branch ist `claude/jojo-effekt-website-launch-5n0nls`; jeder Push darauf geht live. Alles andere läuft über Branch → Vercel-Preview (noindex) → Pull Request → CI grün → Merge.

## Struktur

```
src/
  pages/index.astro                 Startseite: Programm, Absetzkurve, Warteliste (WaitlistForm), FAQ
  pages/wissen/index.astro          Wissens-Hub, nach Themen gegliedert
  pages/wissen/[slug].astro         Artikel- und Themenseiten (ArticlePage, HubPage; Article/FAQ/Breadcrumb-Schema)
  pages/wissen/studien.astro        Studien-Tracker (dazu studien.csv.ts)
  pages/glossar/                    Glossar A–Z und Einträge (DefinedTermSet/DefinedTerm, automatische Verknüpfung)
  pages/marktradar/                 Marktradar: Zulassungen, Lieferbarkeit, Preise, Kassen, Studien; feed.xml.ts (RSS)
  pages/werkzeuge/                  Gewichtskorridor, Proteinrechner, Zeitplan nach der letzten Dosis
  pages/abnehmspritze-kosten/       Kosten und Jahreskosten-Rechner (#rechner)
  pages/checkliste/                 Checkliste „Die ersten 8 Wochen nach der letzten Dosis“ (index, danke)
  pages/ernaehrungsplan/            Formular, Danke-Seite, plan/[id].astro (Planseite, noindex, Vorlieben als ?v=)
  pages/grafiken/                   Grafiken mit Download und Einbettungscode; sitemap-grafiken.xml.ts
  pages/danke.astro                 Danke-Seite der Warteliste (noindex)
  pages/newsletter/danke.astro      Danke-Seite des Newsletter-Formulars im Kopf (noindex)
  pages/erfahrungen.astro           Erfahrungsberichte einreichen (Tally ODOJWR, nur bei site.experienceForm.live)
  pages/ueber.astro, impressum.astro, datenschutz.astro, 404.astro
  pages/llms.txt.ts                 /llms.txt für KI-Suchsysteme, beim Build aus den Sammlungen erzeugt
  content/wissen/*.md               Artikel (Frontmatter: Titel, Description, Keywords, FAQ, Quellen-IDs)
  content/glossar/*.md              Glossar-Einträge (term, short, synonyms → automatische Verlinkung aus Artikeln)
  content.config.ts                 Schemata (Längenlimits für Title/Description/short)
  data/site.ts                      Name, Betreiber, Programm-Preisrahmen, Schalter (waitlist, checklistForm, newsletter), Pflichtsatz, Arztsatz
  data/sources.ts                   Quellenregister (jede Zahl auf der Seite verweist hierher)
  data/studien.ts, themen.json      Studien-Tracker; Themenseiten (Einordnung, Fragen)
  data/markt/*.json                 Marktradar-Daten: radar (Einträge), zulassungen, preise, kassen, lieferbarkeit (automatisch)
  data/grafiken.ts                  Register der Grafiken (Quellen, Einbauorte `used`, geplant `ziel`); Datenpunkte in grafiken-daten.json
  data/ernaehrungsplan*.ts, .mjs    Ernährungsplan: Generator, 80 Rezepte, Rezeptkarten, Plan-IDs ek01–ek56 (Reihenfolge nie ändern)
  data/faq.ts, affiliate.ts         FAQ der Startseite; Partnerlinks
  lib/bewegung.ts                   Bewegung beim Scrollen (Einblenden, Hochzählen, Balken, Fortschritt)
  lib/glossar.ts, grafik-daten.ts   Begriffserkennung für die Glossar-Box; Datentabellen unter den Grafiken
  lib/ernaehrungsplan-ansicht.ts    HTML des Plans (Build und Browser)
  components/                       Header, Footer, Logo, SeitenKopf, Cta, Pfeil · Formulare: WaitlistForm, ChecklisteForm, NewsletterPanel ·
                                    Startseite und Grafik: Absetzkurve, PreisBalken, ProductTeaser (Programm-Hinweis), MarktradarTeaser, ErnaehrungsplanTeaser ·
                                    Artikel: ArticlePage, HubPage, AuthorBox, GlossarBox, ChecklistBox, Faq, Fn, Footnotes, AffiliateLinks, ShareButtons, GrafikDaten, GrafikEinbinden
  layouts/Base.astro                <head> mit SEO-Metadaten, JSON-LD, Plausible, Schriftvorladung
  styles/global.css                 Design „Kalk“: Tailwind-Theme (Farben mit fester Bedeutung, Mona Sans), Prose-Styles
  styles/seiten.css                 Bausteine der Unterseiten (Präfix k-), eingebunden über SeitenKopf.astro
api/
  anmeldung.js                      Formulare Warteliste, Kopf-Newsletter, Checkliste → MailerLite (Double-Opt-in)
  ernaehrungsplan.js                Ernährungsplan anfordern → MailerLite (Felder plan, vorlieben)
  newsletter.js                     Tally-Webhook (Erfahrungsformular) → MailerLite; liefert auch die Gruppenlogik für anmeldung.js
scripts/
  check-text.mjs                    Textprüfung über dist/ und Quelltext (Teil von check:all)
  grafiken.mjs                      Einstieg der Grafik-Erzeugung; grafiken-lib / -bestand / -neu / -og (Kalk-Stil, Bestand, neue Grafiken, OG-Bilder und Favicon)
  checkliste-pdf.mjs, ernaehrungsplan-pdf.mjs   PDF-Erzeugung (Druckschriften in scripts/fonts/)
  marktradar-fetch.mjs              Automatischer Abruf (PubMed, BfArM, EMA) → lieferbarkeit.json, docs/RADAR-KANDIDATEN.json
.github/workflows/                  ci.yml (check:all), indexnow.yml (Bing), marktradar.yml (montags)
public/                             favicon.svg, og-default.png, og-studien.png, apple-touch-icon.png, robots.txt, grafiken/, downloads/ (PDFs, noindex)
vercel.json                         Trailing Slash, Rewrites für api/, Security- und Cache-Header, noindex für /downloads/
```

Neuen Artikel anlegen: Markdown-Datei in `src/content/wissen/` mit dem Frontmatter eines bestehenden Artikels als Vorlage. Quellen als IDs aus `src/data/sources.ts` in Zitierreihenfolge; im Text mit `<sup><a href="#fn-ID">n</a></sup>` verweisen. Build bricht ab, wenn Title/Description zu lang sind oder eine Quellen-ID fehlt.

## Einrichtung: so geht es live (ca. 30 Minuten)

1. **GitHub:** Dieses Repo liegt unter `dominikjaekel95-ai/jojo-effekt`. Produktions-Branch ist `claude/jojo-effekt-website-launch-5n0nls` (es gibt keinen `main`).
2. **Vercel:** vercel.com → „Add New Project“ → GitHub-Repo importieren. Framework wird als Astro erkannt (Build `npm run build`, Output `dist`). Unter *Settings → Functions/Region*: **Frankfurt (fra1)** wählen (die Funktionen in `api/` laufen dort). Unter *Settings → Environment Variables* setzen:
   - `SITE_URL` = `https://<deine-domain>` (ohne Slash am Ende)
   - `PUBLIC_PLAUSIBLE_SCRIPT_ID` = Skript-ID aus Plausible (optional; Standardwert steht in `src/data/site.ts`)
   - die MailerLite-Variablen aus Schritt 4 (nie ins Repo)

   Deploy auslösen. Jeder Push auf den Produktions-Branch deployt neu; jeder andere Branch bekommt eine Preview-URL mit `noindex`. Alternative Cloudflare Pages: Die Seite läuft dort mit denselben Einstellungen; die Funktionen in `api/` sind für Vercel geschrieben.
3. **Domain:** Bei INWX, Cloudflare Registrar oder Namecheap kaufen (siehe `docs/DOMAIN-UND-WETTBEWERB.md`). In Vercel *Settings → Domains* die Domain eintragen; Vercel zeigt den CNAME (`cname.vercel-dns.com`) bzw. A-Record. Beim Registrar eintragen; `www` als Weiterleitung auf die Hauptdomain. DNS braucht 10 Minuten bis einige Stunden. HTTPS macht Vercel automatisch.
4. **MailerLite** (Warteliste, Newsletter, Checkliste, Ernährungsplan; ersetzt den früheren Tally-Schritt für die Vorbestellung):
   - Konto anlegen, Sending-Domain authentifizieren (DKIM und SPF beim Registrar), Absender `dominik@nachderspritze.de`. In den Kontoeinstellungen **Double-Opt-in für API und Integrationen einschalten** (Stand und Hinweise in `docs/NEWSLETTER-SETUP.md`). Alle Formulare der Seite legen Adressen mit Status `unconfirmed` an; die Bestätigungs-Mail verschickt MailerLite.
   - Gruppen anlegen: „Newsletter“ (Pflicht), „Warteliste“ (optional, siehe unten), „Checkliste“, „Ernährungsplan“ (für den Plan Pflicht).
   - Felder anlegen (Subscribers → Fields, Typ Text): `quelle` (ohne es lässt sich die Warteliste in der Newsletter-Gruppe nicht von Newsletter-Abonnenten unterscheiden), `starterpaket`, `plan`, `vorlieben`. Fehlt ein Feld, legen die Funktionen die Adresse trotzdem an, nur ohne dieses Feld.
   - API-Schlüssel erzeugen (*Integrations → API*), die Gruppen-IDs aus MailerLite kopieren und in Vercel eintragen, danach einmal neu deployen:

   | Variable (Vercel) | Wofür |
   |---|---|
   | `MAILERLITE_API_KEY` | Pflicht. API-Schlüssel |
   | `MAILERLITE_GROUP_NEWSLETTER` | Pflicht. ID der Gruppe „Newsletter“ (ersatzweise `MAILERLITE_GROUP_ID`) |
   | `MAILERLITE_GROUP_WARTELISTE` | Optional. ID der Gruppe „Warteliste“. Ohne sie landet die Warteliste in der Newsletter-Gruppe mit `quelle=warteliste`, und die Einwilligung nennt Warteliste UND Newsletter. Sobald gesetzt: in `src/data/site.ts` `waitlist.ownGroup` auf `true`, dann ist der Newsletter ein freiwilliges Zusatz-Häkchen |
   | `MAILERLITE_GROUP_CHECKLISTE` | Empfohlen. ID der Gruppe „Checkliste“. Ohne sie funktioniert das Checklisten-Formular nur mit gesetztem Newsletter-Häkchen (sonst Fehlermeldung, das PDF bleibt auf der Danke-Seite erreichbar) |
   | `MAILERLITE_GROUP_ERNAEHRUNGSPLAN` | Pflicht für den Ernährungsplan. ID der Gruppe „Ernährungsplan“; die Automation dazu steht in `docs/ERNAEHRUNGSPLAN.md` |
   | `TALLY_SIGNING_SECRET` | Empfohlen. Frei gewählte lange Zeichenkette für den Tally-Webhook des Erfahrungsformulars |

   Die Formulare (`WaitlistForm`, `ChecklisteForm`, `NewsletterPanel` im Kopf) posten an `/api/anmeldung/` und leiten auf `/danke/`, `/checkliste/danke/` bzw. `/newsletter/danke/` weiter. Test: Wartelisten-Formular auf der Startseite mit eigener Adresse absenden → Weiterleitung auf `/danke/` → Bestätigungs-Mail von MailerLite → Adresse in der richtigen Gruppe, Feld `quelle=warteliste`. Zum Schluss `site.newsletter.provider` in `src/data/site.ts` prüfen; Datenschutz und Danke-Seiten folgen diesem Wert.
5. **Tally** (nur noch das Erfahrungsformular `ODOJWR`; Vorbestell- und Checklisten-Formular sind abgelöst): Formular mit optionalem Newsletter-Kästchen (Wortlaut in `docs/NEWSLETTER.md`, Abschnitt 2a), Webhook auf `https://<domain>/api/newsletter/` mit dem Signing Secret aus `TALLY_SIGNING_SECRET`. Erst nach dem Veröffentlichen `site.experienceForm.live` auf `true` setzen; vorher zeigt `/erfahrungen/` nur die Regeln und die E-Mail-Adresse.
6. **Plausible:** plausible.io → Site anlegen → *Settings → Site installation*: Skript-ID (`pa-…`) in `src/data/site.ts` bzw. `PUBLIC_PLAUSIBLE_SCRIPT_ID` eintragen. Unter *Settings → Tracking* Outbound links, Custom event tracking und Custom properties einschalten. Unter *Goals* anlegen:
   - Pageview-Ziele: `/danke/` (Warteliste), `/checkliste/danke/`, `/newsletter/danke/`, `/ernaehrungsplan/danke/`
   - Custom Events (Name im Code, Properties in Klammern): `Warteliste Klick` (`position`), `Warteliste Eintragen` (`position`), `Newsletter Klick`, `Newsletter Eintragen` (`position`), `Kontakt Klick` (`kanal`), `Preisfrage` (`preis`), `Affiliate Klick` (`asin`, `position`), `Teilen Klick` (`kanal`), `Checkliste Klick` (`position`), `Checkliste Anfordern`, `Checkliste Download`, `Ernaehrungsplan Teaser`, `Ernaehrungsplan Anfrage`, `Grafik einbinden`

   Prüfen: Seite aufrufen, in Plausible erscheint der Besuch in Echtzeit. Die Liste der Events entsteht aus den Klassen `plausible-event-name=…` im Quelltext (`grep -rn "plausible-event-name" src`).
7. **Google Search Console:** Property für die Domain anlegen (DNS-Verifizierung beim Registrar), Sitemap `https://<domain>/sitemap-index.xml` einreichen. Neue und wesentlich geänderte URLs stehen mit Status `offen` in `docs/INDEXIERUNG.md` und werden über „URL-Prüfung → Indexierung beantragen“ angestoßen. Details in `docs/SEO-STRATEGIE.md`.
8. **Google Ads:** Konto anlegen, Zahlungsdaten hinterlegen (sonst keine Freigabe), Kampagne aus `ADS.md` (vorher auf das Programm umschreiben, Konversion `Warteliste Eintragen` bzw. Ziel `/danke/`) einreichen. Freigabe dauert 1–2 Tage.

## Checkliste vor dem Launch

- [ ] `src/data/site.ts`: Anschrift, PLZ, E-Mail eingetragen (Impressum § 5 DDG) – Platzhalter in eckigen Klammern sind weg
- [ ] `src/data/site.ts`: `reviewer` gesetzt, sobald eine Ernährungswissenschaftlerin / ein Ernährungswissenschaftler die Artikel geprüft hat (vorher steht ehrlich „noch nicht gegengeprüft“ auf der Seite; „fachlich geprüft“ bleibt verboten, solange `reviewer` `null` ist)
- [ ] Arztsatz: nur `site.medicalTeamSentence`, wörtlich, nur auf der Über-Seite, im Artikelfuß und im Footer (`CLAIMS.md` Abschnitt H); nirgends beim Programm, im Wartelisten-Formular, auf der Danke-Seite oder in Anzeigen
- [ ] Host: Apex `nachderspritze.de` ist Haupt-Host; in Vercel unter Domains die Apex-Domain als primär setzen, damit www dorthin weiterleitet (Canonical, Sitemap und OG-URLs zeigen auf die Apex-Domain)
- [x] Kontakt-Adressen eingerichtet (Weiterleitung über ImprovMX, MX/SPF bei INWX): `hallo@nachderspritze.de` für Impressum, Datenschutz und Organization-Schema (`site.email`), `dominik@nachderspritze.de` für Über uns, Tracker, Glossar, Person-Schema und den Kontakt-Button „Schreib uns“ (`site.owner.email`)
- [ ] `CLAIMS.md` freigegeben (Programm-Beschreibung; Mengen und ⚠️-Punkte nur, falls ein Starterpaket kommt)
- [ ] Entscheidung zur Überschrift „Muskeln behalten, Gewicht halten.“ (`CLAIMS.md` D1) getroffen
- [ ] Quellen C14, C16, C17 in `src/data/sources.ts` nachgetragen oder Fußnote entfernt
- [ ] Datenschutzerklärung gegengelesen: MailerLite (Warteliste, Newsletter, Checkliste), Tally (nur Erfahrungen), Plausible, Vercel korrekt, Stand-Datum aktuell
- [ ] `SITE_URL` gesetzt; `public/robots.txt` Sitemap-Zeile auf die echte Domain geändert
- [ ] MailerLite eingerichtet (Schritt 4): Double-Opt-in an, Gruppen und Felder angelegt, Umgebungsvariablen in Vercel gesetzt, neu deployt
- [ ] Wartelisten-Formulare getestet (Startseite: Hero und unterer Block, dort mit Häkchen „Starterpaket“): Absenden → `/danke/` → Bestätigungs-Mail → Adresse in MailerLite mit `quelle=warteliste` (und `starterpaket=ja`)
- [ ] Checklisten-Formular und Kopf-Newsletter getestet (`/checkliste/danke/` mit PDF, `/newsletter/danke/`)
- [ ] Plausible zählt: Besuch, Events `Warteliste Klick` und `Warteliste Eintragen`, Ziel `/danke/`
- [ ] Keine Cookies: Browser-DevTools → Application → Cookies muss leer sein (auch auf `/erfahrungen/` mit geladenem Tally-Formular)
- [ ] Seite auf dem Handy geprüft (Hero, Programm, Absetzkurve, Warteliste, FAQ, Artikel); Bewegung mit `prefers-reduced-motion` und ohne JavaScript geprüft (Endzustand sichtbar)
- [ ] Keine Medikamentennamen auf der Startseite und in Anzeigentexten (`grep -ri "wegovy\|ozempic\|mounjaro" src/pages/index.astro` liefert nichts)
- [ ] Lighthouse mobil: Performance ≥ 95, Accessibility ≥ 95, Best Practices und SEO 100 (Core Web Vitals schützen das Ranking)
- [ ] Search Console: Sitemap eingereicht, Indexierung für neue und geänderte URLs beantragt (`docs/INDEXIERUNG.md`)
- [ ] Google-Ads-Kampagne eingereicht, Community-Post vorbereitet (beides erst nach Umschreiben von `ADS.md`)

## Was bewusst nicht drin ist

- Kein Cookie-Banner: Es werden keine Cookies gesetzt (Plausible ist cookiefrei, das Tally-Formular auf `/erfahrungen/` setzt keine Cookies, Schrift ist selbst gehostet, die Formulare der Seite laufen ohne Skripte Dritter). Sobald ein Dienst mit Cookies dazukommt (z. B. Meta-Pixel), braucht es ein Consent-Tool.
- Kein Verkauf: Das Programm ist noch nicht verfügbar, die Seite sammelt nur Wartelisten-Einträge. Der Preis steht nur als Rahmen („Basis-Programm geplant unter 129 €“), ohne Countdown, ohne Knappheit, ohne Preisvergleich. Zahlung, AGB und Widerruf kommen erst mit dem echten Verkauf (siehe `CLAIMS.md` Abschnitt F).
- Keine Stock-Fotos von Spritzen, keine Markennamen der Medikamente auf der Startseite, keine erfundenen Erfahrungsberichte.
