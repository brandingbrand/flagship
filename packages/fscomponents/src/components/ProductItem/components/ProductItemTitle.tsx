import React, { FunctionComponent } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ProductItemProps } from '../ProductItem';
import { types, weights } from '../../../styles/variables';

const styles = StyleSheet.create({
  title: {
    marginBottom: 7
  }
});

export type ProductItemTitleProps = Pick<ProductItemProps, 'title' | 'titleStyle' | 'renderTitle'>;

export const ProductItemTitle: FunctionComponent<ProductItemTitleProps> =
(props): React.ReactElement | null => {
  const { title, titleStyle, renderTitle } = props;

  if (renderTitle) {
    return renderTitle();
  }

  if (!title) {
    return null;
  }

  return <Text style={[types.regular, weights.medium, styles.title, titleStyle]}>{title}</Text>;
};

