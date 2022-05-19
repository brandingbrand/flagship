import React from 'react';

import { StyleSheet, View } from 'react-native';

import { action } from '@storybook/addon-actions';
import { number, object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { ActionBar } from '../src/components/ActionBar';
import { Button } from '../src/components/Button';

const defaultStyle = {
  width: 250,
  margin: 5,
};

const styles = StyleSheet.create({
  twoButtonViewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

const renderButton = (): JSX.Element => (
  <Button
    onPress={action('onPress')}
    style={object('Style', defaultStyle)}
    title={text('Title', 'Button Title')}
  />
);

storiesOf('Button', module)
  .add('single button', renderButton)
  .add('two buttons', () => (
    <View style={styles.twoButtonViewStyle}>
      {renderButton()}
      {renderButton()}
    </View>
  ))
  .add('two buttons in action bar', () => (
    <ActionBar separatorWidth={number('Separator Width', 10)}>
      {renderButton()}
      {renderButton()}
    </ActionBar>
  ));
