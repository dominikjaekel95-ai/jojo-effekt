/**
 * Ernährungsplan anfordern (Vercel-Funktion, Web-API-Signatur). Formular: src/pages/ernaehrungsplan/index.astro.
 *
 * Nimmt POST /api/ernaehrungsplan/ als Formular (application/x-www-form-urlencoded) oder JSON an:
 *   ernaehrung (mischkost|pescetarisch|vegetarisch|vegan), laktosefrei ("ja" oder leer; vegan immer laktosefrei),
 *   appetit (klein|normal), gewicht (kg, 35–250), v (mehrfach, Vorlieben wie "lachs") oder vorlieben ("lachs,quark"),
 *   email, eignung = "ja" (Ausschlusskriterien bestätigt), einwilligung = "ja" (Plan plus Newsletter), website (Honigtopf, leer).
 * Ablauf:
 *  1. Antworten → Plan-ID (ek01 bis ek56) und bereinigte Vorlieben über src/data/ernaehrungsplan-id.mjs.
 *     Das Gewicht selbst wird nicht gespeichert, nur die Plan-ID.
 *  2. Neue Adresse: bei MailerLite mit Status `unconfirmed` in den Gruppen „Newsletter“ und „Ernährungsplan“ anlegen,
 *     Felder `plan`, `vorlieben` und `quelle` = "ernaehrungsplan". MailerLite schickt die Bestätigungs-Mail
 *     (Double-Opt-in); erst nach dem Klick ist die Adresse aktiv, und die Automation „joins group Ernährungsplan“
 *     verschickt den Link https://nachderspritze.de/ernaehrungsplan/plan/{$plan}/?v={$vorlieben} (und das PDF).
 *  3. Bereits aktive oder unbestätigte Adresse: Felder `plan` und `vorlieben` aktualisieren, Gruppe „Ernährungsplan“
 *     entfernen und neu zuweisen, Gruppe „Newsletter“ hinzufügen. Abgemeldete Adressen bleiben abgemeldet.
 *  Fehlt ein Feld im MailerLite-Konto (422), versucht die Funktion es ohne `quelle`, dann ohne `vorlieben` (mit und ohne
 *  `quelle`); ohne `plan` scheitert es, und das ist gewollt (ohne Feld kein Link).
 * Antwort: Weiterleitung (303) auf /ernaehrungsplan/danke/, bei Eingabefehlern ?fehler=eingabe, bei technischen
 * Fehlern ?fehler=technik; JSON, das kein Objekt ist (z. B. null), bekommt 400. Es werden keine E-Mail-Adressen, keine
 * Antworten und keine Vorlieben geloggt, nur Plan-ID und Ergebnis.
 *
 * Umgebungsvariablen (Vercel, nie ins Repo): MAILERLITE_API_KEY, MAILERLITE_GROUP_NEWSLETTER (wie api/newsletter.js) und
 *   MAILERLITE_GROUP_ERNAEHRUNGSPLAN  Pflicht. ID der Gruppe „Ernährungsplan“. Fehlt sie, landet jede Anfrage bei ?fehler=technik.
 * Einrichtung und Test: docs/ERNAEHRUNGSPLAN.md.
 */
import { gewichtsstufe, planId, istLaktosefrei, leseVorlieben } from '../src/data/ernaehrungsplan-id.mjs';

const MAILERLITE = 'https://connect.mailerlite.com/api';
const DANKE = '/ernaehrungsplan/danke/';

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

/** Formular oder JSON lesen. Mehrfachfelder (v) kommen als Liste. JSON muss ein Objekt sein, sonst null (→ 400). */
async function lesen(request) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    const json = await request.json().catch(() => null);
    return json && typeof json === 'object' && !Array.isArray(json) ? json : null;
  }
  const params = new URLSearchParams(await request.text());
  return { ...Object.fromEntries(params), v: params.getAll('v') };
}

/** Feldsätze vom vollständigen bis zum kleinsten; der erste, den MailerLite annimmt, gilt. */
function feldsaetze(plan, vorlieben, mitQuelle) {
  const voll = { plan, vorlieben, ...(mitQuelle ? { quelle: 'ernaehrungsplan' } : {}) };
  const saetze = [voll, { plan, vorlieben }, ...(mitQuelle ? [{ plan, quelle: 'ernaehrungsplan' }] : []), { plan }];
  return saetze.filter((s, i) => saetze.findIndex((x) => JSON.stringify(x) === JSON.stringify(s)) === i);
}

/** Adresse anlegen oder aktualisieren. Gibt { outcome, status } fürs Log zurück. */
export async function anfordern({ email, plan, vorlieben }, { newsletter, ernaehrungsplan }) {
  const lookup = await mailerlite(`/subscribers/${encodeURIComponent(email)}`);
  if (lookup.status === 200) {
    const { data } = await lookup.json();
    if (data.status !== 'active' && data.status !== 'unconfirmed') return { outcome: 'uebersprungen', status: data.status };
    let update;
    for (const fields of feldsaetze(plan, vorlieben, false)) {
      update = await mailerlite(`/subscribers/${data.id}`, { method: 'PUT', body: JSON.stringify({ fields }) });
      if (update.status !== 422) break;
    }
    if (!update.ok) return { outcome: 'fehler', status: update.status };
    await mailerlite(`/subscribers/${data.id}/groups/${ernaehrungsplan}`, { method: 'DELETE' });
    for (const groupId of [newsletter, ernaehrungsplan]) {
      const add = await mailerlite(`/subscribers/${data.id}/groups/${groupId}`, { method: 'POST' });
      if (!add.ok) return { outcome: 'fehler', status: add.status };
    }
    return { outcome: 'aktualisiert', status: 200 };
  }
  if (lookup.status !== 404) return { outcome: 'fehler', status: lookup.status };

  let create;
  for (const fields of feldsaetze(plan, vorlieben, true)) {
    create = await mailerlite('/subscribers', { method: 'POST', body: JSON.stringify({ email, status: 'unconfirmed', groups: [newsletter, ernaehrungsplan], fields }) });
    if (create.status !== 422) break;
  }
  return { outcome: create.ok ? 'angelegt' : 'fehler', status: create.status };
}

export async function POST(request) {
  const f = await lesen(request);
  if (!f) return new Response('Bad Request', { status: 400 });
  if (f.website) return redirect(DANKE);
  const email = String(f.email || '').trim().toLowerCase();
  const ernaehrung = String(f.ernaehrung || '');
  const lf = istLaktosefrei(f.laktosefrei, ernaehrung);
  const plan = planId(ernaehrung, String(f.appetit || ''), gewichtsstufe(f.gewicht ?? '') || '', lf);
  if (!plan || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || f.eignung !== 'ja' || f.einwilligung !== 'ja') return redirect(`${DANKE}?fehler=eingabe`);
  const vorlieben = leseVorlieben(f.vorlieben ?? f.v ?? '', ernaehrung, lf).join(',');

  const newsletter = process.env.MAILERLITE_GROUP_NEWSLETTER || process.env.MAILERLITE_GROUP_ID || '';
  const ernaehrungsplan = process.env.MAILERLITE_GROUP_ERNAEHRUNGSPLAN || '';
  if (!process.env.MAILERLITE_API_KEY || !newsletter || !ernaehrungsplan) {
    console.error('ernaehrungsplan: MAILERLITE_API_KEY, MAILERLITE_GROUP_NEWSLETTER oder MAILERLITE_GROUP_ERNAEHRUNGSPLAN fehlt');
    return redirect(`${DANKE}?fehler=technik`);
  }
  try {
    const r = await anfordern({ email, plan, vorlieben }, { newsletter, ernaehrungsplan });
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
