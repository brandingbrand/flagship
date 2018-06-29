import { parse as urlPaser } from 'url';

export type Matcher = (url: string, navigator?: any) => MatchResult | void;
export interface MatchResult {
  navAction: 'switchToTab' | 'showModal' | 'push' | 'popToRoot';
  screenParams: any;
}

const matchers: Matcher[] = [
  matchHome
];

export function handleDeeplink(
  url: string,
  navigator: any,
  noPassthrough?: boolean
): boolean {
  let match;

  for (const matcher of matchers) {
    match = matcher(url, navigator);
    if (match) {
      break;
    }
  }

  if (!match) {
    if (noPassthrough) {
      return false;
    } else {
      match = {
        navAction: 'push',
        screenParams: {
          screen: 'DesktopPassthrough',
          passProps: {
            url
          }
        }
      };
    }
  }

  navigator[match.navAction](match.screenParams);

  return true;
}

function matchHome(url: string): MatchResult | void {
  const { pathname } = urlPaser(url);
  if (pathname === null || pathname === '/') {
    return {
      navAction: 'popToRoot',
      screenParams: {
        animated: false
      }
    };
  }

  return;
}
