import React from 'react';
import { StyleSheet, View } from 'react-native';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import {
  number,
  object,
  text
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { ActionBar } from '../src/components/ActionBar';
import { Button } from '../src/components/Button';

const defaultStyle = {
  width: 250,
  margin: 5
};

const styles = StyleSheet.create({
  twoButtonViewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});

const renderButton = (): JSX.Element => {
  return (
    <Button
      onPress={action('onPress')}
      title={text('Title', 'Button Title')}
      style={object('Style', defaultStyle)}
    />
  );
};

storiesOf('Button', module)
  .add('single button', renderButton)
  .add('two buttons', () => {
    return (
      <View style={styles.twoButtonViewStyle}>
        {renderButton()}
        {renderButton()}
      </View>
    );
  })
  .add('two buttons in action bar', () => (
    <ActionBar
      separatorWidth={number('Separator Width', 10)}
    >
      {renderButton()}
      {renderButton()}
    </ActionBar>
  ));
