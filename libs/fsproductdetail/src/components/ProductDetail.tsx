import React, { Component } from 'react';

import { Platform, Text, View } from 'react-native';

import type { CommerceDataSource, CommerceTypes } from '@brandingbrand/fscommerce';

import type {
  WithProductDetailProps,
  WithProductDetailProviderProps,
} from './ProductDetailProvider';
import { default as withProductDetailData } from './ProductDetailProvider';

export interface UnwrappedProductDetailProps {
  id: string;
}

export type ProductDetailProduct = CommerceTypes.Product;
export type ProductDetailProps = UnwrappedProductDetailProps & WithProductDetailProviderProps;

class ProductDetail extends Component<UnwrappedProductDetailProps & WithProductDetailProps> {
  public render(): JSX.Element {
    const data = JSON.stringify(this.props.commerceData, null, 2);
    if (Platform.OS === 'web') {
      return <pre>{data}</pre>;
    }
    return (
      <View>
        <Text>{data}</Text>
      </View>
    );
  }
}

export default withProductDetailData<UnwrappedProductDetailProps>(
  async (DataSource: CommerceDataSource, props: UnwrappedProductDetailProps) =>
    DataSource.fetchProduct(props.id)
)(ProductDetail);
