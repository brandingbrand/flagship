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

export default class ImageBlock extends Component<ImageBlockProps, any> {
  constructor(props: ImageBlockProps) {
    super(props);
    this.state = {
      ratioImageStyle: {}
    };
  }
  componentDidMount(): void {
    this.setState({
      ratioImageStyle: this.findImageRatio()
    });
  }
  _onLayout = (event: LayoutChangeEvent) => {
    const { ratio, useRatio } = this.props;
    if (useRatio && ratio) {
      this.setState({
        ratioImageStyle: this.findImageRatio()
      });
    }
  }
  findImageRatio = () => {
    const { containerStyle, ratio, useRatio } = this.props;
    if (!useRatio) {
      return {};
    }
    const win = Dimensions.get('window');
    const ratioImageStyle: StyleProp<ImageStyle> = {};
    ratioImageStyle.width = win.width;
    if (containerStyle.paddingLeft) {
      ratioImageStyle.width = ratioImageStyle.width - containerStyle.paddingLeft;
    }
    if (containerStyle.marginLeft) {
      ratioImageStyle.width = ratioImageStyle.width - containerStyle.marginLeft;
    }
    if (containerStyle.paddingRight) {
      ratioImageStyle.width = ratioImageStyle.width - containerStyle.paddingRight;
    }
    if (containerStyle.marginRight) {
      ratioImageStyle.width = ratioImageStyle.width - containerStyle.marginRight;
    }
    if (ratio) {
      ratioImageStyle.height = ratioImageStyle.width / parseFloat(ratio);
    }
    return ratioImageStyle;
  }
  render(): JSX.Element {
    const {
      imageStyle = {},
      containerStyle,
      resizeMode = 'cover',
      resizeMethod = 'resize',
      source
    } = this.props;

    return (
      <View onLayout={this._onLayout} style={containerStyle}>
        <Image
          source={source}
          style={[{ height: 200 }, imageStyle, this.state.ratioImageStyle]}
          resizeMode={resizeMode}
          resizeMethod={resizeMethod}
        />
      </View>
    );
  }
}
