import React from 'react';

import { CoreContentManagementSystemProvider } from '@brandingbrand/fsengage';

import { storiesOf } from '@storybook/react';

import { CMSBannerStacked } from '../src/components/CMSBannerStacked';

const provider = new CoreContentManagementSystemProvider({
  propertyId: '443',
  environment: 1,
});

storiesOf('CMSBannerStacked', module).add('basic usage', () => (
  <CMSBannerStacked
    cmsProviderGroup="Shop"
    cmsProviderManagementConfig={provider}
    cmsProviderSlot="Banner-Carousel"
  />
));
