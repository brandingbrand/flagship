import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { RadioButtonLine } from '../RadioButtonLine';

storiesOf('RadioButtonLine', module)
  .add('basic usage', () => (
    <RadioButtonLine
      text={text('text', 'Option 1')}
      onPress={action('onPress')}
      active={boolean('active', true)}
      disabled={boolean('disabled', false)}
    />
  ));
