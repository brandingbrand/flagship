import type { FC } from 'react';
import React, { useMemo, useState } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { CarouselProvider, Slide, Slider } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import StackedCarouselItem from '../carousel/StackedCarouselItem';

import type { ImageBlockProps } from './ImageWithOverlay';

const style = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
  },
});

interface Autoplay {
  autoplayDelay: string;
  autoplayInterval: string;
}
export interface ViewMore {
  enabled: boolean;
  text: string;
  link?: string;
  textStyle: StyleProp<TextStyle>;
}
export interface CarouselOptions {
  itemWidthPercent: number;
  itemHorizontalPaddingPercent: number;
  activeSlideAlignment: 'center' | 'start';
  textPadding: ViewStyle;
  inactiveSlideOpacity?: number;
  inactiveSlideScale?: number;
  imagePadding?: number;
}
export interface StackedImageCarouselWebProps {
  id?: string;
  category?: string;
  containerStyle?: ViewStyle;
  items: ImageBlockProps[];
  size?: string;
  options: CarouselOptions;
  cardContainerStyle?: ViewStyle;
  tab?: string;
  pageCounterStyle?: StyleProp<ViewStyle>;
  pageNumberStyle?: StyleProp<TextStyle>;
  viewMore?: ViewMore;
  autoplay?: Autoplay;
  loop?: boolean;
}

export const StackedImageCarousel: FC<StackedImageCarouselWebProps> = React.memo(
  ({ autoplay, items, containerStyle = {}, loop = false, options, cardContainerStyle }) => {
    const { itemHorizontalPaddingPercent, itemWidthPercent = 0 } = options;

    const { width: deviceWidth } = useWindowDimensions();

    const parentCardStyles = (): number => {
      if (!cardContainerStyle) {
        return 0;
      }
      const ml = Number(cardContainerStyle.marginLeft ?? 0);
      const mr = Number(cardContainerStyle.marginRight ?? 0);
      const pr = Number(cardContainerStyle.paddingRight ?? 0);
      const pl = Number(cardContainerStyle.paddingLeft ?? 0);
      return ml + mr + pr + pl;
    };

    const horizontalMarginPadding = (): number => {
      const ml = Number(containerStyle.marginLeft ?? 0);
      const mr = Number(containerStyle.marginRight ?? 0);
      const pr = Number(containerStyle.paddingRight ?? 0);
      const pl = Number(containerStyle.paddingLeft ?? 0);
      return ml + mr + pr + pl;
    };
    const calculateSliderWidth = (): number =>
      deviceWidth - horizontalMarginPadding() - parentCardStyles();
    const calculateItemWidth = (): number => {
      const slideWidth = Math.round((calculateSliderWidth() * itemWidthPercent) / 100);
      return slideWidth + itemHorizontalPaddingPercent;
    };

    const renderItem = (item: ImageBlockProps[], index: number): JSX.Element => (
      <Slide key={index} index={index}>
        <StackedCarouselItem
          item={item}
          key={index}
          spaceBetween={itemHorizontalPaddingPercent}
          index={index}
          options={options}
          renderItemWidth={calculateItemWidth()}
        />
      </Slide>
    );

    const autoplayProps = useMemo(
      () =>
        autoplay
          ? {
              isPlaying: true,
              interval: parseFloat(autoplay.autoplayInterval) * 1000,
            }
          : {},
      [autoplay]
    );

    const loopProps = useMemo(
      () =>
        loop
          ? {
              infinite: true,
            }
          : {},
      [loop]
    );

    const stackedItems = useMemo(() => {
      const result = [];
      let slide = [];
      for (const [, img] of items.entries()) {
        slide.push(img);
        if (slide.length > 1) {
          result.push(slide);
          slide = [];
        }
      }
      return result;
    }, [items]);

    return (
      <View style={containerStyle}>
        <View style={style.container}>
          <CarouselProvider
            naturalSlideWidth={1}
            naturalSlideHeight={1}
            isIntrinsicHeight={true}
            totalSlides={items.length}
            visibleSlides={1}
            {...autoplayProps}
            {...loopProps}
          >
            <Slider style={{ paddingRight: `${100 - itemWidthPercent}%` }}>
              {stackedItems.map((item: ImageBlockProps[], index: number) =>
                renderItem(item, index)
              )}
            </Slider>
          </CarouselProvider>
        </View>
      </View>
    );
  }
);
