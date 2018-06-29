import FSNetwork from '@brandingbrand/fsnetwork';
import {
  AddressDataSource,
  AddressType,
  AddressTypeValidation
} from '@brandingbrand/fscommerce';
import { addressValidationType } from './UPSAddressNormalizer';

export interface UPSAddressDataSourceOptions {
  baseURL: string;
  licenseNumber: string;
  password: string;
  username: string;
}

export class UPSAddressDataSource implements AddressDataSource {
  client: FSNetwork;
  options: UPSAddressDataSourceOptions;

  constructor(options: UPSAddressDataSourceOptions) {
    this.options = options;
    this.client = new FSNetwork();
  }

  async verifyAddress(address: AddressType) : Promise<AddressTypeValidation> {
    const response = await this.client.post(`${this.options.baseURL}/XAV`, {
      UPSSecurity: {
        UsernameToken: {
          Username: this.options.username,
          Password: this.options.password
        },
        ServiceAccessToken: {
          AccessLicenseNumber: this.options.licenseNumber
        }
      },
      XAVRequest: {
        Request: {
          RequestOption: '1'
        },
        AddressKeyFormat: {
          AddressLine: address.address1,
          PoliticalDivision2: address.locality,
          PoliticalDivision1: address.adminDistrict,
          PostcodePrimaryLow: address.postalCode,
          CountryCode: address.country
        }
      }
    });
    if (response && response.data && response.data.Fault) {
      return Promise.reject(response.data.Fault);
    }
    if (!response || !response.data || !response.data.XAVResponse) {
      return Promise.reject('Unexpected response: ' + response);
    }
    return addressValidationType(response.data.XAVResponse);
  }

}
