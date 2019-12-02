/* tslint:disable:jsx-use-translation-function */
import React, { Component } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { LayoutComponent, Options } from 'react-native-navigation';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { ScreenProps } from '../lib/commonTypes';
import { navBarTabLanding } from '../styles/Navigation';
import { ActionBar, ActionBarProps, Button } from '@brandingbrand/fscomponents';
import { palette } from '../styles/variables';

const styles = StyleSheet.create({
  section: {
    padding: 15
  },
  buttons: {
    width: 250,
    margin: 5
  },
  title: {
    color: palette.onPrimary
  }
});

const triggerButton = () => {
  Alert.alert('Button Pressed');
};

const renderButton = (title: string): JSX.Element => {
  return (
    <Button
      onPress={triggerButton}
      title={title}
      style={styles.buttons}
      titleStyle={styles.title}
    />
  );
};


export interface ActionBarSampleScreenProps extends ScreenProps, ActionBarProps {}

class ActionBarSample extends Component<ActionBarSampleScreenProps> {
  static options: Options = navBarTabLanding;

  render(): JSX.Element {
    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={this.props.navigator}
      >
        <View style={styles.section}>
          <ActionBar
            separatorWidth={10}
          >
            {renderButton('watch now')}
            {renderButton('browse favorites')}
          </ActionBar>
        </View>
      </PSScreenWrapper>
    );
  }

  goTo = (component: LayoutComponent) => () => {
    this.props.navigator.push({ component })
    .catch(e => console.warn(`${component.name} PUSH error: `, e));
  }
}

export default ActionBarSample;
