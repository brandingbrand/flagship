import React from 'react';
import {
  StyleProp,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import { style as S } from '../styles/FormFK';
import { TextField } from './FormikFields/TextField';
import { Button } from './Button';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.updateNameOrEmail;


export interface UpdateNameOrEmailPropsFK {
  onSubmit?: (value: any) => void; // the behaviour we want onpress of submit button
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<TextStyle>;
  submitText?: string; // Text to override the submit button
  value?: string;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  validationSchema?: any | (() => any);
  fieldsOptions?: FieldOption;
  fieldStyle?: StyleProp<TextStyle>;
}

export type FieldOption = {
  [key in keyof FormValues]: TextInputProps;
};

export interface FormValues {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
}

export const UpdateNameOrEmailFK: React.FC<UpdateNameOrEmailPropsFK> = props => {
  const initialValues: FormValues = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: ''
  };

  const validationSchema = yup.object().shape({
    firstName: yup
      .string()
      .label('First Name')
      .required(FSI18n.string(componentTranslationKeys.form.firstName.error))
      .min(2),
    lastName: yup
      .string()
      .label('Last Name')
      .required(FSI18n.string(componentTranslationKeys.form.lastName.error))
      .min(2),
    emailAddress: yup
      .string()
      .label('Email')
      .email()
      .required(FSI18n.string(componentTranslationKeys.form.emailAddress.error.missing)),
    password: yup
      .string()
      .label('Password')
      .required()
      .min(6)
  });

  const handleSubmit = (value: FormValues) => {
    if (value && props.onSubmit) {
      props.onSubmit(value);
    }
  };

  return (
    <View>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(f: FormikProps<FormValues>) => (
          <View style={[S.container, props.containerStyle]}>
            <TextField
              name='firstName'
              label={FSI18n.string(componentTranslationKeys.form.firstName.label)}
              placeholder={FSI18n.string(componentTranslationKeys.form.firstName.label)}
              style={[S.textInput, props.fieldStyle]}
              {...props.fieldsOptions && props.fieldsOptions.firstName}
              autoFocus
            />
            <TextField
              name='lastName'
              labelStyle={props.labelStyle}
              label={FSI18n.string(componentTranslationKeys.form.lastName.label)}
              placeholder={FSI18n.string(componentTranslationKeys.form.lastName.label)}
              style={[S.textInput, props.fieldStyle]}
              {...props.fieldsOptions && props.fieldsOptions.lastName}
            />
            <TextField
              name='emailAddress'
              labelStyle={props.labelStyle}
              label={FSI18n.string(componentTranslationKeys.form.emailAddress.label)}
              placeholder={FSI18n.string(componentTranslationKeys.form.emailAddress.label)}
              style={[S.textInput, props.fieldStyle]}
              {...props.fieldsOptions && props.fieldsOptions.emailAddress}
            />
            <TextField
              name='password'
              labelStyle={props.labelStyle}
              label={FSI18n.string(componentTranslationKeys.form.password.label)}
              placeholder={FSI18n.string(componentTranslationKeys.form.password.label)}
              style={[S.textInput, props.fieldStyle]}
              {...props.fieldsOptions && props.fieldsOptions.password}
              secureTextEntry
            />
            <Button
              onPress={f.handleSubmit}
              title={
                props.submitText ||
                FSI18n.string(componentTranslationKeys.actions.submit.actionBtn)
              }
              style={[S.button, props.submitButtonStyle]}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};
