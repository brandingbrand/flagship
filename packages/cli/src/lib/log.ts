import { isWarning } from "./errors";

/**
 * The array of summary items.
 * @type {any}
 */
export const logs: any[] = [];

/**
 * Wraps an asynchronous function with a summary item.
 * @template TFunc, TArgs
 * @param {(...args: TArgs) => Promise<TFunc>} fn - The function to wrap.
 * @param {string} name - The name of the summary item.
 * @returns {Promise<unknown>} - The result of the wrapped function.
 */
export function withLog<TFunc, TArgs extends unknown[]>(
  fn: (...args: TArgs) => Promise<TFunc>,
  name: string
) {
  return async function (...args: TArgs) {
    const start = performance.now();
    try {
      await fn(...args);

      logs.push({
        name,
        time: `${((performance.now() - start) / 1000).toFixed(5)} s`,
        success: true,
        error: false,
        warning: false,
      });
    } catch (error: unknown) {
      logs.push({
        name,
        time: `${((performance.now() - start) / 1000).toFixed(5)} s`,
        success: false,
        error: !isWarning(error),
        warning: isWarning(error),
      });
    }
  };
}

/**
 * Logs an information message.
 * @param message The message to log.
 */
export async function logInfo(...message: string[]) {
  const { consola } = await import("consola");

  consola.info(message);
}

/**
 * Logs a start message.
 * @param message The message to log.
 */
export async function logStart(...message: string[]) {
  const { consola } = await import("consola");

  consola.start(message);
}

/**
 * Logs a warning message.
 * @param message The message to log.
 */
export async function logWarn(...message: string[]) {
  const { consola } = await import("consola");

  consola.warn(message);
}

/**
 * Logs a success message.
 * @param message The message to log.
 */
export async function logSuccess(...message: string[]) {
  const { consola } = await import("consola");

  consola.success(message);
}

/**
 * Logs an error message.
 * @param message The message to log.
 */
export async function logError(...message: string[]) {
  const { consola } = await import("consola");

  consola.error(message);
}

/**
 * Logs a boxed message.
 * @param message The message to log.
 */
export async function logBox(...message: string[]) {
  const { consola } = await import("consola");

  consola.box(message);
}
