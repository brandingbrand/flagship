import React from 'react';
import { StyleSheet, View } from 'react-native';
import { storiesOf } from '@storybook/react';
import { number } from '@storybook/addon-knobs';
import { PageIndicator } from '../src/components/PageIndicator';

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
});

const stepKnobOptions = {
  range: true,
  min: 0,
  max: 2,
  step: 1,
};

storiesOf('PageIndicator', module).add('basic usage', () => (
  <View style={styles.container}>
    <PageIndicator currentIndex={number('currentStep', 0, stepKnobOptions)} itemsCount={3} />
  </View>
));
