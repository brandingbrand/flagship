import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { Shelf } from '../Shelf';

import { CoreContentManagementSystemProvider } from '@brandingbrand/fsengage';

const provider = new CoreContentManagementSystemProvider({
  propertyId: '443',
  environment: 1
});

storiesOf('Shelf', module)
  .add('basic usage', () => (
    <Shelf
      provider={provider}
      group='Shop'
      identifier='Banner-Carousel'
      carouselHeight={150}
    />
  ));
