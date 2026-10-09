---
title: Fuxx (Liquva) SEPA Payment Integration
permalink: /fuxx-sepa-payment-integration/
description: A SEPA Direct Debit provider integrated by API and by CSV batch, with signed webhooks, polling and reconciliation for a multi-tenant payments SaaS.
image: /fuxx-sepa-payment-integration/architecture.png
---

[← All case studies](../)

# Fuxx (Liquva) SEPA Payment Integration

*Case study by Musa*

Fuxx (Liquva), a SEPA Direct Debit provider, integrated by API and by CSV batch, with signed webhooks, polling and reconciliation for a multi-tenant payments SaaS.

> **In short**
>
> **Problem:** Merchants needed a new SEPA Direct Debit provider, and a late, duplicated or lost webhook must never leave a payment in the wrong state.  
> **What I built:** An API and batch-file integration with signed webhooks, polling, reconciliation and a full provider mock for testing every outcome.  
> **Result:** Merchants collect SEPA debits through the new provider either way, with every status reconciled into one ledger.

**At a glance:** 5 provider endpoints · RSA-signed webhooks · 10 → 5 status mapping · one 29-column CSV both ways · ~170 automated tests · live-verified in the provider's sandbox

- **Role:** Lead engineer for the Fuxx integration
- **Timeline:** About 2 months, 2026
- **Stack:** Python, Django, PostgreSQL, Celery, Node.js/TypeScript (provider mock), Playwright

## Overview

The platform collects recurring SEPA Direct Debit payments for many merchants, and each merchant can route payments through different providers. I integrated Fuxx (Liquva), a European SEPA Direct Debit provider, end to end.

The integration works two ways: live through the provider's API, and as a manual batch through a CSV file. Webhooks, polling and daily reconciliation keep every transaction's status correct even when a notification is lost.

The shared adapter framework and reconciliation dispatcher already existed. I built everything specific to this provider on top of them, plus a full mock of the provider and fixes to the gateway setup screens.

## The problem

Merchants needed Fuxx as a new SEPA provider, and money movement leaves no room for guesswork.

- Every provider has its own API, status codes, signing scheme and file format.
- Webhooks can be late, duplicated or lost, yet a transaction's status must still end up correct.
- Some merchants run this provider by API, others as a manual batch file, and both must land in the same ledger.
- The provider's sandbox could not simulate every case, so the integration needed a way to be tested beyond it.

## What I built

A complete provider integration that:

- submits debits through the provider's API, creating the customer once and reusing it for rebills;
- receives webhooks, verifies their RSA signature, and fetches full transaction details before updating anything;
- falls back to polling for stuck transactions and reconciles daily against the provider's transaction list;
- runs the same provider as a manual batch through one 29-column CSV used for both export and import;
- is fully mocked in a separate provider simulator, so every outcome can be tested on demand;
- is configured per merchant through gateway screens I fixed and extended.

## Architecture

Four independent paths can update a transaction, and all of them meet at one status update step.

![Architecture: every status change is signed, deduplicated and reconciled](architecture.png)

Debits go out through the API adapter. Signed webhooks come back, are verified and deduplicated, and trigger a fetch of full details before any status changes. Polling and daily reconciliation catch anything the webhooks miss, and batch results arrive through the CSV file. The provider mock stands in for the real API in tests, with signed webhooks and any outcome on demand.

## The payment that crashed instead of failing

A debit for a Belgian bank account caused an HTTP 500 and left a transaction stuck. The platform tried to derive the bank's BIC from the IBAN, and for that bank it could not.

I ran a live A/B test in the provider's sandbox and proved it accepts IBAN-only debits. Now only this provider's API path skips the BIC; every other provider gets a clean validation error before anything is created, so no transaction is ever left half-made.

## API adapter

- **Submission:** five provider endpoints (start, status, refund, list, create customer), amounts in minor units, and a test-mode switch between sandbox and live hosts.
- **Customers:** the provider's customer record is created once per lead and reused for every rebill.
- **Mandates:** mandate data is sent the way the provider requires in production, after several rounds of clarification with their team.
- **Status mapping:** 10 provider statuses mapped to 5 platform statuses; anything unknown stays pending rather than guessing.
- **Refunds and chargebacks:** both implemented and verified end to end against the provider mock.
- **Behind a flag:** the whole integration sits behind a feature flag until each merchant is ready.

## Webhooks, polling and reconciliation

- **Signed webhooks:** every notification's RSA signature is checked against the provider's public key for that environment. With no key configured, the receiver refuses everything.
- **Thin payload, full fetch:** the webhook carries only 8 fields, so the handler fetches the full transaction from the API before changing any status.
- **Exactly once:** duplicates are dropped by a unique key on transaction and status; refunds get their own collision-free ID so webhook and reconciliation never double-count.
- **Polling backstop:** transactions stuck in pending are re-checked after the shared stale threshold, covering webhooks the provider gave up retrying.
- **Daily reconciliation:** a fetcher pulls the provider's transaction list into the shared reconciliation dispatcher and detects refunds.
- **Shared fix:** I found a logging bug that crashed refund-webhook processing after the row was saved, for every provider, and fixed it.

## CSV batch adapter

The same provider can run as a manual batch, through one 29-column file used for both export and results import.

- Status codes map to pending, approved and declined; chargebacks in the same file route to chargeback import.
- Fixed an export that always wrote one hard-coded status, a dropped mandate reference on import, and missing column aliases.
- Verified end to end locally: leads, orders, export, results and the chargeback cascade.

## Fuxx mock

The sandbox could not produce every outcome, so I built a mock of the Fuxx API in the team's provider simulator (Node.js/TypeScript).

- 7 routes matching the real API, webhooks signed with a test RSA key that pairs with the platform's test key.
- Dashboards for transactions and webhooks, plus the same 29-column CSV export.
- Row actions to force a status, refund, raise a chargeback or suppress a webhook, so any edge case is one click away.
- A push-to-mock action in the platform for quick end-to-end runs.

## Gateway setup

- **Adapter list:** a merchant's first gateway for a provider showed an empty adapter dropdown; a new endpoint now lists every available adapter.
- **Edit form:** the form now prefills the stored configuration, including decrypted secrets for roles already allowed to reveal them, with a show/hide toggle and explicit clearing.

## Security and safety by design

Every path that can change a payment's status is authenticated, idempotent and recoverable.

| Layer | Control |
| --- | --- |
| Webhook authenticity | RSA signature checked on the raw body against the provider's key for each environment; no key means every webhook is refused |
| Trust in webhook data | The thin payload is never trusted alone; full details are fetched from the API before any status change |
| Duplicates | A unique key on transaction and status drops repeats; refunds carry their own collision-free ID |
| Lost notifications | Polling re-checks stuck transactions and daily reconciliation catches anything both missed |
| Unknown states | Unmapped provider statuses stay pending instead of being guessed |
| Credentials | API keys stay encrypted in the gateway record and are shown only to roles already allowed to reveal them |
| Bad input | Invalid bank details are rejected with a clean error before a transaction exists |
| Testing | Sandbox and mock only; production credentials and real customer accounts never enter a test |
| Rollout | The integration is behind a feature flag until each merchant is ready |

## Key engineering decisions

### API and webhooks

| Decision | Why | Trade-off |
| --- | --- | --- |
| Build on the shared adapter framework | One webhook receiver, one polling service and one reconciliation dispatcher for every provider | Provider quirks must fit the shared contracts |
| Verify signature, then fetch full details | A valid but thin webhook can't move a status on its own | One extra API call per webhook |
| Fail closed without a public key | A misconfigured environment refuses webhooks instead of trusting them | A missing key stops updates until it is set |
| Create the provider customer once and reuse it | Fewer calls and a stable mandate history; later confirmed by the provider | The customer ID must be stored per lead |
| Unknown statuses stay pending | Never mark money as approved or failed on a guess | Some transactions wait for polling or reconciliation |

### Batch, testing and setup

| Decision | Why | Trade-off |
| --- | --- | --- |
| One CSV format for export and import | Operators learn one file; the same parser matches results back | Columns unused in one direction stay empty |
| Build a full provider mock | Every outcome, including chargebacks the sandbox can't simulate, is testable on demand | A second implementation to keep in step with the real API |
| Skip the BIC only for this provider | Proven in the sandbox; other providers keep strict validation | One provider-specific branch |
| Prefill stored config, secrets included, for allowed roles | Editing a gateway no longer means re-typing every key | Secret reveal must follow the same role rules everywhere |

## Development and ownership

I owned the integration from the provider's documentation to code running on the deployed environments.

- Probed the provider's sandbox, mapped their API and statuses, and agreed mandate and customer handling with their team.
- Built the API adapter, webhook handler, polling and reconciliation hooks, the CSV adapter and the provider mock.
- Wrote the operator runbook for setting up and supporting the provider.
- Fixed shared code where this integration exposed bugs that affected every provider.

## Testing and validation

- About 170 automated tests across the API client, webhook handler, reconciliation, routing and checkout, plus 35 for the CSV adapter.
- Mock tests: 14 smoke, 7 export and an end-to-end spec; a 7/7 Playwright run of the platform against the mock.
- Live sandbox runs in stages: submission first, then a captured signed webhook replayed locally, then real webhooks on the deployed development environment.
- On the deployed environment, approved, delayed-approved and delayed-failed outcomes were each driven by real signed webhooks and confirmed in the webhook log.

### Test against the real provider, not just the docs

The documentation said one thing about mandates, the sandbox another, and production a third. Only live sandbox runs and direct questions to the provider settled it. The IBAN-only case was the same: a live A/B test turned a crash into a supported path.

## Outcome

Merchants can collect SEPA debits through Fuxx by API or by batch file, with signed webhooks, polling and reconciliation keeping every status correct. The work is merged and deployed.

## Takeaways

1. **Never trust a webhook on its own.** Verify the signature, then fetch the truth from the API.
2. **Plan for lost notifications.** Polling and reconciliation are part of the integration, not extras.
3. **Mock what the sandbox can't do.** A provider simulator makes every edge case testable on demand.
4. **Fail closed, but cleanly.** Refuse unsigned webhooks and invalid bank details before anything is written.
5. **Ask the provider.** Documentation, sandbox and production can disagree; a short question beats a week of guessing.

In payments, the happy path is the easy part. The integration is defined by how it handles the late, the lost and the unexpected.
