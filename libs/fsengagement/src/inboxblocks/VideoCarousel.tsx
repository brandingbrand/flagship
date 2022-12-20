import type { FC } from 'react';
import React, { useCallback, useMemo, useState } from 'react';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import { useModals } from '@brandingbrand/fsapp';

import CarouselItem from '../carousel/CarouselItem';
import { CarouselPagination } from '../carousel/Pagination';
import { VideoModal } from '../components/video-modal';
import CarouselProvider from '../lib/CarouselProvider';

import type { ImageBlockProps, VideoModalSource } from './ImageWithOverlay';
import type { TextBlockProps } from './TextBlock';

const styles = StyleSheet.create({
  carouselWrapper: {
    position: 'relative',
    display: 'flex',
  },
  slider: {
    overflow: 'visible',
  },
});

interface CarouselImageItem {
  index: number;
  item: ImageBlockProps | TextBlockProps;
}

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
    const {
      activeSlideAlignment,
      inactiveSlideOpacity = 1,
      inactiveSlideScale = 1,
      itemHorizontalPaddingPercent,
      itemWidthPercent,
    } = options;
    const modals = useModals();
    // const toggleDevMenu = useContext(ToggleDevMenu);

    const openVideo = useCallback(
      (video: VideoModalSource) => {
        modals
          .showModal(VideoModal, { video })
          .then((shouldHide) => {
            console.log('shouldHide', shouldHide);
          })
          .catch(() => undefined);
      },
      [modals]
    );
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

    const renderItem = ({ index, item }: CarouselImageItem): JSX.Element => (
      <CarouselItem
        item={item}
        key={index}
        openModal={openVideo}
        spaceBetween={itemHorizontalPaddingPercent}
        index={index}
        options={options}
        modal={true}
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
      <CarouselProvider currentItem={currentItem} totalItems={totalItems}>
        <View style={[styles.carouselWrapper, containerStyle]}>
          <Carousel
            data={itemWithViewMore}
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
