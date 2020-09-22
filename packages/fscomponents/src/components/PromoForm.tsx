import React, { Component } from 'react';

// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('tcomb-form-native');
import { SingleLineForm, SingleLineFormProps } from './SingleLineForm';
import { Omit } from '@brandingbrand/fsfoundation';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.promoForm;


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
        placeholder: FSI18n.string(componentTranslationKeys.enterPromo),
        returnKeyType: 'go',
        autoCorrect: false,
        autoCapitalize: 'none',
        error: FSI18n.string(componentTranslationKeys.error),
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
