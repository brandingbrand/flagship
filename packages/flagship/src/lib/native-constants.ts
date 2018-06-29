import * as fs from './fs';
import * as path from './path';
import { logInfo } from '../helpers';

import {
  Config
} from '../types';

const kNativeConstantsPlaceholder = '// [NativeConstants Inject]';

/**
 * Adds a native constant to Android.
 * @param {object} configuration The project configuration.
 * @param {string} key The key for the constant to add.
 * @param {string} value The value of the constant to add.
 */
export function addAndroid(configuration: Config, key: string, value: string): void {
  const constantsPath = path.resolve(
    path.android.nativeProjectPath(configuration),
    'NativeConstants.java'
  );

  logInfo(`injecting Android native constant ${key}`);

  fs.update(
    constantsPath,
    kNativeConstantsPlaceholder,
    [kNativeConstantsPlaceholder, `constants.put("${key}", "${value}");`].join('\n')
  );
}

/**
 * Adds a native constant to iOS.
 * @param {object} configuration The project configuration.
 * @param {string} key The key for the constant to add.
 * @param {string} value The value of the constant to add.
 */
export function addIOS(configuration: Config, key: string, value: string): void {
  const constantsPath = path.resolve(
    path.ios.nativeProjectPath(configuration),
    'NativeConstants.m'
  );

  logInfo(`injecting iOS native constant ${key}`);

  fs.update(
    constantsPath,
    kNativeConstantsPlaceholder,
    [kNativeConstantsPlaceholder, `, @"${key}": @"${value}"`].join('\n')
  );
}
