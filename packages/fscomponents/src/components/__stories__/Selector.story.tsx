import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  number,
  object,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { Selector } from '../Selector';

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
