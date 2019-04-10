#!/usr/bin/env node

/**
 * Syncs the Android and iOS app versions with the version number in package.json
 */

import * as path from './lib/path';
import * as android from './lib/android';
import * as ios from './lib/ios';
import * as env from './lib/env';

const projectPackageJSON = require(path.project.resolve('package.json'));
const environmentIdentifier = process.env.APP_ENV || 'uat';
const configuration = env.configuration(environmentIdentifier, projectPackageJSON);
const androidConfig = android.androidConfigWithDefault(configuration.android);

android.version(projectPackageJSON.version, androidConfig);
ios.version(configuration, projectPackageJSON.version);
