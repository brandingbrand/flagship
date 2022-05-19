import React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { FilterList } from '../src/components/FilterList/FilterList';

const items = Array.from({ length: 10 })
  .fill(true)
  .map((v, i) => ({
    id: `id-${i}`,
    title: `title-${i}`,
    values: Array.from({ length: 5 })
      .fill(true)
      .map((v, i) => ({ value: `value-${i}`, title: `value-title-${i}` })),
  }));

storiesOf('FilterList', module).add('basic usage', () => (
  <FilterList
    items={items}
    onApply={action('FilterList onApply')}
    onReset={action('FilterList onReset')}
  />
));
