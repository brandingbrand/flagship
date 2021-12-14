declare module 'react-native-geocoder' {
  export interface Geocoding {
    position: Position;
    formattedAddress: string; // the full address
    feature?: string; // ex Yosemite Park, Eiffel Tower
    streetNumber?: string;
    streetName?: string;
    postalCode?: string;
    locality?: string; // city name
    country: string;
    countryCode: string;
    adminArea?: string;
    subAdminArea?: string;
    subLocality?: string;
  }

  export interface Position {
    lat: number;
    lng: number;
  }

  export function geocodePosition(position: Position): Promise<Geocoding[]>;
  export function geocodeAddress(address: string): Promise<Geocoding[]>;
  export function fallbackToGoogle(key: string): void;
}
