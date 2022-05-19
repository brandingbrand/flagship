import React, { Component } from 'react';

import type { ImageSourcePropType, ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { Image, Share, StyleSheet, TouchableHighlight, View } from 'react-native';

import shareIcon from '../../assets/images/share.png';

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 60,
    paddingTop: 8,
    paddingBottom: 9,
    paddingLeft: 20,
    paddingRight: 20,
  },
  imageStyle: {
    width: 19,
    height: 23,
    resizeMode: 'cover',
  },
});

export interface ShareBlockProps {
  dialogTitle?: string;
  message: string;
  shareTitle: string;
  url: string;
  imageSrc?: string;
  underlayColor?: string;
  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export default class ShareBlock extends Component<ShareBlockProps> {
  private readonly onButtonPress = () => {
    const { dialogTitle, message, shareTitle, url } = this.props;

    Share.share(
      {
        url,
        message,
        title: shareTitle,
      },
      {
        dialogTitle: dialogTitle || '',
      }
    ).catch((error) => {
      if (error) {
        console.warn('Error opening sharing:', error);
      }
    });
  };

  public shouldComponentUpdate(nextProps: ShareBlockProps): boolean {
    return (
      nextProps.imageSrc !== this.props.imageSrc ||
      nextProps.imageStyle !== this.props.imageStyle ||
      nextProps.underlayColor !== this.props.underlayColor ||
      nextProps.containerStyle !== this.props.containerStyle
    );
  }

  public render(): JSX.Element {
    const { containerStyle, imageSrc, imageStyle, underlayColor } = this.props;

    const image = imageSrc ? imageSrc : shareIcon;

    return (
      <View style={[styles.buttonContainer, containerStyle]}>
        <TouchableHighlight onPress={this.onButtonPress} underlayColor={underlayColor}>
          <Image source={image as ImageSourcePropType} style={[styles.imageStyle, imageStyle]} />
        </TouchableHighlight>
      </View>
    );
  }
}
