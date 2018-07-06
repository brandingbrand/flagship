import React, { Component } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import PSLoading from './PSLoading';
import PSRow from './PSRow';
import { border, fontSize, palette } from '../styles/variables';
import { CommerceTypes } from '@brandingbrand/fscommerce';

const styles = StyleSheet.create({
  loading: {
    paddingVertical: 20
  },
  arrow: {
    transform: [{ rotate: '180deg' }],
    width: 15,
    height: 15
  },
  row: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: border.width,
    borderBottomColor: border.color,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50
  },
  title: {
    fontSize: fontSize.base,
    color: palette.onBackground
  }
});

export interface PSShopLandingCategoriesProps {
  style?: StyleProp<ViewStyle>;
  onItemPress: (item: CommerceTypes.Category) => void;
  categories: CommerceTypes.Category[];
}

export default class PSShopLandingCategories extends Component<
  PSShopLandingCategoriesProps
> {
  handleItemPress = (category: CommerceTypes.Category) => () => {
    this.props.onItemPress(category);
  }

  renderContent(): JSX.Element | JSX.Element[] {
    if (!this.props.categories) {
      return <PSLoading style={styles.loading} />;
    }

    return this.props.categories.map((category, i) => (
      <PSRow
        key={i}
        title={category.title}
        onPress={this.handleItemPress(category)}
        showImage={true}
      />
    ));
  }

  render(): JSX.Element {
    return <View style={this.props.style}>{this.renderContent()}</View>;
  }
}
