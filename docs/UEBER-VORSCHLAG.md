# Über diese Seite: Textvorschlag zur Freigabe

**Umgesetzt am 6. Oktober 2026** (von Dominik freigegeben, H1 Variante A, Meta-Description wie vorgeschlagen) mit drei
Änderungen: (a) der Arztsatz steht am Ende von „Keine Medikamentenberatung“ statt hinter Programm und Warteliste; (b) statt
„Angaben zu Protein und Kreatin beim Starterpaket …“ steht „Gesundheitsbezogene Angaben zu Lebensmitteln, etwa bei
Partnerlinks, stehen hier nur im EU-zugelassenen Wortlaut.“; (c) Idee 6 als Satz zum Datenschutz. Maßgeblich ist jetzt
`src/pages/ueber.astro`; dieses Dokument bleibt als Begründung.

Ursprünglicher Stand: 6. Oktober 2026, Redesign „Kalk“ (Stufe 2D). Die Seite `/ueber/` hatte die neue Gestaltung, der Text
dort war unverändert. Dieser Vorschlag sollte ihn erst ersetzen, wenn Dominik ihn freigibt.

Was sich gegenüber dem jetzigen Text ändert und warum:

- **Arztsatz:** Statt „einigen studierten Medizinern“ und „Die Mediziner im Team beraten uns …“ steht nur noch der
  abgestimmte Satz, wörtlich: „Bei medizinischen Fragen berät uns ein Arzt. Die Inhalte bleiben allgemeine Information und
  ersetzen keine ärztliche Beratung.“ (Briefing Punkt 6: Ärzte nur anonym und nur mit genau diesem Satz.)
- **Programm statt Set:** „Nur zugelassene Angaben zum Set“ und „Wenn das Set produziert wird …“ passen nicht mehr zum
  Angebot. Das Programm ist ein Trainings- und Ernährungsprogramm; EU-Angaben betreffen nur noch Starterpaket und
  Partnerlinks.
- **Absender:** „Ein Projekt von Dominik Jäkel, Berlin“ wie im Footer.
- **Finanzierung offen benennen:** Es gibt gekennzeichnete Partnerlinks (Amazon, Datenschutz Abschnitt 9). „Kein Hersteller
  finanziert diese Seite“ bleibt richtig, die Partnerlinks gehören der Ehrlichkeit halber daneben.
- **Ton:** ruhiger, weniger Gründergeschichte, keine Pointe über das Marketing.

Die Meta-Description (`description` in `src/pages/ueber.astro`) nennt das Longevity-Projekt. Wenn der neue Text kommt,
sollte sie mitgehen; Vorschlag unten. Die H1 „Ein Prototyp, öffentlich getestet“ kann bleiben (Variante A) oder wechseln
(Variante B).

---

## Vorschlag

**H1, Variante A (bleibt):** Ein Prototyp, öffentlich getestet

**H1, Variante B:** Warum es diese Seite gibt

**Meta-Description (≤ 165 Zeichen):** Ein Projekt von Dominik Jäkel, Berlin: Wissen zur Zeit nach der Abnehmspritze, mit Quellen. Wie die Seite arbeitet, wie sie sich finanziert, was sie nicht behauptet.

### Einleitung

Nach der Spritze ist ein Projekt von Dominik Jäkel aus Berlin. Es beginnt mit einer Frage, die viele erst nach der letzten
Dosis stellen: Wie halte ich, was ich erreicht habe? Die Antworten stehen in Studien, verstreut über Fachzeitschriften,
Fachinformationen und Nachrichten. Diese Seite ordnet sie, mit Quelle zu jeder Zahl.

Daraus entsteht ein 12-Wochen-Programm für die Zeit nach der Abnehmspritze: zwei Krafteinheiten pro Woche, ein
Proteinziel, ein Plan für die Waage. Wer sich auf die Warteliste setzt, erfährt Start und Preis zuerst.

Bei medizinischen Fragen berät uns ein Arzt. Die Inhalte bleiben allgemeine Information und ersetzen keine ärztliche Beratung.

### Wie diese Website arbeitet

- **Jede Zahl hat eine Quelle.** Zitiert werden Originalstudien (STEP, SURMOUNT, S-LiTE, Meta-Analysen), keine
  Pressemeldungen über Studien. Die Quellen stehen mit Link unter jedem Artikel; alle Absetz-Studien sammelt der
  Studien-Tracker.
- **Noch keine fachliche Gegenprüfung.** Die Artikel sind bisher nicht von einer Ernährungswissenschaftlerin oder einem
  Ernährungswissenschaftler geprüft. Bis dahin steht nichts auf der Seite, was nicht in der zitierten Quelle steht.
  *(Solange `site.reviewer` null ist; sonst wie bisher die Zeile zur fachlichen Prüfung.)*
- **Keine Medikamentenberatung.** Ob und wie jemand ein Medikament absetzt, ist Sache der behandelnden Ärztin oder des
  Arztes. Diese Seite gibt keine Dosierungen und keine Absetz-Anleitungen.
- **Was wir nicht versprechen.** Das Programm ersetzt keine Therapie und verhindert den Jojo-Effekt nicht. Angaben zu
  Protein und Kreatin beim Starterpaket und bei Partnerlinks entsprechen den in der EU zugelassenen gesundheitsbezogenen
  Angaben.
- **Wie sich die Seite finanziert.** Kein Hersteller von Medikamenten oder Nahrungsergänzungen finanziert diese Seite.
  Geplant ist das 12-Wochen-Programm; einige Links zu Produkten sind Partnerlinks und als Werbung gekennzeichnet.
- **Aktuell.** Erscheinen neue Studien, werden die Artikel aktualisiert und das Datum vermerkt. Fehler korrigieren wir,
  sobald jemand sie meldet.

### Wer schreibt

**Dominik Jäkel**, Berlin. Studium am Hasso-Plattner-Institut, arbeitet seit Jahren im Marketing. Beantwortet E-Mails
persönlich.

### Kontakt

Fragen, Kritik, Korrekturen: dominik@nachderspritze.de. Anschrift im Impressum.

---

## Weitere Ideen für die Seite (zur Auswahl)

1. **Datum „Stand“** oben auf der Seite, wie bei Marktradar und Studien-Tracker. Zeigt, dass die Seite gepflegt wird.
2. **Kurzer Abschnitt „Korrekturen“** mit den letzten zwei, drei korrigierten Fehlern und Datum. Stärkt Vertrauen (E-E-A-T)
   mehr als jede Selbstbeschreibung.
3. **Methodik verlinken:** ein Satz, wie Quellen ausgewählt werden (Originalstudie vor Übersichtsarbeit vor Fachinformation,
   keine Pressemeldungen), mit Link auf den Studien-Tracker und das Glossar.
4. **`sameAs` im Person- und Organization-Schema** (`site.sameAs`), sobald ein öffentliches Profil existiert, z. B. LinkedIn.
   Erhöht die Zuordnung des Namens in der Suche.
5. **Kontaktknopf „Schreib uns“** wie im Kopf der Seite, statt nur der Adresse im Text.
6. **Ein Satz zum Datenschutz** („keine Cookies, keine Weitergabe“) mit Link; viele lesen die Über-Seite, bevor sie sich
   eintragen.
7. **Interne Links** von der Über-Seite zu den drei wichtigsten Einstiegen (Abnehmspritze absetzen, Checkliste,
   Gewichtskorridor), damit die Seite nicht in einer Sackgasse endet.
8. **Kein Foto**, wie entschieden; die Seite trägt sich über Text und Haltung.
