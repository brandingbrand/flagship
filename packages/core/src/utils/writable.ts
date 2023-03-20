/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Writable } from "stream";

let __stdout__: typeof process.stdout.write;

const RedirectStream = new Writable({
  write(_chunk, _encoding, callback) {
    callback();
  },
});

export const redirect = () => {
  __stdout__ = process.stdout.write;

  // @ts-ignore
  process.stdout.write = RedirectStream.write.bind(RedirectStream);
};

export const restore = () => {
  process.stdout.write = __stdout__;
};
