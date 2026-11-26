# FAMIPAY private frontend prototype

56 distinct private UI route definitions in 9 groups.

Open `famipay-app.html` for the customer walkthrough. For other role walkthroughs use `famipay-app.html?role=merchant`, `?role=agent`, `?role=rider`, or `?role=admin`. Role query parameters are **not authorization**; this is a preview only.

All routes have navigable pages, workflow steps, inputs and local demo review. No API writes, real transactions or backend authentication are implemented in this preview. Existing public pages, backend, auth, database and original private pages remain unchanged.

## Release requirements

Integrate authenticated role guards before replacing private routes. Reuse existing commerce APIs and test real order/cart/fulfillment flows. Keep financial actions disabled pending licensed provider integration and regulatory review. Verify FR/AR/EN, RTL, mobile responsiveness, error states and role permissions. Only then remove legacy private pages and merge.

## Inventory
- Money / Wallet (#wallet)
- Money / Add Money (#add-money)
- Money / Withdraw (#withdraw)
- Money / Send Money (#send-money)
- Money / Bank Transfer (#bank-transfer)
- Money / Mobile Money (#mobile-money)
- Money / Review Payment (#review-payment)
- Money / Transaction Receipt (#transaction-receipt)
- Money / Transaction History (#transaction-history)
- Payments / Airtime (#airtime)
- Payments / Mobile Data (#mobile-data)
- Payments / Pay Bills (#pay-bills)
- Payments / Bill Details (#bill-details)
- Payments / QR Payment (#qr-payment)
- Payments / Receive Money (#receive-money)
- FA-MINNA Express / Express Home (#express-home)
- FA-MINNA Express / Restaurants (#restaurants)
- FA-MINNA Express / Restaurant Menu (#restaurant-menu)
- FA-MINNA Express / Food Cart (#food-cart)
- FA-MINNA Express / Food Checkout (#food-checkout)
- FA-MINNA Express / Track Food Order (#track-food-order)
- FA-MINNA Express / Agriculture (#agriculture)
- FA-MINNA Express / Farm Product (#farm-product)
- FA-MINNA Express / Online Shop (#online-shop)
- FA-MINNA Express / Product Details (#product-details)
- FA-MINNA Express / Shop Checkout (#shop-checkout)
- FA-MINNA Express / My Orders (#my-orders)
- Account / Notifications (#notifications)
- Account / My Profile (#my-profile)
- Account / Settings (#settings)
- Account / Help Center (#help-center)
- Merchant / Merchant Registration (#merchant-registration)
- Merchant / Merchant Dashboard (#merchant-dashboard)
- Merchant / Merchant QR (#merchant-qr)
- Merchant / Merchant Orders (#merchant-orders)
- Merchant / Catalog Management (#catalog-management)
- Merchant / Refunds (#refunds)
- Agent / Find Agent (#find-agent)
- Agent / Agent Dashboard (#agent-dashboard)
- Agent / Agent Float (#agent-float)
- Rider / Rider Dashboard (#rider-dashboard)
- Rider / Delivery Details (#delivery-details)
- Rider / Delivery Proof (#delivery-proof)
- Admin / Admin Dashboard (#admin-dashboard)
- Admin / User Management (#user-management)
- Admin / KYC Review (#kyc-review)
- Admin / Payment Exceptions (#payment-exceptions)
- Admin / Disputes and Fraud (#disputes-and-fraud)
- Admin / Service Configuration (#service-configuration)
- Admin / Audit Log (#audit-log)
- Getting started / Language Selection (#language-selection)
- Getting started / Onboarding (#onboarding)
- Getting started / Create Account (#create-account)
- Getting started / Verify Phone (#verify-phone)
- Getting started / Identity Verification (#identity-verification)
- Getting started / Login and PIN (#login-and-pin)