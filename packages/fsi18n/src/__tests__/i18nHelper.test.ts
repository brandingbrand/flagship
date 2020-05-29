import i18nHelper from '../i18nHelper';
import Decimal from 'decimal.js';
let i18n: i18nHelper;

beforeEach(() => {
  i18n = new i18nHelper({
    currentLocale: () => 'en-US',
    translate: () => 'test',
    translations: {},
    locale: 'en-US'
  });
});

describe('fsi18n', () => {
  describe('string', () => {
    test('should throw an error if no translations have been set', () => {
      expect(() => i18n.string('test')).toThrowError();
    });
  });

  describe('number', () => {
    test('should throw an error when provided something other than a number or string', () => {
      // @ts-ignore
      expect(() => i18n.number({})).toThrowError();
    });

    test('should throw an error when provided an invalid number', () => {
      expect(() => i18n.number('not a number')).toThrowError();
    });

    test('should handle strings', () => {
      const num = i18n.number('1234');
      expect(num).toBe('1,234');
    });
  });

  describe('currency', () => {
    test('should add default options to format the number into a currency string', () => {
      const spy = jest.spyOn(i18n, 'number');
      const testNumber = 1234.56;
      const testCurrency = 'usd';

      i18n.currency(testNumber, testCurrency);

      expect(spy).toBeCalledWith(testNumber, {
        style: 'currency',
        currency: testCurrency
      });
    });

    test('should throw an error if no currency is set', () => {
      expect(() => i18n.currency(1234)).toThrowError();
    });

    test('should allow options to overwrite the defaults', () => {
      const spy = jest.spyOn(i18n, 'number');
      const testNumber = 1234.56;
      const options = {
        currency: 'eur'
      };

      i18n.currency(testNumber, undefined, options);

      expect(spy).toBeCalledWith(testNumber, {
        style: 'currency',
        currency: 'eur'
      });
    });
  });

  describe('percent', () => {
    test('should add default options to format the number into a currency string', () => {
      const spy = jest.spyOn(i18n, 'number');
      const testNumber = 1234.56;

      i18n.percent(testNumber);

      expect(spy).toBeCalledWith(testNumber, {
        style: 'percent'
      });
    });
  });

  describe('date', () => {
    test('should throw an error when provided something other than a date', () => {
      // @ts-ignore
      expect(() => i18n.date('1234')).toThrowError();
    });

    test('should throw an error when provided an invalid date', () => {
      const invalidDate = new Date('Not a date.');
      expect(() => i18n.date(invalidDate)).toThrowError();
    });
  });

  describe('convertToNumber', () => {
    const tests = [{
      input: '1',
      result: 1
    }, {
      input: '1.1',
      result: 1.1
    }, {
      input: '-1.1',
      result: -1.1
    }, {
      input: 'bad',
      result: NaN
    }, {
      input: new Decimal(123),
      result: 123
    }];

    tests.forEach(({input, result}) => {
      test(`should convert "${input}" to a number`, () => {
        // @ts-ignore Testing protected function
        const num = i18n.convertToNumber(input);
        expect(typeof num).toBe('number');
        expect(num).toBe(result);
      });
    });
  });
});
