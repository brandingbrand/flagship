import {BaseWarning} from './BaseWarning';

/**
 * Custom warning class for string-related errors.
 * Extends the BaseWarning class to provide consistent error handling for string operations.
 *
 * @class
 * @extends {BaseWarning}
 */
export class StringWarning extends BaseWarning {
  /**
   * Creates a new StringWarning instance.
   *
   * @param {string} message - The error message describing what went wrong with the string operation
   * @param {Error} [cause] - Optional underlying error that caused this warning
   */
  constructor(message: string, cause?: Error) {
    super('StringWarning', message, cause);
  }
}
