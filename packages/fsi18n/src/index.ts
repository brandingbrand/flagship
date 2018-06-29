import I18n from './i18n';
import I18nHelper from './i18nHelper';
import * as translationAssets from './translations';
import { FSTranslationKeys, I18n as I18nInterface } from './types';

// We're a little stricter/more explicit in our type definitions for translations,
// so we need to do a type assertion. The translation type definitions are technically
// compatible, but are not detected as such.
const FSI18n = new I18nHelper(I18n as I18nInterface);

const translations = {
  en: translationAssets.en.keys
};

const translationKeys = FSI18n.addTranslations<FSTranslationKeys<string>>(translations);

export default FSI18n;
export * from './types';
export { translationKeys, translationAssets };
