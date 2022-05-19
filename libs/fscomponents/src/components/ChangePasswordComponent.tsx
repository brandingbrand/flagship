import React, { Component } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { Button } from './Button';
import { Form } from './Form';

// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('@brandingbrand/tcomb-form-native');

const componentTranslationKeys = translationKeys.flagship.changePassword;

export interface ChangePasswordState {
  value: Partial<{ password: string }>;
}

export interface FormValues {
  currentPassword: string;
  confirmPassword: string;
  newPassword: string;
}

export interface ChangePasswordProps {
  // the custom stylesheet we want to merge with the default stylesheet
  fieldsStyleConfig?: Record<string, unknown>;
  onSubmit?: (values: FormValues) => void; // the behavior we want onpress of submit button
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<TextStyle>;
  submitText?: string; // Text to override the submit button
  style?: StyleProp<ViewStyle>;
  fieldsOptions?: Record<string, unknown>; // any extra desired behavior, like placeholders
  value?: Partial<{ password: string }>;
}

// check for minimum password length of 6
const PasswordType = t.refinement(t.String, (str: string) => str.length >= 6);

export class ChangePassword extends Component<ChangePasswordProps, ChangePasswordState> {
  constructor(props: ChangePasswordProps) {
    super(props);

    this.state = { value: props.value ?? {} };

    const ConfirmPasswordType = t.refinement(
      t.String,
      (value: string) => value === this.state.value.password
    );

    ConfirmPasswordType.getValidationErrorMessage = (s: string) =>
      FSI18n.string(componentTranslationKeys.form.errors.password.mismatch);

    PasswordType.getValidationErrorMessage = (s: string) => {
      if (s.length < 6) {
        return FSI18n.string(componentTranslationKeys.form.errors.password.tooShort, {
          minCharacters: 6,
        });
      }
      return FSI18n.string(componentTranslationKeys.form.errors.password.invalid);
    };

    this.fieldsTypes = t.struct({
      currentPassword: PasswordType,
      newPassword: PasswordType,
      confirmPassword: ConfirmPasswordType,
    });

    this.fieldsOptions = {
      currentPassword: {
        label: FSI18n.string(componentTranslationKeys.form.currentPassword.label),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        onSubmitEditing: () => {
          this.focusField('newPassword');
        },
        secureTextEntry: true,
      },
      newPassword: {
        label: FSI18n.string(componentTranslationKeys.form.newPassword.label),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        onSubmitEditing: () => {
          this.focusField('confirmPassword');
        },
        secureTextEntry: true,
        onChange: (e: { nativeEvent: { text: string } }) => {
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
  } // end constructor

  public form?: Form | null;
  public fieldsStyleConfig: Record<string, unknown>;
  public fieldsTypes: Record<string, unknown>;
  public fieldsOptions: Record<string, unknown>;

  private readonly handleSubmit = (): void => {
    const value = this.form?.getValue();
    if (value && this.props.onSubmit) {
      this.props.onSubmit(value);
    }
  };

  private readonly focusField = (fieldName: string): void => {
    const field = this.form?.getComponent(fieldName);

    const ref = field.refs.input;
    if (ref.focus) {
      ref.focus();
    }
  };

  private readonly handleChange = (value: { password?: string }): void => {
    this.setState({
      value,
    });
  };

  public componentDidMount(): void {
    console.warn(
      'ChangePasswordComponent is deprecated and will be removed in the next version of Flagship.'
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
          style={{ backgroundColor: '#867CDD', borderRadius: 5, borderColor: '#473BC7' }}
          title={FSI18n.string(componentTranslationKeys.actions.submit.actionBtn)}
        />
      </View>
    );
  }
}
