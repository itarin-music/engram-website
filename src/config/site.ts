/**
 * Site-wide settings. This is the one file to edit for names, addresses and links.
 * Nothing here is secret: it all ends up in the public HTML.
 */
export const SITE = {
  name: 'Engram',
  byline: 'by Itarin',
  /** Canonical origin. Used for the sitemap, canonical links and robots.txt. */
  url: 'https://engram.itarin.online',
  tagline: 'A local-first study app: notes, flashcards, quizzes and practice in one place.',
  description:
    'Engram is a free, local-first study app for Windows, macOS and Linux. Write notes, turn them into flashcards with spaced repetition, quiz yourself, practise code and time your sessions. Your notes stay plain files on your computer.',

  /**
   * SUPPORT EMAIL: set this to the address you want people to write to.
   * While it is empty, the site shows a clearly marked "not set up yet" placeholder
   * instead of a mailto link, so nobody emails a made-up address.
   */
  supportEmail: '',

  /**
   * Public GitHub repository that holds release downloads (installers, checksums, manifest).
   * The app's source repository stays private; see RELEASING.md in the app repo.
   */
  releasesRepo: 'itarin-music/engram-releases',
} as const;

export const supportEmailSet = SITE.supportEmail.trim().length > 0;

/** Main navigation, used by the header and the footer. */
export const NAV = [
  { href: '/download/', label: 'Download' },
  { href: '/docs/', label: 'Docs' },
  { href: '/support/', label: 'Support' },
  { href: '/changelog/', label: 'Changelog' },
] as const;
