import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
  number,
  select
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { CartCount, TextPositions } from '../CartCount';

const positions = ['topLeft', 'topRight', 'center', 'bottomLeft', 'bottomRight'];

storiesOf('CartCount', module)
  .add('basic usage', () => (
    <CartCount
      textPosition={select('Position', positions, 'topRight') as TextPositions}
      count={number('Count', 8)}
    />
  ));
