/* eslint-disable no-extend-native */

if (!Object.fromEntries) {
  Object.fromEntries = <T>(arr: Iterable<readonly [PropertyKey, T]>) => {
    return Array.from(arr).reduce((acc, curr) => {
      acc[curr[0]] = curr[1];
      return acc;
    }, {} as Record<PropertyKey, T>);
  };
}

if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    configurable: true,
    value: function flat(...args: Parameters<typeof Array.prototype.flat>) {
      const depth = isNaN(args[0] ?? NaN) ? 1 : Number(args[0]);

      return depth
        ? Array.prototype.reduce.call(
            this,
            (acc, cur) => {
              if (Array.isArray(cur)) {
                // eslint-disable-next-line prefer-spread
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
