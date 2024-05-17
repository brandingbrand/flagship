import type { BuildConfig, PrebuildOptions } from "@brandingbrand/code-cli-kit";

import { withAction } from "./action";

/**
 * Defines an action and wraps it with logging functionality using the "@brandingbrand/code-cli-kit".
 * This utility is designed to work with asynchronous actions.
 *
 * @param action - The asynchronous action to be performed.
 * @param name - A descriptive name for the action, used in logging messages.
 * @returns A Promise that resolves when the action completes successfully.
 *
 * @remarks
 * This function is a wrapper around the "withLog" utility from "@brandingbrand/code-cli-kit".
 * It adds logging capabilities to the provided action, allowing for better visibility into
 * the execution of asynchronous tasks.
 */
export function defineAction(
  action: () => Promise<void | string>,
  name: string,
  group: "template" | "env" | "code" | "dependencies"
) {
  return withAction(action, name, group);
}

export type Transformer<T> = {
  file: string;
  transforms: Array<T>;
  transform: (config: BuildConfig, options: PrebuildOptions) => Promise<void>;
};

export type Transforms<T, U = undefined> = (
  content: T,
  config: BuildConfig,
  options: PrebuildOptions
) => U extends undefined ? T : U;

/**
 * Creates and applies a transformer function with logging using the provided Transformer definition.
 *
 * @template T - The type of the transformer.
 *
 * @param {Transformer<T>} transformer - The transformer definition containing transformation details.
 * @returns {Promise<T>} A Promise that resolves to the result of the transformation.
 *
 * @example
 * ```typescript
 * const myTransformer: Transformer<(content: string, config: BuildConfig) => string> = {
 *   file: "build.gradle",
 *   transforms: [(content, config) => content.toUpperCase()],
 *   transform: async function (config: BuildConfig) {
 *     // Apply transformations and return the result
 *   },
 * };
 *
 * const transformedContent = defineTransformer(myTransformer);
 * console.log(transformedContent);
 * ```
 */
export function defineTransformer<T>(transformer: Transformer<T>) {
  /**
   * Applies the specified transformation function with logging.
   *
   * @param {BuildConfig} config - The configuration object for the transformation.
   * @returns {Promise<T>} A Promise that resolves to the result of the transformation.
   */
  return transformer;
}
