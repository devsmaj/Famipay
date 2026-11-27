# FAMIPAY Capacitor Android application

The existing Android project and launcher resources are retained under `mobile/android`. The app ID remains `com.famipay.app`; debug APKs use the existing `.preview` suffix so updates replace the distributed preview application rather than installing a second app.

The build copies the website's login, registration, email verification, onboarding, and role-aware private dashboard with their original HTML, CSS, JavaScript, and Supabase client. Onboarding is copied without design edits. Capacitor-native code is limited to email-confirmation deep links, external links, back handling from the shared web navigation, and splash dismissal.

The `famipay://auth/login` confirmation callback must be permitted in Supabase Auth Redirect URLs. The Android WebView origin is `https://localhost`; the deployed API must permit that origin. The app uses the existing API and Supabase settings, not a local/demo financial service.

Build the web bundle with `npm run build --prefix mobile`, run its checks with `npm test --prefix mobile`, and sync Android with `npm run sync --prefix mobile`. An Android SDK and Java 21 are required to assemble the APK.

The `FAMIPAY Android APK` workflow compares the updated APK package and signing certificate with the currently published app, then installs both in sequence on an Android emulator. It publishes `FAMIPAY.apk` only after the update-install check succeeds.
