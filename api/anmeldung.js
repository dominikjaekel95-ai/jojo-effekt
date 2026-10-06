/**
 * Anmeldungen aus den eigenen Formularen der Website (Vercel-Funktion, Web-API-Signatur): Warteliste für das
 * 12-Wochen-Programm (WaitlistForm, quelle=warteliste) und Checkliste (ChecklisteForm, quelle=checkliste). Das frühere
 * Newsletter-Formular im Seitenkopf (quelle=header) gibt es seit 06.10.2026 nicht mehr.
 *
 * Nimmt POST /api/anmeldung/ als Formular (application/x-www-form-urlencoded) oder JSON (ein Objekt, sonst 400) an und
 * prüft E-Mail-Adresse, Einwilligung (Feld `einwilligung` = "ja") und ein Honigtopf-Feld (`website` muss leer sein).
 * Weitere Felder:
 *   quelle        warteliste | checkliste (Whitelist). Alles andere, auch das frühere „header“, endet mit ?fehler=eingabe
 *                 auf /newsletter/danke/; nichts landet still in der Newsletter-Gruppe.
 *   newsletter    "ja" = Einwilligung in den Newsletter, als freiwilliges Häkchen (Warteliste mit eigener Gruppe, Checkliste).
 *   liste         "gemeinsam" schickt nur das Wartelisten-Formular ohne eigene Gruppe (site.waitlist.ownGroup = false): Dort
 *                 nennt die Einwilligung Warteliste UND Newsletter, und das Formular schickt newsletter=ja versteckt mit.
 *   starterpaket  "ja" = Interesse an einem Starterpaket mit Protein und Kreatin (nur Warteliste); MailerLite-Feld
 *                 `starterpaket`.
 *
 * Gruppen (MailerLite, Status `unconfirmed`, Double-Opt-in verschickt MailerLite):
 *   warteliste  MAILERLITE_GROUP_WARTELISTE (Pflicht), plus Newsletter nur mit newsletter=ja. Fehlt die Variable (etwa in
 *               einer Vercel-Preview), wird nichts angelegt (?fehler=konfiguration): Die Einwilligung nennt den Newsletter
 *               dann nur als freiwilliges Häkchen, also darf die Adresse nicht ersatzweise in der Newsletter-Gruppe landen.
 *               Einzige Ausnahme: liste=gemeinsam mit newsletter=ja; dann Newsletter-Gruppe mit Feld quelle=warteliste.
 *   checkliste  MAILERLITE_GROUP_CHECKLISTE (Pflicht), plus Newsletter nur mit newsletter=ja. Fehlt sie: ?fehler=konfiguration.
 *
 * Weiterleitung (303): warteliste → /danke/, checkliste → /checkliste/danke/; Fehler mit ?fehler=eingabe,
 * ?fehler=technik (MailerLite) oder ?fehler=konfiguration (Umgebungsvariable fehlt) auf dieselbe Seite. Die Danke-Seiten
 * zeigen bei „konfiguration“ denselben Text wie bei „technik“ (die Checkliste bietet das PDF auch im Fehlerfall an).
 * Es werden keine E-Mail-Adressen geloggt, bei fehlender Konfiguration nur Quelle und Name der Variable.
 * Umgebungsvariablen (Vercel, nie ins Repo): MAILERLITE_API_KEY und MAILERLITE_GROUP_NEWSLETTER wie in api/newsletter.js,
 * dazu MAILERLITE_GROUP_WARTELISTE und MAILERLITE_GROUP_CHECKLISTE (beide Pflicht, in Production und Preview).
 */
import { subscribe, groupsFor } from './newsletter.js';

const redirect = (to) => new Response(null, { status: 303, headers: { Location: to } });

/** Erlaubte Werte für `quelle` und ihre Zielseiten */
const ZIEL = {
  warteliste: { ok: '/danke/', fehler: '/danke/' },
  checkliste: { ok: '/checkliste/danke/', fehler: '/checkliste/danke/' },
};
/** Ziel für unbekannte Quellen (auch das frühere Kopf-Formular, quelle=header, aus zwischengespeicherten Seiten) */
const UNBEKANNT = '/newsletter/danke/';

/** Quelle aus der Whitelist oder leerer String */
export function parseQuelle(value) {
  const q = String(value || '').trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(ZIEL, q) ? q : '';
}

/**
 * Gruppen je Quelle. `fehlt` nennt die fehlende Umgebungsvariable; dann wird nichts angelegt, weil die Konfiguration nicht
 * zur Einwilligung passt (?fehler=konfiguration).
 */
export function groupsForSignup(quelle, { newsletter = false, gemeinsam = false } = {}) {
  const nl = groupsFor('');
  if (newsletter && nl.length === 0) return { groups: [], fehlt: 'MAILERLITE_GROUP_NEWSLETTER' };
  const name = quelle === 'warteliste' ? 'MAILERLITE_GROUP_WARTELISTE' : 'MAILERLITE_GROUP_CHECKLISTE';
  const own = process.env[name] || '';
  if (own) return { groups: newsletter ? [own, ...nl] : [own], fehlt: '' };
  // Ohne eigene Gruppe nur, wenn die Einwilligung Warteliste UND Newsletter genannt hat (site.waitlist.ownGroup = false)
  if (quelle === 'warteliste' && gemeinsam && newsletter) return { groups: nl, fehlt: '' };
  return { groups: [], fehlt: name };
}

/** Formular oder JSON lesen. JSON muss ein Objekt sein, sonst null (→ 400). */
async function lesen(request) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    const json = await request.json().catch(() => null);
    return json && typeof json === 'object' && !Array.isArray(json) ? json : null;
  }
  return Object.fromEntries(new URLSearchParams(await request.text()).entries());
}

export async function POST(request) {
  const body = await lesen(request);
  if (!body) return new Response('Bad Request', { status: 400 });
  const quelle = parseQuelle(body.quelle);
  if (!quelle) {
    console.log('anmeldung: unbekannte quelle, abgewiesen');
    return redirect(`${UNBEKANNT}?fehler=eingabe`);
  }
  const ziel = ZIEL[quelle];
  const email = String(body.email || '').trim().toLowerCase();
  const newsletter = body.newsletter === 'ja';
  const gemeinsam = quelle === 'warteliste' && body.liste === 'gemeinsam';
  const starterpaket = quelle === 'warteliste' && body.starterpaket === 'ja';

  if (body.website) return redirect(ziel.ok);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.einwilligung !== 'ja') return redirect(`${ziel.fehler}?fehler=eingabe`);

  const { groups, fehlt } = groupsForSignup(quelle, { newsletter, gemeinsam });
  const fehlend = !process.env.MAILERLITE_API_KEY ? 'MAILERLITE_API_KEY' : fehlt;
  if (fehlend) {
    console.error(`anmeldung: ${quelle}: ${fehlend} fehlt, nichts angelegt`);
    return redirect(`${ziel.fehler}?fehler=konfiguration`);
  }
  try {
    const fields = starterpaket ? { starterpaket: 'ja' } : {};
    const r = await subscribe({ email, source: quelle, fields }, groups);
    console.log(`anmeldung: ${quelle}${starterpaket ? ' +starterpaket' : ''}${newsletter ? ' +newsletter' : ''} → ${r.outcome} (${r.status})`);
    return redirect(r.outcome === 'fehler' ? `${ziel.fehler}?fehler=technik` : ziel.ok);
  } catch (err) {
    console.error('anmeldung: MailerLite nicht erreichbar', err instanceof Error ? err.message : err);
    return redirect(`${ziel.fehler}?fehler=technik`);
  }
}

export function GET() {
  return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
}
