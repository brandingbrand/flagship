import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { Swatches } from '../Swatches';

const items = [
  { color: 'red', name: 'red' },
  { color: 'green', name: 'green' },
  { color: 'blue', name: 'blue' },
  { color: 'red', name: 'red' },
  { color: 'green', name: 'green' },
  { color: 'blue', name: 'blue' },
  { color: 'red', name: 'red', available: false },
  { color: 'green', name: 'green', available: false },
  { color: 'blue', name: 'blue', available: false }
];

storiesOf('Swatches', module)
  .add('basic usage', () => (
    <Swatches
      items={items as any}
      label={boolean('label', true)}
      onChangeSwatch={action('Swatches onChangeSwatch')}
    />
  ));
