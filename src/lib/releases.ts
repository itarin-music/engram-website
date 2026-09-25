/**
 * Release data for the whole site. Every page that shows a version, date, size or checksum
 * reads it from here, and this module reads it from one JSON file:
 *
 *   src/data/releases.json          the real data (filled by `npm run release:import`)
 *   src/data/sample-releases.json   fake data, only when built with `--mode sample`
 *
 * The data is validated at build time, so a malformed entry fails the build instead of
 * shipping a broken download link.
 */
import real from '../data/releases.json';
import sample from '../data/sample-releases.json';
import { SITE } from '../config/site';

export type Platform = 'windows' | 'macos' | 'linux';
export type Format = 'exe' | 'msi' | 'dmg' | 'appimage' | 'deb' | 'rpm';

export interface Asset {
  platform: Platform;
  arch: 'x64' | 'aarch64';
  format: Format;
  file: string;
  size: number;
  sha256: string;
  /** Optional override. By default the URL is built from the releases repo, tag and file name. */
  url?: string;
}

export interface Release {
  version: string;
  tag: string;
  /** YYYY-MM-DD */
  date: string;
  /** Markdown release notes. */
  notes: string;
  assets: Asset[];
}

export const USING_SAMPLE = import.meta.env.MODE === 'sample';

const PLATFORMS: Platform[] = ['windows', 'macos', 'linux'];
const FORMATS: Format[] = ['exe', 'msi', 'dmg', 'appimage', 'deb', 'rpm'];

function validate(list: unknown): Release[] {
  if (!Array.isArray(list)) throw new Error('releases.json: "releases" must be an array');
  return list.map((r: any, i) => {
    const where = `releases.json entry ${i} (${r?.tag ?? '?'})`;
    for (const k of ['version', 'tag', 'date', 'notes']) {
      if (typeof r?.[k] !== 'string') throw new Error(`${where}: missing "${k}"`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date)) throw new Error(`${where}: date must be YYYY-MM-DD`);
    if (!Array.isArray(r.assets)) throw new Error(`${where}: "assets" must be an array`);
    for (const a of r.assets) {
      if (!PLATFORMS.includes(a.platform)) throw new Error(`${where}: unknown platform ${a.platform}`);
      if (!FORMATS.includes(a.format)) throw new Error(`${where}: unknown format ${a.format}`);
      if (typeof a.file !== 'string' || !a.file) throw new Error(`${where}: asset without a file name`);
      if (!Number.isFinite(a.size) || a.size <= 0) throw new Error(`${where}: ${a.file} has no size`);
      if (!/^[0-9a-f]{64}$/.test(a.sha256)) throw new Error(`${where}: ${a.file} has no valid SHA-256`);
    }
    return r as Release;
  });
}

const data = validate((USING_SAMPLE ? sample : real).releases);

/** Newest first. */
export const releases: Release[] = [...data].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
export const latest: Release | null = releases[0] ?? null;

export function assetUrl(r: Release, a: Asset): string {
  return a.url ?? `https://github.com/${SITE.releasesRepo}/releases/download/${encodeURIComponent(r.tag)}/${encodeURIComponent(a.file)}`;
}

export function releasePageUrl(r: Release): string {
  return `https://github.com/${SITE.releasesRepo}/releases/tag/${encodeURIComponent(r.tag)}`;
}

export function checksumsUrl(r: Release): string {
  return `https://github.com/${SITE.releasesRepo}/releases/download/${encodeURIComponent(r.tag)}/SHA256SUMS.txt`;
}

export const PLATFORM_INFO: Record<Platform, { name: string; short: string }> = {
  windows: { name: 'Windows', short: 'Windows 10 and 11, 64-bit' },
  macos: { name: 'macOS', short: 'macOS 10.15 or later' },
  linux: { name: 'Linux', short: '64-bit x86 (x86_64)' },
};

/** Display order inside a platform, recommended first. */
const ORDER: Record<string, number> = {
  'exe-x64': 0, 'msi-x64': 1,
  'dmg-aarch64': 0, 'dmg-x64': 1,
  'appimage-x64': 0, 'deb-x64': 1, 'rpm-x64': 2,
};

export function assetLabel(a: Asset): { title: string; detail: string } {
  switch (a.format) {
    case 'exe': return { title: 'Installer (.exe)', detail: 'Recommended for most people' };
    case 'msi': return { title: 'MSI package (.msi)', detail: 'For managed or scripted installs' };
    case 'dmg': return a.arch === 'aarch64'
      ? { title: 'Apple Silicon (.dmg)', detail: 'M1, M2, M3, M4 and newer Macs' }
      : { title: 'Intel (.dmg)', detail: 'Macs with an Intel processor' };
    case 'appimage': return { title: 'AppImage', detail: 'Runs on most distributions, no install needed' };
    case 'deb': return { title: 'Debian package (.deb)', detail: 'Ubuntu, Debian, Linux Mint, Pop!_OS' };
    case 'rpm': return { title: 'RPM package (.rpm)', detail: 'Fedora, openSUSE, RHEL' };
  }
}

export function assetsFor(r: Release, p: Platform): Asset[] {
  return r.assets.filter((a) => a.platform === p).sort((x, y) => (ORDER[`${x.format}-${x.arch}`] ?? 9) - (ORDER[`${y.format}-${y.arch}`] ?? 9));
}

export function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export const PLATFORMS_ORDER = PLATFORMS;
