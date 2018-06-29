export interface GeoLocationDelta {
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface Location {
  id: number;
  title: string;
  services: Service[];
  selected?: boolean;
  address: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    latlng: {
      lat: number;
      lng: number;
    };
  };
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}

export interface Service {
  service: string;
  locationId: number;
  id: number;
  [key: string]: any;
}
