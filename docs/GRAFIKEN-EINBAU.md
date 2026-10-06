# Grafiken einbauen (Redesign „Kalk“, Oktober 2026)

Einbau-Liste für die neuen Studien-Grafiken. Die Grafiken liegen fertig unter `public/grafiken/` (SVG und PNG, 1200 × 675 bzw. 1800 × 1013), stehen im Register `src/data/grafiken.ts` (Feld `ziel`) und haben eine Datentabelle in `src/data/grafiken-daten.json`. Die Tabelle hängt `ArticlePage.astro` automatisch unter jede `<figure>` mit einem Bild aus `/grafiken/`; im Markdown steht deshalb nur der Block unten.

Regeln (CLAUDE.md, Abschnitt Grafiken): vollständiger Alt-Text mit jeder Zahl, Fußnote in der Bildunterschrift mit der Nummer, die die Quelle im `sources`-Frontmatter des Artikels hat, und der Satz „Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe“. Erzeugt werden die Grafiken mit `npm run grafiken` aus `scripts/grafiken.mjs` (nie von Hand bearbeiten).

## Vorgehen je Einbau

1. Fehlende Quellen-IDs **hinten** an `sources` im Frontmatter anhängen (nie umsortieren); die Nummern unten gehen davon aus, dass in der angegebenen Reihenfolge angehängt wird.
2. Den `<figure>`-Block an der genannten Stelle einfügen (Leerzeile davor und danach).
3. In `src/data/grafiken.ts` den Artikel aus `ziel` nach `used` übernehmen (speist die Bild-Sitemap `/sitemap-grafiken.xml`).
4. Bei inhaltlich geändertem Artikel `updatedDate: 2026-10-06` setzen (Briefing, Punkt 10).

Die Fußnotennummern sind gegen das Frontmatter auf diesem Branch gerechnet. Ändert ein anderer Agent vorher die `sources`-Liste, die Nummern vor dem Einbau gegen die Position prüfen.

## Hinweise zu den bestehenden Grafiken

- Alle 15 bestehenden Grafiken sind mit gleichen Dateinamen und URLs neu gerendert; die Einbindungen in den Artikeln bleiben gültig.
- Die neuen Grafiken haben den Kalk-Grund `#EFEFEB` im Bild. Die alten Einbindungen tragen noch `class="w-full rounded-xl2 border border-line bg-white"`; im Kalk-Design ohne Rahmen und ohne weißen Grund einbinden (`class="w-full"`), sonst entsteht ein Kasten.
- Nach der Prüfrunde haben sich bei mehreren bestehenden Grafiken Titel, Beschriftung und Alt-Text geändert (Liste im nächsten Abschnitt). Die Zahlen sind dieselben.
- Jede Grafik trägt jetzt im Bild die Lizenzzeile „Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe (CC BY 4.0)“; der Satz in der Bildunterschrift bleibt trotzdem (Regel aus CLAUDE.md).
- `wirkstoff-abbau-nach-letzter-dosis` ist im Register eine Variante von `halbwertszeiten-praeparate` (gleiche Daten, Abbaukurven statt Balken).

## Bestehende Einbindungen anpassen

Diese Einbindungen stehen schon in Artikeln. Der Alt-Text im Markdown ist jeweils eine eigene Kopie; er muss dem neuen Bild folgen. Ersetzt wird nur der Inhalt von `alt="…"` bzw. der Text der `<figcaption>`; Fußnoten bleiben, wie sie sind. Bei der Gelegenheit die alte Klasse `class="w-full rounded-xl2 border border-line bg-white"` durch `class="w-full"` ersetzen, falls noch vorhanden. `updatedDate` nur setzen, wenn sich am Artikeltext etwas ändert, nicht für Alt-Text oder Bildunterschrift allein.

### `abnehmpille-absetzen.md` · Zeile 68 · abnehmpille-belegt-und-offen

- **Alt-Text ersetzen** (Grafik geändert oder Alt-Text unvollständig):

```text
Zwei Felder: Links die Zulassungsstudie OASIS 4 der Semaglutid-Tablette 25 Milligramm mit 307 Teilnehmenden ohne Diabetes: minus 13,6 Prozent Gewicht gegenüber minus 2,2 Prozent unter Placebo nach 64 Wochen, bei durchgehender Einnahme minus 16,6 Prozent. Rechts der offene Punkt: Es gibt noch keine Studie zur Wiederzunahme nach dem Absetzen der Tablette (Stand Oktober 2026). Übertragbar mit Vorbehalt: gleicher Wirkstoff mit einer Halbwertszeit von etwa einer Woche; nach dem Absetzen der Spritze waren in der STEP-1-Verlängerung zwei Drittel des Verlusts nach einem Jahr zurück (von minus 17,3 auf minus 5,6 Prozent); in Studien zu Adipositas-Medikamenten ist die Zunahme ab Woche 8 messbar.
```

### `abnehmpille-oder-spritze.md` · Zeile 66 · wirksamkeit-zulassungsstudien

- **Alt-Text ersetzen** (Grafik geändert oder Alt-Text unvollständig):

```text
Balkendiagramm aus fünf großen Studien, mittlere Änderung des Körpergewichts: STEP 1 (Semaglutid 2,4 Milligramm Spritze, 68 Wochen) minus 14,9 Prozent gegenüber minus 2,4 Prozent unter Placebo; OASIS 4 (Semaglutid-Tablette 25 Milligramm, 64 Wochen) minus 13,6 gegenüber minus 2,2; OASIS 1 (Semaglutid-Tablette 50 Milligramm, nicht zugelassen, 68 Wochen) minus 15,1 gegenüber minus 2,4; SURMOUNT-1 (Tirzepatid 15 Milligramm, höchster Studienarm, 72 Wochen) minus 20,9 gegenüber minus 3,1; SCALE (Liraglutid 3 Milligramm, 56 Wochen) minus 8,0 gegenüber minus 2,6 Prozent. Kein direkter Vergleich zwischen den Studien.
```

- **Bildunterschrift anpassen:** „in den Zulassungsstudien“ stimmt nicht für alle fünf: OASIS 1 prüfte 50 mg, eine nicht zugelassene Dosis. Vorschlag (Fußnote wie bisher):

```html
Mittlere Gewichtsänderung in fünf großen Studien, Wirkstoff gegenüber Placebo; OASIS 1 prüfte eine nicht zugelassene Dosis (50 mg). Verschiedene Studien, kein direkter Vergleich. Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.
```

### `abnehmpille-oder-spritze.md` · Zeile 81 · halbwertszeiten-praeparate

- **Alt-Text ersetzen** (Grafik geändert oder Alt-Text unvollständig):

```text
Balkendiagramm der Halbwertszeiten: Semaglutid etwa eine Woche, weitgehend abgebaut nach etwa fünf Wochen und laut Fachinformation Wegovy bis etwa sieben Wochen nachweisbar; Tirzepatid etwa fünf Tage, abgebaut nach etwa 25 Tagen; Liraglutid etwa 13 Stunden, abgebaut nach etwa drei Tagen. Faustregel: fünf Halbwertszeiten.
```

### `abnehmspritze-absetzen.md` · Zeile 60 · zeitachse-nach-letzter-dosis

- **Alt-Text ersetzen** (Grafik geändert oder Alt-Text unvollständig):

```text
Zeitachse über 20 Wochen nach der letzten Dosis einer Abnehmspritze: Semaglutid (Halbwertszeit etwa eine Woche) ist nach etwa fünf Wochen weitgehend abgebaut und laut Fachinformation Wegovy bis etwa sieben Wochen nachweisbar, Tirzepatid (Halbwertszeit etwa fünf Tage) nach etwa 25 Tagen. Der Appetit kehrt, abgeleitet aus dem sinkenden Wirkstoffspiegel, ab Woche 2 bis 5 zurück; die Gewichtszunahme ist ab etwa Woche 8 messbar und steigt bis etwa Woche 20.
```

### `abnehmspritze-absetzen.md` · Zeile 75 · absetzkurve-step-1

- **Alt-Text ersetzen** (Grafik geändert oder Alt-Text unvollständig):

```text
Liniendiagramm: Unter Semaglutid 2,4 mg sinkt das Gewicht in 68 Wochen im Mittel um 17,3 Prozent, unter Placebo um 2,0 Prozent. In den 52 Wochen nach dem Absetzen steigt es wieder; nach insgesamt 120 Wochen liegt es bei minus 5,6 Prozent (Semaglutid) und minus 0,1 Prozent (Placebo). Zwei Drittel des Verlusts, 11,6 Prozentpunkte, sind nach einem Jahr ohne Medikament wieder da. Messpunkte Woche 0, 68 und 120, Verlauf dazwischen schematisch.
```

### `feiertage-nach-abnehmspritze.md` · Zeile 54 · zeitachse-nach-letzter-dosis

- **Alt-Text ersetzen** (Grafik geändert oder Alt-Text unvollständig):

```text
Zeitachse über 20 Wochen nach der letzten Dosis einer Abnehmspritze: Semaglutid (Halbwertszeit etwa eine Woche) ist nach etwa fünf Wochen weitgehend abgebaut und laut Fachinformation Wegovy bis etwa sieben Wochen nachweisbar, Tirzepatid (Halbwertszeit etwa fünf Tage) nach etwa 25 Tagen. Der Appetit kehrt, abgeleitet aus dem sinkenden Wirkstoffspiegel, ab Woche 2 bis 5 zurück; die Gewichtszunahme ist ab etwa Woche 8 messbar und steigt bis etwa Woche 20.
```

### `gewicht-halten-nach-abnehmspritze.md` · Zeile 42 · training-s-lite

- **Alt-Text ersetzen** (Grafik geändert oder Alt-Text unvollständig):

```text
Punktdiagramm mit 95-Prozent-Konfidenzintervallen aus der S-LiTE-Nachbeobachtung: Im Jahr ohne Behandlung (Woche 52 bis 104) nahmen Teilnehmende nach Liraglutid allein 6,0 Kilogramm mehr zu als nach Training allein ohne Medikament (2,1 bis 10,0) und 2,5 Kilogramm mehr als nach Training plus Liraglutid (−1,5 bis 6,5, nicht signifikant). Nach Training plus Liraglutid blieben Gewichtsverlust und Fettabbau ein Jahr nach Therapieende erhalten. Studienablauf: 8 Wochen kalorienarme Diät, 52 Wochen Placebo, Training, Liraglutid oder beides, danach 52 Wochen ohne Behandlung.
```

- **Bildunterschrift anpassen:** Statt „nach dem Trainingsprogramm“ genauer „nach Training allein“ (ohne Medikament), wie im neuen Titel der Grafik. Vorschlag (Fußnote wie bisher):

```html
Der Grund für Regel eins: In der S-LiTE-Nachbeobachtung nahmen Teilnehmende nach Liraglutid allein im Jahr ohne Behandlung 6,0 kg mehr zu als nach Training allein. Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.
```

### `gewicht-halten-nach-abnehmspritze.md` · Zeile 53 · zeitachse-phasen

- **Alt-Text ersetzen** (Grafik geändert oder Alt-Text unvollständig):

```text
Vier Phasen nach der letzten Dosis am Beispiel Semaglutid (Halbwertszeit etwa eine Woche): Woche 0 bis 2 noch wenig Veränderung, Woche 2 bis 5 kehrt der Appetit zurück, Woche 5 bis 8 ist der Wirkstoff praktisch abgebaut, ab Woche 8 ist die Gewichtszunahme messbar und steigt bis etwa Woche 20. Bei Tirzepatid (Halbwertszeit etwa fünf Tage) ist der Wirkstoff schon nach etwa 25 Tagen abgebaut.
```

### `haarausfall-abnehmspritze.md` · Zeile 52 · haarausfall-zeitverlauf

- **Alt-Text ersetzen** (Grafik geändert oder Alt-Text unvollständig):

```text
Zeitachse des telogenen Effluviums über zwölf Monate, schematisch: Nach schnellem Gewichtsverlust wechseln viele Haare in die Ruhephase, zwei bis drei Monate später beginnt diffuser Haarausfall, der meist innerhalb von etwa sechs Monaten nach Beginn abklingt, wenn der Auslöser weggefallen ist; danach wachsen die Haare nach. Beeinflussbar sind Protein (1,2 bis 1,6 Gramm pro Kilogramm Körpergewicht am Tag), der Eisenwert sowie Zink und Biotin bei nachgewiesener Lücke; länger als sechs Monate, fleckig oder mit Müdigkeit und Frieren ärztlich abklären.
```

- **Bildunterschrift anpassen:** Der Verlauf ist schematisch; „typisch“ steht nicht mehr im Titel der Grafik. Vorschlag (Fußnote wie bisher):

```html
Der Verlauf des telogenen Effluviums in Monaten nach dem Auslöser, schematisch.<sup><a href="#fn-malkud2015">1</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.
```

### `jojo-effekt-abnehmspritze.md` · Zeile 65 · warum-das-gewicht-zurueckkommt

- **Alt-Text ersetzen** (Grafik geändert oder Alt-Text unvollständig):

```text
Vier Spalten mit den Mechanismen des Jojo-Effekts, nach Gewichtsverlust belegt und auf die Zeit nach der Abnehmspritze übertragen: Die Appetitbremse fällt weg, sobald der Wirkstoff weitgehend abgebaut ist (Semaglutid nach etwa fünf bis sieben Wochen, Tirzepatid nach etwa 25 Tagen); die Hungerhormone Ghrelin und Leptin bleiben noch ein Jahr nach einer Diät verschoben; der Ruheenergieverbrauch blieb in einer Studie noch sechs Jahre nach starkem Gewichtsverlust abgesenkt; rund 40 Prozent des Gewichtsverlusts unter Semaglutid entfielen auf fettfreie Masse. In Studien halfen beim Halten: Krafttraining und Protein.
```

- **Bildunterschrift anpassen:** Die Mechanismen sind nach Gewichtsverlust belegt, nicht nach dem Absetzen der Spritze gemessen; die Grafik sagt das jetzt im Untertitel. Vorschlag (Fußnote wie bisher):

```html
Vier Mechanismen, nach Gewichtsverlust belegt und auf die Zeit nach der Spritze übertragen; die Quellen stehen in den Abschnitten darunter. Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.
```

### `krafttraining-nach-abnehmspritze.md` · Zeile 44 · training-s-lite

- **Alt-Text ersetzen** (Grafik geändert oder Alt-Text unvollständig):

```text
Punktdiagramm mit 95-Prozent-Konfidenzintervallen aus der S-LiTE-Nachbeobachtung: Im Jahr ohne Behandlung (Woche 52 bis 104) nahmen Teilnehmende nach Liraglutid allein 6,0 Kilogramm mehr zu als nach Training allein ohne Medikament (2,1 bis 10,0) und 2,5 Kilogramm mehr als nach Training plus Liraglutid (−1,5 bis 6,5, nicht signifikant). Nach Training plus Liraglutid blieben Gewichtsverlust und Fettabbau ein Jahr nach Therapieende erhalten. Studienablauf: 8 Wochen kalorienarme Diät, 52 Wochen Placebo, Training, Liraglutid oder beides, danach 52 Wochen ohne Behandlung.
```

- **Bildunterschrift anpassen:** „Training vor dem Absetzen“ trifft den Vergleich nicht: Die 6,0 kg sind Liraglutid allein gegenüber Training allein. Vorschlag (Fußnote wie bisher):

```html
S-LiTE-Nachbeobachtung: Nach Liraglutid allein nahmen Teilnehmende im Jahr ohne Behandlung 6,0 kg mehr zu als nach Training allein; gegenüber Training plus Liraglutid waren es 2,5 kg (nicht signifikant).<sup><a href="#fn-jensen2024">1</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.
```

### `mounjaro-absetzen.md` · Zeile 60 · halbwertszeiten-praeparate

- **Alt-Text ersetzen** (Grafik geändert oder Alt-Text unvollständig):

```text
Balkendiagramm der Halbwertszeiten: Semaglutid etwa eine Woche, weitgehend abgebaut nach etwa fünf Wochen und laut Fachinformation Wegovy bis etwa sieben Wochen nachweisbar; Tirzepatid etwa fünf Tage, abgebaut nach etwa 25 Tagen; Liraglutid etwa 13 Stunden, abgebaut nach etwa drei Tagen. Faustregel: fünf Halbwertszeiten.
```

### `muskelabbau-abnehmspritze.md` · Zeile 42 · koerperzusammensetzung-step-1

- **Alt-Text ersetzen** (Grafik geändert oder Alt-Text unvollständig):

```text
Balken, der den Gewichtsverlust nach 68 Wochen Semaglutid in einer DXA-Substudie mit 140 Teilnehmenden aufteilt: rund 60 Prozent Fettmasse und rund 40 Prozent fettfreie Masse, also Muskeln, Organe, Knochen und Wasser; wie viel davon Muskel war, wurde nicht getrennt gemessen. In Diätstudien hielt Krafttraining den Verlust an fettfreier Masse klein; empfohlen sind Krafttraining an mindestens zwei Tagen pro Woche und 1,2 bis 1,6 Gramm Protein pro Kilogramm Körpergewicht am Tag.
```

### Seiten außerhalb der Artikel

- `src/pages/wissen/index.astro` (Zeile 55, `zeitachse-nach-letzter-dosis`): Alt-Text wie oben bei `abnehmspritze-absetzen.md` ersetzen. Datei mit Konfliktrisiko: nur diese Zeile ändern.
- `preise-im-monat` auf `/abnehmspritze-kosten/` und `/marktradar/`: Der Alt-Text entsteht dort aus `preise.json`; die geänderten Zeilen (Wegovy ohne „Anfangsstufen“, Ozempic „nur für Typ-2-Diabetes zugelassen“) kommen automatisch an.


## Einbau je Artikel

### Kreatin und Abnehmspritze · `kreatin-abnehmspritze` · kreatin-speicher-im-muskel

- **Grafik:** `/grafiken/kreatin-speicher-im-muskel.png`
- **Wo:** unter `## Dosis, Form, Einnahme`, am Ende des Abschnitts, vor „## Das mit der Waage“
- **Quellen im Frontmatter:** `hultman1996` = 6 (anhängen), `kreider2017` = 1
- **Hinten an `sources` anhängen:** `hultman1996`

```html
<figure class="my-8">
  <img src="/grafiken/kreatin-speicher-im-muskel.png" alt="Zwei Verläufe des Kreatinspeichers im Muskel aus einer Studie mit 31 Männern, zwischen den Messpunkten schematisch: Mit 3 Gramm Kreatin pro Tag stieg das Gesamtkreatin im Muskel allmählich und lag nach 28 Tagen etwa 20 Prozent über dem Ausgangswert. Mit einer Ladephase von 20 Gramm pro Tag über 6 Tage war derselbe Anstieg von etwa 20 Prozent nach 6 Tagen erreicht; ohne weitere Einnahme lag der Wert 30 Tage nach dem Ende wieder beim Ausgangswert. Mit dem Speicher steigt das Wasser in der Muskelzelle; das zeigt die Waage, Fett ist es nicht." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Kreatinspeicher im Muskel mit 3 g pro Tag und mit Ladephase; derselbe Anstieg von etwa 20 %, ohne Ladephase nach etwa vier Wochen.<sup><a href="#fn-kreider2017">1</a>, <a href="#fn-hultman1996">6</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Saxenda absetzen · `saxenda-absetzen` · wirkstoff-abbau-nach-letzter-dosis

- **Grafik:** `/grafiken/wirkstoff-abbau-nach-letzter-dosis.png`
- **Wo:** unter `## Der Unterschied: Tage statt Wochen`, nach der Aufzählung (Tag 1 bis 3, ab Woche 1, ab Woche 8), vor dem Absatz „Es gibt bei Saxenda also kein Übergangsfenster …“
- **Quellen im Frontmatter:** `fachinfoSaxenda` = 1, `fachinfoMounjaro` = 10 (anhängen), `fachinfoWegovy` = 11 (anhängen)
- **Hinten an `sources` anhängen:** `fachinfoMounjaro`, `fachinfoWegovy`

```html
<figure class="my-8">
  <img src="/grafiken/wirkstoff-abbau-nach-letzter-dosis.png" alt="Drei Abbaukurven nach der letzten Dosis, gerechnet aus der Halbwertszeit laut Fachinformation: Liraglutid (Saxenda) hat eine Halbwertszeit von etwa 13 Stunden und ist nach etwa 3 Tagen weitgehend abgebaut; Tirzepatid (Mounjaro) etwa 5 Tage, weitgehend abgebaut nach etwa 25 Tagen; Semaglutid (Wegovy, Ozempic) etwa 1 Woche, weitgehend abgebaut nach etwa 5 Wochen und laut Fachinformation Wegovy bis etwa 7 Wochen nachweisbar. Faustregel: nach fünf Halbwertszeiten weitgehend abgebaut." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Rechnerischer Wirkstoffabbau nach der letzten Dosis: Liraglutid ist nach etwa drei Tagen weitgehend abgebaut, Tirzepatid nach etwa 25 Tagen, Semaglutid nach etwa fünf Wochen.<sup><a href="#fn-fachinfoSaxenda">1</a>, <a href="#fn-fachinfoMounjaro">10</a>, <a href="#fn-fachinfoWegovy">11</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Saxenda absetzen · `saxenda-absetzen` · s-lite-liraglutid-und-training

- **Grafik:** `/grafiken/s-lite-liraglutid-und-training.png`
- **Wo:** unter `## Was mit dem Gewicht passiert: die S-LiTE-Studie`, direkt nach der Tabelle, vor „Die Botschaft ist für Saxenda-Nutzer besonders direkt …“
- **Quellen im Frontmatter:** `lundgren2021` = 4, `jensen2024` = 3

```html
<figure class="my-8">
  <img src="/grafiken/s-lite-liraglutid-und-training.png" alt="Drei Kennzahlen aus der S-LiTE-Studie mit Liraglutid: Im Jahr ohne Behandlung (Woche 52 bis 104) nahmen Teilnehmende nach Liraglutid allein 6,0 Kilogramm mehr zu als nach Training allein ohne Medikament (95-Prozent-Konfidenzintervall 2,1 bis 10,0). Von Studienbeginn bis ein Jahr nach dem Ende (Woche 0 bis 104) lagen Teilnehmende mit Training plus Liraglutid 5,1 Kilogramm niedriger (minus 10,0 bis minus 0,2) und beim Körperfettanteil 2,3 Prozentpunkte niedriger (minus 4,3 bis minus 0,3) als nach Liraglutid allein. Nach Training blieben Gewicht und Körperzusammensetzung erhalten. Studienablauf: 8 Wochen Diät, 52 Wochen Behandlung, 52 Wochen ohne Behandlung." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">S-LiTE: was ein Jahr nach dem Ende der Behandlung mit Liraglutid mit und ohne Training blieb, mit 95-%-Konfidenzintervallen.<sup><a href="#fn-jensen2024">3</a>, <a href="#fn-lundgren2021">4</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Heißhunger nach dem Absetzen der Abnehmspritze · `heisshunger-nach-abnehmspritze` · heisshunger-vor-der-waage

- **Grafik:** `/grafiken/heisshunger-vor-der-waage.png`
- **Wo:** unter `## Was im Körper passiert`, am Ende des Abschnitts, nach „**Die Waage reagiert mit Verzögerung.** …“, vor „## Hunger oder Heißhunger?“
- **Quellen im Frontmatter:** `fachinfoWegovy` = 8, `sumithran2011` = 1, `wu2025` = 2

```html
<figure class="my-8">
  <img src="/grafiken/heisshunger-vor-der-waage.png" alt="Zeitachse über 20 Wochen nach der letzten Dosis: Semaglutid baut sich mit einer Halbwertszeit von etwa einer Woche ab und ist nach etwa 5 bis 7 Wochen weitgehend weg. Der Appetit kommt, abgeleitet aus dem sinkenden Wirkstoffspiegel, in Woche 2 bis 5 zurück und bleibt. Die Hungerhormone sind nach einer Diät verschoben, mehr Ghrelin und weniger Leptin, noch ein Jahr später messbar (Studie ohne Medikament). Die Gewichtszunahme ist erst ab etwa Woche 8 messbar und steigt bis etwa Woche 20. Markiert ist das Fenster von Woche 2 bis 8, in dem der Hunger zurück ist, die Waage aber noch wenig zeigt." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Der Hunger kommt vor der Waage: Wirkstoffabbau, Appetit, Hungerhormone und messbare Zunahme in den ersten 20 Wochen nach der letzten Dosis.<sup><a href="#fn-sumithran2011">1</a>, <a href="#fn-wu2025">2</a>, <a href="#fn-fachinfoWegovy">8</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Heißhunger nach dem Absetzen der Abnehmspritze · `heisshunger-nach-abnehmspritze` · schlaf-und-hungerhormone

- **Grafik:** `/grafiken/schlaf-und-hungerhormone.png`
- **Wo:** unter `### 4. Schlaf`, nach dem Absatz des Abschnitts, vor „### 5. Keine Flüssigkalorien …“
- **Quellen im Frontmatter:** `spiegel2004` = 5

```html
<figure class="my-8">
  <img src="/grafiken/schlaf-und-hungerhormone.png" alt="Balkendiagramm: Nach zwei Nächten mit 4 Stunden im Bett gegenüber zwei Nächten mit 10 Stunden sank das Sättigungshormon Leptin um 18 Prozent, das Hungerhormon Ghrelin stieg um 28 Prozent, der Hunger um 24 Prozent und der Appetit um 23 Prozent; der Appetit auf kalorienreiche Lebensmittel mit viel Kohlenhydraten stieg um 33 bis 45 Prozent. Kleine Studie mit 12 gesunden jungen Männern unter Laborbedingungen." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Zwei Nächte mit vier Stunden im Bett gegenüber zehn Stunden: Leptin sank, Ghrelin, Hunger und Appetit stiegen.<sup><a href="#fn-spiegel2004">5</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Jojo-Effekt nach der Abnehmspritze · `jojo-effekt-abnehmspritze` · absetzen-im-ersten-jahr

- **Grafik:** `/grafiken/absetzen-im-ersten-jahr.png`
- **Wo:** unter `## Wer absetzt, und warum`, nach dem Absatz des Abschnitts, vor „## Wie vermeide ich den Jojo-Effekt nach der Abnehmspritze?“
- **Quellen im Frontmatter:** `rodriguez2025` = 9

```html
<figure class="my-8">
  <img src="/grafiken/absetzen-im-ersten-jahr.png" alt="Zwei Punktraster mit je 100 Punkten aus US-Versorgungsdaten von 125.474 Erwachsenen mit Übergewicht oder Adipositas: Von Menschen ohne Typ-2-Diabetes hatten 64,8 Prozent ihre GLP-1-Therapie innerhalb eines Jahres beendet, von Menschen mit Typ-2-Diabetes 46,5 Prozent." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Innerhalb eines Jahres hatten 64,8 % der Menschen ohne Typ-2-Diabetes ihre Therapie beendet und 46,5 % der Menschen mit Typ-2-Diabetes; US-Versorgungsdaten von 125.474 Erwachsenen.<sup><a href="#fn-rodriguez2025">9</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Abnehmspritze absetzen · `abnehmspritze-absetzen` · absetzen-im-ersten-jahr

- **Grafik:** `/grafiken/absetzen-im-ersten-jahr.png`
- **Wo:** unter `## Warum Menschen die Abnehmspritze absetzen`, nach der Aufzählung der Gründe, vor „Was auch immer der Grund ist …“
- **Quellen im Frontmatter:** `rodriguez2025` = 1

```html
<figure class="my-8">
  <img src="/grafiken/absetzen-im-ersten-jahr.png" alt="Zwei Punktraster mit je 100 Punkten aus US-Versorgungsdaten von 125.474 Erwachsenen mit Übergewicht oder Adipositas: Von Menschen ohne Typ-2-Diabetes hatten 64,8 Prozent ihre GLP-1-Therapie innerhalb eines Jahres beendet, von Menschen mit Typ-2-Diabetes 46,5 Prozent." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Innerhalb eines Jahres hatten 64,8 % der Menschen ohne Typ-2-Diabetes ihre Therapie beendet und 46,5 % der Menschen mit Typ-2-Diabetes; US-Versorgungsdaten von 125.474 Erwachsenen.<sup><a href="#fn-rodriguez2025">1</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Ozempic absetzen · `ozempic-absetzen` · wirkstoff-abbau-nach-letzter-dosis

- **Grafik:** `/grafiken/wirkstoff-abbau-nach-letzter-dosis.png`
- **Wo:** unter `## Wie lange Ozempic nachwirkt`, nach dem Absatz des Abschnitts, vor „## Was mit dem Gewicht passiert“
- **Quellen im Frontmatter:** `fachinfoOzempic` = 1, `fachinfoWegovy` = 8 (anhängen), `fachinfoSaxenda` = 9 (anhängen), `fachinfoMounjaro` = 10 (anhängen)
- **Hinten an `sources` anhängen:** `fachinfoWegovy`, `fachinfoSaxenda`, `fachinfoMounjaro`

```html
<figure class="my-8">
  <img src="/grafiken/wirkstoff-abbau-nach-letzter-dosis.png" alt="Drei Abbaukurven nach der letzten Dosis, gerechnet aus der Halbwertszeit laut Fachinformation: Liraglutid (Saxenda) hat eine Halbwertszeit von etwa 13 Stunden und ist nach etwa 3 Tagen weitgehend abgebaut; Tirzepatid (Mounjaro) etwa 5 Tage, weitgehend abgebaut nach etwa 25 Tagen; Semaglutid (Wegovy, Ozempic) etwa 1 Woche, weitgehend abgebaut nach etwa 5 Wochen und laut Fachinformation Wegovy bis etwa 7 Wochen nachweisbar. Faustregel: nach fünf Halbwertszeiten weitgehend abgebaut." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Rechnerischer Wirkstoffabbau nach der letzten Dosis: Semaglutid ist nach etwa fünf Wochen weitgehend abgebaut und laut Fachinformation Wegovy bis etwa sieben Wochen nachweisbar; zum Vergleich Liraglutid und Tirzepatid.<sup><a href="#fn-fachinfoOzempic">1</a>, <a href="#fn-fachinfoWegovy">8</a>, <a href="#fn-fachinfoSaxenda">9</a>, <a href="#fn-fachinfoMounjaro">10</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Ozempic absetzen · `ozempic-absetzen` · step-2-typ-2-diabetes

- **Grafik:** `/grafiken/step-2-typ-2-diabetes.png`
- **Wo:** unter `## Was mit dem Gewicht passiert`, nach dem Absatz des Abschnitts, vor „## Off-label zum Abnehmen …“
- **Quellen im Frontmatter:** `davies2021step2` = 2

```html
<figure class="my-8">
  <img src="/grafiken/step-2-typ-2-diabetes.png" alt="Balkendiagramm aus der Studie STEP 2 mit Erwachsenen mit Übergewicht und Typ-2-Diabetes: Nach 68 Wochen lag das Gewicht unter Semaglutid 2,4 Milligramm im Mittel 9,6 Prozent niedriger, unter Semaglutid 1,0 Milligramm 7,0 Prozent und unter Placebo 3,4 Prozent. Weniger Verlust heißt weniger, was nach dem Absetzen zurückkommen kann." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">STEP 2 mit Menschen mit Typ-2-Diabetes: −9,6 % unter Semaglutid 2,4 mg, −7,0 % unter Semaglutid 1,0 mg, −3,4 % unter Placebo nach 68 Wochen.<sup><a href="#fn-davies2021step2">2</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Wegovy absetzen · `wegovy-absetzen` · wirkstoff-abbau-nach-letzter-dosis

- **Grafik:** `/grafiken/wirkstoff-abbau-nach-letzter-dosis.png`
- **Wo:** unter `## Wie lange Wegovy nachwirkt`, am Ende des Abschnitts (optional; der Artikel hat schon eine Grafik)
- **Quellen im Frontmatter:** `fachinfoWegovy` = 1, `fachinfoSaxenda` = 11 (anhängen), `fachinfoMounjaro` = 12 (anhängen)
- **Hinten an `sources` anhängen:** `fachinfoSaxenda`, `fachinfoMounjaro`

```html
<figure class="my-8">
  <img src="/grafiken/wirkstoff-abbau-nach-letzter-dosis.png" alt="Drei Abbaukurven nach der letzten Dosis, gerechnet aus der Halbwertszeit laut Fachinformation: Liraglutid (Saxenda) hat eine Halbwertszeit von etwa 13 Stunden und ist nach etwa 3 Tagen weitgehend abgebaut; Tirzepatid (Mounjaro) etwa 5 Tage, weitgehend abgebaut nach etwa 25 Tagen; Semaglutid (Wegovy, Ozempic) etwa 1 Woche, weitgehend abgebaut nach etwa 5 Wochen und laut Fachinformation Wegovy bis etwa 7 Wochen nachweisbar. Faustregel: nach fünf Halbwertszeiten weitgehend abgebaut." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Rechnerischer Wirkstoffabbau nach der letzten Dosis: Semaglutid ist nach etwa fünf Wochen weitgehend abgebaut und laut Fachinformation Wegovy bis etwa sieben Wochen nachweisbar; zum Vergleich Liraglutid und Tirzepatid.<sup><a href="#fn-fachinfoWegovy">1</a>, <a href="#fn-fachinfoSaxenda">11</a>, <a href="#fn-fachinfoMounjaro">12</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Supplements nach der Abnehmspritze · `supplements-nach-abnehmspritze` · supplements-was-belegt-ist

- **Grafik:** `/grafiken/supplements-was-belegt-ist.png`
- **Wo:** unter `## Welche Nahrungsergänzungsmittel sind bei der Abnehmspritze sinnvoll?`, nach dem Absatz des Abschnitts, vor „## Warum das Thema nach der Spritze überhaupt aufkommt“
- **Quellen im Frontmatter:** `leidy2015` = 2, `euClaims` = 3, `kreider2017` = 4, `dgeBallaststoffe` = 5, `adaSoc2024` = 7, `klartextNem` = 6

```html
<figure class="my-8">
  <img src="/grafiken/supplements-was-belegt-ist.png" alt="Drei Spalten zu Supplements nach der Abnehmspritze. Sinnvoll, mit Bedingung: Protein (zugelassene Angabe: Erhalt von Muskelmasse), wenn 1,2 bis 1,6 Gramm pro Kilogramm Körpergewicht am Tag über Mahlzeiten nicht zusammenkommen; Kreatin-Monohydrat (zugelassene Angabe: Leistung bei Schnellkrafttraining), 3 Gramm täglich, nur mit Krafttraining; Ballaststoffe, wenn man unter dem Richtwert von 30 Gramm am Tag bleibt. Nur bei Mangel oder Lücke: Vitamin D nach Blutwert, Vitamin B12 bei Metformin oder veganer Ernährung kontrollieren, Eisen nur nach gemessenem Wert, Magnesium bei Lücke wie sehr kleinen Portionen. Kein Beleg für den versprochenen Nutzen: Fatburner, Detox und Booster, sogenannte natürliche GLP-1-Booster wie Berberin, Probiotika gegen den Jojo-Effekt, Omega-3 für Gewicht oder Muskeln." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Supplements nach der Abnehmspritze in drei Stufen: sinnvoll mit Bedingung, nur bei Mangel oder Lücke, kein Beleg für den versprochenen Nutzen.<sup><a href="#fn-leidy2015">2</a>, <a href="#fn-euClaims">3</a>, <a href="#fn-kreider2017">4</a>, <a href="#fn-dgeBallaststoffe">5</a>, <a href="#fn-klartextNem">6</a>, <a href="#fn-adaSoc2024">7</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Supplements nach der Abnehmspritze · `supplements-nach-abnehmspritze` · versorgung-in-deutschland

- **Grafik:** `/grafiken/versorgung-in-deutschland.png`
- **Wo:** unter `## Einzelne Supplements im Detail`, nach dem ersten Satz des Abschnitts, vor der Liste der Einzelartikel
- **Quellen im Frontmatter:** `nvs2` = 10 (anhängen), `rabenberg2015` = 11 (anhängen)
- **Hinten an `sources` anhängen:** `nvs2`, `rabenberg2015`

```html
<figure class="my-8">
  <img src="/grafiken/versorgung-in-deutschland.png" alt="Balkendiagramm zur Versorgung Erwachsener in Deutschland: Unter der Zufuhrempfehlung lagen bei Magnesium 26 Prozent der Männer und 29 Prozent der Frauen, bei Eisen 14 Prozent der Männer und 58 Prozent der Frauen (Nationale Verzehrsstudie II). Beim Vitamin-D-Wert im Blut lagen 30,2 Prozent unter 30 Nanomol pro Liter (Mangel) und 61,6 Prozent unter 50 Nanomol pro Liter (DEGS1). Erhoben vor der Zeit der GLP-1-Medikamente." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Wo die Versorgung in Deutschland ohnehin knapp ist: Magnesium und Eisen unter der Zufuhrempfehlung, Vitamin D im Blut.<sup><a href="#fn-nvs2">10</a>, <a href="#fn-rabenberg2015">11</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Magnesium bei der Abnehmspritze · `magnesium-abnehmspritze` · versorgung-in-deutschland

- **Grafik:** `/grafiken/versorgung-in-deutschland.png`
- **Wo:** unter `## Warum Magnesium unter der Spritze knapp werden kann`, am Ende des Abschnitts (optional)
- **Quellen im Frontmatter:** `nvs2` = 2, `rabenberg2015` = 10 (anhängen)
- **Hinten an `sources` anhängen:** `rabenberg2015`

```html
<figure class="my-8">
  <img src="/grafiken/versorgung-in-deutschland.png" alt="Balkendiagramm zur Versorgung Erwachsener in Deutschland: Unter der Zufuhrempfehlung lagen bei Magnesium 26 Prozent der Männer und 29 Prozent der Frauen, bei Eisen 14 Prozent der Männer und 58 Prozent der Frauen (Nationale Verzehrsstudie II). Beim Vitamin-D-Wert im Blut lagen 30,2 Prozent unter 30 Nanomol pro Liter (Mangel) und 61,6 Prozent unter 50 Nanomol pro Liter (DEGS1). Erhoben vor der Zeit der GLP-1-Medikamente." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Wo die Versorgung in Deutschland ohnehin knapp ist: Magnesium und Eisen unter der Zufuhrempfehlung, Vitamin D im Blut.<sup><a href="#fn-nvs2">2</a>, <a href="#fn-rabenberg2015">10</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Eisen bei der Abnehmspritze · `eisen-abnehmspritze` · versorgung-in-deutschland

- **Grafik:** `/grafiken/versorgung-in-deutschland.png`
- **Wo:** unter `## Warum Eisen unter der Spritze knapp werden kann`, am Ende des Abschnitts (optional)
- **Quellen im Frontmatter:** `nvs2` = 1, `rabenberg2015` = 7 (anhängen)
- **Hinten an `sources` anhängen:** `rabenberg2015`

```html
<figure class="my-8">
  <img src="/grafiken/versorgung-in-deutschland.png" alt="Balkendiagramm zur Versorgung Erwachsener in Deutschland: Unter der Zufuhrempfehlung lagen bei Magnesium 26 Prozent der Männer und 29 Prozent der Frauen, bei Eisen 14 Prozent der Männer und 58 Prozent der Frauen (Nationale Verzehrsstudie II). Beim Vitamin-D-Wert im Blut lagen 30,2 Prozent unter 30 Nanomol pro Liter (Mangel) und 61,6 Prozent unter 50 Nanomol pro Liter (DEGS1). Erhoben vor der Zeit der GLP-1-Medikamente." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Wo die Versorgung in Deutschland ohnehin knapp ist: Magnesium und Eisen unter der Zufuhrempfehlung, Vitamin D im Blut.<sup><a href="#fn-nvs2">1</a>, <a href="#fn-rabenberg2015">7</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Vitamin D bei der Abnehmspritze · `vitamin-d-abnehmspritze` · versorgung-in-deutschland

- **Grafik:** `/grafiken/versorgung-in-deutschland.png`
- **Wo:** unter `## Die Ausgangslage: Mangel ist in Deutschland normal`, am Ende des Abschnitts (optional)
- **Quellen im Frontmatter:** `nvs2` = 8 (anhängen), `rabenberg2015` = 1
- **Hinten an `sources` anhängen:** `nvs2`

```html
<figure class="my-8">
  <img src="/grafiken/versorgung-in-deutschland.png" alt="Balkendiagramm zur Versorgung Erwachsener in Deutschland: Unter der Zufuhrempfehlung lagen bei Magnesium 26 Prozent der Männer und 29 Prozent der Frauen, bei Eisen 14 Prozent der Männer und 58 Prozent der Frauen (Nationale Verzehrsstudie II). Beim Vitamin-D-Wert im Blut lagen 30,2 Prozent unter 30 Nanomol pro Liter (Mangel) und 61,6 Prozent unter 50 Nanomol pro Liter (DEGS1). Erhoben vor der Zeit der GLP-1-Medikamente." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Wo die Versorgung in Deutschland ohnehin knapp ist: Magnesium und Eisen unter der Zufuhrempfehlung, Vitamin D im Blut.<sup><a href="#fn-rabenberg2015">1</a>, <a href="#fn-nvs2">8</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Muskelabbau bei der Abnehmspritze vermeiden · `muskelabbau-abnehmspritze` · fett-und-fettfreie-masse-zwei-studien

- **Grafik:** `/grafiken/fett-und-fettfreie-masse-zwei-studien.png`
- **Wo:** unter `## Wie viel Muskelmasse geht verloren?`, direkt nach der vorhandenen Grafik „koerperzusammensetzung-step-1“, am Ende des Abschnitts
- **Quellen im Frontmatter:** `wilding2021dxa` = 1, `look2025surmount1dxa` = 10

```html
<figure class="my-8">
  <img src="/grafiken/fett-und-fettfreie-masse-zwei-studien.png" alt="Zwei Balken, die den Gewichtsverlust aufteilen: In der STEP-1-Substudie mit Semaglutid (140 Teilnehmende, 68 Wochen) entfielen rund 60 Prozent auf Fettmasse und rund 40 Prozent auf fettfreie Masse, in der SURMOUNT-1-Substudie mit Tirzepatid (160 Teilnehmende, 72 Wochen) rund 75 Prozent auf Fettmasse und rund 25 Prozent auf fettfreie Masse. Unter Tirzepatid sanken Körpergewicht um 21,3 Prozent, Fettmasse um 33,9 Prozent und fettfreie Masse um 10,9 Prozent (Placebo 5,3, 8,2 und 2,6 Prozent). Zwei verschiedene Studien, kein direkter Vergleich." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Anteil von Fett und fettfreier Masse am Gewichtsverlust in zwei DXA-Substudien: rund 60 zu 40 % unter Semaglutid, rund 75 zu 25 % unter Tirzepatid.<sup><a href="#fn-wilding2021dxa">1</a>, <a href="#fn-look2025surmount1dxa">10</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Kalorienbedarf nach der Abnehmspritze · `kalorienbedarf-nach-abnehmspritze` · fett-und-fettfreie-masse-zwei-studien

- **Grafik:** `/grafiken/fett-und-fettfreie-masse-zwei-studien.png`
- **Wo:** unter `## Wie viele Kalorien brauche ich nach dem Absetzen?`, nach dem ersten Absatz des Abschnitts
- **Quellen im Frontmatter:** `wilding2021dxa` = 10, `look2025surmount1dxa` = 11

```html
<figure class="my-8">
  <img src="/grafiken/fett-und-fettfreie-masse-zwei-studien.png" alt="Zwei Balken, die den Gewichtsverlust aufteilen: In der STEP-1-Substudie mit Semaglutid (140 Teilnehmende, 68 Wochen) entfielen rund 60 Prozent auf Fettmasse und rund 40 Prozent auf fettfreie Masse, in der SURMOUNT-1-Substudie mit Tirzepatid (160 Teilnehmende, 72 Wochen) rund 75 Prozent auf Fettmasse und rund 25 Prozent auf fettfreie Masse. Unter Tirzepatid sanken Körpergewicht um 21,3 Prozent, Fettmasse um 33,9 Prozent und fettfreie Masse um 10,9 Prozent (Placebo 5,3, 8,2 und 2,6 Prozent). Zwei verschiedene Studien, kein direkter Vergleich." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Anteil von Fett und fettfreier Masse am Gewichtsverlust in zwei DXA-Substudien: rund 60 zu 40 % unter Semaglutid, rund 75 zu 25 % unter Tirzepatid.<sup><a href="#fn-wilding2021dxa">10</a>, <a href="#fn-look2025surmount1dxa">11</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Kalorienbedarf nach der Abnehmspritze · `kalorienbedarf-nach-abnehmspritze` · kalorienbedarf-zwei-effekte

- **Grafik:** `/grafiken/kalorienbedarf-zwei-effekte.png`
- **Wo:** unter `## Warum der echte Verbrauch unter der Formel liegt`, nach dem ersten Absatz des Abschnitts (mit „Für die Beispiele oben heißt das …“)
- **Quellen im Frontmatter:** `mifflin1990` = 1, `dgeEnergie` = 2, `leibel1995` = 3, `rosenbaum2010` = 4, `martins2020` = 7

```html
<figure class="my-8">
  <img src="/grafiken/kalorienbedarf-zwei-effekte.png" alt="Wasserfalldiagramm für eine Frau mit 45 Jahren und 170 Zentimetern: Vor dem Abnehmen mit 95 Kilogramm liegt der Tagesbedarf laut Formel bei 2.277 kcal. Der leichtere Körper senkt ihn um 210 kcal auf 2.067 kcal bei 80 Kilogramm. Die Anpassung nach Gewichtsverlust senkt den tatsächlichen Verbrauch in Messungen um weitere 300 bis 400 kcal, auf rund 1.700 bis 1.800 kcal; beim Ruheumsatz war die Anpassung in einer anderen Studie deutlich kleiner (92 kcal am Tag). Formel nach Mifflin-St-Jeor mal Aktivitätsfaktor 1,4, gerundet." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Rechenbeispiel von 95 auf 80 kg: Die Formel senkt den Tagesbedarf um 210 kcal, die Anpassung nach Gewichtsverlust in Messungen um weitere 300 bis 400 kcal; beim Ruheumsatz war sie in einer anderen Studie deutlich kleiner.<sup><a href="#fn-mifflin1990">1</a>, <a href="#fn-dgeEnergie">2</a>, <a href="#fn-leibel1995">3</a>, <a href="#fn-rosenbaum2010">4</a>, <a href="#fn-martins2020">7</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Krafttraining nach der Abnehmspritze · `krafttraining-nach-abnehmspritze` · training-art-fettfreie-masse

- **Grafik:** `/grafiken/training-art-fettfreie-masse.png`
- **Wo:** unter `## Warum Krafttraining und nicht einfach „Bewegung“`, am Ende des Abschnitts (nach der Grafik „training-s-lite“ und dem Absatz „Für Frauen in und nach den Wechseljahren …“), vor „## Die drei Prinzipien“
- **Quellen im Frontmatter:** `villareal2017` = 9 (anhängen)
- **Hinten an `sources` anhängen:** `villareal2017`

```html
<figure class="my-8">
  <img src="/grafiken/training-art-fettfreie-masse.png" alt="Zwei Balkengruppen aus einer randomisierten Studie mit 160 Erwachsenen ab 65 Jahren mit Adipositas, 26 Wochen Diät und im Mittel 9 Prozent Gewichtsverlust: Verlust an fettfreier Masse mit Krafttraining 1,0 Kilogramm, mit Kraft plus Ausdauer 1,7 Kilogramm, mit Ausdauertraining 2,7 Kilogramm. Knochendichte der Hüfte: minus 2,6 Prozent mit Ausdauertraining, minus 1,1 Prozent mit Kraft plus Ausdauer, mit Krafttraining weniger als 1 Prozent und nicht signifikant." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Bei gleicher Diät verlor die Krafttrainingsgruppe am wenigsten fettfreie Masse; die Knochendichte der Hüfte sank mit Ausdauertraining um 2,6 %, mit Kraft plus Ausdauer um 1,1 %, mit Krafttraining um weniger als 1 %.<sup><a href="#fn-villareal2017">9</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Wechseljahre und Abnehmspritze · `wechseljahre-abnehmspritze` · training-art-fettfreie-masse

- **Grafik:** `/grafiken/training-art-fettfreie-masse.png`
- **Wo:** unter `## Knochen: der Punkt, den die Waage nicht zeigt`, nach dem zweiten Absatz („Zwei Studien zeigen, was den Unterschied macht …“)
- **Quellen im Frontmatter:** `villareal2017` = 10

```html
<figure class="my-8">
  <img src="/grafiken/training-art-fettfreie-masse.png" alt="Zwei Balkengruppen aus einer randomisierten Studie mit 160 Erwachsenen ab 65 Jahren mit Adipositas, 26 Wochen Diät und im Mittel 9 Prozent Gewichtsverlust: Verlust an fettfreier Masse mit Krafttraining 1,0 Kilogramm, mit Kraft plus Ausdauer 1,7 Kilogramm, mit Ausdauertraining 2,7 Kilogramm. Knochendichte der Hüfte: minus 2,6 Prozent mit Ausdauertraining, minus 1,1 Prozent mit Kraft plus Ausdauer, mit Krafttraining weniger als 1 Prozent und nicht signifikant." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Bei gleicher Diät verlor die Krafttrainingsgruppe am wenigsten fettfreie Masse; die Knochendichte der Hüfte sank mit Ausdauertraining um 2,6 %, mit Kraft plus Ausdauer um 1,1 %, mit Krafttraining um weniger als 1 %.<sup><a href="#fn-villareal2017">10</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Wechseljahre und Abnehmspritze · `wechseljahre-abnehmspritze` · wechseljahre-koerperzusammensetzung

- **Grafik:** `/grafiken/wechseljahre-koerperzusammensetzung.png`
- **Wo:** unter `## Was sich in den Wechseljahren wirklich ändert`, nach dem ersten Absatz (SWAN-Kohorte)
- **Quellen im Frontmatter:** `greendale2019` = 1

```html
<figure class="my-8">
  <img src="/grafiken/wechseljahre-koerperzusammensetzung.png" alt="Zwei Balkengruppen aus der SWAN-Studie mit 1.246 Frauen: Der jährliche Zuwachs an Fettmasse stieg von 0,25 Kilogramm vor dem Übergang auf 0,45 Kilogramm im Übergang. Die fettfreie Masse nahm vor dem Übergang um 0,2 Prozent pro Jahr zu und sank im Übergang um 0,2 Prozent pro Jahr. Beides lief bis etwa zwei Jahre nach der letzten Regelblutung weiter; das Gewicht selbst stieg nicht schneller als vorher." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">SWAN-Studie: Im Übergang wuchs die Fettmasse pro Jahr schneller, die fettfreie Masse nahm ab; das Gewicht stieg nicht schneller als vorher.<sup><a href="#fn-greendale2019">1</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Wie oft wiegen nach der Abnehmspritze? Was Studien zeigen · `wie-oft-wiegen-nach-abnehmspritze` · wiegen-zonen-stop-regain

- **Grafik:** `/grafiken/wiegen-zonen-stop-regain.png`
- **Wo:** unter `## Die Regel: Zonen statt Gefühl`, nach der Liste der drei Zonen, vor „Die Schwellen stammen aus einer Studie ohne Medikament …“
- **Quellen im Frontmatter:** `wing2006` = 1, `daley2019` = 6

```html
<figure class="my-8">
  <img src="/grafiken/wiegen-zonen-stop-regain.png" alt="Zonen der STOP-Regain-Studie bezogen auf das Gewicht nach der Abnahme, zu Studienbeginn: grün bis plus 1,4 Kilogramm, gelb bis plus 2,3 Kilogramm, obere Zone (in der Studie rot) ab plus 2,3 Kilogramm, jeweils mit vorher festgelegter Reaktion. Nach 18 Monaten hatten in der persönlich betreuten Gruppe 45,7 Prozent 2,3 Kilogramm oder mehr wieder zugenommen, in der Kontrollgruppe 72,4 Prozent. Wiegen ohne festgelegte Reaktion verhinderte die Wiederzunahme in einer späteren Studie nicht." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">STOP Regain: drei Zonen mit festgelegter Reaktion; in der persönlich betreuten Gruppe nahmen 45,7 % 2,3 kg oder mehr wieder zu, in der Kontrollgruppe 72,4 %.<sup><a href="#fn-wing2006">1</a>, <a href="#fn-daley2019">6</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Gewicht halten nach der Abnehmspritze · `gewicht-halten-nach-abnehmspritze` · wiegen-zonen-stop-regain

- **Grafik:** `/grafiken/wiegen-zonen-stop-regain.png`
- **Wo:** unter `## Die drei Regeln, die den ganzen Plan tragen`, nach der Grafik „zeitachse-phasen“, vor „## Phase 1 …“ (optional)
- **Quellen im Frontmatter:** `wing2006` = 8, `daley2019` = 12 (anhängen)
- **Hinten an `sources` anhängen:** `daley2019`

```html
<figure class="my-8">
  <img src="/grafiken/wiegen-zonen-stop-regain.png" alt="Zonen der STOP-Regain-Studie bezogen auf das Gewicht nach der Abnahme, zu Studienbeginn: grün bis plus 1,4 Kilogramm, gelb bis plus 2,3 Kilogramm, obere Zone (in der Studie rot) ab plus 2,3 Kilogramm, jeweils mit vorher festgelegter Reaktion. Nach 18 Monaten hatten in der persönlich betreuten Gruppe 45,7 Prozent 2,3 Kilogramm oder mehr wieder zugenommen, in der Kontrollgruppe 72,4 Prozent. Wiegen ohne festgelegte Reaktion verhinderte die Wiederzunahme in einer späteren Studie nicht." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">STOP Regain: drei Zonen mit festgelegter Reaktion; in der persönlich betreuten Gruppe nahmen 45,7 % 2,3 kg oder mehr wieder zu, in der Kontrollgruppe 72,4 %.<sup><a href="#fn-wing2006">8</a>, <a href="#fn-daley2019">12</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Feiertage nach der Abnehmspritze · `feiertage-nach-abnehmspritze` · feiertage-gewicht

- **Grafik:** `/grafiken/feiertage-gewicht.png`
- **Wo:** unter `## Wie viel nimmt man über Weihnachten zu?`, am Ende des Abschnitts, vor „## Warum die Feiertage nach der Abnehmspritze anders sind“
- **Quellen im Frontmatter:** `helander2016` = 1, `turicchi2020` = 4, `mason2018` = 9

```html
<figure class="my-8">
  <img src="/grafiken/feiertage-gewicht.png" alt="Zwei Balkengruppen: Zehn Tage nach Weihnachten lag das Gewicht in Deutschland im Mittel 0,6 Prozent höher als zehn Tage davor, zu Ostern 0,2 Prozent. In einer europäischen Studie mit Menschen in der Haltephase nach mindestens 5 Prozent Gewichtsverlust stieg es über Weihnachten um 1,35 Prozent. In einer randomisierten Studie wog die Gruppe, die sich mindestens zweimal pro Woche wog, notierte und zehn Tipps bekam, nach den Feiertagen 0,13 Kilogramm weniger, die Vergleichsgruppe 0,37 Kilogramm mehr; Unterschied 0,49 Kilogramm." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Gewicht über die Feiertage: +0,6 % nach Weihnachten in Deutschland, +1,35 % in der Haltephase; mit regelmäßigem Wiegen 0,49 kg weniger als ohne.<sup><a href="#fn-helander2016">1</a>, <a href="#fn-turicchi2020">4</a>, <a href="#fn-mason2018">9</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Protein bei der Abnehmspritze · `protein-abnehmspritze` · protein-verteilung

- **Grafik:** `/grafiken/protein-verteilung.png`
- **Wo:** unter `## Wie du die Menge mit wenig Appetit schaffst`, nach der Liste der sieben Tipps (Punkt 3 „Vier kleine statt zwei große Mahlzeiten“), vor dem Absatz „Zwei Folgen zu geringer Zufuhr …“
- **Quellen im Frontmatter:** `mamerow2014` = 7 (anhängen), `leidy2015` = 2
- **Hinten an `sources` anhängen:** `mamerow2014`

```html
<figure class="my-8">
  <img src="/grafiken/protein-verteilung.png" alt="Zwei Balkengruppen: gleichmäßige Verteilung mit etwa 30 Gramm Protein zu Frühstück, Mittag und Abend gegenüber abendlastiger Verteilung mit etwa 10, 15 und 65 Gramm bei gleicher Tagesmenge. Bei gleichmäßiger Verteilung lag die Muskelproteinsynthese über 24 Stunden um 25 Prozent höher. Kleine Studie, gemessen wurde die Muskelproteinsynthese, nicht die Muskelmasse. Empfehlung für Gewichtsabnahme und -erhalt: mindestens etwa 25 bis 30 Gramm Protein pro Mahlzeit." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Gleiche Tagesmenge, anders verteilt: Mit etwa 30 g zu jeder Mahlzeit lag die Muskelproteinsynthese über 24 Stunden 25 % höher als abendlastig.<sup><a href="#fn-leidy2015">2</a>, <a href="#fn-mamerow2014">7</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Ernährung nach der Abnehmspritze · `ernaehrung-nach-abnehmspritze` · protein-tag-beispiel

- **Grafik:** `/grafiken/protein-tag-beispiel.png`
- **Wo:** unter `## Ein Tag nach der Spritze (80 kg, Ziel 100 g Protein)`, nach der Tabelle und dem Satz „Zusammen rund 100 g Protein …“
- **Quellen im Frontmatter:** `leidy2015` = 3, `bls` = 9

```html
<figure class="my-8">
  <img src="/grafiken/protein-tag-beispiel.png" alt="Gestapelter Balken eines Beispieltags bei 80 Kilogramm Körpergewicht: morgens 200 Gramm Skyr mit Beeren und 2 Esslöffeln Haferflocken, etwa 24 Gramm Protein; mittags Salat oder Gemüse mit 120 Gramm Hähnchen, Fisch oder Tofu und einer Scheibe Vollkornbrot, etwa 30 Gramm (mit Tofu weniger); nachmittags Hüttenkäse oder ein Protein-Shake und ein Apfel, etwa 20 Gramm; abends Linsen- oder Bohneneintopf mit 2 Eiern oder 150 Gramm Fisch, etwa 30 Gramm. Zusammen rund 100 Gramm Protein, im Zielbereich von 96 bis 128 Gramm (1,2 bis 1,6 Gramm pro Kilogramm), und rund 30 Gramm Ballaststoffe." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Ein Beispieltag mit rund 100 g Protein bei 80 kg, im Zielbereich von 96 bis 128 g.<sup><a href="#fn-leidy2015">3</a>, <a href="#fn-bls">9</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

### Glucomannan bei und nach der Abnehmspritze · `glucomannan-abnehmspritze` · ballaststoffe-portionen

- **Grafik:** `/grafiken/ballaststoffe-portionen.png`
- **Wo:** unter `## Glucomannan im Vergleich mit Lebensmitteln`, nach der Tabelle und dem Satz „Werte aus dem Bundeslebensmittelschlüssel, gerundet.“, vor „Lesart: …“
- **Quellen im Frontmatter:** `bls` = 7, `dgeBallaststoffe` = 3, `euClaims` = 1

```html
<figure class="my-8">
  <img src="/grafiken/ballaststoffe-portionen.png" alt="Balkendiagramm der Ballaststoffe je Portion: Linsen gekocht 150 Gramm etwa 8 Gramm, Vollkornbrot 2 Scheiben etwa 8 Gramm, Himbeeren 125 Gramm etwa 6 Gramm, Brokkoli gegart 200 Gramm etwa 6 Gramm, Haferflocken 50 Gramm etwa 5 Gramm, Leinsamen 1 Esslöffel etwa 4 Gramm, Glucomannan als Tagesmenge laut zugelassener Angabe 3 Gramm. Richtwert mindestens 30 Gramm am Tag; die 3 Gramm Glucomannan sind ein Zehntel davon. Die Angabe zu Glucomannan gilt für drei Portionen zu je 1 Gramm mit ein bis zwei Gläsern Wasser vor den Mahlzeiten bei kalorienarmer Ernährung; nie ohne reichlich Wasser einnehmen (Erstickungsgefahr)." width="1200" height="675" loading="lazy" class="w-full" />
  <figcaption class="mt-2 text-sm text-ink-3">Ballaststoffe je Portion: Linsen und Vollkornbrot liefern je etwa 8 g, die Glucomannan-Tagesmenge 3 g, ein Zehntel des Richtwerts von 30 g.<sup><a href="#fn-euClaims">1</a>, <a href="#fn-dgeBallaststoffe">3</a>, <a href="#fn-bls">7</a></sup> Grafik: Nach der Spritze, frei verwendbar mit Quellenangabe.</figcaption>
</figure>
```

## Zusammenfassung: Quellen, die im Frontmatter ergänzt werden müssen

| Artikel | anhängen (in dieser Reihenfolge) |
|---|---|
| `kreatin-abnehmspritze` | `hultman1996` |
| `saxenda-absetzen` | `fachinfoMounjaro`, `fachinfoWegovy` |
| `ozempic-absetzen` | `fachinfoWegovy`, `fachinfoSaxenda`, `fachinfoMounjaro` |
| `wegovy-absetzen` | `fachinfoSaxenda`, `fachinfoMounjaro` |
| `supplements-nach-abnehmspritze` | `nvs2`, `rabenberg2015` |
| `magnesium-abnehmspritze` | `rabenberg2015` |
| `eisen-abnehmspritze` | `rabenberg2015` |
| `vitamin-d-abnehmspritze` | `nvs2` |
| `krafttraining-nach-abnehmspritze` | `villareal2017` |
| `gewicht-halten-nach-abnehmspritze` | `daley2019` |
| `protein-abnehmspritze` | `mamerow2014` |

Neu in `src/data/sources.ts`: `hultman1996` (Hultman et al., J Appl Physiol 1996; Kreatinspeicher mit und ohne Ladephase). Alle übrigen IDs gab es schon.

## Übersicht der neuen Grafiken

| Grafik | Ziel-Artikel | Quellen |
|---|---|---|
| `kreatin-speicher-im-muskel` | `kreatin-abnehmspritze` | hultman1996, kreider2017 |
| `wirkstoff-abbau-nach-letzter-dosis` | `saxenda-absetzen`, `ozempic-absetzen`, `wegovy-absetzen` | fachinfoSaxenda, fachinfoMounjaro, fachinfoWegovy, fachinfoOzempic |
| `s-lite-liraglutid-und-training` | `saxenda-absetzen` | lundgren2021, jensen2024 |
| `heisshunger-vor-der-waage` | `heisshunger-nach-abnehmspritze` | fachinfoWegovy, sumithran2011, wu2025 |
| `schlaf-und-hungerhormone` | `heisshunger-nach-abnehmspritze` | spiegel2004 |
| `absetzen-im-ersten-jahr` | `jojo-effekt-abnehmspritze`, `abnehmspritze-absetzen` | rodriguez2025 |
| `step-2-typ-2-diabetes` | `ozempic-absetzen` | davies2021step2 |
| `supplements-was-belegt-ist` | `supplements-nach-abnehmspritze` | leidy2015, kreider2017, euClaims, dgeBallaststoffe, adaSoc2024, klartextNem, almandoz2024 |
| `versorgung-in-deutschland` | `supplements-nach-abnehmspritze`, `magnesium-abnehmspritze`, `eisen-abnehmspritze`, `vitamin-d-abnehmspritze` | nvs2, rabenberg2015 |
| `fett-und-fettfreie-masse-zwei-studien` | `muskelabbau-abnehmspritze`, `kalorienbedarf-nach-abnehmspritze` | wilding2021dxa, look2025surmount1dxa |
| `kalorienbedarf-zwei-effekte` | `kalorienbedarf-nach-abnehmspritze` | mifflin1990, dgeEnergie, leibel1995, rosenbaum2010, martins2020 |
| `training-art-fettfreie-masse` | `krafttraining-nach-abnehmspritze`, `wechseljahre-abnehmspritze` | villareal2017 |
| `wechseljahre-koerperzusammensetzung` | `wechseljahre-abnehmspritze` | greendale2019 |
| `wiegen-zonen-stop-regain` | `wie-oft-wiegen-nach-abnehmspritze`, `gewicht-halten-nach-abnehmspritze` | wing2006, daley2019 |
| `feiertage-gewicht` | `feiertage-nach-abnehmspritze` | helander2016, turicchi2020, mason2018 |
| `protein-verteilung` | `protein-abnehmspritze` | mamerow2014, leidy2015 |
| `protein-tag-beispiel` | `ernaehrung-nach-abnehmspritze` | leidy2015, bls |
| `ballaststoffe-portionen` | `glucomannan-abnehmspritze` | bls, dgeBallaststoffe, euClaims |
