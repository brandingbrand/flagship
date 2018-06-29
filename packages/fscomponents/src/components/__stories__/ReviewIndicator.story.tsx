import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
  number,
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { ReviewIndicator } from '../ReviewIndicator';

storiesOf('ReviewIndicator', module)
  .add('basic usage', () => (
    <ReviewIndicator
      value={number('value', 3.4)}
      itemSize={number('itemSize', 30)}
      itemColor={text('itemColor', 'yellow')}
      style={{ padding: 10 }}
    />
  ));
