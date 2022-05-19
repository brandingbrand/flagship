import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { FilterListDrilldown } from '../src/components/FilterList/FilterListDrilldown';

const items = Array.from({ length: 10 })
  .fill(true)
  .map((v, i) => ({
    id: `id-${i}`,
    title: `title-${i}`,
    values: Array.from({ length: 5 })
      .fill(true)
      .map((v, i) => ({ value: `value-${i}`, title: `value-title-${i}` })),
  }));

items.unshift({
  id: 'sort',
  title: 'Sort By',
  values: [
    {
      title: `sort item 1`,
      value: `sort-value-1`,
    },
    {
      title: `sort item 2`,
      value: `sort-value-2`,
    },
    {
      title: `sort item 3`,
      value: `sort-value-3`,
    },
    {
      title: `sort item 4`,
      value: `sort-value-4`,
    },
    {
      title: `sort item 5`,
      value: `sort-value-5`,
    },
    {
      title: `sort item 6`,
      value: `sort-value-6`,
    },
  ],
});

storiesOf('FilterListDrilldown', module).add('basic usage', () => (
  <FilterListDrilldown
    applyOnSelect
    items={items}
    onApply={action('FilterList onApply')}
    onClose={boolean('Show Close', true) ? action('FilterList onClose') : undefined}
    onReset={action('FilterList onReset')}
    secondLevelShowApply={boolean('Show Second Level Apply', false)}
    secondLevelShowClose={boolean('Show Second Level Close', false)}
    showSelectedCount={boolean('Show Selected Count', false)}
    showUnselected={boolean('Show Unselected', false)}
    singleFilterIds={['sort']}
  />
));
