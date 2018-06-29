import { NavButton } from '../lib/commonTypes';

export const backButton: NavButton = {
  button: {
    icon: require('../../assets/images/arrow.png'),
    id: 'goBack'
  },
  action: ({ navigator }) => {
    navigator.pop();
  }
};

export const dismissButton: NavButton = {
  button: {
    icon: require('../../assets/images/close.png'),
    id: 'dismissModal'
  },
  action: ({ navigator }) => {
    navigator.dismissModal();
  }
};

export const searchButton: NavButton = {
  button: {
    icon: require('../../assets/images/search.png'),
    id: 'search'
  },
  action: ({ navigator }) => {
    navigator.push({
      screen: 'Search',
      animated: false,
      passProps: {
        onCancel: () => {
          navigator.pop({ animated: false });
        }
      }
    });
  }
};

export const signOutButton: NavButton = {
  button: { id: 'signOut', title: 'Sign Out' },
  action: () => null
};
