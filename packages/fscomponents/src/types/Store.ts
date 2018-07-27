export interface Address {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type CreditCardType =
  'VISA' |
  'MASTERCARD' |
  'AMERICANEXPRESS' |
  'DINERSCLUB' |
  'DISCOVER' |
  'JCB';

export interface Hour {
  dayOfWeek: number;
  date?: string;
  open: string;
  close: string;
}

export type ClearButtonMode =
  'never' |
  'while-editing' |
  'unless-editing' |
  'always';
