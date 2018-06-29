import React, { Component } from 'react';

// @ts-ignore TODO: Update tcomb-form-native to support typing
import * as t from 'tcomb-form-native';
import { SingleLineForm } from './SingleLineForm';

export interface PromoFormValue {
  promoCode: string;
}

export interface PromoFormProps {
  fieldsStyleConfig?: any;
  onSubmit?: (value: PromoFormValue) => void;
  submitButtonStyle?: any;
  submitTextStyle?: any;
  submitText?: any;
  value?: PromoFormValue;
  style?: any;
  fieldsOptions?: any;
}

export class PromoForm extends Component<PromoFormProps> {
  fieldsTypes: any;
  fieldsOptions: any;

  constructor(props: PromoFormProps) {
    super(props);

    this.fieldsTypes = t.struct({
      promoCode: t.String
    });

    this.fieldsOptions = {
      promoCode: {
        auto: 'none',
        placeholder: 'Enter Promo Code',
        returnKeyType: 'go',
        autoCorrect: false,
        autoCapitalize: 'none',
        error: 'Please enter a valid promo code'
      },
      ...props.fieldsOptions
    };
  }

  render(): JSX.Element {
    return (
      <SingleLineForm
        {...this.props}
        fieldsTypes={this.fieldsTypes}
        fieldsOptions={this.fieldsOptions}
      />
    );
  }
}
