# Indexierung: welche URLs bei Google angemeldet werden müssen

Die Google Search Console hat keine API für die URL-Prüfung. Die Anmeldung ist Handarbeit: Search Console → URL-Prüfung → „Indexierung beantragen“. Bing und die IndexNow-Partner bekommen jede Änderung automatisch über `.github/workflows/indexnow.yml`.

**Regel:** Wer eine Seite neu anlegt oder inhaltlich wesentlich ändert (Text, Titel, Abschnitte, Struktur), hängt unten eine Zeile mit Status `offen` an. Wer die URL angemeldet hat, setzt `angemeldet YYYY-MM-DD`. Kleinigkeiten (Tippfehler, ein Link, ein Satz) brauchen keine Zeile; der nächste Crawl nimmt sie mit.

Die Search Console erlaubt etwa 10 bis 12 URL-Prüfungen pro Tag. Reihenfolge: neue Artikel zuerst, dann geänderte Seiten, dann der Wissens-Hub.

Sitemap: `https://nachderspritze.de/sitemap-index.xml` (einmalig unter „Sitemaps“ eingereicht; bei Zweifel dort nachsehen, ob sie als „Erfolgreich“ gelistet ist).

**Routine (seit 30.09.2026):** Eine tägliche Claude-Routine (09:10 Uhr Berlin, läuft auf Dominiks Rechner, weil sie die Search Console im Browser bedient) liest diese Tabelle, meldet alle Zeilen mit Status `offen` in Tabellenreihenfolge an (so viele, wie das Tageskontingent zulässt), setzt `angemeldet YYYY-MM-DD`, ergänzt neue Sitemap-URLs, die hier fehlen, als `offen`, und committet nur diese Datei auf den Produktions-Branch. Montags schickt sie zusätzlich eine kurze Übersicht (indexierte Seiten laut Search Console, Klicks und Impressionen der Woche). Menschen tragen nur noch Zeilen ein; angemeldet wird automatisch. Kontingent: ~10 Anfragen je rollierende 24 Stunden – deshalb Änderungen nur eintragen, wenn Titel, Meta-Description oder Struktur betroffen sind.

Angemeldet vor dieser Datei (Stand 29./30.09.): `/`, `/wissen/`, `/ueber/`, `/wissen/studien/` und die Artikel abnehmspritze-absetzen, gewicht-halten-nach-abnehmspritze, jojo-effekt-abnehmspritze, kreatin-abnehmspritze, muskelabbau-abnehmspritze, protein-abnehmspritze, mounjaro-absetzen, ozempic-absetzen, wegovy-absetzen.

| URL | Grund | seit | Status |
|---|---|---|---|
| https://nachderspritze.de/wissen/krafttraining-nach-abnehmspritze/ | neuer Artikel | 2026-09-30 | angemeldet 2026-09-30 |
| https://nachderspritze.de/wissen/heisshunger-nach-abnehmspritze/ | neuer Artikel | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/saxenda-absetzen/ | neuer Artikel | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/ernaehrung-nach-abnehmspritze/ | neuer Artikel | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/supplements-nach-abnehmspritze/ | neuer Artikel | 2026-09-30 | offen |
| https://nachderspritze.de/ueber/ | Text komplett neu; Google zeigt noch den alten Snippet | 2026-09-30 | angemeldet 2026-09-30 (neuer Text war da schon live) |
| https://nachderspritze.de/wissen/kreatin-abnehmspritze/ | neue Abschnitte Wegovy/Mounjaro/Ozempic und FAQ; rankt bereits | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/muskelabbau-abnehmspritze/ | neuer Abschnitt „Woran du Muskelabbau erkennst“ | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/abnehmspritze-absetzen/ | neue Abschnitte „Was beim Absetzen körperlich passiert“ und „Wiedereinstieg“ | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/ | Hub listet fünf neue Artikel | 2026-09-30 | offen |
| https://nachderspritze.de/glossar/ | neue Sektion: Glossar mit 20 Begriffen (nach Merge des Preview-Branches) | 2026-09-30 | offen |
| https://nachderspritze.de/glossar/haltephase/ | eigener Begriff, Priorität | 2026-09-30 | offen |
| https://nachderspritze.de/glossar/absetzkurve/ | eigener Begriff, Priorität | 2026-09-30 | offen |
| https://nachderspritze.de/marktradar/ | neue Sektion: Marktradar (nach Merge des Preview-Branches) | 2026-09-30 | offen |
| https://nachderspritze.de/erfahrungen/ | Erfahrungsformular live, Seite jetzt indexierbar | 2026-09-30 | offen |

Die übrigen 18 Glossar-Einträge stehen in der Sitemap und brauchen keine einzelne Anmeldung; wer Tageskontingent übrig hat, nimmt zuerst `set-point-theorie`, `adaptive-thermogenese`, `sarkopene-adipositas`, `auswaschphase` und `halbwertszeit`.
