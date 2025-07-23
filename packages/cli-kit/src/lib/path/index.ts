import * as version from '../version';

import path072 from './0.72';
import path073 from './0.73';
import path077 from './0.77';

/**
 * A version-aware path module that provides filesystem path utilities specific to React Native versions.
 * This module automatically selects the appropriate path implementation based on the project's
 * React Native version.
 *
 * @remarks
 * The path utilities vary between React Native versions due to structural changes in the framework.
 * For example:
 * - 0.72.x uses Java files for Android
 * - 0.73.x introduces Kotlin files for Android
 * - 0.77.x updates iOS AppDelegate to Swift
 *
 * @example
 * ```ts
 * import path from './path';
 *
 * // Access iOS paths
 * const iosPath = path.ios.appDelegate;
 *
 * // Access Android paths
 * const androidPath = path.android.mainActivity(config);
 * ```
 *
 * @returns A version-specific path module with platform-specific utilities
 */
export default version.select({
  '0.72': path072,
  '0.73': path073,
  '0.77': path077,
}) as typeof path072;
