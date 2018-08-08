import { backButton } from '../lib/navStyles';
import { navBarHide } from '../styles/Navigation';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// @ts-ignore TODO: Add types for tcomb-form-native
import * as t from 'tcomb-form-native';
import { Form } from '@brandingbrand/fscomponents';
import PSScreenWrapper from '../components/PSScreenWrapper';
import React, { Component } from 'react';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { dataSource } from '../lib/datasource';
import { border, color, fontSize, padding, palette } from '../styles/variables';
import formFieldStyles from '../styles/FormField';
import { EMAIL_REGEX } from '../lib/constants';
import PSButton from '../components/PSButton';
import translate, { translationKeys } from '../lib/translations';
const forgotPasswordTranslations = translationKeys.account.actions.forgotPassword;
const accountImage = require('../../assets/images/account-image.png');
const arrowIcon = require('../../assets/images/arrow.png');

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: palette.surface
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
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
    margin: padding.base,
    marginBottom: 26
  },
  formContainer: {
    alignSelf: 'stretch'
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
  errorContainer: {
    backgroundColor: palette.surface,
    padding: padding.base,
    minHeight: 40
  },
  errorText: {
    fontWeight: 'bold',
    color: palette.error
  },
  divider: {
    height: 1,
    backgroundColor: border.color,
    marginTop: padding.base
  },
  backButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  button: {
    margin: padding.base
  },
  dismissButtonContainer: {
    backgroundColor: palette.surface
  },
  dismissButton: {
    height: 40,
    paddingHorizontal: 10,
    justifyContent: 'center'
  }
});

export interface ForgotPasswordScreenProps extends ScreenProps {
  onDismiss: () => void;
  onSignUpSuccess: () => void;
}

export interface ForgotPasswordState {
  isLoading: boolean;
  resetSent: boolean;
  errors: string[];
  values: FormValues;
}

export interface FormValues {
  email: string;
}

export default class ForgotPassword extends Component<
  ForgotPasswordScreenProps,
  ForgotPasswordState
> {
  static navigatorStyle: NavigatorStyle = navBarHide;
  static leftButtons: NavButton[] = [backButton];
  fieldOptions: any;
  fields: any;
  form: any;

  constructor(props: ForgotPasswordScreenProps) {
    super(props);
    props.navigator.setTitle({
      title: translate.string(translationKeys.screens.forgotPassword.title)
    });

    this.fields = this.getFormFields();
    this.fieldOptions = this.getFormFieldOptions();
    this.state = {
      isLoading: false,
      resetSent: false,
      errors: [],
      values: {
        email: ''
      }
    };
  }

  getFormFields = () => {
    const EmailType = t.refinement(t.String, (value: string) => {
      return EMAIL_REGEX.test((value || '').trim());
    });

    EmailType.getValidationErrorMessage = (value: string) => {
      if (!value) {
        return translate.string(forgotPasswordTranslations.errors.email.missing);
      } else {
        return translate.string(forgotPasswordTranslations.errors.email.invalid);
      }
    };

    return t.struct({
      email: EmailType
    });
  }

  getFormFieldOptions = () => {
    return {
      email: {
        label: translate.string(forgotPasswordTranslations.form.email.label),
        placeholder: translate.string(translationKeys.formPlaceholders.required),
        placeholderTextColor: color.gray,
        returnKeyType: 'next',
        autoCorrect: false,
        keyboardType: 'email-address',
        autoCapitalize: 'none'
      }
    };
  }

  render(): JSX.Element {
    const { navigator } = this.props;
    const { resetSent } = this.state;
    let body;

    if (resetSent) {
      body = this.renderResetSent();
    } else {
      body = this.renderResetForm();
    }

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
        <View style={styles.dismissButtonContainer}>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={this.props.onDismiss}
          >
            <Image source={arrowIcon} />
          </TouchableOpacity>
        </View>
        {body}
      </PSScreenWrapper>
    );
  }

  renderResetSent = () => {
    return (
      <View style={styles.container}>
        <Image source={accountImage} style={styles.accountImage} />
        <View style={styles.headerContainer}>
          <Text style={styles.headerCallout}>
            {translate.string(forgotPasswordTranslations.headerCallout)}
          </Text>
          <Text style={styles.headerText}>
          {translate.string(forgotPasswordTranslations.success)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.backButtonContainer}>
          <PSButton
            titleStyle={styles.signUpText}
            title={translate.string(forgotPasswordTranslations.completedBtn)}
            onPress={this.props.onDismiss}
            style={styles.button}
          />
        </View>
      </View>
    );
  }

  renderResetForm = () => {
    const { isLoading } = this.state;

    return (
      <View style={styles.container}>
        <Image source={accountImage} style={styles.accountImage} />
        <View style={styles.headerContainer}>
          <Text style={styles.headerCallout}>
            {translate.string(forgotPasswordTranslations.headerCallout)}
          </Text>
          <Text style={styles.headerText}>
            {translate.string(forgotPasswordTranslations.instructions)}
          </Text>
        </View>
        <View style={styles.formContainer}>
          {this.renderFormErrors()}
          <Form
            ref={this.updateFormRef}
            fieldsTypes={this.fields}
            fieldsOptions={this.fieldOptions}
            fieldsStyleConfig={formFieldStyles}
            value={this.state.values}
            onChange={this.updateFormValues}
            style={{
              borderTopColor: border.color,
              borderTopWidth: border.width
            }}
          />
          <PSButton
            title={translate.string(forgotPasswordTranslations.actionBtn)}
            onPress={this.resetPassword}
            style={styles.button}
            loading={isLoading}
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
    );
  }

  renderFormErrors = () => {
    const { errors } = this.state;
    const msgs = (errors || []).map((error, index) => {
      return (
        <Text key={index} style={styles.errorText}>{error}</Text>
      );
    });

    return (
      <View style={styles.errorContainer}>
        {msgs}
      </View>
    );
  }

  updateFormValues = (values: FormValues) => {
    this.setState({ values });
  }

  updateFormRef = (ref: any) => {
    this.form = ref;
  }

  resetPassword = async () => {
    this.setState({ errors: [] });
    const { errors } = this.form.validate();

    if (errors.length > 0) {
      return;
    }

    try {
      this.setState({ isLoading: true });
      const { email } = this.state.values;

      await dataSource.forgotPassword(email);
      this.setState({ resetSent: true });

    } catch (e) {
      const response = (e || {}).response;
      let errorMsgs = [translate.string(forgotPasswordTranslations.errors.generic)];

      if (response && response.data && response.data.error && response.data.error.message) {
        errorMsgs = response.data.error.message;
      }

      errorMsgs = Array.isArray(errorMsgs) ? errorMsgs : [errorMsgs];
      this.setState({ errors: errorMsgs });

    } finally {
      this.setState({ isLoading: false });

    }
  }

  signUp = () => {
    const { navigator, onSignUpSuccess } = this.props;

    navigator.push({
      title: translate.string(translationKeys.screens.register.title),
      screen: 'SignUp',
      passProps: {
        dismissible: true,
        onDismiss: () => {
          navigator.pop();
        },
        onSignUpSuccess: () => {
          navigator.pop();
          if (onSignUpSuccess) {
            onSignUpSuccess();
          } else {
            console.warn('No onSignUpSuccess handler for Forgot Password');
          }
        }
      }
    });
  }
}

