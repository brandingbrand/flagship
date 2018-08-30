const exec = require('child_process').execSync;
const path = require('path');

let projectEnv = null;

try {
  projectEnv = require(path.join(__dirname, '../../../../env/env.js'));
} catch (e) {
  console.log('WARNING: env/env.js not found, fallback to default.');
}

const keychainName = process.env.KEY_CHAIN || 'login.keychain';

const buildConfig =
  (projectEnv && projectEnv.buildConfig && projectEnv.buildConfig.ios) || {};

const certificatePath = path.join(__dirname, '../../../../codesigning/ios/certificates');
const profilePath = path.join(__dirname, '../../../../codesigning/ios/profiles');

const keychain = `~/Library/Keychains/${keychainName}`;

console.log(`keychain is ${keychain}`);

// add certificates and provisioning profiles to computer
exec(
  `security import ${certificatePath}/${buildConfig.wwdrCert}.cer -k ${keychain} \
-T /usr/bin/codesign || true`
);

// add keys for store build
// - import project .cer
exec(
  `security import ${certificatePath}/${buildConfig.distributionCert}.cer -k ${keychain} \
-T /usr/bin/codesign -A || true`
);
// - import project .p12
exec(
  `security import ${certificatePath}/${buildConfig.distributionCert}.p12 -k ${keychain} \
-P '${buildConfig.distributionPwd}' -T /usr/bin/codesign -A || true`
);
// - import .mobileprovision
exec(
  `uuid=\`grep UUID -A1 -a \
${profilePath}/${buildConfig.distributionCert}.mobileprovision \
| grep -io "[-A-Z0-9]\\{36\\}"\`
  cp \
${profilePath}/${buildConfig.distributionCert}.mobileprovision \
~/Library/MobileDevice/Provisioning\\ Profiles/$uuid.mobileprovision`
);

console.log(
  `\nDONE: iOS certificates and provisioning profiles added for [${buildConfig.distributionCert}]\n`
);

process.exit();

export {};
