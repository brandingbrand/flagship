import React from 'react';

import { number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { ReviewsSummary } from '../src/components/ReviewsSummary';

storiesOf('ReviewsSummary', module).add('basic usage', () => (
  <ReviewsSummary
    count={number('count', 12)}
    recommend={number('recommend', 80)}
    value={number('value', 4.2)}
  />
));
