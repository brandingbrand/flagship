import {MailingAddress} from './MailingAddress';
import {Checkout} from './Checkout';

export const Payment = `
  id
  amount
  ready
  test
  transaction {
    status
  }
  billingAddress {
    ${MailingAddress}
  }
  errorMessage
  checkout {
    ${Checkout}
  }
  creditCard {
    firstName
    lastName
  }
`;
