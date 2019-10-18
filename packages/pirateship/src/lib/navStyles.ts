import { NavButton } from '../lib/commonTypes';
import { Navigation } from 'react-native-navigation';

export const backButton: NavButton = {
  button: {
    icon: require('../../assets/images/arrow.png'),
    id: 'goBack',
    testID: 'back'
  },
  action: ({ componentId }) => {
    Navigation.pop(componentId)
    .catch(e => console.warn('backButton POP error: ', e));
  }
};

export const dismissButton: NavButton = {
  button: {
    icon: require('../../assets/images/close.png'),
    id: 'dismissModal'
  },
  action: ({ componentId }) => {
    Navigation.dismissModal(componentId)
    .catch(e => console.warn('dismissButton DISMISSMODAL error: ', e));
  }
};

export const searchButton: NavButton = {
  button: {
    icon: require('../../assets/images/search.png'),
    id: 'search'
  },
  action: ({ componentId }) => {
    Navigation.push(componentId, {
      component: {
        name: 'Search',
        passProps: {
          onCancel: () => {
            Navigation.pop(componentId, {
              animations: {
                pop: {
                  enabled: false
                }
              }
            }).catch(e => console.warn('Search POP error: ', e));
          }
        }
      }
    }).catch(e => console.warn('Search PUSH error: ', e));
  }
};

export const signOutButton: NavButton = {
  button: {
    id: 'signOut',
    text: 'Sign Out'
  },
  action: () => null
};
