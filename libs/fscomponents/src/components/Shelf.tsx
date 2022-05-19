/**
 * This is a container for carousel component that
 * fetch data from engagement module and render carousel
 */

import type { FunctionComponent } from 'react';
import React, { memo } from 'react';

import { View } from 'react-native';

import type { CoreContentManagementSystemProvider } from '@brandingbrand/fsengage';

import { CMSBannerCarousel } from './CMSBannerCarousel';
import type { CarouselProps } from './Carousel';

export interface ShelfProps {
  provider: CoreContentManagementSystemProvider;
  group: string;
  identifier: string;
  carouselHeight?: number;
  topCarouselProps?: CarouselProps;
  bottomCarouselProps?: CarouselProps;
}

export const Shelf: FunctionComponent<ShelfProps> = memo((props): JSX.Element => {
  const {
    bottomCarouselProps,
    carouselHeight,
    children,
    group,
    identifier,
    provider,
    topCarouselProps,
  } = props;

  const tCarouselProps = topCarouselProps || {
    height: carouselHeight,
    showsPagination: false,
  };

  const bCarouselProps = bottomCarouselProps || {
    height: carouselHeight,
    showsPagination: false,
  };

  return (
    <View>
      <CMSBannerCarousel
        carouselProps={tCarouselProps}
        cmsProviderGroup={group}
        cmsProviderIdentifier={identifier}
        cmsProviderManagementConfig={provider}
        cmsProviderSlot="Banner-Top"
      />
      {children}
      <CMSBannerCarousel
        carouselProps={bCarouselProps}
        cmsProviderGroup={group}
        cmsProviderIdentifier={identifier}
        cmsProviderManagementConfig={provider}
        cmsProviderSlot="Banner-Bottom"
      />
    </View>
  );
});
