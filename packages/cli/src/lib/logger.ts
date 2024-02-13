import { Writable } from "stream";

/**
 * Default export representing a logging utility object.
 */
export default {
  /**
   * A boolean indicating whether logging is currently paused.
   */
  isPaused: false,

  /**
   * The original `process.stdout.write` function.
   *
   * @type {Function}
   * @private
   */
  __stdout__: process.stdout.write,

  /**
   * A writable stream that does nothing.
   *
   * @type {Writable}
   * @private
   */
  __stdout__redirect: new Writable({
    write(_chunk, _encoding, callback) {
      callback();
    },
  }),

  /**
   * Logs an information message.
   * @param message - The message to log.
   */
  info: function (...message: string[]) {
    if (this.isPaused) return;

    console.info("ℹ️ ", ...message);
  },

  /**
   * Logs a warning message.
   * @param message - The message to log.
   */
  warn: function (...message: string[]) {
    if (this.isPaused) return;

    console.log();
    console.warn("⚠️ ", ...message);
  },

  /**
   * Logs an error message.
   * @param message - The message to log.
   */
  error: function (...message: string[]) {
    if (this.isPaused) return;

    console.log();
    console.error("🛑 ", ...message);
  },

  /**
   * Logs a success message.
   * @param message - The message to log.
   */
  success: function (...message: string[]) {
    if (this.isPaused) return;

    console.log("✅ ", ...message);
  },

  /**
   * Logs a start message.
   * @param message - The message to log.
   */
  start: function (...message: string[]) {
    if (this.isPaused) return;

    console.log();
    console.log("🎬 ", ...message);
    console.log();
  },

  /**
   * Pauses logging. Redirects `process.stdout.write` to the `write` method of the `__stdout__redirect` stream.
   */
  pause: function () {
    this.isPaused = true;

    // @ts-ignore
    process.stdout.write = this.__stdout__redirect.write.bind(
      this.__stdout__redirect
    );
  },

  /**
   * Resumes logging. Restores the original `process.stdout.write` function.
   */
  resume: function () {
    this.isPaused = false;

    process.stdout.write = this.__stdout__;
  },
};
