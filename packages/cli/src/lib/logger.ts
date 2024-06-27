/* eslint-disable no-control-regex */
import {Writable} from 'stream';

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
   * The original `console.log` function.
   * @private
   */
  __console_log__: console.log,

  /**
   * A console.log override function that does nothing.
   * @private
   */
  __console_log__redirect: function () {},

  /**
   * Logs an information message.
   * @param message - The message to log.
   */
  info: function (...message: string[]) {
    if (this.isPaused) return;

    console.info(...message);
  },

  /**
   * Logs a warning message.
   * @param message - The message to log.
   */
  warn: function (...message: string[]) {
    if (this.isPaused) return;

    console.log();
    console.warn('⚠️ ', ...message);
  },

  /**
   * Logs an error message.
   * @param message - The message to log.
   */
  error: function (...message: string[]) {
    if (this.isPaused) return;

    console.log();
    console.error('🛑 ', ...message);
  },

  /**
   * Logs a success message.
   * @param message - The message to log.
   */
  success: function (...message: string[]) {
    if (this.isPaused) return;

    console.log('✔ ', ...message);
  },

  /**
   * Logs a start message.
   * @param message - The message to log.
   */
  start: function (...message: string[]) {
    if (this.isPaused) return;

    console.log();
    console.log('🎬 ', ...message);
    console.log();
  },

  /**
   * Pauses logging. Redirects `process.stdout.write` to the `write` method of the `__stdout__redirect` stream.
   */
  pause: function () {
    this.isPaused = true;

    console.log = this.__console_log__redirect;

    // @ts-ignore
    process.stdout.write = this.__stdout__redirect.write.bind(
      this.__stdout__redirect,
    );
  },

  /**
   * Resumes logging. Restores the original `process.stdout.write` function.
   */
  resume: function () {
    this.isPaused = false;

    console.log = this.__console_log__;
    process.stdout.write = this.__stdout__;
  },
};

/**
 * Centers the given text within the specified total length, accounting for ANSI escape codes.
 *
 * @param {string} text - The text to center.
 * @param {number} totalLength - The total length of the output string including padding.
 * @returns {string} - The centered text with padding.
 */
export function centerText(text: string, totalLength: number) {
  const textLength = text.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    '',
  ).length;

  if (textLength >= totalLength) {
    // If the text is already longer or equal to 200 characters, return it as is
    return text;
  }

  const totalPadding = totalLength - textLength;
  const paddingEachSide = Math.floor(totalPadding / 2);

  // Create the padding strings
  const leftPadding = ' '.repeat(paddingEachSide);
  const rightPadding = ' '.repeat(totalPadding - paddingEachSide);

  // Combine the padding and text
  return leftPadding + text + rightPadding;
}
