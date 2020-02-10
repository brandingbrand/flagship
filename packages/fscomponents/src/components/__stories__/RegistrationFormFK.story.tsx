import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  object
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { RegistrationFormFK } from '../RegistrationFormFK';

const defaultStyle = {
  padding: 10
};

const defaultButtonStyle = {
  backgroundColor: '#555'
};

const defaultFieldGroupStyle = {
  containerStyle: {
    marginVertical: 5
  },
  labelStyle: {
    marginBottom: 10
  },
  fieldStyle: {
    borderColor: 'rgb(204, 204, 204)'
  },
  errStyle: {
    color: 'red'
  }
};

const defaultValue = {
  firstName: 'Test',
  lastName: 'Brander',
  emailAddress: 'test@bb.com',
  password: 'Password1',
  confirmPassword: 'Password1'
};

const renderRegistrationFormFK = (): (() => JSX.Element) => {
  return (
    () => (
      <RegistrationFormFK
        fieldsStyleConfig={object('Style input group', defaultFieldGroupStyle)}
        onSubmit={action('Submit')}
        submitButtonStyle={object('Style button', defaultButtonStyle)}
        style={object('Style form container', defaultStyle)}
        value={defaultValue}
      />
    )
  );
};

storiesOf('RegistrationFormFK', module)
  .add('basic usage', renderRegistrationFormFK());
