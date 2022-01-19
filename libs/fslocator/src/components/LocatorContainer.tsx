import { Analytics } from '@brandingbrand/fsengage';
import FSNetwork from '@brandingbrand/fsnetwork';
import { GeoLocation } from '@brandingbrand/types-location';
import React, { Component } from 'react';
import { ImageURISource, Platform, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { default as Geolocation, GeolocationOptions } from '@react-native-community/geolocation';
import getCoordsByAddress from '../lib/getCoordsByAddress';
import getLocationPermission from '../lib/getLocationPermission';
import { callPhone, startDirections } from '../lib/helpers';
import { Location, Region } from '../types/Location';
import { COLLAPSE_LAT_PADDING } from './MapView';
import states from '../lib/states';
import { find } from 'lodash-es';
import { LocationItemProps, SearchBarProps } from '@brandingbrand/fscomponents';

// Distance filter is currently missing from @react-native-community/geolocation
// https://github.com/react-native-community/react-native-geolocation/issues/11
interface GeoOptions extends GeolocationOptions {
  distanceFilter?: number;
}

const DEFAULT_RADIUS = 10;

import LocatorList from '../components/LocatorList';
import LocatorMapSlideList from '../components/LocatorMapSlideList';
import LocatorMapVertical from '../components/LocatorMapVertical';

export interface LocationItemData {
  location: Location;
  index?: number;
  handlePhonePress: (phone: string, locationId?: number, index?: number) => () => void;
  selectLocation: (location: Location) => void;
  deselectLocation: () => void;
  handleNavPress: (location: Location, locationId?: number, index?: number) => () => void;
}

export interface SearchBarData {
  submitSearch: (searchValue: string) => void;
  useCurrentLocation: (searchValue: string) => void;
}

export interface PropType {
  brandId: string;
  googleMapsAPIKey?: string;
  format?: 'list' | 'mapVertical' | 'mapHorizontal' | 'mapSlideList';
  searchBarProps?: SearchBarProps;
  locationItemProps?: LocationItemProps;
  style?: StyleProp<ViewStyle>;
  mapStyle?: StyleProp<ViewStyle>;
  listStyle?: StyleProp<ViewStyle>;
  noResultsText?: string;
  noResultsTextStyle?: StyleProp<TextStyle>;
  locateMeIcon?: ImageURISource;
  geoOptions?: GeolocationOptions;
  mapMarkerIcon?: ImageURISource;
  analytics?: Analytics;
  showLocateMe?: boolean;
  renderLocationItem?: (data: LocationItemData) => JSX.Element;
  renderLocationItemWithBack?: (data: LocationItemData) => JSX.Element;
  renderSearchBar?: (data: SearchBarData) => JSX.Element;
  filterResult?: (data: Location[]) => Location[];
  defaultRegion?: Region;
  searchEndpoint?: string;
  searchRadius?: number;
  resultLimit?: number;
  handleAddressNotFound?: () => void;
  handleLocationNotFound?: () => void;
  customizedSearch?: (searchValue: string) => Promise<any>;
}

export interface StateType {
  locations: Location[];
  isLoading: boolean;
  locationsNotFound: boolean;
  currentLocation?: GeoLocation;
  selectedLocation?: Location;
  shouldShowSearchAreaButton: boolean;
}

export default class LocatorContainer extends Component<PropType, StateType> {
  fsNetwork: FSNetwork;
  currentMapRegion?: Region;

  readyToShowSearchAreaButton: boolean = false;
  timerToShowSearchAreaButton: any = null;

  constructor(props: PropType) {
    super(props);
    this.state = {
      locations: [],
      isLoading: false,
      locationsNotFound: false,
      selectedLocation: undefined,
      shouldShowSearchAreaButton: false,
    };
    this.fsNetwork = new FSNetwork();
  }

  componentDidMount(): void {
    if (this.props.analytics) {
      this.props.analytics.impression.generic(this, {});
    }
  }

  submitSearch = (searchValue: string) => {
    if (!searchValue) {
      return;
    }
    this.setState({ isLoading: true });

    const { analytics, googleMapsAPIKey } = this.props;
    if (analytics) {
      analytics.search.generic('SeachBar', { term: searchValue });
    }

    if (this.props.customizedSearch) {
      return this.props
        .customizedSearch(searchValue)
        .then((res) => {
          this.resetShowSearchAreaButton();
          const _data = this.props.filterResult ? this.props.filterResult(res) : res;

          this.setState({
            locations: _data.locations,
            isLoading: false,
            locationsNotFound: !_data.locations || !_data.locations.length,
            selectedLocation: undefined,
            shouldShowSearchAreaButton: false,
          });

          if (this.props.analytics) {
            this.props.analytics.search.generic('SeachBar', {
              term: searchValue,
              count: _data.locations.length,
            });
          }
        })
        .catch((e) => console.log(e));
    }

    const state = find(states, (state, abbr) => {
      const searchLower = searchValue.toLowerCase();
      return searchLower === state.toLowerCase() || searchLower === abbr.toLowerCase();
    });

    if (state) {
      return this.fetchLocationsByState(searchValue);
    }

    return getCoordsByAddress(searchValue, googleMapsAPIKey)
      .then((coords) => {
        if (!coords) {
          this.setState({ isLoading: false });
          if (this.props.handleAddressNotFound) {
            this.props.handleAddressNotFound();
          } else {
            alert('Address not found');
          }
        } else {
          this.fetchLocations(
            searchValue,
            coords.latitude,
            coords.longitude,
            this.props.searchRadius || DEFAULT_RADIUS
          );
        }
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        if (this.props.handleAddressNotFound) {
          this.props.handleAddressNotFound();
        } else {
          alert(`Cannot get address: ${err}`);
        }
      });
  };

  handlePhonePress = (phone: string, locationId?: any, index?: number) => () => {
    if (this.props.analytics) {
      this.props.analytics.click.generic('CallButton', {
        identifier: locationId || '',
        index,
      });
    }

    callPhone(phone)
      .then(() => {
        if (this.props.analytics) {
          this.props.analytics.contact.call('CallButton', {
            number: phone,
          });
        }
      })
      .catch(() => {
        // TODO: better error handling
      });
  };

  handleNavPress = (location: Location, locationId?: any, index?: number) => () => {
    if (this.props.analytics) {
      this.props.analytics.click.generic('DirectionButton', {
        identifier: locationId || '',
        index,
      });
    }

    startDirections(location.title, location.address)
      .then(() => {
        if (this.props.analytics) {
          const fullAddress =
            [location.address.address1, location.address.address2].filter(Boolean).join(' ') +
            ` ${location.address.city}, ${location.address.state} ${location.address.zip}`;

          this.props.analytics.location.directions('DirectionButton', {
            address: fullAddress,
            identifier: locationId || '',
          });
        }
      })
      .catch(() => {
        // TODO: better error handling
      });
  };

  fetchLocationsByQuery = (query: string, term: string): void => {
    this.setState({
      locationsNotFound: false,
      isLoading: true,
    });

    const searchEndpoint = this.props.searchEndpoint;
    const brandId = encodeURIComponent(this.props.brandId);
    const resultLimit = this.props.resultLimit
      ? '&limit=' + encodeURIComponent(this.props.resultLimit + '')
      : '';
    const brandedQuery = `brand=${brandId}` + (query ? '&' + query : '') + resultLimit;

    this.fsNetwork
      .get(`${searchEndpoint}/?${brandedQuery}`)
      .then(({ data }) => {
        this.resetShowSearchAreaButton();
        const _data = this.props.filterResult ? this.props.filterResult(data) : data;

        this.setState({
          locations: _data.locations,
          isLoading: false,
          locationsNotFound: !_data.locations || !_data.locations.length,
          selectedLocation: undefined,
          shouldShowSearchAreaButton: false,
        });

        if (this.props.analytics) {
          this.props.analytics.search.generic('SeachBar', {
            term,
            count: _data.locations.length,
          });
        }
      })
      .catch((err) => {
        if (__DEV__) {
          console.error(err);
        }
        this.setState({
          isLoading: false,
          locationsNotFound: false,
          selectedLocation: undefined,
        });
      });
  };

  fetchLocationsByState = (state: string): void => {
    const encodedState = encodeURIComponent(state);
    const query = `state=${encodedState}`;

    this.fetchLocationsByQuery(query, state);
  };

  fetchLocations = (searchValue: string, lat: number, lon: number, radius: number): void => {
    const encodedLat = encodeURIComponent('' + lat);
    const encodedLon = encodeURIComponent('' + lon);
    const encodedRadius = encodeURIComponent('' + radius);
    const query = `lat=${encodedLat}&lon=${encodedLon}&radius=${encodedRadius}`;

    this.fetchLocationsByQuery(query, searchValue);
  };

  // hold the map move for a few seconds after result show
  // because the map is moving but we don't want to show
  // seach area button yet.
  resetShowSearchAreaButton = () => {
    this.readyToShowSearchAreaButton = false;
    clearTimeout(this.timerToShowSearchAreaButton);
    this.timerToShowSearchAreaButton = setTimeout(() => {
      this.readyToShowSearchAreaButton = true;
    }, 1000);
  };

  useCurrentLocation = async () => {
    if (this.props.analytics) {
      this.props.analytics.click.generic('LocateMeButton', {});
    }

    if (__DEV__) {
      this.setState({
        currentLocation: { latitude: 40.7127837, longitude: -74.0059413 },
      });
      return this.fetchLocations(
        'Current Location',
        40.7127837,
        -74.0059413,
        this.props.searchRadius || DEFAULT_RADIUS
      );
    }

    const granted = await getLocationPermission();

    if (granted) {
      Geolocation.getCurrentPosition(
        (pos) => {
          if (pos.coords && pos.coords.latitude) {
            this.setState({ currentLocation: pos.coords });
            this.fetchLocations(
              'Current Location',
              pos.coords.latitude,
              pos.coords.longitude,
              this.props.searchRadius || DEFAULT_RADIUS
            );
          } else {
            if (this.props.handleLocationNotFound) {
              this.props.handleLocationNotFound();
            } else {
              this.handleLocationNotFound();
            }
          }
        },
        (error) => {
          if (this.props.handleLocationNotFound) {
            this.props.handleLocationNotFound();
          } else {
            this.handleLocationNotFound();
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 10000,
          distanceFilter: 100,
          ...this.props.geoOptions,
        } as GeoOptions
      );
    }
  };

  handleLocationNotFound = () => {
    // TODO
    alert('Sorry, we cannot determine your location.');
  };

  selectLocation = (location: Location) => {
    this.resetShowSearchAreaButton();

    const { locations } = this.state;
    locations.forEach((l) => (l.selected = l.id === location.id));
    this.setState({
      selectedLocation: location,
      locations,
      shouldShowSearchAreaButton: false,
    });
  };

  deselectLocation = () => {
    this.resetShowSearchAreaButton();

    const { locations } = this.state;
    locations.forEach((l) => (l.selected = false));
    this.setState({
      selectedLocation: undefined,
      locations,
      shouldShowSearchAreaButton: false,
    });
  };

  handleRegionChange = (region: Region) => {
    this.currentMapRegion = region;
  };

  handleRegionChangeComplete = (region: Region) => {
    if (!this.readyToShowSearchAreaButton) {
      return;
    }

    if (this.state.shouldShowSearchAreaButton && Platform.OS !== 'web') {
      return;
    }

    this.currentMapRegion = region;
    this.setState({
      shouldShowSearchAreaButton: true,
    });
  };

  searchArea = () => {
    const offset = this.state.selectedLocation ? 0 : COLLAPSE_LAT_PADDING;
    const { latitude = 0, longitude = 0 } = this.currentMapRegion || {};

    this.fetchLocations(
      'Search Area',
      latitude + offset,
      longitude,
      this.props.searchRadius || DEFAULT_RADIUS
    );
  };

  render(): JSX.Element {
    const { format } = this.props;
    const locatorProps = {
      ...this.props,
      ...this.state,
      submitSearch: this.submitSearch,
      useCurrentLocation: this.useCurrentLocation,
      handleNavPress: this.handleNavPress,
      handlePhonePress: this.handlePhonePress,
      selectLocation: this.selectLocation,
      deselectLocation: this.deselectLocation,
      handleRegionChange: this.handleRegionChange,
      handleRegionChangeComplete: this.handleRegionChangeComplete,
      searchArea: this.searchArea,
    };

    switch (format) {
      case 'list':
        return <LocatorList {...locatorProps} />;
      case 'mapVertical':
        return <LocatorMapVertical {...locatorProps} />;
      case 'mapHorizontal':
        return <LocatorList {...locatorProps} />;
      case 'mapSlideList':
        return <LocatorMapSlideList {...locatorProps} />;
      default:
        return <LocatorList {...locatorProps} />;
    }
  }
}
