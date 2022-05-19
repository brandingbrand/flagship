import React from 'react';

import type { CommerceTypes } from '@brandingbrand/fscommerce';

import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { SelectableList } from '../src/components/SelectableList';

const itemList: CommerceTypes.SortingOption[] = [
  {
    id: '0',
    title: text('Title 1', 'Title 1'),
  },
  {
    id: '1',
    title: text('Title 2', 'Title 2'),
  },
];

storiesOf('SelectableList', module).add('basic usage', () => (
  <SelectableList
    applyButton={boolean('Has Apply Button', true)}
    items={itemList}
    onChange={action('onChange')}
    style={{
      paddingBottom: 100,
    }}
  />
));
