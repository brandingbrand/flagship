import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { CMSBannerStacked } from '../CMSBannerStacked';

import { CoreContentManagementSystemProvider } from '@brandingbrand/fsengage';

const provider = new CoreContentManagementSystemProvider({
  propertyId: '443',
  environment: 1
});

storiesOf('CMSBannerStacked', module)
  .add('basic usage', () => (
    <CMSBannerStacked
      cmsProviderManagementConfig={provider}
      cmsProviderGroup='Shop'
      cmsProviderSlot='Banner-Carousel'
    />
  ));
