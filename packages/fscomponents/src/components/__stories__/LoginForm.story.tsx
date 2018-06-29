import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  object
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { LoginForm } from '../LoginForm';

const defaultStyle = {
  padding: 15
};

storiesOf('LoginForm', module)
  .add('basic usage', () => (
    <LoginForm
      style={object('style', defaultStyle)}
      onSubmit={action('LoginForm onSubmit')}
    />
  ));
