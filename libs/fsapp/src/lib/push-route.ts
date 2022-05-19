import pathToRegexp from 'path-to-regexp';
import qs from 'qs';

import type { AppConfigType, NavLayout, RoutableComponentClass } from '../types';

export const overwrite = (newProps: any, history: any, appConfig: AppConfigType): any => {
  let matchedScreen:
    | {
        screen: RoutableComponentClass;
        screenName: string;
      }
    | undefined;
  for (const screenName in appConfig.screens) {
    if (appConfig.screens.hasOwnProperty(screenName)) {
      const screen = appConfig.screens[screenName];

      if (screen) {
        let pathReg = new RegExp(`^/_s/${screenName}/?$`);
        if (screen.path) {
          pathReg = pathToRegexp(screen.path);
        }
        if (pathReg.test(window.location.pathname)) {
          matchedScreen = {
            screen,
            screenName,
          };
        }
      }
    }
  }
  if (matchedScreen) {
    const path = getPathWithPassProps(matchedScreen.screenName, matchedScreen.screen, newProps);
    history.replace(path);
  } else {
    console.error('Could not match current screen');
  }
};

const push = (layout: NavLayout, history: any, appConfig: AppConfigType, href?: string): any => {
  if (layout.component) {
    if (appConfig.screens[layout.component.name]) {
      if (href) {
        history.push(href);
      } else {
        const path = getPathWithPassProps(
          String(layout.component.name),
          appConfig.screens[layout.component.name],
          layout.component.passProps
        );
        history.push(path);
      }
    } else {
      console.error(`Unknown screen: ${layout.component.name}`);
    }
  } else {
    console.error('No component to push');
  }
};

export default push;

const getPathWithPassProps = (screenName: string, screen: any, passProps: any): string => {
  if (screen && screen.path) {
    if (screen.path.includes(':')) {
      let convertProps = passProps;
      if (screen.urlConvert) {
        convertProps = screen.urlConvert(convertProps);
      }
      const extraQS = getExtraQS(screen.paramKeys, convertProps);
      return (
        screen.toPath(convertProps, {
          encode: (str: string): string => str,
        }) + extraQS
      );
    }
    return `${screen.path}?${qs.stringify(passProps)}`;
  }
  return `/_s/${screenName}` + `?${qs.stringify(passProps)}`;
};

const getExtraQS = (paramKeys: any, passProps: any): string => {
  const extra: any = {};
  const keyNames = new Set(paramKeys.map((k: any) => k.name).filter(Boolean));
  let hasExtra = false;

  for (const pk of Object.keys(passProps)) {
    if (!keyNames.has(pk)) {
      extra[pk] = passProps[pk];
      hasExtra = true;
    }
  }

  return hasExtra ? `?${qs.stringify(extra)}` : '';
};
