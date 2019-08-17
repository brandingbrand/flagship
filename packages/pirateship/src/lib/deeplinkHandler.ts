import { parse as urlPaser } from 'url';
import { Navigation } from 'react-native-navigation';

export type Matcher = (url: string, componentId: string) => boolean;

const matchers: Matcher[] = [
  matchHome
];

export function handleDeeplink(
  url: string,
  componentId: string,
  noPassthrough?: boolean
): boolean {
  let match: boolean;

  for (const matcher of matchers) {
    match = matcher(url, componentId);
    if (match) {
      return true;
    }
  }

  if (noPassthrough) {
    return false;
  } else {
    Navigation.push(componentId, {
      component: {
        name: 'DesktopPassthrough',
        passProps: {
          url
        }
      }
    }).catch(e => console.warn('DesktopPassthrough PUSH error: ', e));
  }
  return true;
}

function matchHome(url: string, componentId: string): boolean {
  const { pathname } = urlPaser(url);
  if (pathname === null || pathname === '/') {
    Navigation.popToRoot(componentId)
    .catch(e => console.warn('POPTOROOT error: ', e));
    return true;
  }
  return false;
}
