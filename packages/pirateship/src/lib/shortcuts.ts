import { Navigator } from '@brandingbrand/fsapp';
import { ScreenProps } from './commonTypes';

interface ErrorHandler {
  response: {
    status: number;
  };
}

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
  error: ErrorHandler,
  navigator: Navigator,
  signOutFn: () => Promise<void>
): void => {
  if (error.response && error.response.status && error.response.status === 401) {
    signOutFn()
      .catch(e => {
        console.warn('Error signing user out', e);
      });
  } else {
    console.warn(error, error.response);
  }
};
