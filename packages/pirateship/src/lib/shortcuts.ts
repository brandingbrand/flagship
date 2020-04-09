import { Navigator } from '@brandingbrand/fsapp';
import { ScreenProps } from './commonTypes';

export const openSignInModal = (navigator: Navigator) => () => {
  navigator.showModal({
    component: {
      name: 'SignIn',
      passProps: {
        dismissible: true,
        onDismiss: (screenProps: ScreenProps) => {
          screenProps.navigator.dismissModal()
          .catch(e => console.warn('SignIn DISMISSMODAL error: ', e));
        },
        onSignInSuccess: (screenProps: ScreenProps) => {
          screenProps.navigator.dismissModal()
          .catch(e => console.warn('SignIn DISMISSMODAL error: ', e));
        }
      }
    }
  }).catch(e => console.warn('SignIn SHOWMODAL error: ', e));
};

export const handleAccountRequestError = (
  error: any,
  navigator: Navigator,
  signOutFn: () => Promise<any>
): void => {
  if (error.response && error.response.status && error.response.status === 401) {
    signOutFn()
      .then(() => {
        navigator.setStackRoot({
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

        navigator.setStackRoot({
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
