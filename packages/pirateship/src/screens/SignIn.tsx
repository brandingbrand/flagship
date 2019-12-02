import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Options } from 'react-native-navigation';
import { Loading } from '@brandingbrand/fscomponents';
import PSSignInForm from '../components/PSSignInForm';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { backButton } from '../lib/navStyles';
import { navBarHide } from '../styles/Navigation';
import { NavButton, ScreenProps } from '../lib/commonTypes';
import withAccount, { AccountProps } from '../providers/accountProvider';
import { fontSize, padding, palette } from '../styles/variables';
import PSButton from '../components/PSButton';
import translate, { translationKeys } from '../lib/translations';

const accountImage = require('../../assets/images/account-image.png');
const arrowIcon = require('../../assets/images/arrow.png');
const closeIcon = require('../../assets/images/close.png');

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: palette.surface,
    paddingTop: padding.base
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: palette.surface
  },
  headerContainer: {
    paddingHorizontal: padding.base
  },
  headerCallout: {
    textAlign: 'center',
    fontSize: 35,
    lineHeight: 41,
    marginBottom: 4,
    fontWeight: 'bold'
  },
  headerText: {
    textAlign: 'center'
  },
  accountImage: {
    marginBottom: 26
  },
  formContainer: {
    alignSelf: 'stretch',
    marginTop: 40
  },
  signUpContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: padding.base
  },
  signUpText: {
    fontSize: fontSize.small,
    fontWeight: 'normal'
  },
  dismissButtonContainer: {
    backgroundColor: palette.surface,
    minHeight: 40,
    margin: padding.narrow
  },
  dismissButton: {
    height: 40,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.background
  }
});

/// Dismisss button for SignIn screen - modals generally use close, pushed
/// screens generally use arrow (Back)
export enum DismissButtonStyle {
  Back,
  Close
}

export interface SignInScreenProps extends ScreenProps, AccountProps {
  /// Whether or not this sign in request should display a dismiss button
  dismissible: boolean;
  /// What style of dismiss button to display
  dismissButtonStyle?: DismissButtonStyle;
  /// A callback to invoke if the user requested to dismiss the sign in request
  onDismiss?: (screenProps: ScreenProps) => () => void;

  onSignInSuccess: (screenProps: ScreenProps) => () => void;
}

export interface SignInScreenState {
  isLoading: boolean;
}

class SignIn extends Component<SignInScreenProps, SignInScreenState> {
  static options: Options = navBarHide;
  static leftButtons: NavButton[] = [backButton];
  state: SignInScreenState = {
    isLoading: false
  };

  render(): JSX.Element {
    if (this.state.isLoading) {
      return <Loading style={styles.loading} />;
    }

    const {
      saveCredentials,
      getCredentials
    } = this.props;
    /// default to close
    const dismissButtonStyle = this.props.dismissButtonStyle || DismissButtonStyle.Close;

    return (
      <PSScreenWrapper
        navigator={this.props.navigator}
        hideGlobalBanner={true}
        hideWebHeader={this.props.isWebModal}
        needInSafeArea={true}
        style={styles.screenContainer}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled'
        }}
      >
        <View style={styles.dismissButtonContainer}>
          {this.props.dismissible && (
            <TouchableOpacity style={styles.dismissButton} onPress={this.onDismiss}>
              <Image source={dismissButtonStyle ? closeIcon : arrowIcon} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.container}>
          <Image source={accountImage} style={styles.accountImage} />
          <View style={styles.headerContainer}>
            <Text style={styles.headerCallout}>
              {translate.string(translationKeys.account.actions.signIn.headerCallout)}
            </Text>
            <Text style={styles.headerText}>
              {translate.string(translationKeys.account.actions.signIn.headerText)}
            </Text>
          </View>
          <View style={styles.formContainer}>
            <PSSignInForm
              signIn={this.signIn}
              forgotPassword={this.forgotPassword}
              saveCredentials={saveCredentials}
              getCredentials={getCredentials}
              onNav={this.props.onNav}
              navigator={this.props.navigator}
            />
          </View>
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              {translate.string(translationKeys.account.actions.signUp.promptBtnCallout)}
            </Text>
            <PSButton
              titleStyle={styles.signUpText}
              title={translate.string(translationKeys.account.actions.signUp.promptBtn)}
              link={true}
              onPress={this.signUp}
            />
          </View>
        </View>
      </PSScreenWrapper>
    );
  }

  // tslint:disable cyclomatic-complexity
  signIn = async (email: string, password: string) => {
    const { signIn } = this.props;
    let { onSignInSuccess } = this.props;
    if (!onSignInSuccess) {
      onSignInSuccess = () => (
        () => console.warn('No onSignInSuccess handler for Sign In')
      );
    }

    try {
      await signIn(email, password);
      onSignInSuccess(this.props)();
      return true;
    } catch (e) {
      if (e.message === 'FORCE_PASSWORD_CHANGE') {
        this.props.navigator.push({
          component: {
            name: 'ChangePassword',
            options: {
              topBar: {
                title: {
                  text: translate.string(translationKeys.screens.changePassword.title)
                }
              }
            },
            passProps: {
              email,
              currentPassword: password,
              onChangeSuccess: () => {
                this.props.navigator.pop()
                .catch((e: any) => console.warn('ChangePassword POP error: ', e));
                onSignInSuccess(this.props)();
              }
            }
          }
        }).catch((e: any) => console.warn('ChangePassword PUSH error: ', e));
        return true;
      } else {
        const response = (e || {}).response;
        let errorMsgs = ['Unable to sign in. Please try again later.'];

        if (response && response.data && response.data.error && response.data.error.message) {
          errorMsgs = response.data.error.message;
        }

        errorMsgs = Array.isArray(errorMsgs) ? errorMsgs : [errorMsgs];
        return Promise.reject(errorMsgs);
      }
    }
  }

  forgotPassword = () => {
    this.props.navigator.push({
      component: {
        name: 'ForgotPassword',
        options: {
          topBar: {
            title: {
              text: 'Forgot Password'
            }
          }
        },
        passProps: {
          onDismiss: () => () => {
            this.props.navigator.pop()
            .catch(e => console.warn('ForgotPassword POP error: ', e));
          },
          onSignUpSuccess: this.signUpSuccess
        }
      }
    }).catch(e => console.warn('ForgotPassword PUSH error: ', e));
  }

  signUp = () => {
    this.props.navigator.push({
      component: {
        name: 'SignUp',
        options: {
          topBar: {
            title: {
              text: 'Sign Up'
            }
          }
        },
        passProps: {
          dismissible: true,
          onDismiss: () => {
            this.props.navigator.pop()
            .catch(e => console.warn('SignUp POP error: ', e));
          },
          onSignUpSuccess: this.signUpSuccess
        }
      }
    }).catch(e => console.warn('SignUp PUSH error: ', e));
  }

  onDismiss = () => {
    const { onDismiss } = this.props;
    if (onDismiss) {
      onDismiss(this.props)();
    } else {
      console.warn('No onDismiss handler for Sign In');
    }
  }

  signUpSuccess = () => {
    const { onSignInSuccess } = this.props;
    this.props.navigator.pop()
    .catch(e => console.warn('SignIn POP error: ', e));

    if (onSignInSuccess) {
      this.setState({ isLoading: true });

      // pop/dismiss too quickly will crash android
      setTimeout(() => {
        this.setState({ isLoading: false });
        onSignInSuccess(this.props)();
      }, 1000);
    } else {
      console.warn('No onSignInSuccess handler for Sign In');
    }
  }
}

export default withAccount(SignIn);
