import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, select } from '@storybook/addon-knobs';
import { CartCount, TextPositions } from '../src/components/CartCount';

const positions = ['topLeft', 'topRight', 'center', 'bottomLeft', 'bottomRight'];

storiesOf('CartCount', module).add('basic usage', () => (
  <CartCount
    textPosition={select('Position', positions, 'topRight') as TextPositions}
    count={number('Count', 8)}
  />
));
