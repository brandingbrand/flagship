/* tslint:disable:jsx-use-translation-function */
import React, { Component } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import PSScreenWrapper from '../components/PSScreenWrapper';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarTabLanding } from '../styles/Navigation';
import { ActionBar, ActionBarProps, Button } from '@brandingbrand/fscomponents';
import { palette } from '../styles/variables';

type Screen = import ('react-native-navigation').Screen;

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
  static navigatorStyle: NavigatorStyle = navBarTabLanding;

  render(): JSX.Element {

    const { navigator } = this.props;

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={navigator}
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

  goTo = (screen: Screen) => () => {
    this.props.navigator.push(screen);
  }
}

export default ActionBarSample;
