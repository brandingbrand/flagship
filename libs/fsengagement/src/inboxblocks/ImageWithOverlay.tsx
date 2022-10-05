import React, { Component, useContext } from 'react';

import type {
  FlexStyle,
  ImageStyle,
  ImageURISource,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Dimensions, ImageBackground, TouchableOpacity, View } from 'react-native';

import PropTypes from 'prop-types';

import layoutComponents from '../inboxblocks';
import type { EngContext } from '../lib/contexts';
import { EngagementContext } from '../lib/contexts';
import type { BlockItem } from '../types';

import { FlexAlign, FlexMap } from './ImageBlock';

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
  cardContainerStyle?: ViewStyle;
  fixedWidth?: number;
  fixedAlignment?: 'center' | 'left' | 'right';
}
interface ContextProps {
  context: EngContext;
}

export const alignmentMap: FlexMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

export const mapAlignment = (value: 'center' | 'left' | 'right'): FlexAlign => alignmentMap[value];

class ImageWithOverlay extends Component<ContextProps & ImageBlockProps, FlexStyle> {
  public static contextTypes: any = {
    handleAction: PropTypes.func,
  };

  public readonly state: FlexStyle = {};

  private readonly _onLayout = (event: LayoutChangeEvent) => {
    const { ratio, useRatio } = this.props;
    if (useRatio && ratio) {
      this.setState(this.findImageRatio());
    }
  };

  private readonly findImageRatio = (): FlexStyle => {
    const {
      containerStyle,
      fixedAlignment,
      fixedWidth,
      outerContainerStyle,
      parentWidth,
      ratio,
      useRatio,
    } = this.props;
    const { windowWidth } = this.props.context;
    if (!useRatio) {
      return {};
    }
    const win = Dimensions.get('window');
    const result: FlexStyle = { height: undefined, width: undefined };
    result.width = parentWidth || windowWidth || win.width;

    if (fixedWidth) {
      result.width = fixedWidth;
      result.alignSelf = fixedAlignment ? mapAlignment(fixedAlignment) : 'center';
    } else {
      if (containerStyle) {
        if (containerStyle.paddingLeft !== undefined) {
          result.width -= Number(containerStyle.paddingLeft);
        }
        if (containerStyle.marginLeft !== undefined) {
          result.width -= Number(containerStyle.marginLeft);
        }
        if (containerStyle.paddingRight !== undefined) {
          result.width -= Number(containerStyle.paddingRight);
        }
        if (containerStyle.marginRight !== undefined) {
          result.width -= Number(containerStyle.marginRight);
        }
      }

      // check for parent container margin/padding
      if (outerContainerStyle) {
        if (outerContainerStyle.paddingLeft !== undefined) {
          result.width -= Number(outerContainerStyle.paddingLeft);
        }
        if (outerContainerStyle.marginLeft !== undefined) {
          result.width -= Number(outerContainerStyle.marginLeft);
        }
        if (outerContainerStyle.paddingRight !== undefined) {
          result.width -= Number(outerContainerStyle.paddingRight);
        }
        if (outerContainerStyle.marginRight !== undefined) {
          result.width -= Number(outerContainerStyle.marginRight);
        }
      }
    }

    if (ratio !== undefined) {
      result.height = result.width / Number.parseFloat(ratio);
    }
    console.log('overlay result', result);
    return result;
  };

  private readonly onPress = (link: string) => () => {
    const { handleAction } = this.props.context;
    if (handleAction) {
      handleAction({
        type: 'deep-link',
        value: link,
      });
    }
  };

  // eslint-disable-next-line max-statements
  private renderItem(item: BlockItem): React.ReactElement | null {
    const { private_blocks, private_type, ...restProps } = item;

    const { cardContainerStyle, containerStyle, parentWidth, textOverlay } = this.props;
    let parentWidthStyle = {};

    restProps.cardContainerStyle = this.props.containerStyle || {};
    if (parentWidth !== undefined) {
      let childWidth = parentWidth;
      if (containerStyle) {
        if (containerStyle.paddingLeft !== undefined) {
          childWidth -= Number(containerStyle.paddingLeft);
        }
        if (containerStyle.marginLeft !== undefined) {
          childWidth -= Number(containerStyle.marginLeft);
        }
        if (containerStyle.paddingRight !== undefined) {
          childWidth -= Number(containerStyle.paddingRight);
        }
        if (containerStyle.marginRight !== undefined) {
          childWidth -= Number(containerStyle.marginRight);
        }
      }
      if (texverlay && textOverlay?.options) {
        if (textOverlay.options.horizontalLeftDistanceFromEdge) {
          childWidth -= textOverlay.options.horizontalLeftDistanceFromEdge;
        }
        if (textOverlay.options.horizontalRightDistanceFromEdge) {
          childWidth -= textOverlay.options.horizontalRightDistanceFromEdge;
        }
      }
      parentWidthStyle = {
        parentWidth: childWidth,
      };
    }

    if (cardContainerStyle) {
      if (cardContainerStyle.paddingLeft !== undefined) {
        restProps.cardContainerStyle.paddingLeft =
          Number(cardContainerStyle.paddingLeft) +
          Number(restProps.cardContainerStyle.paddingLeft ?? 0);
      }
      if (cardContainerStyle.marginLeft !== undefined) {
        restProps.cardContainerStyle.marginLeft =
          Number(cardContainerStyle.marginLeft) +
          Number(restProps.cardContainerStyle.marginLeft ?? 0);
      }
      if (cardContainerStyle.paddingRight !== undefined) {
        restProps.cardContainerStyle.paddingRight =
          Number(cardContainerStyle.paddingRight) +
          Number(restProps.cardContainerStyle.paddingRight ?? 0);
      }
      if (cardContainerStyle.marginRight !== undefined) {
        restProps.cardContainerStyle.marginRight =
          Number(cardContainerStyle.marginRight) +
          Number(restProps.cardContainerStyle.marginRight ?? 0);
      }
    }
    if (!layoutComponents[private_type]) {
      return null;
    }

    const component = layoutComponents[private_type];
    if (!component) {
      return null;
    }
    return React.createElement(
      component,
      { ...restProps, ...parentWidthStyle },
      private_blocks?.map(this.renderItem)
    );
  }

  public componentDidMount(): void {
    this.setState(this.findImageRatio());
  }

  public shouldComponentUpdate(nextProps: ImageBlockProps, nextState: FlexStyle): boolean {
    return (
      this.props.containerStyle !== nextProps.containerStyle ||
      this.props.imageStyle !== nextProps.imageStyle ||
      this.props.ratio !== nextProps.ratio ||
      this.props.resizeMethod !== nextProps.resizeMethod ||
      this.props.resizeMode !== nextProps.resizeMode ||
      this.props.source !== nextProps.source ||
      this.props.useRatio !== nextProps.useRatio ||
      this.state.height !== nextState.height ||
      this.state.width !== nextState.width
    );
  }

  public render(): JSX.Element {
    const {
      imageStyle = {},
      containerStyle,
      resizeMode = 'cover',
      resizeMethod = 'resize',
      source,
      textOverlay,
      link,
    } = this.props;
    if (!source) {
      return <View />;
    }
    const imageRatioStyle: StyleProp<ImageStyle> = {};
    if (this.state.height !== undefined) {
      imageRatioStyle.height = this.state.height;
    }
    if (this.state.width !== undefined) {
      imageRatioStyle.width = this.state.width;
    }
    if (this.state.alignSelf !== undefined) {
      imageRatioStyle.alignSelf = this.state.alignSelf;
    }

    const horizontalMap: any = {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end',
    };
    const verticalMap: any = {
      top: 'flex-start',
      center: 'center',
      bottom: 'flex-end',
    };
    let textContainerStyle = {};
    let innerTextContainer: any = {};
    if (textOverlay) {
      textContainerStyle = {
        flex: 1,
        justifyContent: verticalMap[textOverlay.options.verticalAlignment],
        alignItems: horizontalMap[textOverlay.options.horizontalAlignment],
        marginBottom:
          textOverlay.options && textOverlay.options.verticalAlignment === 'bottom'
            ? textOverlay.options.verticalDistanceFromEdge
            : 0,
        marginTop:
          textOverlay.options && textOverlay.options.verticalAlignment !== 'bottom'
            ? textOverlay.options.verticalDistanceFromEdge
            : 0,
        marginLeft: textOverlay.options && textOverlay.options.horizontalLeftDistanceFromEdge,
        marginRight: textOverlay.options && textOverlay.options.horizontalRightDistanceFromEdge,
      };
      innerTextContainer = {
        backgroundColor: textOverlay.options.backgroundColor,
        padding: textOverlay.options.padding || 0,
      };
      if (textOverlay.options.fullWidth) {
        //   innerTextContainer.alignItems = horizontalMap[textOverlay.options.horizontalAlignment];
        innerTextContainer.width = '100%';
      }
    }
    if (link) {
      return (
        <TouchableOpacity activeOpacity={1} onPress={this.onPress(link)}>
          <View onLayout={this._onLayout} style={containerStyle}>
            <ImageBackground
              source={source}
              style={[{ height: 200 }, imageStyle, imageRatioStyle]}
              resizeMode={resizeMode}
              resizeMethod={resizeMethod}
            >
              {Boolean(
                textOverlay &&
                  textOverlay.enabled &&
                  textOverlay.items &&
                  textOverlay.items.length > 0
              ) && (
                <View style={textContainerStyle}>
                  <View style={innerTextContainer}>
                    {(textOverlay.items || []).map((item: BlockItem) => this.renderItem(item))}
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
          {Boolean(
            textOverlay && textOverlay.enabled && textOverlay.items && textOverlay.items.length > 0
          ) && (
            <View style={textContainerStyle}>
              <View style={innerTextContainer}>
                {(textOverlay.items || []).map((item: BlockItem) => this.renderItem(item))}
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
