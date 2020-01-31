import React from 'react';
import { StyleProp, TextInputProps, View, ViewStyle } from 'react-native';
import { Button } from './Button';
import { Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import { style as S } from '../styles/FormFK';
import { TextField } from './FormikFields/TextField';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.changePassword;


export interface ChangePasswordPropsFK {
  fieldsStyleConfig?: any; // the custom stylesheet we want to merge with the default stylesheet
  onSubmit?: (value: any) => void; // the behaviour we want onpress of submit button
  submitButtonStyle?: any;
  submitTextStyle?: any;
  submitText?: any; // Text to override the submit button
  style?: any;
  fieldsOptions?: any; // any extra desired behaviour, like placeholders
  value?: any;
  fieldStyle?: any;
  labelStyle?: any;
  containerStyle?: StyleProp<ViewStyle>;
}

export type FieldOption = {
  [key in keyof FormValues]: TextInputProps;
};

export interface FormValues {
  currentPassword: string;
  confirmPassword: string;
  newPassword: string;
}


const formSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required()
    .min(6)
    .label('Current Password'),
  confirmPassword: yup
    .string()
    .required()
    .label('Confirm Password')
    .test('password-match', 'Password must match', function(value: string): boolean {
      // tslint:disable-next-line:no-invalid-this
      return this.parent.currentPassword === value;
    }),
  newPassword: yup
    .string()
    .required()
    .min(6)
    .label('New Password')
});


export const ChangePasswordFK: React.FC<ChangePasswordPropsFK> = props => {

  const initialValues: FormValues = {
    currentPassword: '',
    confirmPassword: '',
    newPassword: ''
  };

  const handleSubmit = (values: FormValues) => {
    if (values && props.onSubmit) {
      props.onSubmit(values);
    }
  };

  return (
      <View>
        <Formik
          initialValues={initialValues}
          validationSchema={formSchema}
          onSubmit={handleSubmit}
        >
          {(f: FormikProps<FormValues>) => (
            <View style={[S.container, props.containerStyle]}>
              <TextField
                name='currentPassword'
                label={FSI18n.string(componentTranslationKeys.form.currentPassword.label)}
                placeholder={FSI18n.string(componentTranslationKeys.form.currentPassword.label)}
                style={[S.textInput, props.fieldsStyleConfig]}
                secureTextEntry
                autoFocus
              />
              <TextField
                name='confirmPassword'
                labelStyle={props.labelStyle}
                label={FSI18n.string(componentTranslationKeys.form.confirmPassword.label)}
                placeholder={FSI18n.string(componentTranslationKeys.form.confirmPassword.label)}
                style={[S.textInput, props.fieldsStyleConfig]}
                {...props.fieldsOptions && props.fieldsOptions.confirmPassword}
                secureTextEntry
              />
              <TextField
                name='newPassword'
                labelStyle={props.labelStyle}
                label={FSI18n.string(componentTranslationKeys.form.newPassword.label)}
                placeholder={FSI18n.string(componentTranslationKeys.form.newPassword.label)}
                style={[S.textInput, props.fieldsStyleConfig]}
                {...props.fieldsOptions && props.fieldsOptions.newPassword}
                secureTextEntry
              />
              <Button
                onPress={f.handleSubmit}
                title={FSI18n.string(componentTranslationKeys.actions.submit.actionBtn)}
                style={[S.button, props.submitButtonStyle]}
              />
            </View>
          )}
        </Formik>
      </View>
  );
};
