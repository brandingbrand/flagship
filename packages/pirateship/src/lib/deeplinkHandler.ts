import { parse as urlPaser } from 'url';
import { Navigator } from '@brandingbrand/fsapp';

export type Matcher = (url: string, navigator: Navigator) => boolean;

const matchers: Matcher[] = [
  matchHome
];

export function handleDeeplink(
  url: string,
  navigator: Navigator,
  noPassthrough?: boolean
): boolean {
  let match: boolean;

  for (const matcher of matchers) {
    match = matcher(url, navigator);
    if (match) {
      return true;
    }
  }

  if (noPassthrough) {
    return false;
  } else {
    navigator.push({
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

function matchHome(url: string, navigator: Navigator): boolean {
  const { pathname } = urlPaser(url);
  if (pathname === null || pathname === '/') {
    navigator.popToRoot()
    .catch(e => console.warn('POPTOROOT error: ', e));
    return true;
  }
  return false;
}
