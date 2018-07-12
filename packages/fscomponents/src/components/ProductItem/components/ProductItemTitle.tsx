import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ProductItemProps } from '../ProductItem';
import { types, weights } from '../../../styles/variables';

const styles = StyleSheet.create({
  title: {
    marginBottom: 7
  }
});

export type ProductItemTitleProps = Pick<ProductItemProps, 'title' | 'titleStyle' | 'renderTitle'>;

export class ProductItemTitle extends Component<ProductItemTitleProps> {
  render(): React.ReactNode {
    const { title, titleStyle, renderTitle } = this.props;

    if (renderTitle) {
      return renderTitle();
    }

    if (!title) {
      return null;
    }

    return <Text style={[types.regular, weights.medium, styles.title, titleStyle]}>{title}</Text>;
  }
}
