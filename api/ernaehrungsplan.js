/**
 * Ernährungsplan anfordern (Vercel-Funktion, Web-API-Signatur). Formular: src/pages/werkzeuge/ernaehrungsplan/index.astro.
 *
 * Nimmt POST /api/ernaehrungsplan/ als Formular (application/x-www-form-urlencoded) oder JSON an:
 *   ernaehrung (mischkost|vegetarisch|vegan), appetit (klein|normal), gewicht (kg, 35–250), email,
 *   eignung = "ja" (Ausschlusskriterien bestätigt), einwilligung = "ja" (Plan plus Newsletter), website (Honigtopf, leer).
 * Ablauf:
 *  1. Antworten → Plan-ID (ep01 bis ep18) über src/data/ernaehrungsplan-id.mjs. Das Gewicht selbst wird nicht gespeichert.
 *  2. Neue Adresse: bei MailerLite mit Status `unconfirmed` in den Gruppen „Newsletter“ und „Ernährungsplan“ anlegen,
 *     Felder `plan` und `quelle` = "ernaehrungsplan". MailerLite schickt die Bestätigungs-Mail (Double-Opt-in); erst nach
 *     dem Klick ist die Adresse aktiv, und die Automation „joins group Ernährungsplan“ verschickt den Link
 *     https://nachderspritze.de/downloads/ernaehrungsplan/{$plan}.pdf.
 *  3. Bereits aktive oder unbestätigte Adresse: Feld `plan` aktualisieren, Gruppe „Ernährungsplan“ entfernen und neu
 *     zuweisen, damit die Automation erneut auslöst (in MailerLite muss „erneut durchlaufen“ erlaubt sein), Gruppe
 *     „Newsletter“ hinzufügen. Abgemeldete Adressen bleiben abgemeldet (nichts wird reaktiviert).
 * Antwort: Weiterleitung (303) auf /werkzeuge/ernaehrungsplan/danke/, bei Eingabefehlern ?fehler=eingabe, bei technischen
 * Fehlern ?fehler=technik. Es werden keine E-Mail-Adressen und keine Antworten geloggt, nur Plan-ID und Ergebnis.
 *
 * Umgebungsvariablen (Vercel, nie ins Repo): MAILERLITE_API_KEY, MAILERLITE_GROUP_NEWSLETTER (wie api/newsletter.js) und
 *   MAILERLITE_GROUP_ERNAEHRUNGSPLAN  Pflicht. ID der Gruppe „Ernährungsplan“. Fehlt sie, landet jede Anfrage bei ?fehler=technik.
 * Einrichtung und Test: docs/ERNAEHRUNGSPLAN.md.
 */
import { gewichtsstufe, planId } from '../src/data/ernaehrungsplan-id.mjs';

const MAILERLITE = 'https://connect.mailerlite.com/api';
const DANKE = '/werkzeuge/ernaehrungsplan/danke/';

const redirect = (to) => new Response(null, { status: 303, headers: { Location: to } });

async function mailerlite(path, init = {}) {
  return fetch(`${MAILERLITE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init.headers || {}),
    },
  });
}

/** Formular oder JSON lesen. */
async function lesen(request) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) return request.json().catch(() => ({}));
  return Object.fromEntries(new URLSearchParams(await request.text()));
}

/** Adresse anlegen oder aktualisieren. Gibt { outcome, status } fürs Log zurück. */
export async function anfordern({ email, plan }, { newsletter, ernaehrungsplan }) {
  const lookup = await mailerlite(`/subscribers/${encodeURIComponent(email)}`);
  if (lookup.status === 200) {
    const { data } = await lookup.json();
    if (data.status !== 'active' && data.status !== 'unconfirmed') return { outcome: 'uebersprungen', status: data.status };
    const update = await mailerlite(`/subscribers/${data.id}`, { method: 'PUT', body: JSON.stringify({ fields: { plan } }) });
    if (!update.ok) return { outcome: 'fehler', status: update.status };
    await mailerlite(`/subscribers/${data.id}/groups/${ernaehrungsplan}`, { method: 'DELETE' });
    for (const groupId of [newsletter, ernaehrungsplan]) {
      const add = await mailerlite(`/subscribers/${data.id}/groups/${groupId}`, { method: 'POST' });
      if (!add.ok) return { outcome: 'fehler', status: add.status };
    }
    return { outcome: 'aktualisiert', status: 200 };
  }
  if (lookup.status !== 404) return { outcome: 'fehler', status: lookup.status };

  const body = { email, status: 'unconfirmed', groups: [newsletter, ernaehrungsplan], fields: { plan, quelle: 'ernaehrungsplan' } };
  let create = await mailerlite('/subscribers', { method: 'POST', body: JSON.stringify(body) });
  if (create.status === 422) {
    // Feld `quelle` fehlt im Konto: ohne `quelle` erneut. Fehlt `plan`, scheitert auch das, und das ist gewollt (ohne Feld kein Link).
    body.fields = { plan };
    create = await mailerlite('/subscribers', { method: 'POST', body: JSON.stringify(body) });
  }
  return { outcome: create.ok ? 'angelegt' : 'fehler', status: create.status };
}

export async function POST(request) {
  const f = await lesen(request);
  if (f.website) return redirect(DANKE);
  const email = String(f.email || '').trim().toLowerCase();
  const plan = planId(String(f.ernaehrung || ''), String(f.appetit || ''), gewichtsstufe(f.gewicht ?? '') || '');
  if (!plan || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || f.eignung !== 'ja' || f.einwilligung !== 'ja') return redirect(`${DANKE}?fehler=eingabe`);

  const newsletter = process.env.MAILERLITE_GROUP_NEWSLETTER || process.env.MAILERLITE_GROUP_ID || '';
  const ernaehrungsplan = process.env.MAILERLITE_GROUP_ERNAEHRUNGSPLAN || '';
  if (!process.env.MAILERLITE_API_KEY || !newsletter || !ernaehrungsplan) {
    console.error('ernaehrungsplan: MAILERLITE_API_KEY, MAILERLITE_GROUP_NEWSLETTER oder MAILERLITE_GROUP_ERNAEHRUNGSPLAN fehlt');
    return redirect(`${DANKE}?fehler=technik`);
  }
  try {
    const r = await anfordern({ email, plan }, { newsletter, ernaehrungsplan });
    console.log(`ernaehrungsplan: ${plan} → ${r.outcome} (${r.status})`);
    return redirect(r.outcome === 'fehler' ? `${DANKE}?fehler=technik` : DANKE);
  } catch (err) {
    console.error('ernaehrungsplan: MailerLite nicht erreichbar', err instanceof Error ? err.message : err);
    return redirect(`${DANKE}?fehler=technik`);
  }
}

export function GET() {
  return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
}
