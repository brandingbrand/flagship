import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
  color,
  object
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
// @ts-ignore: TODO fix types for tcomb-form-native
import * as t from 'tcomb-form-native';
import { Form, FormLabelPosition } from '../Form';
import { emailRegex } from '../../../lib/email';

const EmailType = t.refinement(t.String, (str: string) => {
  return emailRegex.test((str || '').trim());
});

const PasswordType = t.refinement(t.String, (str: string) => {
  return str.length >= 6;
});

const fieldsTypes = t.struct({
  email: EmailType,
  password: PasswordType,
  rememberMe: t.Boolean
});

const fieldsOptions = {
  email: {
    placeholder: 'Email',
    returnKeyType: 'next',
    autoCorrect: false,
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    error: 'Please enter an email'
  },
  password: {
    placeholder: 'Password',
    returnKeyType: 'next',
    autoCorrect: false,
    secureTextEntry: true,
    error: 'Must be six characters or more'
  },
  rememberMe: {
    label: 'Remember Me'
  }
};

const defaultStyle = {
  padding: 10
};

storiesOf('Form', module)
  .add('basic usage', () => (
    <Form
      activeColor={color('Active Field Color', '#000000')}
      errorColor={color('Error Color', '#d0021b')}
      inactiveColor={color('Inactive Color', '#9B9B9B')}
      style={object('style', defaultStyle)}
      fieldsTypes={fieldsTypes}
      fieldsOptions={object('fieldsOptions', fieldsOptions)}
    />
  ))
  .add('label hidden', () => (
    <Form
      activeColor={color('Active Field Color', '#000000')}
      errorColor={color('Error Color', '#d0021b')}
      inactiveColor={color('Inactive Color', '#9B9B9B')}
      style={object('style', defaultStyle)}
      fieldsTypes={fieldsTypes}
      fieldsOptions={object('fieldsOptions', fieldsOptions)}
      labelPosition={FormLabelPosition.Hidden}
    />
  ))
  .add('label above', () => (
    <Form
      activeColor={color('Active Field Color', '#000000')}
      errorColor={color('Error Color', '#d0021b')}
      inactiveColor={color('Inactive Color', '#9B9B9B')}
      style={object('style', defaultStyle)}
      fieldsTypes={fieldsTypes}
      fieldsOptions={object('fieldsOptions', fieldsOptions)}
      labelPosition={FormLabelPosition.Above}
    />
  ))
  .add('label floating', () => (
    <Form
      activeColor={color('Active Field Color', '#000000')}
      errorColor={color('Error Color', '#d0021b')}
      inactiveColor={color('Inactive Color', '#9B9B9B')}
      style={object('style', defaultStyle)}
      fieldsTypes={fieldsTypes}
      fieldsOptions={object('fieldsOptions', fieldsOptions)}
      labelPosition={FormLabelPosition.Floating}
    />
  ));
