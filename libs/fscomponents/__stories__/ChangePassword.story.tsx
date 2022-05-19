import React from 'react';

import { object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import type { FormValues } from '../src/components/ChangePasswordComponent';
import { ChangePassword } from '../src/components/ChangePasswordComponent';

const fieldsOptions = {
  confirmPassword: {
    label: text('title', 'Confirm'),
    returnKeyType: 'next',
    autoCorrect: false,
    autoCapitalize: 'none',
    secureTextEntry: true,
  },
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
      fontSize: 15,
      color: '#890',
    },
    error: {
      borderRadius: 30,
      fontSize: 15,
      color: '#529',
    },
  },
  errorBlock: {
    fontSize: 15,
  },
};

const renderChangePasswordBox = (): JSX.Element => <ChangePassword onSubmit={onSubmit} />;

const renderCustomChangePasswordBox = (): JSX.Element => (
  <ChangePassword
    fieldsOptions={fieldsOptions}
    fieldsStyleConfig={object('style', defaultStyle)}
    onSubmit={onSubmit}
  />
);

storiesOf('ChangePassword', module)
  .add('custom styling', renderCustomChangePasswordBox)
  .add('basic usage', renderChangePasswordBox);
