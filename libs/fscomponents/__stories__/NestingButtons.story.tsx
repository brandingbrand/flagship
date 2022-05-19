import React from 'react';

import { number, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { NestingButtons } from '../src/components/NestingButtons';

const onPress = (index: number) => () => {
  console.log(`Button ${index} pressed.`);
};
const generateButtons = (num: number) =>
  new Array(num).fill(null).map((n, index) => ({
    title: `Button ${index}`,
    onPress: onPress(index),
  }));

storiesOf('NestingButtons', module).add('basic usage', () => (
  <NestingButtons
    buttonsProps={generateButtons(number('Number of Buttons', 5))}
    maxCount={number('Max Number of Buttons', 3)}
    modalTitle={text('Modal Header Text', 'Modal Header')}
    showMoreTitle={text('Show More Title', 'Checkout Options')}
  />
));
