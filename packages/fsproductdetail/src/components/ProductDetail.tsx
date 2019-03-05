import React, { FunctionComponent, memo } from 'react';
import { Platform, Text, View } from 'react-native';

import {
  default as withProductDetailData,
  WithProductDetailProps,
  WithProductDetailProviderProps
} from './ProductDetailProvider';

import {
  CommerceDataSource,
  CommerceTypes
} from '@brandingbrand/fscommerce';

export interface UnwrappedProductDetailProps {
  id: string;
}

export type ProductDetailProduct = CommerceTypes.Product;
export type ProductDetailProps = UnwrappedProductDetailProps & WithProductDetailProviderProps;

const ProductDetail: FunctionComponent<UnwrappedProductDetailProps
& WithProductDetailProps> = memo((props): JSX.Element => {
  const data = JSON.stringify(props.commerceData, null, 2);

  if (Platform.OS === 'web') {
    return <pre>{data}</pre>;

  } else {
    return (
      <View>
        <Text>{data}</Text>
      </View>
    );
  }
});

export default withProductDetailData<UnwrappedProductDetailProps>(
  async (DataSource: CommerceDataSource, props: UnwrappedProductDetailProps) => {
    return DataSource.fetchProduct(props.id);
  }
)(ProductDetail);
