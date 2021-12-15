import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { SelectableList } from '../src/components/SelectableList';
import { CommerceTypes } from '@brandingbrand/fscommerce';

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
    onChange={action('onChange')}
    items={itemList}
    applyButton={boolean('Has Apply Button', true)}
    style={{
      paddingBottom: 100,
    }}
  />
));
