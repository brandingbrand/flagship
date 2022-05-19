import React, { Component, useContext } from 'react';

import type { LayoutChangeEvent, StyleProp, TextStyle } from 'react-native';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';

import PropTypes from 'prop-types';

import { EngagementContext } from '../lib/contexts';

import styles from './SliderEntry.style';

export interface RenderItemProps {
  data?: any;
  parallax?: any;
  parallaxProps?: any;
  even?: boolean;
  numColumns?: number;
  noMargin?: boolean;
  options?: any;
  itemWidth: number;
  headerStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  additionalStyle?: StyleProp<TextStyle>;
  eyebrowStyle?: StyleProp<TextStyle>;
  horizPadding?: number;
  verticalSpacing?: number;
  overallHeight?: number;
  totalItemWidth?: number;
  grid?: boolean;
}
export interface TextValue {
  value: string;
}
export interface RenderItemState {
  viewHeight: number;
  viewHeightChanged: boolean;
}

const { height: viewportHeight } = Dimensions.get('window');

class RenderImageTextItem extends Component<RenderItemProps & { context: any }, RenderItemState> {
  public static contextTypes: any = {
    handleAction: PropTypes.func,
  };

  constructor(props: RenderItemProps & { context: any }) {
    super(props);
    this.state = {
      viewHeight: 0,
      viewHeightChanged: false,
    };
  }

  private get image(): any {
    const {
      data: { source },
      options,
    } = this.props;
    const imagePadding = {
      margin: options.imagePadding || 0,
    };

    return <Image source={source} style={[styles.image, imagePadding]} />;
  }

  private readonly _onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;

    if (
      !this.state.viewHeightChanged &&
      this.state.viewHeight !== height &&
      Math.abs(this.state.viewHeight - height) > 1
    ) {
      this.setState({
        viewHeight: height,
        viewHeightChanged: true,
      });
    }
  };

  private readonly onPress = () => {
    const {
      data: { link },
    } = this.props;
    if (!link) {
      return;
    }
    const { handleAction } = this.props.context;
    handleAction({
      type: 'deep-link',
      value: link,
    });
  };

  public render() {
    const {
      additionalStyle,
      data: { additional, eyebrow, header, ratio, showText, text },
      even,
      eyebrowStyle,
      grid,
      headerStyle,
      horizPadding = 0,
      itemWidth,
      noMargin,
      numColumns = 2,
      options,
      overallHeight = 0,
      textStyle,
      totalItemWidth = 0,
      verticalSpacing = 0,
    } = this.props;

    let itemStyle: any = {};
    let imageStyle: any = {};
    const textPadding = options.textPadding || {};
    if (grid) {
      itemStyle =
        ratio && itemWidth
          ? {
              width: noMargin ? totalItemWidth - itemWidth * (numColumns - 1) : itemWidth,
              marginRight: noMargin ? 0 : horizPadding,
              paddingHorizontal: 0,
              marginBottom: verticalSpacing,
            }
          : {
              width: itemWidth,
              height: viewportHeight * 0.36,
              marginRight: even ? horizPadding : 0,
              marginBottom: verticalSpacing,
            };

      imageStyle = {
        width: '100%',
        height: itemWidth / Number.parseFloat(ratio),
      };
    } else {
      itemStyle =
        ratio && itemWidth
          ? {
              width: itemWidth,
              paddingRight: horizPadding,
            }
          : {
              width: itemWidth,
              height: viewportHeight * 0.36,
            };
      imageStyle = {
        width: '100%',
        height:
          (itemWidth - Number.parseInt(options.itemHorizontalPaddingPercent, 10)) /
          Number.parseFloat(ratio),
      };
    }

    const textbg: any = {};
    if (options.backgroundColor) {
      textbg.backgroundColor = options.backgroundColor;
    }

    if (grid) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.onPress}
          style={itemStyle}
          onLayout={this._onLayout}
        >
          <View style={imageStyle}>
            <View style={[styles.imageContainerNoCard, even ? {} : {}]}>{this.image}</View>
          </View>

          {showText && (
            <View
              style={[
                { height: this.state.viewHeight - itemWidth / Number.parseFloat(ratio) },
                textbg,
              ]}
            >
              <View style={[textPadding, { justifyContent: 'center' }]}>
                {Boolean(eyebrow && eyebrow.value) && (
                  <Text style={[eyebrowStyle, { textAlign: options.textAlign }]}>
                    {eyebrow.value}
                  </Text>
                )}
                {Boolean(header && header.value) && (
                  <Text style={[headerStyle, { textAlign: options.textAlign }]}>
                    {header.value}
                  </Text>
                )}
                {Boolean(text && text.value) && (
                  <Text style={[textStyle, { textAlign: options.textAlign }]}>{text.value}</Text>
                )}
              </View>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={this.onPress} style={itemStyle}>
        <View style={imageStyle}>
          <View style={[styles.imageContainerNoCard, even ? {} : {}]}>{this.image}</View>
        </View>

        {showText && (
          <View
            style={[
              {
                height:
                  overallHeight -
                  (itemWidth - Number.parseInt(options.itemHorizontalPaddingPercent, 10)) /
                    Number.parseFloat(ratio),
              },
              textbg,
            ]}
          >
            <View style={[textPadding, { justifyContent: 'center' }]}>
              {Boolean(eyebrow && eyebrow.value) && (
                <Text style={[eyebrowStyle, { textAlign: options.textAlign }]}>
                  {eyebrow.value}
                </Text>
              )}
              {Boolean(header && header.value) && (
                <Text style={[headerStyle, { textAlign: options.textAlign }]}>{header.value}</Text>
              )}
              {Boolean(text && text.value) && (
                <Text style={[textStyle, { textAlign: options.textAlign }]}>{text.value}</Text>
              )}
              {Boolean(additional && additional.value) && (
                <Text style={[additionalStyle, { textAlign: options.textAlign }]}>
                  {additional.value}
                </Text>
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

export default (props: RenderItemProps) => {
  const context = useContext(EngagementContext);
  return <RenderImageTextItem {...props} context={context} />;
};
