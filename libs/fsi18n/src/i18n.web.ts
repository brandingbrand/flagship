import I18n from 'i18n-js';

import { hardenI18n } from './hardenI18n';

const currentLocale = getLanguageFromBrowser() || I18n.currentLocale();
I18n.locale = currentLocale;

/**
 * Get the user's language settings from their browser
 * navigator.language will work in most cases, but older versions of IE use non-standard keys
 *
 * @return User's locale
 */
function getLanguageFromBrowser(): string | undefined {
  if (navigator && typeof navigator === 'object') {
    const { browserLanguage, language, userLanguage } = navigator as Navigator & {
      userLanguage?: string;
      browserLanguage?: string;
    };

    return language || browserLanguage || userLanguage;
  }

  return undefined;
}

export default hardenI18n(I18n);
