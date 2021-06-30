import React from 'react';
import { StyleSheet } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
  boolean,
  number,
  object
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { IdStep, StepIndicator } from '../StepIndicator';

const styles = StyleSheet.create({
  completed: {
    backgroundColor: '#ddd',
    borderWidth: 0
  },
  completedText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#999'
  },
  current: {
    borderWidth: 0,
    backgroundColor: 'rgb(88, 89, 91)'
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

const stepTitles: (string | IdStep)[] = [{
  id: 1,
  name: 'Delivery'
}, {
  id: 2,
  name: 'Shipping'
}, {
  id: 3,
  name: 'Payment'
}];

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
      line={boolean('Line', false)}
    />
  ));
