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

  // Betreiber (Impressum, Footer, Schema.org)
  owner: {
    name: 'Dominik Jäkel',
    city: 'Berlin',
    // Platzhalter – vor dem Launch ausfüllen (§ 5 DDG: ladungsfähige Anschrift + E-Mail sind Pflicht)
    street: '[Straße Hausnummer]',
    zip: '[PLZ]',
    email: 'dominik.jaekel95@gmail.com',
  },

  // Fachliche Prüfung (E-E-A-T). Name/Qualifikation liefert Michi.
  reviewer: {
    name: '[Vorname Nachname]',
    title: '[Qualifikation, z. B. Ernährungswissenschaftler M.Sc.]',
    short: 'Michi',
  },

  // Angebot
  price: {
    set: 129,
    perMonth: 49,
    setMonths: 3,
    setPerMonth: 43,
    injectionMin: 170,
    injectionMax: 280,
  },
  preorderGoal: 100,

  // Externe Dienste (aus .env; leer = Platzhalter/aus)
  tallyFormId: import.meta.env.PUBLIC_TALLY_FORM_ID ?? '',
  plausibleDomain: import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN ?? '',

  // Pflichtsatz, der auf jeder Seite mit Produktbezug prominent steht
  doctorSentence:
    'Ob und wie du dein Medikament absetzt, besprichst du mit deiner Ärztin oder deinem Arzt.',
} as const;

export const nav = [
  { href: '/#set', label: 'Das Set' },
  { href: '/#preis', label: 'Preis' },
  { href: '/wissen/', label: 'Wissen' },
  { href: '/#faq', label: 'FAQ' },
] as const;
