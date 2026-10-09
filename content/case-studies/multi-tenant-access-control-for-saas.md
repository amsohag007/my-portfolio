---
title: Multi-Tenant Access Control for SaaS
permalink: /multi-tenant-access-control-for-saas/
redirect_from:
  - /multi-tenant-access-control/
description: Custom roles, section-wise permissions, cross-tenant access and tenant isolation for a schema-per-tenant B2B payments SaaS.
image: /multi-tenant-access-control-for-saas/architecture.png
---

[← All case studies](../)

# Multi-Tenant Access Control for SaaS

*Case study by Musa*

Configurable roles, cross-tenant access and tenant isolation for a schema-per-tenant B2B payments SaaS.

> **In short**
>
> **Problem:** Every merchant got the same five fixed roles, and support staff could not be given access to one specific merchant.  
> **What I built:** Custom roles with section-by-section permissions, a scoped support role, per-tenant switches and a central, audited privilege policy.  
> **Result:** Merchants set up access for their own teams without code changes, support reaches exactly the merchants it is granted, and the built-in roles behave exactly as before.

**At a glance:** custom roles per tenant · 47 sections × 5 actions · 1,715 parity checks · 4 order paths gated per tenant · 0 high-severity findings after review · tenant-isolated

- **Role:** Lead engineer for access control and tenant isolation
- **Timeline:** About 3.5 months, 2026
- **Stack:** Python, Django, django-tenants, PostgreSQL (schema per tenant), Next.js, Playwright

## Overview

The platform serves many merchant companies (tenants) from one deployment. Each tenant's data lives in its own PostgreSQL schema; platform-wide data lives in a shared public schema.

I rebuilt roles and permissions on top of that foundation. Each tenant now creates its own custom roles and sets permissions section by section, on a grid of 47 sections × 5 actions. I also built central privilege guardrails, added a cross-tenant support role, per-tenant switches, and platform-wide features that still respect tenant boundaries.

The schema-per-tenant foundation itself already existed; my work was who can see and do what, inside and across tenants.

## The problem

Access was decided by five fixed tenant roles (owner, admin, member, viewer, customer support) and checks scattered across views.

- Tenants could not shape access to fit their own teams; every company got the same five roles.
- There was no central policy deciding who may change which privilege.
- Platform staff reached tenants only through their team, so a support agent could not be granted one specific tenant.
- Some settings needed to differ per tenant, and some features (shared AI prompts, usage reports) had to work across tenants without leaking data between them.

In a payments platform, a wrong permission is a data breach, so every change had to be provably no wider than before.

## What I built

An access layer that:

- lets each tenant define custom roles on a grid of 47 sections × 5 actions (read, edit, delete, upload, export), enforced on both the admin back office and the tenant web app;
- adds a cross-tenant support agent role, scoped to the tenants it is granted and read-only by default;
- stops privilege escalation: nobody edits their own privileges, and every grant is ranked and audited;
- adds per-tenant switches, from enabling custom roles to blocking orders for customers with chargebacks;
- serves platform-wide data from the shared schema with a per-tenant opt-out, and reports usage across tenants without cross-schema queries.

## Architecture

Tenant data is split by schema; access is decided in one place before any tenant schema is reached.

![Architecture: every request passes the access resolver before it reaches a tenant schema](architecture.png)

The resolver reads memberships from the shared schema and then works only inside the tenants a user is granted. Privilege changes go through a separate policy that ranks every grant and writes the audit log. Platform-wide features read the shared schema and respect each tenant's own opt-outs.

## The bug that 51 green tests missed

While cleaning up the grid, I dropped a `view` action that nothing seemed to use. Every test stayed green, and the whole navigation disappeared: menu visibility was still keyed to `view`.

No test exercised the navigation against the grid. I restored the behaviour and added a navigation parity test, so the menu a role sees is now checked against the grid it holds.

## Configurable roles

I replaced the five fixed roles with tenant-defined custom roles and section-wise permissions. Each tenant creates its own roles, starting from a built-in base role and then choosing, section by section, what the role may read, edit, delete, upload or export.

- **One resolver:** a single function resolves the effective grid for a user; every role-gated endpoint declares the section it belongs to.
- **Complete coverage:** a test fails if any role-gated endpoint is neither tagged with a section nor explicitly exempt.
- **No regressions:** the five built-in roles keep their exact old behaviour, proven by 1,715 automated parity checks.
- **No dead switches:** 61 of 159 grid cells controlled nothing; I removed or wired them, leaving 114 cells that all do something.
- **Both surfaces:** 110 permission checks across 57 front-end files moved to the grid, guarded by 227+ parity assertions.
- **Per-tenant kill switch:** one setting turns custom-role enforcement off for a tenant, not just the role editor.
- **The AI assistant** follows the grid too, so it can only read what the user's role allows.

## Platform users and the cross-tenant agent role

Platform staff and tenant users follow different rules, and I made that boundary explicit.

- **Support agents:** a flag on a platform user scopes them to their team's tenants plus tenants granted directly, read-only by default.
- **No silent bypass:** agents are checked against their own grants at every permission check and never inherit the platform-staff bypass.
- **Tenant switcher:** lists accessible tenants and issues an entry token, returning the same refusal for every failure so it never reveals which tenants exist.
- **Read-only console:** agents get a platform view limited to their tenants and analytics.
- **Clean bootstrap:** creating a platform user for a tenant now creates the membership that grants access (an ownership pointer alone granted none, which blocked login), with exactly one active owner per tenant.
- **Separation:** platform users can never be given tenant custom roles.

## Privilege guardrails

I built a central policy module that decides who may change which privilege.

- Nobody edits their own privileges, and only super admins grant owner.
- You can only assign roles strictly below your own.
- Every change and every refusal is written to an audit log; refusals survive the request's transaction rollback.
- A full review of the roles system set the order of the work.

## Per-tenant switches and platform-wide data

- **Per-tenant switches:** for example, blocking new orders for customers with a chargeback, enforced through one helper on all four order-creation paths.
- **Platform-wide AI prompts:** stored once in the shared schema and managed by super admins; each tenant's opt-out lives in its own schema, so isolation needs no tenant column.
- **Cross-tenant usage report:** visits each tenant schema in turn instead of querying across schemas, for platform super admins only.

## Security and safety by design

Every layer limits who can reach a tenant, what they can do there, and what leaks if a check fails.

| Layer | Control |
| --- | --- |
| Tenant isolation | Tenant data lives in its own schema; platform-wide data in the shared schema, with tenant opt-outs stored in each tenant's schema |
| Who reaches a tenant | Tenant users through memberships; support agents only through their team or a direct grant |
| What they can do | One grid resolver decides every gated endpoint; untagged endpoints fail a test |
| Changing privileges | No self-edits, ranked grants, owner granted only by super admins, one active owner per tenant |
| Platform vs tenant | Platform users never hold tenant custom roles; agents get no platform-staff bypass |
| Discovery | The tenant switcher returns the same refusal for every failure, so it never confirms a tenant exists |
| Audit | Every privilege change and refusal is logged, and refusals survive transaction rollback |
| Kill switch | One per-tenant setting turns custom-role enforcement off without a deploy |

## Key engineering decisions

### Roles and permissions

| Decision | Why | Trade-off |
| --- | --- | --- |
| Section × action grid, one resolver | One place answers "can this user do this here" for every endpoint and both surfaces | Every endpoint must be tagged with a section |
| Custom roles start from a built-in base | Tenants adjust a known role instead of building from nothing; owner can never be a base | Base roles become a long-term contract |
| Prove parity before switching | 1,715 checks show the built-in roles behave exactly as before | Large test suite to maintain |
| Remove permissions that control nothing | Every visible switch has an effect, so tenants are never misled | One-time cleanup across back end and front end |
| Kill switch disables enforcement, not just the editor | A tenant can return to built-in roles instantly | Two code paths to keep correct |

### Tenancy and platform access

| Decision | Why | Trade-off |
| --- | --- | --- |
| Agent as a flag on platform users, not a new user type | Avoided touching about 80 code branches keyed on user type | The flag must be checked wherever platform bypasses exist |
| Direct grants default to read-only | Least privilege for cross-tenant support | Write access needs an explicit grant |
| Platform-wide data in the shared schema, opt-outs in tenant schemas | Isolation without a tenant column on shared tables | Two schemas involved in one feature |
| Cross-tenant reports visit each schema | No cross-schema queries that could mix tenant data | Slower than one query |
| One owner per tenant on every path | A clear accountable owner; no orphaned or duplicate owners | Transferring ownership needs an explicit step |

## Development and ownership

I owned this work from review to merged code, building on the existing schema-per-tenant foundation.

- Started with a full review of the roles system, then built the privilege guardrails before adding any new access.
- Designed and built configurable roles end to end: data model, resolver, endpoint tagging, both user interfaces, migration of existing checks and the parity suites.
- Designed the agent role after a first cross-team access approach was paused on a product decision; its access-merging code was reused.
- Worked with the product owner on boundary calls: full exemption of platform users from tenant roles, one owner per tenant, and agents seeing platform analytics.

## Testing and validation

- 1,715 parity checks for the built-in roles, plus 227+ front-end parity assertions.
- A completeness test that fails on any role-gated endpoint without a section.
- Policy unit tests and end-to-end tests for privilege changes, including audit rows for refused changes.
- Integration tests against a real tenant schema for per-tenant switches.
- A live sweep of all 47 sections: 46 enforced correctly, and the one finding was an unrelated, older bug.

### Test behaviour, not just rules

Rule-level tests can pass while users are locked out. Locking a staff flag for safety stopped new tenant users from logging in; an ownership pointer granted no access, so platform-created users could not sign in. Both were fixed with a single rule each and covered by tests that exercise the real login and admin paths.

## Outcome

Tenants now shape their own roles without code changes, support staff reach exactly the tenants they are granted, and no one can raise their own privileges. Every change is audited, and the built-in roles behave exactly as before.

## Takeaways

1. **Prove parity before you replace access control.** Users must not notice the new engine until they choose a new role.
2. **Make coverage a test.** An endpoint without a declared section should fail the build, not ship unguarded.
3. **Platform bypasses are the riskiest lines.** Every "staff can do anything" check needs to ask which staff.
4. **Don't leak existence.** Refuse the same way whether a tenant is missing or forbidden.
5. **Test the experience, not only the rule.** Green rule tests missed a hidden menu and a blocked login.

In a multi-tenant system, isolation is the foundation. Access control decides whether that foundation holds.
