import { InjectionToken, Injector } from '@brandingbrand/fslinker';

import qs from 'qs';

import type { LegacyNavLayout, LegacyNavLayoutComponent } from '../../legacy-navigator.type';

/**
 * @internal
 * @deprecated
 */
export const LEGACY_PATH_MAP = new InjectionToken<Map<string, string>>('LEGACY_PATH_MAP');

/**
 * @internal
 * @param layout
 * @deprecated
 */
export const layoutToPath = (layout: LegacyNavLayout | LegacyNavLayoutComponent) => {
  const component = 'component' in layout ? layout.component : layout;

  if (!component || !('name' in component)) {
    return '/';
  }

  const props = qs.stringify(component.passProps ?? {});
  const path =
    Injector.get(LEGACY_PATH_MAP)?.get(`${component.name}`) ??
    `/${component.name}`.replace(/^\/\//, '/');

  return props ? `${path}?${props}` : path;
};
