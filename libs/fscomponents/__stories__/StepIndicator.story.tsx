import React from 'react';

import { StyleSheet } from 'react-native';

import { boolean, number, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import type { IdStep } from '../src/components/StepIndicator';
import { StepIndicator } from '../src/components/StepIndicator';

const styles = StyleSheet.create({
  completed: {
    backgroundColor: '#ddd',
    borderWidth: 0,
  },
  completedText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
  current: {
    backgroundColor: 'rgb(88, 89, 91)',
    borderWidth: 0,
  },
  currentText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  default: {
    backgroundColor: '#bbb',
    borderWidth: 0,
  },
  defaultText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

const stepTitles: Array<IdStep | string> = [
  {
    id: 1,
    name: 'Delivery',
  },
  {
    id: 2,
    name: 'Shipping',
  },
  {
    id: 3,
    name: 'Payment',
  },
];

const stepKnobOptions = {
  range: true,
  min: 0,
  max: 2,
  step: 1,
};

storiesOf('StepIndicator', module).add('basic usage', () => (
  <StepIndicator
    completedStyle={styles.completed}
    completedTextStyle={styles.completedText}
    currentStep={number('currentStep', 0, stepKnobOptions)}
    currentStyle={styles.current}
    currentTextStyle={styles.currentText}
    defaultStyle={styles.default}
    defaultTextStyle={styles.defaultText}
    line={boolean('Line', false)}
    stepTitles={object('stepTitles', stepTitles)}
  />
));
