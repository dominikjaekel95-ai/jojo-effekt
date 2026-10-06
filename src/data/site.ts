/**
 * Zentrale Site-Konfiguration. Alles, was auf mehreren Seiten auftaucht, steht hier.
 * Platzhalter in eckigen Klammern vor dem Launch ersetzen (siehe README → Checkliste).
 */
export const site = {
  name: 'Nach der Spritze',
  claim: 'Muskeln behalten, Gewicht halten.',
  url: import.meta.env.SITE ?? 'https://nachderspritze.de',
  locale: 'de_DE',
  lang: 'de',
  // Startseiten-Description (≤ 165 Zeichen). Seit 06.10.2026 Programm statt Set: Angebot geändert.
  description:
    'Das 12-Wochen-Programm für die Zeit nach der Abnehmspritze: Krafttraining, genug Protein, ein Plan für die Waage. Jetzt kostenlos auf die Warteliste.',

  // Allgemeine Kontaktadresse (Impressum, Datenschutz, Organization-Schema). Weiterleitung über ImprovMX.
  email: 'hallo@nachderspritze.de',

  // Betreiber (Impressum, Footer, Schema.org). owner.email ist die persönliche Adresse (Über uns, Tracker, Glossar, Person-Schema).
  owner: {
    name: 'Dominik Jäkel',
    city: 'Berlin',
    // Platzhalter – vor dem Launch ausfüllen (§ 5 DDG: ladungsfähige Anschrift + E-Mail sind Pflicht)
    street: 'Stresemannstr. 76',
    zip: '10963',
    email: 'dominik@nachderspritze.de',
  },

  // Fachliche Prüfung (E-E-A-T). Solange null, zeigt die Seite ehrlich „noch nicht fachlich gegengeprüft“.
  // Sobald eine Ernährungswissenschaftlerin / ein Ernährungswissenschaftler prüft: { name, title, url? } eintragen.
  reviewer: null as null | { name: string; title: string; url?: string },

  // Öffentliche Profile für das Organization-Schema (sameAs), z. B. LinkedIn. Leer lassen, bis vorhanden.
  sameAs: [] as string[],

  // Angebot (seit 06.10.2026): 12-Wochen-Programm, Warteliste statt Vorbestellung. Preis nur als Rahmen nennen
  // („Basis-Programm geplant unter 129 €“), keine Stufen ausformulieren, kein Vergleich mit Spritzenkosten.
  price: {
    programUnder: 129,
  },

  // Warteliste: Formular WaitlistForm → api/anmeldung.js (quelle=warteliste) → MailerLite mit Double-Opt-in.
  // ownGroup: true seit 06.10.2026 (Gruppe „Warteliste“, Env MAILERLITE_GROUP_WARTELISTE in Vercel gesetzt): Die
  // Einwilligung gilt nur der Warteliste, der Newsletter ist ein freiwilliges Häkchen. Fehlt die Variable (z. B. in einer
  // Preview), lehnt api/anmeldung.js die Anmeldung ab (?fehler=konfiguration), statt sie in den Newsletter zu legen.
  // false nur, falls die Gruppe wegfällt: Dann nennt die Einwilligung Warteliste UND Newsletter (liste=gemeinsam).
  waitlist: { ownGroup: true },
  // Erfahrungsformular „Deine Erfahrung nach der Abnehmspritze“ (Tally). `live` erst auf true setzen, wenn das
  // Formular in Tally veröffentlicht ist; vorher zeigt /erfahrungen/ nur die Regeln und die E-Mail-Adresse.
  experienceForm: { id: 'ODOJWR', live: true },
  // Checkliste „Die ersten 8 Wochen nach der letzten Dosis“: seit 06.10.2026 kein Tally mehr, sondern das eigene Formular
  // ChecklisteForm → api/anmeldung.js (quelle=checkliste) → MailerLite mit Double-Opt-in. `live` steuert nur, ob /checkliste/
  // das Formular zeigt (sonst steht dort der Weg per E-Mail) und ob der Datenschutz-Abschnitt 4b erscheint.
  checklistForm: { live: true },
  // Newsletter: Das optionale Kästchen „Newsletter“ steht im Tally-Erfahrungsformular (Übergabe per Webhook an api/newsletter.js)
  // und in den eigenen Formularen, die an api/anmeldung.js bzw. api/ernaehrungsplan.js posten: ChecklisteForm (freiwilliges
  // Häkchen), WaitlistForm (freiwilliges Zusatz-Häkchen, solange waitlist.ownGroup true ist) und das Formular des
  // Ernährungsplans (Einwilligung „Plan plus Newsletter“). Ein eigenes Newsletter-Formular im Kopf gibt es seit 06.10.2026
  // nicht mehr; dort steht nur „Schreib uns“. Versand über MailerLite mit Double-Opt-in (docs/NEWSLETTER.md,
  // docs/NEWSLETTER-SETUP.md). `provider` auf null setzen, falls der Versand pausiert; Datenschutz und Danke-Seiten folgen.
  newsletter: {
    provider: {
      name: 'MailerLite',
      address: 'MailerLite Limited, 88 Harcourt Street, Dublin 2, D02 DK18, Irland',
      url: 'https://www.mailerlite.com/legal/privacy-policy',
    } as null | { name: string; address: string; url: string },
    cadence: 'etwa alle zwei Wochen',
  },
  // Plausible-Site-Skript-ID (Plausible → Site → Settings → Site installation, Teil hinter /js/ ohne .js). Leerstring = kein Tracking.
  plausibleScriptId: import.meta.env.PUBLIC_PLAUSIBLE_SCRIPT_ID ?? 'pa-kXdw31zjWlqdlJXD8QACc',

  // Pflichtsatz, der auf jeder Seite mit Produktbezug prominent steht
  doctorSentence:
    'Ob und wie du dein Medikament absetzt, besprichst du mit deiner Ärztin oder deinem Arzt.',
  // Einzige erlaubte Formulierung zu Ärzten, wörtlich (CLAIMS.md, Abschnitt H; rechtlich abgestimmt 06.10.2026):
  // anonym, nur Über-Seite, Artikelfuß, Footer. Nie beim Programm, beim Starterpaket oder in Werbung.
  // Hebt die Regel „kein fachlich geprüft“ nicht auf.
  medicalTeamSentence:
    'Bei medizinischen Fragen berät uns ein Arzt. Die Inhalte bleiben allgemeine Information und ersetzen keine ärztliche Beratung.',
} as const;

export const nav = [
  { href: '/#programm', label: 'Programm' },
  { href: '/#kurve', label: 'Warum' },
  { href: '/wissen/', label: 'Wissen' },
  { href: '/werkzeuge/', label: 'Werkzeuge' },
  { href: '/#faq', label: 'FAQ' },
] as const;
