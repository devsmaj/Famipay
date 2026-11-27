const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(
  path.join(__dirname, '../assets/js/famipay-onboarding.js'),
  'utf8',
);
const markup = fs.readFileSync(
  path.join(__dirname, '../famipay-onboarding.html'),
  'utf8',
);
const styles = fs.readFileSync(
  path.join(__dirname, '../assets/css/famipay-onboarding.css'),
  'utf8',
);

function node() {
  return {
    hidden: false,
    disabled: false,
    value: '',
    textContent: '',
    dataset: {},
    style: {},
    children: [],
    listeners: {},
    attributes: {},
    append(...items) { this.children.push(...items); },
    replaceChildren(...items) { this.children = items; },
    remove() {},
    addEventListener(type, listener) { this.listeners[type] = listener; },
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
    querySelector(selector) {
      if (selector === '[type="submit"]') return this.submitButton ||= node();
      if (selector === '.fp-onboarding-spinner')
        return this.children.find(item => item.className === 'fp-onboarding-spinner') || null;
      return null;
    },
    focus() {},
    reportValidity() { return true; },
    reset() {},
  };
}

function boot({confirmed = true, metadataVerified = false, hangSession = false} = {}) {
  const ids = [
    'onboarding-back', 'verify-step', 'profile-step', 'pin-step', 'ready-step',
    'onboarding-progress-bar', 'verification-state', 'onboarding-error',
    'onboarding-error-text', 'retry-verification', 'retry-onboarding',
    'verify-title', 'profile-title', 'pin-title', 'ready-title',
    'profile-form', 'profile-name',
    'pin-form', 'account-pin', 'confirm-pin', 'open-home',
  ];
  const elements = Object.fromEntries(ids.map(id => [id, node()]));
  const progress = ['verify', 'profile', 'pin', 'ready'].map(step => {
    const item = node();
    item.dataset.onboardingStep = step;
    return item;
  });
  const requests = [];
  const redirects = [];
  const rawUser = {
    id: 'user-1',
    email: 'user@example.com',
    ...(metadataVerified ? {user_metadata: {email_verified: true}} : {}),
    ...(confirmed ? {email_confirmed_at: '2026-11-27T00:00:00Z'} : {}),
  };
  const F = {
    ready: Promise.resolve(),
    client: {auth: {getSession: async () => hangSession ? new Promise(() => {}) : ({data: {session: {
      access_token: 'valid-session',
      user: rawUser,
    }}, error: null})}},
    user: null,
    refreshUser: async () => {
      F.user = {
        ...F.user,
        id: 'user-1',
        email: 'user@example.com',
        email_verified: confirmed,
        phone_verified: false,
        onboarding_complete: F.user?.onboarding_complete || false,
        name: F.user?.name || 'Customer',
      };
    },
    api: async (route, options) => {
      requests.push({route, options});
      if (route === '/profile') {
        F.user.name = options.body.name;
        return {ok: true};
      }
      if (route === '/auth/pin') {
        F.user.onboarding_complete = true;
        return {onboarding_complete: true};
      }
      throw new Error('Unexpected API route');
    },
  };
  const timers = new Map();
  let timerId = 0;
  const assignments = [];
  const window = {
    Famina: F,
    i18n: {t: (_key, fallback) => fallback},
    setTimeout(callback, ms) {
      const id = ++timerId;
      timers.set(id, {callback, ms});
      return id;
    },
    clearTimeout(id) { timers.delete(id); },
    addEventListener() {},
  };
  const document = {
    getElementById: id => elements[id],
    querySelectorAll: selector => selector === '[data-onboarding-step]' ? progress : [],
    createElement: () => node(),
    addEventListener() {},
  };
  const context = {
    window,
    document,
    location: {replace: url => redirects.push(url), assign: url => assignments.push(url)},
    setImmediate,
  };
  vm.runInNewContext(source, context);
  return {elements, progress, requests, redirects, assignments, F, timers};
}

async function settle() {
  for (let index = 0; index < 6; index++)
    await new Promise(resolve => setImmediate(resolve));
}

test('verified Supabase user can complete profile, secure PIN and reach the dashboard', async () => {
  const app = boot();
  await settle();
  assert.equal(app.elements['verification-state'].dataset.state, 'success');
  [...app.timers.values()].find(timer => timer.ms === 550)?.callback();
  await settle();
  assert.equal(app.elements['profile-step'].hidden, false);

  app.elements['profile-name'].value = 'Ada Customer';
  await app.elements['profile-form'].listeners.submit({
    preventDefault() {},
    currentTarget: app.elements['profile-form'],
  });
  await settle();
  assert.equal(app.requests[0].route, '/profile');
  assert.equal(app.requests[0].options.body.name, 'Ada Customer');
  assert.equal(app.elements['pin-step'].hidden, false);

  app.elements['account-pin'].value = '123456';
  app.elements['confirm-pin'].value = '123456';
  await app.elements['pin-form'].listeners.submit({
    preventDefault() {},
    currentTarget: app.elements['pin-form'],
  });
  await settle();
  assert.equal(app.requests[1].route, '/auth/pin');
  assert.equal(app.requests[1].options.body.pin, '123456');
  assert.equal(app.elements['ready-step'].hidden, false);
  assert.equal(app.F.user.onboarding_complete, true);

  app.elements['open-home'].listeners.click();
  assert.deepEqual(app.redirects, ['famipay-app.html']);
});

test('unverified Supabase session is not marked verified and exposes retry', async () => {
  const app = boot({confirmed: false});
  await settle();
  assert.equal(app.elements['verification-state'].dataset.state, 'error');
  assert.equal(app.elements['retry-verification'].hidden, false);
  assert.equal(app.elements['profile-step'].hidden, true);
  assert.equal(app.requests.length, 0);
  assert.deepEqual(app.redirects, []);
});

test('user-editable metadata cannot bypass Supabase email confirmation', async () => {
  const app = boot({confirmed: false, metadataVerified: true});
  await settle();
  assert.equal(app.elements['verification-state'].dataset.state, 'error');
  assert.equal(app.elements['retry-verification'].hidden, false);
  assert.equal(app.elements['profile-step'].hidden, true);
});

test('header back arrow returns to the preceding step and then to email verification', async () => {
  const app = boot();
  await settle();
  [...app.timers.values()].find(timer => timer.ms === 550)?.callback();
  await settle();
  assert.equal(app.elements['profile-step'].hidden, false);

  app.elements['onboarding-back'].listeners.click();
  assert.equal(app.elements['verify-step'].hidden, false);
  assert.equal(app.elements['profile-step'].hidden, true);
  app.elements['onboarding-back'].listeners.click();
  assert.deepEqual(app.assignments, ['verify-email.html']);
});

test('a verification timeout shows an actionable retry instead of an endless pending state', async () => {
  const app = boot({hangSession: true});
  await settle();
  const timeout = [...app.timers.values()].find(timer => timer.ms === 12_000);
  assert(timeout, 'verification should use a bounded timeout');
  timeout.callback();
  await settle();
  assert.equal(app.elements['verification-state'].dataset.state, 'error');
  assert.equal(app.elements['retry-verification'].hidden, false);
});

test('onboarding keeps the official logo, compact progress, and Android safe-area spacing', () => {
  assert.match(markup, /id="onboarding-back"/);
  assert.match(markup, /assets\/branding\/famipay-logo\.svg/);
  assert.match(markup, /data-onboarding-step="ready"/);
  assert.doesNotMatch(markup, /fp-onboarding-footer|onboarding\.secure_note|onboarding\.need_help/);
  assert.match(styles, /min-height:\s*100svh/);
  assert.match(styles, /env\(safe-area-inset-bottom/);
  assert.match(styles, /background:\s*#fff/);
  assert.match(styles, /content:\s*"✓"/);
});
