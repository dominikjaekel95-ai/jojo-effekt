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
  description:
    'Das 12-Wochen-Set für die Zeit nach der Abnehmspritze: Protein, Ballaststoffe, Kreatin und ein Programm mit zwei Krafteinheiten pro Woche. Jetzt vorbestellen – ohne Zahlung.',

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

  // Angebot
  price: {
    set: 129,
    perMonth: 49,
    setMonths: 3,
    setPerMonth: 43,
    injectionMin: 170,
    injectionMax: 490,
  },
  preorderGoal: 100,

  // Design-Variante (a Praxis, b Magazin, c Kraft, d Ruhe) – siehe src/styles/global.css
  theme: import.meta.env.PUBLIC_THEME ?? 'd1',

  // Externe Dienste (aus .env; leer = Platzhalter/aus)
  tallyFormId: import.meta.env.PUBLIC_TALLY_FORM_ID || 'b5bO9o',
  // Erfahrungsformular „Deine Erfahrung nach der Abnehmspritze“ (Tally). `live` erst auf true setzen, wenn das
  // Formular in Tally veröffentlicht ist; vorher zeigt /erfahrungen/ nur die Regeln und die E-Mail-Adresse.
  experienceForm: { id: 'ODOJWR', live: false },
  // Plausible-Site-Skript-ID (Plausible → Site → Settings → Site installation, Teil hinter /js/ ohne .js). Leerstring = kein Tracking.
  plausibleScriptId: import.meta.env.PUBLIC_PLAUSIBLE_SCRIPT_ID ?? 'pa-kXdw31zjWlqdlJXD8QACc',

  // Pflichtsatz, der auf jeder Seite mit Produktbezug prominent steht
  doctorSentence:
    'Ob und wie du dein Medikament absetzt, besprichst du mit deiner Ärztin oder deinem Arzt.',
} as const;

export const nav = [
  { href: '/#set', label: 'Das Set' },
  { href: '/#preis', label: 'Preis' },
  { href: '/wissen/', label: 'Wissen' },
  { href: '/marktradar/', label: 'Marktradar' },
  { href: '/#faq', label: 'FAQ' },
] as const;
