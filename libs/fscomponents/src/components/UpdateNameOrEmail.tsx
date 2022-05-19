import React, { Component } from 'react';

import type {
  NativeSyntheticEvent,
  StyleProp,
  TextInputFocusEventData,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { emailRegex } from '../lib/email';

import { Button } from './Button';
import { Form } from './Form';

// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('@brandingbrand/tcomb-form-native');

const componentTranslationKeys = translationKeys.flagship.updateNameOrEmail;

export interface UpdateNameOrEmailState {
  value: any;
}

export interface UpdateNameOrEmailProps {
  fieldsStyleConfig?: Record<string, unknown>; // custom stylesheet we want to merge with the default stylesheet
  onSubmit?: <T = unknown>(value: T) => void; // the behavior we want onPress of submit button
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<TextStyle>;
  submitText?: () => string; // Text to override the submit button
  style?: StyleProp<ViewStyle>;
  fieldsOptions?: Record<string, unknown>; // extra desired behavior, like placeholders
  value?: Record<string, unknown>;
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

PasswordType.getValidationErrorMessage = (s: string) => {
  if (!s) {
    return FSI18n.string(componentTranslationKeys.form.password.error.invalid);
  }
  if (s.length < 6) {
    return FSI18n.string(componentTranslationKeys.form.password.error.tooShort);
  }
  return FSI18n.string(componentTranslationKeys.form.password.error.invalid);
};

export class UpdateNameOrEmail extends Component<UpdateNameOrEmailProps, UpdateNameOrEmailState> {
  constructor(props: UpdateNameOrEmailProps) {
    super(props);

    this.state = { value: props.value };

    this.fieldsTypes = t.struct({
      firstName: t.String,
      lastName: t.String,
      emailAddress: EmailType,
      password: PasswordType,
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
        onChange: (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
          const currentVal = this.state.value;
          const newVal = { ...currentVal, password: e.nativeEvent.text };
          this.setState({
            value: newVal,
          });
        },
      },
      ...props.fieldsOptions,
    };

    // configure default styles
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

  private form?: Form | null;
  private readonly fieldsStyleConfig: Record<string, unknown>;
  private readonly fieldsTypes: Record<string, unknown>;
  private readonly fieldsOptions: Record<string, unknown>;

  private readonly handleSubmit = () => {
    const value = this.form?.getValue();
    if (value && this.props.onSubmit) {
      this.props.onSubmit(value);
    }
  };

  private readonly handleChange = (value: string) => {
    this.setState({
      value,
    });
  };

  public focusField = (fieldName: string) => {
    const field = this.form?.getComponent(fieldName);

    const ref = field.refs.input;
    if (ref.focus) {
      ref.focus();
    }
  };

  public componentDidMount(): void {
    console.warn('EmailForm is deprecated and will be removed in the next version of Flagship.');
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
