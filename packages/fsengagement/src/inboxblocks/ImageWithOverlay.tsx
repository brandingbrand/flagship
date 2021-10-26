import React, { Component, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  ImageBackground,
  ImageStyle,
  ImageURISource,
  LayoutChangeEvent,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { TextBlock } from './TextBlock';
import { EngagementContext } from '../lib/contexts';
export interface ImageBlockProps {
  source: ImageURISource;
  resizeMode?: any;
  resizeMethod?: any;
  ratio?: string;
  useRatio?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: ViewStyle;
  outerContainerStyle?: ViewStyle;
  textOverlay?: any;
  link?: string;
  parentWidth?: number;
}

export interface ImageBlockState {
  width?: number;
  height?: number;
}

class ImageWithOverlay extends Component<ImageBlockProps & { context: any }, ImageBlockState> {
  static contextTypes: any = {
    handleAction: PropTypes.func
  };
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
  // tslint:disable-next-line:cyclomatic-complexity
  findImageRatio = (): ImageBlockState => {
    const { parentWidth, containerStyle, ratio, useRatio, outerContainerStyle } = this.props;
    if (!useRatio) {
      return {};
    }
    const win = Dimensions.get('window');
    const result: ImageBlockState = { height: undefined, width: undefined };
    result.width = parentWidth || win.width;
    if (containerStyle) {
      if (containerStyle.paddingLeft) {
        result.width = result.width - +containerStyle.paddingLeft;
      }
      if (containerStyle.marginLeft) {
        result.width = result.width - +containerStyle.marginLeft;
      }
      if (containerStyle.paddingRight) {
        result.width = result.width - +containerStyle.paddingRight;
      }
      if (containerStyle.marginRight) {
        result.width = result.width - +containerStyle.marginRight;
      }
    }

    // check for parent container margin/padding
    if (outerContainerStyle) {
      if (outerContainerStyle.paddingLeft) {
        result.width = result.width - +outerContainerStyle.paddingLeft;
      }
      if (outerContainerStyle.marginLeft) {
        result.width = result.width - +outerContainerStyle.marginLeft;
      }
      if (outerContainerStyle.paddingRight) {
        result.width = result.width - +outerContainerStyle.paddingRight;
      }
      if (outerContainerStyle.marginRight) {
        result.width = result.width - +outerContainerStyle.marginRight;
      }
    }
    if (ratio) {
      result.height = result.width / parseFloat(ratio);
    }
    return result;
  }
  onPress = (link: string) => () => {
    const { handleAction } = this.context;
    handleAction({
      type: 'deep-link',
      value: link
    });
  }
  _renderItem(item: any, index: number): JSX.Element {
    return (
      <TextBlock {...item} />
    );
  }
  // tslint:disable-next-line:cyclomatic-complexity
  render(): JSX.Element {
    const {
      imageStyle = {},
      containerStyle,
      resizeMode = 'cover',
      resizeMethod = 'resize',
      source,
      textOverlay,
      link
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

    const horizontalMap: any = {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end'
    };
    const verticalMap: any = {
      top: 'flex-start',
      center: 'center',
      bottom: 'flex-end'
    };
    let textContainerStyle = {};
    let innerTextContainer: any = {};
    if (textOverlay) {
      textContainerStyle = {
        flex: 1,
        justifyContent: verticalMap[textOverlay.options.verticalAlignment],
        alignItems: horizontalMap[textOverlay.options.horizontalAlignment],
        marginBottom: textOverlay.options &&
          textOverlay.options.verticalAlignment === 'bottom' ?
          textOverlay.options.verticalDistanceFromEdge : 0,
        marginTop: textOverlay.options &&
          textOverlay.options.verticalAlignment !== 'bottom' ?
          textOverlay.options.verticalDistanceFromEdge : 0,
        marginLeft: textOverlay.options &&
          textOverlay.options.horizontalLeftDistanceFromEdge,
        marginRight: textOverlay.options &&
          textOverlay.options.horizontalRightDistanceFromEdge
      };
      innerTextContainer = {
        backgroundColor: textOverlay.options.backgroundColor,
        padding: textOverlay.options.padding || 0
      };
      if (textOverlay.options.fullWidth) {
     //   innerTextContainer.alignItems = horizontalMap[textOverlay.options.horizontalAlignment];
        innerTextContainer.width = '100%';
      }
    }
    if (link) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={this.onPress(link)}
        >
          <View onLayout={this._onLayout} style={containerStyle}>
            <ImageBackground
              source={source}
              style={[{ height: 200 }, imageStyle, imageRatioStyle]}
              resizeMode={resizeMode}
              resizeMethod={resizeMethod}
            >
              {!!(textOverlay && textOverlay.enabled &&
                textOverlay.items && textOverlay.items.length) &&
                (
                  <View
                    style={textContainerStyle}
                  >
                    <View style={innerTextContainer}>
                      {(textOverlay.items || []).map((item: any, index: number) => {
                        return this._renderItem(item, index);
                      })}
                    </View>
                  </View>
                )}
            </ImageBackground>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <View onLayout={this._onLayout} style={containerStyle}>
        <ImageBackground
          source={source}
          style={[{ height: 200 }, imageStyle, imageRatioStyle]}
          resizeMode={resizeMode}
          resizeMethod={resizeMethod}
        >
          {!!(textOverlay && textOverlay.enabled &&
            textOverlay.items && textOverlay.items.length) &&
            (
              <View
                style={textContainerStyle}
              >
                <View style={innerTextContainer}>
                  {(textOverlay.items || []).map((item: any, index: number) => {
                    return this._renderItem(item, index);
                  })}
                </View>
              </View>
            )}
        </ImageBackground>
      </View>
    );
  }
}

export default (props: ImageBlockProps) => {
  const context = useContext(EngagementContext);
  return <ImageWithOverlay {...props} context={context} />;
};
