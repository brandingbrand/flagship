import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  object,
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { EmailForm } from '../EmailForm';

const defaultStyle = {
  padding: 10
};

const defaultValue = {
  email: 'test@bb.com'
};

storiesOf('EmailForm', module)
  .add('basic usage', () => (
    <EmailForm
      value={object('value', defaultValue)}
      style={object('style', defaultStyle)}
      submitText={text('submitText', 'SUBMIT')}
      onSubmit={action('EmailForm onSubmit')}
    />
  ));
