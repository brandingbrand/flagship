import React from 'react';

import { number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import type { TextPositions } from '../src/components/CartCount';
import { CartCount } from '../src/components/CartCount';

const positions = ['topLeft', 'topRight', 'center', 'bottomLeft', 'bottomRight'];

storiesOf('CartCount', module).add('basic usage', () => (
  <CartCount
    count={number('Count', 8)}
    textPosition={select('Position', positions, 'topRight') as TextPositions}
  />
));
