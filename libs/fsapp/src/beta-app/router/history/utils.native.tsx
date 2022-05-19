import React from 'react';

import { Text } from 'react-native';
import type { Layout, LayoutRoot, LayoutTabsChildren } from 'react-native-navigation';
import { Navigation } from 'react-native-navigation';

import { defaultsDeep, uniqueId } from 'lodash-es';

import type { ActivatedRoute, MatchingRoute, ParentRoute, Route, RouteCollection } from '../types';

import { ROOT_STACK, ROOT_STACK_OPTIONS } from './constants';
import { matchRoute } from './utils.base';
import type { Matchers } from './utils.base';

export const isTabRoute = (route: Route): route is RouteCollection => 'tab' in route;

export const isNotTabRoute = (route: Route): route is Exclude<Route, RouteCollection> =>
  !('tab' in route);

export const createStack = ([route, title]: readonly [
  MatchingRoute,
  string | undefined
]): Layout => ({
  stack: {
    id: route.tabAffinity || ROOT_STACK,
    children: [
      {
        component: {
          name: route.id,
          id: route.matchedPath,
          options: {
            statusBar: { ...route.statusBarStyle },
            topBar: {
              ...route.topBarStyle,
              title: {
                ...route.topBarStyle?.title,
                text: title ?? route.tabAffinity,
              },
            },
          },
        },
      },
    ],
  },
});

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
            options: { topBar: componentDetails.buttons },
          },
        },
      ],
    },
  });
};

export const applyMatcher = async (matchers: Matchers, route: ParentRoute | RouteCollection) => {
  const component = await matchRoute(
    matchers,
    'initialPath' in route ? `/${route.initialPath}` : route.path ? `/${route.path}` : '/'
  );
  if (component) {
    const title =
      typeof component.title === 'function'
        ? await component.title({
            id: component.id,
            data: component.data ?? {},
            query: component.query,
            params: component.params,
            path: component.path,
            url: component.matchedPath,
            isExact: component.path === component.matchedPath,
            loading: true,
          })
        : component.title;
    return [component, title] as const;
  }

  return undefined;
};

export const matchStack = async (route: ParentRoute | RouteCollection, matcher: Matchers) => {
  const component = await applyMatcher(matcher, route);
  return component ? createStack(component) : undefined;
};

const makeErrorComponent = (error: string): Layout => {
  const id = uniqueId('error');
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
                  text: 'Error',
                },
              },
            },
          },
        },
      ],
    },
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
        options: ROOT_STACK_OPTIONS,
        children: tabs,
      },
    };
  }

  if (tabs.length === 1 && tabs[0]) {
    return tabs[0];
  }

  const rootStack = await fallback();
  if (rootStack) {
    return rootStack;
  }

  return makeErrorComponent('Could not determine root route, check your route config...');
};

export const extractPagePaths = (root: Layout) =>
  root.bottomTabs?.children?.map(({ stack }) => stack?.children?.[0]?.component?.id) ?? [
    root.stack?.children?.[0]?.component?.id,
  ];

export const activateStacks = async (
  root: Layout,
  activated: Array<readonly [MatchingRoute, ActivatedRoute] | readonly [undefined, undefined]>
): Promise<LayoutRoot> => {
  if (root.bottomTabs?.children) {
    return {
      root: {
        ...root,
        bottomTabs: {
          id: ROOT_STACK,
          options: ROOT_STACK_OPTIONS,
          children: await Promise.all(
            activated.map(([route, activated], i) => {
              const layout = root.bottomTabs?.children?.[i] as LayoutTabsChildren;
              if (!route || !activated) {
                return layout;
              }

              return resolveStack(route, activated, layout);
            })
          ),
        },
      },
    };
  }

  if (root.stack && activated[0]?.[1] && activated[0]?.[0]) {
    return {
      root: await resolveStack(activated[0][0], activated[0][1], root),
    };
  }

  return { root };
};

export {
  matchRoute,
  stringifyLocation,
  buildMatchers,
  resolveRoute,
  createKey,
  normalizeLocationDescriptor,
} from './utils.base';
