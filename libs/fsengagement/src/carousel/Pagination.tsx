import React from 'react';

import type { ViewStyle } from 'react-native';
import { Pagination } from 'react-native-snap-carousel';

export interface PaginationProps {
  dotColor: string;
  inactiveDotColor: string;
  dotSpacing: number;
  dotSize: number;
  inactiveDotOpacity: number;
  inactiveDotScale: number;
  position: string;
  positionOffset: number;
}
export interface CarouselPaginationProps {
  activeIndex: number;
  containerStyle?: ViewStyle;
  items: any;
  pagination?: PaginationProps;
}
export const CarouselPagination = React.memo((props: CarouselPaginationProps) => {
  const { activeIndex, containerStyle, items, pagination } = props;
  if (!pagination || !items?.length) {
    return <></>;
  }
  const {
    dotColor,
    dotSize,
    dotSpacing,
    inactiveDotColor,
    inactiveDotOpacity,
    inactiveDotScale,
    position,
    positionOffset,
  } = pagination;

  const containerOffset = -(
    Number(containerStyle?.paddingLeft ?? 0) + Number(containerStyle?.marginLeft ?? 0)
  );
  const defaultPosition = position === 'default' ? 0 : -dotSize;
  const paginationContainerStyle = {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginLeft: containerOffset,
    marginTop:
      position === 'default' ? defaultPosition + positionOffset : defaultPosition - positionOffset,
  };
  return (
    <Pagination
      dotsLength={items.length}
      dotColor={dotColor}
      inactiveDotColor={inactiveDotColor}
      activeDotIndex={activeIndex - 1}
      dotContainerStyle={{
        marginHorizontal: dotSpacing,
      }}
      containerStyle={paginationContainerStyle}
      dotStyle={{
        width: dotSize,
        height: dotSize,
        borderRadius: Math.round(dotSize / 2),
        marginHorizontal: 0,
      }}
      inactiveDotOpacity={inactiveDotOpacity}
      inactiveDotScale={inactiveDotScale}
    />
  );
});
