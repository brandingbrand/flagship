import type { FC } from 'react';
import React from 'react';

import type { ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import type { CarouselOptions } from '../inboxblocks/ImageCarouselV2';
import type { ImageBlockProps } from '../inboxblocks/ImageWithOverlay';

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
  options?: CarouselOptions;
  index?: number;
  renderItemWidth: number;
  item: ImageBlockProps[];
  tab?: string;
  type?: string;
  spaceBetween: number;
  onPressItem?: (item: any) => void;
  renderCustomContent?: (item: any) => JSX.Element | null;
  isActive?: boolean;
}

const StackedCarouselItem: FC<CarouselItemProps> = React.memo(
  ({ item, renderItemWidth, spaceBetween }) => (
    <View style={[styles.wrapper, { paddingRight: spaceBetween }]}>
      {item.map((img: ImageBlockProps, index: number) => {
        const { textBelowImage } = img;

        const textBelowStyle: ViewStyle = {};
        if (textBelowImage?.enabled) {
          if (textBelowImage.options?.padding) {
            textBelowStyle.padding = textBelowImage.options?.padding;
          }
          if (textBelowImage.options?.backgroundColor) {
            textBelowStyle.backgroundColor = textBelowImage.options?.backgroundColor;
          }
        }

        return (
          <View key={index} style={{ marginBottom: index === 0 ? spaceBetween : 0 }}>
            <View>
              {renderBlock({
                ...img,
                parentWidth: renderItemWidth - spaceBetween,
                spaceBetween,
                isCarouselItem: true,
              })}
            </View>
            {Boolean(textBelowImage?.enabled && textBelowImage?.items.length) && (
              <View style={textBelowStyle}>
                {(textBelowImage?.items || []).map((item: any) =>
                  renderBlock({
                    ...item,
                    parentWidth: renderItemWidth,
                    spaceBetween,
                  })
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  )
);

export default StackedCarouselItem;
