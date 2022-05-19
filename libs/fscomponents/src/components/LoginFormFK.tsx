import React from 'react';

import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import { View } from 'react-native';

import type { FormikProps } from 'formik';
import { Formik } from 'formik';
import * as yup from 'yup';

import { defineSchema, schemaRegex } from '../lib/formikHelpers';
import { tr, trKeys } from '../lib/translations';
import { style as S } from '../styles/FormFK';

import { Button } from './Button';
import { TextField } from './FormikFields/TextField';

export interface LoginFormProps {
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
   * Email/username label text
   *
   * @default Email
   */
  emailLabel?: string;

  /**
   * Password label text
   *
   * @default Password
   */
  passLabel?: string;

  /**
   * Label Text Element Styling
   */
  labelStyle?: StyleProp<TextStyle>;

  /**
   * Initial form field values
   */
  values?: FormValues;

  /**
   * Called on form submission
   */
  onSubmit: (values: FormValues) => void;
}

export type FieldOption = {
  [key in keyof FormValues]: TextInputProps;
};

export interface FormValues {
  emailAddress: string;
  password: string;
}

export const LoginFormFK: React.FC<LoginFormProps> = (props) => {
  const formSchema = defineSchema<FormValues>({
    emailAddress: schemaRegex.email.required().label('Email'),
    password: yup.string().required().min(8).label('Password'),
  });

  const initialValues: FormValues = {
    emailAddress: '',
    password: '',
  };

  const handleSubmit = (values: FormValues) => {
    if (values && props.onSubmit) {
      props.onSubmit(values);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={formSchema}>
      {(f: FormikProps<FormValues>) => (
        <View style={[S.container, props.containerStyle]}>
          <TextField
            label={props.emailLabel || tr.string(trKeys.flagship.loginForm.email)}
            labelStyle={props.labelStyle}
            name="emailAddress"
            placeholder={tr.string(trKeys.flagship.loginForm.email)}
            style={[S.textInput, props.fieldStyle]}
            {...(props.fieldsOptions && props.fieldsOptions.emailAddress)}
          />
          <TextField
            label={props.passLabel || tr.string(trKeys.flagship.loginForm.password)}
            labelStyle={props.labelStyle}
            name="password"
            placeholder={tr.string(trKeys.flagship.loginForm.password)}
            secureTextEntry
            style={[S.textInput, props.fieldStyle]}
            {...(props.fieldsOptions && props.fieldsOptions.password)}
          />
          <Button
            onPress={f.handleSubmit}
            style={[S.button, props.submitButtonStyle]}
            title={props.submitText || tr.string(trKeys.flagship.loginForm.submit)}
          />
        </View>
      )}
    </Formik>
  );
};
