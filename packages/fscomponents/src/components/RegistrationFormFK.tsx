import React, { Component, ReactNode } from 'react';
import { StyleProp, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { Button } from './Button';
import { Formik, FormikConfig, FormikProps } from 'formik';
import * as yup from 'yup';
import { defineSchema, schemaRegex } from '../lib/formikHelpers';
import { style as S } from '../styles/FormFK';
import { FormFieldStylesProps, TextField } from './FormikFields/TextField';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.registrationForm;

interface FormGroupStylesProps extends FormFieldStylesProps {
  fieldStyle?: StyleProp<TextStyle>;
}

export interface RegistrationFormPropsFK {
  fieldsStyleConfig?: FormGroupStylesProps;
  onSubmit?: (value: RegistrationFormValuesFK) => void;
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<TextStyle>;
  submitText?: string;
  style?: StyleProp<ViewStyle>;
  fieldsOptions?: RegistrationFieldOptionFK;
  value?: Partial<RegistrationFormValuesFK>;
}

export type RegistrationFieldOptionFK = {
  [key in keyof Partial<RegistrationFormValuesFK>]: TextInputProps;
};

export interface RegistrationFormValuesFK {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

const formSchema = defineSchema<RegistrationFormValuesFK>({
  firstName: yup.string().required().label(FSI18n.string(componentTranslationKeys.firstName)),
  lastName: yup.string().required().label(FSI18n.string(componentTranslationKeys.lastName)),
  emailAddress: schemaRegex.email.required()
    .label(FSI18n.string(componentTranslationKeys.email)),
  password: yup.string().required().min(6)
    .label(FSI18n.string(componentTranslationKeys.password)),
  confirmPassword: yup.string().required()
    .label(FSI18n.string(componentTranslationKeys.confirmPassword))
    .oneOf(
      [yup.ref('password'), ''],
      FSI18n.string(componentTranslationKeys.passwordDoNotMatch)
    )
});

export class RegistrationFormFK extends Component<RegistrationFormPropsFK> {
  formConfig: FormikConfig<RegistrationFormValuesFK>;

  // tslint:disable-next-line:cyclomatic-complexity
  constructor(props: RegistrationFormPropsFK) {
    super(props);
    this.formConfig = {
      initialValues: {
        firstName: this.props.value && this.props.value.firstName ?
          this.props.value.firstName : '',
        lastName: this.props.value && this.props.value.lastName ?
          this.props.value.lastName : '',
        emailAddress: this.props.value && this.props.value.emailAddress ?
          this.props.value.emailAddress : '',
        password: this.props.value && this.props.value.password ?
          this.props.value.password : '',
        confirmPassword: this.props.value && this.props.value.confirmPassword ?
          this.props.value.confirmPassword : ''
      },
      validationSchema: formSchema,
      onSubmit: this.handleSubmit
    };
  }

  render(): ReactNode {
    const stylesFieldsOptions = {
      containerStyle: this.props.fieldsStyleConfig && this.props.fieldsStyleConfig.containerStyle ?
        this.props.fieldsStyleConfig.containerStyle : undefined,
      labelStyle: this.props.fieldsStyleConfig && this.props.fieldsStyleConfig.labelStyle ?
        this.props.fieldsStyleConfig.labelStyle : undefined,
      errStyle: this.props.fieldsStyleConfig && this.props.fieldsStyleConfig.errStyle ?
        this.props.fieldsStyleConfig.errStyle : undefined,
      style: [S.textInput, this.props.fieldsStyleConfig && this.props.fieldsStyleConfig.fieldStyle ?
        this.props.fieldsStyleConfig.fieldStyle : undefined]
    };

    return (
      <Formik {...this.formConfig}>
        {(f: FormikProps<RegistrationFormValuesFK>) => (
          <View style={[S.container, this.props.style]}>
            <TextField
              name='firstName'
              placeholder={FSI18n.string(componentTranslationKeys.firstName)}
              label={FSI18n.string(componentTranslationKeys.firstName)}
              {...stylesFieldsOptions}
              autoCorrect={false}
              {...this.props.fieldsOptions && this.props.fieldsOptions.firstName}
            />
            <TextField
              name='lastName'
              placeholder={FSI18n.string(componentTranslationKeys.lastName)}
              label={FSI18n.string(componentTranslationKeys.lastName)}
              {...stylesFieldsOptions}
              autoCorrect={false}
              {...this.props.fieldsOptions && this.props.fieldsOptions.lastName}
            />
            <TextField
              name='emailAddress'
              placeholder={FSI18n.string(componentTranslationKeys.email)}
              label={FSI18n.string(componentTranslationKeys.email)}
              {...stylesFieldsOptions}
              autoCorrect={false}
              autoCapitalize={'none'}
              autoCompleteType={'email'}
              keyboardType={'email-address'}
              {...this.props.fieldsOptions && this.props.fieldsOptions.emailAddress}
            />
            <TextField
              name='password'
              placeholder={FSI18n.string(componentTranslationKeys.password)}
              label={FSI18n.string(componentTranslationKeys.password)}
              {...stylesFieldsOptions}
              autoCorrect={false}
              autoCapitalize={'none'}
              autoCompleteType={'password'}
              secureTextEntry={true}
              {...this.props.fieldsOptions && this.props.fieldsOptions.password}
            />
            <TextField
              name='confirmPassword'
              placeholder={FSI18n.string(componentTranslationKeys.confirmPassword)}
              label={FSI18n.string(componentTranslationKeys.confirmPassword)}
              {...stylesFieldsOptions}
              autoCorrect={false}
              autoCapitalize={'none'}
              autoCompleteType={'password'}
              secureTextEntry={true}
              {...this.props.fieldsOptions && this.props.fieldsOptions.confirmPassword}
            />
            <Button
              onPress={f.handleSubmit}
              title={this.props.submitText ||
                FSI18n.string(componentTranslationKeys.submit)}
              style={[S.button, this.props.submitButtonStyle]}
            />
          </View>
        )}
      </Formik>
    );
  }

  private handleSubmit = (values: RegistrationFormValuesFK) => {
    if (values && this.props.onSubmit) {
      this.props.onSubmit(values);
    }
  }
}
