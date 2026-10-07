/**
 * Schriften für das PDF im Browser: „NDS Druck“, statische Schnitte aus Mona Sans (OFL, Reserved Font Name „Mona“, daher
 * umbenannt), als TTF unter public/fonts/druck/ mit der Lizenz OFL.txt. Erzeugt aus scripts/fonts/nds-druck-*.woff2
 * (fontTools: TTFont(woff2).flavor = None, speichern). Klein und ohne pdf-lib, damit die Planseite die Dateien schon
 * laden kann, während der PDF-Code noch kommt.
 */
export const SCHNITTE = { text: 'w100-g400', fett: 'w100-g560', name: 'w112-g540', kopf: 'w118-g520', zahl: 'w125-g480' } as const;
export type Schnitt = keyof typeof SCHNITTE;
export type Schriften = Record<Schnitt, ArrayBuffer | Uint8Array>;
export const schriftDatei = (s: Schnitt) => `nds-druck-${SCHNITTE[s]}.ttf`;
export const SCHRIFT_PFAD = '/fonts/druck/';

/** Alle Schnitte parallel laden (Browser) */
export async function ladeSchriften(basis = SCHRIFT_PFAD): Promise<Schriften> {
  const keys = Object.keys(SCHNITTE) as Schnitt[];
  const daten = await Promise.all(
    keys.map(async (k) => {
      const r = await fetch(basis + schriftDatei(k));
      if (!r.ok) throw new Error(`Schrift ${schriftDatei(k)}: ${r.status}`);
      return r.arrayBuffer();
    }),
  );
  return Object.fromEntries(keys.map((k, i) => [k, daten[i]])) as Schriften;
}
