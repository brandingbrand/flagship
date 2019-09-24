import React, { Component } from 'react';
import {
  Image,
  ImageStyle,
  Share,
  StyleProp,
  StyleSheet,
  TouchableHighlight,
  View,
  ViewStyle
} from 'react-native';


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
const shareIcon = require('../../assets/images/share.png');
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
    paddingRight: 20
  },
  imageStyle: {
    width: 19,
    height: 23,
    resizeMode: 'cover'
  }
});

export default class ShareBlock extends Component<ShareBlockProps> {
  onButtonPress = () => {
    const {
      url,
      shareTitle,
      message,
      dialogTitle
    } = this.props;

    Share.share({
      url,
      message,
      title: shareTitle
    }, {
      dialogTitle: dialogTitle || ''
    }).catch(error => {
      if (error) {
        console.warn('Error opening sharing: ', error);
      }
    });
  }

  shouldComponentUpdate(nextProps: ShareBlockProps): boolean {
    return nextProps.imageSrc !== this.props.imageSrc ||
      nextProps.imageStyle !== this.props.imageStyle ||
      nextProps.underlayColor !== this.props.underlayColor ||
      nextProps.containerStyle !== this.props.containerStyle;
  }

  render(): JSX.Element {
    const {
      imageSrc,
      imageStyle,
      underlayColor,
      containerStyle
    } = this.props;

    const image = imageSrc ? imageSrc : shareIcon;

    return (
      <View style={[styles.buttonContainer, containerStyle]}>
        <TouchableHighlight
          onPress={this.onButtonPress}
          underlayColor={underlayColor}
        >
          <Image source={image} style={[styles.imageStyle, imageStyle]} />
        </TouchableHighlight>
      </View>
    );
  }
}
