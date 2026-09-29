import type { FaqItem } from '../components/Faq.astro';

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

export const landingFaq: FaqItem[] = [
  {
    q: 'Schmeckt das?',
    a: '<p>Geplant sind zwei Sorten Protein-Stick (Vanille und neutral); der Ballaststoff-Stick ist geschmacksneutral und löst sich in Wasser, Joghurt oder Suppe. Kreatin-Monohydrat ist geschmacklos. Bei der Vorbestellung fragen wir dich, ob du Molke oder eine pflanzliche Variante möchtest. Die erste Charge geht als Probierpaket an die ersten Vorbestellerinnen und Vorbesteller, bevor wir größer produzieren.</p>',
  },
  {
    q: 'Wann kommt das Set?',
    a: '<p>Wir produzieren die erste Charge, sobald 100 Vorbestellungen zusammen sind. Realistisch sind das 8 bis 12 Wochen ab Erreichen der Marke. Du bekommst als Erste Bescheid und entscheidest dann, ob du wirklich bestellst. Bis dahin zahlst du nichts.</p>',
  },
  {
    q: 'Was passiert mit meiner E-Mail-Adresse?',
    a: '<p>Sie landet in einer Warteliste bei Tally (Belgien, EU). Wir nutzen sie ausschließlich, um dich über das Set zu informieren: Produktionsstart, Preis, Bestellmöglichkeit. Kein Newsletter, kein Weitergeben. Löschung jederzeit per E-Mail an uns. Details in der <a href="/datenschutz/">Datenschutzerklärung</a>.</p>',
  },
  {
    q: 'Ist das ein Medikament?',
    a: '<p>Nein. Das Set besteht aus Lebensmitteln (Protein, Ballaststoffe, Kreatin-Monohydrat) und einem Ernährungs- und Trainingsprogramm. Es ersetzt weder die Abnehmspritze noch das Gespräch mit deiner Ärztin oder deinem Arzt.</p>',
  },
  {
    q: 'Kann ich das Set nehmen, während ich noch spritze?',
    a: '<p>Protein und Ballaststoffe sind normale Lebensmittelbestandteile und auch während der Therapie sinnvoll, denn gerade dann isst man wenig. Wegen der kleinen Portionen und möglicher Magen-Darm-Beschwerden unter der Spritze solltest du das Programm aber mit deiner Ärztin oder deinem Arzt abstimmen. Bei Nierenerkrankungen sprich vor Kreatin unbedingt mit deiner Ärztin.</p>',
  },
  {
    q: 'Ersetzt das Set die Spritze oder verhindert es den Jojo-Effekt?',
    a: '<p>Nein, und das behaupten wir auch nicht. Das Set liefert Protein (trägt zur Erhaltung von Muskelmasse bei), Kreatin (erhöht die körperliche Leistung bei Schnellkrafttraining) und Ballaststoffe, dazu ein Programm mit zwei Krafteinheiten pro Woche. Was die Forschung zu Protein, Krafttraining und Gewichtserhalt sagt, erklären wir mit Quellen im <a href="/wissen/">Wissensbereich</a>. Ob es bei dir funktioniert, hängt vor allem davon ab, ob du dranbleibst.</p>',
  },
  {
    q: 'Was kostet das, und was ist im Preis drin?',
    a: '<p>129 € für 12 Wochen (entspricht 43 € pro Monat) oder 49 € pro Monat. Enthalten: 84 Protein-Sticks, 84 Ballaststoff-Sticks, 84 Portionen Kreatin, das 12-Wochen-Programm mit Trainingsplänen, Rezepten und wöchentlichem Check-in per E-Mail. Versand innerhalb Deutschlands inklusive.</p>',
  },
  {
    q: 'Brauche ich ein Fitnessstudio?',
    a: '<p>Nein. Das Programm hat zwei Krafteinheiten pro Woche à etwa 30 Minuten, wahlweise zuhause mit Widerstandsbändern oder im Studio. Beide Varianten sind im Plan enthalten.</p>',
  },
];
