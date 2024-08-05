/**
 * Actions module for cli functionality.
 *
 * @module actions
 */

/**
 * Action for cleaning native code generation
 *
 * @module actions/clean
 */
export {default as clean} from './clean';

/**
 * Action to generate context of configurations
 *
 * @module actions/config
 */
export {default as config} from './config';

/**
 * Action to typecheck envs and write envs to fsapp
 *
 * @module actions/env
 */
export {default as env} from './env';

/**
 * Actiont to write package info to terminal
 *
 * @module actions/info
 */
export {default as info} from './info';

/**
 * Action to require and run plugins
 *
 * @module actions/plugins
 */
export {default as plugins} from './plugins';

/**
 * Action to copy over templates and extra content
 *
 * @module actions/template
 */
export {default as template} from './template';

/**
 * Action to run transformers to native code generation
 *
 * @module actions/transformers
 */
export {default as transformers} from './transformers';

/**
 * Action to run native package managers
 *
 * @module actions/packagers
 */
export {default as packagers} from './packagers';

/**
 * Action to update generator dependencies
 *
 * @module actions/generator
 */
export {default as generator} from './generator';

/**
 * Action to update package dependencies
 *
 * @module actions/dependencies
 */
export {default as dependencies} from './dependencies';
