import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { padding, palette } from '../styles/variables';
import GlobalStyles from '../styles/Global';

export interface HeaderProps {
  navigator: import ('react-native-navigation').Navigator;
}

const title = 'PIRATESHIP';
const menuIcon = require('../../assets/images/menu-icon.png');
const cartIcon = require('../../assets/images/cart-tab-icon.png');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.background,
    padding: padding.base
  }
});

class Header extends Component<HeaderProps> {
  render(): JSX.Element {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.toggleLeftDrawer}>
          <Image source={menuIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goTo('Shop')}>
          <Text style={GlobalStyles.h1}>
            {title}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goTo('Cart')}>
          <Image source={cartIcon}/>
        </TouchableOpacity>
      </View>
    );
  }

  toggleLeftDrawer = () => {
    return this.props.navigator.toggleDrawer({ side: 'left' });
  }

  goTo = (screen: string) => {
    return () => this.props.navigator.push({ screen });
  }
}

export default Header;
