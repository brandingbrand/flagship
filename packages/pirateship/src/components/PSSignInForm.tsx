import React, { Component } from 'react';
import { Form } from '@brandingbrand/fscomponents';
// @ts-ignore TODO: Add types for tcomb-form-native
import * as t from 'tcomb-form-native';
import { merge } from 'lodash-es';
import TouchId from 'react-native-touch-id';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { EMAIL_REGEX } from '../lib/constants';
import { textboxWithRightIcon } from '../lib/formTemplate';
import formFieldStyles from '../styles/FormField';
import translate, { translationKeys } from '../lib/translations';
import * as variables from '../styles/variables';

import PSButton from './PSButton';

const touchIdIcon = require('../../assets/images/touchId.png');
const faceIdIcon = require('../../assets/images/faceId.png');
const authPromptText = Platform.OS === 'ios' ? 'to sign in' : 'Confirm fingerprint to continue';
const noop = () => undefined;

const styles = StyleSheet.create({
  formContainer: {
    borderTopColor: variables.border.color,
    borderTopWidth: 1
  },
  button: {
    margin: variables.padding.base
  },
  forgotPasswordButton: {
    height: 20
  },
  errorContainer: {
    backgroundColor: variables.palette.surface,
    padding: variables.padding.base
  },
  errorText: {
    fontWeight: 'bold',
    color: variables.palette.error
  }
});

export interface CustomFormField {
  validator?: (value: string) => boolean;
  errorMessageHandler?: (value: string) => string;
  options?: object;
}

export interface FormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface PSSignInProps {
  signIn: (email: string, password: string) => Promise<boolean>;
  forgotPassword: () => void;
  saveCredentials: (email: string, password: string) => Promise<void>;
  getCredentials: () => Promise<{ email: string; password: string }>;
  emailType?: CustomFormField;
  passwordType?: CustomFormField;
  // see https://github.com/gcanti/tcomb-form-native/blob/master/docs/STYLESHEETS.md
  // for more info about fieldStyles
  fieldStyles?: { [key: string]: any };
  signInButtonText?: string;
  onNav?: (handler: (event: any) => void) => void;
  runBioAuthImmediately?: boolean;
}

export interface PSSignInState {
  isLoading: boolean;
  hidePassword: boolean;
  errors: string[];
  values: FormValues;
  biometricAuthSupported: boolean;
  biometricIcon?: Image;
}

export default class PSSignInForm extends Component<
  PSSignInProps,
  PSSignInState
> {
  // TODO: Update these when we add tcomb-form-native types
  private fieldOptions: { [key: string]: any };
  private fieldStyles: { [key: string]: any };
  private fields: { [key: string]: any };
  private form: any;

  constructor(props: PSSignInProps) {
    super(props);

    this.state = {
      isLoading: false,
      hidePassword: true,
      biometricAuthSupported: false,
      errors: [],
      values: {
        email: '',
        password: '',
        rememberMe: false
      }
    };

    if (!this.props.runBioAuthImmediately && typeof props.onNav === 'function') {
      props.onNav(this.onNavigatorEvent);
    }

    this.fieldStyles = this.getFormFieldStyles();
    this.fields = this.getFormFields();
    this.fieldOptions = this.getFormFieldOptions(this.fieldStyles);
    this.checkBiometricAuthSupport()
      .then(noop)
      .catch(noop);
  }

  componentDidMount(): void {
    if (this.props.runBioAuthImmediately) {
      this.triggerSavedLogin();
    }
  }

  onNavigatorEvent = (event: any): void => {
    if (event.id === 'didAppear') {
      this.triggerSavedLogin();

      if (typeof this.props.onNav === 'function') {
        this.props.onNav(noop);
      }
    }
  }

  triggerSavedLogin = (): void => {
    this.useSavedLogin()
      .then(noop)
      .catch(noop);
  }

  getFormFieldStyles = () => {
    return merge(
      {},
      formFieldStyles,
      this.props.fieldStyles
    );
  }

  getFormFields = () => {
    const emailFieldDefaults = {
      validator: (value: string) => EMAIL_REGEX.test((value || '').trim()),
      errorMessageHandler: (value: string) => {
        if (!value) {
          return `Email is required`;
        } else {
          return `Please enter a valid email address`;
        }
      }
    };
    const emailField = { ...emailFieldDefaults, ...this.props.emailType };
    const EmailType = t.refinement(t.String, emailField.validator);
    EmailType.getValidationErrorMessage = emailField.errorMessageHandler;

    const passwordFieldDefaults = {
      validator: (value: string) => value.length >= 6,
      errorMessageHandler: (value: string) => {
        if (!value) {
          return `Password is required`;
        } else {
          return `Your password is not long enough`;
        }
      }
    };
    const passwordField = {
      ...passwordFieldDefaults,
      ...this.props.passwordType
    };
    const PasswordType = t.refinement(t.String, passwordField.validator);
    PasswordType.getValidationErrorMessage = passwordField.errorMessageHandler;

    return t.struct({
      email: EmailType,
      password: PasswordType,
      rememberMe: t.Boolean
    });
  }

  getFormFieldOptions = (fieldStyles: { [key: string]: any }): { [key: string]: any } => {
    const fieldOptions = {
      email: {
        template: textboxWithRightIcon,
        placeholder: 'Required',
        placeholderTextColor: variables.color.gray,
        returnKeyType: 'next',
        autoCorrect: false,
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        onSubmitEditing: () => this.focusField('password')
      },
      password: {
        template: textboxWithRightIcon,
        config: {
          onIconPress: () => {
            this.useSavedLogin()
              .then(noop)
              .catch(noop);
          },
          icon: this.state.biometricIcon,
          showIcon: this.state.biometricAuthSupported
        },
        placeholder: 'Required',
        placeholderTextColor: variables.color.gray,
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        secureTextEntry: this.state.hidePassword,
        password: true
      },
      rememberMe: {
        hidden: !this.state.biometricAuthSupported,
        label: 'Remember Me',
        onTintColor: variables.palette.secondary,
        // Android changes the color of the thumb switch when toggled on to be a conflicting green
        thumbTintColor: Platform.OS === 'android' ? variables.palette.surface : undefined,
        stylesheet: merge({}, t.form.Form.stylesheet, fieldStyles, {
          formGroup: {
            normal: {
              backgroundColor: variables.palette.surface,
              paddingTop: variables.padding.base,
              paddingBottom: variables.padding.base,
              borderBottomWidth: 0
            }
          },
          controlLabel: {
            normal: {
              fontWeight: 'normal'
            }
          }
        })
      }
    };

    if (this.props.emailType && this.props.emailType.options) {
      merge(fieldOptions.email, this.props.emailType.options);
    }
    if (this.props.passwordType && this.props.passwordType.options) {
      merge(fieldOptions.password, this.props.passwordType.options);
    }

    return fieldOptions;
  }

  render(): JSX.Element {
    const { isLoading } = this.state;
    this.fieldOptions = t.update(this.fieldOptions, {
      password: {
        secureTextEntry: {
          $set: this.state.hidePassword
        },
        config: {
          icon: {
            $set: this.state.biometricIcon
          },
          showIcon: {
            $set: this.state.biometricAuthSupported
          }
        }
      },
      rememberMe: {
        hidden: {
          $set: !this.state.biometricAuthSupported
        }
      }
    });

    return (
      <View>
        {this.renderErrors()}
        <View style={styles.formContainer}>
          <Form
            ref={this.updateFormRef}
            fieldsTypes={this.fields}
            fieldsOptions={this.fieldOptions}
            fieldsStyleConfig={this.fieldStyles}
            value={this.state.values}
            onChange={this.updateFormValues}
          />
          <PSButton
            title={this.props.signInButtonText || 'Sign In'}
            onPress={this.handleSignInPress}
            loading={isLoading}
            style={styles.button}
          />
          <PSButton
            title={translate.string(translationKeys.account.actions.forgotPassword.actionBtn)}
            onPress={this.props.forgotPassword}
            link
            style={[styles.button, styles.forgotPasswordButton]}
          />
        </View>
      </View>
    );
  }

  renderErrors = () => {
    const { errors } = this.state;
    if (!Array.isArray(errors) || errors.length === 0) {
      return;
    }

    const errorMsgs = errors.map((error, index) => {
      return (
        <Text style={styles.errorText} key={index}>
          {error}
        </Text>
      );
    });

    return <View style={styles.errorContainer}>{errorMsgs}</View>;
  }

  updateFormValues = (values: FormValues) => {
    this.setState({ values });
  }

  updateFormRef = (ref: any) => {
    this.form = ref;
  }

  focusField = (fieldName: string) => {
    const field = this.form.getComponent(fieldName);

    const ref = field.refs.input;
    if (ref.focus) {
      ref.focus();
    }
  }

  handleSignInPress = async () => {
    this.setState({ errors: [] });
    const { errors } = this.form.validate();

    if (errors.length > 0) {
      return;
    }

    const { saveCredentials } = this.props;
    const { values, biometricAuthSupported } = this.state;
    const { email, password, rememberMe } = values;

    try {
      this.setState({ isLoading: true });
      const loginSuccess = await this.props.signIn(email, password);
      if (loginSuccess && rememberMe && biometricAuthSupported) {
        await saveCredentials(email, password);
      }
    } catch (errors) {
      if (!Array.isArray(errors)) {
        console.warn('Error signing in', errors);
      }

      this.setState({ errors });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  checkBiometricAuthSupport = async () => {
    let isSupported;
    let icon;

    // Disable biometric auth support for non-iOS devices since
    // react-native-touch-id 4.0.1 causes crashes on older Android devices.
    // See: https://github.com/naoufal/react-native-touch-id/pull/96
    if (Platform.OS !== 'ios') {
      return;
    }

    try {
      const supportedTypes = await TouchId.isSupported();
      isSupported = !!supportedTypes;
      icon = await this.getBiometricIcon(supportedTypes);

    } catch (e) {
      isSupported = false;
    }

    this.setState({
      biometricAuthSupported: isSupported,
      biometricIcon: icon
    });
  }

  getBiometricIcon = async (authType: string | boolean | TouchId.TouchIDError) => {
    return this.props.getCredentials()
      .then(({ email, password }) => {
        if (!email || !password) {
          return undefined;
        }

        switch (authType) {
          case 'FaceID':
            return faceIdIcon;
          case 'TouchID':
          case true: // android only returns a boolean
            return touchIdIcon;
          default:
            return undefined;
        }
      })
      .catch(() => undefined);
  }

  authenticateBiometrically = async () => {
    // Disable biometric auth support for non-iOS devices since
    // react-native-touch-id 4.0.1 causes crashes on older Android devices.
    // See: https://github.com/naoufal/react-native-touch-id/pull/96
    if (Platform.OS !== 'ios') {
      return false;
    }

    try {
      const success = await TouchId.authenticate(authPromptText, {
        title: 'Authentication Required',
        color: variables.palette.secondary
      });
      return !!success;
    } catch (e) {
      return false;
    }
  }

  useSavedLogin = async () => {
    const { getCredentials, signIn } = this.props;
    const { email, password } = await getCredentials();

    if (!email || !password) {
      return;
    }

    const biometricAuthenticated = await this.authenticateBiometrically();
    if (!biometricAuthenticated) {
      return;
    }

    this.setState({ isLoading: true });
    await signIn(email, password);
    this.setState({ isLoading: false });
  }
}
