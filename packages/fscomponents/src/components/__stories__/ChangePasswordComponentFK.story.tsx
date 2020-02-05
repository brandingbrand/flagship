import React from 'react';
import { ChangePasswordFK, FieldOption, FormValues } from '../ChangePasswordComponentFK';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { StyleProp, TextStyle, ViewStyle } from 'react-native';


const onSubmit = (values: FormValues) => {
  alert(
    `Values submitted: ${values.currentPassword} ${values.confirmPassword} ${values.newPassword}`
  );
};

const renderChangePasswordComponent = () => {
  return (
    () => (
      <ChangePasswordFK
        onSubmit={onSubmit}
      />
    )
  );
};

const renderCustomChangePasswordComponent = () => {
  const fieldOptions: FieldOption = {
    currentPassword: {
      placeholder: '*Current Password'
    },
    confirmPassword: {
      placeholder: '*Confirm Password'
    },
    newPassword: {
      placeholder: '*New Password'
    }
  };

  const fieldStyle: StyleProp<TextStyle> = {
    height: 50
  };

  const labelStyle: StyleProp<TextStyle> = {
    marginBottom: 20,
    fontWeight: 'bold'
  };

  const buttonStyle: StyleProp<ViewStyle> = {
    backgroundColor: 'navy'
  };

  return (
    () => (
      <ChangePasswordFK
        onSubmit={onSubmit}
        fieldsOptions={fieldOptions}
        fieldStyle={fieldStyle}
        labelStyle={labelStyle}
        submitButtonStyle={buttonStyle}
        submitText={'Submit'}
      />
    )
  );
};

storiesOf('ChangePasswordComponent', module).
add('basic usage', renderChangePasswordComponent()).
add('custom styling', renderCustomChangePasswordComponent());
