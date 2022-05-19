import React from 'react';

import { number, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { ReviewIndicator } from '../src/components/ReviewIndicator';

storiesOf('ReviewIndicator', module).add('basic usage', () => (
  <ReviewIndicator
    itemColor={text('itemColor', 'yellow')}
    itemSize={number('itemSize', 30)}
    style={{ padding: 10 }}
    value={number('value', 3.4)}
  />
));
