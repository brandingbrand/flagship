import {
  CommerceDataSource,
  CommerceTypes
} from '@brandingbrand/fscommerce';

import FSNetwork from '@brandingbrand/fsnetwork';

const kErrorMessageNotImplemented = 'not implemented';

export interface PaymentMethod extends CommerceTypes.PaymentMethod {
  addressId: string;
  paymentCard: PaymentCard;
}

export interface PaymentCard extends CommerceTypes.PaymentCard {
  preferredCard?: boolean;
}

export interface CustomerAccount extends CommerceTypes.CustomerAccount {
  addresses?: CustomerAddress[];
  age?: string;
  receiveEmail?: boolean;
  logonPassword?: string;
  logonPasswordVerify?: string;
}

export interface CustomerAddress extends CommerceTypes.CustomerAddress {
  addressName: string;
  addressType?: 'R' | 'C'; // Address Delivery Type. `R` for residential or `C` for business
  canBeDeleted?: boolean;
  email?: string;
}

export interface Order extends CommerceTypes.Order {
  invoiceId: string;
  shippedDate?: string;
  trackingNumber?: {
    text: string;
    link: string;
  };
}

export interface VehicleFitmentFilterValue {
  label: string;
  querystring: string;
}

export interface VehicleFitmentFilter {
  title: string;
  values: VehicleFitmentFilterValue[];
}

export interface VehicleFitmentResultBullet {
  label: string;
  value: string;
}

export interface VehicleFitmentResult {
  vehicle: string;
  bullets: VehicleFitmentResultBullet[];
}

export interface VehicleFitments {
  filters: VehicleFitmentFilter[];
  results: VehicleFitmentResult[];
}

export interface Product extends CommerceTypes.Product {
  fitments?: VehicleFitments;
}

export interface PromotedProduct {
  title: string;
  image?: string;
  rating?: number;
  href?: string;
  price?: string;
  savings?: string;
  listPrice?: string;
  ratingCount?: string;
  productId?: string;
  categoryId?: string;
  categoryQuery?: string;
}

export interface PromotedProductList {
  title: string;
  products: PromotedProduct[];
}

export interface Category extends CommerceTypes.Category {
  carousels: PromotedProductList[];
}

export interface VehicleSearchQuery {
  year?: string;
  make?: string;
  model?: string;
  submodel?: string;
  Ntt?: string;
}

export interface SearchQuery {
  kw: string;
}

export interface BrandList {
  letters: {
    letter: string;
    href: string;
    selected: boolean;
  }[];
  brands: {
    title: string;
    id: string;
  }[];
}

export interface OrderHistoryDetail {
  orderDetails: KeyValuePair[];
  orderTotalDetails: KeyValuePair[];
  shipments: Shipment[];
  shippingAddress: string[];
}

export interface KeyValuePair {
  label: string;
  value: string;
  textStyle?: any;
}

export interface Shipment {
  products: CommerceTypes.ProductItem[];
  info: KeyValuePair[];
  shippingMethod: {
    name: string;
    trackingNumber: string;
    link: string;
  };
}

export interface SavedAddress {
  addressId: string;
  name: string;
  selected: boolean;
}

export interface Checkout {
  creditCardTypeIds: {
    American: string;
    Discover: string;
    Visa: string;
    MasterCard: string;
  };
  shippingAddressBook: SavedAddress[];
  billingAddressBook: SavedAddress[];
  shippingMethods: {
    kvp: {
      SOF_orderId: string;
      SOF_OLReturn: string;
      aCheck: string;
      cCheck: string;
      shippingOption: string;
    };
    methods: CheckoutShippingMethod[];
    errorMessage?: string;
    message?: string;
  };
  savedPaymentInfo: {
    PPType?: string;
    checkout_account?: string;
    checkout_expire_month?: string;
    checkout_expire_year?: string;
  };
  shippingAddress: CheckoutShippingAddress;
  billingAddress?: CheckoutBillingAddress;
  giftCert: {
    storeId: string;
    catalogId: string;
    langId: string;
    orderId: string;
    paymentType: string;
    checkoutAction: string;
    policyId: string;
    tax: string;
    shipping: string;
    remainingAmount: string;
    piAmount: string;
    errorViewName: string;
    URL: string;
  };
  submit: {
    storeId: string;
    catalogId: string;
    langId: string;
    orderId: string;
    shippingAddressId: string;
    billingAddressId: string;
    billing_address_id: string;
    billtoAddressId: string;
    shipModeId: string;
    paymentType: string;
    checkoutAction: string;
    policyId: string;
    cc_brand: string;
    account: string;
    aCheck: string;
    expire_month: string;
    expire_year: string;
    cc_cvc: string;
    piAmount: string;
    shipAmount: string;
    taxLabel: string;
    taxAmount: string;
    ruralChargeAmount: string;
    OLReturn: string;
    notifyShopper: string;
    notifyOrderSubmitted: string;
    errorViewName: string;
    URL: string;
    emailFlag: string;
    isPayPalCredit: string;
  };
  loginForm: {
    storeId: string;
    langId: string;
    catalogId: string;
    URL: string;
    reLogonURL: string;
    fromOrderId: string;
    orderId: string;
    toOrderId: string;
    deleteIfNotEmpty: string;
    createIfEmpty: string;
    checkoutAction: string;
    policyId: string;
    paymentType: string;
    OLReturn: string;
    pinvoice: string;
    aCheck: string;
    calculationUsageId: string;
    updatePrices: string;
    orderMove: string;
  };
  products: CheckoutProduct[];
  totals: CheckoutTotal[];
  cards: any[];
  shipNote?: string;
  addressFailedVerification?: boolean;
  freightItems?: boolean;
  hazardousItems?: boolean;
}

export interface CheckoutShippingAddress {
  editMode: string;
  ShippingAddressId: string;
  nickName: string;
  addressField3: string;
  address1: string;
  address2: string;
  firstName: string;
  lastName: string;
  phone1: string;
  email1: string;
  organizationName: string;
  state: string;
  city: string;
  zipCode: string;
  country: string;
  addressField1: string;
  addressField2: string;
  addressType: string;
  addressId: string;
  selectedShippingOption: string;
  context: string;
  orderId: string;
  primary: string;
}

export interface CheckoutBillingAddress {
  BillingAddressId: string;
  address1: string;
  address2: string;
  addressField1: string;
  addressField2: string;
  addressField3: string;
  addressId: string;
  addressType: string;
  city: string;
  context: string;
  country: string;
  editMode: string;
  email1: string;
  firstName: string;
  lastName: string;
  nickName: string;
  orderId: string;
  organizationName: string;
  phone1: string;
  primary: string;
  state: string;
  zipCode: string;
}

export interface CheckoutProduct {
  id: string;
  title: string;
  quantity: string;
  price: string;
  savings?: string;
  total: string;
  shippingText?: string;
  image: {
    src: string;
  };
}

export interface CheckoutTotal {
  label: string;
  value: string;
  type?: string;
}

export interface CheckoutShippingMethod {
  label: string;
  shipModeId: string;
  shipAmount: string;
  ruralChargeAmount: string;
  taxLabel: string;
  taxAmount: string;
  subtotal: string;
  total: string;
  selected: boolean;
}

export interface Receipt {
  orderNum: string;
  shipping: string;
  billing: string;
  totals: CheckoutTotal[];
  products: CheckoutProduct[];
}

export type AddressType = 'Shipping' | 'Billing';

export interface AddressPostData {
  addressId?: string;
  orderId: string;
  address1: string;
  city: string;
  state: string;
  country: string;
  email1: string;
  phone1: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  address2?: string;
  addressField1?: string;
  addressField3?: string;
  selectedShippingOption?: string;
  nickName?: string;
  failedValidation?: boolean;
}

export interface PaymentFormData {
  aCheck: string;
  shippingAddressId: string;
  billingAddressId: string;
  billing_address_id: string;
  billtoAddressId: string;
  shipModeId: string;
  taxLabel: string;
  shipAmount: string;
  ruralChargeAmount: string;
  paymentType: string;
  taxAmount: string;
  piAmount: string | number;
  cc_brand?: string;
  policyId?: string;
  account?: string;
  expire_month?: string;
  expire_year?: string;
  cc_cvc?: string;
  isPayPalCredit?: string;
  orderSource?: string;
}

export interface CheckoutLoginFormData {
  logonId: string;
  logonPassword: string;
  // data below is passed from checkout response
  storeId: string;
  langId: string;
  catalogId: string;
  URL: string;
  reLogonURL: string;
  fromOrderId: string;
  orderId: string;
  toOrderId: string;
  deleteIfNotEmpty: string;
  createIfEmpty: string;
  checkoutAction: string;
  policyId: string;
  paymentType: string;
  OLReturn: string;
  pinvoice: string;
  aCheck: string;
  calculationUsageId: string;
  updatePrices: string;
  orderMove: string;
}

export interface SelectSavedAddressPostData {
  addressId: string;
  orderId: string;
}

export interface GiftCardPostData {
  orderId: string;
  tax: string;
  shipping: string;
  remainingAmount: string;
  piAmount: string;
  giftCardNumber: string;
}

export interface GiftCardDeleteData {
  piId: string;
  orderId: string;
}

export interface CheckoutSubmitResponse {
  success: boolean;
  error?: string;
  confirmationUrl?: string;
  nextUrl?: string; // paypal url
  ccVerifyUrl?: string;
}

export interface ProductIndex extends CommerceTypes.ProductIndex {
  fullCategoryId?: string; // internal category id, used for vehicle filter
}

export default class BBPlatformDataSource implements CommerceDataSource {
  client: FSNetwork;
  minRefinements: number = 0;

  constructor(apiHost: string) {
    this.client = new FSNetwork({
      baseURL: apiHost + '/api/'
    });
  }

  async fetchProduct(id: string): Promise<Product> {
    const response = await this.client.get('product/' + id);
    const data = response.data;

    data.images = (data.images || []).map((image: any) => {
      return {
        uri: image.src
      };
    });

    return data;
  }

  async setGiftWrapOnItem(
    itemId: string,
    enabled: boolean
  ): Promise<CommerceTypes.Cart> {
    const response = await this.client.get(
      `cart/giftwrap/${itemId}/${enabled}`
    );

    return response.data;
  }

  async fetchProductIndex(
    query: CommerceTypes.ProductQuery
  ): Promise<ProductIndex> {
    const response = await this.client.get('products', {
      params: query
    });

    const data = response.data;

    (data.products || []).forEach((product: any) => {
      if (product.images) {
        product.images = product.images.map((image: any) => {
          return {
            uri: image.src
          };
        });
      }
    });

    return data;
  }

  async fetchCategory(
    id?: string,
    query?: CommerceTypes.CategoryQuery
  ): Promise<Category> {
    const response = await this.client.get('categories/' + (id || ''));
    const data = response.data;

    (data.categories || []).forEach((category: any) => {
      if (category.image) {
        category.image.uri = category.image.src;
      }
    });

    return data;
  }

  async fetchCart(
    query?: CommerceTypes.CartQuery
  ): Promise<CommerceTypes.Cart> {
    const response = await this.client.get('cart');

    return this.updateCartSchema(response.data);
  }

  async addToCart(
    id: string,
    qty: number = 1,
    product?: CommerceTypes.Product
  ): Promise<CommerceTypes.Cart> {
    try {
      const encodedId = encodeURIComponent(id);
      const response = await this.client.get(`cart/add/${encodedId}/${qty}`);

      return this.updateCartSchema(response.data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async search(
    keyword: string,
    query: CommerceTypes.ProductQuery
  ): Promise<ProductIndex> {
    keyword = encodeURIComponent(keyword);
    const response = await this.client.get(`products?kw=${keyword}`, {
      params: query
    });

    const data = response.data;

    (data.products || []).forEach((product: any) => {
      if (product.images) {
        product.images = product.images.map((image: any) => {
          return {
            uri: image.src
          };
        });
      }
    });

    return data;
  }

  async searchSuggestion(
    keyword: string
  ): Promise<CommerceTypes.SearchSuggestion> {
    const kw = encodeURIComponent(keyword);
    const response = await this.client.get(`/search/suggestions?kw=${kw}`);

    return response.data;
  }

  async removeCartItem(itemId: string): Promise<CommerceTypes.Cart> {
    const response = await this.client.get(`cart/update/${itemId}/0`);

    return this.updateCartSchema(response.data);
  }

  async updateCartItemQty(
    itemId: string,
    qty: number
  ): Promise<CommerceTypes.Cart> {
    const response = await this.client.get(`cart/update/${itemId}/${qty}`);

    return this.updateCartSchema(response.data);
  }

  async updateCartItemShipping(
    itemId: string,
    value: string
  ): Promise<CommerceTypes.Cart> {
    const response = await this.client.get(`cart/dropship/${itemId}/${value}`);

    return this.updateCartSchema(response.data);
  }

  async login(
    username: string,
    password: string
  ): Promise<CommerceTypes.SessionToken> {
    const response = await this.client.post(`account/login`, {
      username,
      password
    });

    if (response.data && response.data.passwordChangeRequired) {
      throw new Error('FORCE_PASSWORD_CHANGE');
    }

    return response.data;
  }

  async logout(): Promise<boolean> {
    const response = await this.client.post(`account/logout`);
    return response.data;
  }

  async register(
    account: CommerceTypes.CustomerAccount,
    password: string
  ): Promise<CustomerAccount> {
    const response = await this.client.post(`account`, {
      account,
      password
    });

    return response.data;
  }

  async fetchSavedAddresses(): Promise<CommerceTypes.CustomerAddress[]> {
    const response = await this.client.get('account/address');

    return response.data;
  }

  async addSavedAddress(
    address: CommerceTypes.CustomerAddress
  ): Promise<CommerceTypes.CustomerAddress> {
    const response = await this.client.post('account/address', address);

    return response.data;
  }

  async editSavedAddress(
    address: CommerceTypes.CustomerAddress
  ): Promise<CommerceTypes.CustomerAddress> {
    const response = await this.client.put('account/address/', address);

    return response.data;
  }

  async deleteSavedAddress(addressId: string): Promise<boolean> {
    const response = await this.client.delete(`account/address/${addressId}`);

    return response.data;
  }

  async fetchSavedPayments(
    methodId?: string
  ): Promise<PaymentMethod[]> {
    methodId = methodId || '';
    const response = await this.client.get(
      `account/payment-method/${methodId}`
    );

    return response.data;
  }

  async addSavedPayment(
    payment: PaymentMethod
  ): Promise<PaymentMethod> {
    const response = await this.client.post(`account/payment-method`, {
      paymentMethod: payment
    });

    return response.data;
  }

  async editSavedPayment(payment: any): Promise<any> {
    const response = await this.client.put(
      `account/payment-method/${payment.id}`,
      payment
    );

    return response.data;
  }

  async deleteSavedPayment(paymentId: string): Promise<boolean> {
    const response = await this.client.delete(
      `account/payment-method/${paymentId}`
    );

    return response.data;
  }

  async forgotPassword(email: string): Promise<boolean> {
    const response = await this.client.post(`account/forgot-password`, {
      email
    });
    return response.data;
  }

  async fetchAccount(): Promise<CustomerAccount> {
    const response = await this.client.get(`/account`);

    return response.data;
  }

  async updateAccount(
    account: CommerceTypes.CustomerAccount
  ): Promise<CommerceTypes.CustomerAccount> {
    const response = await this.client.put(`account`, account);

    return response.data;
  }

  async updatePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const response = await this.client.post(`account/update-password`, {
      currentPassword,
      newPassword
    });

    return response.data;
  }

  async fetchOrders(): Promise<Order[]> {
    const response = await this.client.get('account/order-history');
    return response.data;
  }

  async fetchOrder(orderId: string): Promise<CommerceTypes.Order> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async fetchOrderByInvoiceId(
    invoiceId: string
  ): Promise<OrderHistoryDetail> {
    const response = await this.client.get(
      `account/order-history/${invoiceId}`
    );
    return response.data;
  }

  async searchOrders(
    id: string,
    customerInfo: string
  ): Promise<Order> {
    const response = await this.client.post(`trackOrder`, {
      id,
      customerInfo
    });
    return response.data;
  }

  async addItemToWishlist(id: string): Promise<any> {
    const response = await this.client.post(`account/wishlist`, { id });
    return response.data;
  }

  async fetchProductRecommendations(id: string): Promise<CommerceTypes.Product[]> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async fetchPaymentMethods(
    cartId: string
  ): Promise<CommerceTypes.ApplicablePayment[]> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async fetchShippingMethods(
    cartId: string,
    shipmentId: string
  ): Promise<CommerceTypes.ShippingMethodResponse> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async applyPromo(promoCode: string): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async removePromo(promoItemId: string): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async setBillingAddress(
    options: CommerceTypes.BillingAddressOptions
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async setCustomerInfo(
    options: CommerceTypes.CustomerInfoOptions
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async setShipmentAddress(
    options: CommerceTypes.ShipmentAddressOptions
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async setShipmentMethod(
    options: CommerceTypes.ShipmentMethodOptions
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async updateGiftOptions(
    options: CommerceTypes.GiftOptions
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async addPayment(
    cartId: string,
    payment: CommerceTypes.Payment
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async updatePayment(
    cartId: string,
    paymentId: string,
    payment: CommerceTypes.Payment
  ): Promise<CommerceTypes.Cart> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async submitOrder(cartId: string): Promise<CommerceTypes.Order> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async updateOrder(order: CommerceTypes.Order): Promise<CommerceTypes.Order> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async updateOrderPayment(
    orderId: string,
    paymentId: string,
    payment: CommerceTypes.Payment
  ): Promise<CommerceTypes.Order> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async destroyCart(): Promise<void> {
    throw new Error(kErrorMessageNotImplemented);
  }

  async addToWishlist(productId: string): Promise<any> {
    return this.client
      .post(`/account/wishlist/`, { id: productId })
      .then(response => {
        return (response.data && response.data.products) || [];
      });
  }

  async removeFromWishlist(productId: string): Promise<any> {
    return this.client
      .delete(`/account/wishlist/${productId}`)
      .then(response => {
        return (response.data && response.data.products) || [];
      });
  }

  async fetchWishlist(): Promise<any> {
    return this.client.get(`/account/wishlist`).then(response => {
      return (response.data && response.data.products) || [];
    });
  }

  async searchVehicle(query?: VehicleSearchQuery): Promise<any> {
    return this.client
      .get(`/search/vehicle`, { params: query })
      .then(response => response.data);
  }

  async searchVehicleFilter(query?: VehicleSearchQuery): Promise<any> {
    return this.client
      .get(`/search/vehicle/filter`, { params: query })
      .then(response => response.data);
  }

  async fetchBrand(id: string): Promise<BrandList> {
    return this.client.get(`/brands/${id}`).then(response => response.data);
  }

  async checkoutStart(): Promise<Checkout> {
    return this.client.get('/checkout').then(response => response.data);
  }

  async checkoutLogin(
    checkoutLoginFormData: CheckoutLoginFormData
  ): Promise<Checkout> {
    return this.client
      .post('/checkout/login', checkoutLoginFormData)
      .then(async ({ data }) => {
        if (data.loginError) {
          return Promise.reject({
            response: { data: { error: data.loginError } }
          });
        }

        return Promise.resolve();
      })
      .then(async () => this.checkoutStart());
  }

  async checkoutUpdateAddress(
    type: AddressType,
    savedAddressPostData: AddressPostData
  ): Promise<Checkout> {
    return this.client
      .post(`/checkout/saveAddress/${type}`, savedAddressPostData)
      .then(response => response.data);
  }

  async checkoutSelectSavedAddress(
    type: AddressType,
    savedAddressPostData: SelectSavedAddressPostData
  ): Promise<Checkout> {
    return this.client
      .post(`/checkout/changeAddress/${type}`, savedAddressPostData)
      .then(response => response.data);
  }

  async checkoutRemoveGiftCertificate(
    giftCardDeleteData: GiftCardDeleteData
  ): Promise<any> {
    return this.client
      .delete(
        '/checkout/giftCert/' +
          giftCardDeleteData.piId +
          '?orderId=' +
          giftCardDeleteData.orderId
      )
      .then(response => response.data);
  }

  async checkoutApplyGiftCertificate(
    giftCardPostData: GiftCardPostData
  ): Promise<any> {
    return this.client
      .post('/checkout/giftCert', giftCardPostData)
      .then(response => response.data);
  }

  async checkoutSubmit(paymentFormData: PaymentFormData): Promise<any> {
    return this.client
      .post('/checkout/submit', paymentFormData)
      .then(response => response.data);
  }

  async checkoutGetReceipt(query: string): Promise<Receipt> {
    return this.client
      .get('/checkout/receipt?' + query)
      .then(response => response.data);
  }

  async emailSignup(email: string): Promise<void> {
    await this.client.post('emailSignup', {
      email
    });
  }

  /**
   * Update a cart object from a legacy client API to the newest Cart specification.
   *
   * @param {object} cart - The cart object from a legacy API
   * @returns {CommerceTypes.Cart} The cart object translated to the Commerce spec
   */
  private updateCartSchema(cart: any): CommerceTypes.Cart {
    if (Array.isArray(cart.items)) {
      cart.items.forEach((item: CommerceTypes.CartItem) => {
        if (item.images) {
          item.images = item.images.map((image: any) => {
            return {
              uri: image.src
            };
          });
        }
      });
    }

    return cart;
  }
}
