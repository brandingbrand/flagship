import { makeBranding } from '@brandingbrand/standard-branded';

import { PARSER_BRANDING } from './parser.constants';

export const { brand: brandParser, isBrand: isParserBrand } = makeBranding(PARSER_BRANDING);
