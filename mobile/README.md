# FAMIPAY Capacitor Android application

## Install an inspection APK

The `mobile/android-preview` branch builds an offline inspection APK through `.github/workflows/android-preview.yml`. Download **FAMIPAY-preview.apk** from the [FAMIPAY preview release](https://github.com/devsmaj/Famipay/releases/tag/famipay-preview).

This build needs no domain, Firebase or sign-in. A visible preview banner identifies it. Its internal local service stores profile edits on the phone, returns empty financial history, and rejects money movement. It never connects to production accounts. Financial providers, real transfers, live backend operations and push remain outside this inspection build.

Build locally with `FAMIPAY_MOBILE_PREVIEW=true` and run `npm run sync --prefix mobile`. The debug package is `com.famipay.app.preview` and installs separately from a future production app. Each workflow run receives an increasing timestamp-based Android version code. A reusable public **preview-only test key** in the preview release keeps subsequent preview APKs update-compatible; do not use it for production.

This directory is the separate **financial-only** mobile application. It uses the web app's green FAMIPAY branding, account authentication and profile API. Its navigation is Home, Wallet, Services, Transactions and Me. The packaged output excludes restaurants, menus, carts, food orders, agriculture and shopping. The website and existing backend remain unchanged.

## Start

From the repository root:

```powershell
npm.cmd ci --prefix mobile
npm.cmd run build --prefix mobile
npm.cmd test --prefix mobile
npm.cmd run test:browser --prefix mobile
npm.cmd run sync --prefix mobile
npm.cmd run android --prefix mobile
```

Browser checks use the repository's existing Playwright installation in `backend/node_modules` and Chrome. Install the backend development dependencies first if necessary. Set `BROWSER_CHANNEL=chromium` to use an installed Playwright Chromium.

Android builds need Android Studio, an Android SDK matching `android/variables.gradle`, and a compatible JDK. This workstation had neither Java nor an Android SDK when the mobile project was created. After installing them, use Android Studio or `mobile/android/gradlew.bat assembleDebug`. The output is `mobile/android/app/build/outputs/apk/debug/app-debug.apk`.

## Configuration and release status

- `FAMIPAY_MOBILE_API_URL`: HTTPS account API; defaults to the API already used by the web app. Its `FRONTEND_ORIGINS` must include `https://localhost` for the Android WebView. Hosted authentication and profile changes need staging verification.
- `FAMIPAY_MOBILE_TERMS_URL` and `FAMIPAY_MOBILE_PRIVACY_URL`: published HTTPS financial account policies. Registration remains unavailable without both because the repository's current terms and privacy pages describe the separate delivery business. No replacement legal policy is invented.
- Supabase must allow `famipay://auth/login` and `famipay://auth/login?recovery=1` redirects. Test email confirmation, recovery, session refresh and sign-out on a phone. Current session persistence follows the web account implementation; native secure storage remains a production review item.
- The repository has **no connected wallet, financial transaction history, transfer, bill, airtime, identity or PIN provider**. Screens state this explicitly. Payment review never sends funds or fabricates a successful transaction.
- Android notification permission, channel and client integration are present. Push is off by default. Before enabling `FAMIPAY_MOBILE_PUSH_ENABLED=true`, implement authenticated financial device registration at `/push/devices`, a financial notification sender and logout cleanup, and provide `android/app/google-services.json` for `com.famipay.app`. No food-order notification integration is included.
- `ANDROID_VERSION_CODE` must increase for every distributed build; `ANDROID_VERSION_NAME` sets the Android display version. A release build requires `ANDROID_KEYSTORE_PATH`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` and Firebase configuration. Keep the same package ID and signing key for updates. The in-app update link opens GitHub Releases; automatic APK publication/version allocation is not configured yet.

This is a financial-only Capacitor foundation, **not a verified production release**. No signed release APK or on-device acceptance result has been produced. Configure the financial services, support contact, policies, signing and Firebase before launching.
