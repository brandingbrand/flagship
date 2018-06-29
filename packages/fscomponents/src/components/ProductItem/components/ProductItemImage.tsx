import React, { PureComponent } from 'react';
import {
  Image,
  StyleSheet,
  View
} from 'react-native';

import { ProductItemProps } from '../ProductItemProps';

const style = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    marginBottom: 10
  },
  imageContainer: {
    alignItems: 'center'
  }
});

export type ProductItemImageProps = Pick<
  ProductItemProps,
  'image' | 'images' | 'imageStyle' | 'imageContainerStyle' | 'renderImage'
>;

export class ProductItemImage extends PureComponent<ProductItemImageProps> {
  render(): React.ReactNode {
    const {
      images,
      imageStyle,
      imageContainerStyle,
      renderImage
    } = this.props;

    if (renderImage) {
      return renderImage();
    }

    const image = images && images.find(img => !!img.uri) || this.props.image;

    if (!image) {
      return null;
    }

    return (
      <View style={[style.imageContainer, imageContainerStyle]}>
        <Image source={image} style={[style.image, imageStyle]} />
      </View>
    );
  }
}
