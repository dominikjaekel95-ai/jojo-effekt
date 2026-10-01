import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Wissensartikel (SEO-Hub). Jede Datei in src/content/wissen/ wird zu /wissen/<dateiname>/.
 * `sources` sind IDs aus src/data/sources.ts in Zitierreihenfolge; im Text wird mit
 * <sup><a href="#fn-<id>">n</a></sup> darauf verwiesen.
 */
const wissen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/wissen' }),
  schema: z.object({
    title: z.string().max(100),
    metaTitle: z.string().max(65).optional(),
    description: z.string().max(165),
    category: z.string(),
    order: z.number(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    keywords: z.array(z.string()),
    sources: z.array(z.string()),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    related: z.array(z.string()).default([]),
    /** true = wird nicht gebaut (Vorlage, noch ohne echten Inhalt) */
    draft: z.boolean().default(false),
    /** true = Inhaltsverzeichnis aus den H2-Überschriften über dem Text (für lange Hauptartikel) */
    toc: z.boolean().default(false),
    /** Vorschaubild für Teilen und Article-Schema, Pfad unter public/ (z. B. /grafiken/absetzkurve-step-1.png) */
    image: z.string().optional(),
    /** Amazon-Partnerlinks am Artikelende: Schlüssel aus src/data/affiliate.ts (leer = keine Liste) */
    affiliate: z.array(z.string()).default([]),
    affiliateTitle: z.string().optional(),
    affiliateIntro: z.string().optional(),
  }),
});

/**
 * Glossar: ein Begriff pro Datei, URL /glossar/<dateiname>/. Kurze, belegte Definitionen zur Zeit nach der
 * Abnehmspritze. `synonyms` steuern die automatische Verlinkung aus Artikeln (GlossarBox).
 */
const glossar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/glossar' }),
  schema: z.object({
    term: z.string().max(80),
    metaTitle: z.string().max(65).optional(),
    description: z.string().max(165),
    /** Ein-Satz-Definition für Listen, Boxen und das DefinedTerm-Schema */
    short: z.string().max(260),
    synonyms: z.array(z.string()).default([]),
    sources: z.array(z.string()),
    /** verwandte Glossar-Slugs */
    related: z.array(z.string()).default([]),
    /** vertiefende Artikel-Slugs aus src/content/wissen */
    articles: z.array(z.string()).default([]),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** true = eigener Begriff von Nach der Spritze (wird gekennzeichnet) */
    own: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { wissen, glossar };
