const exec = require('child_process').execSync;
const path = require('path');

const keychainName = process.env.KEY_CHAIN || 'login.keychain';
const keychain = `~/Library/Keychains/${keychainName}`;
console.log(`keychain is ${keychain}`);

const certsDir = path.join(__dirname, '..', 'certs');
const profilesDir = path.join(__dirname, '..', 'profiles');

const DISTRIBUTION_CERT_PASS = process.env.DISTRIBUTION_CERT_PASS;

if (!DISTRIBUTION_CERT_PASS) {
  console.error('DISTRIBUTION_CERT_PASS environment variable is required');

  process.exit(1);
}

// add certificates and provisioning profiles to computer
exec(
  `security import ${certsDir}/apple.cer -k ${keychain} -T /usr/bin/codesign || true`
);

// add keys for internal build
// - import distribution certificate
exec(
  `security import ${certsDir}/dist.cer -k ${keychain} -T /usr/bin/codesign || true`
);

// - import private key
exec(
  `security import ${certsDir}/dist.p12 -k ${keychain} -P '${DISTRIBUTION_CERT_PASS}' \
-T /usr/bin/codesign || true`
);

// - import bb .mobileproviosn
exec(`mkdir -p ~/Library/MobileDevice/Provisioning\\ Profiles/`);

exec(
  `cp ${profilesDir}/* ~/Library/MobileDevice/Provisioning\\ Profiles/`
);

process.exit();

export {};
