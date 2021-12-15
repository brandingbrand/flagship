import React from 'react';
import { storiesOf } from '@storybook/react';
import { CMSBannerStacked } from '../src/components/CMSBannerStacked';

import { CoreContentManagementSystemProvider } from '@brandingbrand/fsengage';

const provider = new CoreContentManagementSystemProvider({
  propertyId: '443',
  environment: 1,
});

storiesOf('CMSBannerStacked', module).add('basic usage', () => (
  <CMSBannerStacked
    cmsProviderManagementConfig={provider}
    cmsProviderGroup="Shop"
    cmsProviderSlot="Banner-Carousel"
  />
));
