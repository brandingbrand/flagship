import type { FC } from 'react';
import React from 'react';

import type { ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import type { CarouselOptions } from '../inboxblocks/ImageCarouselV2';
import type { ImageBlockProps, VideoModalSource } from '../inboxblocks/ImageWithOverlay';
import type { TextBlockProps } from '../inboxblocks/TextBlock';
import type { BlockItem } from '../types';

import { renderBlock } from './utils';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    position: 'relative',
  },
  overlayBelow: {
    marginTop: 20,
  },
});

interface CarouselItemProps {
  /**
   * This is the height for the carousel card in the slide, not the slide itself.
   */
  height?: number;
  hasTextBelow?: boolean;
  modal?: boolean;
  options?: CarouselOptions;
  index?: number;
  renderItemWidth: number;
  item: ImageBlockProps | TextBlockProps;
  tab?: string;
  type?: string;
  spaceBetween: number;
  isActive?: boolean;
  openModal?: (video: VideoModalSource) => void;
}

const CarouselItem: FC<CarouselItemProps> = React.memo(
  ({ item, openModal, renderItemWidth, spaceBetween }) => {
    const { textBelowImage } = item;

    const textBelowStyle: ViewStyle = {};
    if (textBelowImage?.enabled === true) {
      if (textBelowImage.options?.padding ?? 0) {
        textBelowStyle.padding = textBelowImage.options?.padding;
      }
      if (textBelowImage.options?.backgroundColor ?? '') {
        textBelowStyle.backgroundColor = textBelowImage.options?.backgroundColor;
      }
    }

    return (
      <View style={[styles.wrapper, { paddingRight: spaceBetween }]}>
        {renderBlock({
          ...item,
          parentWidth: renderItemWidth - spaceBetween,
          spaceBetween,
          isCarouselItem: true,
          isReel: true,
          openModal,
        })}
        {Boolean(textBelowImage?.enabled && textBelowImage.items.length > 0) && (
          <View style={textBelowStyle}>
            {(textBelowImage?.items || []).map((itm: BlockItem) =>
              renderBlock({
                ...itm,
                parentWidth: renderItemWidth,
                spaceBetween,
              })
            )}
          </View>
        )}
      </View>
    );
  }
);

export default CarouselItem;
