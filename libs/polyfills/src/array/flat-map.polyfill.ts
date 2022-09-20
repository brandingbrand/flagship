if (!Array.prototype.flatMap) {
  Object.defineProperty(Array.prototype, 'flatMap', {
    configurable: true,
    value: function flatMap(...args: Parameters<typeof Array.prototype.flatMap>) {
      return Array.prototype.map.apply(this, args).flat();
    },
    writable: true,
  });
}
