/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Writable } from "stream";

/** @type {typeof process.stdout.write} */
let __stdout__: typeof process.stdout.write;

/**
 * A writable stream used to redirect output.
 * @typedef {import("stream").Writable} Writable
 * @typedef {object} RedirectStream
 * @property {(chunk: any, encoding: string, callback: () => void) => void} write - Writes to the stream.
 */
const RedirectStream = new Writable({
  write(_chunk, _encoding, callback) {
    callback();
  },
});

/**
 * Redirects the output of the process to a writable stream.
 * @function
 * @returns {void}
 */
export const redirect = () => {
  __stdout__ = process.stdout.write;

  // @ts-ignore
  process.stdout.write = RedirectStream.write.bind(RedirectStream);
};

/**
 * Restores the original output of the process.
 * @function
 * @returns {void}
 */
export const restore = () => {
  process.stdout.write = __stdout__;
};
