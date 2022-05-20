import Decimal from 'decimal.js';
import { merge, set } from 'lodash';

import type {
  FSTranslationKeys,
  I18n,
  NumberLike,
  PluralTranslationKey,
  TranslationKey,
  TranslationKeys,
  Translations,
} from './types';

const MISSING_TRANSLATIONS_ERROR = new Error('You must provide translations before translating.');
const MISSING_CURRENCY_ERROR = new Error('You must provide a currency');
const INVALID_NUMBER_ERROR = new Error(`Provided argument is not a valid number`);
const INVALID_DATE_ERROR = new Error(`Provided argument is not a valid date`);

export interface ICurrencyValue {
  value: Decimal;
  currencyCode: string;
}

export default class I18nHelper {
  constructor(protected readonly i18n: I18n) {
    this.i18n.fallbacks = true;
  }

  protected localeListeners: Array<(locale: string) => void> = [];

  /**
   * Converts a given number-like value into an actual number
   *
   * @param num - number-like value to be converted
   * @return - Converted number
   */
  protected convertToNumber(num: NumberLike): number {
    if (num instanceof Decimal) {
      return num.toNumber();
    } else if (typeof num === 'string') {
      return Number.parseFloat(num);
    }

    return num;
  }

  /**
   * Recursively creates a new object matching the structure of the currently set
   * translations with each keys' value replaced by its object path. This object can be
   * used to reference the intended translation key with auto-completion and type checking.
   *
   * @param translations - Translations keys to flatten
   * @param parentTranslations - New object containing the object paths
   * @param paths - Paths to the current translation keys object from the root level
   * @return - New object containing the object paths
   */
  protected flatten(
    translations: TranslationKeys,
    parentTranslations: TranslationKeys = {},
    paths: string[] = []
  ): TranslationKeys {
    return Object.keys(translations).reduce((parentTranslations, key) => {
      paths.push(key);

      if (!this.isTranslationKey(translations[key])) {
        this.flatten(translations[key] as TranslationKeys, parentTranslations, paths);
      } else {
        set(parentTranslations, paths, paths.join('.'));
      }

      paths.pop();
      return parentTranslations;
    }, parentTranslations);
  }

  /**
   * Determines if a given value is a translation key
   *
   * @param translationKey - Value to check if it is a translation key
   * @param translationKey.zero
   * @param translationKey.one
   * @param translationKey.other
   * @return - Whether or not the value is a translation key
   */
  protected isTranslationKey(
    translationKey: TranslationKey | object | undefined
  ): translationKey is TranslationKey {
    const isString = typeof translationKey === 'string';
    const hasPluralizationKeys =
      Boolean(translationKey) &&
      typeof translationKey === 'object' &&
      (typeof (translationKey as PluralTranslationKey).zero === 'string' ||
        typeof (translationKey as PluralTranslationKey).one === 'string' ||
        typeof (translationKey as PluralTranslationKey).other === 'string');

    return isString || hasPluralizationKeys;
  }

  /**
   * Recursively merges new string translations into any existing
   *
   * @param translations - A locale-indexed object containing
   * key/value pairs of string translations
   * @return - All possible string translations
   */
  public addTranslations<T = TranslationKeys>(
    translations: Translations
  ): FSTranslationKeys<string> & T {
    if (!this.i18n.translations) {
      this.i18n.translations = translations;
    } else {
      merge(this.i18n.translations, translations);
    }

    return this.getAvailableStringTranslations();
  }

  /**
   * Change language
   *
   * @param locale - Set locale
   */
  public setLocale(locale: string): void {
    this.i18n.locale = locale;
    this.localeListeners.forEach((func: (locale: string) => void) => {
      func(locale);
    });
  }

  public addLocaleListener(func: (locale: string) => void): void {
    this.localeListeners.push(func);
  }

  public removeLocaleListener(func: (locale: string) => void): void {
    this.localeListeners = this.localeListeners.filter(
      (testFunc: (locale: string) => void) => func !== testFunc
    );
  }

  /**
   * Creates an object matching the same structure as the translation definitions
   * object, but with the string translation values replaced by their object path
   *
   * Used for code completion.
   *
   * @return Available string translations
   */
  public getAvailableStringTranslations<T = TranslationKeys>(): T {
    if (this.i18n.translations === undefined) {
      throw MISSING_TRANSLATIONS_ERROR;
    }

    const { translations } = this.i18n;
    const availableTranslations = Object.keys(translations).map((locale) =>
      this.flatten(translations[locale] ?? {})
    );

    return merge({}, ...availableTranslations);
  }

  /**
   * Converts a number-like value into a locale-formatted string
   *
   * @param num - Number to be formatted
   * @param [options] - Options to control how the number is formatted
   * @return - Formatted number
   * @example FSI18n.number(1234); // returns "1,234"
   */
  public number(num: NumberLike, options?: Intl.NumberFormatOptions): string {
    if (typeof num === 'string' || num instanceof Decimal) {
      num = this.convertToNumber(num);
    }

    if (typeof num !== 'number' || isNaN(num)) {
      throw INVALID_NUMBER_ERROR;
    }

    return num.toLocaleString(this.currentLocale(), options);
  }

  /**
   * Converts a number-like value into a locale-formatted currency string
   *
   * @param num - Number to be formatted
   * @param [currency] - ISO 4217 currency code
   * @param [options] - Options to control how the number is formatted
   * @return - Formatted number
   * @example FSI18n.currency(1.23, 'USD'); // returns "$1.23"
   */
  public currency(
    num: ICurrencyValue | NumberLike,
    currency?: string,
    options?: Intl.NumberFormatOptions
  ): string {
    if (
      !currency &&
      (!options || !options.currency) &&
      (typeof num !== 'object' || num instanceof Decimal || !num.currencyCode)
    ) {
      throw MISSING_CURRENCY_ERROR;
    }

    if (typeof num === 'object' && !(num instanceof Decimal)) {
      currency = num.currencyCode;
      num = this.convertToNumber(num.value);
    }

    const currencyOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency,
      ...options,
    };

    return this.number(num, currencyOptions);
  }

  /**
   * Converts a number-like value into a locale-formatted percent string
   *
   * @param num - Number to be formatted
   * @param [options] - Options to control how the number is formatted
   * @return - Formatted number
   * @example FSI18n.percent(.12); // returns "12%"
   */
  public percent(num: NumberLike, options?: Intl.NumberFormatOptions): string {
    const percentOptions: Intl.NumberFormatOptions = {
      style: 'percent',
      ...options,
    };

    return this.number(num, percentOptions);
  }

  /**
   * Converts a date object into a locale-formatted string
   *
   * @param date - Date object to be formatted
   * @param [options] - Options to control how the date is formatted
   * @return - Formatted date string
   * @example FSI18n.date(new Date()); // returns "6/13/2018"
   */
  public date(date: Date, options?: Intl.DateTimeFormatOptions): string {
    if (!(date instanceof Date) || isNaN(date.valueOf())) {
      throw INVALID_DATE_ERROR;
    }

    return date.toLocaleDateString(this.currentLocale(), options);
  }

  /**
   * Returns the language appropriate for a given translationKey
   *
   * @param translationKey - Path to the appropriate key in a translation object
   * @param [options] - Optional options object to
   * allow for interpolation and/or pluralization
   * @return - Localized string
   */
  public string(translationKey?: TranslationKey, options?: I18n.TranslateOptions): string {
    if (Object.getOwnPropertyNames(this.i18n.translations).length === 0) {
      throw MISSING_TRANSLATIONS_ERROR;
    }

    if (translationKey === undefined) {
      console.warn('translationKey is undefined');
      return '';
    }

    return this.i18n.translate(translationKey, options);
  }

  /**
   * @return Current locale
   */
  public currentLocale(): string {
    return this.i18n.currentLocale();
  }
}
