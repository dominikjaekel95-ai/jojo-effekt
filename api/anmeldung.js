/**
 * Newsletter-Anmeldung aus dem Formular im Seitenkopf (Vercel-Funktion, Web-API-Signatur).
 *
 * Nimmt POST /api/anmeldung/ als Formular (application/x-www-form-urlencoded) oder JSON an, prüft E-Mail-Adresse,
 * Einwilligung (Feld `einwilligung` = "ja") und ein Honigtopf-Feld (`website` muss leer sein), und legt die Adresse über
 * dieselbe Logik wie der Tally-Webhook bei MailerLite an (Status `unconfirmed`, Gruppe Newsletter, Feld `quelle` =
 * "header"). Die Bestätigungs-Mail verschickt MailerLite (Double-Opt-in). Antwort ist eine Weiterleitung auf
 * /newsletter/danke/, bei Eingabefehlern mit ?fehler=eingabe, bei technischen Fehlern mit ?fehler=technik.
 * Es werden keine E-Mail-Adressen geloggt. Umgebungsvariablen wie in api/newsletter.js.
 */
import { subscribe, groupsFor } from './newsletter.js';

const redirect = (to) => new Response(null, { status: 303, headers: { Location: to } });

export async function POST(request) {
  const type = request.headers.get('content-type') || '';
  let email = '';
  let einwilligung = '';
  let honigtopf = '';
  if (type.includes('application/json')) {
    const body = await request.json().catch(() => ({}));
    email = body.email;
    einwilligung = body.einwilligung;
    honigtopf = body.website;
  } else {
    const params = new URLSearchParams(await request.text());
    email = params.get('email');
    einwilligung = params.get('einwilligung');
    honigtopf = params.get('website');
  }
  email = String(email || '').trim().toLowerCase();
  if (honigtopf) return redirect('/newsletter/danke/');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || einwilligung !== 'ja') return redirect('/newsletter/danke/?fehler=eingabe');

  const groups = groupsFor('');
  if (!process.env.MAILERLITE_API_KEY || groups.length === 0) {
    console.error('anmeldung: MAILERLITE_API_KEY oder MAILERLITE_GROUP_NEWSLETTER fehlt');
    return redirect('/newsletter/danke/?fehler=technik');
  }
  try {
    const r = await subscribe({ email, source: 'header' }, groups);
    console.log(`anmeldung: header → ${r.outcome} (${r.status})`);
    return redirect(r.outcome === 'fehler' ? '/newsletter/danke/?fehler=technik' : '/newsletter/danke/');
  } catch (err) {
    console.error('anmeldung: MailerLite nicht erreichbar', err instanceof Error ? err.message : err);
    return redirect('/newsletter/danke/?fehler=technik');
  }
}

export function GET() {
  return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
}
