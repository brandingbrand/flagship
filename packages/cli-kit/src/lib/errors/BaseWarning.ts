/**
 * Abstract base class for custom warning types that extends the built-in Error class.
 * Provides common functionality for formatting warning messages and maintaining stack traces.
 *
 * @abstract
 * @class
 * @extends {Error}
 */
export abstract class BaseWarning extends Error {
  /**
   * Creates a new BaseWarning instance.
   *
   * @param {string} name - The name identifier for this warning type
   * @param {string} message - The warning message to display
   * @param {Error} [cause] - Optional cause of this warning, enabling error chaining
   *
   * @remarks
   * - Automatically formats the message with [name]: prefix
   * - Sets up proper stack trace capture
   * - Preserves error cause if provided
   */
  constructor(name: string, message: string, cause?: Error) {
    super(message);
    this.name = name;
    this.message = `[${this.name}]: ${message}`;
    this.cause = cause;

    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
