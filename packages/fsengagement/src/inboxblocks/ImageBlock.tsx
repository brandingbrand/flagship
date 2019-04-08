import React, { PureComponent } from 'react';
import {
  Dimensions,
  Image,
  ImageStyle,
  ImageURISource,
  LayoutChangeEvent,
  StyleProp,
  View
} from 'react-native';

export interface ImageBlockProps {
  source: ImageURISource;
  resizeMode?: any;
  resizeMethod?: any;
  ratio?: string;
  useRatio?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: any;
}

export interface ImageBlockState {
  width?: number;
  height?: number;
}

export default class ImageBlock extends PureComponent<ImageBlockProps, ImageBlockState> {
  readonly state: ImageBlockState = {};

  componentDidMount(): void {
    this.setState(this.findImageRatio());
  }
  _onLayout = (event: LayoutChangeEvent) => {
    const { ratio, useRatio } = this.props;
    if (useRatio && ratio) {
      this.setState(this.findImageRatio());

    }
  }
  findImageRatio = (): ImageBlockState => {
    const { containerStyle, ratio, useRatio } = this.props;
    if (!useRatio) {
      return {};
    }
    const win = Dimensions.get('window');
    const result: ImageBlockState = { height: undefined, width: undefined };
    result.width = win.width;
    if (containerStyle.paddingLeft) {
      result.width = result.width - containerStyle.paddingLeft;
    }
    if (containerStyle.marginLeft) {
      result.width = result.width - containerStyle.marginLeft;
    }
    if (containerStyle.paddingRight) {
      result.width = result.width - containerStyle.paddingRight;
    }
    if (containerStyle.marginRight) {
      result.width = result.width - containerStyle.marginRight;
    }
    if (ratio) {
      result.height = result.width / parseFloat(ratio);
    }
    return result;
  }
  render(): JSX.Element {
    const {
      imageStyle = {},
      containerStyle,
      resizeMode = 'cover',
      resizeMethod = 'resize',
      source
    } = this.props;
    const imageRatioStyle: StyleProp<ImageStyle> = {};
    if (this.state.height) {
      imageRatioStyle.height = this.state.height;
    }
    if (this.state.width) {
      imageRatioStyle.width = this.state.width;
    }
    return (
      <View onLayout={this._onLayout} style={containerStyle}>
        <Image
          source={source}
          style={[{ height: 200 }, imageStyle, imageRatioStyle]}
          resizeMode={resizeMode}
          resizeMethod={resizeMethod}
        />
      </View>
    );
  }
}
