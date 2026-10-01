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
| https://nachderspritze.de/wissen/heisshunger-nach-abnehmspritze/ | neuer Artikel | 2026-09-30 | bereits indexiert 2026-10-01 (laut URL-Prüfung auf Google, keine Anmeldung nötig) |
| https://nachderspritze.de/wissen/saxenda-absetzen/ | neuer Artikel | 2026-09-30 | angemeldet 2026-10-01 |
| https://nachderspritze.de/wissen/ernaehrung-nach-abnehmspritze/ | neuer Artikel | 2026-09-30 | angemeldet 2026-10-01 |
| https://nachderspritze.de/wissen/supplements-nach-abnehmspritze/ | neuer Artikel | 2026-09-30 | angemeldet 2026-10-01 |
| https://nachderspritze.de/ueber/ | Text komplett neu; Google zeigt noch den alten Snippet | 2026-09-30 | angemeldet 2026-09-30 (neuer Text war da schon live) |
| https://nachderspritze.de/wissen/kreatin-abnehmspritze/ | neue Abschnitte Wegovy/Mounjaro/Ozempic und FAQ; rankt bereits | 2026-09-30 | angemeldet 2026-10-01 |
| https://nachderspritze.de/wissen/muskelabbau-abnehmspritze/ | neuer Abschnitt „Woran du Muskelabbau erkennst“ | 2026-09-30 | angemeldet 2026-10-01 |
| https://nachderspritze.de/wissen/abnehmspritze-absetzen/ | neue Abschnitte „Was beim Absetzen körperlich passiert“ und „Wiedereinstieg“ | 2026-09-30 | angemeldet 2026-10-01 |
| https://nachderspritze.de/wissen/ | Hub listet fünf neue Artikel | 2026-09-30 | angemeldet 2026-10-01 |
| https://nachderspritze.de/glossar/ | neue Sektion: Glossar mit 20 Begriffen (nach Merge des Preview-Branches) | 2026-09-30 | offen |
| https://nachderspritze.de/glossar/haltephase/ | eigener Begriff, Priorität | 2026-09-30 | offen |
| https://nachderspritze.de/glossar/absetzkurve/ | eigener Begriff, Priorität | 2026-09-30 | offen |
| https://nachderspritze.de/marktradar/ | neue Sektion: Marktradar (nach Merge des Preview-Branches) | 2026-09-30 | offen |
| https://nachderspritze.de/erfahrungen/ | Erfahrungsformular live, Seite jetzt indexierbar | 2026-09-30 | offen |
| https://nachderspritze.de/checkliste/ | neue Seite: Checkliste „Die ersten 8 Wochen nach der letzten Dosis“ (nach Merge des PR) | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/abnehmpille-absetzen/ | neuer Artikel, Pillen-Cluster, Priorität | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/abnehmpille-oder-spritze/ | neuer Artikel, Pillen-Cluster | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/wegovy-absetzen/ | neuer Abschnitt „Gilt das auch für die Wegovy-Tablette?“ | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/magnesium-abnehmspritze/ | neuer Artikel, Supplement-Reihe (Nischen-Painpoints) | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/vitamin-d-abnehmspritze/ | neuer Artikel, Supplement-Reihe | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/vitamin-b12-abnehmspritze/ | neuer Artikel, Supplement-Reihe | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/eisen-abnehmspritze/ | neuer Artikel, Supplement-Reihe | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/omega-3-abnehmspritze/ | neuer Artikel, Supplement-Reihe | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/glucomannan-abnehmspritze/ | neuer Artikel, Supplement-Reihe | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/abnehmspritze-gesicht/ | neuer Artikel, Painpoint „Ozempic Face“ | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/haarausfall-abnehmspritze/ | neuer Artikel, Painpoint Haarausfall | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/supplements-nach-abnehmspritze/ | neuer Abschnitt „Einzelne Supplements im Detail“, Tabelle erweitert | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/ernaehrung/ | Themenseite: acht neue Artikel und Fragen | 2026-10-01 | offen |
| https://nachderspritze.de/grafiken/ | neue Seite: zwölf Studien-Grafiken mit Download, Einbettungscode, ImageObject-Schema | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/abnehmspritze-absetzen/ | Hauptartikel ausgebaut: Inhaltsverzeichnis, zwei Grafiken, updatedDate | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/jojo-effekt-abnehmspritze/ | drei Grafiken ergänzt | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/muskelabbau-abnehmspritze/ | Grafik Körperzusammensetzung ergänzt | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/krafttraining-nach-abnehmspritze/ | Grafik S-LiTE ergänzt | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/gewicht-halten-nach-abnehmspritze/ | zwei Grafiken ergänzt | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/abnehmpille-oder-spritze/ | zwei Grafiken ergänzt | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/abnehmpille-absetzen/ | Grafik „belegt und offen“ ergänzt | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/protein-abnehmspritze/ | Grafik Proteinbedarf ergänzt | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/ernaehrung-nach-abnehmspritze/ | Grafik Proteinbedarf ergänzt | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/haarausfall-abnehmspritze/ | Grafik Zeitverlauf ergänzt | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/mounjaro-absetzen/ | Grafik Halbwertszeiten ergänzt | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/ | Grafik Zeitachse im Hub | 2026-10-01 | offen |
| https://nachderspritze.de/marktradar/ | Preisgrafik ergänzt | 2026-10-01 | offen |
| https://nachderspritze.de/wissen/absetzen/ | neue Seite: Themenseite Absetzen und Pausieren (nach Merge des Hub-PR) | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/praeparate/ | neue Seite: Themenseite Absetzen nach Präparat (nach Merge des Hub-PR) | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/abnehmpille/ | neue Seite: Themenseite Abnehmpille (Priorität) (nach Merge des Hub-PR) | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/muskeln/ | neue Seite: Themenseite Muskeln (nach Merge des Hub-PR) | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/ernaehrung/ | neue Seite: Themenseite Ernährung (nach Merge des Hub-PR) | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/gewicht-halten/ | neue Seite: Themenseite Gewicht halten (nach Merge des Hub-PR) | 2026-09-30 | offen |
| https://nachderspritze.de/wissen/ | Hub nach Themen gegliedert, verlinkt sechs Themenseiten | 2026-09-30 | angemeldet 2026-10-01 |
| https://nachderspritze.de/wissen/protein-abnehmspritze/ | Priorität laut Dominik; war „Gefunden – zurzeit nicht indexiert“ | 2026-10-01 | angemeldet 2026-10-01 |
| https://nachderspritze.de/glossar/set-point-theorie/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/adaptive-thermogenese/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/sarkopene-adipositas/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/auswaschphase/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/halbwertszeit/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/anabole-resistenz/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/bioimpedanzanalyse/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/dxa/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/fettfreie-masse/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/ghrelin/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/glp-1-rezeptoragonist/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/glucomannan/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/glykogen/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/griffkraft/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/hedonischer-hunger/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/koerperzusammensetzung/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/kreatin-monohydrat/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/leptin/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/leucin-schwelle/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/metabolische-adaptation/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/muskelproteinsynthese/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/neat/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/progressive-belastungssteigerung/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/proteinverteilung/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/ruheenergieverbrauch/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/sarkopenie/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/taillenumfang/ | neu in Sitemap | 2026-10-01 | offen |
| https://nachderspritze.de/glossar/telogenes-effluvium/ | neu in Sitemap | 2026-10-01 | offen |

Die übrigen 18 Glossar-Einträge stehen in der Sitemap und brauchen keine einzelne Anmeldung; wer Tageskontingent übrig hat, nimmt zuerst `set-point-theorie`, `adaptive-thermogenese`, `sarkopene-adipositas`, `auswaschphase` und `halbwertszeit`.
