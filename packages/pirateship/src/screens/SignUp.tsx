import React, { Component } from 'react';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import TouchId from 'react-native-touch-id';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { dataSource } from '../lib/datasource';
import { backButton } from '../lib/navStyles';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import PSButton from '../components/PSButton';
import withAccount, { AccountProps } from '../providers/accountProvider';
import ContactInfoForm, { ContactFormValues } from '../components/ContactInfoForm';
import PSAddressForm, { AddressFormValues } from '../components/PSAddressForm';
import translate, { translationKeys } from '../lib/translations';

import GlobalStyle from '../styles/Global';
import { navBarHide } from '../styles/Navigation';
import { border, fontSize, padding, palette } from '../styles/variables';

const cancelIcon = require('../../assets/images/x.png');
const checkIcon = require('../../assets/images/check.png');

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: palette.surface
  },
  formHeaderContainer: {
    padding: padding.base,
    paddingBottom: padding.narrow,
    borderBottomColor: border.color,
    borderBottomWidth: border.width
  },
  formHeader: {
    fontSize: fontSize.small,
    lineHeight: fontSize.large,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  headerContainer: {
    paddingHorizontal: padding.base
  },
  headerTitle: {
    lineHeight: 41
  },
  headerCallout: {
    fontSize: fontSize.base,
    paddingBottom: padding.base
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: padding.base
  },
  headerText: {
    fontSize: fontSize.small,
    paddingLeft: 7
  },
  errorContainer: {
    backgroundColor: palette.surface,
    padding: padding.base
  },
  errorText: {
    fontWeight: 'bold',
    color: palette.error
  },
  dismissButtonContainer: {
    backgroundColor: palette.surface,
    margin: padding.narrow
  },
  dismissButton: {
    height: 40,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  divider: {
    backgroundColor: border.color,
    height: border.width
  },
  button: {
    margin: padding.base
  },
  checkIcon: {
    height: 10,
    width: 12
  }
});

export interface SignUpProps extends ScreenProps, AccountProps {
  dismissible: boolean;
  onDismiss?: () => void;
  onSignUpSuccess: () => void;
}

interface SignUpState {
  isLoading: boolean;
  errors?: string[];
  contactFormValues: ContactFormValues;
  shippingFormValues: AddressFormValues;
}

class SignUp extends Component<SignUpProps, SignUpState> {
  static navigatorStyle: NavigatorStyle = navBarHide;
  static leftButtons: NavButton[] = [backButton];
  fieldOptions: any;
  screen: any;
  contactForm: any;
  addressForm: any;

  constructor(props: SignUpProps) {
    super(props);

    this.state = {
      isLoading: false,
      contactFormValues: {},
      shippingFormValues: {
        receiveEmail: true
      }
    };
  }

  render(): JSX.Element {
    const { navigator } = this.props;

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        needInSafeArea={true}
        style={styles.screenContainer}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled'
        }}
        navigator={navigator}
      >
        {this.props.dismissible && (
          <View style={styles.dismissButtonContainer}>
            <TouchableOpacity style={styles.dismissButton} onPress={this.onDismiss}>
              <Image source={cancelIcon} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={[GlobalStyle.h1, styles.headerTitle]}>
              {translate.string(translationKeys.account.actions.signUp.headerCallout)}
            </Text>
          </View>
          {this.renderSignUpForm()}
        </View>
      </PSScreenWrapper>
    );
  }

  renderHeaderItem = (item: any) => {
    return (
      <View style={styles.headerTextContainer}>
        <Image source={checkIcon} style={styles.checkIcon} />
        <Text style={styles.headerText}>{item.item}</Text>
      </View>
    );
  }

  headerKeyExtractor = (item: any, index: number) => {
    return (item.key = `${index}`);
  }

  renderSignUpForm = () => {
    return (
      <View>
        {this.renderFormErrors()}
        <View style={styles.formHeaderContainer}>
          <Text style={styles.formHeader}>
            {translate.string(translationKeys.account.actions.signUp.contactFormHeader)}
          </Text>
        </View>
        <ContactInfoForm
          updateFormRef={this.updateFormRef('contactForm')}
          onChange={this.updateFormValues('contactFormValues')}
          values={this.state.contactFormValues}
          hiddenFields={['specials']}
          optionalFields={['age', 'gender']}
        />
        <View style={styles.formHeaderContainer}>
          <Text style={styles.formHeader}>
            {translate.string(translationKeys.account.actions.signUp.shippingFormHeader)}
          </Text>
        </View>
        <PSAddressForm
          updateFormRef={this.updateFormRef('addressForm')}
          onChange={this.updateFormValues('shippingFormValues')}
          values={this.state.shippingFormValues}
          optionalFields={[
            'addressName',
            'firstName',
            'lastName',
            'phone',
            'addressField1',
            'countryCode',
            'address1',
            'city',
            'stateCode',
            'postalCode'
          ]}
          hiddenFields={['email']}
        />
        <PSButton
          title={translate.string(translationKeys.account.actions.signUp.actionBtn)}
          onPress={this.signUp}
          style={styles.button}
          loading={this.state.isLoading}
        />
      </View>
    );
  }

  renderFormErrors = () => {
    const { errors } = this.state;
    if (!Array.isArray(errors) || errors.length === 0) {
      return;
    }

    const msgs = errors.map((error, index) => {
      return (
        <Text key={index} style={styles.errorText}>
          {error}
        </Text>
      );
    });

    return <View style={styles.errorContainer}>{msgs}</View>;
  }

  updateFormValues = (targetKey: any) => {
    return (values: any) => {
      const changes = { [targetKey]: values } as any;

      // Sync first name and last name between forms
      if (targetKey === 'contactFormValues') {
        changes.shippingFormValues = {
          ...this.state.shippingFormValues,
          ...{
            firstName: values.firstName,
            lastName: values.lastName
          }
        };
      } else if (targetKey === 'shippingFormValues') {
        changes.contactFormValues = {
          ...this.state.contactFormValues,
          ...{
            firstName: values.firstName,
            lastName: values.lastName
          }
        };
      }

      this.setState(changes);
    };
  }

  updateFormRef = (formKey: any) => {
    return (ref: any) => {
      (this as any)[formKey] = ref;
    };
  }

  focusField = (path: string[], form: any) => {
    const field = form.getComponent(path);
    const ref = field && field.refs && field.refs.input;
    if (ref && ref.focus) {
      ref.focus();
    } else if (ref.openModal) {
      ref.openModal();
    } else {
      console.warn(`Field ${path.join('.')} cannot be focused`);
    }
  }

  validateForms = () => {
    this.setState({ errors: [] });
    const contactFormErrors = this.contactForm.validate().errors;
    const addressFormErrors = this.addressForm.validate().errors;

    if (contactFormErrors.length > 0) {
      const firstError = contactFormErrors[0];
      this.focusField(firstError.path, this.contactForm);
      return false;
    }

    if (addressFormErrors.length > 0) {
      const firstError = addressFormErrors[0];
      this.focusField(firstError.path, this.addressForm);
      return false;
    }

    return true;
  }

  signUp = async () => {
    const formsValid = this.validateForms();
    if (!formsValid) {
      return;
    }

    const { contactFormValues, shippingFormValues } = this.state;
    const account = {
      ...contactFormValues,
      addresses: [
        {
          id: '',
          preferred: true,
          ...shippingFormValues
        }
      ],
      receiveEmail: shippingFormValues.receiveEmail,
      login: contactFormValues.email
    } as any;

    try {
      this.setState({ isLoading: true });
      const { email = '', password = '' } = contactFormValues;

      await dataSource.register(account, password);
      await this.promptToStoreCredentials();
      await this.props.signIn(email, password);
      this.signUpFinished();
    } catch (e) {
      let errorMsgs = [translate.string(translationKeys.account.actions.signUp.error)];

      if (e) {
        if (typeof e === 'string') {
          errorMsgs = [e];
        } else if (
          e.response &&
          e.response.data &&
          e.response.data.error &&
          e.response.data.error.message
        ) {
          errorMsgs = e.response.data.error.message;
        }
      }

      errorMsgs = Array.isArray(errorMsgs) ? errorMsgs : [errorMsgs];
      this.setState({ errors: errorMsgs });
      Alert.alert('', errorMsgs.join('\n'));
    } finally {
      this.setState({ isLoading: false });
    }
  }

  promptToStoreCredentials = async () => {
    return new Promise<void | string>(async (resolve, reject) => {
      if (Platform.OS !== 'ios') {
        return resolve();
      }

      let touchIdSupported = false;
      try {
        touchIdSupported = !!await TouchId.isSupported();
      } catch (e) {
        touchIdSupported = false;
      }

      if (!touchIdSupported) {
        return resolve();
      }

      Alert.alert(
        translate.string(translationKeys.account.actions.storeAccount.promptText),
        undefined,
        [{
          text: translate.string(translationKeys.account.actions.storeAccount.cancelBtn),
          onPress: resolve
        }, {
          text: translate.string(translationKeys.account.actions.storeAccount.confirmBtn),
          onPress: () => {
            this.storeCredentials()
              .then(resolve)
              .catch(e => {
                console.warn('Error storing credentials', e);
                reject(translate.string(translationKeys.account.actions.storeAccount.error));
              });
          }
        }]
      );
    });
  }

  storeCredentials = async () => {
    const { email, password } = this.state.contactFormValues;
    if (!email || !password) {
      return;
    }
    await this.props.saveCredentials(email, password);
  }

  signUpFinished = () => {
    const { onSignUpSuccess } = this.props;
    if (onSignUpSuccess) {
      onSignUpSuccess();
    } else {
      console.warn('No onSignUpSuccess handler for Sign Up');
    }
  }

  onDismiss = () => {
    const { onDismiss } = this.props;
    if (onDismiss) {
      onDismiss();
    } else {
      console.warn('No onDismiss handler for Sign Up');
    }
  }
}
export default withAccount(SignUp);
