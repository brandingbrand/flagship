import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  select
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { Stepper } from '../Stepper';

const formats = [
  'horizontalCenter',
  'horizontalLeft',
  'vertical'
];

storiesOf('Stepper', module)
  .add('basic usage', () => (
    <Stepper
      format={select('format', formats, 'horizontalCenter') as any}
      count={2}
      countUpperLimit={10}
      onDecreaseButtonPress={action('Stepper onDecreaseButtonPress')}
      onIncreaseButtonPress={action('Stepper onIncreaseButtonPress')}
    />
  ));
