import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  object,
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { EmailFormFK, EmailFormFKValue } from '../EmailFormFK';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

const initialValue: EmailFormFKValue = {email: 'test@bb.com'};
const value = 'email';

const renderEmailForm = (): (() => JSX.Element) => {
  return (
    () => (
      <EmailFormFK
        initialValues={initialValue}
        value={text('value', value)}
        onSubmit={action('EmailFormFK onSubmit')}
      />
    )
  );
};

const renderStyledEmailForm = (): (() => JSX.Element) => {
  const submitButtonStyle: StyleProp<ViewStyle> = {
    backgroundColor: '#227d74',
    borderRadius: 3,
    alignSelf: 'center'
  };

  const submitTextStyle: StyleProp<TextStyle> = {
    color: '#fff'
  };

  const fieldStyle: StyleProp<TextStyle> = {
    textAlign: 'center'
  };

  const labelStyle: StyleProp<TextStyle> = {
    color: '#227d74',
    letterSpacing: 2,
    textAlign: 'center'
  };
  return (
    () => (
      <EmailFormFK
        initialValues={object('initial value', initialValue)}
        value={text('value', value)}
        onSubmit={action('EmailFormFK onSubmit')}
        submitButtonStyle={submitButtonStyle}
        submitTextStyle={submitTextStyle}
        labelStyle={object('label style', labelStyle)}
        fieldsStyleConfig={fieldStyle}
        submitText={text('Submit Text', 'Submit')}
      />
    )
  );
};


storiesOf('EmailFormFK', module)
  .add('basic usage', renderEmailForm())
  .add('custom styling usage', renderStyledEmailForm());
