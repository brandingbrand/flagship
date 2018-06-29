import { SearchBar } from '@brandingbrand/fscomponents';
import React, { Component } from 'react';
import {
  Image,
  LayoutAnimation,
  LayoutChangeEvent,
  Platform,
  TouchableOpacity,
  View
} from 'react-native';
import { style as S } from '../styles/LocatorMapVertical';
import { PropType as LocatorPropType } from './LocatorList';
import MapView from './MapView';
import ResultItemWithBack from './ResultItemWithBack';
import ResultList from './ResultList';
import SeachAreaButton from './SeachAreaButton';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

const defaultLocateMeIcon = require('../../assets/images/locate-me.png');
const MAP_HEIGHT = 300;
const LIST_HEIGHT = 300;

export interface LocatorStateType {
  orientation?: string;
}

export default class Locator extends Component<
  LocatorPropType,
  LocatorStateType
> {
  map: any;

  constructor(props: LocatorPropType) {
    super(props);

    this.state = {
      orientation: undefined
    };
  }

  extractMapRef = (map: any) => (this.map = map);

  onLayout = (e: LayoutChangeEvent): void => {
    const { width, height } = e.nativeEvent.layout;

    this.setState({
      orientation: width > height ? 'horizontal' : 'vertical'
    });
  }

  componentWillUpdate(): void {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }

  renderList = () => {
    const {
      locationItemProps,
      handleNavPress,
      handlePhonePress,
      selectLocation,
      selectedLocation,
      deselectLocation,
      renderLocationItem,
      renderLocationItemWithBack
    } = this.props;

    if (selectedLocation) {
      return (
        <ResultItemWithBack
          deselectLocation={deselectLocation}
          selectedLocation={selectedLocation}
          handleNavPress={handleNavPress}
          handlePhonePress={handlePhonePress}
          locationItemProps={locationItemProps}
          selectLocation={selectLocation}
          renderLocationItem={renderLocationItem}
          renderLocationItemWithBack={renderLocationItemWithBack}
        />
      );
    } else {
      return (
        <View style={[S.resultContainer, { height: LIST_HEIGHT }]}>
          <ResultList {...this.props} onItemPress={selectLocation} />
        </View>
      );
    }
  }

  renderSearchBar = () => {
    const { searchBarProps, renderSearchBar } = this.props;
    return renderSearchBar ? (
      renderSearchBar({
        submitSearch: this.props.submitSearch,
        useCurrentLocation: this.props.useCurrentLocation
      })
    ) : (
      <SearchBar
        placeholder={FSI18n.string(translationKeys.flagship.storeLocator.searchPlaceholder)}
        onSubmit={this.props.submitSearch}
        style={S.mapVerticalSearchBar}
        containerStyle={S.inputContainer}
        {...searchBarProps}
      />
    );
  }

  render(): JSX.Element {
    const {
      style,
      locations,
      useCurrentLocation,
      locateMeIcon,
      googleMapsAPIKey,
      selectLocation,
      selectedLocation,
      locationsNotFound,
      currentLocation,
      handleRegionChange,
      handleRegionChangeComplete,
      shouldShowSearchAreaButton,
      searchArea,
      mapMarkerIcon,
      showLocateMe,
      mapStyle
    } = this.props;

    const shouldMapCollapsed = !selectedLocation;
    const center = selectedLocation && {
      latitude: selectedLocation.address.latlng.lat,
      longitude: selectedLocation.address.latlng.lng
    };
    const shouldShowList = locationsNotFound || !!locations.length;

    return (
      <View style={[S.container, style]} onLayout={this.onLayout}>
        <MapView
          googleMapsAPIKey={googleMapsAPIKey}
          ref={this.extractMapRef}
          style={[S.map, mapStyle]}
          locations={locations}
          collapseHeight={MAP_HEIGHT}
          isCollapsed={shouldMapCollapsed}
          onMakerPress={selectLocation}
          center={center}
          currentLocation={currentLocation}
          handleRegionChange={handleRegionChange}
          handleRegionChangeComplete={handleRegionChangeComplete}
          mapMarkerIcon={mapMarkerIcon}
        />
        <View>
          {this.renderSearchBar()}
          {shouldShowSearchAreaButton && (
            <SeachAreaButton searchArea={searchArea} style={S.seachAreaBtn} />
          )}
        </View>
        <View style={S.resultListAndLocateMe}>
          {(this.state.orientation === 'vertical' || !shouldShowList) &&
            showLocateMe && (
              <TouchableOpacity
                style={S.locateMeButton}
                onPress={useCurrentLocation}
              >
                <Image
                  source={locateMeIcon || defaultLocateMeIcon}
                  style={S.locateMeIcon}
                />
              </TouchableOpacity>
            )}

          {shouldShowList && this.renderList()}
        </View>
      </View>
    );
  }
}
