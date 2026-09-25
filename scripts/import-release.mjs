#!/usr/bin/env node
/**
 * Pull a published release's manifest.json into src/data/releases.json.
 *
 *   npm run release:import -- v1.2.0          import that tag
 *   npm run release:import -- latest          import the newest published release
 *   npm run release:import -- --file path/to/manifest.json   import a local manifest (no network)
 *
 * The manifest is created by the app repo's release workflow and attached to the GitHub release
 * in the public releases repo, so this only works after you have clicked "Publish release".
 * Re-importing a tag replaces that entry, so it is safe to run twice.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = resolve(root, 'src/data/releases.json');

async function releasesRepo() {
  if (process.env.ENGRAM_RELEASES_REPO) return process.env.ENGRAM_RELEASES_REPO;
  const cfg = await readFile(resolve(root, 'src/config/site.ts'), 'utf8');
  const m = cfg.match(/releasesRepo:\s*'([^']+)'/);
  if (!m) throw new Error('Could not find releasesRepo in src/config/site.ts');
  return m[1];
}

async function getJson(url) {
  const headers = { 'User-Agent': 'engram-website-release-import', Accept: 'application/json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(url, { headers, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

function validate(m) {
  const need = ['version', 'tag', 'date', 'notes', 'assets'];
  for (const k of need) if (!(k in m)) throw new Error(`manifest.json is missing "${k}"`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m.date)) throw new Error('manifest.json "date" must be YYYY-MM-DD');
  if (!Array.isArray(m.assets) || m.assets.length === 0) throw new Error('manifest.json has no assets');
  for (const a of m.assets) {
    for (const k of ['platform', 'arch', 'format', 'file', 'size', 'sha256']) if (!(k in a)) throw new Error(`asset ${a.file ?? '?'} is missing "${k}"`);
    if (!/^[0-9a-f]{64}$/.test(a.sha256)) throw new Error(`asset ${a.file} has an invalid sha256`);
  }
  return { version: m.version, tag: m.tag, date: m.date, notes: m.notes, assets: m.assets };
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error('Usage: npm run release:import -- <tag | latest | --file manifest.json>');
    process.exit(1);
  }
  let manifest;
  if (args[0] === '--file') {
    manifest = JSON.parse(await readFile(resolve(process.cwd(), args[1]), 'utf8'));
  } else {
    const repo = await releasesRepo();
    let tag = args[0];
    if (tag === 'latest') {
      tag = (await getJson(`https://api.github.com/repos/${repo}/releases/latest`)).tag_name;
      console.log(`Latest published release in ${repo}: ${tag}`);
    }
    manifest = await getJson(`https://github.com/${repo}/releases/download/${encodeURIComponent(tag)}/manifest.json`);
  }
  const entry = validate(manifest);
  const data = JSON.parse(await readFile(dataFile, 'utf8'));
  const others = (data.releases ?? []).filter((r) => r.tag !== entry.tag);
  data.releases = [entry, ...others].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  await writeFile(dataFile, JSON.stringify(data, null, 2) + '\n');
  console.log(`Imported ${entry.tag} (${entry.assets.length} files, ${entry.date}) into src/data/releases.json.`);
  console.log('Next: check it with `npm run dev`, then commit and push to deploy.');
}

main().catch((e) => { console.error('release:import failed:', e.message); process.exit(1); });
