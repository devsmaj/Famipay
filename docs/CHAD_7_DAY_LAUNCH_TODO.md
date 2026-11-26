# FA-MINNA Express — Seven-Day Launch TODO (Abéché, Chad)

**Dates:** 26 November–2 December 2026  
**Launch market:** Abéché (Abashe), Chad. **Next expansion:** N’Djamena, Chad, only after Abéché is stable.  
**Reference:** `FA_MINNA_7_Day_Chad_Launch_and_Expansion_Plan.pdf` (planning document; not a claim that tasks are complete).  
**Scope:** Shopping/restaurant food delivery with an OPay-like simple interface — **not a bank or wallet**.  
**Rule:** This is a checklist only. Do not edit unrelated existing code, assets, design, configuration or deploy without authorization.

## Existing foundation — verify, do not assume production-ready

- [ ] Review current `main` against `production/abeche-platform`; decide exactly which tested changes to release; back up and record revision.
- [ ] Verify frontend HTML/CSS/JS, Node/Express API, Supabase Auth/PostgreSQL/RLS migrations, restaurant/rider/admin dashboards, Leaflet, routing, Realtime and localization actually work on hosted staging.
- [ ] Run `npm test`, `npm run test:browser`, `npm run test:navigation`, `npm run test:stability` and `npm --prefix backend audit --omit=dev`; record results.
- [ ] Check every image and asset path, especially exact approved logo/banner; remove duplicate/ghost hero styling and confirm no mobile overlap.
- [ ] Verify no infinite loading, redirect loop, stale service-worker asset, missing page or inaccessible cart.

## Day 1 — Thursday 26 Nov: scope, ownership and launch decisions

- [ ] Freeze one Abéché pilot neighborhood/zone, service radius, hours and realistic delivery promise.
- [ ] Assign accountable engineering, restaurant onboarding, rider operations, customer support and finance owners.
- [ ] Approve budget, launch capacity and go/no-go decision maker.
- [ ] Verify Chad operating permissions, business identity, public contact and locally appropriate terms/privacy/refund policy with qualified advisers.
- [ ] Agree COD cash custody, restaurant commission, payout schedule, cancellation/refund rules and rider compensation.
- [ ] Identify 3–5 restaurants and 2–3 riders to invite; **do not** publish unapproved partnerships.
- [ ] Confirm branding and public content: Abéché, Chad, +235, XAF/FCFA; no Nigerian NGN/+234/gateways.

**Proof:** written pilot scope, accountable owners and approved business policies.

## Day 2 — Friday 27 Nov: backend, database and accounts

- [ ] Provision separate staging Supabase project; protect keys and credentials outside GitHub.
- [ ] Review and apply migrations in order; inspect tables, grants, transaction RPCs, RLS and storage permissions.
- [ ] Configure backend hosting, API origin, HTTPS, CORS allowlist, secrets, monitoring and health endpoint.
- [ ] Configure and test Supabase customer/restaurant/rider/admin identity and role isolation.
- [ ] Test Google OAuth and Chad-capable +235 OTP, resend/rate limits, session refresh, logout and expired sessions.
- [ ] Verify French, Arabic RTL and English selection persists and does not cause login loops.
- [ ] Configure staging backup and test restoring it.
- [ ] Test actual hosted Supabase Realtime with distinct accounts and verify no cross-customer address/order/GPS leaks.

**Proof:** secure hosted staging, authenticated roles, tested database.

## Day 3 — Saturday 28 Nov: public interface, catalog and partner setup

- [ ] Public: Home, Explore Food, Restaurants, About, Cart, Help/Contact, login/signup and language selector; all links work.
- [ ] Customer: menu categories, search/filter, real food photos, item detail, quantity, availability, cart, profile, saved addresses, My Orders and Track Order.
- [ ] Keep public browsing available without login; require appropriate authentication at protected checkout and preserve guest cart.
- [ ] Make responsive mobile/tablet/desktop layouts; accessible buttons, loading/error/empty states, low-bandwidth behavior and working menu drawer.
- [ ] Validate approved logo/banner display on mobile; no broken images or duplicate hero text.
- [ ] Onboard 3–5 consenting restaurants: legal name, owner contact, cuisine, approved photos, pickup pin, opening hours and current menu.
- [ ] Verify **at least 10 real purchasable items** with correct XAF prices, options and availability; do not seed invented prices.
- [ ] Restaurant interface: role-protected dashboard, menu edit and verification, pause/unavailable toggle, incoming orders, accept/reject, preparing and ready-for-pickup.
- [ ] Admin interface: restaurant approval, menu verification, partner/rider roles, service zones, XAF fees, commissions and audit history.
- [ ] Confirm support phone/WhatsApp and factual legal, marketing and contact copy.

**Proof:** approved real catalog and functional customer/restaurant/admin interfaces.

## Day 4 — Sunday 29 Nov: checkout, order lifecycle and finance

- [ ] Cart: add/remove/update, unavailable-item handling, persistent session and guest-cart merge.
- [ ] Address: customer pin, GPS consent, written instructions, +235 phone and delivery-zone validation.
- [ ] Server-authoritative XAF item totals, distance/zone fee, delivery quote, expiry and final confirmation.
- [ ] One-restaurant-per-order constraint, stock/availability checks, idempotent atomic order creation, receipt and order history.
- [ ] COD checkout only initially; show amount due accurately, never mark cash paid on frontend alone.
- [ ] Restaurant accept/reject → prepare → ready → dispatch → pickup → delivered; handle cancellation and refund requests.
- [ ] Admin: cash collection, unique receipts, reconciliation, commissions, restaurant payouts, disputes and audit trail.
- [ ] Test duplicate taps, expired quote, changed price, offline requests, failed API, unauthorized payment edits and simultaneous checkout.
- [ ] Keep Airtel Money and Moov Money **disabled** until merchant approval, signed/replay-safe webhooks, amount reconciliation, refunds and sandbox tests pass.
- [ ] Do not add Nigeria-only providers, wallets or banking functionality.

**Proof:** complete test order, immutable receipt and reconciled COD ledger.

## Day 5 — Monday 30 Nov: delivery rider, maps and tracking

- [ ] Onboard/train 2–3 riders; verify identity, phone, safety/helmet, cash handling and backup coverage.
- [ ] Admin dispatch: assign/reassign rider, manage delays, failed pickup and unserved orders.
- [ ] Rider interface: protected assignments, pickup location, customer drop-off, route, status updates, pickup confirmation and delivery code.
- [ ] Configure HTTPS OSRM-compatible routing service and test real Abéché road coverage; no fake road-distance claims.
- [ ] Display verified restaurant-to-home road distance, zone-based delivery fee and ETA from prep + rider wait + travel.
- [ ] Customer Track Order: order timeline, rider status, live map when GPS active, remaining distance, updated timestamp and explicit stale/offline state.
- [ ] Request rider GPS permission; share only for assigned active delivery; stop/revoke sharing at completion or cancellation.
- [ ] Two-device customer/rider Realtime test; test reconnect, GPS denial, reassignment, inaccurate coordinates and poor network.
- [ ] Delivery proof: customer code, cash confirmation, completion and admin reconciliation.

**Proof:** actual two-device end-to-end tracked delivery test.

## Day 6 — Tuesday 1 Dec: launch acceptance and operations

- [ ] Mobile and desktop browser checks in French, Arabic and English; RTL, keyboard accessibility and narrow screens.
- [ ] Verify every public/customer/restaurant/rider/admin page and role guard.
- [ ] Test all loading, error, offline, empty and retry states; no fake payment success, fake GPS or endless spinners.
- [ ] Verify RLS with customer A/B, owner A/B, rider A/B, disabled user and admin; no data leaks.
- [ ] Verify order concurrency, cancellation, refunds, delivery-code lockout and unauthorized state changes.
- [ ] Verify domain/HTTPS, CORS, API health, secrets, rate limiting, logs, alerts, backups/restore and service-worker cache updates.
- [ ] Test support escalation, complaints, late delivery, restaurant closure, rider no-show and cash discrepancies.
- [ ] Confirm every real restaurant price, opening hour, fee, contact, consent and refund policy.
- [ ] Record blockers and obtain launch sign-off; do not publicly launch if critical gates fail.

**Proof:** signed acceptance checklist with no unresolved critical blockers.

## Day 7 — Wednesday 2 Dec: controlled Abéché pilot

- [ ] Invite limited real customers in the approved Abéché zone; do not launch both cities.
- [ ] Complete 3–5 real orders with real partner restaurants and riders.
- [ ] Verify order placement, acceptance, preparation, pickup, delivery, code, COD receipt and cash reconciliation for each order.
- [ ] Monitor uptime, errors, support response, rider GPS freshness, order completion and delivery times.
- [ ] Collect customer/restaurant/rider feedback and log issues.
- [ ] Record go/no-go decision; public launch only if all mandatory gates pass; otherwise remain invite-only.

**Proof:** recorded orders, reconciled cash, operations report and launch decision.

## After launch — integrations and expansion

- [ ] **Airtel Money / Moov Money Chad:** confirm merchant eligibility, fees, bank settlement, API credentials, sandbox, signed webhooks, idempotency, disputes and refunds before enabling.
- [ ] **Notifications:** transactional in-app updates first; evaluate SMS/push after consent, provider approval and deliverability tests.
- [ ] **Customer experience:** improve saved addresses, receipts, support, reorder, menu discovery and estimated delivery accuracy using real data.
- [ ] **Abéché week 2:** review completion rate, actual delivery time, cancellations, cash discrepancies, support load and rider coverage daily.
- [ ] **Abéché weeks 3–4:** expand only with verified partners, trained riders, operating capacity and measured reliability.
- [ ] **N’Djamena:** add city-specific restaurants, menus, GPS, zones, fees, support and riders; test routes and run a one-zone pilot before citywide expansion.
- [ ] **Scale/security:** pagination, monitoring, backups, access reviews, incident response, fraud controls and operational reporting.

## Absolute launch blockers

- [ ] No broken logo/banner, login loops, inaccessible checkout, missing assets or critical mobile layout errors.
- [ ] Real hosted database, sessions, role authorization and RLS verified.
- [ ] At least one complete real Abéché order from checkout through delivery and cash reconciliation.
- [ ] Verified restaurant permissions, menus, prices, pickup coordinates and delivery fees.
- [ ] GPS tracking verified where advertised, otherwise clearly marked unavailable.
- [ ] COD records honest; mobile-money payment options not falsely advertised as active.
- [ ] Working customer support, legal/privacy/location consent, backups and refund process.

**Source mapping:** Adapted from the approved Chad PDF's seven-day schedule, product flows, payment/tracking requirements, mandatory launch gates and Abéché → N’Djamena roadmap. Expanded into actionable interface, integration, test and operational tasks based on the repository's README, implementation status, production plan, release checklist and API/payment/routing code. No task is marked complete solely because code exists.
