import type { AnyAction } from '@brandingbrand/cargo-hold';
import { InjectionToken } from '@brandingbrand/fslinker';

export type ActionSanitizer = (action: AnyAction, id: number) => AnyAction;
export type StateSanitizer = (state: unknown, index: number) => unknown;
export interface SerializationOptions {
  options?: unknown;
  replacer?: (key: unknown, value: unknown) => {};
  reviver?: (key: unknown, value: unknown) => {};
  immutable?: unknown;
  refs?: unknown[];
}

export type Predicate = (state: unknown, action: AnyAction) => boolean;

/**
 * Chrome extension documentation
 *
 * @see https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/API/Arguments.md#features
 * Firefox extension documentation
 * @see https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#features
 */
export interface DevToolsFeatureOptions {
  /**
   * Start/pause recording of dispatched actions
   */
  pause?: boolean;
  /**
   * Lock/unlock dispatching actions and side effects
   */
  lock?: boolean;
  /**
   * Persist states on page reloading
   */
  persist?: boolean;
  /**
   * Export history of actions in a file
   */
  export?: boolean;
  /**
   * Import history of actions from a file
   */
  import?: boolean | 'custom';
  /**
   * Jump back and forth (time travelling)
   */
  jump?: boolean;
  /**
   * Skip (cancel) actions
   */
  skip?: boolean;
  /**
   * Drag and drop actions in the history list
   */
  reorder?: boolean;
  /**
   * Dispatch custom actions or action creators
   */
  dispatch?: boolean;
  /**
   * Generate tests for the selected actions
   */
  test?: boolean;
}

/**
 * Chrome extension documentation
 *
 * @see https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/API/Arguments.md
 * Firefox extension documentation
 * @see https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
 */
export class StoreDevtoolsConfig {
  /**
   * Maximum allowed actions to be stored in the history tree (default: `false`)
   */
  public maxAge: number | false = false;

  /**
   * Function which takes `action` object and id number as arguments, and should return `action` object back.
   */
  public actionSanitizer?: ActionSanitizer;

  /**
   * Function which takes `state` object and index as arguments, and should return `state` object back.
   */
  public stateSanitizer?: StateSanitizer;

  /**
   * The instance name to be shown on the monitor page (default: `document.title`)
   */
  public name?: string;

  /**
   *
   */
  public serialize?: SerializationOptions | boolean;
  /**
   *
   */
  public logOnly?: boolean;

  /**
   *
   */
  public features?: DevToolsFeatureOptions;

  /**
   * Action types to be hidden in the monitors. If `actionsSafelist` specified, `actionsBlocklist` is ignored.
   */
  public actionsBlocklist?: string[];

  /**
   * Action types to be shown in the monitors
   */
  public actionsSafelist?: string[];

  /**
   * Called for every action before sending, takes state and action object, and returns true in case it allows sending the current data to the monitor.
   */
  public predicate?: Predicate;

  /**
   * Auto pauses when the extension’s window is not opened, and so has zero impact on your app when not in use.
   */
  public autoPause?: boolean;
}

export const STORE_DEVTOOLS_CONFIG = new InjectionToken<StoreDevtoolsConfig>(
  '@brandingbrand/cargo-hold-devtools Options'
);

/**
 * Used to provide a `StoreDevtoolsConfig` for the store-devtools.
 */
export const INITIAL_OPTIONS = new InjectionToken<StoreDevtoolsConfig>(
  '@brandingbrand/cargo-hold-devtools Initial Config'
);

export type StoreDevtoolsOptions =
  | Partial<StoreDevtoolsConfig>
  | (() => Partial<StoreDevtoolsConfig>);

export const DEFAULT_NAME = 'Cargo Hold DevTools';

export const createConfig = (optionsInput: StoreDevtoolsOptions): StoreDevtoolsConfig => {
  const DEFAULT_OPTIONS: StoreDevtoolsConfig = {
    maxAge: false,
    actionSanitizer: undefined,
    stateSanitizer: undefined,
    name: DEFAULT_NAME,
    serialize: false,
    logOnly: false,
    autoPause: false,
    // Add all features explicitly. This prevent buggy behavior for
    // options like "lock" which might otherwise not show up.
    features: {
      pause: true, // Start/pause recording of dispatched actions
      lock: true, // Lock/unlock dispatching actions and side effects
      persist: true, // Persist states on page reloading
      export: true, // Export history of actions in a file
      import: 'custom', // Import history of actions from a file
      jump: true, // Jump back and forth (time travelling)
      skip: true, // Skip (cancel) actions
      reorder: true, // Drag and drop actions in the history list
      dispatch: true, // Dispatch custom actions or action creators
      test: true, // Generate tests for the selected actions
    },
  };

  const options = typeof optionsInput === 'function' ? optionsInput() : optionsInput;
  const logOnly = options.logOnly === true ? { pause: true, export: true, test: true } : false;
  const features = options.features ?? (logOnly || DEFAULT_OPTIONS.features);
  const config = { ...DEFAULT_OPTIONS, features, ...options };

  if (typeof config.maxAge === 'number' && config.maxAge < 2) {
    throw new Error(`Devtools 'maxAge' cannot be less than 2, got ${config.maxAge}`);
  }

  return config;
};
