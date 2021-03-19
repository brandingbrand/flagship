import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean,
  number
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import ToggleButton from '../ToggleButton';

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
