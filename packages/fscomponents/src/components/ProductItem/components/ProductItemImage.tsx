import React, { Component } from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  View
} from 'react-native';

import { ProductItemProps } from '../ProductItem';

const style = StyleSheet.create({
  image: {
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

export interface ProductItemImageState {
  calculatedImageStyle: ImageStyle;
}

export class ProductItemImage extends Component<ProductItemImageProps, ProductItemImageState> {
  state: ProductItemImageState = {
    calculatedImageStyle: {}
  };

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
      <View style={[style.imageContainer, imageContainerStyle]} onLayout={this.onLayout}>
        <Image
          resizeMode='contain'
          source={image}
          style={[style.image, this.state.calculatedImageStyle, imageStyle]}
        />
      </View>
    );
  }

  onLayout = (event: any) => {
    const { images, imageStyle } = this.props;
    const containerWidth = event.nativeEvent.layout.width;

    // If an imageStyle is provided don't attempt to caulcate one
    if (imageStyle) {
      return;
    }

    // Calcuate image width to fit container and height to maintain aspect ratio
    const image = images && images.find(img => !!img.uri) || this.props.image;
    if (image && image.uri) {
      Image.getSize(image.uri, (width, height) => {
        const calculatedHeight = Math.round((containerWidth * height) / width);

        this.setState({
          calculatedImageStyle: {
            width: containerWidth,
            height: calculatedHeight
          }
        });
      }, () => {
        // Do nothing on error
        return null;
      });
    }
  }
}
