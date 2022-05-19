import React from 'react';

import { CoreContentManagementSystemProvider } from '@brandingbrand/fsengage';

import { object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { CMSBannerCarousel } from '../src/components/CMSBannerCarousel';

const provider = new CoreContentManagementSystemProvider({
  propertyId: '443',
  environment: 1,
});

const defaultCarouselProps = {
  height: 200,
  showArrow: true,
};

const containerStyle = { padding: 0 };
const imageContainerStyle = { padding: 0 };

storiesOf('CMSBannerCarousel', module).add('basic usage', () => (
  <CMSBannerCarousel
    carouselProps={object('carouselProps', defaultCarouselProps)}
    cmsProviderGroup="Shop"
    cmsProviderManagementConfig={provider}
    cmsProviderSlot="Banner-Carousel"
    imageContainerStyle={object('imageContainerStyle', imageContainerStyle)}
    style={object('containerStyle', containerStyle)}
  />
));
