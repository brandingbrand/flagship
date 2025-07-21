import {version} from '@brandingbrand/code-cli-kit';

import type {DependencyProfile} from '../types';

import profile072 from './0.72';
import profile073 from './0.73';
import profile074 from './0.74';
import profile075 from './0.75';
import profile076 from './0.76';
import profile077 from './0.77';
import profile078 from './0.78';

/**
 * A version-aware profile module that provides dependency configurations specific to React Native versions.
 * This module automatically selects the appropriate profile implementation based on the project's
 * React Native version.
 *
 * @remarks
 * The dependency profiles vary between React Native versions due to package updates and changes:
 * - 0.72.x uses metro-react-native-babel-preset
 * - 0.73.x introduces @react-native/babel-preset and deprecates metro-react-native-babel-preset
 * - 0.74.x+ updates various dependency versions and configurations
 *
 * @example
 * ```ts
 * import profile from './profile';
 *
 * // Access package configurations
 * const reactNativeConfig = profile['react-native'];
 * const babelPresetConfig = profile['@react-native/babel-preset'];
 * ```
 *
 * @returns A version-specific profile module with package dependency configurations
 */
export const profiles = {
  '0.72': profile072,
  '0.73': profile073,
  '0.74': profile074,
  '0.75': profile075,
  '0.76': profile076,
  '0.77': profile077,
  '0.78': profile078,
} as const satisfies Record<string, Record<string, DependencyProfile>>;

export function getProfile(version: string) {
  return profiles[version as keyof typeof profiles] || undefined;
}

export default version.select(profiles) as typeof profile072;
