import React from 'react';

import { boolean, object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { UpdateNameOrEmail } from '../src/components/UpdateNameOrEmail';

const onSubmit = (values: any) => {
  alert(`
      Values submitted: First Name: ${values.firstName}
      Last Name: ${values.lastName}
      Email Adsress: ${values.emailAddress}
      Password: ${values.password}`);
};

const fieldsStyleConfig = {
  textbox: {
    normal: {
      borderRadius: 15,
      fontSize: 12,
      color: '#7f0000',
    },
    error: {
      borderRadius: 15,
      fontSize: 12,
      color: '#7f0000',
    },
  },
};

const renderUpdateNameOrEmail = (): JSX.Element => <UpdateNameOrEmail onSubmit={onSubmit} />;

const renderCustomUpdateNameOrEmail = () => {
  const fieldsOption = {
    firstName: {
      label: text('title', 'Enter your name'),
      returnKeyType: text('title', 'next'),
      autoCorrect: boolean('autoCorrect', true),
      autoCapitalize: text('autoCapitalize', 'none'),
      error: text('title', 'ERROR!!!'),
    },
  };

  return (
    <UpdateNameOrEmail
      fieldsOptions={object('option', fieldsOption)}
      fieldsStyleConfig={object('style', fieldsStyleConfig)}
      onSubmit={onSubmit}
    />
  );
};

storiesOf('UpdateNameOrEmail', module)
  .add('basic usage', renderUpdateNameOrEmail)
  .add('custom styling', renderCustomUpdateNameOrEmail);
