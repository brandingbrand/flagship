import { basename } from 'path';

import { append, copySync } from './lib/fs';
import { project } from './lib/path';

let projectEnv = null;

const copyKeystore = (pathName: string): void => {
  const filename = basename(pathName);
  const from = project.resolve('env', pathName);
  const to = project.resolve('android', 'app', filename);

  try {
    copySync(from, to);
  } catch {
    console.error(`ERROR: keystore [${from}] not found`);
    process.exit(1);
  }
};

try {
  projectEnv = require(project.resolve('env', 'env.js'));
} catch {
  console.error('env/env.js not found, did you init your project?');

  process.exit(1);
}

const { STORE_PASSWORD } = process.env;
const { KEY_PASSWORD } = process.env;

if (!STORE_PASSWORD) {
  console.error('STORE_PASSWORD environment variable is required');

  process.exit(1);
}

if (!KEY_PASSWORD) {
  console.error('KEY_PASSWORD environment variable is required');

  process.exit(1);
}

const buildConfig = projectEnv && projectEnv.buildConfig && projectEnv.buildConfig.android;

if (!(buildConfig && buildConfig.storeFile && buildConfig.keyAlias)) {
  console.error(
    'buildConfig.android does not exist in the active environment. Please see ' +
      'https://github.com/brandingbrand/flagship/wiki/Signing-Your-Apps for more information.'
  );
}

const gradlePropertiesPath = project.resolve('android', 'gradle.properties');

if (buildConfig && buildConfig.storeFile) {
  // add keystore setting to {project}/android/gradle.properties
  copyKeystore(buildConfig.storeFile);
  append(
    gradlePropertiesPath,
    `
  MYAPP_RELEASE_STORE_FILE=${project.resolve('env', buildConfig.storeFile)}
  MYAPP_RELEASE_KEY_ALIAS=${buildConfig.keyAlias}
  MYAPP_RELEASE_STORE_PASSWORD=${STORE_PASSWORD}
  MYAPP_RELEASE_KEY_PASSWORD=${KEY_PASSWORD}`
  );

  console.log(
    `\nDONE: Android keystore config added to gradle.properties [${buildConfig.storeFile}].\n`
  );
}
