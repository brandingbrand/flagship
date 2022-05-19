import { logInfo } from '../helpers';
import type { Config } from '../types';

import * as fs from './fs';
import * as path from './path';

const kNativeConstantsPlaceholder = '// [NativeConstants Inject]';

/**
 * Adds a native constant to Android.
 *
 * @param configuration The project configuration.
 * @param key The key for the constant to add.
 * @param value The value of the constant to add.
 */
export const addAndroid = (configuration: Config, key: string, value: string): void => {
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
};

/**
 * Adds a native constant to iOS.
 *
 * @param configuration The project configuration.
 * @param key The key for the constant to add.
 * @param value The value of the constant to add.
 */
export const addIOS = (configuration: Config, key: string, value: string): void => {
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
};
