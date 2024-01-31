/**
 * Custom error class for file system-related errors.
 *
 * @class
 * @extends {Error}
 */
export class FsWarning extends Error {
  /**
   * Creates an instance of FsWarning.
   *
   * @param {string} message - The error message.
   */
  constructor(message: string) {
    super(message);

    this.name = "FsWarning";
    this.message = `[${this.name}]: ${message}`;
  }
}

export class StringWarning extends Error {
  /**
   * Creates an instance of StringWarning.
   *
   * @param {string} message - The error message.
   */
  constructor(message: string) {
    super(message);

    this.name = "StringWarning";
    this.message = `[${this.name}]: ${message}`;
  }
}
