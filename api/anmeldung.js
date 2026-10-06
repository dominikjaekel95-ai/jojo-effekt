/**
 * Anmeldungen aus den eigenen Formularen der Website (Vercel-Funktion, Web-API-Signatur): Warteliste für das
 * 12-Wochen-Programm (WaitlistForm, quelle=warteliste), Newsletter im Seitenkopf (NewsletterPanel, quelle=header) und
 * Checkliste (quelle=checkliste).
 *
 * Nimmt POST /api/anmeldung/ als Formular (application/x-www-form-urlencoded) oder JSON an und prüft E-Mail-Adresse,
 * Einwilligung (Feld `einwilligung` = "ja") und ein Honigtopf-Feld (`website` muss leer sein). Weitere Felder:
 *   quelle        warteliste | header | checkliste (Whitelist; alles andere zählt als header)
 *   newsletter    "ja" = Einwilligung in den Newsletter. Das Wartelisten-Formular schickt es mit, solange es keine eigene
 *                 Wartelisten-Gruppe gibt (dann nennt der Einwilligungstext Warteliste UND Newsletter), sonst als
 *                 freiwilliges Häkchen. Im Kopf-Formular ist die Einwilligung selbst die Newsletter-Einwilligung.
 *   starterpaket  "ja" = Interesse an einem Starterpaket mit Protein und Kreatin (nur Warteliste); MailerLite-Feld
 *                 `starterpaket`.
 *
 * Gruppen (MailerLite, Status `unconfirmed`, Double-Opt-in verschickt MailerLite):
 *   warteliste  MAILERLITE_GROUP_WARTELISTE, falls gesetzt, plus Newsletter nur mit newsletter=ja. Ohne eigene Gruppe:
 *               Newsletter-Gruppe mit Feld quelle=warteliste (nur mit newsletter=ja, sonst Fehler „technik“).
 *   header      Newsletter-Gruppe (wie bisher).
 *   checkliste  MAILERLITE_GROUP_CHECKLISTE, falls gesetzt, plus Newsletter nur mit newsletter=ja.
 *
 * Weiterleitung (303): warteliste → /danke/, checkliste → /checkliste/danke/, header → /newsletter/danke/; Fehler mit
 * ?fehler=eingabe bzw. ?fehler=technik auf dieselbe Seite (die Checkliste bietet das PDF auch im Fehlerfall an).
 * Es werden keine E-Mail-Adressen geloggt. Umgebungsvariablen wie in api/newsletter.js, dazu optional
 * MAILERLITE_GROUP_WARTELISTE (ID der Gruppe „Warteliste“). Ist sie gesetzt, in src/data/site.ts
 * `waitlist.ownGroup` auf true stellen, damit der Einwilligungstext passt.
 */
import { subscribe, groupsFor } from './newsletter.js';

const redirect = (to) => new Response(null, { status: 303, headers: { Location: to } });

/** Erlaubte Werte für `quelle` und ihre Zielseiten */
const ZIEL = {
  warteliste: { ok: '/danke/', fehler: '/danke/' },
  header: { ok: '/newsletter/danke/', fehler: '/newsletter/danke/' },
  checkliste: { ok: '/checkliste/danke/', fehler: '/checkliste/danke/' },
};

export function parseQuelle(value) {
  const q = String(value || '').trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(ZIEL, q) ? q : 'header';
}

/** Gruppen je Quelle. Leere Liste = Konfiguration passt nicht zur Einwilligung, nichts anlegen. */
export function groupsForSignup(quelle, newsletter) {
  const nl = groupsFor('');
  if (quelle === 'header') return nl;
  const own = quelle === 'warteliste' ? process.env.MAILERLITE_GROUP_WARTELISTE || '' : process.env.MAILERLITE_GROUP_CHECKLISTE || '';
  const groups = own ? [own] : [];
  if (newsletter) groups.push(...nl);
  return groups;
}

export async function POST(request) {
  const type = request.headers.get('content-type') || '';
  let body = {};
  if (type.includes('application/json')) {
    body = await request.json().catch(() => ({}));
  } else {
    const params = new URLSearchParams(await request.text());
    body = Object.fromEntries(params.entries());
  }
  const email = String(body.email || '').trim().toLowerCase();
  const quelle = parseQuelle(body.quelle);
  const ziel = ZIEL[quelle];
  const newsletter = body.newsletter === 'ja';
  const starterpaket = quelle === 'warteliste' && body.starterpaket === 'ja';

  if (body.website) return redirect(ziel.ok);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.einwilligung !== 'ja') return redirect(`${ziel.fehler}?fehler=eingabe`);

  const groups = groupsForSignup(quelle, newsletter);
  if (!process.env.MAILERLITE_API_KEY || groups.length === 0) {
    console.error(`anmeldung: ${quelle}: MAILERLITE_API_KEY oder Gruppe fehlt (MAILERLITE_GROUP_NEWSLETTER bzw. MAILERLITE_GROUP_WARTELISTE)`);
    return redirect(`${ziel.fehler}?fehler=technik`);
  }
  try {
    const fields = starterpaket ? { starterpaket: 'ja' } : {};
    const r = await subscribe({ email, source: quelle, fields }, groups);
    console.log(`anmeldung: ${quelle}${starterpaket ? ' +starterpaket' : ''} → ${r.outcome} (${r.status})`);
    return redirect(r.outcome === 'fehler' ? `${ziel.fehler}?fehler=technik` : ziel.ok);
  } catch (err) {
    console.error('anmeldung: MailerLite nicht erreichbar', err instanceof Error ? err.message : err);
    return redirect(`${ziel.fehler}?fehler=technik`);
  }
}

export function GET() {
  return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
}
