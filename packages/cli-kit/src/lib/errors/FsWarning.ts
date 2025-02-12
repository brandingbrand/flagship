import {BaseWarning} from './BaseWarning';

/**
 * Custom warning class for file system-related operations.
 * Extends the BaseWarning class to provide standardized warning handling for file system issues.
 *
 * @class FsWarning
 * @extends {BaseWarning}
 */
export class FsWarning extends BaseWarning {
  /**
   * Creates a new FsWarning instance.
   *
   * @param {string} message - The warning message describing the file system issue
   * @param {Error} [cause] - Optional underlying error that caused this warning
   */
  constructor(message: string, cause?: Error) {
    super('FsWarning', message, cause);
  }
}
