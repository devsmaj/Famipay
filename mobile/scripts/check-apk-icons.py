"""Compare the real launcher PNG resources in the original and updated APKs."""
import hashlib
import sys
import zipfile

with zipfile.ZipFile(sys.argv[1]) as original, zipfile.ZipFile(sys.argv[2]) as updated:
    icons = [name for name in original.namelist()
             if name.startswith('res/mipmap') and name.endswith('.png')
             and name.rsplit('/', 1)[-1] in
             ('ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png')]
    if len(icons) < 15:
        raise SystemExit('Original APK launcher resources could not be identified.')
    for name in icons:
        old_data = original.read(name)
        if old_data != updated.read(name):
            raise SystemExit('Original launcher icon changed: ' + name)
        print(hashlib.sha256(old_data).hexdigest(), name)
    print('Verified unchanged original launcher icons:', len(icons))
