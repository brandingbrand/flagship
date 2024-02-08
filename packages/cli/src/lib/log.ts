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
