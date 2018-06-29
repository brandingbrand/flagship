import {MailingAddress} from './MailingAddress';
import {Variant} from './Variant';

export const Order = `
  id
  processedAt
  orderNumber
  subtotalPrice
  totalShippingPrice
  totalTax
  totalPrice
  currencyCode
  totalRefunded
  customerUrl
  shippingAddress {
    ${MailingAddress}
  }
  lineItems (first: 250) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      cursor
      node {
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
