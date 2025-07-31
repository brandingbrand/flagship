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
