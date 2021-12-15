import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  number,
  object,
  text
} from '@storybook/addon-knobs';
import { Selector } from '../src/components/Selector';

const defaultStyle = {
  padding: 15
};
storiesOf('Selector', module)
  .add('basic usage', () => {
    const testItems = [...Array(number('itemsCount', 10))].map((x, i) => ({
      label: `Product ${i + 1}`,
      value: `id-${i + 1}`
    }));
    return (
      <Selector
          style={object('defaultStyle', defaultStyle)}
          items={testItems}
          title={text('title', 'Select Product')}
          onValueChange={action('Selector onValueChange')}
      />
    );
  });
