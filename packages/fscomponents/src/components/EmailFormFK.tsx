import React, { FunctionComponent } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { FieldOption, SingleLineFormFK } from './SingleLineFormFK';
import * as yup from 'yup';
import { FormLabelPosition } from './Form';

export interface EmailFormFKValue {
  email: string;
}

export interface EmailFormFKProps {
  initialValues: EmailFormFKValue;
  onSubmit: (value: EmailFormFKValue) => void;
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<TextStyle>;
  submitText?: string;
  style?: StyleProp<ViewStyle>;
  value: string;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelPosition?: FormLabelPosition;
  fieldsOptions?: FieldOption;
  fieldsStyleConfig?: any;
  placeholder?: string;
}

export const EmailFormFK: FunctionComponent<EmailFormFKProps> = React.memo((props): JSX.Element => {
  const formSchemaEmail = yup.object().shape({
    email: yup
      .string()
      .label('Email')
      .email()
      .required()
  });

  const placeholder = 'Email';

  return (
    <SingleLineFormFK
      placeholder={placeholder}
      validationSchema={formSchemaEmail}
      {...props}
    />
  );
});
