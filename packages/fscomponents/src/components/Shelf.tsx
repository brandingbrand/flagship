/**
 * This is a container for carousel component that
 * fetch data from engagement module and render carousel
 */

import { CoreContentManagementSystemProvider } from '@brandingbrand/fsengage';
import React, { FunctionComponent, memo } from 'react';
import { View } from 'react-native';
import { CarouselProps } from './Carousel';
import { CMSBannerCarousel } from './CMSBannerCarousel';

export interface ShelfProps {
  provider: CoreContentManagementSystemProvider;
  group: string;
  identifier: string;
  carouselHeight?: number;
  topCarouselProps?: CarouselProps;
  bottomCarouselProps?: CarouselProps;
}

export const Shelf: FunctionComponent<ShelfProps> = memo((props):
JSX.Element => {
  const {
    children,
    provider,
    group,
    identifier,
    carouselHeight,
    topCarouselProps,
    bottomCarouselProps
  } = props;

  const tCarouselProps = topCarouselProps || {
    height: carouselHeight,
    showsPagination: false
  };

  const bCarouselProps = bottomCarouselProps || {
    height: carouselHeight,
    showsPagination: false
  };

  return (
    <View>
      <CMSBannerCarousel
        cmsProviderManagementConfig={provider}
        cmsProviderGroup={group}
        cmsProviderSlot='Banner-Top'
        cmsProviderIdentifier={identifier}
        carouselProps={tCarouselProps}
      />
      {children}
      <CMSBannerCarousel
        cmsProviderManagementConfig={provider}
        cmsProviderGroup={group}
        cmsProviderSlot='Banner-Bottom'
        cmsProviderIdentifier={identifier}
        carouselProps={bCarouselProps}
      />
    </View>
  );

});
