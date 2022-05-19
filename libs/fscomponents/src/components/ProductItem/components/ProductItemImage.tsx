import React, { Component } from 'react';

import type { ImageStyle, LayoutChangeEvent } from 'react-native';
import { Image, StyleSheet, View } from 'react-native';

import type { ProductItemProps } from '../ProductItem';

const style = StyleSheet.create({
  image: {
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
  },
});

export type ProductItemImageProps = Pick<
  ProductItemProps,
  'image' | 'imageContainerStyle' | 'images' | 'imageStyle' | 'renderImage'
>;

export interface ProductItemImageState {
  calculatedImageStyle: ImageStyle;
}

export class ProductItemImage extends Component<ProductItemImageProps, ProductItemImageState> {
  public state: ProductItemImageState = {
    calculatedImageStyle: {},
  };

  private readonly onLayout = (event: LayoutChangeEvent) => {
    const { imageStyle, images } = this.props;
    const containerWidth = event.nativeEvent.layout.width;

    // If an imageStyle is provided don't attempt to caulcate one
    if (imageStyle) {
      return;
    }

    // Calcuate image width to fit container and height to maintain aspect ratio
    const image = (images && images.find((img) => Boolean(img.uri))) || this.props.image;
    if (image?.uri) {
      Image.getSize(
        image.uri,
        (width, height) => {
          const calculatedHeight = Math.round((containerWidth * height) / width);

          this.setState({
            calculatedImageStyle: {
              width: containerWidth,
              height: calculatedHeight,
            },
          });
        },
        () =>
          // Do nothing on error
          null
      );
    }
  };

  public render(): React.ReactNode {
    const { imageContainerStyle, imageStyle, images, renderImage } = this.props;

    if (renderImage) {
      return renderImage();
    }

    const image = (images && images.find((img) => Boolean(img.uri))) || this.props.image;

    if (!image) {
      return null;
    }

    return (
      <View onLayout={this.onLayout} style={[style.imageContainer, imageContainerStyle]}>
        <Image
          resizeMode="contain"
          source={image}
          style={[style.image, this.state.calculatedImageStyle, imageStyle]}
        />
      </View>
    );
  }
}
