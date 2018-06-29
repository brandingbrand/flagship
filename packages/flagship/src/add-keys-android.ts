import { copyFileSync } from 'fs';
import { join } from 'path';
import { project } from './lib/path';

const helpers = require('./helpers');
const dir = __dirname;
const getOption = helpers.getCmdOption(process.argv);

let projectEnv = null;

try {
  projectEnv = require(project.resolve('env', 'env.js'));
} catch (e) {
  console.log('WARNING: env/env.js not found, fallback to default.');
}

const buildConfig =
  (projectEnv && projectEnv.buildConfig && projectEnv.buildConfig.android) ||
  {};

const gradlePropertiesPath =
  getOption('gradlePropertiesPath') || `../../../../android/gradle.properties`;

if (buildConfig && buildConfig.storeFile) {
  // add hockey keystore setting to {project}/android/gradle.properties
  copyKeystore(buildConfig.storeFile);
  helpers.appendFile(
    join(dir, gradlePropertiesPath),
    `
  MYAPP_RELEASE_STORE_FILE=${buildConfig.storeFile}
  MYAPP_RELEASE_KEY_ALIAS=${buildConfig.keyAlias}
  MYAPP_RELEASE_STORE_PASSWORD=${buildConfig.storePassword}
  MYAPP_RELEASE_KEY_PASSWORD=${buildConfig.keyPassword}`
  );

  console.log(
    `\nDONE: Android keystore config added to gradle.properties [${buildConfig.storeFile}].\n`
  );
} else {
  // add hockey keystore setting to {project}/android/gradle.properties
  helpers.appendFile(
    join(dir, gradlePropertiesPath),
    `
MYAPP_RELEASE_STORE_FILE=hockeyapp.keystore
MYAPP_RELEASE_KEY_ALIAS=hockeyapp
MYAPP_RELEASE_STORE_PASSWORD=Branders1234$
MYAPP_RELEASE_KEY_PASSWORD=Branders1234$`
  );

  console.log(
    `\nDONE: Android keystore config added to gradle.properties [hockeyapp.keystore].\n`
  );
}

function copyKeystore(fileName: string): void {
  const from = project.resolve('env', fileName);
  const to = project.resolve('android', 'app', fileName);
  try {
    copyFileSync(from, to);
  } catch (e) {
    console.error(`ERROR: keystore [env/${fileName}] not found`);
    process.exit(1);
  }
}

process.exit();

export {};
