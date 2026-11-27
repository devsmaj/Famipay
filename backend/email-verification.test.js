const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(
  path.join(__dirname, '../assets/js/verify-email.js'),
  'utf8',
);

function element() {
  return {
    value: '',
    textContent: '',
    dataset: {},
    disabled: false,
    hidden: false,
    listeners: {},
    addEventListener(type, listener) { this.listeners[type] = listener; },
    append(child) { this.textContent += child.textContent; },
    checkValidity() { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value); },
    reportValidity() {},
    focus() {},
  };
}

function boot({verifyError = null, verifySession = true, profileEmail = 'member@example.com',
  sessionEmail = 'member@example.com', resendError = null} = {}) {
  const ids = [
    'verification-form',
    'verification-email',
    'verification-code',
    'verification-destination',
    'verification-status',
    'resend-countdown',
    'resend-verification',
    'verify-email-button',
    'change-email',
  ];
  const elements = Object.fromEntries(ids.map(id => [id, element()]));
  const values = new Map([['famina-pending-email-verification', 'member@example.com']]);
  const calls = {verify: [], resend: [], refresh: 0, notifications: []};
  const timers = [];
  let intervalId = 0;
  const session = {
    user: {id: 'user-1', email: sessionEmail},
  };
  const user = {
    id: 'user-1',
    email: profileEmail,
    email_verified: true,
    onboarding_complete: false,
  };
  const F = {
    ready: Promise.resolve(),
    client: {
      auth: {
        getSession: async () => ({data: {session: null}, error: null}),
        verifyOtp: async params => {
          calls.verify.push(params);
          if (verifyError) return {data: null, error: verifyError};
          return {
            data: {session: verifySession ? session : null, user: session.user},
            error: null,
          };
        },
        resend: async params => {
          calls.resend.push(params);
          return {error: resendError};
        },
      },
    },
    user: null,
    refreshUser: async () => {
      calls.refresh++;
      F.user = user;
    },
    notify: (message, type) => calls.notifications.push({message, type}),
  };
  const location = {
    href: 'https://famina.example/verify-email.html',
    pathname: '/verify-email.html',
    destinations: [],
    replace(destination) { this.destinations.push(destination); },
  };
  const window = {
    Famina: F,
    FaminaLoading: {button: () => () => {}},
    i18n: {t: (_key, fallback) => fallback},
    addEventListener() {},
    setInterval: () => ++intervalId,
    clearInterval() {},
    setTimeout: callback => {
      timers.push(callback);
      return timers.length;
    },
    clearTimeout() {},
  };
  const context = {
    window,
    document: {
      getElementById: id => elements[id],
      createElement: () => element(),
    },
    sessionStorage: {
      getItem: key => values.get(key) || null,
      setItem: (key, value) => values.set(key, value),
      removeItem: key => values.delete(key),
    },
    location,
    history: {replaceState() {}},
    URL,
    URLSearchParams,
    Date,
    setImmediate,
  };
  vm.runInNewContext(source, context);
  return {elements, calls, F, location, timers, values, resendError};
}

async function settle() {
  for (let count = 0; count < 5; count++)
    await new Promise(resolve => setImmediate(resolve));
}

test('email OTP uses Supabase verification and only routes after verified profile/session checks', async () => {
  const app = boot();
  await settle();
  app.elements['verification-code'].value = '123456';
  await app.elements['verification-form'].listeners.submit({preventDefault() {}});
  await settle();

  assert.deepEqual(app.calls.verify.map(call => ({
    email: call.email,
    token: call.token,
    type: call.type,
  })), [{email: 'member@example.com', token: '123456', type: 'email'}]);
  assert.equal(app.calls.refresh, 1);
  assert.equal(app.elements['verification-status'].textContent, 'Email verified successfully!');
  assert.deepEqual(app.calls.notifications, [{
    message: 'Email verified successfully!',
    type: 'success',
  }]);

  app.timers[0]();
  assert.deepEqual(app.location.destinations, ['famipay-onboarding.html']);
});

test('expired or invalid OTP never produces success or redirects', async () => {
  const app = boot({
    verifyError: {code: 'otp_expired', message: 'Token has expired or is invalid'},
  });
  await settle();
  app.elements['verification-code'].value = '123456';
  await app.elements['verification-form'].listeners.submit({preventDefault() {}});
  await settle();

  assert.equal(app.elements['verification-status'].dataset.state, 'error');
  assert.equal(app.elements['verification-status'].textContent, 'This code has expired. Request a new code.');
  assert.equal(app.calls.refresh, 0);
  assert.deepEqual(app.location.destinations, []);
});

test('incorrect and previously used OTPs show actionable errors', async t => {
  for (const [title, error, expected] of [
    [
      'incorrect',
      {code: 'otp_invalid', message: 'Token is invalid'},
      'That code is incorrect. Check it and try again.',
    ],
    [
      'already used',
      {code: 'otp_already_used', message: 'Token has already been used'},
      'This code was already used. Request a new code if needed.',
    ],
  ]) {
    await t.test(title, async () => {
      const app = boot({verifyError: error});
      await settle();
      app.elements['verification-code'].value = '123456';
      await app.elements['verification-form'].listeners.submit({preventDefault() {}});
      await settle();

      assert.equal(app.elements['verification-status'].dataset.state, 'error');
      assert.equal(app.elements['verification-status'].textContent, expected);
      assert.deepEqual(app.location.destinations, []);
      assert.equal(app.calls.refresh, 0);
    });
  }
});

test('resend uses Supabase signup OTP and starts a visible cooldown', async () => {
  const app = boot();
  await settle();
  await app.elements['resend-verification'].listeners.click();
  await settle();

  assert.deepEqual(JSON.parse(JSON.stringify(app.calls.resend)), [
    {type: 'signup', email: 'member@example.com'},
  ]);
  assert.equal(app.elements['verification-status'].textContent,
    'If this address still needs verification, a new code has been sent.');
  assert.equal(app.elements['resend-verification'].disabled, true);
  assert.equal(app.elements['resend-countdown'].hidden, false);
});

test('a session for another email cannot be accepted as verification', async () => {
  const app = boot({sessionEmail: 'someone-else@example.com'});
  await settle();
  app.elements['verification-code'].value = '123456';
  await app.elements['verification-form'].listeners.submit({preventDefault() {}});
  await settle();

  assert.equal(app.elements['verification-status'].dataset.state, 'error');
  assert.equal(app.elements['verification-status'].textContent,
    'The verified account does not match this email address.');
  assert.equal(app.calls.refresh, 0);
  assert.deepEqual(app.location.destinations, []);
});

test('an accepted OTP without an authenticated session is not reported as success', async () => {
  const app = boot({verifySession: false});
  await settle();
  app.elements['verification-code'].value = '123456';
  await app.elements['verification-form'].listeners.submit({preventDefault() {}});
  await settle();

  assert.equal(app.elements['verification-status'].dataset.state, 'error');
  assert.equal(app.elements['verification-status'].textContent,
    'The code was accepted, but your sign-in session is unavailable. Please sign in.');
  assert.deepEqual(app.location.destinations, []);
});
