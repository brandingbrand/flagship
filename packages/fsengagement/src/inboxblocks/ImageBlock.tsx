import React, { Component } from 'react';
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

export default class ImageBlock extends Component<ImageBlockProps, ImageBlockState> {
  readonly state: ImageBlockState = {};

  componentDidMount(): void {
    this.setState(this.findImageRatio());
  }

  shouldComponentUpdate(nextProps: ImageBlockProps, nextState: ImageBlockState): boolean {
    return this.props.containerStyle !== nextProps.containerStyle ||
      this.props.imageStyle !== nextProps.imageStyle ||
      this.props.ratio !== nextProps.ratio ||
      this.props.resizeMethod !== nextProps.resizeMethod ||
      this.props.resizeMode !== nextProps.resizeMode ||
      this.props.source !== nextProps.source ||
      this.props.useRatio !== nextProps.useRatio ||
      this.state.height !== nextState.height ||
      this.state.width !== nextState.width;
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
    if (!source) {
      return <View />;
    }
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
