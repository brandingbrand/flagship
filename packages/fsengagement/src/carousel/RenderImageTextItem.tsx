/* tslint:disable */
import React, { useContext, useState  } from 'react';
import {
  Dimensions,
  Image,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View
} from 'react-native';
import styles from './SliderEntry.style';

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

const { height: viewportHeight } = Dimensions.get('window');

const RenderImageTextItem = (props:RenderItemProps):JSX.Element => {

  const [viewHeight, setViewHeight] = useState(0);
  const [viewHeightChanged, setViewHeightChanged] = useState(false);
  const { handleAction } = useContext(EngagementContext);

  const {
    data: {
      source,
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
    noMargin,
  } = props;

  const imagePadding = {
      margin: options.imagePadding || 0
  };

  const handleOnLayout:any = (event:any) => {
      let { height } = event.nativeEvent.layout;
      if (!viewHeightChanged &&
          viewHeight !== height &&
          Math.abs(viewHeight - height) > 1) {
          setViewHeightChanged(true);
          setViewHeight(height);
      }
  };
  const handleOnPress = ():void => {
    const { data: { link } } = props;
    if (!link) {
        return;
    }
    handleAction({
        type: 'deep-link',
        value: link
    });
  };

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

  let textbg: any = {};
  if (options.backgroundColor) {
    textbg.backgroundColor = options.backgroundColor;
  }

  return (
    <>
      {grid ?
        <TouchableOpacity
        activeOpacity={.8}
        onPress={handleOnPress}
        style={itemStyle}
        onLayout={handleOnLayout}
      >
        <View style={imageStyle}>
          <View style={[styles.imageContainerNoCard, even ? {} : {}]}>
            <Image source={source} style={[styles.image, imagePadding]}/>
          </View>
        </View>

        {showText &&
          <View
          style={[{ height: viewHeight - ((itemWidth) / parseFloat(ratio)) }, textbg]}
          >
            <View style={[textPadding, { justifyContent: 'center' }]}>
              {!!(eyebrow && eyebrow.value) &&
                <Text style={[eyebrowStyle, { textAlign: options.textAlign }]}>{eyebrow.value}</Text>}
              {!!(header && header.value) &&
                <Text style={[headerStyle, { textAlign: options.textAlign }]}>{header.value}</Text>}
              {!!(text && text.value) &&
                <Text style={[textStyle, { textAlign: options.textAlign }]}>{text.value}</Text>}
            </View>
          </View>
        }

      </TouchableOpacity>
      : <TouchableOpacity
        activeOpacity={.8}
        onPress={handleOnPress}
        style={itemStyle}
      >
        <View style={imageStyle}>
          <View style={[styles.imageContainerNoCard, even ? {} : {}]}>
            <Image source={source} style={[styles.image, imagePadding]}/>
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
          </View>
        }

        </TouchableOpacity>
      }
    </>
  );
}

export default RenderImageTextItem;

//# sourceMappingURL=RenderImageTextItem.js.map
