import { AppConfigType, NavLayout, RoutableComponentClass } from '../types';
import pathToRegexp, { Key } from 'path-to-regexp';
import { parse } from 'url';
import qs from 'qs';

export const pathForScreen = (screen: RoutableComponentClass, key: string) => {
  return screen.path ? screen.path : `/_s/${key}/`;
};

export interface NavMatch {
  layout: NavLayout;
  screen: RoutableComponentClass;
}

export const hrefToNav = (href: string, appConfig: AppConfigType): NavMatch | null => {
  const { screens } = appConfig;
  const parsed = parse(href);
  let found: NavMatch | null = null;
  if (parsed.pathname) {
    for (const key in screens) {
      if (Object.prototype.hasOwnProperty.call(screens, key)) {
        const screen = screens[key];
        const keys: Key[] = [];
        const pathRegex = pathToRegexp(pathForScreen(screen, key), keys);

        const match = pathRegex.exec(parsed.pathname);

        if (match) {
          const [, ...values] = match;
          const passProps = keys.reduce((memo, key, index) => {
            memo[key.name] = values[index];
            return memo;
          }, {} as any);
          const queries = parsed.search ? qs.parse(parsed.search.replace(/^\?/, '')) : {};
          const combinedProps = {
            ...passProps,
            ...queries
          };
          const convertedProps = screen.matchConvert ?
            screen.matchConvert(combinedProps) : combinedProps;
          found = {
            layout: {
              component: {
                name: screen.name,
                passProps: convertedProps
              }
            },
            screen
          };
        }
      }
    }
  }
  return found;
};
