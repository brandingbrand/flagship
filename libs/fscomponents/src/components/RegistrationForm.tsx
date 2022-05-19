import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { emailRegex } from '../lib/email';

import { Button } from './Button';
import { Form } from './Form';

// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('@brandingbrand/tcomb-form-native');

const componentTranslationKeys = translationKeys.flagship.registration;

export interface RegistrationFormState {
  value: any;
}

export interface RegistrationFormProps {
  fieldsStyleConfig?: any; // the custom stylesheet we want to merge with the default stylesheet
  onSubmit?: (value: unknown) => void; // the behaviour we want onpress of submit button
  submitButtonStyle?: unknown;
  submitTextStyle?: unknown;
  submitText?: unknown; // Text to override the submit button
  style?: unknown;
  fieldsOptions?: any; // any extra desired behaviour, like placeholders
  value?: unknown;
}

// check for validity as part of the type
const EmailType = t.refinement(t.String, (str: string) => emailRegex.test((str || '').trim()));

EmailType.getValidationErrorMessage = (s: string) => {
  if (!s) {
    return FSI18n.string(componentTranslationKeys.form.emailAddress.error.missing);
  }
  return FSI18n.string(componentTranslationKeys.form.emailAddress.error.invalid);
};

// check for minimum password length of 6
const PasswordType = t.refinement(t.String, (str: string) => str.length >= 6);

const styles = StyleSheet.create({
  defaultButtonStyle: {
    backgroundColor: '#867CDD',
    borderColor: '#473BC7',
    borderRadius: 5,
  },
});

export class RegistrationForm extends Component<RegistrationFormProps, RegistrationFormState> {
  constructor(props: RegistrationFormProps) {
    super(props);

    this.state = { value: props.value };

    const ConfirmPasswordType = t.refinement(
      t.String,
      (value: string) => value === this.state.value.password
    );

    ConfirmPasswordType.getValidationErrorMessage = (s: string) =>
      FSI18n.string(componentTranslationKeys.errors.password.mismatch);

    PasswordType.getValidationErrorMessage = (s: string) => {
      if (s.length < 6) {
        return FSI18n.string(componentTranslationKeys.errors.password.tooShort, {
          characterCount: 6,
        });
      }
      return FSI18n.string(componentTranslationKeys.errors.password.invalid);
    };

    this.fieldsTypes = t.struct({
      firstName: t.String,
      lastName: t.String,
      emailAddress: EmailType,
      password: PasswordType,
      confirmPassword: ConfirmPasswordType,
    });

    this.fieldsOptions = {
      firstName: {
        label: FSI18n.string(componentTranslationKeys.form.firstName.label),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        onSubmitEditing: () => {
          this.focusField('lastName');
        },
        error: FSI18n.string(componentTranslationKeys.form.firstName.error),
      },
      lastName: {
        label: FSI18n.string(componentTranslationKeys.form.lastName.label),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        onSubmitEditing: () => {
          this.focusField('emailAddress');
        },
        error: FSI18n.string(componentTranslationKeys.form.lastName.error),
      },
      emailAddress: {
        label: FSI18n.string(componentTranslationKeys.form.emailAddress.label),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        keyboardType: 'email-address',
        onSubmitEditing: () => {
          this.focusField('password');
        },
        error: FSI18n.string(componentTranslationKeys.form.emailAddress.error.invalid),
      },
      password: {
        label: FSI18n.string(componentTranslationKeys.form.password.label),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        onSubmitEditing: () => {
          this.focusField('confirmPassword');
        },
        secureTextEntry: true,
        onChange: (e: any) => {
          const currentVal = this.state.value;
          const newVal = { ...currentVal, password: e.nativeEvent.text };
          this.setState({
            value: newVal,
          });
        },
      },
      confirmPassword: {
        label: FSI18n.string(componentTranslationKeys.form.confirmPassword.label),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        secureTextEntry: true,
      },
      ...props.fieldsOptions,
    };

    // configure custom styles
    this.fieldsStyleConfig = {
      textbox: {
        normal: {
          borderRadius: 15,
          fontSize: 12,
          // color for text inside box - default is black
          color: '#000',
        },
        error: {
          borderRadius: 15,
          fontSize: 12,
          // color for text inside box - default is red
          color: '#7f0000',
        },
      },
      errorBlock: {
        fontSize: 11,
      },
      ...props.fieldsStyleConfig,
    };
  }

  private form: Form | null = null;
  private readonly fieldsStyleConfig: unknown;
  private readonly fieldsTypes: unknown;
  private readonly fieldsOptions: unknown;

  private readonly handleSubmit = () => {
    const value = this.form?.getValue();
    if (value && this.props.onSubmit) {
      this.props.onSubmit(value);
    }
  };

  private readonly focusField = (fieldName: string) => {
    const field = this.form?.getComponent(fieldName);

    const ref = field.refs.input;
    if (ref.focus) {
      ref.focus();
    }
  };

  private readonly handleChange = (value: unknown) => {
    this.setState({
      value,
    });
  };

  public componentDidMount(): void {
    console.warn(
      'RegistrationForm is deprecated and will be removed in the next version of Flagship.'
    );
  }

  public render(): JSX.Element {
    return (
      <View>
        <Form
          fieldsOptions={this.fieldsOptions}
          fieldsStyleConfig={this.fieldsStyleConfig}
          fieldsTypes={this.fieldsTypes}
          onChange={this.handleChange}
          ref={(ref) => (this.form = ref)}
          value={this.state.value}
        />
        <Button
          onPress={this.handleSubmit}
          style={styles.defaultButtonStyle}
          title={FSI18n.string(componentTranslationKeys.actions.submit.actionBtn)}
        />
      </View>
    );
  }
}
