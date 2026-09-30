# Onboarding: ein zweiter Claude-Agent für Nach der Spritze

Für Michi und seinen Claude-Agenten. Die verbindlichen Regeln stehen in [`CLAUDE.md`](../CLAUDE.md) im Repo-Root; Claude Code lädt sie in jeder Session automatisch. Dieses Dokument ist der Einstieg.

## Teil 1: Was Michi einmalig tut (10 Minuten)

1. **GitHub-Einladung annehmen.** Dominik lädt dich als Collaborator (Write) in `dominikjaekel95-ai/jojo-effekt` ein. Die Einladung kommt per E-Mail und unter github.com/notifications.
2. **Claude mit GitHub verbinden.** Auf https://claude.ai/connect-github das eigene GitHub-Konto verbinden. Die Claude-GitHub-App ist auf dem Repo bereits installiert; falls die Seite sie als fehlend anzeigt, dort installieren oder Dominik bitten.
3. **Session starten.** Auf claude.ai/code eine neue Session mit dem Repo `dominikjaekel95-ai/jojo-effekt` anlegen. Claude Code erstellt dafür einen eigenen Branch `claude/…`. Das ist gewollt: auf diesem Branch wird gearbeitet, nie auf dem Produktions-Branch.
4. **Erste Nachricht** an den Agenten (kopieren):

```
Lies zuerst vollständig: CLAUDE.md, docs/ONBOARDING.md, docs/REDAKTION.md, CLAIMS.md.
Dann: npm ci und npm run check:all. Beides muss ohne Fehler durchlaufen.
Melde mir kurz: Anzahl der veröffentlichten Artikel in src/content/wissen/, die nächsten
drei Themen mit Status „offen“ in docs/REDAKTION.md, und ob check:all grün ist.
Ändere noch nichts. Arbeite ab jetzt ausschließlich nach CLAUDE.md: nie auf den
Produktions-Branch pushen, jede Änderung als Pull Request mit Preview.
```

## Teil 2: Was der Agent in der ersten Session tut

1. `CLAUDE.md`, `docs/REDAKTION.md` (Playbook mit Themenliste), `CLAIMS.md` (Health-Claim-Register) und einen Artikel als Vorlage lesen (`src/content/wissen/kreatin-abnehmspritze.md`).
2. `npm ci`, dann `npm run check:all`. Erwartung: Build ohne Fehler, `astro check` ohne Fehler, „Textprüfung: keine Treffer“.
3. Den Stand melden (siehe erste Nachricht) und auf eine Aufgabe warten.

## Teil 3: So läuft jede Aufgabe

1. `git fetch origin` und den Produktions-Branch in den eigenen Branch mergen: `git merge origin/claude/jojo-effekt-website-launch-5n0nls`. Dienstags liegt dort oft ein neuer Push der Redaktions-Routine.
2. Bei einem neuen Artikel: das Thema in `docs/REDAKTION.md` Abschnitt 4 auf `in Arbeit · Michi · <Datum>` setzen, damit die Routine es nicht parallel schreibt.
3. Ändern. Für Artikel gilt Abschnitt 2 und 3 des Playbooks: 900 bis 1.500 Wörter, „Kurz gesagt“-Box, Tabelle, FAQ, Fußnoten mit Quellen-IDs aus `src/data/sources.ts`, Abschnitt „Wann du zur Ärztin gehst“, kursiver Schluss.
4. `npm run check:all`. Erst pushen, wenn alles grün ist.
5. `git push -u origin <session-branch>`, dann Pull Request gegen `claude/jojo-effekt-website-launch-5n0nls` eröffnen. Die PR-Vorlage enthält die Checkliste.
6. Preview-URL aus dem PR (Kommentar von Vercel) auf Handy und Desktop prüfen: geänderte Seiten, Startseite, ein Artikel.
7. Wenn CI grün ist, die Preview stimmt und keine Datei aus der Liste „Nur Dominik“ betroffen ist: mergen mit „Merge“. Sonst Dominik um den Merge bitten.
8. Nach dem Merge Dominik die neuen URLs nennen, damit er sie in der Google Search Console anmeldet. Bing wird automatisch benachrichtigt.

Bericht am Ende jeder Aufgabe, kurz: PR-Link, Preview-Link, betroffene URLs, neue Quellen, offene Fragen.

## Teil 4: Was der Agent nicht kann und wer es macht

| Aufgabe | Wer |
|---|---|
| Google Search Console (URL-Prüfung, Sitemap) | Dominik, manuell |
| Vercel-Einstellungen (Domain, Env-Variablen, Deployment Protection) | Dominik |
| Tally-Formular, Plausible | Dominik |
| Dienstags-Routine (Wochenartikel) ändern oder stoppen | Dominik |
| `reviewer` in `src/data/site.ts` setzen | Dominik, erst nach echter fachlicher Prüfung durch eine qualifizierte Person |
| Startseite, Preise, Claims, Rechtstexte | PR von jedem, Merge nur Dominik |

## Teil 5: Wenn etwas hakt

- **Push abgelehnt (non-fast-forward):** `git fetch origin && git merge origin/<branch>` (kein Rebase), Konflikte lösen, `check:all`, erneut pushen.
- **Konflikt in `sources.ts`, `studien.ts`, `CLAIMS.md` oder `REDAKTION.md`:** beide Seiten behalten, nichts löschen, nur die Reihenfolge der neuen Einträge festlegen.
- **`check:text` meldet Treffer:** Der Report nennt Datei und Kontext. Meist ein fehlendes Leerzeichen an einem Zeilenumbruch in einer `.astro`-Datei oder ein verbotener Claim. Korrigieren, nicht die Prüfung anpassen.
- **Build bricht mit Schema-Fehler ab:** `metaTitle` über 65 oder `description` über 165 Zeichen, oder eine Quellen-ID fehlt in `src/data/sources.ts`.
- **Preview verlangt einen Vercel-Login:** Dominik schaltet in Vercel unter Project Settings → Deployment Protection die Vercel Authentication für Previews aus. Previews bleiben trotzdem `noindex`.
- **Preview zeigt eine alte Version:** Vercel-Dashboard → Deployments; der Build läuft etwa zwei Minuten.
