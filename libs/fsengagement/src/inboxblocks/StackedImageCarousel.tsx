import type { FC } from 'react';
import React, { useMemo, useState } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import { CarouselPagination } from '../carousel/Pagination';
import StackedCarouselItem from '../carousel/StackedCarouselItem';
import CarouselProvider from '../lib/CarouselProvider';

import type { ImageBlockProps } from './ImageWithOverlay';

const styles = StyleSheet.create({
  carouselWrapper: {
    position: 'relative',
    display: 'flex',
  },
  slider: {
    overflow: 'visible',
  },
});

interface StackedCarouselImageItem {
  index: number;
  item: ImageBlockProps[];
}
interface Autoplay {
  autoplayDelay: string;
  autoplayInterval: string;
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
export interface StackedImageCarouselProps {
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
  pagination?: any;
  autoplay?: Autoplay;
  loop?: boolean;
}

export const StackedImageCarousel: FC<StackedImageCarouselProps> = React.memo(
  ({
    autoplay,
    items,
    containerStyle = {},
    loop = false,
    options,
    cardContainerStyle,
    pagination,
  }) => {
    const {
      activeSlideAlignment,
      inactiveSlideOpacity = 1,
      inactiveSlideScale = 1,
      itemHorizontalPaddingPercent,
      itemWidthPercent,
    } = options;

    const [currentItem, setCurrentItem] = useState(1);
    const totalItems = Math.ceil(items.length);

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

    const onSnapToItem = (index: number): void => {
      setCurrentItem(index + 1);
    };

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

    const renderItem = ({ index, item }: StackedCarouselImageItem): JSX.Element => (
      <StackedCarouselItem
        item={item}
        key={index}
        spaceBetween={itemHorizontalPaddingPercent}
        index={index}
        options={options}
        renderItemWidth={calculateItemWidth()}
      />
    );

    const autoplayProps = useMemo(
      () =>
        autoplay
          ? {
              autoplay: true,
              autoplayDelay: Number.parseFloat(autoplay.autoplayDelay) * 1000,
              autoplayInterval: Number.parseFloat(autoplay.autoplayInterval) * 1000,
              lockScrollWhileSnapping: true,
            }
          : {},
      [autoplay]
    );

    const loopProps = useMemo(
      () =>
        loop
          ? {
              loop: true,
              loopClonesPerSide: 3,
            }
          : {},
      [loop]
    );

    return (
      <CarouselProvider currentItem={currentItem} totalItems={totalItems}>
        <View style={[styles.carouselWrapper, containerStyle]}>
          <Carousel
            data={stackedItems}
            layout="default"
            hasParallaxImages={false}
            sliderWidth={calculateSliderWidth()}
            itemWidth={calculateItemWidth()}
            inactiveSlideOpacity={inactiveSlideOpacity}
            inactiveSlideScale={inactiveSlideScale}
            enableMomentum={!autoplay}
            renderItem={renderItem}
            activeSlideAlignment={activeSlideAlignment}
            containerCustomStyle={styles.slider}
            activeAnimationType={'spring'}
            removeClippedSubviews={false}
            onSnapToItem={onSnapToItem}
            {...autoplayProps}
            {...loopProps}
          />
          {Boolean(pagination) && (
            <CarouselPagination
              activeIndex={currentItem}
              pagination={pagination}
              containerStyle={containerStyle}
              items={items}
            />
          )}
        </View>
      </CarouselProvider>
    );
  }
);
