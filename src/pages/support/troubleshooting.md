---
layout: ../../layouts/Markdown.astro
title: Troubleshooting
description: Fixes for the most common Engram problems, from install warnings and an app that won't open to missing notes and Cloud backup errors.
kicker: Support
lead: Find your problem below. Each section starts with the most likely cause.
---

**Jump to:** [Install warnings](#install-warnings) · [Engram won't open](#engram-wont-open) · [Lost or missing data](#lost-or-missing-data) · [Notes and cards](#notes-and-cards) · [Quizzes and Explain](#quizzes-and-explain) · [Import](#import) · [Code](#code) · [Timers](#timers) · [AI tutor](#ai-tutor) · [Cloud backup](#cloud-backup)

## Install warnings

### "Windows protected your PC"

This is Microsoft Defender SmartScreen. It appears because Engram's installer isn't code-signed yet. Click **More info**, then **Run anyway**. See the [Windows install steps](/download/#install-windows).

### My browser blocked or deleted the download

Some browsers flag files that few people have downloaded. In Microsoft Edge, open the **...** menu next to the download, choose **Keep**, then **Show more** and **Keep anyway**. In Chrome, open the downloads list and choose **Keep**. If you're unsure about the file, [check its checksum](/download/#verify) first.

### macOS says it can't verify the developer

Open **System Settings**, then **Privacy & Security**, scroll down and click **Open Anyway** next to the message about Engram. Then open Engram again. See the [macOS install steps](/download/#install-macos).

### macOS says Engram "is damaged and can't be opened"

The file is almost certainly fine. macOS shows this for some apps downloaded from the internet that aren't notarized by Apple. After [checking the checksum](/download/#verify), open **Terminal** and run:

```
xattr -dr com.apple.quarantine /Applications/Engram.app
```

### The Linux AppImage does nothing when I run it

Make sure it's executable (`chmod +x` on the file). On Ubuntu 22.04 and newer, AppImages also need FUSE 2: `sudo apt install libfuse2` (or `libfuse2t64` on Ubuntu 24.04).

### The .deb or .rpm won't install

Install it with your package manager so it can fetch what Engram needs, for example `sudo apt install ./Engram_<version>_amd64.deb`. Engram needs WebKitGTK 4.1, which older releases (such as Ubuntu 20.04) don't have. On those, check the [system requirements](/download/#requirements).

## Engram won't open

### Nothing happens on Windows, or the window is blank

Engram uses Microsoft Edge WebView2 to draw its window. It's part of Windows 11 and most Windows 10 PCs, but it can be missing or damaged. Download and install the **Evergreen WebView2 Runtime** from Microsoft's website, then open Engram again.

### It won't open on my Mac

- Check you downloaded the right file. The **Apple Silicon** build doesn't run on Intel Macs.
- If macOS shows a security message, follow the steps under [Install warnings](#install-warnings).

### "Setup failed: unknown path" on Linux

Engram saves notes in your Documents folder, and couldn't find where that is. This happens on Linux systems without the standard user folders set up. Run `xdg-user-dirs-update` in a terminal (install the `xdg-user-dirs` package first if needed), then try again.

### Engram shows "Could not start Engram"

This screen shows an error message and a **Reload** button. Press **Reload** first. If it keeps happening, the usual cause is that Engram can't read the active profile's folder, for example because it's on a drive that isn't connected. Reconnect the drive and press **Reload**. If that doesn't help, [report a bug](/support/report-a-bug/) and include the exact error message.

### A profile's folder won't open

Engram can only use vault folders inside your user folder, such as `Documents` or your home folder. If you pick a folder somewhere else (for example on a second drive), you may see an error mentioning a **forbidden path**. Move the folder into your user folder, then create a profile that points at its new location (**Profiles**, **New profile**, **Browse**).

## Lost or missing data

Don't panic, and don't delete anything yet. In most cases your notes are still on disk.

### My notes and cards have disappeared

1. **Check which profile is active.** Look at the **Profile** menu in the top bar. Your material may be in a different profile.
2. **Check the folder didn't move.** Open **Settings** and look at **Vault**, the folder this profile uses. If you moved, renamed or synced that folder somewhere else, or it's on a drive that's disconnected, Engram creates a new empty folder in the old location and shows it as empty. Close Engram, find your real folder, and either move it back (replacing the new empty one) or point a profile at it with **Profiles**, **New profile**, **Browse**.
3. **Look for the files.** Your notes are `.md` files in the vault folder. If they're there, Engram can open them again.

### I removed a profile by mistake

Removing a profile never deletes its folder. Create a new profile and use **Browse** to pick the same folder. Everything comes back, including review history.

### I deleted a note or a deck

Deleted notes are removed from disk permanently, not moved to the Recycle Bin or Trash. Deleting a deck deletes its cards and history. To get them back, restore the vault folder from a [backup](/docs/reference/your-data/#back-up), or from your system's file history (File History on Windows, Time Machine on macOS) if you use it.

### My cards are gone but my notes are fine

Cards live in the `.engram/engram.db` file inside the vault. If you copied only your notes (and not the hidden `.engram` folder) to a new place, the cards were left behind. Copy the whole vault folder, including `.engram`.

### My vault is in a synced folder and things look wrong

If two computers had the same vault open, the sync service may have created a "conflicted copy" of `engram.db`. Close Engram everywhere, find the conflicted file in the `.engram` folder, and keep the newer one (by date) as `engram.db`. Back up both first. From then on, only use the vault on one computer at a time.

## Notes and cards

### "Select some text in the note first, then press Make card"

Make card turns selected text into a card. Highlight a word or sentence in the editor or the preview, then press **Make card** or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd>.

### A link is red

The note it points to doesn't exist yet (or the name doesn't match). Click the link to create that note, or fix the spelling. Links match note names, not titles inside the note.

### I'm not getting new cards

Each deck introduces up to 20 new cards a day. Once you reach that, only reviews appear until tomorrow. Suspended cards (HOLD) also don't appear. Unsuspend them in **Decks**.

## Quizzes and Explain

### "This deck needs at least 3 usable cards" or "Not enough quiz material found"

The built-in generator needs facts to work with. Add more cards, or write lines like `Term: definition` and **bold** key terms in your notes. You can also choose **Tutor model** as the generator if you have an AI provider set up.

### Explain says there isn't enough text

Explain summarises full sentences. A note made only of headings, single words, bullet fragments or code doesn't have enough. Add a paragraph or two of normal sentences.

## Import

### The Import button is greyed out

The preview found cards you already have. Tick the confirmation box to continue. Duplicates are skipped either way.

### My imported notes went into the wrong profile

Imports always go into the profile that's active when you start them. Switch to the right profile and import again. To remove the unwanted notes, delete their folder (by default `Imported/<name>`) in the other profile's vault.

### My Anki package won't import

Engram reads `.apkg` exports and single-collection `.colpkg` backups. Backups containing several Anki profiles aren't supported. Export the deck you want from Anki as an `.apkg` instead.

## Code

### "Stopped after a few seconds: your code may contain an infinite loop"

Engram stops code that runs too long so it can't freeze the app. Look for a loop that never ends, then run it again.

### My TypeScript has a type error but it still runs

The sandbox removes TypeScript types and runs the code as JavaScript. It doesn't check types.

## Timers

### I don't hear a chime or get a notification

Check your computer's volume. For notifications, allow them for Engram in your system's notification settings. Engram asks for permission the first time you start a timer.

## AI tutor

### "Add your API key in Settings" or "Choose a model name"

Open **Settings**, **Tutor & API key**, fill in the missing field and press **Save**. Local servers (LM Studio, Ollama) don't need a key.

### "The API key was rejected (401)"

The key is wrong, expired or revoked. Create a new key with your provider, paste it in **Settings**, **Tutor & API key**, and save.

### "Rate limited or out of quota (429)"

Your provider is limiting requests or your account has run out of credit. Wait a moment, or check your usage and billing with the provider. This is between you and the provider, not Engram.

### "Could not reach ..." with LM Studio or Ollama

The local server isn't running, or the address is wrong.

- **LM Studio:** open the Developer tab, load a model and start the server. The default address is `http://localhost:1234/v1`.
- **Ollama:** make sure Ollama is running. The default address is `http://localhost:11434/v1`.

Then press **Detect models** and **Test connection**.

## Cloud backup

The tutor chat is free and never needs sign-in or payment. Everything below is about the separate, optional Cloud backup subscription (Settings, Backup, or the [Subscription](/subscription/) page on this site).

### My sign-in code didn't arrive

Check your spam or junk folder. Codes expire after 10 minutes. You can request a new one after about 45 seconds. Make sure the email address is spelled correctly.

### "Incorrect code" or "Too many attempts"

Use the code from the most recent email. After too many wrong tries, press **Resend code** to get a new one.

### I paid but Cloud backup is still locked

Come back to Engram (or the Subscription page) after finishing checkout and press **I've paid, check now** (or **Refresh status** on the website). It can take a few seconds for the payment to be confirmed. Make sure you signed in with the same email you used at checkout.

### It says my payment is past due

Your last payment didn't go through. Press **Manage subscription** and update your card.

### Cloud backup locked itself while I was offline

Engram needs to confirm your subscription at least every 4 days. Connect to the internet and open Settings, Backup. It unlocks once the check succeeds.

### It says this build has no billing server configured

Official Engram downloads shouldn't show this. If you see it, please [report a bug](/support/report-a-bug/) and include the version you installed.

## Still stuck?

[Report a bug](/support/report-a-bug/) or see [how to contact support](/support/#contact).
