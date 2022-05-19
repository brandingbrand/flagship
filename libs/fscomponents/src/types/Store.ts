export interface Address {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type CreditCardType =
  | 'AMERICANEXPRESS'
  | 'DINERSCLUB'
  | 'DISCOVER'
  | 'JCB'
  | 'MASTERCARD'
  | 'VISA';

export interface Hour {
  dayOfWeek: number;
  date?: string;
  open: string;
  close: string;
}

export type ClearButtonMode = 'always' | 'never' | 'unless-editing' | 'while-editing';

export type AccessibilityTraits =
  | 'adjustable'
  | 'allowsDirectInteraction'
  | 'button'
  | 'disabled'
  | 'frequentUpdates'
  | 'header'
  | 'image'
  | 'key'
  | 'link'
  | 'none'
  | 'pageTurn'
  | 'plays'
  | 'search'
  | 'selected'
  | 'startsMedia'
  | 'summary'
  | 'text';

export type AccessibilityComponentType =
  | 'button'
  | 'none'
  | 'radiobutton_checked'
  | 'radiobutton_unchecked';
