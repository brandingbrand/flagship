import {MailingAddress} from './MailingAddress';
import {Order} from './Order';
import {Variant} from './Variant';

export const Checkout = `
  id
  email
  ready
  requiresShipping
  note
  paymentDue
  webUrl
  orderStatusUrl
  taxExempt
  taxesIncluded
  currencyCode
  totalTax
  subtotalPrice
  totalPrice
  completedAt
  createdAt
  updatedAt
  shippingAddress {
    ${MailingAddress}
  }
  shippingLine {
    handle
    price
    title
  }
  customAttributes {
    key
    value
  }
  order {
    ${Order}
  }
  lineItems (first: 250) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      cursor
      node {
        id
        title
        variant {
          ${Variant}
        }
        quantity
        customAttributes {
          key
          value
        }
      }
    }
  }
`;

export const shippingRatesFragment = `
availableShippingRates {
  ready
  shippingRates {
    handle
    price
    title
  }
}`;
