/**
 * Tally-Webhook → MailerLite (Vercel-Funktion, Node-Laufzeit, Web-API-Signatur).
 *
 * Ablauf: Tally schickt nach jedem Absenden eines Formulars (Vorbestellung b5bO9o, Erfahrungen ODOJWR,
 * Checkliste WOxpjv) den Datensatz an POST https://nachderspritze.de/api/newsletter/. Die Funktion
 *  1. prüft die Signatur (Header `tally-signature`, HMAC-SHA256 über den Rohtext, Base64) gegen TALLY_SIGNING_SECRET,
 *  2. nimmt nur Einträge, bei denen das Kästchen „Newsletter“ gesetzt ist; alles andere wird mit 200 quittiert und ignoriert,
 *  3. legt die Adresse bei MailerLite mit Status `unconfirmed` in der Gruppe „Newsletter“ an, aus dem Checklisten-Formular
 *     zusätzlich in der Gruppe „Checkliste“. Double-Opt-in ist im MailerLite-Konto aktiv; die Bestätigungs-Mail verschickt
 *     MailerLite selbst. Bereits aktive Adressen werden nur den Gruppen hinzugefügt, abgemeldete bleiben abgemeldet (nichts
 *     wird automatisch reaktiviert).
 *
 * Umgebungsvariablen (Vercel → Project → Settings → Environment Variables, nie ins Repo; Werte in docs/NEWSLETTER-SETUP.md):
 *   MAILERLITE_API_KEY            Pflicht. MailerLite → Integrations → API.
 *   MAILERLITE_GROUP_NEWSLETTER   Pflicht. ID der Gruppe „Newsletter“ (ersatzweise MAILERLITE_GROUP_ID).
 *   MAILERLITE_GROUP_CHECKLISTE   Optional. ID der Gruppe „Checkliste“; nur Einträge aus WOxpjv kommen zusätzlich hinein.
 *   TALLY_SIGNING_SECRET          Dringend empfohlen. Derselbe Wert in allen drei Tally-Webhooks („Signing secret“). Ohne ihn
 *                                 nimmt die Funktion jeden POST an.
 *
 * Es werden keine E-Mail-Adressen geloggt, nur Formular-ID und Ergebnis. Spezifikation: docs/NEWSLETTER.md.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

const MAILERLITE = 'https://connect.mailerlite.com/api';

/** Tally-Formular-ID → Wert für das MailerLite-Feld `quelle` */
const FORMS = { b5bO9o: 'vorbestellung', ODOJWR: 'erfahrungen', WOxpjv: 'checkliste' };

/** Signatur prüfen. Ohne Secret (leer) wird nicht geprüft. */
export function verifySignature(rawBody, header, secret) {
  if (!secret) return true;
  if (!header) return false;
  const expected = Buffer.from(createHmac('sha256', secret).update(rawBody).digest('base64'));
  const given = Buffer.from(String(header));
  return expected.length === given.length && timingSafeEqual(expected, given);
}

function isChecked(value) {
  if (value === true || value === 'true') return true;
  if (Array.isArray(value)) return value.length > 0;
  return false;
}

/** E-Mail, Newsletter-Häkchen und Quelle aus dem Tally-Datensatz lesen. */
export function parseTally(payload) {
  const data = payload && typeof payload === 'object' && payload.data ? payload.data : {};
  const fields = Array.isArray(data.fields) ? data.fields : [];
  const emailField = fields.find((f) => f && f.type === 'INPUT_EMAIL') || fields.find((f) => f && /e-?mail/i.test(String(f.label || '')));
  const email = emailField && typeof emailField.value === 'string' ? emailField.value.trim().toLowerCase() : '';
  // Tally liefert bei „Checkbox“ einen Boolean, bei „Checkboxes“ ein Array der gewählten Optionen und zusätzlich je Option
  // ein Feld „Newsletter (Text der Option)“ mit Boolean. Alle Varianten zählen.
  const newsletter = fields.some((f) => f && /^newsletter/i.test(String(f.label || '').trim()) && isChecked(f.value));
  const formId = typeof data.formId === 'string' ? data.formId : '';
  return {
    eventType: payload && typeof payload.eventType === 'string' ? payload.eventType : '',
    formId,
    source: FORMS[formId] || 'unbekannt',
    email,
    newsletter,
    valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  };
}

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

/** Gruppen je Formular: „Newsletter“ für alle, „Checkliste“ zusätzlich für Einträge aus WOxpjv. */
export function groupsFor(formId) {
  const newsletter = process.env.MAILERLITE_GROUP_NEWSLETTER || process.env.MAILERLITE_GROUP_ID || '';
  const checkliste = process.env.MAILERLITE_GROUP_CHECKLISTE || '';
  const groups = newsletter ? [newsletter] : [];
  if (formId === 'WOxpjv' && checkliste) groups.push(checkliste);
  return groups;
}

/** Adresse anlegen oder den Gruppen hinzufügen. Gibt ein Ergebnisobjekt für das Log zurück. */
export async function subscribe({ email, source }, groups) {
  const lookup = await mailerlite(`/subscribers/${encodeURIComponent(email)}`);
  if (lookup.status === 200) {
    const { data } = await lookup.json();
    if (data.status === 'active' || data.status === 'unconfirmed') {
      let status = 200;
      for (const groupId of groups) {
        const add = await mailerlite(`/subscribers/${data.id}/groups/${groupId}`, { method: 'POST' });
        if (!add.ok) return { outcome: 'fehler', status: add.status };
        status = add.status;
      }
      return { outcome: 'gruppe', status };
    }
    // unsubscribed, bounced, junk: nicht automatisch reaktivieren
    return { outcome: 'uebersprungen', status: data.status };
  }
  if (lookup.status !== 404) return { outcome: 'fehler', status: lookup.status };

  const body = { email, status: 'unconfirmed', groups, fields: { quelle: source } };
  let create = await mailerlite('/subscribers', { method: 'POST', body: JSON.stringify(body) });
  if (create.status === 422) {
    // Feld `quelle` existiert im Konto nicht: ohne Feld anlegen, damit die Anmeldung nicht verloren geht
    delete body.fields;
    create = await mailerlite('/subscribers', { method: 'POST', body: JSON.stringify(body) });
  }
  return { outcome: create.ok ? 'angelegt' : 'fehler', status: create.status };
}

export async function POST(request) {
  const raw = await request.text();
  if (!verifySignature(raw, request.headers.get('tally-signature'), process.env.TALLY_SIGNING_SECRET)) {
    return Response.json({ ok: false, error: 'signature' }, { status: 401 });
  }
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: 'json' }, { status: 400 });
  }
  const t = parseTally(payload);
  if (t.eventType && t.eventType !== 'FORM_RESPONSE') return Response.json({ ok: true, skipped: 'event' });
  if (!t.newsletter) {
    console.log(`newsletter: ${t.formId || '?'} ohne Häkchen, übersprungen`);
    return Response.json({ ok: true, skipped: 'kein-haekchen' });
  }
  if (!t.valid) {
    console.log(`newsletter: ${t.formId || '?'} Häkchen gesetzt, aber keine gültige E-Mail-Adresse`);
    return Response.json({ ok: true, skipped: 'email' });
  }
  const groups = groupsFor(t.formId);
  if (!process.env.MAILERLITE_API_KEY || groups.length === 0) {
    console.error('newsletter: MAILERLITE_API_KEY oder MAILERLITE_GROUP_NEWSLETTER fehlt');
    return Response.json({ ok: false, error: 'config' }, { status: 500 });
  }
  try {
    const r = await subscribe(t, groups);
    console.log(`newsletter: ${t.formId} (${t.source}) → ${r.outcome} (${r.status})`);
    return Response.json({ ok: r.outcome !== 'fehler', ...r }, { status: r.outcome === 'fehler' ? 502 : 200 });
  } catch (err) {
    console.error('newsletter: MailerLite nicht erreichbar', err instanceof Error ? err.message : err);
    return Response.json({ ok: false, error: 'upstream' }, { status: 502 });
  }
}

export function GET() {
  return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
}
