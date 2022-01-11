import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Location } from '../types/Location';
import ResultItem from './ResultItem';
import { LocationItemProps } from '@brandingbrand/fscomponents';
import { LocationItemData } from './LocatorContainer';

import arrowLeft from '../../assets/images/arrow-left.png';

const S = StyleSheet.create({
  selectedLocationContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  backButton: {
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  backButtonImage: {
    marginLeft: 10,
    width: 30,
    height: 30,
  },
  itemContainer: {
    flex: 1,
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
      selectedLocation,
      handleNavPress,
      handlePhonePress,
      locationItemProps,
      selectLocation,
      renderLocationItem,
      renderLocationItemWithBack,
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
        <TouchableOpacity style={S.backButton} onPress={deselectLocation}>
          <Image source={arrowLeft} style={S.backButtonImage} />
        </TouchableOpacity>
        <View style={S.itemContainer}>
          <ResultItem
            location={selectedLocation}
            selected={true}
            handleNavPress={handleNavPress}
            handlePhonePress={handlePhonePress}
            locationItemProps={locationItemProps}
            selectLocation={selectLocation}
            renderLocationItem={renderLocationItem}
          />
        </View>
      </View>
    );
  }
}
