import { NavButton } from '../lib/commonTypes';
import { Navigator } from '@brandingbrand/fsapp';

export const backButton: NavButton = {
  button: {
    icon: require('../../assets/images/arrow.png'),
    id: 'goBack',
    testID: 'back'
  },
  action: (navigator: Navigator) => {
    navigator.pop()
    .catch((e: any) => console.warn('backButton POP error: ', e));
  }
};

export const dismissButton: NavButton = {
  button: {
    icon: require('../../assets/images/close.png'),
    id: 'dismissModal'
  },
  action: (navigator: Navigator) => {
    navigator.dismissModal()
    .catch((e: any) => console.warn('dismissButton DISMISSMODAL error: ', e));
  }
};

export const searchButton: NavButton = {
  button: {
    icon: require('../../assets/images/search.png'),
    id: 'search'
  },
  action: (navigator: Navigator) => {
    navigator.push({
      component: {
        name: 'Search',
        passProps: {
          onCancel: () => {
            navigator.pop({
              animations: {
                pop: {
                  enabled: false
                }
              }
            }).catch((e: any) => console.warn('Search POP error: ', e));
          }
        }
      }
    }).catch((e: any) => console.warn('Search PUSH error: ', e));
  }
};

export const signOutButton: NavButton = {
  button: {
    id: 'signOut',
    text: 'Sign Out'
  },
  action: () => null
};
