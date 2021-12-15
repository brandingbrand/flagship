import React, { Component } from 'react';
import { Image, ImageURISource, Platform, StyleProp, ViewStyle } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GeoLocation } from '@brandingbrand/fsfoundation';
import { getCenter, getDelta, isCoordinateChanged } from '../lib/helpers';
import { style as S } from '../styles/MapView';
import { Location, Region } from '../types/Location';
import CurrentLocationPin from './CurrentLocationPin';

export const COLLAPSE_LAT_PADDING = 0.15;
export const COLLAPSE_LAT_DELTA_PADDING = 0.3;
export const COLLAPSE_LNG_DELTA_PADDING = 0.3;
export const IOS_MARKER_OFFSET_Y = -16;
export const IOS_MARKER_OFFSET_Y_SELECTED = -24;

const googleMapMaker = require('../../assets/images/google-map-marker.png');
const googleMapMakerSelected = require('../../assets/images/google-map-marker-selected.png');

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

export default class MapViewNative extends Component<PropType> {
  map: any;

  componentDidMount(): void {
    this.moveToLocation(
      this.props.locations,
      this.props.isCollapsed,
      this.props.center
    );
  }

  componentDidUpdate(prevProps: PropType): void {
    this.moveToLocation(
      this.props.locations,
      this.props.isCollapsed,
      this.props.center
    );
  }

  shouldComponentUpdate(nextProps: PropType): boolean {
    if (
      nextProps.locations !== this.props.locations ||
      nextProps.isCollapsed !== this.props.isCollapsed ||
      isCoordinateChanged(nextProps.center, this.props.center)
    ) {
      return true;
    } else {
      return false;
    }
  }

  moveToLocation(
    locations: Location[],
    isCollapsed?: boolean,
    newCenter?: GeoLocation
  ): void {
    if (!locations.length) {
      return;
    }

    const center = newCenter || getCenter(locations);
    const delta = getDelta(locations);
    if (isCollapsed) {
      center.latitude -= COLLAPSE_LAT_PADDING;
      delta.latitudeDelta += COLLAPSE_LAT_DELTA_PADDING;
      delta.longitudeDelta += COLLAPSE_LNG_DELTA_PADDING;
    }
    const region = locations.length
      ? {
        ...center,
        ...delta
      }
      : null;

    this.map.animateToRegion(region);
  }

  handleMarkerPress = (location: Location) => () => {
    if (this.props.onMakerPress) {
      this.props.onMakerPress(location);
    }
  }

  // eslint-disable-next-line complexity
  render(): JSX.Element {
    const { locations, style, currentLocation, mapMarkerIcon, defaultRegion } = this.props;
    const marker = mapMarkerIcon || googleMapMaker;
    const markerSelected = mapMarkerIcon || googleMapMakerSelected;

    if (!currentLocation && !(locations && locations.length) && defaultRegion) {
      const initialRegion = {
        latitude: defaultRegion.latitude || 0,
        longitude: defaultRegion.longitude || 0,
        latitudeDelta: defaultRegion.latitudeDelta || 0,
        longitudeDelta: defaultRegion.longitudeDelta || 0
      };

      return (
         <MapView
           ref={map => (this.map = map)}
           style={style}
           initialRegion={initialRegion}
         />
      );
    }

    return (
      <MapView
        ref={map => (this.map = map)}
        style={style}
        onRegionChange={this.props.handleRegionChange}
        onRegionChangeComplete={this.props.handleRegionChangeComplete}
      >
        {currentLocation && (
          <Marker coordinate={currentLocation}>
            <CurrentLocationPin />
          </Marker>
        )}

        {locations
          .filter(location => !!location.address.latlng.lat)
          .map((location, i) => {
            let image = null;

            if (Platform.OS === 'android') {
              image = location.selected ? markerSelected : marker;
            }

            return (
              <Marker
                key={i}
                onPress={this.handleMarkerPress(location)}
                image={image}
                centerOffset={{
                  x: 0,
                  y: location.selected
                    ? IOS_MARKER_OFFSET_Y_SELECTED
                    : IOS_MARKER_OFFSET_Y
                }}
                coordinate={{
                  latitude: location.address.latlng.lat,
                  longitude: location.address.latlng.lng
                }}
              >
                {Platform.OS === 'ios' && (
                  <Image
                    source={marker}
                    resizeMode='contain'
                    style={
                      location.selected ? S.markerImageSelected : S.markerImage
                    }
                  />
                )}
              </Marker>
            );
          })}
      </MapView>
    );
  }
}
