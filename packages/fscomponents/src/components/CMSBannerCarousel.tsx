/**
 * This is a container for carousel component that
 * fetch data from engagement module and render carousel
 */

// TODO: update after data normalize on FSEngage

import React from 'react';
import { View } from 'react-native';

import { CMSProviderProps, withCMSProvider } from './CMSProvider';

import { CMSBanner, CMSBannerProps } from './CMSBanner';
import { MultiCarousel } from './MultiCarousel';

const DEFAULT_CAROUSEL_PROPS = {
  height: 200
};

export interface CMSBannerCarouselProps extends CMSBannerProps, CMSProviderProps {
  carouselProps?: any;
}

class CMSBannerCarousel extends CMSBanner<CMSBannerCarouselProps> {
  render(): React.ReactNode {
    const { carouselProps } = this.props;
    const { cmsData } = this.props;

    const _carouselProps = carouselProps || DEFAULT_CAROUSEL_PROPS;

    if (!cmsData || !cmsData.instances) {
      return null;
    }

    return (
      <View style={this.props.style}>
        <MultiCarousel
          itemsPerPage={1}
          items={cmsData.instances}
          renderItem={this.renderInstance}
          {..._carouselProps}
        />
      </View>
    );
  }
}

const WrappedCMSBannerCarousel = withCMSProvider(CMSBannerCarousel);

export { WrappedCMSBannerCarousel as CMSBannerCarousel };
