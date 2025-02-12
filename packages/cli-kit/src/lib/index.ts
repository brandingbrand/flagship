/**
 * Lib modules to provide generic native code generation logic
 *
 * @module lib
 */

import {FlagshipCodeLogger} from './FlagshipCodeLogger';

/**
 * Guards lib exports various guards for type checking.
 *
 * @module lib/guards
 */
export * from './guards';

/**
 * Errors lib exports error-related functionalities.
 *
 * @module lib/errors
 */
export * from './errors';

/**
 * FS lib exports the default export from the "fs" file.
 *
 * @module lib/fs
 */
export {default as fs} from './fs';

/**
 * Glob lib exports various functionalities related to glob patterns.
 *
 * @module lib/glob
 */
export * from './glob';

/**
 * Path lib exports the default export from the "path" file.
 *
 * @module lib/path
 */
export {default as path} from './path';

/**
 * Platform lib exports various functionalities related to platform-specific behavior.
 *
 * @module lib/platform
 */
export * from './platform';

/**
 * String lib exports various string-related functionalities.
 *
 * @module lib/string
 */
export * from './string';

export * as version from './version';

/**
 * Singleton instance of the FlagshipCodeLogger.
 *
 * @example
 * ```typescript
 * logger.log('This is a log message');
 * ```
 */
export const logger = FlagshipCodeLogger.shared;

/**
 * Exports the FlagshipCodeManager class.
 *
 * @example
 * ```typescript
 * import { FlagshipCodeManager } from './path/to/FlagshipCodeManager';
 * const manager = new FlagshipCodeManager();
 * manager.doSomething();
 * ```
 */
export {FlagshipCodeManager} from './FlagshipCodeManager';
