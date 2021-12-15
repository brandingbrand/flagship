import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  boolean,
  number
} from '@storybook/addon-knobs';
import { ToggleButton } from '../src/components/ToggleButton';

storiesOf('ToggleButton', module)
  .add('basic usage', () => (
    <ToggleButton
      state={true}
      disableAnimation={boolean('Disable Animation', false)}
      onPress={action('Toggle Button Pressed')}
      wrapperStyle={{
        padding: number('wrapperStyle padding', 0)
      }}
      containerStyle={{
        height: number('containerStyle height', 32)
      }}
      containerPinStyle={{
        width: number('containerPinStyle width', 32)
      }}
    />
  ));
