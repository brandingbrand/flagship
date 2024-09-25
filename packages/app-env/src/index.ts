/**
 * Re-exports all exports from the 'env' module.
 * This approach ensures that TypeScript correctly merges and aggregates type declarations
 * from the 'env' module into the current namespace, allowing for consistent type management
 * and improved type inference across the project.
 *
 * Example:
 *
 * ```typescript
 * // env.ts
 * export function getEnv() {
 *   return process.env.NODE_ENV;
 * }
 *
 * // index.ts
 * export * from './env';
 *
 * // app.ts
 * import { env } from '@brandingbrand/flagship-app-env';
 *
 * // with over-written types
 * console.log(env);
 * ```
 */

export * from './lib/env';

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
