import React, { Component } from 'react';

import type { ImageRequireSource, ImageURISource, StyleProp, ViewStyle } from 'react-native';
import { Image, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import type { GeoLocation } from '@brandingbrand/types-location';

import googleMapMakerSelected from '../../assets/images/google-map-marker-selected.png';
import googleMapMaker from '../../assets/images/google-map-marker.png';
import { getCenter, getDelta, isCoordinateChanged } from '../lib/helpers';
import { style as S } from '../styles/MapView';
import type { Location, Region } from '../types/Location';

import CurrentLocationPin from './CurrentLocationPin';

export const COLLAPSE_LAT_PADDING = 0.15;
export const COLLAPSE_LAT_DELTA_PADDING = 0.3;
export const COLLAPSE_LNG_DELTA_PADDING = 0.3;
export const IOS_MARKER_OFFSET_Y = -16;
export const IOS_MARKER_OFFSET_Y_SELECTED = -24;

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
  mapMarkerIcon?: ImageRequireSource | ImageURISource;
}

export default class MapViewNative extends Component<PropType> {
  public map: any;

  private readonly handleMarkerPress = (location: Location) => () => {
    if (this.props.onMakerPress) {
      this.props.onMakerPress(location);
    }
  };

  public componentDidMount(): void {
    this.moveToLocation(this.props.locations, this.props.isCollapsed, this.props.center);
  }

  public componentDidUpdate(prevProps: PropType): void {
    this.moveToLocation(this.props.locations, this.props.isCollapsed, this.props.center);
  }

  public shouldComponentUpdate(nextProps: PropType): boolean {
    if (
      nextProps.locations !== this.props.locations ||
      nextProps.isCollapsed !== this.props.isCollapsed ||
      isCoordinateChanged(nextProps.center, this.props.center)
    ) {
      return true;
    }
    return false;
  }

  public moveToLocation(
    locations: Location[],
    isCollapsed?: boolean,
    newCenter?: GeoLocation
  ): void {
    if (locations.length === 0) {
      return;
    }

    const center = newCenter || getCenter(locations);
    const delta = getDelta(locations);
    if (isCollapsed) {
      center.latitude -= COLLAPSE_LAT_PADDING;
      delta.latitudeDelta += COLLAPSE_LAT_DELTA_PADDING;
      delta.longitudeDelta += COLLAPSE_LNG_DELTA_PADDING;
    }
    const region =
      locations.length > 0
        ? {
            ...center,
            ...delta,
          }
        : null;

    this.map.animateToRegion(region);
  }

  public render(): JSX.Element {
    const { currentLocation, defaultRegion, locations, mapMarkerIcon, style } = this.props;
    const marker = mapMarkerIcon || googleMapMaker;
    const markerSelected = mapMarkerIcon || googleMapMakerSelected;

    if (!currentLocation && !(locations && locations.length > 0) && defaultRegion) {
      const initialRegion = {
        latitude: defaultRegion.latitude || 0,
        longitude: defaultRegion.longitude || 0,
        latitudeDelta: defaultRegion.latitudeDelta || 0,
        longitudeDelta: defaultRegion.longitudeDelta || 0,
      };

      return (
        <MapView initialRegion={initialRegion} ref={(map) => (this.map = map)} style={style} />
      );
    }

    return (
      <MapView
        onRegionChange={this.props.handleRegionChange}
        onRegionChangeComplete={this.props.handleRegionChangeComplete}
        ref={(map) => (this.map = map)}
        style={style}
      >
        {currentLocation && (
          <Marker coordinate={currentLocation}>
            <CurrentLocationPin />
          </Marker>
        )}

        {locations
          .filter((location) => Boolean(location.address.latlng.lat))
          .map((location, i) => {
            let image: ImageRequireSource | ImageURISource | undefined;

            if (Platform.OS === 'android') {
              image = location.selected ? markerSelected : marker;
            }

            return (
              <Marker
                centerOffset={{
                  x: 0,
                  y: location.selected ? IOS_MARKER_OFFSET_Y_SELECTED : IOS_MARKER_OFFSET_Y,
                }}
                coordinate={{
                  latitude: location.address.latlng.lat,
                  longitude: location.address.latlng.lng,
                }}
                image={image}
                key={i}
                onPress={this.handleMarkerPress(location)}
              >
                {Platform.OS === 'ios' && (
                  <Image
                    resizeMode="contain"
                    source={marker}
                    style={location.selected ? S.markerImageSelected : S.markerImage}
                  />
                )}
              </Marker>
            );
          })}
      </MapView>
    );
  }
}
