/* eslint-disable unicorn/filename-case -- Matches our naming scheme for components */
import React, { useEffect, useMemo, useState } from 'react';

import { Image, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import type {
  ImageResizeMode,
  ImageStyle,
  ImageURISource,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import closeIcon from '../../assets/images/iconCloseXLight.png';
import { EngagementContext } from '../lib/contexts';
import type { BlockItem, CardProps } from '../types';

import layoutComponents from '.';

const styles = StyleSheet.create({
  buttonContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 10,
  },
  closeIcon: {
    width: 60,
    height: 60,
  },
  buttonContents: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

type JustifyValue =
  | 'center'
  | 'flex-end'
  | 'flex-start'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'
  | undefined;

interface BackgroundImage {
  imageStyle?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
  resizeMethod?: 'auto' | 'resize' | 'scale';
  source?: ImageURISource;
}
export interface DismissibleBannerProps extends CardProps {
  id: string;
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

export interface DismissibleBannerState {
  showing?: Boolean;
}

// eslint-disable-next-line max-lines-per-function, sonarjs/cognitive-complexity -- Keeping as single component for simplicity
export const DismissibleBanner: React.FC<DismissibleBannerProps> = React.memo((props) => {
  const {
    cardContainerStyle,
    containerStyle,
    items,
    link,
    backgroundImage = {},
    useBackground: shouldUseBackground = false,
    verticalAlignment,
    parentWidth,
    navigator,
    spaceBetween = 0,
    carouselType = '',
    id,
  } = props;
  const {
    imageStyle = {},
    resizeMode = 'cover',
    resizeMethod = 'resize',
    source: backgroundImageSource,
  } = backgroundImage;

  const [shouldShowBanner, setShowBanner] = useState(false);
  const { handleAction } = React.useContext(EngagementContext);

  useEffect(() => {
    const checkClosedBanner = async (): Promise<void> => {
      const closedBannerId = await AsyncStorage.getItem(`DismissibleBanner_${id}`);
      if (closedBannerId !== null) {
        setShowBanner(false);
      } else {
        setShowBanner(true);
      }
    };
    checkClosedBanner().catch(console.error);
  }, []);

  const closeBanner = (): void => {
    AsyncStorage.setItem(`DismissibleBanner_${id}`, 'true')
      .then(() => {
        setShowBanner(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onPressBanner = (): void => {
    if (handleAction && typeof link === 'string') {
      handleAction({
        type: 'deep-link',
        value: link,
      });
    }
  };

  const containerChildStyle: ViewStyle = useMemo(() => {
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

  const textContainerStyle: TextStyle =
    verticalAlignment && Boolean(containerStyle?.height)
      ? {
          flex: 1,
          justifyContent: verticalMap[verticalAlignment] as JustifyValue,
        }
      : {};

  if (!shouldShowBanner) {
    return null;
  }

  if (typeof link === 'string') {
    return (
      <View>
        <TouchableOpacity activeOpacity={1} onPress={onPressBanner}>
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
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconContainer]} activeOpacity={1} onPress={closeBanner}>
          <Image style={[styles.closeIcon]} source={closeIcon} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
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
      <TouchableOpacity style={[styles.iconContainer]} activeOpacity={1} onPress={closeBanner}>
        <Image style={[styles.closeIcon]} source={closeIcon} />
      </TouchableOpacity>
    </View>
  );
});
/* eslint-enable unicorn/filename-case -- Matches our naming scheme for components */
