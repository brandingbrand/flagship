import React, { Component } from 'react';

import { emailRegex } from '../lib/email';
// @ts-ignore TODO: Update tcomb-form-native to support typing
import * as t from 'tcomb-form-native';
import { SingleLineForm } from './SingleLineForm';
import { FormLabelPosition } from './Form';

export interface EmailFormValue {
  email: string;
}

export interface EmailFormProps {
  fieldsStyleConfig?: any;
  labelPosition?: FormLabelPosition;
  onSubmit?: (value: EmailFormValue) => void;
  submitButtonStyle?: any;
  submitTextStyle?: any;
  submitText?: any;
  value?: EmailFormValue;
  style?: any;
  fieldsOptions?: any;
}

const EmailType = t.refinement(t.String, (str: string) => {
  return emailRegex.test((str || '').trim());
});

export class EmailForm extends Component<EmailFormProps> {
  fieldsTypes: any;
  fieldsOptions: any;
  labelPosition: FormLabelPosition;

  constructor(props: EmailFormProps) {
    super(props);

    this.fieldsTypes = t.struct({
      email: EmailType
    });

    this.fieldsOptions = {
      email: {
        placeholder: 'Email',
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        keyboardType: 'email-address',
        error: 'Required Field'
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
