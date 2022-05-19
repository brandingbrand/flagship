import 'i18n-js';

import Decimal from 'decimal.js';

import i18nHelper from '../src/i18nHelper';

let i18n: i18nHelper;

describe('fsi18n', () => {
  beforeEach(() => {
    i18n = new i18nHelper({
      currentLocale: () => 'en-US',
      translate: () => 'test',
      translations: {},
      locale: 'en-US',
    });
  });

  describe('string', () => {
    it('should throw an error if no translations have been set', () => {
      expect(() => i18n.string('test')).toThrow();
    });
  });

  describe('number', () => {
    it('should throw an error when provided something other than a number or string', () => {
      // @ts-expect-error
      expect(() => i18n.number({})).toThrow();
    });

    it('should throw an error when provided an invalid number', () => {
      expect(() => i18n.number('not a number')).toThrow();
    });

    it('should handle strings', () => {
      const num = i18n.number('1234');

      expect(num).toBe('1,234');
    });
  });

  describe('currency', () => {
    it('should add default options to format the number into a currency string', () => {
      const spy = jest.spyOn(i18n, 'number');
      const testNumber = 1234.56;
      const testCurrency = 'usd';

      i18n.currency(testNumber, testCurrency);

      expect(spy).toHaveBeenCalledWith(testNumber, {
        style: 'currency',
        currency: testCurrency,
      });
    });

    it('should throw an error if no currency is set', () => {
      expect(() => i18n.currency(1234)).toThrow();
    });

    it('should allow options to overwrite the defaults', () => {
      const spy = jest.spyOn(i18n, 'number');
      const testNumber = 1234.56;
      const options = {
        currency: 'eur',
      };

      i18n.currency(testNumber, undefined, options);

      expect(spy).toHaveBeenCalledWith(testNumber, {
        style: 'currency',
        currency: 'eur',
      });
    });
  });

  describe('percent', () => {
    it('should add default options to format the number into a currency string', () => {
      const spy = jest.spyOn(i18n, 'number');
      const testNumber = 1234.56;

      i18n.percent(testNumber);

      expect(spy).toHaveBeenCalledWith(testNumber, {
        style: 'percent',
      });
    });
  });

  describe('date', () => {
    it('should throw an error when provided something other than a date', () => {
      // @ts-expect-error
      expect(() => i18n.date('1234')).toThrow();
    });

    it('should throw an error when provided an invalid date', () => {
      const invalidDate = new Date('Not a date.');

      expect(() => i18n.date(invalidDate)).toThrow();
    });
  });

  describe('convertToNumber', () => {
    const tests = [
      {
        input: '1',
        result: 1,
      },
      {
        input: '1.1',
        result: 1.1,
      },
      {
        input: '-1.1',
        result: -1.1,
      },
      {
        input: 'bad',
        result: Number.NaN,
      },
      {
        input: new Decimal(123),
        result: 123,
      },
    ];

    for (const { input, result } of tests) {
      it(`should convert "${input}" to a number`, () => {
        // @ts-expect-error Testing protected function
        const num = i18n.convertToNumber(input);

        expect(typeof num).toBe('number');
        expect(num).toBe(result);
      });
    }
  });
});
