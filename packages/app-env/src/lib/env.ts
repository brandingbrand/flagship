import {NativeModules, Platform} from 'react-native';

// Error message displayed when the 'react-native-flagship-env' package is not properly linked
const LINKING_ERROR =
  `The package 'react-native-flagship-env' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ios: "- You have run 'pod install'\n", default: ''}) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// Check if the FlagshipEnv module is linked; if not, throw an error with the linking instructions
const FlagshipEnv = NativeModules.FlagshipEnv
  ? NativeModules.FlagshipEnv
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

/**
 * The environment name currently in use.
 * @example
 * ```typescript
 * console.log(envName); // 'production'
 * ```
 */
export const envName = FlagshipEnv.envName;

/**
 * Displays the developer menu if available.
 * @example
 * ```typescript
 * showDevMenu();
 * ```
 */
export const showDevMenu = FlagshipEnv.showDevMenu;

/**
 * The current application version.
 * @example
 * ```typescript
 * console.log(appVersion); // '1.0.0'
 * ```
 */
export const appVersion = FlagshipEnv.appVersion;

/**
 * The build number of the application.
 * @example
 * ```typescript
 * console.log(buildNumber); // '42'
 * ```
 */
export const buildNumber = FlagshipEnv.buildNumber;

/**
 * Sets the environment name for the app.
 * @param envName - The name of the environment to set.
 * @returns A promise that resolves when the environment has been set.
 * @example
 * ```typescript
 * await setEnv('development');
 * ```
 */
export async function setEnv(envName: string) {
  return FlagshipEnv.setEnv(envName);
}

/**
 * The environment variables object. This is injected by Babel during the build process.
 * @example
 * ```typescript
 * console.log(envs); // { production: {...}, development: {...} }
 * ```
 */
// eslint-disable-next-line turbo/no-undeclared-env-vars
export const envs = process.env.FLAGSHIP_APP_ENV;

/**
 * The environment configuration for the current environment name.
 * This value is determined based on the `envName` variable.
 * @example
 * ```typescript
 * console.log(env); // { apiUrl: 'https://api.example.com' }
 * ```
 */
export const env = envs?.[envName] as unknown;
