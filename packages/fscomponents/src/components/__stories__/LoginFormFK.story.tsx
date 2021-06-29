import React from 'react';
import { FieldOption, FormValues, LoginFormFK } from '../LoginFormFK';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import {
  object,
  text
  // tslint:disable-next-line:no-implicit-dependencies
} from '@storybook/addon-knobs';


const onSubmit = (values: FormValues) => {
  alert(`${text('title', 'Values submitted:')} ${values.emailAddress} ${values.password}`);
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
      placeholder: text('title', 'Username')
    },
    password: {
      placeholder: text('title', 'Password')
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
        fieldStyle={object('style', fieldStyle)}
        labelStyle={object('style', labelStyle)}
        submitButtonStyle={object('style', buttonStyle)}
        submitText={text('title', 'Login')}
      />
    )
  );
};

storiesOf('LoginFormFK', module).
add('basic usage', renderLoginForm()).
add('custom styling', renderCustomLoginForm());
