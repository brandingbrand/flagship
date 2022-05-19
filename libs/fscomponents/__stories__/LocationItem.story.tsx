import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, number, object, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { LocationItem } from '../src/components/LocationItem';

import greyBox from './assets/images/greyBox.png';
import stores from './assets/mocks/stores';

// shared
const formats = Array.from({ length: 11 })
  .fill('')
  .map((_: unknown, index: number) => (index + 1).toString());
const location = stores.locations[0];
const service = location?.services.find((s) => s.service === 'Store');
const { hours } = service!;
const phone = service!.contact.phones.find((s) => s.name === 'main');

// format specific
const buttonTitle = 'More';
const titleStyle = { padding: 0 };
const textStyle = { padding: 0 };
const buttonStyle = { padding: 0 };
const buttonTitleStyle = { padding: 0 };
const linkStyle = { padding: 0 };
const linkTitleStyle = { padding: 0 };
const distanceValue = 0.6;
const distanceUnit = ['miles', 'kilometers'];
const fullDistanceFormat = false;
const showNavIcon = true;

storiesOf('LocationItem', module).add('basic usage', () => (
  <LocationItem
    address={location!.address}
    buttonStyle={object('buttonStyle', buttonStyle)}
    buttonTitle={text('buttonTitle', buttonTitle)}
    buttonTitleStyle={object('buttonTitleStyle', buttonTitleStyle)}
    distance={{
      value: number('distanceValue', distanceValue),
      unit: select('distanceUnit', distanceUnit, 'miles') === 'miles' ? 0 : 1,
    }}
    distanceFormat={boolean('fullDistanceFormat', fullDistanceFormat) ? 'full' : undefined}
    format={select('format', formats, '1')}
    hourFormat={select('hourFomat', ['1', '2', '3'], '1')}
    hours={hours}
    linkStyle={object('linkStyle', linkStyle)}
    linkTitleStyle={object('linkTitleStyle', linkTitleStyle)}
    locationName={location?.title ?? ''}
    navIcon={boolean('showNavIcon', showNavIcon) ? greyBox : undefined}
    onButtonPress={action('LocationItem onButtonPress')}
    onNavButtonPress={action('LocationItem onNavButtonPress')}
    onPhoneButtonPress={action('LocationItem onPhoneButtonPress')}
    phone={phone!.number}
    phoneIcon={greyBox}
    storeImage={greyBox}
    storeImageStyle={{ height: 100, width: 100 }}
    textStyle={object('textStyle', textStyle)}
    titleStyle={object('titleStyle', titleStyle)}
  />
));
