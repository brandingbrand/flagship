import I18nJs from 'i18n-js';

import { hardenI18n } from '../src/hardenI18n';

I18nJs.locale = 'en';
export const getLanguages = async (): Promise<string[]> => ['en'];

export default hardenI18n(I18nJs);
