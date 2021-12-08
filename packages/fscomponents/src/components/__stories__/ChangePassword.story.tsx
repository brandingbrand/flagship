import React from 'react';
import { ChangePassword, FormValues } from '../ChangePasswordComponent';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
  object,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';

const fieldsOptions = {
  confirmPassword: {
    label: text('title', 'Confirm'),
    returnKeyType: 'next',
    autoCorrect: false,
    autoCapitalize: 'none',
    secureTextEntry: true
  }
};

const onSubmit = (values: FormValues) => {
  alert(
    `Values submitted: ${values.currentPassword} ${values.confirmPassword} ${values.newPassword}`
  );
};

const defaultStyle = {
  textbox: {
    normal: {
      borderRadius: 15,
      fontSize:  15,
      color: '#890'
    },
    error: {
      borderRadius: 30,
      fontSize: 15,
      color: '#529'
    }
  },
  errorBlock: {
    fontSize: 15
  }
};

const renderChangePasswordBox = (): JSX.Element => {
  return (
    <ChangePassword
      onSubmit={onSubmit}
    />
  );
};

const renderCustomChangePasswordBox = (): JSX.Element => {
  return (
    <ChangePassword
      onSubmit={onSubmit}
      fieldsStyleConfig={object('style', defaultStyle)}
      fieldsOptions={fieldsOptions}
    />
  );
};

storiesOf('ChangePassword', module).
add('custom styling', renderCustomChangePasswordBox).
add('basic usage', renderChangePasswordBox);
