const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(
  path.join(__dirname, '../assets/js/supabase-auth.js'),
  'utf8',
);

function element() {
  return {
    value: '',
    dataset: {},
    attributes: {},
    listeners: {},
    hidden: false,
    required: false,
    disabled: false,
    checked: false,
    addEventListener(type, listener) { this.listeners[type] = listener; },
    setAttribute(name, value) { this.attributes[name] = value; },
    getAttribute(name) { return this.attributes[name] || null; },
    removeAttribute(name) { delete this.attributes[name]; },
    querySelectorAll() { return []; },
    querySelector() { return element(); },
    contains() { return true; },
    focus() {},
  };
}

function boot({page = 'register', signUpError = null, signInError = null} = {}) {
  const ids = [
    'firebase-auth', 'phone-form', 'phone-code-form', 'auth-phone', 'auth-email',
    'auth-email-group', 'auth-phone-group', 'auth-use-email', 'auth-use-phone',
    'auth-phone-notice', 'auth-password', 'auth-confirm-password', 'auth-terms',
    'reset-password', 'password-reset-form', 'auth-code',
    'resend-code', 'change-phone', 'password-feedback', 'sent-phone',
    'reset-new-password', 'reset-confirm-password',
  ];
  const elements = Object.fromEntries(ids.map(id => [id, element()]));
  const formSubmit = element();
  elements['phone-form'].querySelector = () => formSubmit;
  elements['phone-code-form'].querySelector = () => formSubmit;
  elements['password-reset-form'].querySelector = () => formSubmit;
  elements['firebase-auth'].dataset = {};
  const values = new Map();
  const calls = {signUp: [], signIn: [], notifications: []};
  const location = {
    href: `https://${page === 'register' ? 'devsmaj.github.io/Famipay/' : 'famina.example/'}`,
    hostname: page === 'register' ? 'devsmaj.github.io' : 'famina.example',
    origin: page === 'register' ? 'https://devsmaj.github.io' : 'https://famina.example',
    search: '',
    replace: destination => calls.notifications.push({redirect: destination}),
  };
  const user = {
    id: 'user-1',
    email: 'member@example.com',
    email_verified: true,
    phone_verified: false,
    onboarding_complete: true,
  };
  const session = {user: {id: user.id, email: user.email}};
  const F = {
    user: null,
    ready: Promise.resolve(),
    client: {
      auth: {
        signUp: async params => {
          calls.signUp.push(params);
          return {
            data: signUpError ? null : {user: {id: user.id, identities: [{}]}, session: null},
            error: signUpError,
          };
        },
        signInWithPassword: async params => {
          calls.signIn.push(params);
          return signInError
            ? {data: null, error: signInError}
            : {data: {session}, error: null};
        },
        getSession: async () => ({data: {session}, error: null}),
      },
    },
    refreshUser: async () => { F.user = user; },
    notify: (message, type) => calls.notifications.push({message, type}),
    retryAuth: async () => {},
  };
  const window = {
    Famina: F,
    FaminaLoading: {button: () => () => {}},
    i18n: {t: (_key, fallback) => fallback},
    addEventListener() {},
  };
  const context = {
    window,
    document: {
      body: {dataset: {authPage: page}},
      getElementById: id => elements[id] || element(),
      addEventListener() {},
    },
    location,
    sessionStorage: {
      getItem: key => values.get(key) || null,
      setItem: (key, value) => values.set(key, value),
      removeItem: key => values.delete(key),
    },
    URL,
    Date,
    setImmediate,
  };
  vm.runInNewContext(source, context);
  return {elements, calls, values, location, user};
}

async function settle() {
  for (let count = 0; count < 5; count++)
    await new Promise(resolve => setImmediate(resolve));
}

test('email registration directs new users to confirmation page without a private-page redirect', async () => {
  const app = boot({page: 'register'});
  await settle();
  app.elements['auth-email'].value = 'member@example.com';
  app.elements['auth-password'].value = 'a-secure-password';
  app.elements['auth-confirm-password'].value = 'a-secure-password';
  app.elements['auth-terms'].checked = true;
  await app.elements['phone-form'].listeners.submit({
    preventDefault() {},
    submitter: {},
  });
  await settle();

  assert.equal(app.calls.signUp.length, 1);
  assert.equal(app.calls.signUp[0].email, 'member@example.com');
  assert.match(app.calls.signUp[0].options.emailRedirectTo, /devsmaj\.github\.io\/Famipay\/$/);
  assert.equal(app.values.get('famina-pending-email-verification'), 'member@example.com');
  assert.deepEqual(app.calls.notifications.filter(call => call.redirect), [
    {redirect: 'verify-email.html'},
  ]);
});

test('duplicate registration feedback uses the shared informational toast', async () => {
  const app = boot({
    page: 'register',
    signUpError: {code: 'user_already_exists', message: 'User already registered'},
  });
  await settle();
  app.elements['auth-email'].value = 'member@example.com';
  app.elements['auth-password'].value = 'a-secure-password';
  app.elements['auth-confirm-password'].value = 'a-secure-password';
  app.elements['auth-terms'].checked = true;
  await app.elements['phone-form'].listeners.submit({
    preventDefault() {},
    submitter: {},
  });
  await settle();

  assert.deepEqual(app.calls.notifications.filter(call => !call.redirect), [{
    message: 'This account is already registered. Please sign in instead.',
    type: 'info',
  }]);
});

test('unverified email login routes to confirmation page rather than showing a generic error', async () => {
  const app = boot({
    page: 'login',
    signInError: {code: 'email_not_confirmed', message: 'Email not confirmed'},
  });
  await settle();
  app.elements['auth-email'].value = 'member@example.com';
  app.elements['auth-password'].value = 'a-secure-password';
  await app.elements['phone-form'].listeners.submit({
    preventDefault() {},
    submitter: {},
  });
  await settle();

  assert.equal(app.values.get('famina-pending-email-verification'), 'member@example.com');
  assert.deepEqual(app.calls.notifications.filter(call => call.redirect), [
    {redirect: 'verify-email.html'},
  ]);
  assert.equal(app.calls.notifications.filter(call => !call.redirect).length, 0);
});

test('verified login redirects to the dashboard with a one-time success receipt', async () => {
  const app = boot({page: 'login'});
  await settle();
  app.elements['auth-email'].value = 'member@example.com';
  app.elements['auth-password'].value = 'a-secure-password';
  await app.elements['phone-form'].listeners.submit({
    preventDefault() {},
    submitter: {},
  });
  await settle();

  assert.deepEqual(app.calls.notifications.filter(call => call.redirect), [
    {redirect: 'famipay-app.html?login=success'},
  ]);
  const receipt = JSON.parse(app.values.get('famina-login-success'));
  assert.equal(receipt.userId, 'user-1');
});
