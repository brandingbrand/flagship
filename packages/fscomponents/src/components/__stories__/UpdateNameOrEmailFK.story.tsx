import React from 'react';
import { FieldOption, FormValues, UpdateNameOrEmailFK } from '../UpdateNameOrEmailFK';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { StyleProp, TextStyle, ViewStyle } from 'react-native';


const onSubmit = (values: FormValues) => {
  alert(`
      Values submitted: First Name: ${values.firstName}
      Last Name: ${values.lastName}
      Email Adsress: ${values.emailAddress}
      Password: ${values.password}`
  );
};

const renderUpdateNameOrEmailFK = () => {
  return (
    () => (
      <UpdateNameOrEmailFK
        onSubmit={onSubmit}
      />
    )
  );
};


const renderCustomUpdateNameOrEmailFK = () => {
  const fieldOptions: FieldOption = {
    firstName: {
      placeholder: 'First Name'
    },
    lastName: {
      placeholder: 'Last Name'
    },
    emailAddress: {
      placeholder: 'Email Address'
    },
    password: {
      placeholder: 'Password'
    }
  };

  const fieldStyle: StyleProp<TextStyle> = {
    height: 50
  };

  const labelStyle: StyleProp<TextStyle> = {
    marginBottom: 20,
    fontWeight: 'bold'
  };

  const buttonStyle: StyleProp<ViewStyle> = {
    backgroundColor: 'navy'
  };

  return (
    () => (
      <UpdateNameOrEmailFK
        onSubmit={onSubmit}
        fieldsOptions={fieldOptions}
        fieldStyle={fieldStyle}
        labelStyle={labelStyle}
        submitButtonStyle={buttonStyle}
        submitText={'Submit'}
      />
    )
  );
};

storiesOf('UpdateNameOrEmailFK', module).
add('basic usage', renderUpdateNameOrEmailFK()).
add('custom styling', renderCustomUpdateNameOrEmailFK());
