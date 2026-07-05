import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface IconEntry {
  provider: string;
  slug: string;
  label: string;
  category: string;
}

const HERE = dirname(fileURLToPath(import.meta.url));
// dist/lib/iconCatalog.js → ../../data/icons.json
const MANIFEST_PATH = resolve(HERE, '..', '..', 'data', 'icons.json');

let cached: IconEntry[] | null = null;

async function load(): Promise<IconEntry[]> {
  if (cached) return cached;
  try {
    const text = await readFile(MANIFEST_PATH, 'utf8');
    const parsed = JSON.parse(text) as IconEntry[];
    cached = parsed;
    return parsed;
  } catch {
    cached = [];
    return cached;
  }
}

export async function getAllIcons(): Promise<IconEntry[]> {
  return load();
}

export async function getIconProviders(): Promise<string[]> {
  const all = await load();
  return [...new Set(all.map((i) => i.provider))].sort();
}

export async function getIconsByProvider(provider: string): Promise<IconEntry[]> {
  const all = await load();
  const target = provider.toLowerCase();
  return all.filter((i) => i.provider === target);
}

function scoreMatch(query: string, entry: IconEntry): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const haystacks = [entry.slug, entry.label.toLowerCase(), entry.category.toLowerCase()];
  let best = 0;
  for (const h of haystacks) {
    if (h === q) best = Math.max(best, 100);
    else if (h.startsWith(q)) best = Math.max(best, 80);
    else if (h.includes(q)) best = Math.max(best, 60);
    else {
      // token overlap: split q into words, count how many appear
      const tokens = q.split(/\s+/).filter(Boolean);
      const hits = tokens.filter((t) => h.includes(t)).length;
      if (hits > 0) best = Math.max(best, 20 + 10 * hits);
    }
  }
  return best;
}

export async function findIcons(
  query: string,
  options: { provider?: string; limit?: number } = {}
): Promise<IconEntry[]> {
  const all = options.provider
    ? await getIconsByProvider(options.provider)
    : await getAllIcons();
  const limit = options.limit ?? 10;
  return all
    .map((entry) => ({ entry, score: scoreMatch(query, entry) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.entry.slug.localeCompare(b.entry.slug);
    })
    .slice(0, limit)
    .map((row) => row.entry);
}
