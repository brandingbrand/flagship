/**
 * Re-exports all exports from the 'env' module under the `FlagshipEnv` namespace,
 * as well as individual exports for `env`, and it's associated type.
 *
 * This approach ensures that TypeScript correctly merges and aggregates type declarations
 * from the 'FlagshipEnv' native module into the current namespace, allowing for consistent type management
 * and improved type inference across the project.
 *
 * Example:
 *
 * // app.ts
 * import { env, FlagshipEnv } from '@brandingbrand/flagship-app-env';
 *
 * // with over-written types
 * console.log(env);
 *
 * // set the environment programatically from app code.
 * FlagshipEnv.setEnv('nextEnv');
 * ```
 */

import * as FlagshipEnv from './lib/env';
export {FlagshipEnv};
export {env, type AppEnvironment} from './lib/env';

/**
 * Re-exports the `defineDevMenuScreen` function from the `lib/define-screen` module.
 *
 * This is a convenience function for ensuring custom dev menu screens are properly defined.
 */
export * from './lib/define-screen';

/**
 * Re-exports all components from the './components' module.
 *
 * This export statement consolidates the components used in the `env` package,
 * including the `DevMenu` component, which is designed to provide a developer
 * menu within the application. The `DevMenu` component supports several props:
 *
 * - **screens**: An array of React components to be rendered as screens in the developer menu.
 * - **onRestart**: An optional function to handle application restarts.
 * - **onEnvChange**: An optional function to handle environment changes.
 * - **children**: Any additional React elements or components to be rendered inside the `DevMenu`.
 * - **location**: Specifies the position of the Version Overlay, a UI element that displays version information.
 *
 * By re-exporting these components, you make them accessible to other parts of the application
 * or to other packages that depend on the `env` package.
 *
 * @example
 * ```tsx
 * import { DevMenu } from 'env-package';
 *
 * const MyDevMenu = () => (
 *   <DevMenu
 *     screens={[Screen1, Screen2]}
 *     onRestart={handleRestart}
 *     onEnvChange={handleEnvChange}
 *     location="bottom-right"
 *   >
 *     <AdditionalComponent />
 *   </DevMenu>
 * );
 * ```
 */
export * from './components/DevMenu';
