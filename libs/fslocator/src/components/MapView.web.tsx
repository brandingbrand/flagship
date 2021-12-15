// @ts-ignore TODO: Fix @types/google-map-react (doesn't support all available options)
import GoogleMapReact from 'google-map-react';

// @ts-ignore TODO: Add typing support for google-map-react/utils
// The root GoogleMapReact module does not export its utils, so we have to disable that check too
import { fitBounds } from 'google-map-react/utils';
import { GeoLocation } from '@brandingbrand/fsfoundation';
import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ImageURISource,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { getCenter, getDelta } from '../lib/helpers';
import { style as S } from '../styles/MapView';
import { Location, Region } from '../types/Location';
import CurrentLocationPin from './CurrentLocationPin';

const googleMapMaker = require('../../assets/images/google-map-marker.png');
const { width, height } = Dimensions.get('window');

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

function Marker({ lat, lng, onPress, selected }: any): JSX.Element {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={googleMapMaker}
        style={[S.markerImageWeb, selected && S.markerImageSelectedWeb]}
      />
    </TouchableOpacity>
  );
}

export default class MapViewWeb extends Component<PropType, StateType> {
  map: any;

  defaultCenter: any = { lat: 39.506061, lng: -96.409026 };
  defaultZoom: number = 3;

  constructor(props: PropType) {
    super(props);
    this.state = {
      center: undefined,
      zoom: undefined
    };
  }

  componentDidMount(): void {
    this.moveToLocation(
      this.props.locations,
      this.props.isCollapsed,
      this.props.center
    );
  }

  componentDidUpdate(prevProps: PropType): void {
    if (
      this.props.locations !== prevProps.locations ||
      this.props.isCollapsed !== prevProps.isCollapsed ||
      this.props.center !== prevProps.center
    ) {
      this.moveToLocation(
        this.props.locations,
        this.props.isCollapsed,
        this.props.center
      );
    }
  }

  mapRef = (map: any): void => {
    this.map = map;
  }

  handleMarkerPress = (location: Location) => () => {
    if (this.props.onMakerPress) {
      this.props.onMakerPress(location);
    }
  }

  moveToLocation = (
    locations: Location[],
    isCollapsed?: boolean,
    newCenter?: any
  ) => {
    if (locations.length) {
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
          lng: centerPos.longitude - centerPosDelta.longitudeDelta
        },
        se: {
          lat: centerPos.latitude - centerPosDelta.latitudeDelta,
          lng: centerPos.longitude + centerPosDelta.longitudeDelta
        }
      };

      const bound = fitBounds(bounds, { width, height });

      this.setState({
        center: bound.center,
        zoom: bound.zoom + 1
      });
    }
  }

  handleChange = ({ center, zoom }: { center: Center; zoom: number }) => {
    this.setState({
      center,
      zoom
    });

    if (this.props.handleRegionChangeComplete) {
      this.props.handleRegionChangeComplete({
        latitude: center.lat,
        longitude: center.lng
      });
    }
  }

  render(): JSX.Element {
    const { locations, style, googleMapsAPIKey, currentLocation } = this.props;
    const { center, zoom } = this.state;

    return (
      <View style={style}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: googleMapsAPIKey
          }}
          options={{
            fullscreenControl: false,
            zoomControl: false
          }}
          resetBoundsOnResize={true}
          defaultCenter={this.defaultCenter}
          defaultZoom={this.defaultZoom}
          center={center}
          zoom={zoom}
          onChange={this.handleChange}
        >
          {currentLocation && (
            <CurrentLocationPin
              lat={currentLocation.latitude}
              lng={currentLocation.longitude}
            />
          )}

          {locations.map((location, i) => (
              <Marker
                key={i}
                lat={location.address.latlng.lat}
                lng={location.address.latlng.lng}
                selected={location.selected}
                onPress={this.handleMarkerPress(location)}
              />
            )
          )}
        </GoogleMapReact>
      </View>
    );
  }
}
