import React, { Component } from 'react';
import {
  StyleSheet,
  Text
} from 'react-native';
import { ProductItemProps } from '../ProductItemProps';

const style = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold'
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

    return <Text style={[style.title, titleStyle]}>{title}</Text>;
  }
}
