import { makeBranding } from '@brandingbrand/standard-branded';

import { COMBINATOR_BRANDING } from './combinator.constants';

export const { brand: brandCombinator, isBrand: isCombinatorBrand } =
  makeBranding<typeof COMBINATOR_BRANDING>(COMBINATOR_BRANDING);
