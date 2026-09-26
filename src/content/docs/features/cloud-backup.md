---
title: Cloud backup
description: A manual, one-slot cloud backup for your profile. Paid add-on, first month free.
order: 11
---

Cloud backup is Engram's one paid feature: a manual snapshot of one profile's notes and database, stored so you can restore it on another computer or after reinstalling. It's not the tutor chat, which is free — see [AI tutor](/docs/features/tutor/) for that.

## What it is

- **"Back up now"** zips this profile's notes and its whole local database (decks, cards, review history, quizzes, chats, timer log, settings) and uploads it, replacing whatever was stored before.
- **"Restore from backup"** downloads that snapshot and replaces everything on the current computer with it — useful for moving to a new machine or recovering after reinstalling.
- It's deliberately not live sync: one slot, no version history, no merging, and nothing happens automatically. It only runs when you press the button.

Open it from **Settings, Backup**.

## Price

**$5 a month, with the first month free.** Cancel any time. This is Engram's only paid feature — everything else, including the tutor chat, is free regardless of whether you subscribe to this.

## Subscribe

1. Open **Settings, Backup**.
2. Enter your email and press **Send code**. Engram emails you a one-time code, which expires after 10 minutes.
3. Enter the code and press **Verify**.
4. Press **Start free month**. Stripe's secure checkout opens in your web browser.
5. Finish checkout, then come back to Engram. It checks automatically. You can also press **I've paid, check now**.

Your email is only used to match your subscription to this computer. It isn't a study profile and has nothing to do with your notes.

You can also sign in and manage this subscription from a web browser, without opening Engram at all — see [Subscription](/subscription/) on this site.

### Manage or cancel

**Manage subscription** (in **Settings, Backup**) opens Stripe's customer portal in your browser, where you can update your card or cancel. If you cancel, backup stays unlocked until the end of the period you've paid for.

### Offline

Engram re-checks your subscription in the background about every 12 hours while it's open. If it can't reach the subscription server (for example, you're offline), backup keeps working for up to 4 days since the last successful check, then locks until Engram can check again.

## What gets uploaded, and where

A backup contains this profile's notes (as plain files) and its whole local database, zipped together. It's uploaded to Engram's billing server and stored as one object per subscriber — the one exception to Engram otherwise never touching a server on its own. Nothing is uploaded unless you press **Back up now** yourself.
