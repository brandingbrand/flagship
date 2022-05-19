import React, { useEffect, useState } from 'react';

import type {
  ImageSourcePropType,
  ImageStyle,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';

import { EngagementContext } from '../lib/contexts';

export interface ImageBlockProps {
  source: ImageSourcePropType;
  resizeMode?: any;
  resizeMethod?: any;
  ratio?: string;
  useRatio?: boolean;
  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: ViewStyle;
  cardContainerStyle?: ViewStyle;
  outerContainerStyle?: ViewStyle;
  link?: string;
  parentWidth?: number;
}

export interface ImageDimensions {
  width?: number;
  height?: number;
}

export const ImageBlock: React.FC<ImageBlockProps> = React.memo((props) => {
  const { handleAction, windowWidth } = React.useContext(EngagementContext);

  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({
    height: 0,
    width: 0,
  });

  const {
    imageStyle = {},
    containerStyle,
    resizeMode = 'cover',
    resizeMethod = 'resize',
    source,
    link,
  } = props;
  if (!source) {
    return <View />;
  }
  const imageRatioStyle: StyleProp<ImageStyle> = {};
  if (imageDimensions.height) {
    imageRatioStyle.height = imageDimensions.height;
  }
  if (imageDimensions.width) {
    imageRatioStyle.width = imageDimensions.width;
  }

  // eslint-disable-next-line max-statements
  const findImageRatio = (): ImageDimensions => {
    const {
      cardContainerStyle,
      containerStyle,
      outerContainerStyle,
      parentWidth,
      ratio,
      useRatio,
    } = props;
    if (!useRatio) {
      return {};
    }

    const win = Dimensions.get('window');
    const result: ImageDimensions = { height: undefined, width: undefined };
    result.width = parentWidth || windowWidth || win.width;

    if (containerStyle) {
      if (containerStyle.paddingLeft) {
        result.width -= Number(containerStyle.paddingLeft);
      }
      if (containerStyle.marginLeft) {
        result.width -= Number(containerStyle.marginLeft);
      }
      if (containerStyle.paddingRight) {
        result.width -= Number(containerStyle.paddingRight);
      }
      if (containerStyle.marginRight) {
        result.width -= Number(containerStyle.marginRight);
      }
    }

    // check for parent container margin/padding
    if (outerContainerStyle) {
      if (outerContainerStyle.paddingLeft) {
        result.width -= Number(outerContainerStyle.paddingLeft);
      }
      if (outerContainerStyle.marginLeft) {
        result.width -= Number(outerContainerStyle.marginLeft);
      }
      if (outerContainerStyle.paddingRight) {
        result.width -= Number(outerContainerStyle.paddingRight);
      }
      if (outerContainerStyle.marginRight) {
        result.width -= Number(outerContainerStyle.marginRight);
      }
    }

    if (cardContainerStyle) {
      if (cardContainerStyle.paddingLeft) {
        result.width -= Number(cardContainerStyle.paddingLeft);
      }
      if (cardContainerStyle.marginLeft) {
        result.width -= Number(cardContainerStyle.marginLeft);
      }
      if (cardContainerStyle.paddingRight) {
        result.width -= Number(cardContainerStyle.paddingRight);
      }
      if (cardContainerStyle.marginRight) {
        result.width -= Number(cardContainerStyle.marginRight);
      }
    }
    if (ratio) {
      result.height = result.width / Number.parseFloat(ratio);
    }
    return result;
  };

  useEffect(() => {
    setImageDimensions(findImageRatio());
  }, []);

  const _onLayout = (event: LayoutChangeEvent) => {
    const { ratio, useRatio } = props;
    if (useRatio && ratio) {
      setImageDimensions(findImageRatio());
    }
  };

  const onPress = (link?: string) => () => {
    if (!link || !handleAction) {
      return;
    }
    handleAction({
      type: 'deep-link',
      value: link,
    });
  };

  if (link) {
    return (
      <TouchableOpacity activeOpacity={1} onPress={onPress(link)}>
        <View onLayout={_onLayout} style={containerStyle}>
          <Image
            source={source}
            style={[{ height: 200 }, imageStyle, imageRatioStyle]}
            resizeMode={resizeMode}
            resizeMethod={resizeMethod}
          />
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <View onLayout={_onLayout} style={containerStyle}>
      <Image
        source={source}
        style={[{ height: 200 }, imageStyle, imageRatioStyle]}
        resizeMode={resizeMode}
        resizeMethod={resizeMethod}
      />
    </View>
  );
});
