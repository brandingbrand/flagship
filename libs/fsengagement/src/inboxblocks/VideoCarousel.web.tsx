import type { FC } from 'react';
import React, { useMemo, useState } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { CarouselProvider, Slide, Slider } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import CarouselItem from '../carousel/CarouselItem';
import { CarouselPagination } from '../carousel/Pagination';

import type { ImageBlockProps } from './ImageWithOverlay';
import type { TextBlockProps } from './TextBlock';

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
export interface VideoCarouselProps {
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
  viewMore?: ViewMore;
  autoplay?: Autoplay;
  loop?: boolean;
}

export const VideoCarousel: FC<VideoCarouselProps> = React.memo(
  ({
    autoplay,
    items,
    containerStyle = {},
    loop = false,
    options,
    cardContainerStyle,
    pagination,
    viewMore,
  }) => {
    const { itemHorizontalPaddingPercent, itemWidthPercent = 0 } = options;
    const [currentItem, setCurrentItem] = useState(1);
    const totalItems = items.length;

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

    const renderItem = (item: ImageBlockProps | TextBlockProps, index: number): JSX.Element => (
      <Slide key={index} index={index}>
        <CarouselItem
          item={item}
          key={index}
          spaceBetween={itemHorizontalPaddingPercent}
          index={index}
          options={options}
          modal={true}
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

    const itemWithViewMore: Array<ImageBlockProps | TextBlockProps> = useMemo(() => {
      if (viewMore?.enabled === true) {
        return [
          ...items,
          {
            private_type: 'Text',
            containerStyle: {
              alignItems: 'center',
              justifyContent: 'center',
              height:
                (calculateItemWidth() - itemHorizontalPaddingPercent) /
                Number.parseFloat(items[0]?.ratio ?? '1'),
            },
            key: Math.floor(Math.random() * 1000000).toString(),
            ...viewMore,
          },
        ];
      }
      return items;
    }, [items, viewMore]);

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
              {itemWithViewMore.map((item: ImageBlockProps | TextBlockProps, index: number) =>
                renderItem(item, index)
              )}
            </Slider>
          </CarouselProvider>
        </View>
      </View>
    );
  }
);
