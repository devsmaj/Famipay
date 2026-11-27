const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('private app uses a native full-screen service shell', () => {
  const css = fs.readFileSync(
    path.join(__dirname, '../assets/css/famipay-app.css'),
    'utf8',
  );
  const script = fs.readFileSync(
    path.join(__dirname, '../assets/js/famipay-app.js'),
    'utf8',
  );
  const html = fs.readFileSync(
    path.join(__dirname, '../famipay-app.html'),
    'utf8',
  );

  assert.match(css, /\.app\.fp-service-focused/);
  assert.match(css, /\.fp-service-header/);
  assert.match(css, /\.fp-service-scroll/);
  assert.match(css, /\.fp-bottom-sheet/);
  assert.match(css, /env\(safe-area-inset-(top|bottom)/);
  assert.match(script, /bottom\.hidden\s*=\s*!isPrimary/);
  assert.match(script, /buildServiceHeader/);
  assert.match(script, /openBottomSheet/);
  assert.match(script, /nativeServiceForm/);
  assert.doesNotMatch(script, /125,000|DEMO ONLY|Review \(demo\)|DESIGN PROTOTYPE/i);
  assert.match(html, /assets\/css\/famipay-app\.css/);
});

test('Android back handling keeps private service routes in-app', () => {
  const navigation = fs.readFileSync(
    path.join(__dirname, '../assets/js/famipay-navigation.js'),
    'utf8',
  );
  assert.match(navigation, /famipay-app\.html/);
  assert.match(navigation, /location\.hash\s*=\s*'home'/);
  assert.match(navigation, /backButton/);
});
