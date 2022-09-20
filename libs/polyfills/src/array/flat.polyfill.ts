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
