# Engram website

The official website for Engram by Itarin, served at **https://engram.itarin.online**: the home page, downloads, changelog, docs, support, and the legal pages.

It's a static site built with [Astro](https://astro.build). Every page is plain HTML generated at build time. The only JavaScript is the mobile menu, the operating system detection on the Download page, and the docs search ([Pagefind](https://pagefind.app), which runs entirely in the browser). There are no analytics, cookies, trackers or third-party embeds.

## Website

Everything below is written for one person maintaining the site.

### Local development

You need Node.js 22 or newer.

```bash
npm install
npm run dev            # http://localhost:4321, reloads as you edit
```

Other commands:

| Command | What it does |
| --- | --- |
| `npm run dev:sample` | Dev server using **fake sample releases**, to see the "release available" state of the Download and Changelog pages. |
| `npm run build` | Type-checks, builds the site into `dist/`, and builds the search index. This is what the host runs. |
| `npm run preview` | Serves the built `dist/` folder. **Search only works here**, not in `npm run dev`, because the index is made at build time. |
| `npm run check:links` | After a build, checks every internal link, image and `#anchor` in `dist/`. |
| `npm run build:sample` | A full build with the sample releases, for testing. Never deploy this. |
| `npm run release:import -- v1.2.0` | Pulls a published release into the site. See "Cutting a release". |

Where things live:

```
src/config/site.ts        name, URL, support email, releases repo. Start here.
src/data/releases.json    every version shown anywhere on the site (don't hand-edit)
src/content/docs/         the docs, one markdown file per page
src/pages/                home, download, changelog, support, privacy, terms, 404
src/assets/shots/         screenshots of the app (optimised to AVIF/WebP at build time)
src/styles/global.css     colours and fonts, copied from the app's Modern Dark / Modern Light packs
public/                   files copied as-is: favicon, robots.txt
.github/workflows/        deploy.yml publishes the site to GitHub Pages
scripts/                  release import and link checker
```

**Support email:** set `supportEmail` in `src/config/site.ts`. Until you do, the Support and Report a bug pages show a clearly marked "[support email not set up yet]" placeholder instead of an email link.

**Colours:** the tokens at the top of `src/styles/global.css` are the app's Modern Dark pack (and Modern Light for people whose system is set to light mode). If you change those packs in the app (`src/core/theme/packs.ts`), copy the new values here.

### Adding or changing a docs page

1. Create a markdown file in the right folder of `src/content/docs/`:
   - `getting-started/`, `features/` or `reference/` (these are the sidebar sections).
2. Start it with this frontmatter:

   ```markdown
   ---
   title: Flashcard decks
   description: One sentence that appears under the title, in search results and in Google.
   order: 3
   navTitle: Decks        # optional, a shorter sidebar label
   ---
   ```

   `order` sets its position in the sidebar section. Previous/next links, the sidebar, search and the sitemap update automatically. Pages with three or more `##` headings get an "On this page" table of contents.
3. Write in normal markdown. For a screenshot, put the PNG in `src/assets/shots/` and reference it relatively. Always write meaningful alt text:

   ```markdown
   ![The Study screen with the four rating buttons](../../../assets/shots/study-card.png)
   ```

4. Link to other docs with their URL, like `/docs/features/study/`. Run `npm run build && npm run check:links` to catch broken links.

To add a new sidebar section, add it to `SECTIONS` in `src/lib/docs.ts` and create the matching folder.

**Screenshots** must be real. The current ones were captured from the app's web build with sample content. If the app's UI changes, retake the affected ones at 1440x900 (2x scale) and replace the files with the same names.

**Keep the docs true.** Only document what the app actually does, and check the code when unsure.

### Cutting a release

Installers are built by the app repo's GitHub Actions workflow and published to the public repo `itarin-music/engram-releases`. The full procedure, including one-time setup, is in **RELEASING.md in the app repo**. The website part:

1. After you press **Publish release** on GitHub, run:

   ```bash
   npm run release:import -- v1.2.0      # or: npm run release:import -- latest
   ```

   This downloads the release's `manifest.json` (file names, sizes, SHA-256 checksums, date and release notes) and adds it to `src/data/releases.json`. Running it twice for the same tag just replaces that entry.
2. Check it: `npm run dev`, then open `/download/` and `/changelog/`.
3. Commit `src/data/releases.json` and push. The site redeploys.

Every version number, date, size and checksum on the site comes from that one file. With an empty `releases` list, the site shows a "coming soon" state everywhere and never links to files that don't exist.

### Deploying (GitHub Pages)

The site is hosted free on GitHub Pages with HTTPS. `.github/workflows/deploy.yml` builds it (type check, site, search index, link check) and publishes it on every push to `main`. A push to any other branch doesn't change the live site.

One-time setup:

1. **Create the repository.** On GitHub, create a new repository under `itarin-music` called `engram-website`. Make it **Public** (GitHub Pages on the free plan only works for public repos; nothing in this repo is secret). Don't add a README, licence or .gitignore, because this folder already has them.
2. **Push this folder.** In PowerShell or Terminal, inside this folder:

   ```bash
   git remote add origin https://github.com/itarin-music/engram-website.git
   git push -u origin main site-v1
   ```

3. **Turn on Pages.** In the repository, open **Settings**, then **Pages**. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. **Run the first deploy.** Open the **Actions** tab, choose **Deploy website**, then **Run workflow** (or push any commit to `main`). It takes about two minutes. Until the custom domain below is set up, the site's styles and links won't work at the temporary `itarin-music.github.io/engram-website/` address, because the site is built for the root of its own domain. That's expected.

After that, every push to `main` redeploys automatically. Missing pages show `404.html`.

### DNS: pointing engram.itarin.online at the site

This adds **one** DNS record, `engram`. It doesn't touch `itarin.online` itself, `www`, email records or any other subdomain, so you can keep hosting whatever you like on the main domain.

1. **Verify the domain with GitHub (recommended, stops anyone else claiming your subdomains on GitHub Pages).** Open the settings of whoever owns the repo (your profile's **Settings**, or the organization's **Settings** if `itarin-music` is an organization), then **Pages**, then **Add a domain**. Enter `itarin.online`. GitHub shows a TXT record. In Cloudflare, open `itarin.online`, then **DNS**, then **Records**, and add that TXT record exactly as shown. Back on GitHub, press **Verify**.
2. **Add the subdomain record in Cloudflare.** In **DNS**, **Records**, choose **Add record**:
   - **Type:** `CNAME`
   - **Name:** `engram`
   - **Target:** `itarin-music.github.io`
   - **Proxy status:** **DNS only** (grey cloud). GitHub needs to see the request directly to issue the HTTPS certificate.

   Save.
3. **Tell GitHub about the domain.** In the `engram-website` repository, open **Settings**, then **Pages**. Under **Custom domain**, enter `engram.itarin.online` and press **Save**. Wait for the DNS check to go green.
4. **Turn on HTTPS.** Once GitHub has issued the certificate (usually a few minutes, occasionally up to a day), tick **Enforce HTTPS** on the same page.

To check it: `https://engram.itarin.online` should load with a valid certificate, and `https://engram.itarin.online/sitemap-index.xml` should list the pages.

If the domain check fails, the usual causes are a typo in the CNAME target, the record being proxied (orange cloud) instead of DNS only, or DNS not having updated yet (wait a few minutes and press **Check again**).

### Search engines

The site builds `sitemap-index.xml` automatically, and `public/robots.txt` points to it. Every page has its own title, description and canonical URL. The 404 page is excluded. Optionally, add the site in Google Search Console and Bing Webmaster Tools and submit the sitemap.

If the domain ever changes, update `site` in `astro.config.mjs`, `url` in `src/config/site.ts`, and the sitemap line in `public/robots.txt`.

### Analytics (optional, not installed)

The site has no analytics on purpose. If you ever want visitor counts without tracking people, cookie-free options include Cloudflare Web Analytics, Plausible or GoatCounter. Each needs a small script added to `src/layouts/Base.astro`. Adding any of them means updating the privacy policy and the "no analytics" statements on the site.
