/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element strings
// in this file since it should only be used in development
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PSScreenWrapper from '../components/PSScreenWrapper';
import Row from '../components/PSRow';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarTabLanding } from '../styles/Navigation';
import { fontSize } from '../styles/variables';
import withAccount, { AccountProps } from '../providers/accountProvider';
import { Breadcrumbs } from '@brandingbrand/fscomponents';

type Screen = import ('react-native-navigation').Screen;

const screens: Screen[] = [
  { title: 'Product Index', screen: 'ProductIndex' },
  { title: 'Product Detail', screen: 'ProductDetail' }
];

const styles = StyleSheet.create({
  header: {
    fontSize: fontSize.huge
  }
});

export interface DevelopmentScreenState {
  deviceToken: string;
}

export interface DevelopmentScreenProps extends ScreenProps, AccountProps {}

class Development extends Component<DevelopmentScreenProps, DevelopmentScreenState> {
  static navigatorStyle: NavigatorStyle = navBarTabLanding;

  state: DevelopmentScreenState = {
    deviceToken: 'NOT INITIALIZED'
  };

  render(): JSX.Element {
    const { navigator } = this.props;
    const screenTitles = ['Search', 'More', 'Cart'];
    const screenCrumbs = screenTitles.map(crumb => {
      return {
        title: crumb,
        onPress: this.goTo({ title: crumb, screen: crumb, navigatorStyle: navBarTabLanding })
      };
    });

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={navigator}
      >
        <View style={{padding: 15}}>
          <Text style={styles.header}>{'PSRow Component'}</Text>
          {screens.map((screen, i) => (
            <Row
              key={i}
              title={screen.title || `Screen ${i}`}
              onPress={this.goTo(screen)}
            />
          ))}
          <Row
            title='Sign Out without clearing saved credentials'
            onPress={this.softSignOut}
          />
        </View>
        <View style={{padding: 15}}>
          <Text style={styles.header}>{'Breadcrumbs Component'}</Text>
          <Breadcrumbs
            items={screenCrumbs}
            separator={'•'}
            showTrailingSeparator={false}
          />
        </View>
      </PSScreenWrapper>
    );
  }

  goTo = (screen: Screen) => () => {
    this.props.navigator.push(screen);
  }

  softSignOut = () => {
    const noop = () => undefined;
    this.props.signOut(false).then(noop).catch(noop);
  }
}

export default withAccount(Development);
