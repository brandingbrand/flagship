import mitt from "mitt";
import { isWarning } from "./errors";

/**
 * Array to store summary items for actions.
 */
export const actions: {
  /**
   * The name of the action.
   */
  name: string;
  /**
   * The time taken for the action to complete.
   */
  time: string;
  /**
   * Indicates whether the action was successful.
   */
  success: boolean;
  /**
   * Indicates whether an error occurred during the action.
   */
  error: boolean;
  /**
   * Indicates whether a warning occurred during the action.
   */
  warning: boolean;
}[] = [];

/**
 * Event emitter for broadcasting actions.
 */
export const emitter = mitt();

/**
 * Wraps an asynchronous function with logging capabilities.
 * @template TResult - The result type of the function.
 * @template TArgs - The argument types of the function.
 * @param {(...args: TArgs) => Promise<TResult>} fn - The function to wrap.
 * @param {string} name - The name of the action.
 */
export function withAction<TResult, TArgs extends unknown[]>(
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
      actions.push({
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
      actions.push({
        name,
        time: `${((performance.now() - start) / 1000).toFixed(5)} s`,
        success: false,
        error: !isWarningType,
        warning: isWarningType,
      });
    }
  };
}
