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
  }),
});

export const collections = { wissen };
