import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
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
    autoCapitalize: 'none'
  },
  password: {
    placeholder: 'Password',
    returnKeyType: 'next',
    autoCorrect: false,
    secureTextEntry: true
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
      style={object('style', defaultStyle)}
      fieldsTypes={fieldsTypes}
      fieldsOptions={object('fieldsOptions', fieldsOptions)}
    />
  ))
  .add('label hidden', () => (
    <Form
      style={object('style', defaultStyle)}
      fieldsTypes={fieldsTypes}
      fieldsOptions={object('fieldsOptions', fieldsOptions)}
      labelPosition={FormLabelPosition.Hidden}
    />
  ))
  .add('label above', () => (
    <Form
      style={object('style', defaultStyle)}
      fieldsTypes={fieldsTypes}
      fieldsOptions={object('fieldsOptions', fieldsOptions)}
      labelPosition={FormLabelPosition.Above}
    />
  ))
  .add('label floating', () => (
    <Form
      style={object('style', defaultStyle)}
      fieldsTypes={fieldsTypes}
      fieldsOptions={object('fieldsOptions', fieldsOptions)}
      labelPosition={FormLabelPosition.Floating}
    />
  ));
