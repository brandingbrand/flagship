import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import {
  object
// tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
import { CMSBannerCarousel } from '../CMSBannerCarousel';

import { CoreContentManagementSystemProvider } from '@brandingbrand/fsengage';

const provider = new CoreContentManagementSystemProvider({
  propertyId: '443',
  environment: 1
});

const defaultCarouselProps = {
  height: 200,
  showArrow: true
};

storiesOf('CMSBannerCarousel', module)
  .add('basic usage', () => (
    <CMSBannerCarousel
      cmsProviderManagementConfig={provider}
      cmsProviderGroup='Shop'
      cmsProviderSlot='Banner-Carousel'
      carouselProps={object('carouselProps', defaultCarouselProps)}
    />
  ));
