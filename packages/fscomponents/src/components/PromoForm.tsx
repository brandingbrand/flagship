import React, { Component } from 'react';

// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('@brandingbrand/tcomb-form-native');
import { SingleLineForm, SingleLineFormProps } from './SingleLineForm';
import {Dictionary, Omit} from '@brandingbrand/fsfoundation';
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
  fieldsTypes: Dictionary;
  fieldsOptions: Dictionary;

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

  componentDidMount(): void {
    console.warn('EmailForm is deprecated and will be removed in the next version of Flagship.');
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
