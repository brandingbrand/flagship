import React from 'react';

import type { ViewStyle } from 'react-native';
import { Dimensions, View } from 'react-native';

import type { BlockItem, ComponentList } from '../types';

import { ImageBlock } from './ImageBlock';
import type { ImageBlockProps } from './ImageWithOverlay';
import ImageWithOverlay from './ImageWithOverlay';

const { width: viewportWidth } = Dimensions.get('window');

const sliderWidth = viewportWidth;

export interface ImageItem extends ImageBlockProps {
  private_type: string;
  private_blocks?: BlockItem[];
}

export interface SideBySideImageProps {
  cardContainerStyle?: ViewStyle;
  items: ImageItem[];
  containerStyle?: ViewStyle;
}

const components: ComponentList = {
  ImageWithOverlay,
  Image: ImageBlock,
};

export const SideBySideImages: React.FC<SideBySideImageProps> = React.memo((props) => {
  const { containerStyle, items } = props;

  const parentCardStyles = (): number => {
    const { cardContainerStyle } = props;

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
    const ml = Number(containerStyle?.marginLeft ?? 0);
    const mr = Number(containerStyle?.marginRight ?? 0);
    const pr = Number(containerStyle?.paddingRight ?? 0);
    const pl = Number(containerStyle?.paddingLeft ?? 0);
    return ml + mr + pr + pl;
  };

  const calculateGridWidth = (): number =>
    sliderWidth - horizontalMarginPadding() - parentCardStyles();

  const renderItem = (item: ImageItem): React.ReactElement | null => {
    const { private_blocks, private_type, ...restProps } = item;

    const itemWidth = calculateGridWidth() / 2;

    const component = components[private_type];
    if (!component) {
      return null;
    }

    return React.createElement(component, {
      parentWidth: itemWidth,
      ...restProps,
    });
  };

  const createImageRow = (): JSX.Element => (
    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
      {items.map((item) => renderItem(item))}
    </View>
  );

  const row = createImageRow();

  return <View style={containerStyle}>{row}</View>;
});
