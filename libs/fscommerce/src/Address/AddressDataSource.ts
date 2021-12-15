import { AddressType, AddressTypeValidation } from './AddressTypes';

export default interface AddressDataSource {
  verifyAddress(address: AddressType): Promise<AddressTypeValidation>;
}
