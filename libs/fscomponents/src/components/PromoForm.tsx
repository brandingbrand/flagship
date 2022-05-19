import React, { Component } from 'react';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import type { SingleLineFormProps } from './SingleLineForm';
import { SingleLineForm } from './SingleLineForm';

// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('@brandingbrand/tcomb-form-native');

const componentTranslationKeys = translationKeys.flagship.promoForm;

export interface PromoFormValue {
  promoCode: string;
}

export interface PromoFormProps extends Omit<SingleLineFormProps, 'fieldsTypes'> {
  onSubmit?: (value: PromoFormValue) => void;
  value?: PromoFormValue;
}

export class PromoForm extends Component<PromoFormProps> {
  constructor(props: PromoFormProps) {
    super(props);

    this.fieldsTypes = t.struct({
      promoCode: t.String,
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
        ...props.fieldsOptions.promoCode,
      },
    };
  }

  private readonly fieldsTypes: Record<string, unknown>;
  private readonly fieldsOptions: Record<string, unknown>;

  public componentDidMount(): void {
    console.warn('EmailForm is deprecated and will be removed in the next version of Flagship.');
  }

  public render(): JSX.Element {
    return (
      <SingleLineForm
        {...this.props}
        fieldsOptions={this.fieldsOptions}
        fieldsTypes={this.fieldsTypes}
      />
    );
  }
}
