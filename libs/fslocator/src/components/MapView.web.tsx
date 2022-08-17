import React, { Component } from 'react';

import type { ImageURISource, StyleProp, ViewStyle } from 'react-native';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';

import type { GeoLocation } from '@brandingbrand/types-location';

// @ts-expect-error TODO: Fix @types/google-map-react (doesn't support all available options)
import GoogleMapReact from 'google-map-react';

// @ts-expect-error TODO: Add typing support for google-map-react/utils
// The root GoogleMapReact module does not export its utils, so we have to disable that check too
import { fitBounds } from 'google-map-react/utils';

import googleMapMaker from '../../assets/images/google-map-marker.png';
import { getCenter, getDelta } from '../lib/helpers';
import { style as S } from '../styles/MapView';
import type { Location, Region } from '../types/Location';

import CurrentLocationPin from './CurrentLocationPin';

const { height, width } = Dimensions.get('window');

export const COLLAPSE_LAT_PADDING = 0.25;
export const COLLAPSE_LAT_DELTA_PADDING = 0.2;
export const COLLAPSE_LNG_DELTA_PADDING = 0.2;

export interface PropType {
  googleMapsAPIKey?: string;
  center?: GeoLocation;
  locations: Location[];
  style?: StyleProp<ViewStyle>;
  collapseHeight?: number;
  isCollapsed?: boolean;
  onMakerPress?: (location: Location) => void;
  currentLocation?: GeoLocation;
  defaultRegion?: Region;
  handleRegionChange?: (e: Region) => void;
  handleRegionChangeComplete?: (e: Region) => void;
  mapMarkerIcon?: ImageURISource;
}

export interface Center {
  lat: number;
  lng: number;
}

export interface StateType {
  center?: Center;
  zoom?: number;
}

const Marker = ({ lat, lng, onPress, selected }: any): JSX.Element => (
  <TouchableOpacity onPress={onPress}>
    <Image
      source={googleMapMaker}
      style={[S.markerImageWeb, selected && S.markerImageSelectedWeb]}
    />
  </TouchableOpacity>
);

export default class MapViewWeb extends Component<PropType, StateType> {
  public map: any;
  private readonly defaultCenter: unknown = { lat: 39.506061, lng: -96.409026 };
  private readonly defaultZoom = 3;

  public state = {
    center: undefined,
    zoom: undefined,
  };

  private readonly handleMarkerPress = (location: Location) => () => {
    if (this.props.onMakerPress) {
      this.props.onMakerPress(location);
    }
  };

  private readonly moveToLocation = (
    locations: Location[],
    isCollapsed?: boolean,
    newCenter?: GeoLocation
  ) => {
    if (locations.length > 0) {
      const centerPos = newCenter || getCenter(locations);
      const centerPosDelta = getDelta(locations);

      if (isCollapsed) {
        centerPos.latitude -= COLLAPSE_LAT_PADDING;
        centerPosDelta.latitudeDelta += COLLAPSE_LAT_DELTA_PADDING;
        centerPosDelta.longitudeDelta += COLLAPSE_LNG_DELTA_PADDING;
      }

      const bounds = {
        nw: {
          lat: centerPos.latitude + centerPosDelta.latitudeDelta,
          lng: centerPos.longitude - centerPosDelta.longitudeDelta,
        },
        se: {
          lat: centerPos.latitude - centerPosDelta.latitudeDelta,
          lng: centerPos.longitude + centerPosDelta.longitudeDelta,
        },
      };

      const bound = fitBounds(bounds, { width, height });

      this.setState({
        center: bound.center,
        zoom: bound.zoom + 1,
      });
    }
  };

  private readonly handleChange = ({ center, zoom }: { center: Center; zoom: number }) => {
    this.setState({
      center,
      zoom,
    });

    if (this.props.handleRegionChangeComplete) {
      this.props.handleRegionChangeComplete({
        latitude: center.lat,
        longitude: center.lng,
      });
    }
  };

  public readonly mapRef = (map: unknown): void => {
    this.map = map;
  };

  public componentDidMount(): void {
    this.moveToLocation(this.props.locations, this.props.isCollapsed, this.props.center);
  }

  public componentDidUpdate(prevProps: PropType): void {
    if (
      this.props.locations !== prevProps.locations ||
      this.props.isCollapsed !== prevProps.isCollapsed ||
      this.props.center !== prevProps.center
    ) {
      this.moveToLocation(this.props.locations, this.props.isCollapsed, this.props.center);
    }
  }

  public render(): JSX.Element {
    const { currentLocation, googleMapsAPIKey, locations, style } = this.props;
    const { center, zoom } = this.state;

    return (
      <View style={style}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: googleMapsAPIKey,
          }}
          center={center}
          defaultCenter={this.defaultCenter}
          defaultZoom={this.defaultZoom}
          onChange={this.handleChange}
          options={{
            fullscreenControl: false,
            zoomControl: false,
          }}
          resetBoundsOnResize
          zoom={zoom}
        >
          {currentLocation ? (
            <CurrentLocationPin lat={currentLocation.latitude} lng={currentLocation.longitude} />
          ) : null}

          {locations.map((location, i) => (
            <Marker
              key={i}
              lat={location.address.latlng.lat}
              lng={location.address.latlng.lng}
              onPress={this.handleMarkerPress(location)}
              selected={location.selected}
            />
          ))}
        </GoogleMapReact>
      </View>
    );
  }
}
