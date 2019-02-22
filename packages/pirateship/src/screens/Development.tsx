/* tslint:disable:jsx-use-translation-function */
// We don't need to worry about translating the element strings
// in this file since it should only be used in development
import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import PSScreenWrapper from '../components/PSScreenWrapper';
import Row from '../components/PSRow';
import { NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { navBarTabLanding } from '../styles/Navigation';
import { fontSize } from '../styles/variables';
import withAccount, { AccountProps } from '../providers/accountProvider';
import { Accordion } from '@brandingbrand/fscomponents';

type Screen = import ('react-native-navigation').Screen;

const screens: Screen[] = [
  { title: 'Product Index', screen: 'ProductIndex' },
  { title: 'Product Detail', screen: 'ProductDetail' }
];

export interface DevelopmentScreenState {
  deviceToken: string;
}

export interface DevelopmentScreenProps extends ScreenProps, AccountProps {}

const styles = StyleSheet.create({
  header: {
    fontSize: fontSize.huge
  },
  section: {
    padding: 15
  }
});

class Development extends Component<DevelopmentScreenProps, DevelopmentScreenState> {
  static navigatorStyle: NavigatorStyle = navBarTabLanding;

  state: DevelopmentScreenState = {
    deviceToken: 'NOT INITIALIZED'
  };

  render(): JSX.Element {
    const { navigator } = this.props;
    const title = <Text>Menu Item</Text>;
    const icons = {
      closed: require('../../assets/images/alert.png'),
      open: require('../../assets/images/check.png')
    };
    const content = (
      <View>
        <Text>Sub Menu Item</Text>
      </View>
    );
    const imageContent = (
      <View>
        <Text>Sub Menu Item</Text>
        <Image
          resizeMode='contain'
          source={{ uri: 'https://via.placeholder.com/350x150' }}
          style={{ height: 150, width: 350 }}
        />
      </View>
    );

    return (
      <PSScreenWrapper
        hideGlobalBanner={true}
        navigator={navigator}
      >
        <View style={styles.section}>
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
        <View style={styles.section}>
          <Text style={styles.header}>{'Accordion Component'}</Text>
          <Accordion
            title={title}
            content={content}
          />
          <Accordion
            title={title}
            content={imageContent}
          />
          <Accordion
            title={title}
            content={content}
            iconFormat={'arrow'}
          />
          <Accordion
            title={title}
            content={content}
            iconFormat={'image'}
            openIconImage={icons.open}
            closedIconImage={icons.closed}
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
