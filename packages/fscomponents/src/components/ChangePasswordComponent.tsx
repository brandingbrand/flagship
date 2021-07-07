import React, { Component } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('@brandingbrand/tcomb-form-native');
import { Form } from './Form';
import { Button } from './Button';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.changePassword;
import {Dictionary} from '@brandingbrand/fsfoundation';

export interface ChangePasswordState {
  value: any;
}

export interface FormValues {
  currentPassword: string;
  confirmPassword: string;
  newPassword: string;
}

export interface ChangePasswordProps {
  // the custom stylesheet we want to merge with the default stylesheet
  fieldsStyleConfig?: Dictionary;
  onSubmit?: (values: FormValues) => void; // the behaviour we want onpress of submit button
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<TextStyle>;
  submitText?: string; // Text to override the submit button
  style?: StyleProp<ViewStyle>;
  fieldsOptions?: Dictionary; // any extra desired behaviour, like placeholders
  value?: any;
}

// check for minimum password length of 6
const PasswordType = t.refinement(t.String, (str: string) => {
  return str.length >= 6;
});

export class ChangePassword extends Component<ChangePasswordProps, ChangePasswordState> {
  form?: Form | null;
  fieldsStyleConfig: Dictionary;
  fieldsTypes: Dictionary;
  fieldsOptions: Dictionary;

  constructor(props: ChangePasswordProps) {
    super(props);

    this.state = { value: props.value };

    const ConfirmPasswordType = t.refinement(t.String, (value: string) => {
      return value === this.state.value.password;
    });

    ConfirmPasswordType.getValidationErrorMessage = (s: string) => {
      return FSI18n.string(componentTranslationKeys.form.errors.password.mismatch);
    };

    PasswordType.getValidationErrorMessage = (s: string) => {
      if (s.length < 6) {
        return FSI18n.string(componentTranslationKeys.form.errors.password.tooShort, {
          minCharacters: 6
        });
      } else {
        return FSI18n.string(componentTranslationKeys.form.errors.password.invalid);
      }
    };

    this.fieldsTypes = t.struct({
      currentPassword: PasswordType,
      newPassword: PasswordType,
      confirmPassword: ConfirmPasswordType
    });

    this.fieldsOptions = {
      currentPassword: {
        label: FSI18n.string(componentTranslationKeys.form.currentPassword.label),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        onSubmitEditing: () => this.focusField('newPassword'),
        secureTextEntry: true
      },
      newPassword: {
        label: FSI18n.string(componentTranslationKeys.form.newPassword.label),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        onSubmitEditing: () => this.focusField('confirmPassword'),
        secureTextEntry: true,
        onChange: (e: {nativeEvent: {text: string}}) => {
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
          fontSize:  12,
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

  componentDidMount(): void {
    // tslint:disable-next-line:ter-max-len
    console.warn('ChangePasswordComponent is deprecated and will be removed in the next version of Flagship.');
  }

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
          style={{ backgroundColor: '#867CDD', borderRadius: 5, borderColor: '#473BC7' }}
        />
      </View>
    );
  }
}
