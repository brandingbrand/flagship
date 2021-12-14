import React, { Component } from 'react';

import { emailRegex } from '../lib/email';
// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('@brandingbrand/tcomb-form-native');
import { SingleLineForm } from './SingleLineForm';
import { FormLabelPosition } from './Form';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.emailForm;

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

  componentDidMount(): void {
    console.warn('EmailForm is deprecated and will be removed in the next version of Flagship.');
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
