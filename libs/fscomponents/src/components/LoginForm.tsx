import React, { Component } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { emailRegex } from '../lib/email';

import { Button } from './Button';
import { Form, FormLabelPosition } from './Form';

// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('@brandingbrand/tcomb-form-native');

const componentTranslationKeys = translationKeys.flagship.loginForm;

export interface LoginFormProps {
  /**
   * Form style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Label Position
   */
  labelPosition?: FormLabelPosition;
  /**
   * Form fields style
   */
  fieldsStyleConfig?: any;

  /**
   * Form fields options
   */
  fieldsOptions?: any;

  /**
   * Submit button text styling
   */
  submitTextStyle?: StyleProp<TextStyle>;

  /**
   * Submit button styling
   */
  submitButtonStyle?: StyleProp<ViewStyle>;

  /**
   * Submit button text
   *
   * @default Submit
   */
  submitText?: string;

  /**
   * Initial form field values
   */
  value?: unknown;

  /**
   * Called on form submission
   */
  onSubmit: (value: unknown) => void;
}

export interface LoginFormState {
  value: unknown;
}

// check for validity as part of the type
const EmailType = t.refinement(t.String, (str: string) => emailRegex.test((str || '').trim()));

EmailType.getValidationErrorMessage = (s: string) => {
  if (!s) {
    return FSI18n.string(componentTranslationKeys.emailReq);
  }
  return s + FSI18n.string(componentTranslationKeys.emailNotValid);
};

/**
 * @deprecated
 */
export class LoginForm extends Component<LoginFormProps, LoginFormState> {
  constructor(props: LoginFormProps) {
    super(props);

    this.state = { value: props.value };

    this.fieldsTypes = t.struct({
      emailAddress: EmailType,
      password: t.String,
    });

    this.fieldsOptions = {
      emailAddress: {
        label: FSI18n.string(componentTranslationKeys.email),
        placeholder: FSI18n.string(componentTranslationKeys.email),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        keyboardType: 'email-address',
        onSubmitEditing: () => {
          this.focusField('password');
        },
        error: FSI18n.string(componentTranslationKeys.emailError),
      },
      password: {
        label: FSI18n.string(componentTranslationKeys.password),
        placeholder: FSI18n.string(componentTranslationKeys.password),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        secureTextEntry: true,
        error: FSI18n.string(componentTranslationKeys.passwordError),
      },
      ...props.fieldsOptions,
    };

    this.fieldsStyleConfig = {
      ...props.fieldsStyleConfig,
    };

    // check for number because FormLabelPosition enum can evaluate to 0 & thus as 'false';
    this.labelPosition =
      typeof props.labelPosition === 'number' ? props.labelPosition : FormLabelPosition.Inline;
  }

  private form: Form<unknown> | null = null;
  private readonly fieldsStyleConfig: unknown;
  private readonly fieldsTypes: unknown;
  private readonly fieldsOptions: unknown;
  private readonly labelPosition: FormLabelPosition;

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
    console.warn('LoginForm is deprecated and will be removed in the next version of Flagship.');
  }

  public render(): JSX.Element {
    const { style, submitButtonStyle, submitText } = this.props;

    return (
      <View style={style}>
        <Form
          fieldsOptions={this.fieldsOptions}
          fieldsStyleConfig={this.fieldsStyleConfig}
          fieldsTypes={this.fieldsTypes}
          labelPosition={this.labelPosition}
          onChange={this.handleChange}
          ref={(ref) => (this.form = ref)}
          value={this.state.value}
        />
        <Button
          onPress={this.handleSubmit}
          style={submitButtonStyle}
          title={submitText || FSI18n.string(componentTranslationKeys.submit)}
        />
      </View>
    );
  }
}
