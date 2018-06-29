/**
 * Abstract component for collections of CMS banners. At the very least a render() function
 * needs to be implemented.
 */

import React, { Component } from 'react';

import {
  Image,
  LayoutRectangle,
  Linking,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';
import { TouchableOpacityLink } from './TouchableOpacityLink';


export interface CMSBannerProps {
  imageContainerStyle?: StyleProp<ViewStyle>;
  imageHeight?: number;
  imageWidth?: number;
  onPress?: (instance: any) => void;
  style?: StyleProp<ViewStyle>;
  cmsData?: any;
}

export interface CMSBannerState {
  containerWidth: number;
}

export abstract class CMSBanner<P extends CMSBannerProps>
  extends Component<P, CMSBannerState> {

  state: CMSBannerState = {
    containerWidth: 0
  };

  // Invoked on mount and whenever the layout changes. The code to render
  // images does calculations based on width of the parent container, so
  // this will update the width in the state so the component re-renders
  // whenever the view is resized.
  handleOnLayout = (e: { nativeEvent: { layout: LayoutRectangle } }) => {
    this.setState({
      containerWidth: e.nativeEvent.layout.width
    });
  }

  handlePress = (instance: any) => () => {
    if (this.props.onPress) {
      this.props.onPress(instance);
    } else {
      Linking.openURL(instance.Link)
        .catch(e => console.log('Unable to open link', instance.Link));
    }
  }

  renderInstance = (instance: any, i: number) => {
    const image = instance['Retina-Image'] || instance.Image;
    const imageWidth: number | undefined = this.props.imageWidth || this.state.containerWidth;
    let imageHeight = null;

    if (typeof this.props.imageHeight === 'number') {
      imageHeight = this.props.imageHeight;
    } else if (imageWidth && image.height && image.width) {
      imageHeight = imageWidth * image.height / image.width;
    } else {
      imageHeight = this.state.containerWidth;
    }

    const ImageJsx = (
      <Image
        source={{ uri: image.path }}
        accessibilityLabel={instance.Title}
        resizeMode='contain'
        style={{
          width: imageWidth,
          height: imageHeight
        }}
      />
    );

    if (instance.Link) {
      return (
        <View key={i} style={this.props.imageContainerStyle} onLayout={this.handleOnLayout}>
          <TouchableOpacityLink
            onPress={this.handlePress(instance)}
            href={instance.Link}
          >
            {ImageJsx}
          </TouchableOpacityLink>
        </View>
      );
    }

    return (
      <View key={i} style={this.props.imageContainerStyle} onLayout={this.handleOnLayout}>
        {ImageJsx}
      </View>
    );
  }

  abstract render(): React.ReactNode;
}
