import React, { Component } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import { emailRegex } from '../lib/email';

import { FormLabelPosition } from './Form';
import { SingleLineForm } from './SingleLineForm';

// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('@brandingbrand/tcomb-form-native');

const componentTranslationKeys = translationKeys.flagship.emailForm;

export interface EmailFormValue {
  email: string;
}

export interface EmailFormProps {
  fieldsStyleConfig?: any;
  labelPosition?: FormLabelPosition;
  onSubmit?: (value: EmailFormValue) => void;
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<ViewStyle>;
  submitText?: any;
  value?: EmailFormValue;
  style?: StyleProp<ViewStyle>;
  fieldsOptions?: any;
}

const EmailType = t.refinement(t.String, (str: string) => emailRegex.test((str || '').trim()));

/**
 * @deprecated
 */
export class EmailForm extends Component<EmailFormProps> {
  constructor(props: EmailFormProps) {
    super(props);

    this.fieldsTypes = t.struct({
      email: EmailType,
    });

    this.fieldsOptions = {
      email: {
        placeholder: FSI18n.string(componentTranslationKeys.placeholder),
        returnKeyType: 'next',
        autoCorrect: false,
        autoCapitalize: 'none',
        keyboardType: 'email-address',
        error: FSI18n.string(componentTranslationKeys.error),
      },
      ...props.fieldsOptions,
    };

    // check for number because FormLabelPosition enum can evaluate to 0 & thus as 'false';
    this.labelPosition =
      typeof props.labelPosition === 'number' ? props.labelPosition : FormLabelPosition.Inline;
  }

  private readonly fieldsTypes: unknown;
  private readonly fieldsOptions: unknown;
  private readonly labelPosition: FormLabelPosition;

  public componentDidMount(): void {
    console.warn('EmailForm is deprecated and will be removed in the next version of Flagship.');
  }

  public render(): JSX.Element {
    return (
      <SingleLineForm
        {...this.props}
        fieldsOptions={this.fieldsOptions}
        fieldsTypes={this.fieldsTypes}
        labelPosition={this.labelPosition}
      />
    );
  }
}
