import React from 'react';
import { Pagination } from 'react-native-snap-carousel';

export const CarouselPagination = React.memo((props: any) => {
  const { containerStyle, pagination, items, activeIndex } = props;
  if (!pagination || !items?.length) {
    return <></>;
  }
  const {
    dotColor,
    inactiveDotColor,
    dotSize,
    dotSpacing,
    inactiveDotOpacity,
    inactiveDotScale,
    position,
    positionOffset,
  } = pagination;

  const containerOffset = -(containerStyle?.paddingLeft ?? 0 + containerStyle?.marginLeft ?? 0);
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
