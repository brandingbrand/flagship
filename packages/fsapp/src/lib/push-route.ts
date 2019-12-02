import qs from 'qs';
import { AppConfigType, NavLayout } from '../types';

export default function push(
  layout: NavLayout,
  history: any,
  appConfig: AppConfigType
): any {
  if (layout.component) {
    if (appConfig.screens[layout.component.name]) {
      const path = getPathWithPassProps(
        String(layout.component.name),
        appConfig.screens[layout.component.name],
        layout.component.passProps
      );
      history.push(path);
    } else {
      console.error('Unknown screen: ' + layout.component.name);
    }
  } else {
    console.error('No component to push');
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
