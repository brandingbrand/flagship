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

const keychain = `~/Library/Keychains/${keychainName}`;

console.log(`keychain is ${keychain}`);

// clean and download bb certificates and provisioning profiles from
//   https://github.com/brandingbrand/app-builds/tree/ios-fastlane
exec(
  `rm -rf app-builds && git clone -b ios-fastlane git@github.com:brandingbrand/app-builds.git `
);

// add certificates and provisioning profiles to computer
exec(
  `security import ./app-builds/certs/apple.cer -k ${keychain} -T /usr/bin/codesign || true`
);

if (buildConfig.appCertDir && buildConfig.deployScheme) {
  // add keys for store build
  // - import project .cer
  exec(
    `security import \
./app-builds/apps/${buildConfig.appCertDir}/certs/${buildConfig.deployScheme}.cer ${keychain} \
-T /usr/bin/codesign -A || true`
  );
  // - import project .p12
  exec(
    `security import \
./app-builds/apps/${buildConfig.appCertDir}/certs/${buildConfig.deployScheme}.p12 -k ${keychain} \
-P "Branders1234$" -T /usr/bin/codesign -A || true`
  );
  // - import .mobileproviosn
  exec(
    `uuid=\`grep UUID -A1 -a \
./app-builds/apps/${buildConfig.appCertDir}/profiles/${buildConfig.deployScheme}.mobileprovision \
| grep -io "[-A-Z0-9]\\{36\\}"\`
    cp \
./app-builds/apps/${buildConfig.appCertDir}/profiles/${buildConfig.deployScheme}.mobileprovision \
~/Library/MobileDevice/Provisioning\\ Profiles/$uuid.mobileprovision`
  );
} else {
  // add keys for internal build
  // - import bb .cer
  exec(
    `security import ./app-builds/certs/dist.cer -k ${keychain} -T /usr/bin/codesign || true`
  );
  // - import bb .p12
  exec(
    `security import ./app-builds/certs/dist.p12 -k ${keychain} -P "Branders1234$" \
-T /usr/bin/codesign || true`
  );
  // - import bb .mobileproviosn
  exec(`mkdir -p ~/Library/MobileDevice/Provisioning\\ Profiles/`);
  exec(
    `cp ./app-builds/profile/* ~/Library/MobileDevice/Provisioning\\ Profiles/`
  );
}

console.log(
  `\nDONE: iOS certificates and provisioning profiles added ${buildConfig.appCertDir &&
  buildConfig.deployScheme
    ? `for [${buildConfig.appCertDir}] [${buildConfig.deployScheme}]`
    : 'with BB certs and profiles'}\n`
);

process.exit();

export {};
