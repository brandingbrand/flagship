import { AddressType, AddressTypeValidation } from '@brandingbrand/fscommerce';

function readCandidate(upsAddress: any): AddressType {
  let address1: string = '';
  let address2: string = '';

  if (Array.isArray(upsAddress.AddressLine)) {
    address1 = upsAddress.AddressLine[0];
    address2 = upsAddress.AddressLine[1];
  } else {
    address1 = upsAddress.AddressLine;
  }
  return {
    address1,
    address2,
    locality: upsAddress.PoliticalDivision2,
    adminDistrict: upsAddress.PoliticalDivision1,
    postalCode: upsAddress.PostcodePrimaryLow,
    country: upsAddress.CountryCode
  };
}

export function addressValidationType(response: any): AddressTypeValidation {
  let candidates: AddressType[] | undefined;

  if (Array.isArray(response.Candidate)) {
    candidates = response.Candidate.map((candidate: any) => {
      if (candidate.AddressKeyFormat) {
        return readCandidate(candidate.AddressKeyFormat);
      }
      return null;
    }).filter(Boolean);
  } else if (response.Candidate && response.Candidate.AddressKeyFormat) {
    const upsAddress = response.Candidate.AddressKeyFormat;
    candidates = [readCandidate(upsAddress)];
  }

  return {
    suggestedAddresses: candidates,
    valid: response.Response.ResponseStatus === '1' &&
      candidates !== null
  };
}
