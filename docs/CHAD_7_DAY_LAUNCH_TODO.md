# FA-MINNA — OPay-style Financial Super App: Complete Integration TODO

**Market:** Chad. **Initial rollout:** Abéché (Abashe). **Expansion:** N’Djamena, then other cities.  
**Product direction:** An OPay-like everyday payments and financial-services super app for Chad, with shopping and delivery retained as secondary services. OPay is a feature and user-experience reference, not a brand or interface to copy exactly.  
**Status:** Planning only. No live banking, wallet, bill-pay or licensed financial capability is claimed.  
**Repository baseline:** Existing HTML/CSS/JavaScript frontend, Node/Express backend, Supabase Auth/Postgres/RLS, restaurant/rider/admin flows, Chad XAF localization and cash-on-delivery. These are **not** substitutes for a financial ledger or payment processor.  
**Scope control:** This document is the only authorized modification. Do not modify code, UI, database, branding or deployment until separately approved.

## 1. Product structure and navigation

- [ ] Define FA-MINNA's consumer financial super-app product, user personas, supported Chad services and phased availability.
- [ ] Build OPay-style **functional navigation**: Home, Transfer, Pay Bills, Cards/Services (only where supported), Rewards, Transactions, Profile.
- [ ] Financial home screen: account greeting, verified identity state, available balance **only when backed by a licensed provider**, show/hide balance, Add Money, Send Money, Withdraw, Pay Bills, Airtime, Data, QR Pay and Recent Transactions.
- [ ] Services grid: Electricity, Water, TV, Mobile Recharge, Data, Merchant Pay, Shopping and Food Delivery, each with clear availability status.
- [ ] Financial activity: filter by date/type/status, receipts, transaction detail, search and dispute/report action.
- [ ] Design polished responsive mobile-first UI, tablet/desktop views, accessible buttons, skeletons, errors, offline/empty states, dark-text readability, confirmation dialogs and bottom navigation.
- [ ] Support French and Arabic (RTL) plus English; use XAF/FCFA and +235 phone formatting; ensure local number validation and translations.
- [ ] Preserve approved FA-MINNA brand assets; no copying OPay logos, copyrighted artwork or exact screens.
- [ ] Keep existing shopping/restaurant/delivery as an additional service, not the primary homepage.

## 2. Customer onboarding, identity and protection

- [ ] Sign-up/sign-in with +235 mobile OTP and supported optional authentication; session refresh and secure sign-out.
- [ ] Account profile, personal details, contact preferences and support contact.
- [ ] Design KYC tiers and limits in accordance with licensed partner requirements and Chad/CEMAC rules.
- [ ] Identity/document verification, selfie/liveness if required, sanctions/PEP checks and review workflows through approved vendors.
- [ ] Transaction PIN, device binding, step-up OTP, optional biometrics, login alerts and session/device management.
- [ ] Account recovery, PIN reset, failed-attempt lockout, suspicious-account freeze/unfreeze and audit logs.
- [ ] Customer consent, privacy, data retention and handling of identity documents and location information.
- [ ] Fraud controls: velocity limits, suspicious recipients, duplicate payments, beneficiary risk and manual review.

## 3. Wallet and financial ledger — gated

- [ ] Decide regulated operating model: licensed bank/payment institution partner, sponsor arrangement or appropriate authorization before custody/payment services.
- [ ] Obtain partner-approved APIs, contractual responsibilities, consumer protections, transaction limits and settlement obligations.
- [ ] Wallet/account creation and provider account mapping **only after legal and technical approval**.
- [ ] Balance API based on provider-authoritative ledger; never fabricate balances.
- [ ] Financial double-entry ledger, immutable postings, idempotency keys, pending/posted/reversed states and balanced transaction rules.
- [ ] Cash-in/Add Money: permitted bank or mobile-money rails and verified funding confirmation.
- [ ] Cash-out/Withdraw: eligible destinations, limits, fees, recipient confirmation and proof of payout.
- [ ] User-to-user FA-MINNA transfer: recipient lookup, name confirmation, fees, PIN, processing, receipt and reversal handling.
- [ ] Failed, timed-out and duplicated transfers: reconciliation, status polling, dispute and safe retry.
- [ ] Daily balance and settlement reconciliation, exception queues, audit trail and financial reporting.
- [ ] No client-side balance edits, localStorage ledger, fake transaction success or release without approved financial partner.

## 4. Banks, transfers and beneficiaries

- [ ] Identify banks and licensed interoperable payment rails **actually available in Chad**; do not assume Nigerian NIBSS/NGN integrations.
- [ ] Integrate partner account validation, beneficiary name inquiry and bank directory.
- [ ] Link bank accounts only through provider-approved consent/verification flow.
- [ ] Bank-to-wallet funding and wallet-to-bank transfers, if approved and technically available.
- [ ] Saved beneficiaries, recent recipients, transfer limits, fees, confirmation and receipts.
- [ ] Provider webhooks with signature verification, replay protection, retries and reconciliation.
- [ ] Handle downtime, partial failures, refunds/reversals, settlement delays and customer disputes.
- [ ] Test sandbox before enabling live banking buttons.

## 5. Airtime, data and bill payment

- [ ] Contract with supported Chad bill-payment/airtime aggregators or each provider directly; verify actual product catalog.
- [ ] Airtime recharge for supported mobile operators: number, network, amount, fee, confirmation, receipt and failed-vend refund.
- [ ] Mobile data bundles: operator, plans, price, validity, recipient, payment and fulfillment status.
- [ ] Electricity: supported utility, meter/customer validation, tariff, amount, token/receipt delivery and failed fulfillment.
- [ ] Water bills: supported biller and customer reference validation if provider offers an API.
- [ ] TV/subscriptions: supported billers/packages, account validation, renewal, receipt and dispute handling.
- [ ] Other permitted bills: schools, internet, government/merchant invoices **only where providers are contracted**.
- [ ] Saved billers, repeat payment, bill history, notifications and support.
- [ ] Server-side catalog and fees, signed webhooks, settlement reports and no success screen until verified provider confirmation.
- [ ] Clearly show “Coming soon” or disable services without live partners.

## 6. QR, merchant and business payments

- [ ] Merchant onboarding, business KYC, approved categories, account roles and settlement details.
- [ ] Merchant dashboard: payment links, QR acceptance, transactions, settlements, refunds and reconciliation.
- [ ] Static/dynamic QR payment requests, merchant name/amount verification, payer PIN and receipt.
- [ ] Merchant checkout integration for FA-MINNA shopping and third-party businesses.
- [ ] Payment request and invoice flow, transaction reference, expiration, partial/failure handling and fraud checks.
- [ ] Merchant fees, settlement schedules, refund/chargeback rules and support workflow.
- [ ] Optional agent/cash-in/cash-out program only with approved partner, contracts, cash controls, liquidity and supervision.

## 7. Cards, savings, rewards and advanced services — not launch assumptions

- [ ] Evaluate virtual/physical cards only with licensed issuer, scheme and PCI-compliant provider.
- [ ] Evaluate savings, credit, overdrafts or insurance **only with separately authorized partners** and applicable disclosures.
- [ ] Optional referral/rewards system: clear terms, fraud checks, real accounting and no misleading earnings promises.
- [ ] Do not market unapproved financial products as live.

## 8. Existing shopping and food delivery — retained, secondary

- [ ] Keep existing restaurant discovery, verified menus, cart, customer addresses, checkout and orders.
- [ ] Keep restaurant-owner, rider and admin dashboards and role-based controls.
- [ ] Keep real road routing, GPS consent, order timeline, live rider location when connected and proof of delivery.
- [ ] Keep COD operational until additional payment methods are legally and technically approved.
- [ ] When licensed merchant payment is available, connect shopping checkout to **verified** provider payment references and order settlement.
- [ ] Keep Abéché catalog, XAF, +235 and French/Arabic/English; do not silently replace with Nigerian data.

## 9. Backend, infrastructure and security

- [ ] Review existing repository and inventory reusable UI components, APIs, Supabase tables, migrations, tests and operational gaps.
- [ ] Separate regulated financial domain from food delivery domain: financial accounts, ledger, provider adapters, billers, transactions and audit.
- [ ] API contracts for wallet, transfer, bill pay, merchant QR, KYC, beneficiaries, receipts, notifications and disputes.
- [ ] Secure secret storage, HTTPS, allowlisted origins, API authentication, RLS, least privilege and encryption of sensitive data.
- [ ] Dedicated immutable financial event logs, idempotent state transitions, webhook verification, job queues and retries.
- [ ] Rate limits, fraud/AML alerts, sanctions screening, incident response, backups, restore drill and monitoring.
- [ ] Financial reconciliation reports, provider settlement files, exception handling and controlled admin overrides.
- [ ] Verify accessibility, performance on low-end Android devices, low-bandwidth loading and mobile-browser compatibility.
- [ ] Independent security review and penetration testing before real-money operation.
- [ ] Tests: unit, integration, sandbox, concurrency, race conditions, RLS, role isolation, money movement, reversal, reconciliation and outage recovery.

## 10. Admin, compliance and customer support

- [ ] Financial admin console: KYC review, user access, account holds, transaction investigation, provider health and fraud alerts.
- [ ] Bill-payment dashboard: product availability, failed fulfillment, refunds, biller settlement and exceptions.
- [ ] Merchant/agent dashboard: onboarding, risk checks, transaction reconciliation, payouts and support.
- [ ] Customer support: searchable tickets, transaction disputes, receipts, response SLA and escalation.
- [ ] Legal review for Chad and applicable CEMAC/BEAC/COBAC payment-services framework; determine required authorization and permitted partner model.
- [ ] Draft accurate fees, limits, privacy policy, terms, complaints, refunds, consent and fraud disclosures.
- [ ] Define financial reporting, AML/CFT controls, record retention and audit responsibilities with legal/compliance advisers.
- [ ] Never describe FA-MINNA as a licensed bank or OPay affiliate.

## 11. Seven-day engineering sprint — prototype and partner readiness, NOT guaranteed financial launch

### Day 1 — Product specification and integration discovery
- [ ] Finalize financial-first IA and approved FA-MINNA UI wireframes.
- [ ] List Chad-specific licensed banks, mobile money, airtime and biller partners to approach.
- [ ] Define compliance model, available API docs, service eligibility and partner dependencies.
- [ ] Document existing repository modules to reuse; record no-touch files.

### Day 2 — Financial UI foundation
- [ ] Implement responsive home, transfer, bills, wallet, transactions and profile **in an isolated branch after approval**.
- [ ] Design onboarding, PIN, security, service-unavailable and provider-pending states.
- [ ] Verify French/Arabic/English, FCFA and +235 across all new screens.

### Day 3 — API and ledger design
- [ ] Implement secure provider abstraction and sandbox-only financial API contracts.
- [ ] Design transaction states, double-entry accounting, immutable audit and reconciliation.
- [ ] Add authentication/authorization, idempotency, limits and failure handling.

### Day 4 — Transfer and wallet sandbox flows
- [ ] Test provider sandbox or explicitly labeled simulated non-money flows.
- [ ] Build beneficiaries, confirmation, receipts, transfer status and reversal/error screens.
- [ ] Test concurrency, duplicates, outages and unauthorized access.

### Day 5 — Bills, airtime, merchant QR
- [ ] Integrate approved sandbox biller catalogs or mark services unavailable.
- [ ] Build airtime/data/electricity/bills flows and payment receipts.
- [ ] Build merchant QR/payment-request UI and provider confirmation handling.

### Day 6 — End-to-end security and operations
- [ ] Test all new screens, financial-state security, settlement reconciliation and support/admin views.
- [ ] Run existing shopping/delivery regression suite; ensure nothing else changes.
- [ ] Review provider agreements, KYC, fraud controls and consumer disclosures.

### Day 7 — Controlled demo or gated pilot
- [ ] Release an **explicitly non-financial demo** if live partners/authorization are pending.
- [ ] Enable real-money services **only** if authorization, licensed partner contracts, live API access, security testing and settlement operations are independently complete.
- [ ] Record readiness evidence and launch decision; keep unsupported features disabled.

## 12. Geographic expansion

- [ ] **Abéché:** initial controlled customer research, merchant recruitment, partner testing and pilot.
- [ ] **N’Djamena:** expand when support, compliance, licensed coverage, partner settlement and operations are proven; adapt local agents/merchants and support.
- [ ] Add further Chad cities only with verified provider coverage, reliable service and operational readiness.

## Release blockers — mandatory

- [ ] Appropriate legal authorization or licensed partner arrangements for each financial service.
- [ ] Real provider credentials, signed webhooks, sandbox acceptance and settlement reconciliation.
- [ ] Financial ledger consistency, no fake balances, no fabricated successful transfers.
- [ ] KYC/AML, fraud, limits, privacy and security controls reviewed.
- [ ] Customer support, dispute handling, receipts and refunds operational.
- [ ] Mobile UX and multilingual accessibility tested.
- [ ] Existing shopping/delivery features still function without unauthorized changes.

**Note:** This checklist corrects the earlier restaurant-first scope. The previous Chad delivery PDF and current repository describe a delivery product, not a complete OPay-like financial application; the wallet, banking, bills, QR and compliance requirements above are new requested scope. A seven-day sprint can deliver a tested interface/prototype, not promise regulated financial-service authorization.
