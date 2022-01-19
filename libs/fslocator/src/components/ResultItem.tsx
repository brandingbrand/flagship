import React, { Component } from 'react';
import { getDistance } from '../lib/helpers';

import { LocationItem, LocationItemProps } from '@brandingbrand/fscomponents';
import { DistanceUnit } from '@brandingbrand/types-location';
import { Location } from '../types/Location';

export interface PropType {
  location: Location;
  locationItemProps?: LocationItemProps;
  currentLocation?: any;
  index?: number;
  handleNavPress: (location: Location, locationId?: number, index?: number) => () => void;
  handlePhonePress: (phone: string, locationId?: number, index?: number) => () => void;
  selectLocation: (location: Location) => void;
  renderLocationItem?: (data: any) => JSX.Element;
  selected?: boolean;
}

export default class ResultItem extends Component<PropType> {
  render(): JSX.Element {
    const {
      locationItemProps,
      currentLocation,
      location,
      index,
      handleNavPress,
      handlePhonePress,
      selectLocation,
      renderLocationItem,
      selected,
    } = this.props;

    // render custom location if provided
    if (renderLocationItem) {
      return renderLocationItem({
        location,
        index,
        selectLocation,
        handleNavPress,
        handlePhonePress,
        selected,
      });
    }

    const primaryService = location.services.find((s) => s.service === 'Store') || ({} as any);
    const hours = primaryService.hours;
    const phone = primaryService.contact.phones.find((p: any) => p.name === 'main').number;

    const distance = currentLocation
      ? {
          value: getDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            location.address.latlng.lat,
            location.address.latlng.lng
          ),
          unit: DistanceUnit.Mile,
        }
      : undefined;

    return (
      <LocationItem
        locationName={location.title}
        address={location.address}
        hours={hours}
        format="1"
        phone={phone}
        buttonTitle={phone}
        distance={distance}
        onNavButtonPress={handleNavPress(location, location.id, index)}
        onPhoneButtonPress={handlePhonePress(phone, location.id, index)}
        {...locationItemProps}
      />
    );
  }
}
