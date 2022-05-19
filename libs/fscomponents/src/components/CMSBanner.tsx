/**
 * Abstract component for collections of CMS banners. At the very least a render() function
 * needs to be implemented.
 */

import React, { Component } from 'react';

import type { LayoutRectangle, StyleProp, ViewStyle } from 'react-native';
import { Image, Linking, View } from 'react-native';

import { TouchableOpacityLink } from './TouchableOpacityLink';

export interface CMSBannerProps {
  imageContainerStyle?: StyleProp<ViewStyle>;
  imageHeight?: number;
  imageWidth?: number;
  onPress?: (instance: any) => void;
  style?: StyleProp<ViewStyle>;
  cmsData?: any;
  accessible?: boolean;
  getAccessibilityLabel?: (instance: any) => string;
}

export interface CMSBannerState {
  containerWidth: number;
}

export abstract class CMSBanner<P extends CMSBannerProps, S = {}> extends Component<
  P,
  CMSBannerState
> {
  public state = {
    containerWidth: 0,
  };

  // Invoked on mount and whenever the layout changes. The code to render
  // images does calculations based on width of the parent container, so
  // this will update the width in the state so the component re-renders
  // whenever the view is resized.
  protected handleOnLayout = (e: { nativeEvent: { layout: LayoutRectangle } }) => {
    this.setState({
      containerWidth: e.nativeEvent.layout.width,
    });
  };

  protected readonly handlePress = (instance: any) => () => {
    if (this.props.onPress) {
      this.props.onPress(instance);
    } else {
      Linking.openURL(instance.Link).catch((error) => {
        console.log('Unable to open link', instance.Link);
      });
    }
  };

  protected readonly renderInstance = (instance: any, i: number) => {
    const image = instance['Retina-Image'] || instance.Image;
    const imageWidth: number | undefined = this.props.imageWidth || this.state.containerWidth;
    let imageHeight = null;

    if (typeof this.props.imageHeight === 'number') {
      imageHeight = this.props.imageHeight;
    } else if (imageWidth && image.height && image.width) {
      imageHeight = (imageWidth * image.height) / image.width;
    } else {
      imageHeight = this.state.containerWidth;
    }

    let accessibilityLabel = null;
    accessibilityLabel =
      typeof this.props.getAccessibilityLabel === 'function'
        ? this.props.getAccessibilityLabel(instance)
        : instance.Title;

    const accessible = Boolean(instance.Link) || Boolean(this.props.accessible);

    const ImageJsx = (
      <Image
        accessibilityLabel={accessibilityLabel}
        accessible={accessible}
        resizeMode="contain"
        source={{ uri: image.path }}
        style={{
          width: imageWidth,
          height: imageHeight,
        }}
      />
    );

    if (instance.Link) {
      return (
        <View key={i} onLayout={this.handleOnLayout} style={this.props.imageContainerStyle}>
          <TouchableOpacityLink href={instance.Link} onPress={this.handlePress(instance)}>
            {ImageJsx}
          </TouchableOpacityLink>
        </View>
      );
    }

    return (
      <View key={i} onLayout={this.handleOnLayout} style={this.props.imageContainerStyle}>
        {ImageJsx}
      </View>
    );
  };

  public abstract render(): React.ReactNode;
}
