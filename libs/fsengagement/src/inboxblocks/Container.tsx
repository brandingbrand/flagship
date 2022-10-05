import React, { useMemo } from 'react';

import { ImageBackground, View } from 'react-native';
import type {
  ImageResizeMode,
  ImageStyle,
  ImageURISource,
  StyleProp,
  ViewStyle,
} from 'react-native';

import layoutComponents from '../inboxblocks';
import type { BlockItem, CardProps } from '../types';

interface BackgroundImage {
  imageStyle?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
  resizeMethod?: 'auto' | 'resize' | 'scale';
  source?: ImageURISource;
}
export interface ContainerProps extends CardProps {
  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: ViewStyle;
  outerContainerStyle?: ViewStyle;
  cardContainerStyle?: ViewStyle;
  useBackground?: boolean;
  backgroundImage?: BackgroundImage;
  verticalAlignment?: 'bottom' | 'center' | 'top';
  items: BlockItem[];
  link?: string;
  parentWidth?: number;
  spaceBetween?: number;
  carouselType?: string;
}

export interface ContainerState {
  width?: number;
  height?: number;
}

export const Container: React.FC<ContainerProps> = React.memo((props) => {
  const {
    cardContainerStyle,
    containerStyle,
    items,
    backgroundImage = {},
    useBackground: shouldUseBackground = false,
    verticalAlignment,
    parentWidth,
    navigator,
    spaceBetween = 0,
    carouselType = '',
  } = props;
  const {
    imageStyle = {},
    resizeMode = 'cover',
    resizeMethod = 'resize',
    source: backgroundImageSource,
  } = backgroundImage;

  const containerChildStyle: any = useMemo(() => {
    if (typeof parentWidth === 'number' && typeof spaceBetween === 'number') {
      return {
        width: parentWidth - spaceBetween,
        alignSelf: carouselType === 'grow' ? 'center' : 'flex-start',
      };
    }
    return {};
  }, [parentWidth, spaceBetween]);

  const renderBlock = (item: BlockItem): React.ReactElement | null => {
    const { private_blocks, private_type, ...restProps } = item;

    restProps.cardContainerStyle = containerStyle ?? {};

    if (containerStyle?.height !== undefined) {
      restProps.parentHasFixedHeight = true;
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

    const component = layoutComponents[private_type];
    if (!component) {
      return null;
    }
    return React.createElement(
      component,
      {
        ...restProps,
        navigator,
      },
      private_blocks?.map(renderBlock)
    );
  };

  const verticalMap = {
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end',
  };

  const textContainerStyle: any =
    verticalAlignment && Boolean(containerStyle?.height)
      ? {
          flex: 1,
          justifyContent: verticalMap[verticalAlignment],
        }
      : {};

  return (
    <>
      {items.length > 0 && (!shouldUseBackground || !backgroundImageSource?.uri) && (
        <View style={[containerStyle, containerChildStyle]}>
          <View style={textContainerStyle as ViewStyle}>
            <View style={{ width: '100%' }}>{items.map(renderBlock)}</View>
          </View>
        </View>
      )}
      {items.length > 0 && shouldUseBackground && Boolean(backgroundImageSource?.uri) && (
        <ImageBackground
          source={backgroundImageSource as ImageURISource}
          style={[containerStyle, imageStyle]}
          resizeMode={resizeMode}
          resizeMethod={resizeMethod}
        >
          <View style={textContainerStyle as ViewStyle}>
            <View style={{ width: '100%' }}>{items.map(renderBlock)}</View>
          </View>
        </ImageBackground>
      )}
    </>
  );
});
