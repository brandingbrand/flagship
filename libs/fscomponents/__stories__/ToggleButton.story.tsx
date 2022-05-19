import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { ToggleButton } from '../src/components/ToggleButton';

storiesOf('ToggleButton', module).add('basic usage', () => (
  <ToggleButton
    containerPinStyle={{
      width: number('containerPinStyle width', 32),
    }}
    containerStyle={{
      height: number('containerStyle height', 32),
    }}
    disableAnimation={boolean('Disable Animation', false)}
    onPress={action('Toggle Button Pressed')}
    state
    wrapperStyle={{
      padding: number('wrapperStyle padding', 0),
    }}
  />
));
