import React from 'react';
import { UpdateNameOrEmail } from '../UpdateNameOrEmail';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean,
  object,
  text
} from '@storybook/addon-knobs'; // tslint:disable-line:no-implicit-dependencies

const onSubmit = (values: any) => {
  alert(`
      Values submitted: First Name: ${values.firstName}
      Last Name: ${values.lastName}
      Email Adsress: ${values.emailAddress}
      Password: ${values.password}`
  );
};

const fieldsStyleConfig = {
  textbox: {
    normal: {
      borderRadius:  15,
      fontSize: 12,
      color: '#7f0000'
    },
    error: {
      borderRadius: 15,
      fontSize: 12,
      color: '#7f0000'
    }
  }
};

const renderUpdateNameOrEmail = (): JSX.Element => {
  return (
      <UpdateNameOrEmail
        onSubmit={onSubmit}
      />
  );
};

const renderCustomUpdateNameOrEmail = () => {
  const fieldsOption = {
    firstName: {
      label: text('title', 'Enter your name'),
      returnKeyType: text('title', 'next'),
      autoCorrect: boolean('autoCorrect', true),
      autoCapitalize: text('autoCapitalize', 'none'),
      error: text('title', 'ERROR!!!')
    }
  };

  return (
      <UpdateNameOrEmail
        onSubmit={onSubmit}
        fieldsStyleConfig={object('style', fieldsStyleConfig)}
        fieldsOptions={object('option', fieldsOption)}
      />
  );
};

storiesOf('UpdateNameOrEmail', module).
add('basic usage', renderUpdateNameOrEmail).
add('custom styling', renderCustomUpdateNameOrEmail);
