/**
 * Component for stacking CMS banners.
 */

import React from 'react';

import { View } from 'react-native';

import type { CMSBannerProps } from './CMSBanner';
import { CMSBanner } from './CMSBanner';
import type { CMSProviderProps } from './CMSProvider';
import { withCMSProvider } from './CMSProvider';

export interface CMSBannerStackedProps extends CMSBannerProps, CMSProviderProps {
  carouselProps?: unknown;
  accessible?: boolean;
  getAccessibilityLabel?: (instance: unknown) => string;
}

class CMSBannerStacked extends CMSBanner<CMSBannerStackedProps> {
  public render(): React.ReactNode {
    const { cmsData } = this.props;

    if (!cmsData || !cmsData.instances) {
      return null;
    }

    return (
      <View style={this.props.style}>
        {cmsData.instances.map((instance: unknown, i: number) => this.renderInstance(instance, i))}
      </View>
    );
  }
}

const WrappedCMSBannerStacked = withCMSProvider(CMSBannerStacked);

export { WrappedCMSBannerStacked as CMSBannerStacked };
