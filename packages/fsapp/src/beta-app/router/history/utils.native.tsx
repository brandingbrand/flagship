import type {
  ActivatedRoute,
  MatchingRoute,
  ParentRoute,
  Route,
  TopLevelParentRoute
} from '../types';

import React from 'react';
import { Text } from 'react-native';
import { Layout, LayoutRoot, LayoutTabsChildren, Navigation } from 'react-native-navigation';

import { defaultsDeep, uniqueId } from 'lodash-es';

import { Matchers, matchRoute } from './utils.base';
import { ROOT_STACK } from './constants';

export const isTabRoute = (route: Route): route is TopLevelParentRoute => 'tab' in route;

export const isNotTabRoute = (route: Route): route is Exclude<Route, TopLevelParentRoute> =>
  !('tab' in route);

export const createStack = ([route, title]: readonly [
  MatchingRoute,
  string | undefined
]): Layout => {
  return {
    stack: {
      id: route.tabAffinity || ROOT_STACK,
      children: [
        {
          component: {
            name: route.id,
            id: route.matchedPath,
            options: { topBar: { title: { text: title ?? route.tabAffinity } } }
          }
        }
      ]
    }
  };
};

export const resolveStack = async (
  route: MatchingRoute,
  activated: ActivatedRoute,
  layout: Layout
): Promise<Layout> => {
  const componentDetails =
    'component' in route ? route.component : await route.loadComponent(activated);

  return defaultsDeep({}, layout, {
    stack: {
      children: [
        {
          component: {
            options: { topBar: componentDetails.buttons }
          }
        }
      ]
    }
  });
};

export const createKey = () => {
  return Math.random().toString(36).substr(2, 8);
};

export const applyMatcher = async (matchers: Matchers, { path }: ParentRoute) => {
  const component = await matchRoute(matchers, path ? `/${path}` : '/');
  if (component) {
    const title =
      typeof component.title === 'function'
        ? await component.title({
          data: component.data ?? {},
          query: component.query,
          params: component.params,
          path: component.matchedPath,
          loading: true
        })
        : component.title;
    return [component, title] as const;
  }

  return undefined;
};

export const matchStack = async (route: ParentRoute, matcher: Matchers) => {
  const component = await applyMatcher(matcher, route);
  return component ? createStack(component) : undefined;
};

const makeErrorComponent = (error: string): Layout => {
  const id = uniqueId('error');
  // tslint:disable-next-line: jsx-use-translation-function
  Navigation.registerComponent(id, () => () => <Text>Error: {error}</Text>);
  return {
    stack: {
      id: ROOT_STACK,
      children: [
        {
          component: {
            name: id,
            options: {
              topBar: {
                title: {
                  text: 'Error'
                }
              }
            }
          }
        }
      ]
    }
  };
};

export const makeRootLayout = async (
  tabs: Layout[],
  fallback: () => Promise<Layout | undefined>
): Promise<Layout> => {
  if (tabs.length > 1) {
    return {
      bottomTabs: {
        id: ROOT_STACK,
        children: tabs
      }
    };
  }

  if (tabs.length === 1) {
    return tabs[0];
  }

  const rootStack = await fallback();
  if (rootStack) {
    return rootStack;
  }

  return makeErrorComponent('Could not determine root route, check your route config...');
};

export const extractPagePaths = (root: Layout) => {
  return (
    root.bottomTabs?.children?.map(({ stack }) => stack?.children?.[0].component?.id) ?? [
      root.stack?.children?.[0]?.component?.id
    ]
  );
};

export const activateStacks = async (
  root: Layout,
  activated: (readonly [MatchingRoute, ActivatedRoute] | readonly [undefined, undefined])[]
): Promise<LayoutRoot> => {
  if (root.bottomTabs?.children) {
    return {
      root: {
        ...root,
        bottomTabs: {
          children: await Promise.all(
            activated.map(([route, activated], i) => {
              const layout = root.bottomTabs?.children?.[i] as LayoutTabsChildren;
              if (!route || !activated) {
                return layout;
              }

              return resolveStack(route, activated, layout);
            })
          )
        }
      }
    };
  }

  if (root.stack && activated[0]?.[1] && activated[0]?.[0]) {
    return {
      root: await resolveStack(activated[0][0], activated[0][1], root)
    };
  }

  return { root };
};

export { matchRoute, stringifyLocation, buildMatchers, resolveRoute } from './utils.base';
