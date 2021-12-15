export interface Address {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type CreditCardType =
  | 'VISA'
  | 'MASTERCARD'
  | 'AMERICANEXPRESS'
  | 'DINERSCLUB'
  | 'DISCOVER'
  | 'JCB';

export interface Hour {
  dayOfWeek: number;
  date?: string;
  open: string;
  close: string;
}

export type ClearButtonMode = 'never' | 'while-editing' | 'unless-editing' | 'always';

export type AccessibilityTraits =
  | 'none'
  | 'button'
  | 'link'
  | 'header'
  | 'search'
  | 'image'
  | 'selected'
  | 'plays'
  | 'key'
  | 'text'
  | 'summary'
  | 'disabled'
  | 'frequentUpdates'
  | 'startsMedia'
  | 'adjustable'
  | 'allowsDirectInteraction'
  | 'pageTurn';

export type AccessibilityComponentType =
  | 'none'
  | 'button'
  | 'radiobutton_checked'
  | 'radiobutton_unchecked';
