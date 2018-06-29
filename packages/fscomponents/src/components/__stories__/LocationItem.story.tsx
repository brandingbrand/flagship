import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import { DistanceUnit } from '@brandingbrand/fsfoundation';
import { LocationItem } from '../LocationItem';
// @ts-ignore
import stores from './assets/mocks/stores';

const location = stores.locations[0];
const service = location.services.find((s: any) => s.service === 'Store');
const hours = service.hours;
const phone = service.contact.phones.find((s: any) => s.name === 'main');

storiesOf('LocationItem', module)
  .add('basic usage', () => (
    <LocationItem
      locationName={location.title}
      address={location.address}
      hours={hours}
      format='1'
      phone={phone.number}
      distance={{ value: 0.6, unit: DistanceUnit.Mile }}
      onNavButtonPress={action('LocationItem onNavButtonPress')}
      onPhoneButtonPress={action('LocationItem onPhoneButtonPress')}
    />
  ));
