/* eslint-disable */
import React, { Component, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  LayoutChangeEvent,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View
} from 'react-native';
import { EngagementContext } from '../lib/contexts';

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

class RenderWebCarouselItem extends Component<RenderItemProps & { context: any }, RenderItemState> {
  static contextTypes: any = {
    handleAction: PropTypes.func
  };
  constructor(props: RenderItemProps & { context: any }) {
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
      <View style={imagePadding}>
        <img style={{
          width: '100%',
          height: 'auto'
        }} src={source.uri} />
      </View>
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
    const { handleAction } = this.props.context;
    handleAction({
      type: 'deep-link',
      value: link
    });
  }
  // eslint-disable-next-line complexity
  render() {
    const {
      data: {
        showText,
        text,
        header,
        additional,
        eyebrow
      },
      horizPadding = 0,
      options,
      eyebrowStyle,
      headerStyle,
      textStyle,
      additionalStyle
    } = this.props;

    let itemStyle: any = {
      paddingRight: horizPadding
    };

    const textPadding = options.textPadding || {};

    var textbg: any = {};
    if (options.backgroundColor) {
      textbg.backgroundColor = options.backgroundColor;
    }

    return (
      <TouchableOpacity
        activeOpacity={.8}
        onPress={this.onPress}
        style={itemStyle}

      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          {this.image}
        </View>

        {showText &&
          <View style={textbg}>
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

export default (props: RenderItemProps) => {
  const context = useContext(EngagementContext);
  return <RenderWebCarouselItem {...props} context={context} />;
};
