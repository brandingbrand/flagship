import React from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import type { FieldOption, FormValues } from '../src/components/LoginFormFK';
import { LoginFormFK } from '../src/components/LoginFormFK';

const onSubmit = (values: FormValues) => {
  alert(`${text('title', 'Values submitted:')} ${values.emailAddress} ${values.password}`);
};

const renderLoginForm = () => () => <LoginFormFK onSubmit={onSubmit} />;

const renderCustomLoginForm = () => {
  const fieldOptions: FieldOption = {
    emailAddress: {
      placeholder: text('title', 'Username'),
    },
    password: {
      placeholder: text('title', 'Password'),
    },
  };

  const fieldStyle: StyleProp<TextStyle> = {
    height: 50,
  };

  const labelStyle: StyleProp<TextStyle> = {
    marginBottom: 20,
    fontWeight: 'bold',
  };

  const buttonStyle: StyleProp<ViewStyle> = {
    backgroundColor: 'navy',
  };

  return () => (
    <LoginFormFK
      fieldStyle={object('style', fieldStyle)}
      fieldsOptions={fieldOptions}
      labelStyle={object('style', labelStyle)}
      onSubmit={onSubmit}
      submitButtonStyle={object('style', buttonStyle)}
      submitText={text('title', 'Login')}
    />
  );
};

storiesOf('LoginFormFK', module)
  .add('basic usage', renderLoginForm())
  .add('custom styling', renderCustomLoginForm());
