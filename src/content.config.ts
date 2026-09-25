import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Docs pages live in src/content/docs/<section>/<page>.md.
 * The folder is the sidebar section (see src/lib/docs.ts) and `order` sorts pages inside it.
 */
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    /** Shorter label for the sidebar, if the title is long. */
    navTitle: z.string().optional(),
  }),
});

export const collections = { docs };
