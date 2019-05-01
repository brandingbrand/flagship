import qs from 'qs';
import { AppConfigType } from '../types';

export default function push(
  route: any,
  history: any,
  appConfig: AppConfigType
): any {
  const href = (route.passProps && route.passProps.href) || '';

  if (route.screen) {
    const path = getPathWithPassProps(
      route.screen,
      appConfig.screens[route.screen],
      route.passProps
    );
    return history.push(path);
  } else if (href) {
    return history.push(href);
  } else {
    console.error('ERROR: `screen` or `passProps: { href }` is required.');
  }
}

function getPathWithPassProps(
  screenName: string,
  screen: any,
  passProps: any
): string {
  if (screen && screen.path) {
    if (screen.path.indexOf(':') > -1) {
      let convertProps = passProps;
      if (screen.urlConvert) {
        convertProps = screen.urlConvert(convertProps);
      }
      const extraQS = getExtraQS(screen.paramKeys, convertProps);
      return screen.toPath(convertProps, {
        encode: (str: string): string => {
          return str;
        }
      }) + extraQS;
    } else {
      return screen.path + '?' + qs.stringify(passProps);
    }
  } else {
    return `/_s/${screenName}` + '?' + qs.stringify(passProps);
  }
}

function getExtraQS(paramKeys: any, passProps: any): string {
  const extra: any = {};
  const keyNames = paramKeys.map((k: any) => k.name).filter((n: any) => !!n);
  let hasExtra = false;

  Object.keys(passProps).forEach(pk => {
    if (keyNames.indexOf(pk) === -1) {
      extra[pk] = passProps[pk];
      hasExtra = true;
    }
  });

  return hasExtra ? '?' + qs.stringify(extra) : '';
}
