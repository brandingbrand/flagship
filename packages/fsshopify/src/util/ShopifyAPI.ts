import FSNetwork from '@brandingbrand/fsnetwork';
import * as Fragments from './fragments';
import * as ResponseTypes from './ShopifyResponseTypes';
import ShopifyAPIError from './ShopifyAPIError';
import { ShopifyMailingAddressInput } from '..';

export default class ShopifyAPI {
  private networkClient: FSNetwork;

  constructor(baseURL: string, token: string) {
    this.networkClient = new FSNetwork({
      baseURL,
      headers: {
        'X-Shopify-Storefront-Access-Token': token
      }
    });
  }

  async postQuery(
    query: string,
    variables?: any
  ): Promise<any> {
    const response = await this.networkClient.post('', {
      query,
      variables
    });

    if (response.status !== 200) {
      throw new ShopifyAPIError('Non 200', response.data);
    }

    const data = response.data;
    if (data.errors && data.errors.length) {
      throw new ShopifyAPIError('Shopify returned errors', data);
    }

    if (!data.data) {
      throw new ShopifyAPIError('No second key of data?', data);
    }

    return data.data;
  }

  async getProduct(
    id: string
  ): Promise<ResponseTypes.ShopifyProduct> {
    const response = await this.postQuery(`
      query($id: ID!) {
        node(id: $id) {
          ... on Product {
            ${Fragments.Product}
          }
        }
      }`, {
        id
      });

    const product: ResponseTypes.ShopifyProduct = response.node;
    if (!product || !product.id) {
      throw new ShopifyAPIError('No product was returned', product);
    }

    return product;
  }

  async getCollection(
    collectionId: string,
    limit: number = 250,
    after?: string
  ): Promise<ResponseTypes.ShopifyProductIndex> {
    if (after) {
      after = ` after:"${after}"`;
    } else {
      after = '';
    }

    const response = await this.postQuery(`
      query($id: ID!) {
        node(id: $id) {
          ... on Collection {
            ${Fragments.Collection}
            products(first:${limit}${after}) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  ${Fragments.Product}
                }
                cursor
              }
            }
          }
        }
      }`, {
        id: collectionId
      });

    const collection: ResponseTypes.ShopifyProductIndex = response.node;
    if (!collection.id) {
      throw new ShopifyAPIError('No collection was returned', collection);
    }

    return collection;
  }

  async getAllCollections(): Promise<ResponseTypes.ShopifyCollection[]> {
    let pageInfo: ResponseTypes.ShopifyPageInfo;
    let categories: ResponseTypes.ShopifyCollectionContainer[] = [];

    do {
      // fetch
      const query = `first:250` +
        (categories.length > 0 ? ` after:"${categories[categories.length - 1].cursor}"` : '');

      const response = await this.postQuery(`{
        shop {
          collections(${query}) {
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            edges {
              node {
                ${Fragments.Collection}
              }
              cursor
            }
          }
        }
      }`);

      const collections: ResponseTypes.ShopifyCollections = response.shop.collections;

      // collect data
      pageInfo = collections.pageInfo;
      categories = categories.concat(collections.edges);
    } while (pageInfo.hasNextPage);


    return categories.map(c => c.node);
  }

  async checkoutLineItemsAdd(
    checkoutId: string,
    variantId: string,
    quantity: number = 1,
    customAttributes?: ResponseTypes.ShopifyCustomAttribute[]
  ): Promise<ResponseTypes.ShopifyCheckout> {
    const lineItems = [{
      variantId,
      quantity,
      customAttributes
    }];

    const response = await this.postQuery(`
      mutation ($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
        checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
          userErrors {
            field
            message
          }
          checkout {
            ${Fragments.Checkout}
          }
        }
      }`, {
        checkoutId,
        lineItems
      });

    const userErrors = response.checkoutLineItemsAdd.userErrors;
    if (userErrors && userErrors.length) {
      throw new ShopifyAPIError('Error adding to cart', userErrors);
    }

    return response.checkoutLineItemsAdd.checkout;
  }

  async checkoutLineItemsRemove(
    checkoutId: string,
    lineItemId: string
  ): Promise<ResponseTypes.ShopifyCheckout> {
    const response = await this.postQuery(`
      mutation ($checkoutId: ID!, $lineItemIds: [ID!]!) {
        checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
          userErrors {
            field
            message
          }
          checkout {
            ${Fragments.Checkout}
          }
        }
      }`, {
        checkoutId,
        lineItemId
      });

    // check errors
    if (!response.checkoutLineItemsRemove || response.checkoutLineItemsRemove.userErrors.length) {
      throw new ShopifyAPIError('Unable to remove item', response);
    }

    return response.checkoutLineItemsRemove.checkout;
  }

  async checkoutLineItemsUpdate(
    checkoutId: string,
    lineItemId: string,
    quantity: number
  ): Promise<ResponseTypes.ShopifyCheckout> {
    const lineItems = [{
      id: lineItemId,
      quantity
    }];
    const response = await this.postQuery(`
      mutation ($checkoutId: ID!, $lineItems: [CheckoutLineItemUpdateInput!]!) {
        checkoutLineItemsUpdate(checkoutId: $checkoutId, lineItems: $lineItems) {
          userErrors {
            field
            message
          }
          checkout {
            ${Fragments.Checkout}
          }
        }
      }`, {
        checkoutId,
        lineItems
      });

    if (!response.checkoutLineItemsUpdate || response.checkoutLineItemsUpdate.userErrors.length) {
      throw new ShopifyAPIError('Unable to update item', response);
    }

    return response.checkoutLineItemsUpdate.checkout;
  }

  async checkoutEmailUpdate(
    checkoutId: string,
    email: string
  ): Promise<ResponseTypes.ShopifyCheckout> {
    const response = await this.postQuery(`
      mutation checkoutEmailUpdate($checkoutId: ID!, $email: String!) {
        checkoutEmailUpdate(checkoutId: $checkoutId, email: $email) {
          userErrors {
            field
            message
          }
          checkout {
            ${Fragments.Checkout}
          }
        }
      }`, {
        checkoutId,
        email
      });

    if (!response.checkoutEmailUpdate || response.checkoutEmailUpdate.userErrors.length) {
      throw new ShopifyAPIError('Unable to attach email', response);
    }

    return response.checkoutEmailUpdate.checkout;
  }

  async checkoutShippingAddressUpdate(
    checkoutId: string,
    address: ResponseTypes.ShopifyAddress
  ): Promise<ResponseTypes.ShopifyCheckout> {
    // convert to ShopifyMailingAddressInput type
    const shippingAddress: ShopifyMailingAddressInput = {
      address1: address.address1,
      address2: address.address2 || '',
      city: address.city,
      company: address.company,
      country: address.countryCode,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone || '',
      province: address.province,
      zip: address.postalCode
    };

    const response = await this.postQuery(`
      mutation checkoutShippingAddressUpdate(
        $shippingAddress: MailingAddressInput!,
        $checkoutId: ID!
      ) {
        checkoutShippingAddressUpdate(shippingAddress: $shippingAddress, checkoutId: $checkoutId) {
          userErrors {
            field
            message
          }
          checkout {
            ${Fragments.Checkout}
          }
        }
      }`, {
        checkoutId,
        shippingAddress
      });

    if (!response.checkoutShippingAddressUpdate ||
      response.checkoutShippingAddressUpdate.userErrors.length) {
      throw new ShopifyAPIError('Unable to attach shipping address', response);
    }

    return response.checkoutShippingAddressUpdate.checkout;
  }

  async checkoutShippingLineUpdate(
    checkoutId: string,
    shippingRateHandle: string
  ): Promise<ResponseTypes.ShopifyCheckout> {
    const response = await this.postQuery(`
      mutation checkoutShippingLineUpdate($checkoutId: ID!, $shippingRateHandle: String!) {
        checkoutShippingLineUpdate(
          checkoutId: $checkoutId,
          shippingRateHandle: $shippingRateHandle
        ) {
          userErrors {
            field
            message
          }
          checkout {
            ${Fragments.Checkout}
            ${Fragments.shippingRatesFragment}
          }
        }
      }`, {
        checkoutId,
        shippingRateHandle
      });

    if (!response.checkoutShippingLineUpdate ||
      response.checkoutShippingLineUpdate.userErrors.length) {
      throw new ShopifyAPIError('Unable to attach shipping method', response);
    }

    return response.checkoutShippingLineUpdate.checkout;
  }

  async checkoutDiscountCodeApply(
    checkoutId: string,
    discountCode: string
  ): Promise<ResponseTypes.ShopifyCheckout> {
    const response = await this.postQuery(`
      mutation ($discountCode: String!, $checkoutId: ID!) {
        checkoutDiscountCodeApply(discountCode: $discountCode, checkoutId: $checkoutId) {
          userErrors {
            field
            message
          }
          checkout {
            ${Fragments.Checkout}
          }
        }
      }`, {
        checkoutId,
        discountCode
      });

    if (!response.checkoutDiscountCodeApply ||
      response.checkoutDiscountCodeApply.userErrors.length) {
      throw new ShopifyAPIError('Unable to apply discount code', response);
    }

    return response.checkoutDiscountCodeApply.checkout;
  }

  async checkoutCreate(): Promise<ResponseTypes.ShopifyCheckout> {
    const response = await this.postQuery(`
      mutation {
        checkoutCreate(input:{}) {
          userErrors {
            field
            message
          }
          checkout {
            ${Fragments.Checkout}
          }
        }
      }`);

    // ensures it was created and no user errors were returned
    if (!response.checkoutCreate || response.checkoutCreate.userErrors.length) {
      throw new ShopifyAPIError('Unable to create checkout', response);
    }

    return response.checkoutCreate.checkout;
  }

  async getPayment(
    id: string
  ): Promise<ResponseTypes.ShopifyPayment> {
    const response = await this.postQuery(`
      query($id: ID!) {
        node(id: $id) {
          ... on Payment {
            ${Fragments.Payment}
          }
        }
      }`, {
        id
      });

    if (!response.node) {
      throw new ShopifyAPIError('Unable to get payment', response);
    }

    return response.node;
  }

  async getOrder(
    id: string
  ): Promise<ResponseTypes.ShopifyOrder> {
    const response = await this.postQuery(`
      query($id: ID!) {
        node(id: $id) {
          ... on Order {
            ${Fragments.Order}
          }
        }
      }`, {
        id
      });

    if (!response.node) {
      throw new ShopifyAPIError('Unable to get order', response);
    }

    return response.node;
  }

  async getCheckout(
    checkoutId: string,
    includeShippingRates: boolean = false
  ): Promise<ResponseTypes.ShopifyCheckout> {
    const response = await this.postQuery(`
      query($checkoutId: ID!) {
        node(id: $checkoutId) {
          ... on Checkout {
            ${Fragments.Checkout}
            ${includeShippingRates ? Fragments.shippingRatesFragment : ''}
          }
        }
      }`, {
        checkoutId
      });

    // @TODO: if includeShippingRates is set and does not come back in the result
    // retry this up to 10 times before timing out

    if (!response || !response.node) {
      throw new ShopifyAPIError('Unable to get checkout', response);
    }

    return response.node;
  }

  async checkoutCompleteWithCreditCard(
    checkoutId: string,
    payment: ResponseTypes.ShopifyCreditCardPayment
  ): Promise<ResponseTypes.CheckoutResponse> {
    const response = await this.postQuery(`
      mutation checkoutCompleteWithCreditCard($checkoutId: ID!, $payment: CreditCardPaymentInput!) {
        checkoutCompleteWithCreditCard(checkoutId: $checkoutId, payment: $payment) {
          userErrors {
            field
            message
          }
          checkout {
            id
            completedAt
            order {
              id
            }
          }
          payment {
            id
          }
        }
      }`, {
        checkoutId,
        payment
      });

    if (!response.checkoutCompleteWithCreditCard ||
      response.checkoutCompleteWithCreditCard.userErrors) {
      throw new ShopifyAPIError('Unable to complete checkout', response);
    }

    return response.checkoutCompleteWithCreditCard;
  }

  async checkoutCompleteWithTokenizedPayment(
    checkoutId: string,
    payment: ResponseTypes.ShopifyTokenizedPayment
  ): Promise<ResponseTypes.CheckoutResponse> {
    if (!payment.billingAddress) {
      throw new ShopifyAPI('Billing address required', JSON.stringify(payment));
    }
    const response = await this.postQuery(`
      mutation checkoutCompleteWithTokenizedPayment(
        $checkoutId: ID!,
        $payment: TokenizedPaymentInput!
      ) {
        checkoutCompleteWithTokenizedPayment(checkoutId: $checkoutId, payment: $payment) {
          userErrors {
            field
            message
          }
          checkout {
            id
            completedAt
            order {
              id
            }
          }
          payment {
            id
          }
        }
      }`, {
        checkoutId,
        payment
      });

    if (!response.checkoutCompleteWithTokenizedPayment ||
      response.checkoutCompleteWithTokenizedPayment.userErrors) {
      throw new ShopifyAPIError('Unable to complete checkout', response);
    }

    return response.checkoutCompleteWithTokenizedPayment;
  }

}
