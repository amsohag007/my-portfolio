---
title: "Customer Communications, Part 1: Email"
permalink: /customer-communications-email/
description: Event-driven transactional email for a multi-tenant SEPA Direct Debit SaaS, sent through each merchant's own mail server.
image: /customer-communications-email/architecture.png
---

[← All case studies](../)

# Customer Communications, Part 1: Email

*Case study by Musa*

Event-driven transactional email for a multi-tenant SEPA Direct Debit SaaS, sent through each merchant's own mail server.

> **In short**
>
> **Problem:** Merchants needed branded customer email, and a pre-notification before each SEPA debit is a legal duty.  
> **What I built:** Event-driven email through each merchant's own mail server, with rules per event, safe unsubscribes and automatic data purging.  
> **Result:** Running in production: legally required notices can't be switched off, and every send is traceable.

**At a glance:** ~37 events in 8 categories · SEPA pre-notifications by law · merchant-owned SMTP · 8 tenant-tagged metrics · 76/76 E2E passing (1 skipped) · GDPR purge

- **Role:** Lead and sole engineer
- **Timeline:** About 3 months, 2026
- **Stack:** Python, Django, Celery, Redis, PostgreSQL, Jinja2, Datadog, Playwright

## Overview

Before this project the platform sent customers no email at all. Every merchant had to build their own notices, including the SEPA pre-notification the law requires before each debit.

I built a communications platform inside the product. Business events, such as an order completing or a rebill coming up, trigger branded emails that each merchant configures with rules and templates and sends through their own SMTP server.

The platform later gained a second channel, physical letters, on the same rules and dispatcher. That is covered in [Part 2](../customer-communications-letters/).

## The problem

Merchants needed reliable customer email, and some of it is a legal duty.

- SEPA rules require a pre-notification before each recurring debit; it is also the cheapest way to prevent chargebacks.
- Each merchant needs its own branding, legal identity and sender reputation, so mail must go through their own SMTP server.
- Customers must be able to unsubscribe from optional mail, but never from legally required notices.
- Sent emails contain personal data, so they cannot be kept forever.
- Many tenants share one platform, so one merchant's volume or failures must not affect another.

## What I built

A communications platform that:

- publishes business events once to an event bus that feeds both email and the existing webhooks;
- resolves which rule applies (tenant-wide, per campaign or per profile) and picks the template by the customer's country;
- sends asynchronously after the database commit, with retries, rate limits and a sweeper for stuck sends;
- enforces SEPA pre-notifications, one-click unsubscribe, suppression lists and GDPR purging;
- supports several SMTP servers per merchant, a template editor with live preview and a send log that explains every failure;
- reports 8 tenant-tagged metrics to the monitoring stack.

## Architecture

Every email starts as a business event and passes the rules before anything is queued.

![Architecture: every email passes the rules, then waits for the commit](architecture.png)

Domain code and the scheduled rebill scan publish events once to the bus, which also feeds the existing webhooks. The email dispatcher checks the kill switch, finds the rule, checks suppressions and picks the template by language, then queues a send only after the database commits. The send task applies the rate limit and dedup, renders and sends through the merchant's SMTP; temporary errors retry, and a sweeper fails anything stuck without re-sending.

## The legal email a setting could silence

Rules could be scoped per campaign, and a campaign rule could also block an event. That flexibility carried a risk: a merchant could block the upcoming-rebill event for one campaign and silently stop the SEPA pre-notification the law requires.

I closed it at two levels. The dispatcher always restores the global pre-notification rule for that event, and the rule forms refuse any block on it. Legally required mail now goes out no matter how a merchant configures their rules.

## Events and rules

- **One event bus:** domain code publishes an event once; the bus feeds both the email dispatcher and the existing webhook dispatcher, so neither depends on the other.
- **Event catalog:** about 37 events in 8 categories, from order, subscription, lead, transaction and chargeback lifecycles to rebills and operator events such as imports and exports.
- **Rule resolution:** a campaign or profile rule overrides the tenant-wide one, and overlapping campaign rules each send. Rules can cover several events and campaigns.
- **Scope checks:** events with no campaign, such as lead events, cannot be scoped to a campaign; the model enforces this on every path.
- **Profiles:** imports and the API can route email through named profiles when there is no campaign.
- **Strict gating:** nothing is sent without an active rule.

## Templates

- Side-by-side editor with live preview and a variables panel.
- Strict rendering: a missing variable fails loudly instead of sending a broken email.
- Template chosen by the customer's country and language; German and English pre-notification templates come seeded.

## Sending and delivery

- **After commit only:** sends are queued once the database transaction commits, so a rolled-back change never emails a customer.
- **Merchant SMTP:** several servers per merchant, one default, per-rule overrides, a verify test before use, and protection against deleting a server still in use.
- **Retries:** temporary SMTP errors retry automatically; permanent ones fail at once; rate-limited sends have their own budget and end as a clear failure when it runs out.
- **Stuck sends:** a sweeper marks sends stuck for over 10 minutes as failed instead of re-sending, so a customer is never emailed twice.
- **Exactly once:** a key of event, record and rule prevents duplicates; rebill events add the billing period.
- **Send log:** every send shows its error class and one of 7 retry verdicts, so support can see why a message failed.

## Compliance

- **SEPA pre-notifications:** a scheduled scan sends notices before each rebill. Activation is blocked until the merchant's legal name, creditor ID, support email and logo are set.
- **Unsubscribe:** a signed one-click link in every optional email, served from a page that resolves the right tenant.
- **Suppression lists:** by category, by campaign and in bulk by CSV; operator notices can't be silenced by a customer opt-out.
- **GDPR:** rendered bodies are purged after each tenant's retention period, and purged sends can't be re-sent.
- **Kill switch:** one per-tenant setting stops all optional email instantly.

## Security and safety by design

Every send is isolated per tenant, legally safe and recoverable without emailing a customer twice.

| Layer | Control |
| --- | --- |
| Tenant isolation | Rules, templates, sends and suppressions live in each tenant's schema; metrics are tagged by tenant |
| Credentials | SMTP passwords are stored encrypted; a server must pass a verify test before it is used |
| Legal notices | SEPA pre-notifications bypass the kill switch, suppressions and unsubscribe, and can't be blocked by any rule |
| Consent | Optional mail carries a signed unsubscribe link; suppressions are checked before every send |
| Personal data | Rendered bodies are purged after the tenant's retention period |
| Phantom mail | Sends are queued only after the database commit |
| Duplicates | A key of event, record and rule blocks repeats; stuck sends are failed, not re-sent |
| Volume | Per-tenant rate limits protect each merchant's sender reputation |
| Kill switches | One per-tenant setting stops optional email; a feature flag controls the whole platform |

## Key engineering decisions

### Events and delivery

| Decision | Why | Trade-off |
| --- | --- | --- |
| One event bus in front of email and webhooks | Domain code publishes once; each consumer fails on its own | Existing webhook call sites had to move to the bus |
| Queue sends after commit | A rolled-back change never emails a customer | A short delay before every send |
| The merchant's own SMTP | Branding, legal identity and sender reputation stay with the merchant | Each merchant must set up and verify a server |
| Sweeper fails stuck sends instead of re-sending | Background jobs own retries, operators own recovery, and nobody is emailed twice | An operator must re-send a stuck message by hand |
| Strict rendering | A missing variable fails loudly instead of sending a broken email | A template bug blocks its sends until fixed |

### Rules and compliance

| Decision | Why | Trade-off |
| --- | --- | --- |
| No send without an active rule | Merchants control exactly what goes out | Each new event needs a rule before it sends |
| Campaign rules override, overlapping ones both send | Predictable results when a customer matches several campaigns | Merchants can send two emails by design |
| Pre-notification can never be blocked | The law outranks any configuration | Less flexibility on that one event |
| Separate category for operator notices | A customer opt-out can't silence internal alerts | One more category to explain |
| Activation gated on legal fields | No pre-notification goes out without the merchant's legal identity | Merchants must complete their profile first |

## Development and ownership

I owned the platform from the product spec to code in production.

- Wrote the spec and broke it into milestones: foundation, lifecycle events, compliance, delivery hardening, multi-server and campaign rules, and profiles.
- Built the event bus and moved the existing webhook calls onto it, then built the whole communications domain on top.
- Ran user-acceptance rounds with the product owner and turned each round into fixes, including a two-pane rule wizard.
- Kept extending it as needs arrived, such as new subscription events for welcome messages.

## Testing and validation

- Hundreds of unit and database tests across rules, rendering, delivery, retries and compliance; the core suite grew to about 500.
- A Playwright end-to-end suite driven by real events: 76 passed, 1 skipped (needs two campaigns), 0 failed.
- Observability with 8 metrics: dispatched, sent, failed, suppressed, rate-limited, render time, SMTP time and queue depth.

### Test data is code too

After a run where 15 end-to-end tests failed, 14 traced back to one seed template that had been hand-edited into invalid syntax. The fix was not in the product: the suite's reset step now restores seed data before every run, and strict rendering made the cause obvious in seconds.

## Outcome

Merchants now send branded, rule-driven email through their own mail servers, with legally required pre-notifications guaranteed and every send traceable. The platform is merged and running in production, and the same rules and dispatcher now drive physical letters.

## Takeaways

1. **Legal duties beat configuration.** Required notices must be impossible to switch off, not just on by default.
2. **Publish once, consume many.** An event bus lets new channels join without touching domain code.
3. **Commit first, send second.** Queuing after commit removes a whole class of phantom emails.
4. **Never retry blindly.** Classify errors, cap retries and let operators recover what is stuck.
5. **Explain every failure.** A send log with clear verdicts turns support tickets into self-service.

**Next:** [Part 2: Physical letters](../customer-communications-letters/), the second channel built on the same platform.
