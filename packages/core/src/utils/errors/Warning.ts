/**
 * A custom error class representing a warning.
 *
 * @class Warning
 * @extends {Error}
 */
class Warning extends Error {
  /**
   * Creates an instance of Warning.
   *
   * @param {string} message The warning message.
   * @memberof Warning
   */
  constructor(message: string) {
    super(message);

    this.name = "Warning";
  }
}

export default Warning;
