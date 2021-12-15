import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { color, object, text } from '@storybook/addon-knobs';
import { Form } from '../src/components/Form/Form';
import { FormLabelPosition } from '../src/components/Form/Templates/fieldTemplates';
import { Button } from '../src/components/Button';
import { emailRegex } from '../src/lib/email';
// Using import with tcomb-form-native seems to cause issues with the object being undefined.
const t = require('@brandingbrand/tcomb-form-native');

const EmailType = t.refinement(t.String, (str: string) => {
  return emailRegex.test((str || '').trim());
});

const PasswordType = t.refinement(t.String, (str: string) => {
  return str.length >= 6;
});

const fieldsTypes = t.struct({
  email: EmailType,
  password: PasswordType,
  rememberMe: t.Boolean,
});

const fieldsOptions = {
  email: {
    placeholder: 'Email',
    returnKeyType: 'next',
    autoCorrect: false,
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    error: 'Please enter an email',
  },
  password: {
    placeholder: 'Password',
    returnKeyType: 'next',
    autoCorrect: false,
    secureTextEntry: true,
    error: 'Must be six characters or more',
  },
  rememberMe: {
    label: 'Remember Me',
  },
};

const defaultStyle = {
  padding: 10,
};

const fieldsStyle = {
  controlLabel: {
    normal: {
      marginTop: 10,
      fontSize: 12,
      fontWeight: 200,
    },
    error: {
      marginTop: 10,
      fontSize: 12,
      fontWeight: 200,
    },
  },
};

const renderForm = (labelPosition?: FormLabelPosition): (() => JSX.Element) => {
  return () => {
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
          style={{ marginHorizontal: 10 }}
        />
      </View>
    );
  };
};

storiesOf('Form', module)
  .add('basic usage', renderForm())
  .add('label above', renderForm(FormLabelPosition.Above))
  .add('label floating', renderForm(FormLabelPosition.Floating))
  .add('label hidden', renderForm(FormLabelPosition.Hidden));
