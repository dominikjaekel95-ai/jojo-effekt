# Nach der Spritze: Regeln für jede Claude-Session in diesem Repo

Statische Website (Astro 7, Tailwind 4), live unter https://nachderspritze.de. Landingpage für den Vorbestell-Test des 12-Wochen-Sets und ein Wissensbereich, der bei Google für „Abnehmspritze absetzen / Jojo-Effekt / Muskelabbau“ rankt. Die Seite rankt bereits. Ein verlorenes Ranking kostet mehr als jede Verzögerung, deshalb gelten die Regeln unten ohne Ausnahme.

## Deploy: jeder Push auf den Produktions-Branch geht live

- Produktions-Branch: `claude/jojo-effekt-website-launch-5n0nls`. Vercel baut und veröffentlicht jeden Push darauf innerhalb von etwa zwei Minuten. Es gibt keinen `main`.
- Jeder andere Branch bekommt von Vercel automatisch eine Preview-URL. Previews tragen den Header `X-Robots-Tag: noindex` und sind die Testumgebung. Claude Code (Web) legt pro Session einen eigenen Branch `claude/…` an; das ist dein Arbeits-Branch, nie der Produktions-Branch. Zwei Ausnahmen pushen direkt auf den Produktions-Branch: die Dienstags-Routine und Dominiks laufende Launch-Session (ihr Session-Branch ist der Produktions-Branch), beide nur für Artikel und Doku und nur nach grünem `check:all`.
- Täglich 09:10 Uhr (Berlin) pusht die Indexierungs-Routine (Search-Console-Anmeldung, siehe `docs/INDEXIERUNG.md`) ausschließlich Änderungen an `docs/INDEXIERUNG.md` direkt auf den Produktions-Branch; sie ändert sonst nichts.
- Dienstags 08:47 Uhr (Berlin) pusht eine automatische Redaktions-Routine von Dominik drei neue Artikel direkt auf den Produktions-Branch. Sie ändert `src/content/wissen/`, `docs/REDAKTION.md`, `CLAIMS.md` Abschnitt C und bei Bedarf `src/data/sources.ts` und `src/data/studien.ts`. Vor jeder Arbeit `git fetch origin`.

## Arbeitsweise für jede Änderung

1. Branch vom aktuellen Produktionsstand: `git fetch origin && git checkout -b <name>/<thema> origin/claude/jojo-effekt-website-launch-5n0nls` (Name `michi` oder `dominik`, Thema kurz, z. B. `michi/abnehmpille-absetzen`). In einer Claude-Code-Web-Session: den zugewiesenen Session-Branch benutzen und vorher den Produktions-Branch hineinmergen.
2. Ändern, dann `npm run check:all`. Das baut die Seite, prüft Typen und Texte. Erst weiter bei 0 Fehlern und „Textprüfung: keine Treffer“.
3. `git push -u origin <branch>`. Vercel postet die Preview-URL in den Pull Request; sonst steht sie im Vercel-Dashboard unter Deployments.
4. Pull Request gegen `claude/jojo-effekt-website-launch-5n0nls` eröffnen. Die Vorlage wird automatisch eingefügt, Checkliste abhaken. CI (`.github/workflows/ci.yml`) führt `check:all` erneut aus.
5. Preview auf dem Handy und am Desktop ansehen: die geänderten Seiten, die Startseite, ein beliebiger Artikel.
6. Mergen mit „Merge“ (kein Rebase, kein Squash) nur, wenn CI grün ist und die Preview stimmt. PRs, die Dateien aus der Liste „Nur Dominik“ ändern, mergt Dominik.
7. Niemals: direkt auf den Produktions-Branch pushen, `--force`, Rebase oder `commit --amend` auf gepushten Branches, pushen bei rotem `check:all`, Branches anderer Personen umschreiben.

Kleine PRs, ein Thema pro PR, am selben Tag mergen. Zwei Agenten, die eine Woche lang auf getrennten Branches dieselben Dateien ändern, erzeugen Konflikte, die niemand mehr sauber auflösen kann.

## Befehle

```bash
npm ci                 # Abhängigkeiten (Node 22 oder neuer)
npm run dev            # http://localhost:4321
npm run check:all      # build + astro check + Textprüfung; Pflicht vor jedem Push
npm run preview        # dist/ lokal ansehen
```

## SEO-Invarianten (nie ohne Dominik ändern)

- URLs: Dateiname in `src/content/wissen/` = URL. Nie umbenennen, nie löschen. Muss eine URL weg, kommt eine 301-Weiterleitung nach `vercel.json` (`redirects`), und Dominik entscheidet.
- `trailingSlash: 'always'` in `astro.config.mjs` und `vercel.json`, Canonical-Logik in `src/layouts/Base.astro`, `site.url` in `src/data/site.ts`, `public/robots.txt`.
- `noindex` gibt es nur für `/danke/`, `/checkliste/danke/`, `/impressum/`, `/datenschutz/`, die PDFs unter `/downloads/` (Header in `vercel.json`) und, solange `site.experienceForm.live` false ist, `/erfahrungen/` (Sitemap folgt dem Schalter automatisch). Nie auf andere Seiten, nie global.
- `title`, `metaTitle`, `description` und H1 rankender Seiten nicht „verbessern“, ohne den Grund im PR zu nennen. `pubDate` nie ändern; Aktualisierungen bekommen `updatedDate`.
- `draft: true` nimmt einen Artikel aus Build und Sitemap. Nie für einen bereits veröffentlichten Artikel setzen.
- JSON-LD bleibt valide (`Base.astro`, `wissen/[slug].astro`, `wissen/studien.astro`). Nach Änderungen daran den Build-Output in `dist/` prüfen.
- Sitemap und `lastmod` entstehen in `astro.config.mjs` aus dem Frontmatter. Nichts manuell.

## Inhaltsregeln (Kurzfassung; verbindlich sind `docs/REDAKTION.md` Abschnitt 3 und `CLAIMS.md`)

- Für das Set nur die in `CLAIMS.md` freigegebenen, EU-zugelassenen Angaben. Nie: „verhindert den Jojo-Effekt“, „ersetzt die Spritze“, „von Ärzten empfohlen“, Stoffwechsel-Versprechen. `check:text` fängt einige davon ab, nicht alle.
- Keine Dosierungen, Titrationen, Ausschleich- oder Wiedereinstiegsschemata für Medikamente. Keine Absetz-Anleitung, keine Bewertung von Medikamenten, keine Bezugsquellen, keine Rezept-, Nebenwirkungs- oder Kauf-Themen.
- Medikamentennamen (Wegovy, Ozempic, Mounjaro, Saxenda) nie auf der Startseite und in Anzeigentexten; `check:text` prüft die gebaute Startseite darauf. Im Wissensbereich erlaubt; die Startseite verlinkt Präparate-Artikel über `/wissen/#praeparate`.
- Jede Zahl hat eine Quelle in `src/data/sources.ts` (Originalstudie, keine Pressemeldung). Fußnoten als `<sup><a href="#fn-ID">n</a></sup>`, n = Position in `sources` im Frontmatter.
- Kein „fachlich geprüft“, solange `reviewer` in `src/data/site.ts` `null` ist. Keine erfundenen Erfahrungsberichte, keine Testimonials.
- Die Abschnitte „Was wir nicht sagen“ und die Arztsätze bleiben unangetastet.
- Frontmatter-Limits: `metaTitle` bis 65, `description` bis 165 Zeichen. Der Build bricht sonst ab.
- Ton: nüchtern, „du“, keine Superlative, keine Emojis.

## Glossar, Marktradar, Checkliste, Newsletter

- **Glossar** (`src/content/glossar/`, URL `/glossar/<slug>/`): ein Begriff pro Datei, Vorlage `set-point-theorie.md`. Limits: `metaTitle` bis 65, `description` bis 165, `short` bis 260 Zeichen. Die Box „Begriffe in diesem Artikel“ erkennt `term` und `synonyms` automatisch im Artikeltext und verlinkt sie; Glossar-Seiten listen umgekehrt alle Artikel, in denen der Begriff vorkommt. Deshalb: Jeder neue Artikel verwendet mindestens zwei Glossar-Begriffe wörtlich (Haltephase, Absetzkurve, fettfreie Masse, Halbwertszeit, Auswaschphase usw.). Eigene Begriffe (`own: true`) sind nur Haltephase und Absetzkurve; keine weiteren ohne Dominik.
- **Erfahrungen** (`/erfahrungen/`): Tally-Formular `ODOJWR`, eingebettet nur bei `site.experienceForm.live: true` (Dominik schaltet nach dem Veröffentlichen in Tally). Veröffentlichte Berichte folgen den Regeln in `docs/REDAKTION.md` Abschnitt 3 und stehen nie neben dem Produkt-Teaser. Link aus der AuthorBox der Artikel, nicht von der Startseite.
- **Marktradar** (`/marktradar/`): Daten in `src/data/markt/*.json`. `radar.json` enthält die Einträge; `teaser` ist die Startseiten-Fassung und darf keine Markennamen von Arzneimitteln enthalten (`check:text` prüft das), `title` und `summary` dürfen. `lieferbarkeit.json` schreibt nur die Aktion `.github/workflows/marktradar.yml` (montags und per Hand über „Run workflow“); sie pusht nicht auf Produktion, sondern öffnet einen Pull Request „Marktradar: automatischer Abruf“, den Dominik mergt. `preise.json`, `kassen.json`, `zulassungen.json` pflegt Dominik mit `stand`-Datum. Automatisch gesammelte Studien und Behördenmeldungen liegen in `docs/RADAR-KANDIDATEN.json` (Status `neu`, `geprueft`, `verworfen`); daraus wird nur nach Prüfung der Originalquelle ein Eintrag. Feed: `/marktradar/feed.xml`. `/llms.txt` entsteht beim Build aus den Sammlungen.
- **Checkliste** (`/checkliste/`, `src/pages/checkliste/index.astro`): „Die ersten 8 Wochen nach der letzten Dosis“, mit Fußnoten aus `sources.ts`. Jeder Artikel zeigt die `ChecklistBox` nach der Glossar-Box. Das PDF `public/downloads/checkliste-8-wochen.pdf` wird nach jeder Änderung an der Seite mit `npm run pdf:checkliste` neu erzeugt und mit committet. Das Tally-Formular `WOxpjv` (E-Mail gegen PDF, Weiterleitung auf `/checkliste/danke/`) erscheint erst bei `site.checklistForm.live: true`; Spezifikation in `docs/NEWSLETTER.md`.
- **Newsletter**: Konzept, Einwilligungstexte und Einrichtung in `docs/NEWSLETTER.md`. Das optionale Kästchen „Newsletter“ steht in den Tally-Formularen `b5bO9o` (Vorbestellung), `ODOJWR` (Erfahrungen) und `WOxpjv` (Checkliste) und sammelt Einwilligungen; Datenschutz-Abschnitt 4c gilt deshalb immer. Versanddienst ist MailerLite mit Double-Opt-in. Die Übergabe läuft über die Vercel-Funktion `api/newsletter.js` (Tally-Webhook, Signaturprüfung, nur Einträge mit Häkchen, Status `unconfirmed`); API-Schlüssel, Gruppen-ID und Signing Secret liegen nur als Vercel-Umgebungsvariablen, nie im Repo. `site.newsletter.provider` setzt Dominik, sobald Webhooks und Variablen stehen; bis dahin sagen Datenschutz und Danke-Seiten, dass noch nichts verschickt wird. Die Vorbestell-Liste bekommt nur Set-Mails; Newsletter nur an Adressen mit gesetztem Kästchen und bestätigter Anmeldung.
- **Teilen** (`src/components/ShareButtons.astro`, auf `/danke/`): Links ohne Skripte von Dritten, Zielseite mit `utm_source=empfehlung`. Der vorgeschriebene Text enthält keine Markennamen von Arzneimitteln.

## Themen beanspruchen, Doppelungen vermeiden

`docs/REDAKTION.md` Abschnitt 4 ist die einzige Themenliste. Die Dienstags-Routine nimmt die obersten drei Themen mit Status „offen“. Wer ein Thema schreibt, setzt es vorher auf `in Arbeit · <Name> · <Datum>` und mergt diese eine Zeile sofort als Mini-PR oder bittet Dominik darum. Neue Themen kommen unten in die Liste. Nie einen zweiten Artikel zur selben Suchanfrage schreiben: Zwei Seiten auf ein Keyword nehmen sich gegenseitig das Ranking.

## Dateien mit Konfliktrisiko

Diese Dateien ändern beide Agenten und die Routine. Nur anhängen, nie umsortieren, nie umformatieren, PRs damit schnell mergen:

`src/data/sources.ts` · `src/data/studien.ts` · `CLAIMS.md` (Abschnitt C) · `docs/REDAKTION.md` (Themenliste) · `docs/INDEXIERUNG.md` · `src/data/markt/radar.json` · `docs/RADAR-KANDIDATEN.json` · `src/styles/global.css` · `src/pages/wissen/index.astro`

## Nur Dominik (PR ja, selbst mergen nein)

`src/pages/index.astro` (Startseite) · `src/data/site.ts` · `src/pages/ueber.astro`, `impressum.astro`, `datenschutz.astro` · `CLAIMS.md` Abschnitte A, B, E · `src/data/affiliate.ts`, `src/components/AffiliateLinks.astro` · `src/data/markt/preise.json`, `kassen.json`, `zulassungen.json` · `scripts/` · `api/` · `astro.config.mjs` · `vercel.json` · `.github/` · `src/content/wissen/abnehmspritze-absetzen-erfahrungen.md` (bleibt Entwurf, bis echte Berichte vorliegen)

## Technische Eigenheiten

- Astro-Whitespace: In `.astro`-Dateien nie eine Zeile mit Text enden lassen und die nächste mit `{ausdruck}` oder `<a` beginnen. Astro schluckt das Leerzeichen („Alternativ49 €“). Alles auf eine Zeile schreiben. `check:text` prüft dieses Muster jetzt direkt im Quelltext und zusätzlich den Build-Output.
- Tailwind 4: Theme-Tokens in `src/styles/global.css` (`@theme` plus CSS-Variablen je `html[data-theme]`). `@apply` mit eigenen Klassen funktioniert nicht, eigene Utilities als `@utility`. Aktives Design ist `d1` (`PUBLIC_THEME`), die übrigen Varianten bleiben wählbar.
- Schriften selbst gehostet (`@fontsource-variable/*`). Keine externen Requests außer Tally und Plausible. Keine Cookies. Kommt ein Dienst mit Cookies dazu, braucht es ein Consent-Tool.
- Artikel-Template: `src/pages/wissen/[slug].astro`. Vorlage für neue Artikel: `src/content/wissen/kreatin-abnehmspritze.md`.
- Nach dem Merge eines neuen Artikels meldet der IndexNow-Workflow die URL an Bing. Google nur manuell in der Search Console (Dominik). Neue oder wesentlich geänderte URLs kommen als Zeile mit Status `offen` in `docs/INDEXIERUNG.md`.

## Bei Unsicherheit

Lieber fragen als raten. Alles, was Startseite, Preise, Claims, Rechtstexte oder URLs betrifft, geht als PR mit Frage an Dominik, nicht als Merge.
