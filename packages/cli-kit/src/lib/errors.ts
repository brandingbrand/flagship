/**
 * Custom error class for file system-related errors.
 *
 * @class
 * @extends {Error}
 */
export class FsWarning extends Error {
  /**
   * Creates an instance of FsError.
   *
   * @param {string} message - The error message.
   */
  constructor(message: string) {
    super(message);

    this.name = "FsWarning";
    this.message = `[${this.name}]: ${message}`;
  }
}
