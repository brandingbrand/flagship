import mitt from 'mitt';

/**
 * Wraps an asynchronous function with logging capabilities.
 * @template TResult - The result type of the function.
 * @template TArgs - The argument types of the function.
 * @param {(...args: TArgs) => Promise<TResult>} fn - The function to wrap.
 */
export function withAction<TResult, TArgs extends unknown[]>(
  fn: (...args: TArgs) => Promise<TResult>,
): (...args: TArgs) => Promise<void> {
  return async function (...args: TArgs) {
    await fn(...args);
  };
}
