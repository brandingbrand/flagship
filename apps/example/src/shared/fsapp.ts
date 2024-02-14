import {
  type ComponentRoute,
  type Route,
  type RouteCollection,
  type ScreenComponentType,
} from '@brandingbrand/fsapp';
import type {Options} from 'react-native-navigation';

export function makeScreen(
  component: ScreenComponentType,
  routeOptions: Omit<ComponentRoute, 'component'>,
  options: Options,
): Route {
  (component as any).options = options;

  return {
    ...routeOptions,
    component,
  };
}

export function makeTab(
  route: Route,
  options: Omit<RouteCollection, 'children' | 'initialPath'>,
): RouteCollection {
  return {
    ...options,
    children: [route],
    initialPath: route.path as string,
  };
}
