/**
 * Default export representing a logging utility object.
 */
export default {
  /**
   * A boolean indicating whether logging is currently paused.
   */
  isPaused: false,

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
   * Pauses logging.
   */
  pause: function () {
    this.isPaused = true;
  },
};
