import React from 'react';
import { storiesOf } from '@storybook/react'; // tslint:disable-line:no-implicit-dependencies
import { action } from '@storybook/addon-actions'; // tslint:disable-line:no-implicit-dependencies
import { LocationItem } from '../LocationItem';
import {
  boolean,
  number,
  object,
  select,
  text
  // tslint:disable-next-line no-implicit-dependencies
} from '@storybook/addon-knobs';
// @ts-ignore
import stores from './assets/mocks/stores';

// shared
const formats = Array(11).fill('').map((_: any, index: number) => (index + 1).toString());
const location = stores.locations[0];
const service = location.services.find((s: any) => s.service === 'Store');
const hours = service.hours;
const phone = service.contact.phones.find((s: any) => s.name === 'main');

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
const greyBox = require('./assets/images/greyBox.png');

storiesOf('LocationItem', module)
  .add('basic usage', () => (
    <LocationItem
      locationName={location.title}
      address={location.address}
      hours={hours}
      format={select('format', formats, '1')}
      buttonTitle={text('buttonTitle', buttonTitle)}
      onButtonPress={action('LocationItem onButtonPress')}
      phone={phone.number}
      phoneIcon={greyBox}
      navIcon={boolean('showNavIcon', showNavIcon) ? greyBox : undefined}
      distance={{
        value: number('distanceValue', distanceValue),
        unit: select('distanceUnit', distanceUnit, 'miles') === 'miles' ? 0 : 1
      }}
      hourFormat={select('hourFomat', ['1', '2', '3'], '1')}
      distanceFormat={boolean('fullDistanceFormat', fullDistanceFormat) ? 'full' : undefined}
      onNavButtonPress={action('LocationItem onNavButtonPress')}
      onPhoneButtonPress={action('LocationItem onPhoneButtonPress')}
      titleStyle={object('titleStyle', titleStyle)}
      textStyle={object('textStyle', textStyle)}
      storeImage={greyBox}
      storeImageStyle={{ height: 100, width: 100 }}
      buttonStyle={object('buttonStyle', buttonStyle)}
      buttonTitleStyle={object('buttonTitleStyle', buttonTitleStyle)}
      linkStyle={object('linkStyle', linkStyle)}
      linkTitleStyle={object('linkTitleStyle', linkTitleStyle)}
    />
  ));
