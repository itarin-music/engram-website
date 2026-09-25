#!/usr/bin/env node
/**
 * Checks every internal link and asset in the built site (dist/), including #anchors.
 * Run after `npm run build`:   npm run check:links
 * External links are listed but not fetched, so the check works offline and doesn't
 * fail on release downloads that don't exist yet.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const exists = async (p) => stat(p).then(() => true, () => false);

async function resolveTarget(pathname) {
  let p = decodeURIComponent(pathname);
  const direct = join(dist, p);
  if (p.endsWith('/')) return (await exists(join(direct, 'index.html'))) ? join(direct, 'index.html') : null;
  if (await exists(direct) && !(await stat(direct)).isDirectory()) return direct;
  if (await exists(join(direct, 'index.html'))) return join(direct, 'index.html');
  return null;
}

const idsCache = new Map();
async function idsIn(file) {
  if (!idsCache.has(file)) {
    const html = await readFile(file, 'utf8');
    idsCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(file);
}

const files = (await walk(dist)).filter((f) => f.endsWith('.html'));
const problems = [];
const external = new Set();
let checked = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const page = '/' + relative(dist, file).replace(/\\/g, '/').replace(/index\.html$/, '');
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  const srcsets = [...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0]));
  for (const raw of [...refs, ...srcsets]) {
    if (/^(mailto:|tel:|data:|javascript:)/.test(raw)) continue;
    if (/^https?:\/\//.test(raw)) {
      if (!raw.startsWith('https://engram.itarin.online')) { external.add(raw); continue; }
    }
    const url = new URL(raw.replace('https://engram.itarin.online', ''), 'http://x' + page);
    checked++;
    const target = await resolveTarget(url.pathname);
    if (!target) { problems.push(`${page}: broken link ${raw}`); continue; }
    if (url.hash && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!(await idsIn(target)).has(id)) problems.push(`${page}: missing anchor ${raw}`);
    }
  }
}

console.log(`Checked ${checked} internal links and assets across ${files.length} pages.`);
console.log(`${external.size} external links (not fetched):`);
for (const e of [...external].sort()) console.log('  ' + e);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log('\nNo broken internal links or anchors.');
