import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
  number
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { ReviewsSummary } from '../src/components/ReviewsSummary';

storiesOf('ReviewsSummary', module)
  .add('basic usage', () => (
    <ReviewsSummary
      value={number('value', 4.2)}
      count={number('count', 12)}
      recommend={number('recommend', 80)}
    />
  ));
