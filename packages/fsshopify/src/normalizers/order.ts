import {
  CommerceTypes as FSCommerceTypes
} from '@brandingbrand/fscommerce';
import * as ResponseTypes from '../util/ShopifyResponseTypes';
import {cartItem} from './cart';
import { makeCurrency } from './helpers';

export function order(
  order: ResponseTypes.ShopifyOrder,
  payment: ResponseTypes.ShopifyPayment,
  currency: string
): FSCommerceTypes.Order {
  const currencyCode = order.currencyCode || currency;

  return {
    billingAddress: payment.billingAddress,
    customerName: payment.creditCard.firstName + ' ' + payment.creditCard.lastName,
    orderId: order.orderNumber.toString(),
    orderTotal: makeCurrency(order.totalPrice, currencyCode),
    payments: [
      {
        amount: makeCurrency(payment.amount, currencyCode),
        paymentCard: {
          expirationMonth: payment.creditCard.expiryMonth,
          expirationYear: payment.creditCard.expiryYear,
          holder: payment.creditCard.firstName + ' ' + payment.creditCard.lastName,
          numberLastDigits: payment.creditCard.lastDigits
        }
      }
    ],
    productItems: order.lineItems.edges.map(item => productItem(item, currencyCode)),
    status: payment.transaction.status,
    creationDate: new Date(order.processedAt),
    orderTax: makeCurrency(order.totalTax, currencyCode),
    orderToken: order.id,
    paymentStatus: payment.transaction.status
  };
}

function productItem(
  data: ResponseTypes.ShopifyLineItem,
  currency: string
): FSCommerceTypes.ProductItem {
  return {
    gift: false,
    ...cartItem(data, currency)
  };
}
