import FSI18n from '@brandingbrand/fsi18n';
import { en } from './en';
import { ProjectTranslationKeys } from './types';

const translations = {
  en
};
const translationKeys = FSI18n.addTranslations<ProjectTranslationKeys<string>>(translations);

export default FSI18n;
export { translationKeys };
