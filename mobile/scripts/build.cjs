const fs = require('node:fs');
const path = require('node:path');
const {build} = require('esbuild');

const root = path.resolve(__dirname, '../..');
const mobile = path.join(root, 'mobile');
const out = path.join(mobile, 'www');
const api = process.env.FAMIPAY_MOBILE_API_URL || 'https://faminaexpress.onrender.com/api';
const parsedApi = new URL(api);
if (parsedApi.protocol !== 'https:' || parsedApi.username || parsedApi.password)
    throw new Error('A public HTTPS API URL is required.');

const versionCode = Number(process.env.ANDROID_VERSION_CODE || 1);
if (!Number.isSafeInteger(versionCode) || versionCode < 1 || versionCode > 2100000000)
    throw new Error('Invalid Android version code.');

fs.rmSync(out, {recursive: true, force: true});
fs.mkdirSync(out, {recursive: true});

function copyTree(source, destination) {
    fs.cpSync(source, destination, {recursive: true});
}

for (const file of [
    'famipay-app.html',
    'login.html',
    'register.html',
    'verify-email.html',
    'famipay-onboarding.html',
    'terms.html',
    'privacy.html',
    'contact.html',
]) {
    fs.copyFileSync(path.join(root, file), path.join(out, file));
}
copyTree(path.join(root, 'assets'), path.join(out, 'assets'));

fs.writeFileSync(
    path.join(out, 'index.html'),
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
    '<title>FAMIPAY</title></head><body><script>' +
    'location.replace("famipay-app.html" + location.search + location.hash)' +
    '</script></body></html>',
);
fs.writeFileSync(
    path.join(out, 'native-config.js'),
    `window.FAMINA_API_BASE=${JSON.stringify(api)};` +
    `window.FAMIPAY_MOBILE_BUILD=${JSON.stringify({
        version: process.env.ANDROID_VERSION_NAME || require('../package.json').version,
        code: versionCode,
        releases: 'https://github.com/devsmaj/Famipay/releases/download/famipay-preview/FAMIPAY.apk',
    })};`,
);
fs.writeFileSync(
    path.join(out, 'native.css'),
    'html,body{min-height:100%;overscroll-behavior-y:none}' +
    'body.native-app{-webkit-tap-highlight-color:transparent}' +
    '.native-app a,.native-app button,.native-app input,.native-app select{touch-action:manipulation}',
);

for (const file of [
    'famipay-app.html',
    'login.html',
    'register.html',
    'verify-email.html',
    'famipay-onboarding.html',
]) {
    const destination = path.join(out, file);
    let html = fs.readFileSync(destination, 'utf8');
    html = html.replace(
        '</head>',
        '    <link rel="stylesheet" href="native.css">\n' +
        '    <script src="native-config.js"></script>\n' +
        '    <script src="native.js"></script>\n</head>',
    );
    fs.writeFileSync(destination, html);
}

const navigationPath = path.join(out, 'assets/js/famipay-navigation.js');
let navigation = fs.readFileSync(navigationPath, 'utf8');
const navigationMarker = 'const app = window.Capacitor?.Plugins?.App || window.Capacitor?.App;';
if (!navigation.includes(navigationMarker))
    throw new Error('Review the shared Android back-button integration before packaging.');
navigation = navigation.replace(
    navigationMarker,
    'const app = window.FaminaNativeApp || window.Capacitor?.Plugins?.App || window.Capacitor?.App;',
);
fs.writeFileSync(navigationPath, navigation);

const authPath = path.join(out, 'assets/js/supabase-auth.js');
let auth = fs.readFileSync(authPath, 'utf8');
const appUrlMarker = 'function appUrl(path) {';
if (!auth.includes(appUrlMarker))
    throw new Error('Review the shared authentication callback before packaging.');
auth = auth.replace(
    appUrlMarker,
    `${appUrlMarker} if (window.Capacitor?.isNativePlatform()) return "famipay://auth/login" + (path.includes("recovery=1") ? "?recovery=1" : "");`,
);
fs.writeFileSync(authPath, auth);

const verifyPath = path.join(out, 'assets/js/verify-email.js');
let verify = fs.readFileSync(verifyPath, 'utf8');
const callbackMarker = "const callbackUrl = location.hostname === 'devsmaj.github.io'";
if (!verify.includes(callbackMarker))
    throw new Error('Review the shared email confirmation callback before packaging.');
verify = verify.replace(
    callbackMarker,
    "const callbackUrl = window.Capacitor?.isNativePlatform() " +
    "? 'famipay://auth/login' : location.hostname === 'devsmaj.github.io'",
);
fs.writeFileSync(verifyPath, verify);

const html = fs.readFileSync(path.join(out, 'famipay-app.html'), 'utf8');
for (const role of ['restaurant_owner', 'seller', 'rider', 'admin'])
    if (!html.includes(`${role}:`))
        throw new Error(`The shared app is missing the ${role} private role mapping.`);
for (const file of [
    'assets/js/famipay-app.js',
    'assets/js/platform.js',
    'assets/js/famipay-navigation.js',
    'assets/vendor/supabase.js',
    'assets/css/famipay-app.css',
]) {
    if (!fs.existsSync(path.join(out, file)))
        throw new Error(`The shared web application is missing ${file}.`);
}

build({
    absWorkingDir: mobile,
    tsconfigRaw: {},
    entryPoints: ['src/native.js'],
    outfile: path.join(out, 'native.js'),
    bundle: true,
    target: 'chrome110',
    format: 'iife',
}).catch(error => {
    console.error(error);
    process.exitCode = 1;
});
