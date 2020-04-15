import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean,
  number,
  object,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { Swatches } from '../Swatches';

const containerStyle = { padding: 0 };
const labelStyle = { padding: 0 };
const showMoreLess = false;
const swatchSize = 25;
const maxSwatches = 6;
const title = 'Selected';
const items = [
  { color: 'red', name: 'red' },
  { color: 'green', name: 'green' },
  { color: 'blue', name: 'blue' },
  { color: 'red', name: 'red' },
  { color: 'green', name: 'green' },
  { color: 'blue', name: 'blue' },
  { color: 'red', name: 'red', available: false },
  { color: 'green', name: 'green', available: false },
  { color: 'blue', name: 'blue', available: false }
];

storiesOf('Swatches', module)
  .add('basic usage', () => (
    <Swatches
      label={boolean('label', true)}
      title={text('title', title)}
      moreLessStyle={{ display: boolean('showMoreLess', showMoreLess) ? 'flex' : 'none'}}
      maxSwatches={number('maxSwatches', maxSwatches)}
      colorContainerStyle={{
        height: number('swatchSize', swatchSize),
        width: number('swatchSize', swatchSize)
      }}
      labelTitleStyle={object('labelStyle', labelStyle)}
      style={object('containerStyle', containerStyle)}
      items={items as any}
      onChangeSwatch={action('Swatches onChangeSwatch')}
    />
  ));
