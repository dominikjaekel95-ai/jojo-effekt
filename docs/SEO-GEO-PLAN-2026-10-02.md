# SEO und GEO: Maßnahmenplan (Stand 02.10.2026)

Erstellt von der Browser-Instanz nach Ranking-Check, Auswertung der Google-Box „Weitere Fragen“ für 27 Suchbegriffe und Einrichtung der Bing-Sitemaps. Für die Coding-Instanz sind die Abschnitte 1 bis 3 gedacht, die Abschnitte 5 und 6 für Dominik. Ergänzt am 02.10.2026, 01:15 um Abschnitt 1b (alle übrigen Artikel) und Abschnitt 5.

Kurzfassung: Bestehende Artikel gezielt erweitern statt neue zu schreiben, die Fragen aus „Weitere Fragen“ wörtlich übernehmen, Antworten so bauen, dass KI-Übersichten sie zitieren können, und nur dort neu schreiben, wo es eine eigene Suchintention gibt. Bei sieben von neun geprüften Suchbegriffen zeigt Google bereits eine KI-Übersicht; wer dort zitiert wird, bekommt die Klicks.

## 0. Stand

| Suchanfrage (Google.de) | 30.09. | 01.10. | 02.10. 00:20 | Seite |
|---|---|---|---|---|
| kreatin abnehmspritze | 1 | 1 | 1 | Kreatin |
| kreatin nach abnehmspritze | 1 + 7 | 1 + 7 | – | Kreatin, Gewicht halten |
| kreatin wegovy | 8 | 8 | – | Kreatin |
| krafttraining nach abnehmspritze | 8 | 5 | 6 | **Muskelabbau**, nicht Krafttraining |
| heißhunger nach abnehmspritze | – | 6 | 6 | Heißhunger |
| muskelabbau abnehmspritze vermeiden | 9 | 9 | – | Muskelabbau |
| abnehmspritze absetzen, jojo effekt, gewicht halten, protein, ernährung, kosten | – | – | – | nicht auf Seite 1 |

– = am 02.10. nicht erneut geprüft. Google-Index: rund 25 Seiten (`site:`), die acht Supplement-Artikel noch nicht. Search Console: Sitemap-Index 68 Seiten, Bild-Sitemap 16 Seiten, beide „Erfolgreich“; Leistungsdaten ab etwa 04.10. Bing Webmaster Tools: eingerichtet (29.09.), Bild-Sitemap am 01.10. eingereicht und gelesen (16 URLs), Sitemap-Index erneut eingereicht; 31 URLs erkannt.

## 1. Rankende und fast rankende Artikel erweitern

Regeln (CLAUDE.md): URL, `pubDate` und H1 nicht ändern. `title`, `metaTitle`, `description` nur mit Begründung im PR. Änderungen sind Ergänzungen, keine Umbauten; danach `updatedDate` setzen und die URL mit Status `offen` in `docs/INDEXIERUNG.md` eintragen.

FAQ-Regel: Alle Artikel haben schon vier bis acht Fragen. Nicht weitere anhängen, sondern die schwächste vorhandene Frage durch die echte Formulierung aus „Weitere Fragen“ ersetzen. Antwort in zwei bis drei Sätzen, mit Zahl und Fußnote, wo es eine gibt. Ziel fünf bis sechs Fragen pro Artikel.

| Artikel | Lage | Maßnahme |
|---|---|---|
| `krafttraining-nach-abnehmspritze` | Google rankt für „krafttraining nach abnehmspritze“ den Muskelabbau-Artikel (Platz 5–6), nicht diesen | Kannibalisierung auflösen: im Muskelabbau-Artikel früh ein Link mit Ankertext „Krafttraining nach der Abnehmspritze“ auf diesen Artikel; hier einen Abschnitt „Schon während der Behandlung?“ ergänzen (Fragen: „Ist Krafttraining mit Mounjaro möglich?“, „Ist Krafttraining während Wegovy empfehlenswert?“), allgemein und mit Arztsatz. `metaTitle` prüfen: Er sollte mit „Krafttraining nach der Abnehmspritze“ beginnen (Begründung im PR: Kannibalisierung). |
| `muskelabbau-abnehmspritze` | Platz 9 für „…vermeiden“ | FAQ: „Was tun gegen Muskelabbau beim Abnehmen?“, „Baut Mounjaro Muskeln ab?“, „Was macht Ozempic mit Muskeln?“ (nur Studiendaten zur fettfreien Masse, keine Bewertung des Medikaments), „Welcher Sport bei Abnehmspritze?“ |
| `heisshunger-nach-abnehmspritze` | Platz 6 | FAQ: „Warum habe ich Hunger auf Süßes?“ ergänzen. „Warum habe ich trotz Abnehmspritze Hunger?“ nur allgemein beantworten und an die Ärztin verweisen, weil die Frage die laufende Behandlung betrifft. |
| `abnehmspritze-absetzen` (Hub) | kein Ranking, KI-Übersicht vorhanden | Ganz oben drei Antwortabsätze direkt unter je einer Zwischenüberschrift, wörtlich nach „Weitere Fragen“: „Was passiert, wenn man die Abnehmspritze absetzt?“, „Wie schnell nimmt man nach dem Absetzen zu?“ (Zunahme ab etwa Woche 8, zwei Drittel nach einem Jahr, STEP-1-Verlängerung), „Wie lange wirkt die Abnehmspritze nach dem Absetzen?“ (Halbwertszeit, Auswaschphase, Verweis auf die Zeitachsen-Grafik). Inhaltsverzeichnis, falls nicht vorhanden. |
| `jojo-effekt-abnehmspritze` | kein Ranking, KI-Übersicht vorhanden | H2 „Wie vermeide ich den Jojo-Effekt nach der Abnehmspritze?“ mit Antwort im ersten Satz (Protein, Kraft, Dranbleiben, mit Quellen). FAQ: „Warum setzen so viele die Abnehmspritze wieder ab?“ (65 %, Fußnote wie Startseite), „Gibt es den Jojo-Effekt wirklich?“ |
| `gewicht-halten-nach-abnehmspritze` | Platz 7 für „kreatin nach abnehmspritze“ | FAQ: „Wie lange wirkt die Abnehmspritze nach dem Absetzen?“ (kurz, Link zum Hub), „Warum setzen so viele ab?“ |
| `ernaehrung-nach-abnehmspritze` | kein Ranking, KI-Übersicht vorhanden | FAQ: „Was frühstücken?“, „Was sollte man nicht essen?“. Größter Hebel: verwandte Suchen sind „Ernährungsplan pdf“ in mehreren Varianten. Einen 7-Tage-Plan als PDF zum Download anbieten (gleiche Technik wie die Checkliste, ohne Präparatenamen im PDF), im Artikel verlinken, optional als zweiter Lead-Magnet. |
| `mounjaro-absetzen` | – | FAQ: „Kann man Mounjaro absetzen, ohne einen Jojo-Effekt zu bekommen?“ |
| `/abnehmspritze-kosten/` | kein Ranking (vorn: Apotheken Umschau, DocMorris, IKK classic) | FAQ: „Was kostet die Abnehmspritze für drei Monate?“, „Zahlt die Krankenkasse?“ (Kassenregeln aus `docs/MARKTRADAR-ERHEBUNG.md`). Nach der Oktober-Erhebung `title` auf „Stand Oktober 2026“ (Begründung im PR: Aktualität). |
| `kreatin-abnehmspritze` | Platz 1 | Nicht umbauen. Nur interne Links auf die neueren Artikel (Krafttraining, Protein) ergänzen, damit die Stärke weiterfließt. „kreatin mounjaro“ rankt trotz Abschnitt nicht: prüfen, ob eine Zwischenüberschrift wörtlich „Kreatin und Mounjaro“ heißt. |

Nicht beantworten, auch wenn Google danach fragt (Regeln aus `docs/REDAKTION.md`): „Kann man Ozempic eine Woche aussetzen?“, „Kann der Hausarzt die Abnehmspritze verschreiben?“, „Wie lange Abnehmspritze für 10 kg?“, „Welche Abnehmspritze wirkt am besten?“ (Dosis, Pause, Rezept, Bewertung von Medikamenten).

### 1b. „Weitere Fragen“ für alle übrigen Artikel (ausgelesen 02.10.2026, 01:00)

Zweiter Durchlauf über 17 weitere Suchbegriffe. Die Fragen stehen so, wie Google sie zeigt. Pro Artikel die ein bis drei passendsten übernehmen und dafür die schwächsten vorhandenen ersetzen. Auf keiner dieser Suchen steht nachderspritze.de bisher unter den ersten zehn; die Präparate-Suchen haben alle eine KI-Übersicht, die Nährstoff-Suchen keine.

| Artikel | Übernehmen | Weglassen (Regeln) |
|---|---|---|
| `supplements-nach-abnehmspritze` (Hub) | **„Welche Nahrungsergänzungsmittel sind bei der Abnehmspritze sinnvoll?“** erscheint in fünf verschiedenen Fragen-Boxen (auch „bei Mounjaro“, „bei Ozempic“). Als H2 ganz oben mit Antwort im ersten Satz und als FAQ. Alle Nährstoff-Artikel verlinken mit diesem Ankertext hierher. Dazu „Welches Nahrungsergänzungsmittel hilft beim Abnehmen?“ (ehrlich: nur Glucomannan hat eine zugelassene Angabe). | – |
| `wegovy-absetzen` | „Nimmt man nach dem Absetzen von Wegovy wieder zu?“, „Kann man die Abnehmspritze auch wieder absetzen?“ | „Kann Wegovy nach 4 Wochen Pause wieder eingenommen werden?“, „nur alle 2 Wochen spritzen“ |
| `mounjaro-absetzen` | „Was passiert mit dem Körper, wenn man Mounjaro absetzt?“ (SURMOUNT-4), „Kann ich Mounjaro absetzen, ohne zuzunehmen?“ | „Absetzen oder ausschleichen?“, „Was passiert, wenn man Mounjaro reduziert?“ |
| `ozempic-absetzen` | „Was passiert, wenn man Ozempic wieder absetzt?“ | „Wie setzt man Ozempic ab?“ (Absetz-Anleitung), „1 Woche aussetzen“, „vor OP absetzen“ |
| `saxenda-absetzen` | „Nimmt man nach dem Absetzen der Abnehmspritze wieder zu?“ | – |
| `abnehmpille-absetzen` | „Was passiert, wenn ich die Abnehmpille absetze?“, „Was passiert, wenn ich Semaglutid absetze?“ | „Ist die Abnehmpille gesund?“ (Bewertung) |
| `abnehmpille-oder-spritze` | „Wann kommt die Abnehmspritze als Tablette?“ (Antwort: seit 01.09.2026 in deutschen Apotheken; viele suchen das noch, die Fragen-Box ist veraltet), „Welche Tablette wirkt wie die Abnehmspritze?“ (nur Fakten zu Wirkstoff und Zulassung) | „Was hilft besser?“, „Was ist besser?“ (Bewertung von Medikamenten) |
| `abnehmspritze-gesicht` | „Was verändert sich im Gesicht, wenn man abnimmt?“, „Geht das ‚Ozempic-Gesicht‘ wieder weg?“ | Vorher-nachher-Bilder, Promi-Fragen |
| `haarausfall-abnehmspritze` | „Was tun bei Haarausfall nach Gewichtsabnahme?“, „Wann hört der Haarausfall wieder auf?“ (telogenes Effluvium, typischer Verlauf) | – |
| `magnesium-abnehmspritze` | „Kann man mit Magnesium abnehmen?“, „Kann man mit Magnesium Bauchfett verlieren?“ (beide klar: nein, keine zugelassene Angabe) | – |
| `vitamin-b12-abnehmspritze` | „Kann Ozempic einen Vitamin-B12-Mangel verursachen?“ (Studienlage; Unterschied zu Metformin), „Kann man mit Vitamin B12 abnehmen?“ (nein) | „Wann zahlt die Krankenkasse B12-Spritzen?“ |
| `eisen-abnehmspritze` | „Kann die Abnehmspritze einen Eisenmangel verursachen?“, „Kann Eisenmangel Bauchfett verursachen?“ (nein) | – |
| `vitamin-d-abnehmspritze` | „Kann Vitamin D Bauchfett reduzieren?“ (nein), „Kann zu viel Vitamin D zu Gewichtszunahme führen?“ | – |
| `omega-3-abnehmspritze` | „Welche Wirkung hat Omega-3 auf die Gewichtsabnahme?“, „Ist Omega-3 gut gegen Bauchfett?“ (beide ehrlich: keine belegte Wirkung) | – |
| `glucomannan-abnehmspritze` | „Wie wirkt Glucomannan beim Abnehmen?“, „Wie lange dauert es, bis Glucomannan wirkt?“, „Welche Nebenwirkungen hat Glucomannan?“ (Pflichthinweise zu Wasser und Schluckbeschwerden) | „Welche Abnehmspritze ist die beste?“ |
| `kreatin-abnehmspritze` | „Kann man beim Abnehmen Kreatin nehmen?“, „Ist Kreatin gut für die Fettverbrennung?“ (nein, direkt nicht), „Was passiert, wenn ich Kreatin nehme, aber keinen Sport mache?“. Platz-1-Seite: nur FAQ tauschen, sonst nichts ändern. | – |

Muster mit Wert: Bei allen Nährstoffen fragt Google „Kann man damit abnehmen?“ oder „hilft es gegen Bauchfett?“. Die ehrliche Antwort „nein, und das ist auch nicht zugelassen“ hat kaum Konkurrenz und passt zur Marke.

Querschnitt über fast alle Präparate-Suchen: „Welche Erfahrungen haben Menschen mit dem Absetzen gemacht?“ und verwandte Suchen „… Erfahrungen Forum“. Die Nachfrage nach Erfahrungen ist das größte unbediente Bedürfnis. Die Seite `abnehmspritze-absetzen-erfahrungen` bleibt Entwurf, bis echte Berichte da sind; deshalb das Erfahrungsformular (Tally `ODOJWR`) aktiver bewerben: in der Willkommensmail des Newsletters und auf der Danke-Seite.

Optional, nur mit Freigabe durch Dominik: „Muss man die Abnehmspritze ein Leben lang nehmen?“ steht in drei Fragen-Boxen. Eine Antwort ist möglich, ohne zur Therapiedauer zu raten: was die Studien nach dem Absetzen zeigen, dass es keine feste Dauer gibt und dass die Entscheidung mit der Ärztin fällt.

## 2. GEO: in KI-Antworten zitiert werden

1. **Antwort zuerst.** Unter jeder Zwischenüberschrift beantwortet der erste Satz die Überschrift vollständig, mit Zahl und Quelle. KI-Übersichten und Chat-Suchen zitieren solche Absätze, nicht die Herleitung.
2. **Zahl und Quelle im selben Satz.** „Ein Jahr nach dem Absetzen war im Mittel zwei Drittel des Gewichts zurück (STEP-1-Verlängerung)“ statt nur Fußnote. In einer Untersuchung zu generativen Suchmaschinen (Aggarwal u. a., „GEO: Generative Engine Optimization“, KDD 2024) erhöhten Quellenangaben, Statistiken und Zitate die Sichtbarkeit in den Antworten am deutlichsten.
3. **Daten jeder Grafik als Tabelle.** Sprachmodelle lesen Alt-Text und Bildunterschrift, aber kaum die Pixel. Unter jede Grafik eine aufklappbare Tabelle (`<details>`, ohne JavaScript) mit den Datenpunkten und der Quelle.
4. **„Grafik einbinden“.** Unter jeder Grafik ein Knopf, der HTML-Code mit Bild, Bildunterschrift und Link „Quelle: nachderspritze.de“ kopiert (CC BY 4.0 verlangt die Nennung ohnehin). Das ist der günstigste Weg zu Backlinks und Erwähnungen.
5. **Vergleichstabellen.** Wo Inhalte Zeilen und Spalten haben (Nährstoff, zugelassene Angabe, Lebensmittelquellen), als echte HTML-Tabelle. Tabellen werden in KI-Antworten häufig übernommen.
6. **Aktualität sichtbar.** „Aktualisiert am …“ oben im Artikel, identisch mit `dateModified` im Schema.
7. **Entität stärken.** `site.sameAs` füllen, sobald es Profile gibt (LinkedIn-Seite, später YouTube). Autorenseite mit Person-Schema (`jobTitle`, `knowsAbout`) und eine Seite „So arbeiten wir“ (Quellenauswahl, Korrekturen, was wir nicht sagen). `site.ts` und `ueber.astro` sind Dominik-Dateien: als PR.
8. **Crawler.** `robots.txt` erlaubt alle Crawler (geprüft 02.10.); nichts für KI-Bots sperren. llms.txt bleibt automatisch aktuell.
9. **Bing.** Die ChatGPT-Suche und Copilot stützen sich stark auf Bing. Bing Webmaster Tools ist eingerichtet, beide Sitemaps sind eingereicht, IndexNow läuft nach jedem Merge.

## 3. Neue Artikel: Entscheidung

Regel: erst erweitern, dann neu. Neu nur bei eigener Suchintention, die kein bestehender Artikel trifft; sonst nehmen sich zwei Seiten das Ranking weg. Neue Themen kommen wie üblich unten in die Themenliste in `docs/REDAKTION.md`.

| Thema | Entscheidung | Begründung |
|---|---|---|
| Feiertage nach der Abnehmspritze | **neu, bis 05.11.** | saisonale Suchspitze im Dezember, kein bestehender Artikel |
| Wechseljahre und Absetzen (Muskeln, Gewicht) | **neu** | größte Zielgruppe, eigenes Thema |
| Kalorienbedarf und Grundumsatz nach dem Absetzen | **neu** | häufige Frage; ohne Stoffwechsel-Versprechen, mit Studien zur Anpassung |
| Wie oft wiegen nach der Abnehmspritze | **neu** | gute Belege zur Selbstkontrolle, passt zur App-Idee |
| Proteinrechner | **neu als Werkzeug** | Rechner werden verlinkt und ersetzen KI-Übersichten nicht |
| Abnehmspritze von der Steuer absetzen | **neu, nach Prüfung** | Doppeldeutigkeit von „absetzen“: Google schlägt „Mounjaro absetzen Steuer“ vor, Bing zeigt steuertipps.de unter „abnehmspritze absetzen“. Thema: Krankheitskosten als außergewöhnliche Belastung, ärztliche Verordnung, zumutbare Belastung. Keine Medizin, passt zur Kostenseite. Rechtslage vor dem Schreiben an Primärquellen prüfen (EStG, BFH, BMF). |
| Gibt es Absetzsymptome? | Abschnitt im Hub, prüfen | verwandte Suchen „Mounjaro absetzen Symptome“, „Wegovy Nebenwirkungen nach Absetzen“. Nur, was nach dem Absetzen passiert (Appetit, Blutzucker, Verdauung), keine Nebenwirkungsliste des Medikaments |
| Wie lange wirkt die Spritze nach dem Absetzen | Abschnitt im Hub | gleiche Intention wie „abnehmspritze absetzen“ |
| Krafttraining während der Behandlung | Abschnitt im Krafttraining-Artikel | siehe Abschnitt 1 |
| Frühstück, Ernährungsplan als PDF | Abschnitt und Download im Ernährungsartikel | gleiche Intention |
| „Abnehmspritze dauerhaft?“ | warten | Grenze zur Therapieberatung; erst prüfen, ob die Search Console Nachfrage zeigt |
| Erfahrungen nach dem Absetzen | warten | erst mit echten Berichten (`abnehmspritze-absetzen-erfahrungen` bleibt Entwurf) |
| Kombinationsseiten Präparat × Nährstoff | nicht | Massenware-Muster |

Keine weitere Welle von mehr als drei Artikeln an einem Tag; die Dienstags-Routine reicht.

## 4. Video

Google zeigt Video-Vorschaubilder heute fast nur noch für Seiten, deren Hauptinhalt das Video ist. Ein eingebettetes Video im Artikel bringt deshalb kaum zusätzliche Sichtbarkeit in der Websuche; der Wert liegt bei YouTube selbst. Empfehlung: jetzt nicht. Wenn die Search Console nach zwei bis drei Wochen zeigt, welche Themen Nachfrage haben, drei kurze Videos als Test (Absetzkurve, Muskelanteil am Gewichtsverlust, Proteinbedarf), ohne Gesicht, mit den vorhandenen Grafiken, auf einem eigenen Kanal unter der Marke. Einbindung auf der Website nur als Zwei-Klick-Lösung (YouTube setzt Cookies).

## 5. Menschliche Überarbeitung: wo sie sich lohnt

Google erkennt und bestraft KI-Texte nicht als solche; bewertet wird, ob eine Seite hilft und wer dahintersteht. Eine stilistische Überarbeitung aller Artikel bringt deshalb wenig für das Ranking. Es lohnen sich drei Dinge, in dieser Reihenfolge:

1. **Einmalig, 1 bis 2 Stunden:** Autorenseite mit echter Biografie (Berufsautor, Arbeitsweise, kein Arzt) und die Seite „So arbeiten wir“. Das wirkt auf alle Artikel gleichzeitig.
2. **Fünf Seiten, je 20 bis 30 Minuten:** Hub „Abnehmspritze absetzen“, Jojo-Effekt, Kreatin, Muskelabbau, Kosten. Nur den Einstieg (erste 100 Wörter) in eigener Sprache neu schreiben und einen kurzen Kasten „Aus der Redaktion“ ergänzen: was Leser tatsächlich fragen (zum Beispiel aus den Anfragen über das Kontaktformular), was beim Recherchieren überrascht hat. Das ist eigene Erfahrung, die keine KI und kein Wettbewerber hat.
3. **Ärztliche Prüfung** durch eine namentlich genannte Ärztin oder einen Arzt (nicht Michael), siehe Reviewer-Suche in `docs/RECHERCHE-2026-09-30-marktradar.md`. Bei Gesundheitsthemen bringt das mehr als jede Stilarbeit.

Nicht lohnend: alle 25 Artikel überarbeiten, Texte „menschlicher klingen lassen“ ohne neue Information.

## 6. Für Dominik

- In Vercel → Firewall prüfen, dass keine Regel KI-Crawler blockiert.
- Profile für `sameAs` anlegen, sobald gewollt (LinkedIn-Seite reicht für den Anfang).
- Jeden Montag: Search Console Leistung (Web und „Suchtyp: Bild“), Bing Webmaster Tools, die 25 Suchbegriffe aus Abschnitt 0. Die Browser-Instanz kann das übernehmen.
