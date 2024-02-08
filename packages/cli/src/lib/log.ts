import mitt from "mitt";
import { isWarning } from "./errors";

// Array to store summary items
export const logs: {
  name: string;
  time: string;
  success: boolean;
  error: boolean;
  warning: boolean;
}[] = [];

// Event emitter
export const emitter = mitt();

/**
 * Wraps an asynchronous function with logging capabilities.
 * @template TResult - The result type of the function.
 * @template TArgs - The argument types of the function.
 * @param {(...args: TArgs) => Promise<TResult>} fn - The function to wrap.
 * @param {string} name - The name of the action.
 */
export function withLog<TResult, TArgs extends unknown[]>(
  fn: (...args: TArgs) => Promise<TResult>,
  name: string
): (...args: TArgs) => Promise<void> {
  return async function (...args: TArgs) {
    const start = performance.now();

    try {
      await fn(...args);

      // Emit success action
      emitter.emit("action", { action: name, actionType: "success" });

      // Push log entry for success
      logs.push({
        name,
        time: `${((performance.now() - start) / 1000).toFixed(5)} s`,
        success: true,
        error: false,
        warning: false,
      });
    } catch (error: unknown) {
      const isWarningType = isWarning(error);

      // Emit appropriate action based on error or warning
      emitter.emit("action", {
        action: name,
        actionType: isWarningType ? "warning" : "error",
      });

      // Push log entry for error or warning
      logs.push({
        name,
        time: `${((performance.now() - start) / 1000).toFixed(5)} s`,
        success: false,
        error: !isWarningType,
        warning: isWarningType,
      });
    }
  };
}
