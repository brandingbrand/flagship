import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import { FilterList } from '../src/components/FilterList/FilterList';

const items = Array(10)
  .fill(true)
  .map((v, i) => ({
    id: `id-${i}`,
    title: `title-${i}`,
    values: Array(5)
      .fill(true)
      .map((v, i) => ({ value: `value-${i}`, title: `value-title-${i}` }))
  }));

storiesOf('FilterList', module)
  .add('basic usage', () => (
    <FilterList
      items={items}
      onApply={action('FilterList onApply')}
      onReset={action('FilterList onReset')}
    />
  ));
