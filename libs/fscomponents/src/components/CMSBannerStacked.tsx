/**
 * Component for stacking CMS banners.
 */

import React from 'react';

import { View } from 'react-native';

import { CMSProviderProps, withCMSProvider } from './CMSProvider';

import { CMSBanner, CMSBannerProps } from './CMSBanner';

export interface CMSBannerStackedProps extends CMSBannerProps, CMSProviderProps {
  carouselProps?: any;
  accessible?: boolean;
  getAccessibilityLabel?: (instance: any) => string;
}

class CMSBannerStacked extends CMSBanner<CMSBannerStackedProps> {
  render(): React.ReactNode {
    const { cmsData } = this.props;

    if (!cmsData || !cmsData.instances) {
      return null;
    }

    return (
      <View style={this.props.style}>
        {cmsData.instances.map((instance: any, i: number) => this.renderInstance(instance, i))}
      </View>
    );
  }
}

const WrappedCMSBannerStacked = withCMSProvider(CMSBannerStacked);

export { WrappedCMSBannerStacked as CMSBannerStacked };
