import { hardenI18n } from '../src/hardenI18n';

/**
 * Prototype pollution regression coverage for `I18n.extend`.
 *
 * Each test works against a *fresh* copy of i18n-js so the canary below can
 * observe the unpatched behaviour without the hardened singleton from
 * `src/i18n` getting in the way.
 */

const POLLUTED_KEY = 'ppBullseye';
const POLLUTED_VALUE = 'polluted';

interface I18nJsLike {
  extend: (obj1?: unknown, obj2?: unknown) => Record<string, unknown>;
}

const freshI18nJs = (): I18nJsLike => {
  let module: I18nJsLike | undefined;

  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- a fresh instance per test
    module = require('i18n-js') as I18nJsLike;
  });

  if (!module) {
    throw new Error('Failed to load a fresh i18n-js instance');
  }

  return module;
};

const isPolluted = (): boolean => POLLUTED_KEY in {};

const unpollute = (): void => {
  delete (Object.prototype as Record<string, unknown>)[POLLUTED_KEY];
};

// `{"constructor": {"prototype": …}}` — the payload from the report. A literal
// is enough; the key does not have to arrive via JSON.parse.
const constructorPayload = (): unknown => ({
  constructor: { prototype: { [POLLUTED_KEY]: POLLUTED_VALUE } },
});

// `{"__proto__": …}` only survives as an own key when it comes from JSON.parse —
// an object literal would set the prototype instead.
const protoPayload = (): unknown =>
  JSON.parse(`{"__proto__": {"${POLLUTED_KEY}": "${POLLUTED_VALUE}"}}`);

describe('hardenI18n', () => {
  afterEach(unpollute);

  it('canary: unpatched i18n-js is vulnerable to the reported payload', () => {
    const i18n = freshI18nJs();

    try {
      i18n.extend({}, constructorPayload());

      expect(isPolluted()).toBe(true);
    } finally {
      unpollute();
    }
  });

  it('blocks the reported `constructor.prototype` payload', () => {
    const i18n = hardenI18n(freshI18nJs());

    i18n.extend({}, constructorPayload());

    expect(isPolluted()).toBe(false);
  });

  it('blocks the `__proto__` variant', () => {
    const i18n = hardenI18n(freshI18nJs());

    i18n.extend({}, protoPayload());

    expect(isPolluted()).toBe(false);
  });

  it('blocks a bare `prototype` key', () => {
    const i18n = hardenI18n(freshI18nJs());

    i18n.extend({}, { prototype: { [POLLUTED_KEY]: POLLUTED_VALUE } });

    expect(isPolluted()).toBe(false);
  });

  it('blocks unsafe keys nested inside otherwise valid translations', () => {
    const i18n = hardenI18n(freshI18nJs());

    const result = i18n.extend(
      {},
      { en: { flagship: { constructor: { prototype: { [POLLUTED_KEY]: POLLUTED_VALUE } } } } }
    );

    expect(isPolluted()).toBe(false);
    expect(result).toStrictEqual({ en: { flagship: {} } });
  });

  it('warns when it drops a key', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const i18n = hardenI18n(freshI18nJs());

    i18n.extend({}, constructorPayload());

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('constructor'));

    warn.mockRestore();
  });

  it('does not warn for safe translations', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const i18n = hardenI18n(freshI18nJs());

    i18n.extend({}, { en: { greeting: 'hello' } });

    expect(warn).not.toHaveBeenCalled();

    warn.mockRestore();
  });

  describe('behaviour parity with the original `extend`', () => {
    const safeTranslations = () => ({
      en: {
        greeting: 'hello',
        nested: { deep: { count: 2, enabled: true, missing: null } },
      },
      fr: { greeting: 'bonjour' },
    });

    it('produces the same merge result as the unpatched implementation', () => {
      const raw = freshI18nJs();
      const hardened = hardenI18n(freshI18nJs());

      const expected = raw.extend({ en: { greeting: 'hi', existing: 'keep' } }, safeTranslations());
      const actual = hardened.extend(
        { en: { greeting: 'hi', existing: 'keep' } },
        safeTranslations()
      );

      expect(actual).toStrictEqual(expected);
    });

    it('still assigns arrays wholesale, by reference', () => {
      const i18n = hardenI18n(freshI18nJs());
      const days = ['Monday', 'Tuesday'];

      const result = i18n.extend({}, { en: { day_names: days } });

      expect((result.en as Record<string, unknown>).day_names).toBe(days);
    });

    it('returns an empty object when called with no arguments', () => {
      const i18n = hardenI18n(freshI18nJs());

      expect(i18n.extend()).toStrictEqual({});
    });

    it('mutates and returns the destination object', () => {
      const i18n = hardenI18n(freshI18nJs());
      const destination = {};

      const result = i18n.extend(destination, { en: { greeting: 'hello' } });

      expect(result).toBe(destination);
    });
  });

  it('is idempotent', () => {
    const i18n = freshI18nJs();
    const once = hardenI18n(i18n).extend;

    expect(hardenI18n(i18n).extend).toBe(once);

    i18n.extend({}, constructorPayload());

    expect(isPolluted()).toBe(false);
  });

  it('leaves instances without an `extend` method alone', () => {
    const i18n = { locale: 'en' };

    expect(hardenI18n(i18n)).toBe(i18n);
    expect(i18n).toStrictEqual({ locale: 'en' });
  });
});

describe('src/i18n', () => {
  afterEach(unpollute);

  it('exports a hardened i18n-js singleton', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires -- matches the runtime entry point
    const i18n = require('../src/i18n').default as I18nJsLike;

    i18n.extend({}, constructorPayload());

    expect(isPolluted()).toBe(false);
  });
});
