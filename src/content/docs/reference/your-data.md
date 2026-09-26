---
title: Your data, backups and moving computers
description: Where Engram stores your notes and cards, how to back them up, and how to move everything to a new computer.
order: 2
navTitle: Your data and backups
---

Engram keeps your study material on your own computer. There's no Engram cloud account holding a copy, so backups are in your hands. The good news: everything for a profile lives in one folder.

## Where your data is

Each profile has a folder, called its **vault**. Unless you chose another location, it's:

| System | Default vault folder |
| --- | --- |
| Windows | `C:\Users\<you>\Documents\Engram\<profile name>` |
| macOS | `/Users/<you>/Documents/Engram/<profile name>` |
| Linux | `~/Documents/Engram/<profile name>` |

To see the exact folder for a profile, open **Settings** (General tab) or **Profiles**.

Inside the vault:

- **Your notes**, as ordinary `.md` files in the folders you made.
- **Images and media** from imports, including an `_anki-media` folder if you imported Anki decks.
- **A hidden `.engram` folder** with `engram.db`, a database holding your decks, cards, review history, quizzes, tutor chats, code exercise progress, timer sessions, and this profile's theme, tutor and timer settings.

A few things are stored by the app itself rather than in a vault:

- the list of your profiles and where their folders are
- the name Engram greets you with
- your AI provider API key, if you ticked **Remember on this device**
- your Cloud backup subscription sign-in (see below)

These are small and easy to set up again, so the vault folders are what matter for backups.

## Back up

1. **Close Engram.** This makes sure everything has been written to disk.
2. Copy each profile's vault folder somewhere safe: an external drive, a USB stick, or a cloud-synced folder.

Copy the whole folder, including the hidden `.engram` folder inside it. Copying the vault folder itself (rather than the files inside it) takes care of this. On a Mac, press <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>.</kbd> in Finder to show hidden folders if you want to check.

Do this regularly. Engram doesn't make backups for you — unless you'd rather have a one-button version: [Cloud backup](/docs/features/cloud-backup/) is a paid add-on ($5/month, first month free) that zips a profile's notes and database and stores them for you, restorable from any computer.

> **About sync services:** keeping a vault inside a synced folder (such as OneDrive, iCloud Drive or Dropbox) works as a backup, but only use one computer at a time and let the sync finish before opening Engram elsewhere. Two computers editing the same database at once can conflict.

## Restore a backup

1. Close Engram.
2. Copy the backed-up vault folder back to where it was, replacing the old one.
3. Open Engram.

If the profile no longer appears in Engram, see the next section.

## Move to a new computer

1. On the old computer, close Engram and copy each vault folder to a USB drive or cloud storage.
2. On the new computer, [install Engram](/docs/getting-started/install/).
3. Copy the vault folders into your Documents folder (or anywhere inside your user folder).
4. Open Engram. If it's the first launch, you can press **Skip setup and use defaults** for now.
5. Go to **Profiles**, press **New profile**, give it a name, press **Browse** under the vault folder, and pick the folder you copied.
6. Press **Create**. Your notes, decks, review history and settings are all there.
7. Set up your AI provider key again in **Settings, Tutor & API key**, and sign in to the tutor add-on under **Settings, Plan** if you use it.

If you skipped setup in step 4, you can remove the empty "My Study" profile afterwards in **Profiles**.

## Removing data

- **Remove a profile** in Engram and its folder stays on disk untouched. Delete the folder yourself if you want it gone.
- **Uninstalling Engram** doesn't delete your vault folders either. See [Uninstall Engram](/download/#uninstall).
