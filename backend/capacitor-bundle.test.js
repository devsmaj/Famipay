const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {buildWeb} = require('../scripts/build-capacitor-web.cjs');

test('Capacitor packages the shared private app and auth without onboarding or registration', t => {
  const destination = fs.mkdtempSync(path.join(os.tmpdir(), 'famipay-capacitor-'));
  t.after(() => fs.rmSync(destination, {recursive: true, force: true}));
  buildWeb(destination);

  assert.equal(fs.existsSync(path.join(destination, 'famipay-app.html')), true);
  assert.equal(fs.existsSync(path.join(destination, 'login.html')), true);
  assert.equal(fs.existsSync(path.join(destination, 'register.html')), false);
  assert.equal(fs.existsSync(path.join(destination, 'famipay-onboarding.html')), false);
  assert.equal(fs.existsSync(path.join(destination, 'assets/js/famipay-onboarding.js')), false);
  assert.equal(fs.existsSync(path.join(destination, 'assets/css/famipay-onboarding.css')), false);
  assert.equal(
    fs.existsSync(path.join(destination, 'assets/js/famipay-navigation.js')),
    true,
  );
});
