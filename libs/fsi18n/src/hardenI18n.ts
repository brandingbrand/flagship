/**
 * Fixes prototype pollution via `I18n.extend` in i18n-js@3.x.
 *
 * `extend` delegates to a hand-rolled recursive `merge` (i18n.js:120) that
 * guards with `hasOwnProperty` but has no denylist, so `__proto__` or
 * `constructor.prototype` in the source walks up and assigns onto
 * `Object.prototype`. `extend` is the only entry into that merge and is never
 * called internally, so sanitizing its input closes the surface.
 */

const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

type ExtendFn = (target: unknown, source: unknown) => unknown;

interface Extendable {
  extend?: ExtendFn;
}

const alreadyHardened = new WeakSet<object>();

/**
 * Recursively copies a value, dropping keys the merge would follow onto the
 * prototype chain.
 *
 * @param source - Value to copy
 * @param dropped - Accumulator collecting the names of any removed keys
 * @return - Copy of the value with unsafe keys removed
 */
const sanitize = (source: unknown, dropped: Set<string>): unknown => {
  // Arrays are leaves to the merge (i18n.js:124) — nothing to strip, and
  // passing the reference through keeps `extend`'s array semantics.
  if (source === null || typeof source !== 'object' || Array.isArray(source)) {
    return source;
  }

  // Literal, not `Object.create(null)` — the merge calls
  // `source.hasOwnProperty` (i18n.js:122).
  const safe: Record<string, unknown> = {};

  for (const key of Object.keys(source)) {
    if (BLOCKED_KEYS.has(key)) {
      dropped.add(key);
    } else {
      safe[key] = sanitize((source as Record<string, unknown>)[key], dropped);
    }
  }

  return safe;
};

/**
 * Replaces `extend` with a version that sanitizes its source before delegating
 * to the original. Only the source needs it — the merge takes all keys from
 * there.
 *
 * Patches in place rather than wrapping: consumers hold the i18n-js singleton
 * by reference, so a wrapper wouldn't protect them.
 *
 * @param i18n - i18n-js instance to patch in place
 * @return - The same instance, with a hardened `extend`
 */
export const hardenI18n = <T extends object>(i18n: T): T => {
  const target = i18n as Extendable & T;
  const original = target.extend;

  if (typeof original !== 'function' || alreadyHardened.has(target)) {
    return i18n;
  }

  const delegate = original.bind(target);

  target.extend = (obj1: unknown, obj2: unknown): unknown => {
    const dropped = new Set<string>();
    const safe = sanitize(obj2, dropped);

    if (dropped.size > 0) {
      const keys = [...dropped].join(', ');

      console.warn(
        `I18n.extend: dropped prototype-polluting key(s) ${keys} from the merge source.`
      );
    }

    return delegate(obj1, safe);
  };

  alreadyHardened.add(target);

  return i18n;
};
