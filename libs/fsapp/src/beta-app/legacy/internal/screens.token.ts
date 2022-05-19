import { InjectionToken } from '@brandingbrand/fslinker';

import type { ComponentRoute } from '../../router';

/**
 * @internal
 * @deprecated
 */
export const LEGACY_ROUTES = new InjectionToken<Map<string, ComponentRoute>>('LEGACY_ROUTES');
