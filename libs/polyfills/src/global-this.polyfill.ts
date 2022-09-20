/* eslint-disable no-restricted-globals -- self used in polyfill */
if (typeof (globalThis as typeof globalThis | undefined) === 'undefined') {
  const getGlobalThis = (): typeof globalThis => {
    if (typeof self !== 'undefined') {
      return self;
    }
    if (typeof window !== 'undefined') {
      return window;
    }
    if (typeof global !== 'undefined') {
      return global;
    }
    throw new Error('Unable to locate global `this`');
  };

  const globalObject = getGlobalThis();
  (globalObject as { globalThis: typeof globalThis }).globalThis = globalObject;
}

/* eslint-enable */
