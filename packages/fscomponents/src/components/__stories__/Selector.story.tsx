import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  text
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { Selector } from '../Selector/Selector';

const testItems = [...Array(10)].map((x, i) => ({
  label: 'Product ' + i,
  value: 'id-' + i
}));

storiesOf('Selector', module)
  .add('basic usage', () => (
    <Selector
      style={{ padding: 15 }}
      items={testItems}
      title={text('title', 'Select Product')}
      onValueChange={action('Selector onValueChange')}
    />
  ));
