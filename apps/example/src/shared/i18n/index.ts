import i18n from '@brandingbrand/fsi18n';

import {en} from './en';
import type {TranslationKeys} from './types';

i18n.setLocale('en');

export {i18n};
export const keys = i18n.addTranslations<TranslationKeys<string>>({en});
