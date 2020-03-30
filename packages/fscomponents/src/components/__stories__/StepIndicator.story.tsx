import React from 'react';
import { StyleSheet } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
  number,
  object
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { StepIndicator } from '../StepIndicator';

const styles = StyleSheet.create({
  completed: {
    backgroundColor: '#ddd',
    borderWidth: 0,
    width: 100,
    flex: 0
  },
  completedText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#999'
  },
  current: {
    borderWidth: 0,
    backgroundColor: 'rgb(88, 89, 91)',
    width: 100
  },
  currentText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff'
  },
  default: {
    backgroundColor: '#bbb',
    borderWidth: 0
  },
  defaultText: {
    fontSize: 12,
    textAlign: 'center'
  }
});

const stepTitles = [
  '1. Delivery',
  '2. Shipping',
  '3. Payment'
];

const stepKnobOptions = {
  range: true,
  min: 0,
  max: 2,
  step: 1
};

storiesOf('StepIndicator', module)
  .add('basic usage', () => (
    <StepIndicator
      completedStyle={styles.completed}
      completedTextStyle={styles.completedText}
      currentStyle={styles.current}
      currentTextStyle={styles.currentText}
      currentStep={number('currentStep', 0, stepKnobOptions)}
      defaultStyle={styles.default}
      defaultTextStyle={styles.defaultText}
      stepTitles={object('stepTitles', stepTitles)}
    />
  ));
