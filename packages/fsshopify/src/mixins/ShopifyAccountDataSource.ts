import { ShopifyAddress } from './../util/ShopifyResponseTypes';
import { CommerceTypes } from '@brandingbrand/fscommerce';
import { ShopifyMailingAddressInput } from '..';
import DataSourceBase from '../util/DataSourceBase';
import * as Normalizers from './../normalizers';

export interface AddressResponse {
  defaultAddress?: string;
  addresses?: ShopifyAddress[];
}

export interface NormalizedAddressResponse {
  defaultAddress: string;
  addresses: CommerceTypes.Address[];
}

export interface ResponseError {
  field: string | null;
  message: string;
}

export interface ShopifyUserToken {
  customerAccessTokenCreate: {
    customerUserErrors: ResponseError[];
    customerAccessToken: {
      accessToken: string;
      expiresAt: string;
    };
  };
}

export interface Customer {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
  };
  customerUserErrors?: {
    message: string;
  }[];
  customerUpdate?: {
    userErrors?: {
      message: string;
    }[];
  };
}

export interface CustomerCreateResponse {
  customerCreate: Customer;
}

export interface AddressCreateResponse {
  customerAddressCreate: {
    customerAddress: {
      id: string;
    };
    userErrors: object[];
  };
}

export interface AddressUpdateResponse {
  customerAddressUpdate: {
    customerAddress: {
      id: string;
    };
    userErrors: object[];
  };
}

export class ShopifyAccountDataSource extends DataSourceBase {

  async getCustomerId(
    customerAccessToken: string
  ): Promise<Customer> {
    const response = await this.api.postQuery(`
      query($customerAccessToken: String!) {
        customer (customerAccessToken: $customerAccessToken){
          id
          firstName
          lastName
          email
        }
      }`, {
        customerAccessToken
      });

    return response;
  }

  async getAddresses(customerAccessToken: string): Promise<AddressResponse> {
    const response = await this.api.postQuery(`
    query ($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        defaultAddress {
          id
        }
        addresses(first: 20) {
          edges {
            node {
              formatted
              name
              address1
              address2
              city
              company
              countryCodeV2
              firstName
              lastName
              id
              phone
              province
              provinceCode
              zip
            }
          }
        }
      }
    }`, {
      customerAccessToken
    });
    const customer = response && response.customer;
    const addresses = customer && customer.addresses &&
      (customer.addresses.edges || []).map((address: any) => {
        return address.node;
      });

    return {
      defaultAddress: customer && customer.defaultAddress && customer.defaultAddress.id,
      addresses
    };
  }

  async setDefaultAddress(
    customerAccessToken: string, addressId: string
  ): Promise<Customer> {
    const response = await this.api.postQuery(`
  mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      userErrors {
        field
        message
      }
      customer {
        id
        firstName
        lastName
        email
      }
    }
  }`, {
    customerAccessToken,
    addressId
  });

    return response;
  }

  async addressCreate(
    customerAccessToken: string, address: ShopifyMailingAddressInput
  ): Promise<AddressCreateResponse> {
    const response = await this.api.postQuery(`
    mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
        userErrors {
          field
          message
        }
        customerAddress {
          id
        }
      }
    }`, {
      customerAccessToken,
      address
    });

    return response;
  }

  async addressUpdate(
    customerAccessToken: string, address: ShopifyMailingAddressInput, addressId: string
  ): Promise<AddressUpdateResponse> {
    const response = await this.api.postQuery(`
    mutation customerAddressUpdate
    ($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
      customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
        userErrors {
          field
          message
        }
        customerAddress {
          id
        }
      }
    }`, {
      customerAccessToken,
      id: addressId,
      address
    });

    return response;
  }

  async addressDelete(
    customerAccessToken: string, addressId: string
  ): Promise<string> {
    const response = await this.api.postQuery(`
    mutation customerAddressDelete($id: ID!, $customerAccessToken: String!) {
      customerAddressDelete(id: $id, customerAccessToken: $customerAccessToken) {
        userErrors {
          field
          message
        }
        deletedCustomerAddressId
      }
    }`, {
      customerAccessToken,
      id: addressId
    });

    return response;
  }

  async updateCustomer(
    customerAccessToken: string, customer: object
  ): Promise<Customer> {
    const response = await this.api.postQuery(`
    mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
        userErrors {
          field
          message
        }
        customer {
          id
          email
          firstName
          lastName
        }
        customerAccessToken {
          accessToken
          expiresAt
        }
      }
    }`, {
      customerAccessToken,
      customer
    });

    return response;
  }
  async customerRecover(
    email: string
  ): Promise<Customer> {
    const response = await this.api.postQuery(`
      mutation customerRecover($email: String!) {
        customerRecover(email: $email) {
          userErrors {
            field
            message
          }
          customerUserErrors {
            field
            message
          }
        }
      }`, {
        email
      });

    return response;
  }

  async createCustomer(
    customer: object
  ): Promise<CustomerCreateResponse> {
    const response = await this.api.postQuery(`
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        userErrors {
          field
          message
        }
        customer {
          id
          firstName
          lastName
          email
        }
        customerUserErrors {
          field
          message
        }
      }
    }`, {
      input: customer
    });

    return response;
  }

  async customerAccessTokenRenew(
    token: string
  ): Promise<ShopifyUserToken> {
    const response = await this.api.postQuery(`
    mutation customerAccessTokenRenew($customerAccessToken: String!) {
      customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
        userErrors {
          field
          message
        }
        customerAccessToken {
          accessToken
          expiresAt
        }
      }
    }`, {
      input: token
    });

    return response;
  }

  async getArticlesByBlogByHandle(
    handle: string,
    numberOfPost: number
  ): Promise<Normalizers.Article[] | null> {
    try {
      const response = await this.api.postQuery(`
    query($numberOfPost: Int!, $handle: String!) {
      blogByHandle (handle: $handle) {
        articles  (first: $numberOfPost, reverse: true){
          edges {
            node {
              publishedAt
              title
              image {
                originalSrc
              }
              url
              authorV2 {
                name
              }
              contentHtml
              excerpt
              title
              id
            }
          }
        }
      }
    }`, {
      handle,
      numberOfPost
    });

      const blogByHandle = response && response.blogByHandle;
      const articles = blogByHandle && blogByHandle.articles;
      const data = (articles.edges || []).map((elem: any) => {
        return Normalizers.blogPosts(elem);
      });
      return data;
    } catch (err) {
      return null;
    }
  }
}
