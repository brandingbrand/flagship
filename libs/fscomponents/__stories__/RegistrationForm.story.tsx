import React from 'react';
import { storiesOf } from '@storybook/react';
import { RegistrationForm } from '../src/components/RegistrationForm';

const onSubmit = (values: any) => {
  alert(`
    Values submitted: First Name: ${values.firstName}
    Last Name: ${values.lastName}
    Email Address: ${values.emailAddress}
    Password: ${values.password}`);
};

storiesOf('RegistrationForm', module).add('basic usage', () => {
  return <RegistrationForm onSubmit={onSubmit} />;
});
