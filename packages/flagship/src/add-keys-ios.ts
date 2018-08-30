const exec    = require('child_process').execSync;
const path    = require('path');
const homedir = require('os').homedir();
const fs      = require('fs');

let projectEnv = null;

try {
  projectEnv = require(path.join(__dirname, '../../../../env/env.js'));
} catch (e) {
  console.log('WARNING: env/env.js not found, fallback to default.');
}
const buildConfig =
  (projectEnv && projectEnv.buildConfig && projectEnv.buildConfig.ios) || {};

const certificatePath = path.join(__dirname, '../../../../codesigning/ios/certificates');
const profilePath = path.join(__dirname, '../../../../codesigning/ios/profiles');
const importedProfilePath =
  path.join(homedir, 'Library/MobileDevice/Provisioning Profiles');
!fs.existsSync(importedProfilePath) && fs.mkdirSync(importedProfilePath);

// create keychain & adjust settings for automated use
const keychainName = process.env.KEYCHAIN || 'login.keychain';
const keychainPwd = process.env.KEYCHAIN_PWD;
const keychain = `~/Library/Keychains/${keychainName}`;
console.log(`keychain is ${keychain}`);
exec(`security create-keychain -p '${keychainPwd}' ${keychainName}`);
exec(`security default-keychain -s ${keychainName}`);
exec(`security unlock-keychain -p '${keychainPwd}' ${keychainName}`);
exec(`security set-keychain-settings -t 3600 -u ${keychainName}`);

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
// - import project .mobileprovision
const uuid = exec(
  `grep UUID -A1 -a ${profilePath}/${buildConfig.distributionCert}.mobileprovision | \
  grep -io "[-A-Z0-9]\\{36\\}"`
);
fs.copyFileSync(
  `${profilePath}/${buildConfig.distributionCert}.mobileprovision`,
  `${importedProfilePath}/${uuid.toString().trim()}.mobileprovision`
);

exec(
  `security set-key-partition-list -S apple-tool:,apple: -s -k '${keychainPwd}' ${keychain}`
)

console.log(
  `\nDONE: iOS certificates and provisioning profiles added for [${buildConfig.distributionCert}]\n`
);

process.exit();

export {};
