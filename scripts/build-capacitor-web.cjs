const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function copyTree(source, destination, filter = () => true) {
    fs.cpSync(source, destination, {
        recursive: true,
        filter: file => filter(path.relative(root, file).split(path.sep).join('/')),
    });
}

function buildWeb(destination = path.join(root, 'android-web')) {
    fs.rmSync(destination, {recursive: true, force: true});
    fs.mkdirSync(destination, {recursive: true});

    for (const entry of fs.readdirSync(root, {withFileTypes: true})) {
        if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
        if (['famipay-onboarding.html', 'famipay-private-preview.html'].includes(entry.name)) continue;
        if (entry.name === 'register.html') continue;
        const source = path.join(root, entry.name);
        const target = path.join(destination, entry.name);
        let content = fs.readFileSync(source, 'utf8');
        if (['login.html', 'verify-email.html'].includes(entry.name)) {
            content = content.replace(
                '</head>',
                '    <link rel="stylesheet" href="assets/css/capacitor-android.css">\n</head>',
            );
        }
        fs.writeFileSync(target, content);
    }

    copyTree(path.join(root, 'assets'), path.join(destination, 'assets'), relative =>
        !/(^|\/)famipay-onboarding\.(?:css|js)$/.test(relative));
    copyTree(path.join(root, 'components'), path.join(destination, 'components'));
    fs.writeFileSync(
        path.join(destination, 'assets/css/capacitor-android.css'),
        'a[href="register.html"], .auth-switch, #change-email { display: none !important; }\n',
    );

    fs.writeFileSync(
        path.join(destination, 'index.html'),
        '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
        '<title>FAMIPAY</title></head><body><script>' +
        'location.replace("famipay-app.html" + location.search + location.hash)' +
        '</script></body></html>',
    );

    for (const excluded of [
        'famipay-onboarding.html',
        'famipay-private-preview.html',
        'register.html',
        'assets/css/famipay-onboarding.css',
        'assets/js/famipay-onboarding.js',
    ]) {
        if (fs.existsSync(path.join(destination, excluded)))
            throw new Error(`Capacitor bundle must exclude ${excluded}.`);
    }
    if (!fs.existsSync(path.join(destination, 'famipay-app.html')))
        throw new Error('The FAMIPAY private application shell is missing from the Capacitor bundle.');
    for (const required of [
        'login.html',
        'verify-email.html',
        'assets/js/famipay-app.js',
        'assets/js/famipay-navigation.js',
        'assets/js/platform.js',
        'assets/vendor/supabase.js',
    ]) {
        if (!fs.existsSync(path.join(destination, required)))
            throw new Error(`Capacitor bundle is missing ${required}.`);
    }
    return destination;
}

if (require.main === module) {
    process.stdout.write(`Prepared Capacitor web assets at ${buildWeb()}\n`);
}

module.exports = {buildWeb};
