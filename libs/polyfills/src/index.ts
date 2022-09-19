/* eslint-disable no-extend-native */
import 'symbol-observable';
import './global-this';

import base64 from '@brandingbrand/utils-base64';

if (!global.btoa) {
  global.btoa = base64.encode;
}

if (!global.atob) {
  global.atob = base64.decode;
}

if (!Object.fromEntries) {
  Object.fromEntries = <T>(arr: Iterable<readonly [PropertyKey, T]>) =>
    [...arr].reduce<Record<PropertyKey, T>>((acc, curr) => {
      acc[curr[0]] = curr[1];
      return acc;
    }, {});
}

if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    configurable: true,
    value: function flat(...args: Parameters<typeof Array.prototype.flat>) {
      const depth = isNaN(args[0] ?? Number.NaN) ? 1 : Number(args[0]);

      return depth
        ? Array.prototype.reduce.call(
            this,
            (acc, cur) => {
              if (Array.isArray(cur)) {
                (acc as any).push.apply(acc, flat.call(cur, depth - 1));
              } else {
                (acc as any).push(cur);
              }

              return acc;
            },
            [] as unknown[]
          )
        : Array.prototype.slice.call(this);
    },
    writable: true,
  });
}

if (!Array.prototype.flatMap) {
  Object.defineProperty(Array.prototype, 'flatMap', {
    configurable: true,
    value: function flatMap(...args: Parameters<typeof Array.prototype.flatMap>) {
      return Array.prototype.map.apply(this, args).flat();
    },
    writable: true,
  });
}
