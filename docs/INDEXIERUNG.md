# Indexierung: welche URLs bei Google angemeldet werden müssen

Die Google Search Console hat keine API für die URL-Prüfung. Die Anmeldung ist Handarbeit: Search Console → URL-Prüfung → „Indexierung beantragen“. Bing und die IndexNow-Partner bekommen jede Änderung automatisch über `.github/workflows/indexnow.yml`.

**Regel:** Wer eine Seite neu anlegt oder inhaltlich wesentlich ändert (Text, Titel, Abschnitte, Struktur), hängt unten eine Zeile mit Status `offen` an. Wer die URL angemeldet hat, setzt `angemeldet YYYY-MM-DD`. Kleinigkeiten (Tippfehler, ein Link, ein Satz) brauchen keine Zeile; der nächste Crawl nimmt sie mit.

Die Search Console erlaubt etwa 10 bis 12 URL-Prüfungen pro Tag. Reihenfolge: neue Artikel zuerst, dann geänderte Seiten, dann der Wissens-Hub.

Sitemap: `https://nachderspritze.de/sitemap-index.xml` (einmalig unter „Sitemaps“ eingereicht; bei Zweifel dort nachsehen, ob sie als „Erfolgreich“ gelistet ist).

| URL | Grund | seit | Status |
|---|---|---|---|
| https://nachderspritze.de/wissen/krafttraining-nach-abnehmspritze/ | neuer Artikel | 2026-09-30 | angemeldet 2026-09-30 |
| https://nachderspritze.de/wissen/heisshunger-nach-abnehmspritze/ | neuer Artikel | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/saxenda-absetzen/ | neuer Artikel | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/ernaehrung-nach-abnehmspritze/ | neuer Artikel | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/supplements-nach-abnehmspritze/ | neuer Artikel | 2026-09-30 | offen |
| https://nachderspritze.de/ueber/ | Text komplett neu; Google zeigt noch den alten Snippet | 2026-09-30 | angemeldet 2026-09-30 |
| https://nachderspritze.de/wissen/kreatin-abnehmspritze/ | neue Abschnitte Wegovy/Mounjaro/Ozempic und FAQ; rankt bereits | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/muskelabbau-abnehmspritze/ | neuer Abschnitt „Woran du Muskelabbau erkennst“ | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/abnehmspritze-absetzen/ | neue Abschnitte „Was beim Absetzen körperlich passiert“ und „Wiedereinstieg“ | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/ | Hub listet fünf neue Artikel | 2026-09-30 | offen |
| https://nachderspritze.de/glossar/ | neue Sektion: Glossar mit 20 Begriffen (nach Merge des Preview-Branches) | 2026-09-30 | offen |
| https://nachderspritze.de/glossar/haltephase/ | eigener Begriff, Priorität | 2026-09-30 | offen |
| https://nachderspritze.de/glossar/absetzkurve/ | eigener Begriff, Priorität | 2026-09-30 | offen |
| https://nachderspritze.de/marktradar/ | neue Sektion: Marktradar (nach Merge des Preview-Branches) | 2026-09-30 | offen |

Die übrigen 18 Glossar-Einträge stehen in der Sitemap und brauchen keine einzelne Anmeldung; wer Tageskontingent übrig hat, nimmt zuerst `set-point-theorie`, `adaptive-thermogenese`, `sarkopene-adipositas`, `auswaschphase` und `halbwertszeit`.
