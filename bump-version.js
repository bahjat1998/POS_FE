const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, 'package.json');
const packageLockPath = path.join(__dirname, 'package-lock.json');

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
let [major, minor, patch] = pkg.version.split('.').map(Number);

if (patch >= 9) {
    patch = 0;
    if (minor >= 9) {
        minor = 0;
        major += 1;
    } else {
        minor += 1;
    }
} else {
    patch += 1;
}

const newVersion = `${major}.${minor}.${patch}`;
pkg.version = newVersion;

fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), 'utf8');
console.log(`✅ package.json version bumped to ${newVersion}`);

if (fs.existsSync(packageLockPath)) {
    const pkgLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
    pkgLock.version = newVersion;
    fs.writeFileSync(packageLockPath, JSON.stringify(pkgLock, null, 2), 'utf8');
    console.log(`✅ package-lock.json version synced to ${newVersion}`);
}
