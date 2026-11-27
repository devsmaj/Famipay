const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('frontend does not contain email OTP verification controls or verifyOtp calls', () => {
  const html = fs.readFileSync(path.join(__dirname, '../verify-email.html'), 'utf8');
  const script = fs.readFileSync(path.join(__dirname, '../assets/js/verify-email.js'), 'utf8');
  assert.doesNotMatch(html, /verification-code|6-digit|Verify Email|Resend Code/i);
  assert.doesNotMatch(script, /verifyOtp|otp|one-time/i);
  assert.match(html, /Check Your Email/);
  assert.match(html, /Resend Confirmation Email/);
});

test('confirmation uses a GitHub Pages callback and Supabase signup resend', () => {
  const auth = fs.readFileSync(path.join(__dirname, '../assets/js/supabase-auth.js'), 'utf8');
  const verify = fs.readFileSync(path.join(__dirname, '../assets/js/verify-email.js'), 'utf8');
  const index = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

  assert.match(auth, /devsmaj\.github\.io/);
  assert.match(auth, /\/Famipay\//);
  assert.match(auth, /emailRedirectTo:\s*emailConfirmationUrl\(\)/);
  assert.match(auth, /session\.user\?\.email_confirmed_at/);
  assert.match(verify, /type:\s*'signup'/);
  assert.match(verify, /emailRedirectTo:\s*callbackUrl/);
  assert.match(verify, /session\.user\?\.email_confirmed_at/);
  assert.match(index, /verify-email\.html\?verified=1/);
  assert.match(index, /email_confirmed_at/);
  assert.match(index, /exchangeCodeForSession/);
  assert.match(index, /app_metadata\?\.provider\s*===\s*'google'/);
});

test('expired and already-used confirmation links have actionable states', () => {
  const script = fs.readFileSync(path.join(__dirname, '../assets/js/verify-email.js'), 'utf8');
  assert.match(script, /confirmation_expired/);
  assert.match(script, /confirmation_used/);
  assert.match(script, /confirmation_invalid/);
  assert.match(script, /confirmation_countdown/);
});
