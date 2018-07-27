import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  color,
  object,
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
// @ts-ignore: TODO fix types for tcomb-form-native
import * as t from 'tcomb-form-native';
import { Form, FormLabelPosition } from '../Form';
import { Button } from '../../Button';
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

const fieldsStyle = {
  controlLabel: {
    normal: {
      marginTop: 10,
      fontSize: 12,
      fontWeight: 200
    },
    error: {
      marginTop: 10,
      fontSize: 12,
      fontWeight: 200
    }
  }
};


const renderForm = (labelPosition?: FormLabelPosition): (() => JSX.Element) => {
  return (
   () => {
     return (
      <View>
        <Form
          activeColor={color('Active Field Color', '#000000')}
          errorColor={color('Error Color', '#d0021b')}
          inactiveColor={color('Inactive Color', '#9B9B9B')}
          style={object('style', defaultStyle)}
          fieldsTypes={fieldsTypes}
          fieldsStyleConfig={fieldsStyle}
          fieldsOptions={object('fieldsOptions', fieldsOptions)}
          labelPosition={labelPosition}
        />
      <Button
        title={text('submitText', 'Submit')}
        onPress={action('FormOnSubmit')}
        style={{marginHorizontal: 10}}
      />
      </View>
     );
   }
  );
};

storiesOf('Form', module)
  .add('basic usage', renderForm())
  .add('label above', renderForm(FormLabelPosition.Above))
  .add('label floating', renderForm(FormLabelPosition.Floating))
  .add('label hidden', renderForm(FormLabelPosition.Hidden));
