import { Navigation } from 'react-native-navigation';

export const openSignInModal = (componentId: string) => () => {
  Navigation.showModal({
    component: {
      name: 'SignIn',
      passProps: {
        dismissible: true,
        onDismiss: () => {
          Navigation.dismissModal(componentId)
          .catch(e => console.warn('SignIn DISMISSMODAL error: ', e));
        },
        onSignInSuccess: () => {
          Navigation.dismissModal(componentId)
          .catch(e => console.warn('SignIn DISMISSMODAL error: ', e));
        }
      }
    }
  }).catch(e => console.warn('SignIn SHOWMODAL error: ', e));
};

export const handleAccountRequestError = (
  error: any,
  componentId: string,
  signOutFn: () => Promise<any>
): void => {
  if (error.response && error.response.status && error.response.status === 401) {
    signOutFn()
      .then(() => {
        Navigation.setStackRoot(componentId, {
          component: {
            name: 'Account',
            options: {
              topBar: {
                title: {
                  text: 'Account'
                }
              }
            }
          }
        }).catch(e => console.warn('Account SETSTACKROOT error: ', e));
      })
      .catch(e => {
        console.warn('Error signing user out', e);

        Navigation.setStackRoot(componentId, {
          component: {
            name: 'Account',
            options: {
              topBar: {
                title: {
                  text: 'Account'
                }
              }
            }
          }
        }).catch(e => console.warn('Account SETSTACKROOT error: ', e));
      });
  } else {
    console.warn(error, error.response);
  }
};
