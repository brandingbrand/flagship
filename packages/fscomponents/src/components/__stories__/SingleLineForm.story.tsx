import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  object
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { SingleLineForm } from '../SingleLineForm';
// @ts-ignore TODO: Update tcomb-form-native to support typing
import * as t from 'tcomb-form-native';
import { emailRegex } from '../../lib/email';

const EmailType = t.refinement(t.String, (str: string) => {
  return emailRegex.test((str || '').trim());
});

const fieldsTypes = t.struct({
  email: EmailType
});

const fieldsOptions = {
  email: {
    auto: 'none',
    placeholder: 'Email',
    returnKeyType: 'next',
    autoCorrect: false,
    autoCapitalize: 'none',
    keyboardType: 'email-address',
    error: 'Please enter a valid email address'
  }
};

storiesOf('SingleLineForm', module)
  .add('basic usage', () => (
    <SingleLineForm
      fieldsTypes={object('fieldsTypes', fieldsTypes)}
      fieldsOptions={object('fieldsOptions', fieldsOptions)}
      onSubmit={action('SingleLineForm onSubmit')}
    />
  ));
