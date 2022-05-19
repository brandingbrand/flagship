import React from 'react';

import type { TextStyle } from 'react-native';

import { action } from '@storybook/addon-actions';
import { boolean, number, object, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import clearIcon from '../assets/images/clear.png';
import { Stepper } from '../src/components/Stepper';

const formats = ['horizontalCenter', 'horizontalLeft', 'vertical'];

const defaultCounterStyle = {
  color: '#000',
  marginRight: 10,
  marginLeft: 10,
  fontSize: 16,
};

const defaultQtyStyle = {
  fontSize: 16,
};
const defaultPrefixStyle: TextStyle = {
  fontWeight: 'bold',
};

storiesOf('Stepper', module).add('basic usage', () => (
  <Stepper
    count={2}
    countUpperLimit={number('countUpperLimit', 10)}
    counterStyle={object('defaultCounterStyle', defaultCounterStyle)}
    editable={boolean('editable', false)}
    format={select('format', formats, 'horizontalCenter') as any}
    onDecreaseButtonPress={action('Stepper onDecreaseButtonPress')}
    onIncreaseButtonPress={action('Stepper onIncreaseButtonPress')}
    prefix={text('prefix', '')}
    prefixStyle={object('Prefix Text Style', defaultPrefixStyle)}
    qtyStyle={object('Quantity Text Style', defaultQtyStyle)}
    removeButtonImage={boolean('Use Remove Image Button', false) ? clearIcon : undefined}
  />
));
