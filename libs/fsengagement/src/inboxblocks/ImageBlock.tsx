import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  ImageStyle,
  LayoutChangeEvent,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
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

  // eslint-disable-next-line complexity
  const findImageRatio = (): ImageDimensions => {
    const {
      parentWidth,
      containerStyle,
      ratio,
      useRatio,
      outerContainerStyle,
      cardContainerStyle,
    } = props;
    if (!useRatio) {
      return {};
    }

    const win = Dimensions.get('window');
    const result: ImageDimensions = { height: undefined, width: undefined };
    result.width = parentWidth || windowWidth || win.width;

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

    if (cardContainerStyle) {
      if (cardContainerStyle.paddingLeft) {
        result.width = result.width - +cardContainerStyle.paddingLeft;
      }
      if (cardContainerStyle.marginLeft) {
        result.width = result.width - +cardContainerStyle.marginLeft;
      }
      if (cardContainerStyle.paddingRight) {
        result.width = result.width - +cardContainerStyle.paddingRight;
      }
      if (cardContainerStyle.marginRight) {
        result.width = result.width - +cardContainerStyle.marginRight;
      }
    }
    if (ratio) {
      result.height = result.width / parseFloat(ratio);
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
