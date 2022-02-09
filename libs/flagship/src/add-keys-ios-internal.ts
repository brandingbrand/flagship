const exec = require('child_process').execSync;
import { project } from './lib/path';

const keychainName = process.env.KEY_CHAIN || 'login.keychain';
const keychain = `~/Library/Keychains/${keychainName}`;
console.log(`keychain is ${keychain}`);

const DISTRIBUTION_CERT_PASS = process.env.DISTRIBUTION_CERT_PASS;

if (!DISTRIBUTION_CERT_PASS) {
  console.error('DISTRIBUTION_CERT_PASS environment variable is required');

  process.exit(1);
}

let projectEnv = null;

try {
  projectEnv = require(project.resolve('env', 'env.js'));
} catch (e) {
  console.error('env/env.js not found, did you init your project?');

  process.exit(1);
}

const buildConfig = projectEnv && projectEnv.buildConfig && projectEnv.buildConfig.ios;

if (
  !(
    buildConfig &&
    buildConfig.appleCert &&
    buildConfig.distCert &&
    buildConfig.distP12 &&
    buildConfig.profilesDir
  )
) {
  console.error(
    'buildConfig.ios does not exist in the active environment. Please see ' +
      'https://github.com/brandingbrand/flagship/wiki/Signing-Your-Apps for more information.'
  );

  process.exit(1);
}

// add certificates and provisioning profiles to computer
exec(
  `security import ${project.resolve(
    'env',
    buildConfig.appleCert
  )} -k ${keychain} -T /usr/bin/codesign || true`
);

// add keys for internal build
// - import distribution certificate
exec(
  `security import ${project.resolve(
    'env',
    buildConfig.distCert
  )} -k ${keychain} -T /usr/bin/codesign || true`
);

// - import private key
exec(
  `security import ${project.resolve(
    'env',
    buildConfig.distP12
  )} -k ${keychain} -P '${DISTRIBUTION_CERT_PASS}' \
-T /usr/bin/codesign || true`
);

exec(`mkdir -p ~/Library/MobileDevice/Provisioning\\ Profiles/`);

exec(
  `cp ${project.resolve(
    'env',
    buildConfig.profilesDir
  )}/* ~/Library/MobileDevice/Provisioning\\ Profiles/`
);
