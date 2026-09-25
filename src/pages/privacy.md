---
layout: ../layouts/Markdown.astro
title: Privacy policy
description: How Engram and this website handle your data, in plain English. Draft for review.
kicker: Legal
lead: The short version. Your notes and cards stay on your computer, and Engram doesn't track you. The optional tutor subscription needs your email address, and the AI provider you choose receives what you send it.
draft: true
updated: September 25, 2026
searchable: false
---

This policy covers the Engram desktop app, the optional tutor subscription, and this website (engram.itarin.online). Engram is made by Itarin ("we", "us"). Items shown like <span class="placeholder">[this]</span> are decisions still to be made.

## Summary

- **Your study material stays on your computer.** Notes, cards, review history, quizzes, chats, code and timer logs are stored in folders on your own computer. We never receive them.
- **No tracking.** The app and this website have no analytics, telemetry, advertising, cookies or crash reporting.
- **The AI tutor talks to a provider you choose.** When you use it, your messages and anything you attach go straight from your computer to that provider.
- **The tutor subscription needs your email address.** We use it to send you a sign-in code and to match your subscription. Payments are handled by Stripe. We never see your card details.

## The Engram app

### What stays on your computer

Everything you create in Engram is saved on your computer, in each profile's folder (its "vault") and in the app's own local storage. That includes notes, flashcards, review history, quizzes and results, tutor chat history, code exercise progress, timer sessions, themes and settings. See [Your data](/docs/reference/your-data/) for exactly where.

We have no copy of any of it and can't recover it for you. Backups are up to you.

### When the app connects to the internet

Engram only connects to the internet for the features below, and only when you use them.

**1. The AI provider you configure.** When you use the tutor chat, generate a quiz with the tutor model, press **Test connection** or press **Detect models**, Engram sends a request directly from your computer to the address in **Settings, Tutor & API key**. A chat request contains:

- your message and the recent messages in that chat
- the note, selected text or deck (up to 40 cards) you attached
- instructions that tell the model how to behave, including any extra instructions you wrote
- the model name and settings, and your API key (to prove to the provider that the request is yours)

That provider handles the data under its own privacy policy and terms. We don't see it and it doesn't pass through our servers. If you use a local model (LM Studio or Ollama on your own computer), the data doesn't leave your computer at all.

Your API key is kept only for the current session unless you tick **Remember on this device**, in which case it's saved in plain text in the app's local storage on your computer. It is never sent to us.

**2. The tutor subscription service**, if you sign in to subscribe. It's run by us on Cloudflare. It is used to:

- **Send a one-time sign-in code** to the email address you enter. The email is delivered by Resend, an email delivery service. The code is stored for up to 10 minutes.
- **Keep a subscription record** for your email address: the address itself, an identifier derived from it, your Stripe customer and subscription identifiers, your subscription status, the end of your current billing period, and when the record was last updated.
- **Start checkout and the customer portal** with Stripe, which open in your web browser.

The subscription service never receives your notes, cards, chats or API key.

**3. Stripe**, for payments. Stripe collects your payment details directly. We receive from Stripe your customer identifier, subscription status and billing period, and the email address used at checkout. Stripe's privacy policy covers what Stripe does with your data.

On your computer, Engram keeps a sign-in token (valid for 30 days) and a signed record of your subscription status (valid for 4 days) so the tutor keeps working when you're briefly offline.

Engram makes no other connections. It doesn't check for updates, report errors, or send usage statistics.

## This website

This website is a set of static pages. It sets no cookies, runs no analytics, and loads nothing from third parties. Fonts are served from this site. Search runs entirely in your browser.

- **Hosting.** The site is hosted by <span class="placeholder">[Cloudflare Pages]</span>. Like any web host, it processes technical information such as your IP address and browser type to deliver pages and protect against abuse, under its own privacy policy. We don't use this information to identify or track you.
- **Downloads.** Installer files are downloaded from GitHub (github.com), so GitHub's privacy statement applies to those downloads.
- **Operating system detection.** The Download page checks which operating system your browser reports, to suggest the right file. This happens in your browser and isn't sent anywhere.

## Emailing us

If you email support, we receive your email address and whatever you include. We use it only to reply and to fix the problem you report. Please don't send API keys, passwords or payment details.

## How long we keep data

- Sign-in codes: up to 10 minutes.
- Subscription records: while you have a subscription, and afterwards for <span class="placeholder">[period to decide, for example as long as needed for billing, tax and legal records]</span>.
- Support emails: <span class="placeholder">[period to decide]</span>.

## Your choices and rights

- You can use every part of Engram except the tutor chat without giving us any personal data.
- You can cancel your subscription at any time through **Manage subscription**.
- You can ask us to access, correct or delete the subscription record or emails we hold about you by contacting us. Some billing records may need to be kept for legal reasons. Records held by Stripe are covered by Stripe's policy.
- Depending on where you live, you may have further rights under laws such as the GDPR or CCPA. <span class="placeholder">[Review which laws apply]</span>

## Children

Engram isn't directed at children under 13, and the tutor subscription requires a payment method. We don't knowingly collect personal data from children. <span class="placeholder">[Confirm the right age for the countries you serve]</span>

## Changes to this policy

If this policy changes, we'll update this page and the date at the top, and point out significant changes on this website.

## Contact

Questions about privacy: see [Contact](/support/#contact).
