import React, { Component } from 'react';

import { StyleSheet, Text } from 'react-native';

import { types, weights } from '../../../styles/variables';
import type { ProductItemProps } from '../ProductItem';

const styles = StyleSheet.create({
  title: {
    marginBottom: 7,
  },
});

export type ProductItemTitleProps = Pick<ProductItemProps, 'renderTitle' | 'title' | 'titleStyle'>;

export class ProductItemTitle extends Component<ProductItemTitleProps> {
  public render(): React.ReactNode {
    const { renderTitle, title, titleStyle } = this.props;

    if (renderTitle) {
      return renderTitle();
    }

    if (!title) {
      return null;
    }

    return <Text style={[types.regular, weights.medium, styles.title, titleStyle]}>{title}</Text>;
  }
}
