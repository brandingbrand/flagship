/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element
// strings in this file since this is mainly a demo

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  number,
  object
// tslint:disable-next-line no-submodule-imports no-implicit-dependencies
} from '@storybook/addon-knobs/react';
import { ActionBar } from '../ActionBar';

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'lightblue',
    padding: 10
  },
  text: {
    textAlign: 'center'
  }
});

const defaultStyle = {
  padding: 5,
  backgroundColor: '#efefef'
};

storiesOf('ActionBar', module)
  .add('two buttons', () => (
    <ActionBar
      style={object('Style', defaultStyle)}
      separatorWidth={number('Separator Width', 10)}
    >
      <TouchableOpacity onPress={action('onPress Action 1')} style={styles.button}>
        <Text style={styles.text}>Action 1</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={action('onPress Action 2')} style={styles.button}>
        <Text style={styles.text}>Action 2</Text>
      </TouchableOpacity>
    </ActionBar>
  ));
