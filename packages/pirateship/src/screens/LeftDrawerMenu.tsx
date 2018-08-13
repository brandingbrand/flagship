/* tslint:disable:jsx-use-translation-function */

import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScreenProps } from '../lib/commonTypes';
import GlobalStyles from '../styles/Global';
import { padding, palette } from '../styles/variables';

const links = [{
  screen: 'Shop',
  title: 'Shop'
}, {
  screen: 'Cart',
  title: 'Cart'
}, {
  screen: 'Account',
  title: 'Account'
}, {
  screen: 'More',
  title: 'More'
}];

export default class LeftDrawerMenu extends Component<ScreenProps> {
  render(): JSX.Element {
    return (
      <View>
        {links.map(this.renderLink)}
      </View>
    );
  }

  renderLink = (link: any, index: number): JSX.Element => {
    return (
      <TouchableOpacity
        key={index}
        onPress={this.goTo(link.screen)}
        style={{
          padding: padding.base,
          borderBottomWidth: 1,
          borderBottomColor: palette.secondary
        }}
      >
        <Text
          style={[GlobalStyles.h1]}
        >
          {link.title}
        </Text>
      </TouchableOpacity>
    );
  }

  goTo = (screen: string) => {
    return () => {
      this.props.navigator.push({ screen });
      this.props.navigator.toggleDrawer({
        side: 'left',
        to: 'closed'
      });
    };
  }
}
