import React, { Component } from 'react';

// @ts-ignore TODO: Update tcomb-form-native to support typing
import * as t from 'tcomb-form-native';
import { SingleLineForm, SingleLineFormProps } from './SingleLineForm';
import { Omit } from '@brandingbrand/fsfoundation';

export interface PromoFormValue {
  promoCode: string;
}

export interface PromoFormProps extends Omit<SingleLineFormProps, 'fieldsTypes'> {
  onSubmit?: (value: PromoFormValue) => void;
  value?: PromoFormValue;
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
      ...props.fieldsOptions,
      promoCode: {
        auto: 'none',
        placeholder: 'Enter Promo Code',
        returnKeyType: 'go',
        autoCorrect: false,
        autoCapitalize: 'none',
        error: 'Please enter a valid promo code',
        ...props.fieldsOptions.promoCode
      }
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
