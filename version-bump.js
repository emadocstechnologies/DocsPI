import fs from 'fs';
import path from 'path';

const packagePath = path.resolve('package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Semver ayristirma: "1.0.0-beta" -> base="1.0.0", pre="beta"
const preReleaseMatch = pkg.version.match(/^(\d+\.\d+\.\d+)-?(.*)$/);
const baseVersion = preReleaseMatch ? preReleaseMatch[1] : pkg.version;
const preReleaseTag = preReleaseMatch ? preReleaseMatch[2] : '';

let parts = baseVersion.split('.').map(Number);
parts[2] += 1; // Increment patch

if (parts[2] >= 100) {
  parts[2] = 0;
  parts[1] += 1;
}

if (parts[1] >= 100) {
  parts[1] = 0;
  parts[0] += 1;
}

// Pre-release varsa build sayisini artir: "1.0.0-beta" -> "1.0.0-beta.1"
let newVersion = parts.join('.');
if (preReleaseTag) {
  const buildMatch = preReleaseTag.match(/^(.+)\.(\d+)$/);
  if (buildMatch) {
    newVersion += `-${buildMatch[1]}.${parseInt(buildMatch[2], 10) + 1}`;
  } else {
    newVersion += `-${preReleaseTag}.1`;
  }
}

pkg.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));

console.log(`Version auto-updated to: ${pkg.version}`);

// Commit: feat: implement version bump script [132232]
