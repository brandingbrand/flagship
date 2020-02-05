import React from 'react';
import { FormValues, SingleLineFormFK } from '../SingleLineFormFK';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import * as yup from 'yup';


const formSchemaPromo = yup.object().shape({
  promo: yup
    .string()
    .required()
    .min(6)
    .label('Promo')
});

const formSchemaEmail = yup.object().shape({
  email: yup
    .string()
    .label('Email')
    .email()
    .required()
});

const onSubmitEmail = (values: FormValues) => {
  alert(`Values submitted: ${values.email}`);
};
const onSubmitPromo = (values: FormValues) => {
  alert(`Values submitted: ${values.promo}`);
};

const placeholderEmail = 'email';
const placeholderPromo = 'promo';

const renderSingleLineFormEmail = () => {

  return (
    () => (
      <SingleLineFormFK
        initialValues={{email: ''}}
        value={'email'}
        validationSchema={formSchemaEmail}
        placeholder={placeholderEmail}
        onSubmit={onSubmitEmail}
      />
    )
  );
};

const renderSingleLineFormPromo = () => {

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
      <SingleLineFormFK
        initialValues={{promo: ''}}
        value={'promo'}
        validationSchema={formSchemaPromo}
        labelStyle={labelStyle}
        fieldStyle={fieldStyle}
        submitButtonStyle={buttonStyle}
        placeholder={placeholderPromo}
        onSubmit={onSubmitPromo}
      />
    )
  );
};

storiesOf('SingleLineFormFK', module).
add('basic usage Email', renderSingleLineFormEmail()).
add('custom styling Promo', renderSingleLineFormPromo());
