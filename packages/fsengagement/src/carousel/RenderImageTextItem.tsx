/* tslint:disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  Image,
  LayoutChangeEvent,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View
} from 'react-native';
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

export default class RenderImageTextItem extends Component<RenderItemProps, RenderItemState> {
  static contextTypes: any = {
    handleAction: PropTypes.func
  };
  constructor(props: RenderItemProps) {
    super(props);
    this.state = {
      viewHeight: 0,
      viewHeightChanged: false
    };
  }
  get image(): any {
    const { data: { source }, options } = this.props;
    const imagePadding = {
      margin: options.imagePadding || 0
    };

    return (
      <Image
        source={source}
        style={[styles.image, imagePadding]}
      />
    );
  }

  _onLayout = (event: LayoutChangeEvent) => {
    var { height } = event.nativeEvent.layout;

    if (!this.state.viewHeightChanged &&
      this.state.viewHeight !== height &&
      Math.abs(this.state.viewHeight - height) > 1) {
      this.setState({
        viewHeight: height,
        viewHeightChanged: true
      })
    }
  }
  onPress = () => {
    const { data: { link } } = this.props;
    if (!link) {
      return;
    }
    const { handleAction } = this.context;
    handleAction({
      type: 'deep-link',
      value: link
    });
  }
  render() {
    const {
      data: {
        ratio,
        showText,
        text,
        header,
        additional,
        eyebrow
      },
      even,
      grid,
      itemWidth,
      horizPadding = 0,
      verticalSpacing = 0,
      options,
      overallHeight = 0,
      totalItemWidth = 0,
      numColumns = 2,
      eyebrowStyle,
      headerStyle,
      textStyle,
      additionalStyle,
      noMargin
    } = this.props;

    let itemStyle: any = {};
    let imageStyle: any = {};
    const textPadding = options.textPadding || {};
    if (grid) {
      if (ratio && itemWidth) {
        itemStyle = {
          width: noMargin ? totalItemWidth - (itemWidth * (numColumns - 1)) : itemWidth,
          marginRight: noMargin ? 0 : horizPadding,
          paddingHorizontal: 0,
          marginBottom: verticalSpacing
        };
      } else {
        itemStyle = {
          width: itemWidth,
          height: viewportHeight * .36,
          marginRight: even ? horizPadding : 0,
          marginBottom: verticalSpacing
        };
      }

      imageStyle = {
        width: '100%',
        height: (itemWidth / parseFloat(ratio))
      };
    } else {
      if (ratio && itemWidth) {
        itemStyle = {
          width: itemWidth,
          paddingRight: horizPadding
        };
      } else {
        itemStyle = {
          width: itemWidth,
          height: viewportHeight * .36
        };
      }
      imageStyle = {
        width: '100%',
        height: ((itemWidth - parseInt(options.itemHorizontalPaddingPercent,10)) / parseFloat(ratio))
      };
    }

    var textbg: any = {};
    if (options.backgroundColor) {
      textbg.backgroundColor = options.backgroundColor;
    }

    if (grid) {
      return (
        <TouchableOpacity
          activeOpacity={.8}
          onPress={this.onPress}
          style={itemStyle}
          onLayout={this._onLayout}
        >
          <View style={imageStyle}>
            <View style={[styles.imageContainerNoCard, even ? {} : {}]}>
              {this.image}
            </View>
          </View>

          {showText &&
            <View
            style={[{ height: this.state.viewHeight - ((itemWidth) / parseFloat(ratio)) }, textbg]}
            >
              <View style={[textPadding, { justifyContent: 'center' }]}>
                {!!(eyebrow && eyebrow.value) &&
                  <Text style={[eyebrowStyle, { textAlign: options.textAlign }]}>{eyebrow.value}</Text>}
                {!!(header && header.value) &&
                  <Text style={[headerStyle, { textAlign: options.textAlign }]}>{header.value}</Text>}
                {!!(text && text.value) &&
                  <Text style={[textStyle, { textAlign: options.textAlign }]}>{text.value}</Text>}
              </View>
            </View>}

        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={.8}
        onPress={this.onPress}
        style={itemStyle}

      >
        <View style={imageStyle}>
          <View style={[styles.imageContainerNoCard, even ? {} : {}]}>
            {this.image}
          </View>
        </View>

        {showText &&
          <View
          style={[{ height: overallHeight - ((itemWidth - parseInt(options.itemHorizontalPaddingPercent, 10)) / parseFloat(ratio)) }, textbg]}
          >
            <View style={[textPadding, { justifyContent: 'center' }]}>
              {!!(eyebrow && eyebrow.value) &&
                <Text style={[eyebrowStyle, { textAlign: options.textAlign }]}>{eyebrow.value}</Text>}
              {!!(header && header.value) &&
                <Text style={[headerStyle, { textAlign: options.textAlign }]}>{header.value}</Text>}
              {!!(text && text.value) &&
                <Text style={[textStyle, { textAlign: options.textAlign }]}>{text.value}</Text>}
              {!!(additional && additional.value) &&
                <Text style={[additionalStyle, { textAlign: options.textAlign }]}>{additional.value}</Text>}
            </View>
          </View>}

      </TouchableOpacity>
    );
  }
}
