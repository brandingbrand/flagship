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
console.log(`creating ${keychain}`);
try {
  exec(`security create-keychain -p '${keychainPwd}' ${keychainName}`);
} catch (e) {
  console.log(`error creating ${keychain}`);
}
exec(`security default-keychain -s ${keychainName}`, { stdio: [0, 1, 2] });
exec(`security unlock-keychain -p '${keychainPwd}' ${keychainName}`, { stdio: [0, 1, 2] });
exec(`security set-keychain-settings -t 3600 -u ${keychainName}`, { stdio: [0, 1, 2] });

// add certificates and provisioning profiles to build environment
// import wwdr
console.log(`\nimporting ${buildConfig.wwdrCert}`);
exec(
  `security import ${certificatePath}/${buildConfig.wwdrCert}.cer -k ${keychain} \
-T /usr/bin/codesign || true`, { stdio: [0, 1, 2] }
);

// - import project .cer
console.log(`\nimporting ${buildConfig.distributionCert} certificate`);
exec(
  `security import ${certificatePath}/${buildConfig.distributionCert}.cer -k ${keychain} \
-T /usr/bin/codesign -A || true`, { stdio: [0, 1, 2] }
);

// - import project .p12
console.log(`\nimporting ${buildConfig.distributionCert} .p12`);
exec(
  `security import ${certificatePath}/${buildConfig.distributionCert}.p12 -k ${keychain} \
-P '${buildConfig.distributionPwd}' -T /usr/bin/codesign -A || true`, { stdio: [0, 1, 2] }
);

// - import project .mobileprovision
console.log(`\nimporting ${buildConfig.distributionCert} provisioning profile`);
try {
  const uuid = exec(
    `grep UUID -A1 -a ${profilePath}/${buildConfig.distributionCert}.mobileprovision | \
    grep -io "[-A-Z0-9]\\{36\\}"`
  );
  fs.copyFileSync(
    `${profilePath}/${buildConfig.distributionCert}.mobileprovision`,
    `${importedProfilePath}/${uuid.toString().trim()}.mobileprovision`
  );
  console.log('1 provisioning profile imported.\n');
} catch (e) {
  console.log(`error importing ${buildConfig.distributionCert} provisioning profile\n`);
}

exec(
  `security set-key-partition-list -S apple-tool:,apple: -s -k '${keychainPwd}' ${keychain}`,
  { stdio: [0, 1, 2] }
)

console.log(`\nDONE: iOS certificates and provisioning profiles added.\n`);

process.exit();

export {};
