import {EventEmitter} from 'events';

/**
 * Symbol key used to store the global event emitter instance.
 * Using Symbol.for ensures the same symbol is returned for the given key across different modules.
 */
const GLOBAL_KEY = Symbol.for('global.event.emitter');

/**
 * Interface to extend the global object type to include our event emitter.
 * This ensures type safety when accessing the global event emitter.
 *
 * @interface GlobalWithEmitter
 * @property {EventEmitter} [GLOBAL_KEY] - Optional EventEmitter instance stored globally
 */
interface GlobalWithEmitter {
  [GLOBAL_KEY]?: EventEmitter;
}

/**
 * Type-safe reference to the global object including our event emitter interface.
 */
const globalTyped = global as GlobalWithEmitter;

/**
 * Initialize the global event emitter if it doesn't already exist.
 * This ensures only one EventEmitter instance is created and shared across the application.
 */
if (!globalTyped[GLOBAL_KEY]) {
  globalTyped[GLOBAL_KEY] = new EventEmitter();
}

/**
 * Export the global event emitter instance.
 * The non-null assertion (!) is safe here because we ensure initialization above.
 *
 * @returns {EventEmitter} The singleton global event emitter instance
 */
export default globalTyped[GLOBAL_KEY]!;
