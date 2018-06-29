import I18n from 'i18n-js';
const currentLocale = getLanguageFromBrowser() || I18n.currentLocale();
I18n.locale = currentLocale;

export default I18n;

/**
 * Get the user's language settings from their browser
 * navigator.language will work in most cases, but older versions of IE use non-standard keys
 *
 * @returns {string|undefined} User's locale
 */
function getLanguageFromBrowser(): string | undefined {
  if (navigator && typeof navigator === 'object') {
    const { language, browserLanguage, userLanguage } = navigator as Navigator & {
      userLanguage?: string;
      browserLanguage?: string;
    };

    return language || browserLanguage || userLanguage;
  }

  return undefined;
}
