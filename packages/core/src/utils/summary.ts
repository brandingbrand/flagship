import { Hook, Items } from "../types/Summary";

/**
 * The array of summary items.
 * @type {Items}
 */
export const items: Items[] = [];

/**
 * Wraps an asynchronous function with a summary item.
 * @template TFunc, TArgs
 * @param {(...args: TArgs) => Promise<TFunc>} fn - The function to wrap.
 * @param {string} name - The name of the summary item.
 * @param {Hook} hook - The hook of the summary item.
 * @returns {Promise<unknown>} - The result of the wrapped function.
 */
export const withSummary =
  <TFunc, TArgs extends unknown[]>(
    fn: (...args: TArgs) => Promise<TFunc>,
    name: string,
    hook: Hook
  ) =>
  async (...args: TArgs) => {
    const start = performance.now();
    try {
      await fn(...args);

      items.push({
        name,
        hook,
        time: `${((performance.now() - start) / 1000).toFixed(5)} s`,
        success: true,
        error: false,
        warning: false,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        items.push({
          name,
          hook,
          time: `${((performance.now() - start) / 1000).toFixed(5)} s`,
          success: false,
          error:
            error.name !== "Warning" ? error.stack ?? error.message : false,
          warning:
            error.name === "Warning" ? error.stack ?? error.message : false,
        });
      } else {
        throw error;
      }
    }
  };
