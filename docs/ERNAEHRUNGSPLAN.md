# Ernährungsplan (Lead-Magnet)

Stand 07.10.2026 (Redesign „Kalk“; PDF seit 07.10. als eigene Druckfassung, A4 und Handy; Planseite interaktiv, siehe „Interaktive Planseite“). Kostenloser Plan für 14 Tage gegen Newsletter-Anmeldung, alternativ per persönlicher Mail an Dominik. Ersetzt die Fassung vom 02.10. (sieben Tage, 18 Pläne ep01 bis ep18); deren Links funktionieren weiter (siehe „Alte Pläne“).

## Was der Plan enthält

- 14 Tage mit Frühstück, Mittag, Abend und je nach Appetit Zwischenmahlzeiten, jede Mahlzeit mit Mengen und Protein.
- **Planseite** (Web): Profil, „14 Tage auf einen Blick“ (Protein pro Tag), Tage mit Summe und Balken gegen das Ziel, Einkaufsliste je Woche nach Abteilungen, Rezeptkarten (die zehn häufigsten Gerichte), Hinweise mit Rechenweg, Rechengrundlage (Protein je 100 g je Zutat), Austauschtabelle (Menge für etwa 20 g Protein), Ausschlusskriterien, Pflichtsatz, Quellen. Mit JavaScript wird der Teil mit den Tagen interaktiv (Abschnitt „Interaktive Planseite“); ohne JavaScript bleibt dieser statische Plan.
- **PDF** (seit 07.10.2026 eigene Druckfassung, ruhig wie die Website, in zwei Formaten):
  1. Deckblatt: Planname (Appetit, Gewicht, Vorlieben), drei Zahlen (Ernährungsform, 14 Tage, Protein pro Tag), drei Regeln mit je einem Satz. Keine Grafik, keine Fußnoten.
  2. Je Woche zuerst „Woche X auf einen Blick“: Raster 7 Tage × 4 Mahlzeiten (Frühstück, Mittag, Abend, Zwischendurch), nur Gerichtnamen, zum Aufhängen.
  3. Danach die Einkaufsliste der Woche: Packungen statt Grammzahlen, wo es Sinn ergibt (z. B. „1 Becher Skyr natur, 500 g“, auf ganze Packungen aufgerundet, klein dahinter die Menge im Plan), nach Abteilungen, Kästchen zum Abhaken; Obst, Gemüse und Kräuter ohne Menge, Gewürze und Öl als eine Zeile „Aus dem Vorrat“. Packungsgrößen: `src/data/ernaehrungsplan-packungen.ts` (nur übliche Supermarktgrößen; frisches Fleisch und Fisch, Käse, Garnelen und Edamame bleiben in Gramm, auf 50 g aufgerundet).
  4. Tagesseiten: A4 zwei Tage pro Seite, Handy ein Tag pro Seite. Gerichtname groß, Mengen in einer hellen zweiten Zeile, Protein als kleine Zahl rechts, Verweis „Rezept N“. Keine Balken; Haarlinie nur zwischen den Tagen.
  5. Rezepte nur für Gerichte mit mindestens 15 Minuten Zubereitung (`REZEPT_AB_MINUTEN` in `src/lib/ernaehrungsplan-druck.ts`; je Plan 14 bis 26), in der Reihenfolge des ersten Vorkommens, eine halbe A4-Seite je Rezept, Schritte nummeriert, Zutaten ohne Mengen (die stehen beim jeweiligen Tag).
  6. „Tauschen“: 10 bis 12 Zeilen „statt X → Y oder Z“ für die Proteinquellen des Plans, je höchstens 3 g Protein Unterschied, passend zu Ernährungsform und Laktose (vegan nur vegane Partner); aus Proteingehalt und Austausch-Kennzeichen der Zutaten abgeleitet.
  7. Letzte Seite klein: Hinweise (Rechenweg mit Fußnoten, Ballaststoffe, Trinken, Laktose, Mengen), „Was dieser Plan ist und was nicht“ mit Ausschlusskriterien, Pflichtsatz `site.doctorSentence`, Kontakt, Quellen. Die Rechengrundlage steht nicht im PDF (Planseite und „So entsteht dein Plan“ auf `/ernaehrungsplan/`).
  - Typografie wie die Wissensseiten: sechs Schriftgrößen (10, 12, 14, 18, 28, 48 px), drei Textfarben (Tinte, Text 3, Grün für Protein), Abstände im 8-px-Raster, Weißraum statt Linien. Fußzeile auf jeder Seite: „Allgemeiner Beispielplan für gesunde Erwachsene, keine ärztliche oder ernährungstherapeutische Beratung.“ und Seitenzahl.
- Rezeptpool: 80 Gerichte (18 Frühstücke, 40 Hauptgerichte, 22 Zwischenmahlzeiten) mit Supermarkt-Zutaten, davon je nach Variante 35 bis 72 passend. Kein Gericht an zwei Tagen hintereinander. Mischkost: Fleisch an drei, Fisch an zwei Tagen pro Woche; pescetarisch: Fisch an vier Tagen; mit passender Vorliebe je ein Tag mehr.
- Kein Arztbezug, keine Dosierungen, keine Kalorienvorgaben, keine Medikamentennamen, keine Affiliate-Links. Hinweis „allgemeiner Beispielplan“ und Ausschlusskriterien stehen im Plan, im Formular und in der PDF-Fußzeile.

## Ablauf für Nutzer

1. Startseite (Abschnitt Ernährungsplan), Werkzeuge-Übersicht, Ernährungs-Artikel, Themenseite Ernährung (`fragen`), Checkliste und Footer → `/ernaehrungsplan/`.
2. Vier Fragen: Ernährungsform (Mischkost, pescetarisch, vegetarisch, vegan) mit Schalter „laktosefrei“ (vegan immer laktosefrei), Appetit (noch klein, wieder normal), Gewicht (Regler 45 bis 160 kg → vier Stufen), Vorlieben (freiwillig, 16 Lebensmittel, passend zur Ernährungsform eingeblendet; Hüttenkäse nicht bei laktosefrei). Die Vorschau rechnet im Browser mit demselben Generator: Proteinziel, 14 Tagesbalken, Tag 1 mit Mahlzeiten.
3. E-Mail, Häkchen „keins der Ausschlusskriterien“ (Nierenerkrankung, Schwangerschaft/Stillzeit, Essstörung, unter 18), Häkchen „Plan plus Newsletter“. Beides Pflicht.
4. `api/ernaehrungsplan.js` legt die Adresse bei MailerLite an (Status `unconfirmed`, Gruppen „Newsletter“ und „Ernährungsplan“, Felder `plan` = `ek01` bis `ek56`, `vorlieben` = z. B. `lachs,quark` oder leer, `quelle` = `ernaehrungsplan`) und leitet auf `/ernaehrungsplan/danke/` weiter.
5. MailerLite schickt die Bestätigungs-Mail (Double-Opt-in). Nach dem Klick ist die Adresse aktiv, die Automation schickt den Link auf die Planseite und das PDF.
6. Planseite `/ernaehrungsplan/plan/<plan>/?v=<vorlieben>` (noindex): zeigt den Plan und rechnet Vorlieben im Browser ein. Tage tauschen und verschieben, Appetit-Regler, Einkaufsliste und Druck: Abschnitt „Interaktive Planseite“. „Plan anpassen“ wechselt Ernährungsform, Gewicht und Laktose (öffnet den passenden Plan; Vorlieben und Änderungen kommen mit, soweit sie passen) und Vorlieben (direkt auf der Seite, die Adresse merkt sie sich). Die Knöpfe „PDF fürs Handy“ und „PDF zum Drucken (A4)“ drucken mit JavaScript den aktuellen Plan; darunter und ohne JavaScript führen Links zu den fertigen PDFs des Grundplans (`/downloads/ernaehrungsplan/<plan>-handy.pdf`, `/downloads/ernaehrungsplan/<plan>.pdf`, Plausible-Ereignis „Ernaehrungsplan PDF“ mit `format` = `handy` oder `a4`). Damit braucht niemand eine zweite Mail, wenn sich etwas ändert.
7. Ohne Newsletter: Mail an `site.owner.email` (Link im Formular, mit den Antworten, Plannummer und Vorlieben vorausgefüllt). Dominik antwortet mit dem Link `https://nachderspritze.de/ernaehrungsplan/plan/<plan>/?v=<vorlieben>` (Plannummer und Vorlieben stehen in der Mail).

## To-do MailerLite (einmalig, vor dem Merge des Redesigns)

1. **Feld** anlegen: Subscribers → Fields → Create field, Name `vorlieben`, Typ Text. Ohne das Feld legt die Funktion die Adresse ohne Vorlieben an (der Plan kommt trotzdem, nur ohne Vorlieben).
2. **Automation** „Ernährungsplan“ (Trigger „joins group Ernährungsplan“) anpassen:
   - Betreff: `Dein Ernährungsplan für 14 Tage`
   - Text (Vorschlag):
     > Hallo,
     >
     > hier ist dein Ernährungsplan: 14 Tage mit Mengen, Einkaufslisten, Rezeptkarten und Austauschtabelle.
     >
     > [Button: Meinen Plan öffnen] → `https://nachderspritze.de/ernaehrungsplan/plan/{$plan}/?v={$vorlieben}`
     >
     > Auf der Seite kannst du Gerichte tauschen und verschieben, Vorlieben ändern und den Appetit umstellen, wenn er zurückkommt. Die Adresse merkt sich deine Änderungen; speichere sie als Lesezeichen. Als PDF fürs Handy: `https://nachderspritze.de/downloads/ernaehrungsplan/{$plan}-handy.pdf`, zum Drucken (A4): `https://nachderspritze.de/downloads/ernaehrungsplan/{$plan}.pdf` (beide Grundplan ohne Vorlieben); mit deinen Änderungen über die beiden PDF-Knöpfe auf der Seite.
     >
     > Der Plan ist ein allgemeiner Beispielplan für gesunde Erwachsene und ersetzt keine ärztliche oder ernährungstherapeutische Beratung. Ob und wie du dein Medikament absetzt, besprichst du mit deiner Ärztin oder deinem Arzt.
     >
     > Fragen? Antworte einfach auf diese Mail.
     >
     > Dominik von Nach der Spritze
   - Merge-Tags prüfen: In MailerLite heißen eigene Felder `{$plan}` und `{$vorlieben}`. Beim Testversand muss im Link `ek…` stehen und hinter `?v=` entweder nichts oder z. B. `lachs,quark`, nie der Platzhalter. Ist `vorlieben` leer, endet der Link auf `?v=`; die Seite zeigt dann den Grundplan.
   - Keine Affiliate-Links, keine Präparatenamen, kein Programm-Teaser in dieser Mail.
3. Testversand an eine eigene Adresse, Link öffnen, eine Vorliebe ankreuzen, ein Gericht tauschen, Appetit umstellen, „PDF fürs Handy“ testen.
4. Bestehende Abonnenten mit `plan` = `ep01` bis `ep18` brauchen nichts: Die alten Links leiten weiter (unten).

## Einrichtung bei MailerLite (Stand 02.10.2026, weiter gültig)

Gruppe „Ernährungsplan“ (ID als Vercel-Variable `MAILERLITE_GROUP_ERNAEHRUNGSPLAN`), Feld `plan` (Text), Feld `quelle` (fehlt es, legt die Funktion ohne `quelle` an), Automation mit erlaubtem erneutem Durchlauf, Bestätigungs-Mail (englisch, im aktuellen Tarif nicht änderbar).

## Vercel

- Keine neuen Variablen. `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_NEWSLETTER`, `MAILERLITE_GROUP_ERNAEHRUNGSPLAN` wie bisher. Fehlt eine, landet jede Anfrage auf `?fehler=technik`; keine Adresse wird ohne Plan angelegt.
- Rewrite `/api/ernaehrungsplan/` → `/api/ernaehrungsplan` steht in `vercel.json`.
- Fehlt ein Feld im Konto (MailerLite antwortet 422), versucht die Funktion es ohne `quelle`, dann ohne `vorlieben`. Ohne `plan` scheitert es (gewollt).

## Test (Preview, dann Produktion)

1. Formular mit einer eigenen Test-Adresse (z. B. `dominik+ek1@…`) und zwei Vorlieben absenden → Danke-Seite.
2. Vercel → Logs: `ernaehrungsplan: ek13 v=lachs,haehnchen → angelegt (201)` o. Ä. Keine E-Mail-Adressen im Log.
3. MailerLite: Adresse in „Newsletter“ und „Ernährungsplan“, Status unconfirmed, Felder `plan` und `vorlieben` gesetzt.
4. Bestätigungslink klicken → Mail mit Plan-Link → Planseite zeigt die Vorlieben (Profilzeile, gelb markierte Gerichte), PDF-Link öffnet das PDF.
5. `curl -i https://nachderspritze.de/api/ernaehrungsplan/` → 405. Absenden ohne Häkchen → `?fehler=eingabe`.
6. Alte Links: `/ernaehrungsplan/plan/ep05/` leitet auf `/ernaehrungsplan/plan/ek11/` weiter; `/downloads/ernaehrungsplan/ep05.pdf` ist ein Hinweis mit Link auf den neuen Plan.

## Teststand 02.10.2026 (Produktion)

- Neue Adresse, Formular → Danke-Seite → Bestätigungsmail (englisch, Betreff „Confirmation email“) → Klick auf „Confirm your email“ → MailerLite schickt die Plan-Mail nach etwa 5 Sekunden; in Gmail kam sie nach 5 bis 7 Minuten an. Link öffnet das richtige PDF (getestet mit ep05 und ep15). Funktioniert.
- Ohne Klick auf den Bestätigungsbutton bleibt die Adresse „Unconfirmed“, und es kommt kein Plan. Das war der Fehler beim ersten Test (die Bestätigungsmail kam, der Button wurde nicht geklickt). Gmail fasst alle Bestätigungsmails mit gleichem Betreff zu einem Verlauf zusammen; beim Testen mit mehreren +-Adressen den Button in der jüngsten Mail klicken.
- Zweiter Plan für eine schon aktive Adresse: Die Funktion aktualisiert das Feld `plan` und weist die Gruppe neu zu, aber MailerLite startet die Automation nicht erneut, obwohl „Re-enter automation“ aktiv ist (auch nicht bei manuellem Entfernen und Wieder-Hinzufügen mit 70 Sekunden Abstand). Die Danke-Seite sagt das; solche Anfragen beantwortet Dominik per Mail. Bestehende Newsletter-Abonnenten, die zum ersten Mal einen Plan anfordern, treten der Gruppe zum ersten Mal bei; dafür sollte die Automation normal starten (noch nicht getestet).
- Betreff und Text der Bestätigungsmail lassen sich im aktuellen MailerLite-Tarif nicht ändern (Subscribe settings: „upgrade to a premium plan“). Optionen: Upgrade, eigene deutsche Bestätigung über die Website, Wechsel zu Brevo.
- Testadressen in MailerLite: dominik.jaekel95+ernaehrungsplan@gmail.com, dominik.jaekel95+ep2@gmail.com (beide aktiv, in Newsletter und Ernährungsplan). Vor dem ersten echten Newsletter entfernen oder einer Test-Gruppe zuordnen.

## Datenmodell

- `src/data/ernaehrungsplan-id.mjs` (auch von der API genutzt): Listen `ERNAEHRUNG`, `APPETIT`, `GEWICHT`, `VORLIEBEN`; `gewichtsstufe(kg)` (unter 70, 70 bis 85, 85 bis 100, über 100), `planId(ernaehrung, appetit, gewicht, laktosefrei)`, `alleKombinationen()` (56 in fester Reihenfolge, vegan nur laktosefrei), `leseVorlieben()` (filtert auf die zur Form passenden), `ALTE_PLAENE`. **Reihenfolge nie ändern, nur anhängen**, sonst zeigen verschickte Links auf falsche Pläne.
- `src/data/ernaehrungsplan-rezepte.ts`: Lebensmittel (Protein je 100 g/ml bzw. Stück, kleinste Ernährungsform, Laktose `ersetzbar`/`enthalten`, Abteilung, Vorliebe, Quelle) und Gerichte (Grundrezept für eine normale Portion, Mahlzeit, `dazu` ohne Menge, `ersatz` = Sojafassung nur für vegane und laktosefreie Pläne).
- `src/data/ernaehrungsplan-karten.ts`: Zubereitung (Zeit, Schritte, Tipp) für Frühstück und Hauptgerichte; getrennt, damit die Vorschau sie nicht lädt.
- `src/data/ernaehrungsplan.ts`: Generator `erstellePlan({ ernaehrung, appetit, gewicht, laktosefrei, vorlieben })`, deterministisch (Build und Browser rechnen gleich). Auswahl je Mahlzeit nach Punkten: bisherige Nutzung, Abstand zur letzten Nutzung, gleiche Hauptzutat am selben Tag, Vorliebe (bevorzugt), Wochenmuster Fleisch/Fisch. Tagesfaktor 0,4 bis 1,0 (Appetit klein) bzw. 0,7 bis 1,5 (normal) für Frühstück, Mittag und Abend; Zahl und Auswahl der Zwischenmahlzeiten so, dass der Faktor nahe 0,65 bzw. 1,05 liegt.
- `src/lib/ernaehrungsplan-ansicht.ts`: HTML der Webansicht für Überblick, Wochen, Einkaufslisten, Rezeptkarten und Rechengrundlage (Build und Browser).
- `src/lib/ernaehrungsplan-druck.ts`: HTML der Druckfassung (Deckblatt bis „Tauschen“; Build und Browser, auf dem Bildschirm unsichtbar), Stile `src/styles/ernaehrungsplan-druck.css` (`@page` A4 und benannte Seite `handy`, Fußzeile als Seitenrandfeld). Die letzte Seite (Hinweise, Quellen) steht statisch in `plan/[id].astro`. Reine Anzeige: Generator und Daten bleiben unverändert. `einkaufDaten()` liefert die Einkaufsliste einer Woche als Daten (Druck und interaktive Einkaufsliste).
- `src/lib/plan-interaktiv/`: interaktive Planseite, nur im Browser (Abschnitt „Interaktive Planseite“): `modell.ts` (Zustand, Regeln, URL-Parameter, ohne DOM), `seite.ts` (Ansicht und Bedienung), `ziehen.ts` (Ziehen mit Finger und Maus); Stile `src/styles/plan-interaktiv.css`.
- `src/data/ernaehrungsplan-packungen.ts`: Packungsart und -größe je Zutat für die Einkaufsliste im PDF, Einordnung der „dazu“-Angaben (frisch oder Vorrat).
- Seiten: `src/pages/ernaehrungsplan/index.astro` (Formular, Vorschau), `plan/[id].astro` (Planseite, Druckvorlage, Hinweisseiten ep01 bis ep18), `danke.astro`. Startseite: `src/components/ErnaehrungsplanTeaser.astro`.

## Zahlen und Quellen

- Proteinziel 1,2 g pro kg (`leidy2015`) auf ein Referenzgewicht je Stufe: 62, 78, 92 und 105 kg → 75, 95, 110 und 125 g (auf 5 g gerundet). Die Seite nennt bei „über 100 kg“ den Proteinrechner für ein genaueres Ziel.
- Protein je Zutat: gerundete Werte aus dem Bundeslebensmittelschlüssel (`bls`), Proteinpulver und Räuchertofu nach typischen Herstellerangaben (im Plan mit * markiert). Gemüse und Obst unter „dazu“ zählen nicht mit.
- Ballaststoffe 30 g (`dgeBallaststoffe`), Trinken sowie kleinere, häufigere Mahlzeiten (`almandoz2024`), Getränke (`dgeEmpfehlungen`), „Protein trägt zur Erhaltung von Muskelmasse bei“ (`euClaims`).

## Interaktive Planseite

Seit 07.10.2026. Mit JavaScript ersetzt `src/lib/plan-interaktiv/seite.ts` den Wochenteil der Planseite; ohne JavaScript bleibt der statische Plan aus dem Build vollständig lesbar. Generator, Rezeptpool, Zielwerte und Plan-IDs sind unverändert, alle neue Logik läuft im Browser (`modell.ts`). Keine neuen API-Aufrufe, keine externen Requests, keine Cookies, keine neuen MailerLite-Felder. Keine Kalorien, keine Gewichtseingabe, keine Statistiken; Hinweis „allgemeiner Beispielplan“, Ausschlusskriterien und Pflichtsatz bleiben sichtbar.

**Bedienung**
- **Tag für Tag:** Woche 1/2 als Reiter, darunter Tag 1 bis 14. Am Handy ein Tag pro Bildschirm, wischen wechselt den Tag; die Tagesknöpfe bleiben beim Scrollen oben stehen. Ab 1100 px die Woche als Raster (Zeilen Tage, Spalten Frühstück, Mittag, Abend, Zwischendurch). `#tag-5` in der Adresse öffnet Tag 5.
- **Verschieben:** am Griff (sechs Punkte) ziehen, nur innerhalb derselben Mahlzeit (Frühstück zu Frühstück, Nachmittag zu Nachmittag). Am Handy auf einen Tagesknopf ziehen, mit dem Finger erst nach kurzem Halten (schnelles Wischen über den Griff scrollt die Seite); am Desktop auf dieselbe Mahlzeit eines anderen Tages. Gleichwertig ohne Ziehen: Griff antippen oder mit Enter öffnen → „Mit Tag … tauschen“ (Auswahl, Tastatur). Beide Tage tauschen ihr Gericht, jedes mit seinen Mengen; angeboten werden nur Tage, an denen danach kein Gericht doppelt steht.
- **Tauschen:** Tipp auf ein Gericht öffnet 2 bis 3 Alternativen derselben Mahlzeit, passend zu Ernährungsform und Laktose, höchstens 5 g Protein Unterschied, Gerichte mit Vorlieben zuerst (gelb markiert), Tag bleibt möglichst im Zielbereich, Gerichte vom Vortag oder Folgetag nur, wenn es sonst weniger als zwei gäbe. Der Tausch übernimmt die Portion des Platzes. Für Proteinshakes (23 bis 24 g) gibt es oft keine Zwischenmahlzeit mit ähnlich viel Protein; dann sagt das Blatt das. „Nicht mein Fall“ blendet das Gericht im ganzen Plan aus und ersetzt jedes Vorkommen (möglichst nicht am Nachbartag, möglichst ±5 g); unten „wieder anbieten“.
- **Proteinbalken je Tag:** im Zielbereich (Ziel −5 bis +12 g, wie im Generator) grün, sonst grau mit Vorschlag „Tausch X gegen Y, dann passt es“ (Zwischenmahlzeit zuerst) und Knopf „Tauschen“. Kein Rot. Jede Änderung wird angesagt (aria-live, mit Protein der betroffenen Tage); sichtbar eine kurze Meldung mit „Rückgängig“ (ein Schritt).
- **Appetit-Regler** „noch klein ↔ wieder normal“: öffnet die Plan-ID mit derselben Ernährungsform, Laktose und Gewichtsstufe. Vorlieben und ausgeblendete Gerichte bleiben; jede eigene Änderung (Gericht X an Tag d auf Mahlzeit m) wird übernommen, soweit der neue Plan diese Mahlzeit an dem Tag hat (kleiner Appetit hat mehr Zwischenmahlzeiten); die Portionen richten sich nach dem neuen Plan. Gleiche Übertragung bei „Plan anpassen“ (Ernährung, Gewicht, Laktose) und beim Ändern der Vorlieben.
- **Einkaufsliste** aus dem aktuellen Plan, je Woche, nach Abteilungen, Packungen wie im PDF (`einkaufDaten`): Häkchen zum Abhaken, „Hab ich schon“ (Posten wandert nach „Hast du schon“, „doch kaufen“), „Als Text teilen“ (navigator.share, sonst Zwischenablage, sonst markiertes Textfeld). Geteilt wird, was noch zu kaufen ist.
- **Rezepte am Gericht:** „Rezept · N Minuten“ klappt auf: Zutaten für eine Portion (Mengen dieses Tages), nummerierte Schritte, Tipp; Umschalter „2 Portionen“ verdoppelt die Mengen. Für Frühstück und Hauptgerichte (Zwischenmahlzeiten haben keine Karte).
- **Druck:** „PDF fürs Handy“ und „PDF zum Drucken (A4)“ drucken den aktuellen Plan über die Druckfassung (gleiche Gestaltung wie die fertigen PDFs; im Druckfenster „Als PDF speichern“). Fürs Handy setzt das Skript die Klasse `ed-handy` und die Seitengröße 90 mm × Höhe des längsten Tages (gemessen mit den Druckregeln, mindestens 160 mm, wie `scripts/ernaehrungsplan-pdf.mjs`). Safari am iPhone kennt keine eigenen Seitengrößen; dafür bleiben die fertigen PDFs als Links darunter. Mit `?druck` (PDF-Erzeugung) baut das Skript nichts um.
- **Plan zurücksetzen:** zurück zum Grundplan mit den Vorlieben aus der Adresse (mit „Rückgängig“).

**URL-Zustand** (`?v=…&s=…`): `v` wie bisher (Vorlieben, der Link aus der Mail `/ernaehrungsplan/plan/{$plan}/?v={$vorlieben}` funktioniert unverändert). `s` enthält nur Abweichungen vom Grundplan, Punkt-getrennt, nur `[0-9a-z.]`: `x<gericht>` = ausgeblendet (z. B. `xh03`), `<tag><mahlzeit><gericht>[<faktortag>]` = Platz weicht ab, Tag 0 bis 13 als `0`–`9`, `a`–`d`, Mahlzeit `f` Frühstück, `v` Vormittag, `m` Mittag, `n` Nachmittag, `e` vor dem Abendessen, `a` Abend, `s` später am Abend, Faktortag nur, wenn die Mahlzeit mit der Portion eines anderen Tages verschoben wurde (z. B. `2mh014` = Tag 3 Mittag Hähnchen-Gemüse-Pfanne mit der Portion von Tag 5). Ungültige Teile werden ignoriert; stehen ausgeblendete Gerichte im Plan (etwa nach Änderungen am Rezeptpool), ersetzt die Seite sie. Die Adresse ändert sich nur nach einer Aktion (`history.replaceState`). Ändert sich der Rezeptpool, rechnet der Grundplan neu; gespeicherte Änderungen bleiben gültig, soweit die Gerichte noch passen.

**Browser-Speicher:** nur die Häkchen und „Hab ich schon“ der Einkaufsliste, `localStorage` unter `nds-einkauf-<plan>` (`{"1": {"skyr": "x", "haferflocken": "v"}}`), in try/catch; ohne Speicher gelten sie bis zum Neuladen. Datenschutz Abschnitt 4d nennt das („Änderungen an deinem Plan speichert nur dein Browser“).

**Plausible:** Ereignis „Plan interaktiv“ mit Property `aktion` = `verschieben`, `tauschen` (auch „Nicht mein Fall“ und Vorschlag), `appetit`, `einkauf` (Häkchen, Hab ich schon, Teilen) oder `pdf`; einmal je Aktionstyp und Seitenaufruf, ohne Planinhalte. Ziel in Plausible anlegen: Goal „Plan interaktiv“ (Custom event), Property `aktion` (Dominik).

**Testskript:** `npm run test:plan` (`scripts/plan-interaktiv-test.mjs`, Node 22.18 oder neuer, ohne Build, etwa 5 s). Für alle 56 Pläne, je ohne, mit einer und mit zwei Vorlieben: Grundzustand gleich dem Generator (Mahlzeiten, Mengen, Protein, „dazu“, Rechengrundlage, Druckfassung); jede angebotene Alternative hält Mahlzeit, Ernährungsform, Laktose, ±5 g ein, ist nicht ausgeblendet und nicht schon am Tag, Vorlieben werden nicht übergangen; nach jeder Aktion (Verschieben, Tauschen, Nicht mein Fall, Vorschlag, Appetitwechsel) stimmt das Protein jedes Tages mit einer unabhängigen Rechnung im Skript; `s` kodieren und dekodieren ergibt denselben Zustand. Nicht Teil von `check:all`; nach Änderungen an Rezeptpool, Generator oder `src/lib/plan-interaktiv/` laufen lassen.

## Prüfung im Build

`pruefePlaene()` läuft beim Bauen der Planseiten für alle 56 Grundpläne, jeden mit jeder einzelnen passenden Vorliebe, allen Paaren und Dreiern und allen Vorlieben zusammen (rund 18.600 Pläne, etwa 3 s). Liegt ein Tag außerhalb des Bereichs, wählt der Generator Zwischen- und Hauptmahlzeiten dieses Tages neu. Der Build bricht ab, wenn ein Tag außerhalb von Ziel − 5 g bis Ziel + 12 g liegt, ein Tag nicht drei Hauptmahlzeiten hat oder ein Gericht an zwei Tagen hintereinander steht.

## PDFs

- `npm run pdf:ernaehrungsplan` baut und druckt je Plan zwei PDFs (Grundplan ohne Vorlieben) und 18 Hinweis-PDFs `ep01` bis `ep18` nach `public/downloads/ernaehrungsplan/`:
  - `<plan>.pdf`: A4 zum Drucken, Ränder 14/14/16 mm, 22 bis 28 Seiten (Deckblatt, je Woche Überblick, Einkaufsliste und vier Tagesseiten, Rezepte zu zweit, Tauschen, Hinweise).
  - `<plan>-handy.pdf`: 90 mm breit, ein Tag pro Seite, alles einspaltig. Seitenhöhe 160 mm (9:16); passt der längste Tag eines Plans nicht darauf (kleiner Appetit mit bis zu sieben Mahlzeiten), wird die Seite dieses Plans so hoch wie nötig, in 5-mm-Schritten. Die Seite fragt `?druck=handy` ab (Klasse `ed-handy`).
  - Prüfung im Skript: Hat ein A4-PDF mehr Seiten als Blöcke (ein Block ist übergelaufen, z. B. eine Einkaufsliste über eine Seite), endet es mit Fehler.
  - Einzelne zum Prüfen: `npm run build && node scripts/ernaehrungsplan-pdf.mjs ek13 ep05`. Nach jeder Änderung an Daten, Vorlage, Packungen oder Quellen alle neu erzeugen und mit committen.
- Schrift im PDF: statische Schnitte aus Mona Sans (`scripts/fonts/nds-druck-*.woff2`, umbenannt wegen des Reserved Font Name „Mona“, Lizenz `scripts/fonts/OFL.txt`). Grund: Chromium bettet variable Schriften als Type-3-Glyphen ein; die PDFs wären fünfmal so groß. Die Druck-CSS nutzt nur die fünf vorhandenen Schnitte (Breite/Gewicht 100/400, 100/560, 112/540, 118/520, 125/480). Kästchen der Einkaufsliste sind eckig: abgerundete zeichnet Chromium als Kurven (rund 25 kB mehr je PDF).
- Die PDFs sind unter ihrer URL öffentlich erreichbar (wie die Checkliste), die Planseiten auch. Bewusst so: kein Login, keine Tokens. Beide sind noindex (PDFs per Header in `vercel.json`, Planseiten per Meta-Tag) und nicht in der Sitemap.

## Alte Pläne (bis 05.10.2026)

Mails vom 02. bis 05.10. verlinken `https://nachderspritze.de/downloads/ernaehrungsplan/ep01.pdf` bis `ep18.pdf`; das Feld `plan` dieser Abonnenten enthält `ep…`. Zuordnung (gleiche Ernährungsform und gleicher Appetit, nicht laktosefrei, Gewichtsstufe mit dem nächstliegenden Proteinziel): ep01 → ek01, ep02 → ek03, ep03 → ek07, ep04 → ek09, ep05 → ek11, ep06 → ek15, ep07 → ek33, ep08 → ek35, ep09 → ek39, ep10 → ek41, ep11 → ek43, ep12 → ek47, ep13 → ek49, ep14 → ek50, ep15 → ek52, ep16 → ek53, ep17 → ek54, ep18 → ek56.

- `/ernaehrungsplan/plan/ep01/` bis `ep18/` leiten auf den neuen Plan weiter (noindex).
- `ep01.pdf` bis `ep18.pdf` sind einseitige Hinweise mit Link auf den neuen Plan. Wer lieber direkt weiterleiten will: 18 Einträge `/downloads/ernaehrungsplan/epNN.pdf` → `/ernaehrungsplan/plan/ekNN/` in `vercel.json` (`redirects`, Dominik) und die Hinweis-PDFs löschen.

## Die 56 Pläne

| Plan | Ernährung | Laktosefrei | Appetit | Gewicht | Protein/Tag |
|---|---|---|---|---|---|
| ek01 | Mischkost | nein | klein | unter 70 kg | 75 g |
| ek02 | Mischkost | ja | klein | unter 70 kg | 75 g |
| ek03 | Mischkost | nein | klein | 70 bis 85 kg | 95 g |
| ek04 | Mischkost | ja | klein | 70 bis 85 kg | 95 g |
| ek05 | Mischkost | nein | klein | 85 bis 100 kg | 110 g |
| ek06 | Mischkost | ja | klein | 85 bis 100 kg | 110 g |
| ek07 | Mischkost | nein | klein | über 100 kg | 125 g |
| ek08 | Mischkost | ja | klein | über 100 kg | 125 g |
| ek09 | Mischkost | nein | normal | unter 70 kg | 75 g |
| ek10 | Mischkost | ja | normal | unter 70 kg | 75 g |
| ek11 | Mischkost | nein | normal | 70 bis 85 kg | 95 g |
| ek12 | Mischkost | ja | normal | 70 bis 85 kg | 95 g |
| ek13 | Mischkost | nein | normal | 85 bis 100 kg | 110 g |
| ek14 | Mischkost | ja | normal | 85 bis 100 kg | 110 g |
| ek15 | Mischkost | nein | normal | über 100 kg | 125 g |
| ek16 | Mischkost | ja | normal | über 100 kg | 125 g |
| ek17 | Pescetarisch | nein | klein | unter 70 kg | 75 g |
| ek18 | Pescetarisch | ja | klein | unter 70 kg | 75 g |
| ek19 | Pescetarisch | nein | klein | 70 bis 85 kg | 95 g |
| ek20 | Pescetarisch | ja | klein | 70 bis 85 kg | 95 g |
| ek21 | Pescetarisch | nein | klein | 85 bis 100 kg | 110 g |
| ek22 | Pescetarisch | ja | klein | 85 bis 100 kg | 110 g |
| ek23 | Pescetarisch | nein | klein | über 100 kg | 125 g |
| ek24 | Pescetarisch | ja | klein | über 100 kg | 125 g |
| ek25 | Pescetarisch | nein | normal | unter 70 kg | 75 g |
| ek26 | Pescetarisch | ja | normal | unter 70 kg | 75 g |
| ek27 | Pescetarisch | nein | normal | 70 bis 85 kg | 95 g |
| ek28 | Pescetarisch | ja | normal | 70 bis 85 kg | 95 g |
| ek29 | Pescetarisch | nein | normal | 85 bis 100 kg | 110 g |
| ek30 | Pescetarisch | ja | normal | 85 bis 100 kg | 110 g |
| ek31 | Pescetarisch | nein | normal | über 100 kg | 125 g |
| ek32 | Pescetarisch | ja | normal | über 100 kg | 125 g |
| ek33 | Vegetarisch | nein | klein | unter 70 kg | 75 g |
| ek34 | Vegetarisch | ja | klein | unter 70 kg | 75 g |
| ek35 | Vegetarisch | nein | klein | 70 bis 85 kg | 95 g |
| ek36 | Vegetarisch | ja | klein | 70 bis 85 kg | 95 g |
| ek37 | Vegetarisch | nein | klein | 85 bis 100 kg | 110 g |
| ek38 | Vegetarisch | ja | klein | 85 bis 100 kg | 110 g |
| ek39 | Vegetarisch | nein | klein | über 100 kg | 125 g |
| ek40 | Vegetarisch | ja | klein | über 100 kg | 125 g |
| ek41 | Vegetarisch | nein | normal | unter 70 kg | 75 g |
| ek42 | Vegetarisch | ja | normal | unter 70 kg | 75 g |
| ek43 | Vegetarisch | nein | normal | 70 bis 85 kg | 95 g |
| ek44 | Vegetarisch | ja | normal | 70 bis 85 kg | 95 g |
| ek45 | Vegetarisch | nein | normal | 85 bis 100 kg | 110 g |
| ek46 | Vegetarisch | ja | normal | 85 bis 100 kg | 110 g |
| ek47 | Vegetarisch | nein | normal | über 100 kg | 125 g |
| ek48 | Vegetarisch | ja | normal | über 100 kg | 125 g |
| ek49 | Vegan | ja | klein | unter 70 kg | 75 g |
| ek50 | Vegan | ja | klein | 70 bis 85 kg | 95 g |
| ek51 | Vegan | ja | klein | 85 bis 100 kg | 110 g |
| ek52 | Vegan | ja | klein | über 100 kg | 125 g |
| ek53 | Vegan | ja | normal | unter 70 kg | 75 g |
| ek54 | Vegan | ja | normal | 70 bis 85 kg | 95 g |
| ek55 | Vegan | ja | normal | 85 bis 100 kg | 110 g |
| ek56 | Vegan | ja | normal | über 100 kg | 125 g |

## Pflege

- Neues Gericht: in `ernaehrungsplan-rezepte.ts` hinten in der passenden Gruppe anhängen (nur Zutaten aus `zutaten`), Rezeptkarte in `ernaehrungsplan-karten.ts`, dann `npm run build` (Prüfung) und alle PDFs neu erzeugen. Neue Zutat: Proteinwert aus dem BLS, gerundet; sonst Herstellerangabe mit `quelle: 'hersteller'`.
- Neue Vorliebe: in `VORLIEBEN` (id.mjs) hinten anhängen, Text in `vorliebenText`, Zutaten mit `vorliebe` markieren.
- Keine Kalorienvorgaben, keine Dosierungen, keine Medikamentennamen, kein Arztbezug.
- Datenschutz: Abschnitt 4d in `datenschutz.astro`. Gespeichert werden Adresse, Plannummer, Vorlieben, Zeitpunkt und Herkunft, nicht das genaue Gewicht. Die Plannummer ist kein anonymes Kürzel: Sie steht für Ernährungsform, Gewichtsbereich, Appetit und Laktose. Deshalb ist die Rechtsgrundlage die ausdrückliche Einwilligung (Art. 6 Abs. 1 lit. a und Art. 9 Abs. 2 lit. a DSGVO), die das Formular mit einem eigenen Satz im Einwilligungs-Häkchen einholt. Die Planseite rechnet Vorlieben und Änderungen im Browser; gespeichert wird nur dort (Adresse, Häkchen der Einkaufsliste im localStorage), nichts bei uns.
- Kopplung Plan an Newsletter ist transparent beschrieben, und es gibt den Weg ohne Newsletter (Mail). Diese Alternative nicht entfernen; sie ist das Argument gegen das Kopplungsverbot (Art. 7 Abs. 4 DSGVO).
