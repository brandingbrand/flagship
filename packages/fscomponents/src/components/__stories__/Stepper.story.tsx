import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean,
  number,
  object,
  select,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { Stepper } from '../Stepper';
import { TextStyle } from 'react-native';

const formats = [
  'horizontalCenter',
  'horizontalLeft',
  'vertical'
];

const defaultCounterStyle = {
  color: '#000',
  marginRight: 10,
  marginLeft: 10,
  fontSize: 16
};

const defaultQtyStyle = {
  fontSize: 16
};
const defaultPrefixStyle: TextStyle = {
  fontWeight: 'bold'
};

const clearIcon = require('../../../assets/images/clear.png');

storiesOf('Stepper', module)
  .add('basic usage', () => (
    <Stepper
      format={select('format', formats, 'horizontalCenter') as any}
      count={2}
      counterStyle={object('defaultCounterStyle', defaultCounterStyle)}
      editable={boolean('editable', false)}
      prefix={text('prefix', '')}
      countUpperLimit={number('countUpperLimit', 10)}
      onDecreaseButtonPress={action('Stepper onDecreaseButtonPress')}
      onIncreaseButtonPress={action('Stepper onIncreaseButtonPress')}
      qtyStyle={object('Quantity Text Style', defaultQtyStyle)}
      prefixStyle={object('Prefix Text Style', defaultPrefixStyle)}
      removeButtonImage={boolean('Use Remove Image Button', false) && clearIcon}
    />
  ));
