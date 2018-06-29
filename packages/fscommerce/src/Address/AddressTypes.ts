export interface AddressType {
  address1: string;
  address2?: string;
  locality: string; // City, PostalTown
  adminDistrict: string; // State, Province
  postalCode: string;
  country: string;
}

export interface AddressTypeValidation {
  errorDescription?: string;
  errorField?: string;
  suggestedAddresses?: AddressType[];
  valid: boolean;
}
