const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const phoneLibrarySource = fs.readFileSync(
  path.join(__dirname, '../assets/vendor/libphonenumber-max.js'),
  'utf8',
);
const phoneLibraryContext = {};
vm.runInNewContext(phoneLibrarySource, phoneLibraryContext);
const phoneLibrary = phoneLibraryContext.libphonenumber;

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

function boot({
  confirmed = true,
  profileConfirmed = confirmed,
  metadataVerified = false,
  authUserId = 'user-1',
  refreshError = null,
  hangSession = false,
  pinFailures = 0,
  profileErrorField = null,
  savedProfile = null,
} = {}) {
  const ids = [
    'onboarding-back', 'verify-step', 'profile-step', 'pin-step', 'ready-step',
    'onboarding-progress-bar', 'verification-state',
    'verify-title', 'profile-title', 'pin-title', 'ready-title',
    'profile-form', 'profile-first-name', 'profile-last-name',
    'profile-phone', 'profile-phone-flag', 'profile-phone-help',
    'pin-form', 'account-pin', 'confirm-pin', 'open-home',
  ];
  const elements = Object.fromEntries(ids.map(id => [id, node()]));
  elements['profile-phone'].value = '+235 ';
  elements['profile-phone-flag'].textContent = '🇹🇩';
  elements['pin-form'].reset = () => {
    elements['account-pin'].value = '';
    elements['confirm-pin'].value = '';
  };
  const progress = ['verify', 'profile', 'pin', 'ready'].map(step => {
    const item = node();
    item.dataset.onboardingStep = step;
    return item;
  });
  const requests = [];
  const redirects = [];
  const notifications = [];
  const rawUser = {
    id: 'user-1',
    email: 'user@example.com',
    ...(metadataVerified ? {user_metadata: {email_verified: true}} : {}),
    ...(confirmed ? {email_confirmed_at: '2026-11-27T00:00:00Z'} : {}),
  };
  const F = {
    ready: Promise.resolve(),
    client: {auth: {
      getSession: async () => hangSession ? new Promise(() => {}) : ({data: {session: {
        access_token: 'valid-session',
        user: rawUser,
      }}, error: null}),
      getUser: async token => token === 'valid-session'
        ? ({data: {user: {...rawUser, id: authUserId}}, error: null})
        : ({data: {user: null}, error: new Error('Invalid session token')}),
    }},
    user: savedProfile ? {id: 'user-1', ...savedProfile} : null,
    notify: (message, type) => notifications.push({message, type}),
    refreshUser: async () => {
      if (refreshError) throw refreshError;
      F.user = {
        ...F.user,
        id: 'user-1',
        email: 'user@example.com',
        email_verified: profileConfirmed,
        phone_verified: false,
        onboarding_complete: F.user?.onboarding_complete || false,
        name: F.user?.name || 'Customer',
      };
    },
    api: async (route, options) => {
      requests.push({route, options});
      if (route === '/profile') {
        if (profileErrorField)
          throw Object.assign(
            new Error('Required information is missing or too long.'),
            {field: profileErrorField, status: 400},
          );
        F.user.first_name = options.body.firstName;
        F.user.last_name = options.body.lastName;
        F.user.phone = options.body.phone;
        F.user.name = `${options.body.firstName} ${options.body.lastName}`;
        return {ok: true};
      }
      if (route === '/auth/pin') {
        if (requests.filter(request => request.route === '/auth/pin').length <= pinFailures)
          throw new Error('Temporary service error.');
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
    libphonenumber: phoneLibrary,
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
  return {elements, progress, requests, redirects, assignments, notifications, F, timers};
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

  app.elements['profile-first-name'].value = 'Ada';
  app.elements['profile-last-name'].value = 'Customer';
  app.elements['profile-phone'].value = '+235 66 12 34 56';
  await app.elements['profile-form'].listeners.submit({
    preventDefault() {},
    currentTarget: app.elements['profile-form'],
  });
  await settle();
  assert.equal(app.requests[0].route, '/profile');
  assert.equal(JSON.stringify(app.requests[0].options.body), JSON.stringify({
    firstName: 'Ada',
    lastName: 'Customer',
    phone: '+23566123456',
  }));
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

test('phone field defaults to Chad and automatically tracks an international code', async () => {
  const app = boot();
  await settle();
  assert.equal(app.elements['profile-phone-flag'].textContent, '🇹🇩');
  app.elements['profile-phone'].value = '+33612345678';
  app.elements['profile-phone'].listeners.input();
  assert.equal(app.elements['profile-phone-flag'].textContent, '🇫🇷');
});

test('invalid international phone numbers do not save profile details', async () => {
  const app = boot();
  await settle();
  [...app.timers.values()].find(timer => timer.ms === 550)?.callback();
  await settle();
  app.elements['profile-first-name'].value = 'Ada';
  app.elements['profile-last-name'].value = 'Customer';
  app.elements['profile-phone'].value = '+123';
  await app.elements['profile-form'].listeners.submit({
    preventDefault() {},
    currentTarget: app.elements['profile-form'],
  });
  await settle();
  assert.equal(app.requests.some(request => request.route === '/profile'), false);
  assert.match(app.notifications.at(-1).message, /valid international phone number/i);
  assert.equal(app.notifications.at(-1).type, 'error');
});

test('backend field errors become specific localized onboarding messages', async () => {
  const app = boot({profileErrorField: 'phone'});
  await settle();
  [...app.timers.values()].find(timer => timer.ms === 550)?.callback();
  await settle();
  app.elements['profile-first-name'].value = 'Ada';
  app.elements['profile-last-name'].value = 'Customer';
  app.elements['profile-phone'].value = '+23566123456';
  await app.elements['profile-form'].listeners.submit({
    preventDefault() {},
    currentTarget: app.elements['profile-form'],
  });
  await settle();
  assert.equal(app.notifications.at(-1).message,
    'Enter a valid international phone number, including its country code.');
});

test('PIN retry resubmits retained fields after a failed request', async () => {
  const app = boot({pinFailures: 1});
  await settle();
  [...app.timers.values()].find(timer => timer.ms === 550)?.callback();
  await settle();
  app.elements['profile-first-name'].value = 'Ada';
  app.elements['profile-last-name'].value = 'Customer';
  app.elements['profile-phone'].value = '+23566123456';
  await app.elements['profile-form'].listeners.submit({
    preventDefault() {},
    currentTarget: app.elements['profile-form'],
  });
  await settle();

  app.elements['account-pin'].value = '123456';
  app.elements['confirm-pin'].value = '123456';
  await app.elements['pin-form'].listeners.submit({
    preventDefault() {},
    currentTarget: app.elements['pin-form'],
  });
  await settle();
  assert.equal(app.requests.filter(request => request.route === '/auth/pin').length, 1);
  assert.equal(app.elements['account-pin'].value, '123456');
  assert.equal(app.elements['confirm-pin'].value, '123456');

  await app.elements['pin-form'].listeners.submit({
    preventDefault() {},
    currentTarget: app.elements['pin-form'],
  });
  await settle();
  const pinRequests = app.requests.filter(request => request.route === '/auth/pin');
  assert.equal(pinRequests.length, 2);
  assert.equal(pinRequests[1].options.body.pin, '123456');
  assert.equal(app.elements['ready-step'].hidden, false);
  assert.equal(app.elements['account-pin'].value, '');
});

test('unverified Supabase session is not marked verified and shows an error toast', async () => {
  const app = boot({confirmed: false});
  await settle();
  assert.equal(app.elements['verification-state'].dataset.state, 'error');
  assert.equal(app.notifications.at(-1).type, 'error');
  assert.equal(app.elements['profile-step'].hidden, true);
  assert.equal(app.requests.length, 0);
  assert.deepEqual(app.redirects, []);
});

test('Supabase Auth confirmation wins over a stale backend verification flag', async () => {
  const app = boot({confirmed: true, profileConfirmed: false});
  await settle();
  assert.equal(app.elements['verification-state'].dataset.state, 'success');
  [...app.timers.values()].find(timer => timer.ms === 550)?.callback();
  await settle();
  assert.equal(app.elements['profile-step'].hidden, false);
  assert.equal(app.F.user.email_verified, true);
});

test('a verified Auth session can reach profile entry while account details refresh', async () => {
  const app = boot({
    confirmed: true,
    refreshError: Object.assign(new Error('Account status is syncing.'), {status: 503}),
  });
  await settle();
  assert.equal(app.elements['verification-state'].dataset.state, 'success');
  [...app.timers.values()].find(timer => timer.ms === 550)?.callback();
  await settle();
  assert.equal(app.elements['profile-step'].hidden, false);
  assert.equal(app.F.user.id, 'user-1');
  assert.equal(app.F.user.email_verified, true);
});

test('returning verified users with saved details continue directly to Secure PIN', async () => {
  const app = boot({
    savedProfile: {
      first_name: 'Ada',
      last_name: 'Customer',
      name: 'Ada Customer',
      phone: '+23566123456',
      onboarding_complete: false,
    },
  });
  await settle();
  assert.equal(app.elements['profile-step'].hidden, true);
  assert.equal(app.elements['pin-step'].hidden, false);
  assert.equal(app.requests.some(request => request.route === '/profile'), false);
});

test('onboarding rejects an Auth user whose ID does not match the session', async () => {
  const app = boot({confirmed: true, authUserId: 'user-2'});
  await settle();
  assert.equal(app.elements['verification-state'].dataset.state, 'error');
  assert.equal(app.elements['profile-step'].hidden, true);
});

test('user-editable metadata cannot bypass Supabase email confirmation', async () => {
  const app = boot({confirmed: false, metadataVerified: true});
  await settle();
  assert.equal(app.elements['verification-state'].dataset.state, 'error');
  assert.equal(app.notifications.at(-1).type, 'error');
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

test('a verification timeout reports an error without an inline retry box', async () => {
  const app = boot({hangSession: true});
  await settle();
  const timeout = [...app.timers.values()].find(timer => timer.ms === 12_000);
  assert(timeout, 'verification should use a bounded timeout');
  timeout.callback();
  await settle();
  assert.equal(app.elements['verification-state'].dataset.state, 'error');
  assert.equal(app.notifications.at(-1).type, 'error');
});

test('onboarding keeps the official logo, compact progress, and Android safe-area spacing', () => {
  assert.match(markup, /id="onboarding-back"/);
  assert.match(markup, /assets\/branding\/famipay-logo\.svg/);
  assert.match(markup, /data-onboarding-step="ready"/);
  assert.doesNotMatch(markup, /onboarding-error|retry-onboarding|retry-verification/);
  assert.doesNotMatch(markup, /fp-onboarding-footer|onboarding\.secure_note|onboarding\.need_help/);
  assert.match(styles, /min-height:\s*100svh/);
  assert.match(styles, /env\(safe-area-inset-bottom/);
  assert.match(styles, /background:\s*#fff/);
  assert.match(styles, /content:\s*"✓"/);
});
