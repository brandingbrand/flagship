import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { RadioButtonLine } from '../src/components/RadioButtonLine';

storiesOf('RadioButtonLine', module).add('basic usage', () => (
  <RadioButtonLine
    active={boolean('active', true)}
    disabled={boolean('disabled', false)}
    onPress={action('onPress')}
    text={text('text', 'Option 1')}
  />
));
