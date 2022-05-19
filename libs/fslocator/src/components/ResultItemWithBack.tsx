import React, { Component } from 'react';

import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import type { LocationItemProps } from '@brandingbrand/fscomponents';

import arrowLeft from '../../assets/images/arrow-left.png';
import type { Location } from '../types/Location';

import type { LocationItemData } from './LocatorContainer';
import ResultItem from './ResultItem';

const S = StyleSheet.create({
  backButton: {
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  backButtonImage: {
    height: 30,
    marginLeft: 10,
    width: 30,
  },
  itemContainer: {
    flex: 1,
  },
  selectedLocationContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
  },
});

export interface PropType {
  deselectLocation: () => void;
  selectedLocation: Location;
  handleNavPress: (location: Location, locationId?: number, index?: number) => () => void;
  handlePhonePress: (phone: string, locationId?: number, index?: number) => () => void;
  locationItemProps?: LocationItemProps;
  selectLocation: (location: Location) => void;
  renderLocationItem?: (data: LocationItemData) => JSX.Element;
  renderLocationItemWithBack?: (data: LocationItemData) => JSX.Element;
}

export default class ResultItemWithBack extends Component<PropType> {
  render(): JSX.Element {
    const {
      deselectLocation,
      handleNavPress,
      handlePhonePress,
      locationItemProps,
      renderLocationItem,
      renderLocationItemWithBack,
      selectLocation,
      selectedLocation,
    } = this.props;

    if (renderLocationItemWithBack) {
      return renderLocationItemWithBack({
        deselectLocation,
        location: selectedLocation,
        handleNavPress,
        handlePhonePress,
        selectLocation,
      });
    }

    return (
      <View style={S.selectedLocationContainer}>
        <TouchableOpacity onPress={deselectLocation} style={S.backButton}>
          <Image source={arrowLeft} style={S.backButtonImage} />
        </TouchableOpacity>
        <View style={S.itemContainer}>
          <ResultItem
            handleNavPress={handleNavPress}
            handlePhonePress={handlePhonePress}
            location={selectedLocation}
            locationItemProps={locationItemProps}
            renderLocationItem={renderLocationItem}
            selectLocation={selectLocation}
            selected
          />
        </View>
      </View>
    );
  }
}
