import type { MatchingRoute, ParentRoute, Route, TopLevelParentRoute } from '../types';

import React from 'react';
import { Text } from 'react-native';
import { Layout, Navigation } from 'react-native-navigation';

import { uniqueId } from 'lodash-es';

import { Matchers, matchRoute } from './utils.base';
import { ROOT_STACK } from './constants';


export const isTabRoute = (route: Route): route is TopLevelParentRoute =>
  'tab' in route;

export const isNotTabRoute = (
  route: Route
): route is Exclude<Route, TopLevelParentRoute> => !('tab' in route);

export const createStack = ([component, title]: readonly [
  MatchingRoute,
  string
]): Layout => ({
  stack: {
    id: component.tabAffinity || ROOT_STACK,
    children: [
      {
        component: {
          name: component.id,
          id: component.matchedPath,
          options: { topBar: { title: { text: title } } }
        }
      }
    ]
  }
});

export const createKey = () => {
  return Math.random().toString(36).substr(2, 8);
};

export const applyMatcher = async (
  matchers: Matchers,
  { path }: ParentRoute
) => {
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

export const matchStack = async (
  route: ParentRoute,
  matcher: Matchers
) => {
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

  return makeErrorComponent(
    'Could not determine root route, check your route config...'
  );
};

export const extractPagePaths = (root: Layout) => {
  return (
    root.bottomTabs?.children?.map(
      ({ stack }) => stack?.children?.[0].component?.id
    ) ?? [root.stack?.children?.[0]?.component?.id]
  );
};

export {
  matchRoute,
  stringifyLocation,
  buildMatchers,
  resolveRoute
} from './utils.base';
