import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  boolean,
  text
} from '@storybook/addon-knobs';
import { RadioButtonLine } from '../src/components/RadioButtonLine';

storiesOf('RadioButtonLine', module)
  .add('basic usage', () => (
    <RadioButtonLine
      text={text('text', 'Option 1')}
      onPress={action('onPress')}
      active={boolean('active', true)}
      disabled={boolean('disabled', false)}
    />
  ));
