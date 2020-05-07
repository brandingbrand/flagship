import React, { Component } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInputFocusEventData,
  View,
  ViewStyle
} from 'react-native';

// @ts-ignore TODO: Update tcomb-form-native to support typing
import * as t from 'tcomb-form-native';
import { emailRegex } from '../lib/email';
import { Form } from './Form';
import { Button } from './Button';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
import {Dictionary} from '@brandingbrand/fsfoundation';
const componentTranslationKeys = translationKeys.flagship.registration;

export interface RegistrationFormState {
  value: any;
}

export interface RegistrationFormProps {
  fieldsStyleConfig?: Dictionary; // custom stylesheet we want to merge with the default stylesheet
  onSubmit?: <T>(value: T) => void; // the behaviour we want onpress of submit button
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<ViewStyle>;
  submitText?: () => void; // Text to override the submit button
  style?: StyleProp<ViewStyle>;
  fieldsOptions?: Dictionary; // extra desired behaviour, like placeholders
  value?: string;
}

// check for validity as part of the type
const EmailType = t.refinement(t.String, (str: string) => {
  return emailRegex.test((str || '').trim());
});

EmailType.getValidationErrorMessage = (s: string) => {
  if (!s) {
    return FSI18n.string(componentTranslationKeys.form.emailAddress.error.missing);
  } else {
    return FSI18n.string(componentTranslationKeys.form.emailAddress.error.invalid);
  }
};

// check for minimum password length of 6
const PasswordType = t.refinement(t.String, (str: string) => {
  return str.length >= 6;
});

const styles = StyleSheet.create({
  defaultButtonStyle: {
    backgroundColor: '#867CDD',
    borderRadius: 5,
    borderColor: '#473BC7'
  }
});

export class RegistrationForm extends Component<RegistrationFormProps, RegistrationFormState> {
  form?: Form | null;
  fieldsStyleConfig: Dictionary;
  fieldsTypes: Dictionary;
  fieldsOptions: Dictionary;

  constructor(props: RegistrationFormProps) {
    super(props);

    this.state = { value: props.value };

    const ConfirmPasswordType = t.refinement(t.String, (value: string) => {
      return value === this.state.value.password;
    });

    ConfirmPasswordType.getValidationErrorMessage = () => {
      return FSI18n.string(componentTranslationKeys.errors.password.mismatch);
    };

    PasswordType.getValidationErrorMessage = (s: string) => {
      if (s?.length < 6) {
        return FSI18n.string(componentTranslationKeys.errors.password.tooShort, {
          characterCount: 6
        });
      } else {
        return FSI18n.string(componentTranslationKeys.errors.password.invalid);
      }
    };

    this.fieldsTypes = t.struct({
      firstName: t.String,
      lastName: t.String,
      emailAddress: EmailType,
      password: PasswordType,
      confirmPassword: ConfirmPasswordType
    });

    this.fieldsOptions = {
      firstName: {
        label: FSI18n.string(componentTranslationKeys.form.firstName.label),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        onSubmitEditing: () => this.focusField('lastName'),
        error: FSI18n.string(componentTranslationKeys.form.firstName.error)
      },
      lastName: {
        label: FSI18n.string(componentTranslationKeys.form.lastName.label),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        onSubmitEditing: () => this.focusField('emailAddress'),
        error: FSI18n.string(componentTranslationKeys.form.lastName.error)
      },
      emailAddress: {
        label: FSI18n.string(componentTranslationKeys.form.emailAddress.label),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        keyboardType: 'email-address',
        onSubmitEditing: () => this.focusField('password'),
        error: FSI18n.string(componentTranslationKeys.form.emailAddress.error.invalid)
      },
      password: {
        label: FSI18n.string(componentTranslationKeys.form.password.label),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        onSubmitEditing: () => this.focusField('confirmPassword'),
        secureTextEntry: true,
        onChange: (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
          const currentVal = this.state.value;
          const newVal = { ...currentVal, password: e.nativeEvent.text };
          this.setState({
            value: newVal
          });
        }
      },
      confirmPassword: {
        label: FSI18n.string(componentTranslationKeys.form.confirmPassword.label),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        secureTextEntry: true
      },
      ...props.fieldsOptions
    };

    // configure custom styles
    this.fieldsStyleConfig = {
      textbox: {
        normal: {
          borderRadius: 15,
          fontSize: 12,
          // color for text inside box - default is black
          color: '#000'
        },
        error: {
          borderRadius: 15,
          fontSize: 12,
          // color for text inside box - default is red
          color: '#7f0000'
        }
      },
      errorBlock: {
        fontSize: 11
      },
      ...props.fieldsStyleConfig
    };

  } // end constructor

  handleSubmit = () => {
    const value = this.form?.getValue();
    if (value && this.props.onSubmit) {
      this.props.onSubmit(value);
    }
  }

  focusField = (fieldName: string) => {
    const field = this.form?.getComponent(fieldName);

    const ref = field.refs.input;
    if (ref.focus) {
      ref.focus();
    }
  }

  handleChange = (value: string) => {
    this.setState({
      value
    });
  }

  render(): JSX.Element {
    return (
      <View>
        <Form
          ref={ref => (this.form = ref)}
          fieldsTypes={this.fieldsTypes}
          fieldsOptions={this.fieldsOptions}
          fieldsStyleConfig={this.fieldsStyleConfig}
          value={this.state.value}
          onChange={this.handleChange}
        />
        <Button
          title={FSI18n.string(componentTranslationKeys.actions.submit.actionBtn)}
          onPress={this.handleSubmit}
          style={styles.defaultButtonStyle}
        />
      </View>
    );
  }
}
