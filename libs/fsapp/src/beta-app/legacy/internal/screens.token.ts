import type { ComponentRoute } from '../../router';

import { InjectionToken } from '@brandingbrand/fslinker';

/**
 * @internal
 * @deprecated
 */
export const LEGACY_ROUTES = new InjectionToken<Map<string, ComponentRoute>>('LEGACY_ROUTES');
