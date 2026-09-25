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
public/                   files copied as-is: favicon, robots.txt, _headers
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

### Deploying (Cloudflare Pages)

Cloudflare Pages is free for a site like this, provides HTTPS, deploys every push automatically, and gives every other branch its own preview URL. Engram's billing Worker is already on Cloudflare, so everything stays in one account.

One-time setup:

1. Push this folder to a GitHub repository (it can be private), for example `itarin-music/engram-website`.
2. In the Cloudflare dashboard, open **Workers & Pages**, then **Create**, choose the **Pages** tab and **Connect to Git**. (If Cloudflare suggests a Worker instead, look for "Pages" or "Looking to deploy Pages?".)
3. Pick the repository, then set:
   - **Production branch:** `main`
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - Node version: picked up from the `.node-version` file (22). If the build uses an older Node, add an environment variable `NODE_VERSION` = `22`.
4. **Save and Deploy.** The site appears at `https://<project-name>.pages.dev`.

After that, every push to `main` deploys to production, and every push to another branch gets a preview URL. `public/_headers` sets security and caching headers, and `dist/404.html` is used for missing pages automatically.

### DNS: pointing engram.itarin.online at the site

This adds **one** DNS record, `engram`, and doesn't touch `itarin.online` itself or any other subdomain or email record.

Because `itarin.online` already uses Cloudflare DNS:

1. Open the Pages project, then **Custom domains**, then **Set up a custom domain**.
2. Enter `engram.itarin.online` and continue.
3. Cloudflare shows the record it will add (a CNAME from `engram` to `<project-name>.pages.dev`). Choose **Activate domain**.
4. Wait a few minutes. The domain shows **Active** once the HTTPS certificate is issued.

Do it in this order. If you create the CNAME yourself before adding the custom domain in Pages, requests fail with an error until the domain is added in the Pages project.

If you ever need to set the record by hand (for example after moving DNS elsewhere): add a **CNAME** record with name `engram` and target `<project-name>.pages.dev` (proxied, if on Cloudflare), and still add the custom domain in the Pages project.

To check it: `https://engram.itarin.online` should load with a valid certificate, and `https://engram.itarin.online/sitemap-index.xml` should list the pages.

### Search engines

The site builds `sitemap-index.xml` automatically, and `public/robots.txt` points to it. Every page has its own title, description and canonical URL. The 404 page is excluded. Optionally, add the site in Google Search Console and Bing Webmaster Tools and submit the sitemap.

If the domain ever changes, update `site` in `astro.config.mjs`, `url` in `src/config/site.ts`, and the sitemap line in `public/robots.txt`.

### Analytics (optional, not installed)

The site has no analytics on purpose. If you ever want visitor counts without tracking people, cookie-free options include Cloudflare Web Analytics (can be turned on in the Pages project without code changes), Plausible or GoatCounter. Adding any of them means updating the privacy policy and the "no analytics" statements on the site.
