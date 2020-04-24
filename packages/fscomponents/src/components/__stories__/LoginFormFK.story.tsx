import React from 'react';
import { FieldOption, FormValues, LoginFormFK } from '../LoginFormFK';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { StyleProp, TextStyle, ViewStyle } from 'react-native';


const onSubmit = (values: FormValues) => {
  alert(`Values submitted: ${values.emailAddress} ${values.password}`);
};

const renderLoginForm = () => {
  return (
    () => (
      <LoginFormFK
        onSubmit={onSubmit}
      />
    )
  );
};

const renderCustomLoginForm = () => {
  const fieldOptions: FieldOption = {
    emailAddress: {
      placeholder: 'Username'
    },
    password: {
      placeholder: 'Password'
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
      <LoginFormFK
        onSubmit={onSubmit}
        fieldsOptions={fieldOptions}
        fieldStyle={fieldStyle}
        labelStyle={labelStyle}
        submitButtonStyle={buttonStyle}
        submitText={'Login'}
      />
    )
  );
};

storiesOf('LoginFormFK', module).
add('basic usage', renderLoginForm()).
add('custom styling', renderCustomLoginForm());
