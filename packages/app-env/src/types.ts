/**
 * Type definition for the Developer Menu in a React Native application.
 *
 * This type defines the shape of the object used to configure and control
 * the developer menu, including the screens available in the menu and
 * optional callback functions for restarting the app or changing the environment.
 */
export type DevMenuType = {
  /**
   * An array of components that represent the screens available in the developer menu.
   *
   * Each component in the array is a React component that will be rendered as a screen
   * in the developer menu. These components can be used to provide tools, settings,
   * or other functionalities specific to the development environment.
   *
   * @example
   * ```tsx
   * const DebugScreen = () => <Text>Debug Information</Text>;
   * const DevMenu: DevMenuType = {
   *   screens: [DebugScreen],
   * };
   * ```
   */
  screens: Array<React.ComponentType>;

  /**
   * An optional function that is called when the app needs to be restarted.
   *
   * This function, if provided, should return a `Promise` that resolves when the
   * app has successfully restarted. It can be used to programmatically trigger
   * an app restart, for example, after making changes in the developer menu.
   *
   * @example
   * ```tsx
   * const DevMenu: DevMenuType = {
   *   screens: [DebugScreen],
   *   onRestart: async () => {
   *     await SomeRestartFunction();
   *   },
   * };
   * ```
   */
  onRestart?: () => Promise<void>;

  /**
   * An optional function that is called when the environment changes.
   *
   * This function takes a string representing the new environment and returns
   * a `Promise` that resolves when the environment has been successfully changed.
   * It can be used to programmatically switch environments within the app.
   *
   * @param env - The new environment to switch to.
   *
   * @example
   * ```tsx
   * const DevMenu: DevMenuType = {
   *   screens: [DebugScreen],
   *   onEnvChange: async (env: string) => {
   *     await SomeEnvChangeFunction(env);
   *   },
   * };
   * ```
   */
  onEnvChange?: (env: string) => Promise<void>;
};
