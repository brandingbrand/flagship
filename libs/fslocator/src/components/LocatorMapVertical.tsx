import React, { Component } from 'react';

import type { LayoutChangeEvent } from 'react-native';
import { Image, LayoutAnimation, Platform, TouchableOpacity, View } from 'react-native';

import { SearchBar } from '@brandingbrand/fscomponents';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import defaultLocateMeIcon from '../../assets/images/locate-me.png';
import { style as S } from '../styles/LocatorMapVertical';

import type { PropType as LocatorPropType } from './LocatorList';
import MapView from './MapView';
import ResultItemWithBack from './ResultItemWithBack';
import ResultList from './ResultList';
import SeachAreaButton from './SeachAreaButton';

const MAP_HEIGHT = 300;
const LIST_HEIGHT = 300;

export interface LocatorStateType {
  orientation?: string;
}

export default class Locator extends Component<LocatorPropType, LocatorStateType> {
  public state = {
    orientation: undefined,
  };

  public map: unknown;

  private readonly onLayout = (e: LayoutChangeEvent): void => {
    const { height, width } = e.nativeEvent.layout;

    this.setState({
      orientation: width > height ? 'horizontal' : 'vertical',
    });
  };

  private readonly renderList = () => {
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

    if (selectedLocation) {
      return (
        <ResultItemWithBack
          deselectLocation={deselectLocation}
          handleNavPress={handleNavPress}
          handlePhonePress={handlePhonePress}
          locationItemProps={locationItemProps}
          renderLocationItem={renderLocationItem}
          renderLocationItemWithBack={renderLocationItemWithBack}
          selectLocation={selectLocation}
          selectedLocation={selectedLocation}
        />
      );
    }
    return (
      <View style={[S.resultContainer, { height: LIST_HEIGHT }]}>
        <ResultList {...this.props} onItemPress={selectLocation} />
      </View>
    );
  };

  private readonly renderSearchBar = () => {
    const { renderSearchBar, searchBarProps } = this.props;
    return renderSearchBar ? (
      renderSearchBar({
        submitSearch: this.props.submitSearch,
        useCurrentLocation: this.props.useCurrentLocation,
      })
    ) : (
      <SearchBar
        containerStyle={S.inputContainer}
        onSubmit={this.props.submitSearch}
        placeholder={FSI18n.string(translationKeys.flagship.storeLocator.searchPlaceholder)}
        style={S.mapVerticalSearchBar}
        {...searchBarProps}
      />
    );
  };

  public readonly extractMapRef = (map: unknown) => (this.map = map);

  public componentDidUpdate(): void {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }

  public render(): JSX.Element {
    const {
      currentLocation,
      defaultRegion,
      googleMapsAPIKey,
      handleRegionChange,
      handleRegionChangeComplete,
      locateMeIcon,
      locations,
      locationsNotFound,
      mapMarkerIcon,
      mapStyle,
      searchArea,
      selectLocation,
      selectedLocation,
      shouldShowSearchAreaButton,
      showLocateMe,
      style,
      useCurrentLocation,
    } = this.props;

    const shouldMapCollapsed = !selectedLocation;
    const center = selectedLocation && {
      latitude: selectedLocation.address.latlng.lat,
      longitude: selectedLocation.address.latlng.lng,
    };
    const shouldShowList = locationsNotFound || locations.length > 0;

    return (
      <View onLayout={this.onLayout} style={[S.container, style]}>
        <MapView
          center={center}
          collapseHeight={MAP_HEIGHT}
          currentLocation={currentLocation}
          defaultRegion={defaultRegion}
          googleMapsAPIKey={googleMapsAPIKey}
          handleRegionChange={handleRegionChange}
          handleRegionChangeComplete={handleRegionChangeComplete}
          isCollapsed={shouldMapCollapsed}
          locations={locations}
          mapMarkerIcon={mapMarkerIcon}
          onMakerPress={selectLocation}
          ref={this.extractMapRef}
          style={[S.map, mapStyle]}
        />
        <View>
          {this.renderSearchBar()}
          {shouldShowSearchAreaButton && (
            <SeachAreaButton searchArea={searchArea} style={S.seachAreaBtn} />
          )}
        </View>
        <View style={S.resultListAndLocateMe}>
          {(this.state.orientation === 'vertical' || !shouldShowList) && showLocateMe && (
            <TouchableOpacity onPress={useCurrentLocation} style={S.locateMeButton}>
              <Image source={locateMeIcon || defaultLocateMeIcon} style={S.locateMeIcon} />
            </TouchableOpacity>
          )}

          {shouldShowList && this.renderList()}
        </View>
      </View>
    );
  }
}
