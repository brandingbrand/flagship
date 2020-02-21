import React, { Component } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';

// @ts-ignore TODO: Update tcomb-form-native to support typing
import * as t from 'tcomb-form-native';
import { emailRegex } from '../lib/email';
import { Form, FormLabelPosition } from './Form';
import { Button } from './Button';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
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
  value?: any;

  /**
   * Called on form submission
   */
  onSubmit: (value: any) => void;
}

export interface LoginFormState {
  value: any;
}

// check for validity as part of the type
const EmailType = t.refinement(t.String, (str: string) => {
  return emailRegex.test((str || '').trim());
});

EmailType.getValidationErrorMessage = (s: string) => {
  if (!s) {
    return FSI18n.string(componentTranslationKeys.emailReq);
  } else {
    return s + FSI18n.string(componentTranslationKeys.emailNotValid);
  }
};

export class LoginForm extends Component<LoginFormProps, LoginFormState> {
  form: any;
  fieldsStyleConfig: any;
  fieldsTypes: any;
  fieldsOptions: any;
  labelPosition: FormLabelPosition;

  constructor(props: LoginFormProps) {
    super(props);

    this.state = { value: props.value };

    this.fieldsTypes = t.struct({
      emailAddress: EmailType,
      password: t.String
    });

    this.fieldsOptions = {
      emailAddress: {
        label: FSI18n.string(componentTranslationKeys.email),
        placeholder: FSI18n.string(componentTranslationKeys.email),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        keyboardType: 'email-address',
        onSubmitEditing: () => this.focusField('password'),
        error: FSI18n.string(componentTranslationKeys.emailError)
      },
      password: {
        label: FSI18n.string(componentTranslationKeys.password),
        placeholder: FSI18n.string(componentTranslationKeys.password),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        secureTextEntry: true,
        error: FSI18n.string(componentTranslationKeys.passwordError)
      },
      ...props.fieldsOptions
    };

    this.fieldsStyleConfig = {
      ...props.fieldsStyleConfig
    };

    // check for number because FormLabelPosition enum can evaluate to 0 & thus as 'false';
    this.labelPosition = (typeof props.labelPosition === 'number') ?
      props.labelPosition : FormLabelPosition.Inline;
  }

  handleSubmit = () => {
    const value = this.form.getValue();
    if (value && this.props.onSubmit) {
      this.props.onSubmit(value);
    }
  }

  focusField = (fieldName: string) => {
    const field = this.form.getComponent(fieldName);

    const ref = field.refs.input;
    if (ref.focus) {
      ref.focus();
    }
  }

  handleChange = (value: any) => {
    this.setState({
      value
    });
  }

  render(): JSX.Element {
    const { style, submitButtonStyle, submitText } = this.props;

    return (
      <View style={style}>
        <Form
          ref={ref => (this.form = ref)}
          fieldsTypes={this.fieldsTypes}
          fieldsOptions={this.fieldsOptions}
          fieldsStyleConfig={this.fieldsStyleConfig}
          labelPosition={this.labelPosition}
          value={this.state.value}
          onChange={this.handleChange}
        />
        <Button
          title={submitText || FSI18n.string(componentTranslationKeys.submit)}
          onPress={this.handleSubmit}
          style={submitButtonStyle}
        />
      </View>
    );
  }
}
