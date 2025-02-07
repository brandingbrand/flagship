import type {TranslationKey} from '@brandingbrand/fsi18n';

import {en} from './en';

export type TranslationKeys<KeyType = TranslationKey> = {
  [T in keyof typeof en]: {
    [U in keyof (typeof en)[T]]: KeyType;
  };
};
