/**
 * Themenseiten (Hubs) unter /wissen/<slug>/. Inhalt in themen.json; hier Typen, Zugriff und Prüfung der Limits.
 * Jeder Artikel gehört über `category` zu genau einem Thema; `include` listet Artikel zusätzlich auf einem zweiten Hub.
 */
import data from './themen.json';

export type ThemaFrage = { q: string; slug: string } | { q: string; href: string; label: string };
export type ThemaTool = { label: string; href: string; note: string };
export type Thema = {
  slug: string;
  category: string;
  name: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string[];
  einstieg: string | null;
  fragen: ThemaFrage[];
  include: string[];
  glossar: string[];
  tools: ThemaTool[];
  sources: string[];
  pubDate: string;
};

export const themen: Thema[] = (data as { themen: Thema[] }).themen;

for (const t of themen) {
  if (t.metaTitle.length > 65) throw new Error(`Thema ${t.slug}: metaTitle hat ${t.metaTitle.length} Zeichen (max. 65)`);
  if (t.description.length > 165) throw new Error(`Thema ${t.slug}: description hat ${t.description.length} Zeichen (max. 165)`);
  if (!/^[a-z0-9-]+$/.test(t.slug)) throw new Error(`Thema ${t.slug}: Slug nur mit a-z, 0-9 und Bindestrich`);
}

/** Alle Kategorie-Werte, die ein Artikel im Frontmatter tragen darf */
export const kategorien = themen.map((t) => t.category);

export const themaByCategory = (category: string): Thema | undefined => themen.find((t) => t.category === category);
export const themaBySlug = (slug: string): Thema | undefined => themen.find((t) => t.slug === slug);

/** Gehört ein Artikel (id, category) zu diesem Thema? */
export const gehoertZu = (t: Thema, id: string, category: string): boolean => t.category === category || t.include.includes(id);
