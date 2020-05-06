import React, { Component } from 'react';

import { emailRegex } from '../lib/email';
// @ts-ignore TODO: Update tcomb-form-native to support typing
import * as t from 'tcomb-form-native';
import { SingleLineForm } from './SingleLineForm';
import { FormLabelPosition } from './Form';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
import {Dictionary} from '@brandingbrand/fsfoundation';
import {StyleProp, ViewStyle} from 'react-native';
const componentTranslationKeys = translationKeys.flagship.emailForm;

export interface EmailFormValue {
  email: string;
}

export interface EmailFormProps {
  fieldsStyleConfig?: Dictionary;
  labelPosition?: FormLabelPosition;
  onSubmit?: (value: EmailFormValue) => void;
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<ViewStyle>;
  submitText?: StyleProp<ViewStyle>;
  value?: EmailFormValue;
  style?: StyleProp<ViewStyle>;
  fieldsOptions?: Dictionary;
}

const EmailType = t.refinement(t.String, (str: string) => {
  return emailRegex.test((str || '').trim());
});

export class EmailForm extends Component<EmailFormProps> {
  fieldsTypes: Dictionary;
  fieldsOptions: Dictionary;
  labelPosition: FormLabelPosition;

  constructor(props: EmailFormProps) {
    super(props);

    this.fieldsTypes = t.struct({
      email: EmailType
    });

    this.fieldsOptions = {
      email: {
        placeholder: FSI18n.string(componentTranslationKeys.placeholder),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        keyboardType: 'email-address',
        error: FSI18n.string(componentTranslationKeys.error)
      },
      ...props.fieldsOptions
    };

    // check for number because FormLabelPosition enum can evaluate to 0 & thus as 'false';
    this.labelPosition = (typeof props.labelPosition === 'number') ?
      props.labelPosition : FormLabelPosition.Inline;
  }

  render(): JSX.Element {
    return (
      <SingleLineForm
        {...this.props}
        fieldsTypes={this.fieldsTypes}
        fieldsOptions={this.fieldsOptions}
        labelPosition={this.labelPosition}
      />
    );
  }
}
