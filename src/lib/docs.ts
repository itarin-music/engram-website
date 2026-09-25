import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Sidebar sections, in order. A docs page's folder decides its section.
 * To add a section: add it here and create the matching folder in src/content/docs/.
 */
export const SECTIONS = [
  { id: 'getting-started', title: 'Getting started' },
  { id: 'features', title: 'Features' },
  { id: 'reference', title: 'Reference' },
] as const;

export type DocEntry = CollectionEntry<'docs'>;

export function sectionOf(entry: DocEntry): string {
  return entry.id.split('/')[0];
}

export function hrefOf(entry: DocEntry): string {
  return `/docs/${entry.id}/`;
}

/** All docs in reading order: by section, then by `order`. Unknown sections fail the build. */
export async function orderedDocs(): Promise<DocEntry[]> {
  const all = await getCollection('docs');
  const idx = (e: DocEntry) => {
    const i = SECTIONS.findIndex((s) => s.id === sectionOf(e));
    if (i < 0) throw new Error(`Docs page "${e.id}" is in an unknown section. Add "${sectionOf(e)}" to SECTIONS in src/lib/docs.ts.`);
    return i;
  };
  return all.sort((a, b) => idx(a) - idx(b) || a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export async function sidebar() {
  const docs = await orderedDocs();
  return SECTIONS.map((s) => ({ ...s, items: docs.filter((d) => sectionOf(d) === s.id) }));
}
