import React, { Component, ReactNode } from 'react';
import { StyleProp, Text, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { Formik, FormikConfig, FormikProps } from 'formik';
import * as yup from 'yup';
import { defineSchema } from '../lib/formikHelpers';
import { Button } from './Button';
import { TextField } from './FormikFields/TextField';
import { tr, trKeys } from '../lib/translations/index';
import { style as S } from '../styles/PromoFromFK';

export interface PromoFormFKValue {
  promoCode: string;
}

export type FieldOption = {
  [key in keyof PromoFormFKValue]: TextInputProps;
};

export interface PromoFormFKProps {
  /**
   * Outer container style
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Form fields style
   */
  fieldStyle?: StyleProp<TextStyle>;

  /**
   * Form fields options
   */
  fieldsOptions?: FieldOption;

  /**
   * Submit button styling
   */
  submitButtonStyle?: StyleProp<ViewStyle>;

  /**
   * Submit button text
   *
   * @default Submit
   */
  submitText?: string;

  /**
   * Promo code label text
   *
   * @default Promo Code
   */
  label?: string;

  /**
   * Label Text Element Styling
   */
  labelStyle?: StyleProp<TextStyle>;

  /**
   * Form Element Position
   *
   * @default false ('Block')
   */
  formPositionInline?: boolean;

  /**
   * Initial form field values
   */
  value?: string;

  /**
   * Label Text Element Position
   */
  placeholder?: string;

  /**
   * Called on form submission
   */
  onSubmit: (value: string) => void;
}

const promoFormFKSchema = defineSchema<PromoFormFKValue>({
  promoCode: yup
    .string()
    .required()
    .label(tr.string(trKeys.flagship.promoFormFK.errorMessage))
});

export class PromoFormFK extends Component<PromoFormFKProps> {
  formConfig: FormikConfig<PromoFormFKValue>;

  constructor(props: PromoFormFKProps) {
    super(props);

    this.formConfig = {
      validateOnChange: true,
      validateOnBlur: true,
      initialValues: {
        promoCode: this.props.value || ''
      },
      validationSchema: promoFormFKSchema,
      onSubmit: this.handleValidated
    };
  }

  render(): JSX.Element {
    return (
      <Formik {...this.formConfig}>
        {this.renderPromoForm}
      </Formik>
    );
  }

  private renderPromoForm = (f: FormikProps<PromoFormFKValue>): ReactNode => {
    const submitForm = f.submitForm.bind(this);
    const {
      label, placeholder, labelStyle, containerStyle, fieldStyle, fieldsOptions
    } = this.props;
    return this.props.formPositionInline ? (
      <>
        {!!label && <Text style={labelStyle}>{label}</Text>}
        <View style={[S.containerInLine, containerStyle]}>
          <View style={S.textFieldContainerInLine}>
            <TextField
              name='promoCode'
              placeholder={placeholder}
              value={f.values.promoCode}
              style={[S.textInput, fieldStyle]}
              {...fieldsOptions && fieldsOptions.promoCode}
            />
          </View>
          {this.renderSubmitButton(submitForm)}
        </View>
      </>
    ) : (
      <View style={containerStyle}>
        <TextField
          name='promoCode'
          labelStyle={labelStyle}
          label={label}
          placeholder={placeholder}
          value={f.values.promoCode}
          style={[S.textInput, fieldStyle]}
          {...fieldsOptions && fieldsOptions.promoCode}
        />
        {this.renderSubmitButton(submitForm)}
      </View>
    );
  }

  private renderSubmitButton = (submitForm: () => void): ReactNode => {
    const style = this.props.formPositionInline ? S.buttonInLine : S.buttonBlock;
    return (
      <Button
        onPress={submitForm}
        title={this.props.submitText || tr.string(trKeys.flagship.promoFormFK.button)}
        style={[style, this.props.submitButtonStyle]}
      />
    );
  }

  private handleValidated: FormikConfig<PromoFormFKValue>['onSubmit'] = value => {
    if (!!value && !!this.props.onSubmit) {
      this.props.onSubmit(value.promoCode);
    }
  }
}
