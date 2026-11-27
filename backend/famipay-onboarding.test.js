const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(
  path.join(__dirname, '../assets/js/famipay-onboarding.js'),
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

function boot({confirmed = true, metadataVerified = false} = {}) {
  const ids = [
    'verify-step', 'profile-step', 'pin-step', 'ready-step',
    'onboarding-progress-bar', 'verification-state', 'onboarding-error',
    'onboarding-error-text', 'retry-verification', 'retry-onboarding',
    'verify-title', 'profile-title', 'pin-title', 'ready-title',
    'continue-verification', 'profile-form', 'profile-name',
    'pin-form', 'account-pin', 'confirm-pin', 'open-home',
  ];
  const elements = Object.fromEntries(ids.map(id => [id, node()]));
  const progress = ['verify', 'profile', 'pin', 'ready'].map(step => {
    const item = node();
    item.dataset.onboardingStep = step;
    return item;
  });
  const backButtons = [node(), node()];
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
    client: {auth: {getSession: async () => ({data: {session: {
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
    querySelectorAll: selector => selector === '[data-onboarding-step]'
      ? progress
      : selector === '[data-onboarding-back]' ? backButtons : [],
    createElement: () => node(),
    addEventListener() {},
  };
  const context = {
    window,
    document,
    location: {replace: url => redirects.push(url)},
    setImmediate,
  };
  vm.runInNewContext(source, context);
  return {elements, progress, backButtons, requests, redirects, F, timers};
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
