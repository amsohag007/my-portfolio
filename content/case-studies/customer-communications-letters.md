---
title: "Customer Communications, Part 2: Physical Letters"
permalink: /customer-communications-letters/
description: Printed and posted letters as a second channel on the email platform, through the Pingen print-and-mail API, with per-merchant cost and delivery tracking.
image: /customer-communications-letters/architecture.png
---

[← All case studies](../)

# Customer Communications, Part 2: Physical Letters

*Case study by Musa*

Printed and posted letters as a second channel on the email platform from [Part 1](../customer-communications-email/), through the Pingen print-and-mail API, with per-merchant cost and delivery tracking.

> **In short**
>
> **Problem:** Merchants wanted to post real letters, where every send costs money and can't be undone once printed.  
> **What I built:** Physical letters as a second channel on the same rules as email, priced per country, capped by a budget and tracked to delivery.  
> **Result:** Merchants send branded letters the same way they send email, with spend under control.

**At a glance:** one rule, two channels · HTML to PDF in-house · signed delivery webhooks · per-country pricing and budgets · ~190 automated tests · live letters sent through the provider's sandbox

- **Role:** Lead and sole engineer
- **Timeline:** About 1 month, 2026
- **Stack:** Python, Django, Celery, PostgreSQL, Gotenberg (HTML to PDF), Pingen API, Next.js

## Overview

Part 1 built an event-driven email platform for a multi-tenant SEPA Direct Debit SaaS. This part adds physical letters to the same platform: a merchant can now choose email or letter for the same rule.

A letter is rendered from a template to PDF, sent with the recipient's address to Pingen, printed and posted. Each letter's cost is charged to the merchant who sent it, and its postal delivery is tracked back into the send log.

The letter channel reuses the rules, dispatcher and dedup from Part 1, so letters inherit the same safety guarantees as email.

## The problem

Merchants wanted to send real letters, such as a welcome letter for a new subscription, without leaving the platform.

- Paper costs real money per letter, so every send must be priced, attributed to a merchant and capped.
- A wrong or incomplete address wastes money and can't be undone once printed.
- Postal delivery takes days, so status must be tracked long after the send.
- Letters must look like the merchant's own, with their branding, not the provider's.
- Merchants should manage email and letters the same way, not learn a second system.

## What I built

A letter channel that:

- adds a channel choice to the existing rules, so one rule can send email or a letter;
- renders letter templates to PDF in-house and places the recipient address exactly where the provider reads it;
- submits through one platform-owned Pingen account and re-bills each merchant at a price set per destination country;
- caps each merchant's spend with a budget checked before every letter;
- tracks submission and postal delivery separately, through signed webhooks and a reconcile command;
- appears as an Email | Letter switch on the same rules, templates, send log and channel settings, fully white-labelled.

## Architecture

A letter is checked and priced before anything is printed, then tracked until it arrives.

![Architecture: every letter is checked and priced before it is printed](architecture.png)

When a letter rule fires, the address is checked and the budget and destination price are applied first. The PDF is rendered in-house and uploaded to Pingen, and a write-once record stores cost and price. Delivery comes back through signed webhooks, and a reconcile command pulls anything they missed through the same status mapping.

## The address the provider couldn't see

The first live sandbox letter was rejected for a wrong postcode, although the address data was correct. Pingen ignores the structured address fields and reads the recipient from the PDF itself, in a fixed window on the page. Our template had no country line there, so it guessed the wrong country.

I split each letter into a system frame and merchant content. The platform now places the recipient block, country included, in the exact address window in millimetres, keeps the franking zone clear and adds a fixed letterhead. Merchant templates hold only the body, so no template can break addressing again.

## Choosing a provider

I compared four print-and-mail providers on API quality, delivery webhooks, print location and contract terms. Pingen won: OAuth2 API, PDF upload, real delivery webhooks and printing in Germany, close to the merchants' customers. The adapter sits behind a provider-neutral interface, like the payment adapters, so another provider can be added later.

## Rendering and addressing

- **HTML to PDF in-house:** templates render to HTML and a self-hosted Gotenberg service (headless Chromium) turns them into PDF. This kept heavy native libraries out of the app servers and kept personal data inside the platform.
- **Fail before paying:** a letter needs a full name, address line, postcode, city and country; anything missing stops the send before money is spent.
- **Branding:** each template can carry a logo (size- and type-checked) and a colour or greyscale print setting.
- **Preview:** an A4-framed preview shows exactly what will be printed.

## Cost, pricing and budgets

- **One platform account:** the platform holds one Pingen account and re-bills merchants, instead of each merchant signing up with the provider.
- **Per-country pricing:** price policies resolve by merchant and destination country, most specific first, with flat, cost-plus-percent or cost-plus-fee modes and an optional cap.
- **Write-once records:** each letter stores its provider cost and billed price at send time, so later price changes never rewrite history.
- **Budgets:** a per-merchant spend cap, checked before every submission, reusing the rolling-window logic from payment gateway caps.

## Delivery tracking

- **Signed webhooks:** a public receiver verifies an HMAC-SHA256 signature on the raw body, finds the account, then the tenant through a shared routing index, and logs every event.
- **Two statuses:** submission (pending, submitting, submitted) and postal delivery (sent, delivered, undeliverable) are tracked separately; delivery only moves forward, so repeated events are harmless.
- **Reconcile:** a command pulls delivery status from the API through the same mapping, for anything a webhook missed.

## One platform, two channels

- **Unified experience, separate models:** email and letter templates stay separate so email can't regress, but rules, profiles and screens are shared.
- **Email | Letter switch:** rules gain a channel field, and templates, send log and channel settings each show one switch.
- **White-label:** no provider name is visible to merchants; settings show only what a merchant needs.
- **Per-tenant switch:** one setting hides every letter screen for merchants who don't use letters.

## Security and safety by design

Every letter costs money and can't be recalled, so each layer stops a bad send before it is paid for.

| Layer | Control |
| --- | --- |
| Provider credentials | One platform account in the shared schema, credentials encrypted; merchants never see them |
| Webhook authenticity | HMAC-SHA256 signature on the raw body, compared in constant time; every event logged |
| Tenant routing | Webhooks find their tenant through a shared index, never from payload data alone |
| Address quality | Incomplete addresses stop the send; the system, not the merchant template, places the address |
| Spend | Per-country prices and a per-merchant budget are checked before every submission |
| Billing integrity | Cost and price are stored once at send time and never rewritten |
| Environment | The account's own test-mode flag selects sandbox or live; nothing is hard-coded |
| Personal data | PDFs are rendered in-house; only the finished letter goes to the provider |
| Rollout | A per-tenant switch hides letters entirely; a feature flag controls the channel |

## Key engineering decisions

### Provider and rendering

| Decision | Why | Trade-off |
| --- | --- | --- |
| One platform-owned provider account | Merchants send letters without a provider contract; the platform re-bills them | The platform carries the provider bill |
| Provider-neutral adapter | Another print provider can be added without touching the channel | An abstraction layer to maintain |
| Self-hosted HTML-to-PDF service | Slim app servers, no native libraries, personal data stays in-house | One more internal service to deploy |
| System frame, merchant body | Addressing and franking can't be broken by a template | Less layout freedom for merchants |
| Fail before paying | Incomplete addresses never reach the printer | Some letters wait for data cleanup |

### Billing and experience

| Decision | Why | Trade-off |
| --- | --- | --- |
| Price by destination country | Postage really differs by country | More policies to manage |
| Write-once cost snapshot | Invoices never change after the fact | Actual provider cost corrections are deferred |
| Separate submission and delivery status | Merchants see both "sent to printer" and "arrived" | Two columns instead of one |
| Unify the experience, keep models separate | One way to work for merchants, zero risk to email | Two template models behind one screen |
| White-label everything | Letters belong to the merchant's brand | Provider details live only in platform admin |

## Development and ownership

I owned the letter channel from provider research to code in production, on top of the email platform I had built earlier.

- Compared providers and recommended Pingen; agreed the platform-account model with the product owner.
- Built the adapter, rendering, addressing, pricing, budgets, webhooks, reconcile, admin, API and merchant screens.
- Unified email and letters into one experience, then turned merchant feedback into a white-label, simpler settings round.
- Made the deployment ready: the PDF service added to the hosted app, and setup steps for live credentials and webhooks.

## Testing and validation

- About 190 automated tests across the milestones, plus frame, reconcile and regression tests for each bug found.
- Live letters sent through the provider's sandbox from the deployed development environment, reaching "sent" within one to two minutes.
- A multi-agent review that caught an account lookup my own smoke test missed.

### The bugs only real traffic found

Three issues passed every unit test. Real delivery webhooks used a different shape than the test fixture, so every event was rejected until I fixed the parser and logged raw payloads on every early exit; a stuck letter then healed itself on the provider's retry. Background jobs read a placeholder tenant with no settings, so letter rules were silently skipped outside web requests. And the account lookup was hard-wired to the sandbox, which would have blocked every production letter; the account's own test-mode flag now decides.

## Outcome

Merchants can send branded, white-labelled letters from the same rules as their emails, priced per destination and capped by a budget, with delivery tracked to the door. The channel is merged and deployed.

## Takeaways

1. **Read what the provider reads.** The address in the PDF mattered more than the address in the API call.
2. **Separate what the system guarantees from what users customise.** A fixed frame made every template safe.
3. **Price at send time and never rewrite.** Billing history must be stable.
4. **Test with real webhooks.** Fixtures encode your assumptions, not the provider's payload.
5. **Never hard-code an environment.** Let configuration decide sandbox or live.

**Previous:** [Part 1: Email](../customer-communications-email/), the platform these letters are built on.
