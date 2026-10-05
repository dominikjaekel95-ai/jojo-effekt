import type { FaqItem } from '../components/Faq.astro';
import { site } from './site';

/** FAQPage-Schema aus einer FAQ-Liste (HTML in den Antworten wird für Schema zu Text reduziert). */
export function faqJsonLd(items: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() },
    })),
  };
}

// Programm-FAQ der Startseite (seit 06.10.2026: Programm und Warteliste statt Set und Vorbestellung).
// Kein Arztbezug beim Programm, keine Wirkversprechen, keine Health Claims; Preis nur als Rahmen.
const mailText = site.waitlist.ownGroup
  ? 'Wir nutzen sie nur für die Warteliste: Start, Preis und Ablauf des Programms. Den Newsletter bekommst du nur, wenn du ihn zusätzlich ankreuzt.'
  : `Wir nutzen sie für die Warteliste (Start, Preis und Ablauf des Programms) und für den Newsletter, ${site.newsletter.cadence}. Beides nennt das Kästchen im Formular.`;

export const landingFaq: FaqItem[] = [
  {
    q: 'Was ist das Programm genau?',
    a: '<p>Zwölf Wochen Begleitung für die Zeit nach der Abnehmspritze: zwei Krafteinheiten pro Woche à 30 Minuten, zuhause mit Bändern oder im Studio, ein persönliches Proteinziel mit Rezepten für kleine Portionen, ein <a href="/werkzeuge/gewichtskorridor/">Gewichtskorridor</a> statt Kalorienzählen und ein Check-in pro Woche per E-Mail.</p>',
  },
  {
    q: 'Wann geht es los, und was kostet es?',
    a: `<p>Wir starten, sobald genug Menschen auf der Warteliste stehen. Das Basis-Programm ist geplant unter ${site.price.programUnder} € für alle zwölf Wochen. Wer auf der Liste steht, erfährt Termin und Preis zuerst und entscheidet dann. Bis dahin zahlst du nichts.</p>`,
  },
  {
    q: 'Brauche ich ein Fitnessstudio?',
    a: '<p>Nein. Jede Einheit gibt es für zuhause mit Widerstandsbändern und für das Studio. Für Einsteiger gemacht, kein Vorwissen nötig.</p>',
  },
  {
    q: 'Brauche ich Nahrungsergänzungsmittel?',
    a: '<p>Nein. Dein Proteinziel lässt sich mit normalen Lebensmitteln erreichen, das Programm zeigt wie. Wann ein Proteinpulver oder Kreatin praktisch sein kann, erklären wir mit Quellen im <a href="/wissen/supplements-nach-abnehmspritze/">Wissensbereich</a>.</p>',
  },
  {
    q: 'Gibt es ein Starterpaket?',
    a: '<p>Vielleicht. Wenn genug Interesse besteht, bieten wir das Programm zusätzlich mit einem Starterpaket aus Protein und Kreatin an. Auf der Warteliste kannst du ankreuzen, ob dich das interessiert. Das Programm funktioniert ohne.</p>',
  },
  {
    q: 'Ist das eine medizinische Beratung?',
    a: '<p>Nein. Das Programm ist Training, Ernährung und Gewohnheiten. Ob und wie du dein Medikament absetzt, besprichst du mit deiner Ärztin oder deinem Arzt.</p>',
  },
  {
    q: 'Kann ich anfangen, während ich noch spritze?',
    a: '<p>Krafttraining und genug Protein sind auch während der Therapie sinnvoll, gerade weil man dann wenig isst. Stimm das Programm aber mit deiner Ärztin oder deinem Arzt ab, besonders bei Magen-Darm-Beschwerden oder einer Nierenerkrankung.</p>',
  },
  {
    q: 'Verhindert das Programm den Jojo-Effekt?',
    a: '<p>Das kann kein Programm versprechen, und wir behaupten es nicht. Es ersetzt auch nicht die Spritze. Was die Forschung zu Krafttraining, Protein und Gewichtserhalt zeigt, steht mit Quellen im <a href="/wissen/jojo-effekt-abnehmspritze/">Artikel zum Jojo-Effekt</a>. Ob es bei dir funktioniert, hängt vor allem davon ab, ob du dranbleibst.</p>',
  },
  {
    q: 'Was passiert mit meiner E-Mail-Adresse?',
    a: `<p>Sie liegt bei unserem Versanddienst MailerLite (EU). ${mailText} Erst nach dem Klick auf den Link in der Bestätigungs-Mail bist du eingetragen. Abmelden geht jederzeit mit einem Klick, keine Weitergabe. Details in der <a href="/datenschutz/">Datenschutzerklärung</a>.</p>`,
  },
];
