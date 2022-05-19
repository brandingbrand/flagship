import React from 'react';

import { action } from '@storybook/addon-actions';
import { number, object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { Selector } from '../src/components/Selector';

const defaultStyle = {
  padding: 15,
};
storiesOf('Selector', module).add('basic usage', () => {
  const testItems = [...new Array(number('itemsCount', 10))].map((x, i) => ({
    label: `Product ${i + 1}`,
    value: `id-${i + 1}`,
  }));
  return (
    <Selector
      items={testItems}
      onValueChange={action('Selector onValueChange')}
      style={object('defaultStyle', defaultStyle)}
      title={text('title', 'Select Product')}
    />
  );
});
