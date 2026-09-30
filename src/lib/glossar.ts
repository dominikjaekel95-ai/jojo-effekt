/**
 * Automatische Verlinkung von Glossar-Begriffen: findet Begriffe (und Synonyme) im Text eines Artikels.
 * Wortgrenzen sind selbst definiert, weil \b keine Umlaute kennt.
 */
import type { CollectionEntry } from 'astro:content';

export type GlossarEntry = CollectionEntry<'glossar'>;

const escapeRx = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const LETTER = 'A-Za-zÄÖÜäöüß';

/** Regulärer Ausdruck, der eines der Wörter als ganzes Wort findet (Groß-/Kleinschreibung egal). */
export function termPattern(words: string[]): RegExp {
  const alts = words.filter(Boolean).map(escapeRx).join('|');
  return new RegExp(`(?:^|[^${LETTER}])(?:${alts})(?=$|[^${LETTER}])`, 'i');
}

export function mentionsTerm(text: string, e: GlossarEntry): boolean {
  return termPattern([e.data.term, ...e.data.synonyms]).test(text);
}

/** Alle Glossar-Einträge, die im Text vorkommen; `exclude` = eigener Slug (bei Glossar-Seiten). */
export function findTerms(text: string, entries: GlossarEntry[], exclude?: string): GlossarEntry[] {
  return entries.filter((e) => e.id !== exclude && !e.data.draft && mentionsTerm(text, e));
}

export const byTerm = (a: GlossarEntry, b: GlossarEntry) => a.data.term.localeCompare(b.data.term, 'de');
