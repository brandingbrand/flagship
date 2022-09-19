// There may seem to be easier solutions, but this problem is more complex than it may initially
// seem. See: https://mathiasbynens.be/notes/globalthis

/* eslint-disable no-restricted-properties -- Used for accessing __defineGetter__ */
/* eslint-disable @typescript-eslint/no-invalid-this -- Used for global this reference */
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- Used for accessing __magic__ */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- Used for setting __magic__  */
/* eslint-disable fp/no-delete -- Used for cleanup  */

interface LegacyObjectPrototype {
  // eslint-disable-next-line @typescript-eslint/naming-convention -- External Browser API
  __defineGetter__: (name: string, callback: () => typeof globalThis) => void;
}

if (typeof (globalThis as typeof globalThis | undefined) === 'undefined') {
  (Object.prototype as LegacyObjectPrototype).__defineGetter__('__magic__', function () {
    // @ts-expect-error -- references the `this` in the global scope
    return this as typeof globalThis;
  });

  // @ts-expect-error -- Hack that makes globalThis work
  __magic__.globalThis = __magic__;

  // @ts-expect-error -- Cleanup hack
  delete Object.prototype.__magic__;
}

/* eslint-enable no-restricted-properties  */
/* eslint-enable @typescript-eslint/no-invalid-this */
/* eslint-enable @typescript-eslint/no-unsafe-member-access */
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
/* eslint-enable fp/no-delete  */
