# Nach der Spritze – Landingpage und Wissens-Hub

Statische Website (Astro 7, Tailwind 4) für den Vorbestell-Test des 12-Wochen-Sets „Nach der Spritze“ und als SEO-Hub für Suchanfragen rund um „Abnehmspritze absetzen / Jojo-Effekt / Muskelabbau“.

- Plan und Hintergrund: [`docs/LANDINGPAGE_PLAN.md`](docs/LANDINGPAGE_PLAN.md)
- Launchplan (heute → Donnerstag → 3 Wochen → 6 Monate): [`docs/LAUNCHPLAN.md`](docs/LAUNCHPLAN.md)
- SEO-Strategie und realistische Ranking-Erwartung: [`docs/SEO-STRATEGIE.md`](docs/SEO-STRATEGIE.md)
- Domain-Entscheidung und Wettbewerbs-Benchmark: [`docs/DOMAIN-UND-WETTBEWERB.md`](docs/DOMAIN-UND-WETTBEWERB.md)
- Health-Claim-Register: [`CLAIMS.md`](CLAIMS.md) · Anzeigen und Community-Posts: [`ADS.md`](ADS.md)

## Lokal starten

```bash
npm install
cp .env.example .env      # Tally-ID und Plausible-Domain eintragen (optional)
npm run dev               # http://localhost:4321
npm run build             # statischer Build nach dist/
npm run check             # Typprüfung
npm run check:all         # Build + Typprüfung + Textprüfung – Pflicht vor jedem Push
npm run preview           # dist/ lokal ansehen
```

Node ≥ 22. Keine weiteren Abhängigkeiten außer Astro, Tailwind, Sitemap und den selbst gehosteten Schriften (Hanken Grotesk, kein Google-Fonts-Request).

## Zusammenarbeit (mehrere Personen oder Agenten)

- Regeln für jede Claude-Session: [`CLAUDE.md`](CLAUDE.md) (wird von Claude Code automatisch geladen)
- Einstieg für einen weiteren Agenten: [`docs/ONBOARDING.md`](docs/ONBOARDING.md)
- Produktions-Branch ist `claude/jojo-effekt-website-launch-5n0nls`; jeder Push darauf geht live. Alles andere läuft über Branch → Vercel-Preview (noindex) → Pull Request → CI grün → Merge.

## Struktur

```
src/
  pages/index.astro                 Startseite (Sektionen 1–8 aus dem Plan)
  pages/wissen/index.astro          Wissens-Hub
  pages/wissen/[slug].astro         Artikel-Template (Article/FAQ/Breadcrumb-Schema, Autorbox, Quellen)
  pages/danke.astro                 Danke-Seite (noindex)
  pages/impressum.astro, datenschutz.astro, ueber.astro, 404.astro
  content/wissen/*.md               Artikel (Frontmatter: Titel, Description, Keywords, FAQ, Quellen-IDs)
  content.config.ts                 Schema der Artikel (Längenlimits für Title/Description)
  data/site.ts                      Name, Betreiber, Preise, Platzhalter, Pflichtsatz
  data/sources.ts                   Quellenregister (jede Zahl auf der Seite verweist hierher)
  data/faq.ts                       FAQ der Startseite + FAQPage-Schema-Helfer
  components/                       Header, Footer, Cta, PreorderForm (Tally), Faq, Footnotes, AuthorBox, ProductTeaser, SetIllustration
  layouts/Base.astro                <head> mit SEO-Metadaten, JSON-LD, Plausible
  styles/global.css                 Tailwind-Theme (Farben, Schrift) und Prose-Styles
public/                             favicon.svg, og-default.png, apple-touch-icon.png, robots.txt
vercel.json                         Trailing Slash, Security- und Cache-Header
```

Neuen Artikel anlegen: Markdown-Datei in `src/content/wissen/` mit dem Frontmatter eines bestehenden Artikels als Vorlage. Quellen als IDs aus `src/data/sources.ts` in Zitierreihenfolge; im Text mit `<sup><a href="#fn-ID">n</a></sup>` verweisen. Build bricht ab, wenn Title/Description zu lang sind oder eine Quellen-ID fehlt.

## So geht es live (ca. 30 Minuten)

1. **GitHub:** Dieses Repo liegt unter `dominikjaekel95-ai/jojo-effekt`. Produktions-Branch ist `claude/jojo-effekt-website-launch-5n0nls` (es gibt keinen `main`).
2. **Vercel:** vercel.com → „Add New Project“ → GitHub-Repo importieren. Framework wird als Astro erkannt (Build `npm run build`, Output `dist`). Unter *Settings → Functions/Region*: **Frankfurt (fra1)** wählen. Unter *Settings → Environment Variables* setzen:
   - `SITE_URL` = `https://<deine-domain>` (ohne Slash am Ende)
   - `PUBLIC_TALLY_FORM_ID` = die ID aus Tally (Teil nach `tally.so/r/`)
   - `PUBLIC_PLAUSIBLE_SCRIPT_ID` = Skript-ID aus Plausible (optional; Standardwert steht in `src/data/site.ts`)
   Deploy auslösen. Jeder Push auf den Produktions-Branch deployt neu; jeder andere Branch bekommt eine Preview-URL mit `noindex`.
   Alternative Cloudflare Pages: gleiche Einstellungen, Build-Output `dist`.
3. **Domain:** Bei INWX, Cloudflare Registrar oder Namecheap kaufen (siehe `docs/DOMAIN-UND-WETTBEWERB.md`). In Vercel *Settings → Domains* die Domain eintragen; Vercel zeigt den CNAME (`cname.vercel-dns.com`) bzw. A-Record. Beim Registrar eintragen; `www` als Weiterleitung auf die Hauptdomain. DNS braucht 10 Minuten bis einige Stunden. HTTPS macht Vercel automatisch.
4. **Tally:** tally.so → Formular anlegen mit den Feldern E-Mail, Auswahl „Ich nehme aktuell / habe abgesetzt / überlege“, Auswahl „Welches Präparat?“ (Wegovy / Mounjaro / Ozempic / Saxenda / anderes / keins), Checkbox „Ich würde 129 € für 12 Wochen zahlen“, Freitext „Was bräuchtest du?“ (optional), Checkbox Datenschutz (Pflicht). *Settings → Redirect on completion* → `https://<domain>/danke/`. *Settings → Email notifications* an dich. Double-Opt-in: Tally kann Bestätigungs-Mails senden (Integration mit E-Mail-Tool) – alternativ die erste Info-Mail als Bestätigung formulieren. Formular-ID in Vercel eintragen, Redeploy.
5. **Plausible:** plausible.io → Site anlegen → *Settings → Site installation*: Skript-ID (`pa-…`) in `src/data/site.ts` bzw. `PUBLIC_PLAUSIBLE_SCRIPT_ID` eintragen. Unter *Settings → Tracking* Outbound links, Custom event tracking und Custom properties einschalten; unter *Goals* die Custom Events `Vorbestellen Klick`, `Affiliate Klick` und das Pageview-Ziel `/danke/` anlegen. Prüfen: Seite aufrufen, in Plausible erscheint der Besuch in Echtzeit.
6. **Google Search Console:** Property für die Domain anlegen (DNS-Verifizierung beim Registrar), Sitemap `https://<domain>/sitemap-index.xml` einreichen, alle 13 URLs über „URL-Prüfung → Indexierung beantragen“ anstoßen. Details in `docs/SEO-STRATEGIE.md`.
7. **Google Ads:** Konto anlegen, Zahlungsdaten hinterlegen (sonst keine Freigabe), Kampagne aus `ADS.md` einreichen. Freigabe dauert 1–2 Tage.

## Checkliste vor dem Launch

- [ ] `src/data/site.ts`: Anschrift, PLZ, E-Mail eingetragen (Impressum § 5 DDG) – Platzhalter in eckigen Klammern sind weg
- [ ] `src/data/site.ts`: `reviewer` gesetzt, sobald eine Ernährungswissenschaftlerin / ein Ernährungswissenschaftler die Artikel geprüft hat (vorher steht ehrlich „noch nicht gegengeprüft“ auf der Seite)
- [ ] Host: Apex `nachderspritze.de` ist Haupt-Host; in Vercel unter Domains die Apex-Domain als primär setzen, damit www dorthin weiterleitet (Canonical, Sitemap und OG-URLs zeigen auf die Apex-Domain)
- [ ] Kontakt-Adresse `hallo@nachderspritze.de` einrichten (Weiterleitung beim Registrar) und in `src/data/site.ts` eintragen
- [ ] `CLAIMS.md` freigegeben (Mengen, welcher Ballaststoff, „Für wen nicht“, alle ⚠️-Punkte)
- [ ] Entscheidung zur Überschrift (`CLAIMS.md` D1) getroffen
- [ ] Quellen C14, C16, C17 in `src/data/sources.ts` nachgetragen oder Fußnote entfernt
- [ ] Datenschutzerklärung gegengelesen: Tally, Plausible, Vercel korrekt, Stand-Datum aktuell
- [ ] `SITE_URL` gesetzt; `public/robots.txt` Sitemap-Zeile auf die echte Domain geändert
- [ ] Tally-Formular getestet: Absenden → Weiterleitung auf `/danke/` → Eintrag in Tally sichtbar
- [ ] Plausible zählt: Besuch, Event „Vorbestellen Klick“, Ziel `/danke/`
- [ ] Keine Cookies: Browser-DevTools → Application → Cookies muss leer sein (auch mit geladenem Tally-Formular)
- [ ] Seite auf dem Handy geprüft (Hero, Set, Formular, FAQ, Artikel)
- [ ] Keine Medikamentennamen auf der Startseite und in Anzeigentexten (`grep -ri "wegovy\|ozempic\|mounjaro" src/pages/index.astro` liefert nichts)
- [ ] Lighthouse mobil: Performance ≥ 95 (Stand Build 30.09.2026: Performance 100, Accessibility 96+, Best Practices 100, SEO 100)
- [ ] Search Console: Sitemap eingereicht, Indexierung für alle URLs beantragt
- [ ] Google-Ads-Kampagne eingereicht (Mittwoch), Community-Post A vorbereitet (Donnerstag)

## Was bewusst nicht drin ist

- Kein Cookie-Banner: Es werden keine Cookies gesetzt (Plausible ist cookiefrei, Tally-Embed setzt keine Cookies, Schrift ist selbst gehostet). Sobald ein Dienst mit Cookies dazukommt (z. B. Meta-Pixel), braucht es ein Consent-Tool.
- Keine Zahlung, keine AGB, kein Widerruf: Fake-Door-Test. Das kommt erst mit dem echten Verkauf (siehe `CLAIMS.md` Abschnitt F).
- Keine Stock-Fotos von Spritzen, keine Markennamen der Medikamente auf der Startseite.
