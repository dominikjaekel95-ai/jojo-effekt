/**
 * Ernährungsplan anfordern (Vercel-Funktion, Web-API-Signatur). Formulare: src/pages/ernaehrungsplan/index.astro (Weg
 * „Plan per Mail bekommen“) und das Blatt „Als PDF senden“ der Planseite src/pages/ernaehrungsplan/plan/[id].astro.
 *
 * Nimmt POST /api/ernaehrungsplan/ als Formular (application/x-www-form-urlencoded) oder JSON an:
 *   ernaehrung (mischkost|pescetarisch|vegetarisch|vegan), laktosefrei ("ja" oder leer; vegan immer laktosefrei),
 *   appetit (klein|normal), gewicht (kg, 35–250), v (mehrfach, Vorlieben wie "lachs") oder vorlieben ("lachs,quark"),
 *   email, eignung = "ja" (Ausschlusskriterien bestätigt), einwilligung = "ja" (Plan plus Newsletter), website (Honigtopf, leer).
 *   Nur von der Planseite: zustand (Auswahl der Gerichte, der Parameter ?s= der Planseite; nur [0-9a-z.], höchstens 250
 *   Zeichen, sonst leer) und warteliste = "ja" (freiwilliges, nicht vorausgewähltes Häkchen „Auch auf die Warteliste“).
 * Ablauf:
 *  1. Antworten → Plan-ID (ek01 bis ek56) und bereinigte Vorlieben über src/data/ernaehrungsplan-id.mjs.
 *     Das Gewicht selbst wird nicht gespeichert, nur die Plan-ID.
 *  2. Neue Adresse: bei MailerLite mit Status `unconfirmed` in den Gruppen „Newsletter“ und „Ernährungsplan“ anlegen,
 *     Felder `plan`, `vorlieben`, `zustand` und `quelle` = "ernaehrungsplan". MailerLite schickt die Bestätigungs-Mail
 *     (Double-Opt-in); erst nach dem Klick ist die Adresse aktiv, und die Automation „joins group Ernährungsplan“
 *     verschickt den Link https://nachderspritze.de/ernaehrungsplan/plan/{$plan}/?v={$vorlieben}&s={$zustand}&pdf=1.
 *  3. Bereits aktive oder unbestätigte Adresse: Felder `plan`, `vorlieben` und `zustand` aktualisieren, Gruppe
 *     „Ernährungsplan“ entfernen und neu zuweisen, Gruppe „Newsletter“ hinzufügen. Abgemeldete Adressen bleiben abgemeldet.
 *  4. Mit warteliste=ja danach zusätzlich in die Gruppe MAILERLITE_GROUP_WARTELISTE. Fehlt die Variable oder scheitert das,
 *     steht es im Log; die Zusendung des Plans hängt nicht daran.
 *  Fehlt ein Feld im MailerLite-Konto (422), versucht die Funktion es ohne `quelle`, dann ohne `zustand`, dann ohne
 *  `vorlieben` (jeweils mit und ohne `quelle`); ohne `plan` scheitert es, und das ist gewollt (ohne Feld kein Link).
 * Antwort: Weiterleitung (303) auf /ernaehrungsplan/danke/, bei Eingabefehlern ?fehler=eingabe, bei technischen
 * Fehlern ?fehler=technik; JSON, das kein Objekt ist (z. B. null), bekommt 400. Es werden keine E-Mail-Adressen, keine
 * Antworten, keine Vorlieben und keine Zustände geloggt, nur Plan-ID und Ergebnis (mit Warteliste: deren Ergebnis).
 *
 * Umgebungsvariablen (Vercel, nie ins Repo): MAILERLITE_API_KEY, MAILERLITE_GROUP_NEWSLETTER (wie api/newsletter.js) und
 *   MAILERLITE_GROUP_ERNAEHRUNGSPLAN  Pflicht. ID der Gruppe „Ernährungsplan“. Fehlt sie, landet jede Anfrage bei ?fehler=technik.
 *   MAILERLITE_GROUP_WARTELISTE       Pflicht (wie api/anmeldung.js). Fehlt sie, kommt der Plan trotzdem, nur ohne Warteliste
 *                                     (Log: „Warteliste gewünscht, MAILERLITE_GROUP_WARTELISTE fehlt“).
 * Einrichtung und Test: docs/ERNAEHRUNGSPLAN.md.
 */
import { gewichtsstufe, planId, istLaktosefrei, leseVorlieben } from '../src/data/ernaehrungsplan-id.mjs';

const MAILERLITE = 'https://connect.mailerlite.com/api';
const DANKE = '/ernaehrungsplan/danke/';
/** Zustand der Planseite (?s=): nur Kleinbuchstaben, Ziffern und Punkte, höchstens 250 Zeichen (wie ZUSTAND_MAX in
 *  src/lib/plan-interaktiv/senden.ts) */
const ZUSTAND = /^[0-9a-z.]{1,250}$/;

/** Zustand streng prüfen: gültig oder leer */
export const leseZustand = (wert) => (typeof wert === 'string' && ZUSTAND.test(wert) ? wert : '');

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

/** Feldsätze vom vollständigen bis zum kleinsten; der erste, den MailerLite annimmt, gilt. Reihenfolge: ohne `quelle`,
 *  dann ohne `zustand`, dann ohne `vorlieben`; `plan` ist immer dabei. Ein leerer Zustand (Formular der
 *  Startseite) löscht einen älteren, damit der Link in der Mail nicht Änderungen eines früheren Plans zeigt. */
export function feldsaetze(plan, vorlieben, mitQuelle, zustand = '') {
  const q = mitQuelle ? { quelle: 'ernaehrungsplan' } : {};
  const z = { zustand };
  const saetze = [
    { plan, vorlieben, ...z, ...q },
    { plan, vorlieben, ...z },
    { plan, vorlieben, ...q },
    { plan, vorlieben },
    { plan, ...q },
    { plan },
  ];
  return saetze.filter((s, i) => saetze.findIndex((x) => JSON.stringify(x) === JSON.stringify(s)) === i);
}

/** Zusätzlich in die Warteliste (nur mit eigenem Häkchen). Scheitert es, bleibt der Plan unberührt. */
async function aufWarteliste(id, gruppe) {
  if (!gruppe) return 'fehlt';
  if (!id) return 'fehler';
  const add = await mailerlite(`/subscribers/${id}/groups/${gruppe}`, { method: 'POST' });
  return add.ok ? 'ja' : `fehler ${add.status}`;
}

/** Adresse anlegen oder aktualisieren. Gibt { outcome, status, warteliste } fürs Log zurück. */
export async function anfordern({ email, plan, vorlieben, zustand = '', warteliste = false }, { newsletter, ernaehrungsplan, wartelisteGruppe = '' }) {
  const lookup = await mailerlite(`/subscribers/${encodeURIComponent(email)}`);
  if (lookup.status === 200) {
    const { data } = await lookup.json();
    if (data.status !== 'active' && data.status !== 'unconfirmed') return { outcome: 'uebersprungen', status: data.status };
    let update;
    for (const fields of feldsaetze(plan, vorlieben, false, zustand)) {
      update = await mailerlite(`/subscribers/${data.id}`, { method: 'PUT', body: JSON.stringify({ fields }) });
      if (update.status !== 422) break;
    }
    if (!update.ok) return { outcome: 'fehler', status: update.status };
    await mailerlite(`/subscribers/${data.id}/groups/${ernaehrungsplan}`, { method: 'DELETE' });
    for (const groupId of [newsletter, ernaehrungsplan]) {
      const add = await mailerlite(`/subscribers/${data.id}/groups/${groupId}`, { method: 'POST' });
      if (!add.ok) return { outcome: 'fehler', status: add.status };
    }
    return { outcome: 'aktualisiert', status: 200, warteliste: warteliste ? await aufWarteliste(data.id, wartelisteGruppe) : '' };
  }
  if (lookup.status !== 404) return { outcome: 'fehler', status: lookup.status };

  let create;
  for (const fields of feldsaetze(plan, vorlieben, true, zustand)) {
    create = await mailerlite('/subscribers', { method: 'POST', body: JSON.stringify({ email, status: 'unconfirmed', groups: [newsletter, ernaehrungsplan], fields }) });
    if (create.status !== 422) break;
  }
  if (!create.ok) return { outcome: 'fehler', status: create.status };
  const id = warteliste ? ((await create.json().catch(() => null))?.data?.id ?? '') : '';
  return { outcome: 'angelegt', status: create.status, warteliste: warteliste ? await aufWarteliste(id, wartelisteGruppe) : '' };
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
  const zustand = leseZustand(f.zustand);
  const warteliste = f.warteliste === 'ja';

  const newsletter = process.env.MAILERLITE_GROUP_NEWSLETTER || process.env.MAILERLITE_GROUP_ID || '';
  const ernaehrungsplan = process.env.MAILERLITE_GROUP_ERNAEHRUNGSPLAN || '';
  if (!process.env.MAILERLITE_API_KEY || !newsletter || !ernaehrungsplan) {
    console.error('ernaehrungsplan: MAILERLITE_API_KEY, MAILERLITE_GROUP_NEWSLETTER oder MAILERLITE_GROUP_ERNAEHRUNGSPLAN fehlt');
    return redirect(`${DANKE}?fehler=technik`);
  }
  const wartelisteGruppe = process.env.MAILERLITE_GROUP_WARTELISTE || '';
  if (warteliste && !wartelisteGruppe) console.error('ernaehrungsplan: Warteliste gewünscht, MAILERLITE_GROUP_WARTELISTE fehlt (Plan kommt trotzdem)');
  try {
    const r = await anfordern({ email, plan, vorlieben, zustand, warteliste }, { newsletter, ernaehrungsplan, wartelisteGruppe });
    console.log(`ernaehrungsplan: ${plan} → ${r.outcome} (${r.status})${r.warteliste ? `, Warteliste: ${r.warteliste}` : ''}`);
    return redirect(r.outcome === 'fehler' ? `${DANKE}?fehler=technik` : DANKE);
  } catch (err) {
    console.error('ernaehrungsplan: MailerLite nicht erreichbar', err instanceof Error ? err.message : err);
    return redirect(`${DANKE}?fehler=technik`);
  }
}

export function GET() {
  return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
}
