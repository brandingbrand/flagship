/**
 * This is a container for carousel component that
 * fetch data from engagement module and render carousel
 */

// TODO: update after data normalize on FSEngage

import React from 'react';

import { View } from 'react-native';

import type { CMSBannerProps } from './CMSBanner';
import { CMSBanner } from './CMSBanner';
import type { CMSProviderProps } from './CMSProvider';
import { withCMSProvider } from './CMSProvider';
import { MultiCarousel } from './MultiCarousel';

const DEFAULT_CAROUSEL_PROPS = {
  height: 200,
};

export interface CMSBannerCarouselProps extends CMSBannerProps, CMSProviderProps {
  carouselProps?: any;
}

class CMSBannerCarousel extends CMSBanner<CMSBannerCarouselProps> {
  public render(): React.ReactNode {
    const { carouselProps } = this.props;
    const { cmsData } = this.props;

    const _carouselProps = carouselProps || DEFAULT_CAROUSEL_PROPS;

    if (!cmsData || !cmsData.instances) {
      return null;
    }

    return (
      <View style={this.props.style}>
        <MultiCarousel
          data={cmsData.instances}
          itemsPerPage={1}
          renderItem={this.renderInstance}
          {..._carouselProps}
        />
      </View>
    );
  }
}

const WrappedCMSBannerCarousel = withCMSProvider(CMSBannerCarousel);

export { WrappedCMSBannerCarousel as CMSBannerCarousel };
