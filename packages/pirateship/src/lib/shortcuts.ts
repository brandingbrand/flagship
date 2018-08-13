type Navigator = import ('react-native-navigation').Navigator;

export const openSignInModal = (navigator: Navigator) => () => {
  navigator.showModal({
    screen: 'SignIn',
    passProps: {
      dismissible: true,
      onDismiss: () => {
        navigator.dismissModal();
      },
      onSignInSuccess: () => {
        navigator.dismissModal();
      }
    }
  });
};

export const handleAccountRequestError = (
  error: any,
  navigator: Navigator,
  signOutFn: () => Promise<any>
): void => {
  if (error.response && error.response.status && error.response.status === 401) {
    signOutFn()
      .then(() => {
        navigator.resetTo({
          screen: 'Account',
          title: 'Account'
        });
      })
      .catch(e => {
        console.warn('Error signing user out', e);

        navigator.resetTo({
          screen: 'Account',
          title: 'Account'
        });
      });
  } else {
    console.warn(error, error.response);
  }
};
