/**
 * this module is for normalizing demandware data to standardized data
 */
import jwtdecode from 'jwt-decode';
import { CommerceTypes as FSCommerceTypes } from '@brandingbrand/fscommerce';
import { ExtendedProductItem } from './Types';
// @ts-ignore - AxiosResponse response needs to be imported since FSNetworkResponse is only an alias
import { AxiosResponse, FSNetworkResponse } from '@brandingbrand/fsnetwork';
import { Dictionary } from '@brandingbrand/fsfoundation';
import Decimal from 'decimal.js';

/**
 * A JSON Web Token.
 * @see https://tools.ietf.org/html/rfc7519
 */
interface JWT { // TODO: We should switch to using node-jsonwebtoken
  exp: number;
  iat: number;
}

function product(dwProduct: SFCC.Product, currency: string): FSCommerceTypes.Product {
  const currencyCode = dwProduct.currency || currency;

  let promotions;
  if (Array.isArray(dwProduct.product_promotions)) {
    promotions = dwProduct.product_promotions
      .map(p => p.promotion_id)
      .filter((p): p is string => p !== undefined);
  }

  return {
    id: dwProduct.id,
    title: dwProduct.name || '',
    handle: dwProduct.id,
    brand: dwProduct.brand,
    images: images(dwProduct.image_groups),
    price: makeCurrency(dwProduct.price, currencyCode),
    originalPrice: dwProduct.prices &&
      makeCurrency(dwProduct.prices['usd-list-prices'], currencyCode),
    options: Array.isArray(dwProduct.variation_attributes)
      ? dwProduct.variation_attributes.map(option)
      : undefined,
    variants: Array.isArray(dwProduct.variants)
      ? dwProduct.variants.map(productVariant => variant(productVariant, currencyCode))
      : undefined,
    available: dwProduct.inventory ? dwProduct.inventory.orderable : undefined,
    promotions,
    inventory: dwProduct.inventory && inventory(dwProduct.inventory)
  };
}

function productSearchHit(
  dwProduct: SFCC.ProductSearchHit,
  currency: string
): FSCommerceTypes.Product {
  const currencyCode = dwProduct.currency || currency;

  return {
    id: dwProduct.product_id,
    title: dwProduct.product_name || '',
    handle: dwProduct.product_id,
    images: dwProduct.image ? [image(dwProduct.image)] : [],
    price: makeCurrency(dwProduct.price, currencyCode),
    originalPrice: dwProduct.prices &&
      makeCurrency(dwProduct.prices['usd-list-prices'], currencyCode),
    options: Array.isArray(dwProduct.variation_attributes)
      ? dwProduct.variation_attributes.map(option)
      : undefined
  };
}

function productIndex(
  dwProductIndex: SFCC.ProductSearchResult,
  query: FSCommerceTypes.ProductQuery,
  currency: string
): FSCommerceTypes.ProductIndex {
  let page = 1;
  if (
    typeof dwProductIndex.count === 'number' &&
    typeof dwProductIndex.start === 'number' &&
    dwProductIndex.count > 0
  ) {
    page = Math.floor(dwProductIndex.start / dwProductIndex.count) + 1;
  }

  return {
    products: (dwProductIndex.hits || []).map(hit => productSearchHit(hit, currency)),
    total: dwProductIndex.total,
    limit: query.limit,
    sortingOptions: dwProductIndex.sorting_options && sortOptions(dwProductIndex.sorting_options),
    selectedSortingOption: dwProductIndex.selected_sorting_option,
    page,
    keyword: dwProductIndex.query,
    refinements: dwProductIndex.refinements && refinements(dwProductIndex.refinements),
    selectedRefinements: dwProductIndex.selected_refinements && selectedRefinements(
      dwProductIndex.selected_refinements
    )
  };
}

function selectedRefinements(selectedRefinements: Dictionary<string>): Dictionary<string[]> {
  const _selectedRefinements: Dictionary<string[]> = {};
  Object.keys(selectedRefinements || {}).forEach(key => {
    _selectedRefinements[key] = (selectedRefinements[key] || '').split('|');
  });
  return _selectedRefinements;
}

function sortOptions(
  sortingOptions: SFCC.ProductSearchSortingOption[]
): FSCommerceTypes.SortingOption[] {
  if (!Array.isArray(sortingOptions) || !sortingOptions.length) {
    return [];
  }
  return sortingOptions.reduce((options, option) => {
    if (option.id && option.label) {
      return [...options, {
        id: option.id,
        title: option.label
      }];
    }

    return options;
  }, [] as FSCommerceTypes.SortingOption[]);
}

function variant(dwVariant: SFCC.Variant, currency: string): FSCommerceTypes.Variant {
  const variant = {
    id: dwVariant.product_id,
    price: makeCurrency(dwVariant.price, currency),
    available: dwVariant.orderable,
    optionValues: [] as FSCommerceTypes.OptionValue[]
  };

  if (dwVariant.variation_values) {
    variant.optionValues = Object.keys(dwVariant.variation_values).map(key => ({
      name: key,
      value: (dwVariant.variation_values as Dictionary<string>)[key]
    }));
  }

  return variant;
}

function option(dwOption: SFCC.VariationAttribute): FSCommerceTypes.Option {
  return {
    id: dwOption.id,
    name: dwOption.name || '',
    values: (dwOption.values || []).map(v => ({
      name: v.name || '',
      value: v.value,
      available: v.orderable
    }))
  };
}

function inventory(dwInventory: SFCC.Inventory): FSCommerceTypes.Inventory | undefined {
  if (!dwInventory) {
    return undefined;
  }

  const { orderable, backorderable, preorderable, stock_level } = dwInventory;

  return {
    orderable: orderable !== undefined ? orderable : false,
    backorderable,
    preorderable,
    stock: stock_level
  };
}

function images(dwImageGroups: SFCC.ImageGroup[] = []): FSCommerceTypes.Image[] {
  const viewTypes = ['hi-res', 'large'];
  let imgs = null;
  for (const viewType of viewTypes) {
    imgs = dwImageGroups.find(opt => opt.view_type === viewType);
    if (imgs) {
      break;
    }
  }

  if (!imgs) {
    return [];
  }

  return (imgs.images || []).map(image);
}

function image(dwImage: SFCC.Image): FSCommerceTypes.Image {
  return {
    uri: dwImage.link || dwImage.dis_base_link,
    alt: dwImage.alt
  };
}

function category(dwCollection: SFCC.Category): FSCommerceTypes.Category {
  return {
    id: dwCollection.id,
    title: dwCollection.name || '',
    handle: dwCollection.id,
    categories: (dwCollection.categories || []).map(category),
    pageTitle: dwCollection.page_title,
    pageDescription: dwCollection.page_description,
    parentId: dwCollection.parent_category_id
  };
}

function sessionToken(
  response: FSNetworkResponse<SFCC.Customer>
): FSCommerceTypes.SessionToken | null {
  if (response.status !== 200) {
    return null;
  }
  const dwToken: SFCC.Customer & { authorization: string } = {
    ...response.data,
    authorization: response.headers.authorization
  };
  // TODO: We should validate this token when we switch to node-jsonwebtoken
  const jwt = jwtdecode<JWT>(dwToken.authorization);
  const expiresAt = new Date(jwt.exp * 1000);

  return {
    token: dwToken,
    expiresAt
  };
}

function address(
  data: SFCC.CustomerAddress | SFCC.OrderAddress
): FSCommerceTypes.Address | undefined {
  if (!data) {
    return undefined;
  }

  return {
    id: (data as SFCC.CustomerAddress).address_id || (data as SFCC.OrderAddress).id,
    address1: data.address1 || '',
    address2: data.address2,
    city: data.city || '',
    companyName: data.company_name,
    countryCode: data.country_code,
    firstName: data.first_name || '',
    fullName: data.full_name,
    jobTitle: data.job_title,
    lastName: data.last_name,
    phone: data.phone,
    postBox: data.post_box,
    postalCode: data.postal_code || '',
    salutation: data.salutation,
    secondName: data.second_name || '',
    stateCode: data.state_code || '',
    suffix: data.suffix,
    suite: data.suite,
    title: data.title
  };
}

function customerAddress(data: SFCC.CustomerAddress): FSCommerceTypes.CustomerAddress | null {
  const formatedAddress = address(data);
  if (!formatedAddress) {
    return null;
  }

  return {
    ...formatedAddress,
    preferred: data.preferred !== undefined ? data.preferred : false
  };
}

function customerAddresses(data: SFCC.CustomerAddressResult): FSCommerceTypes.CustomerAddress[] {
  const addresses = data.data || [];
  return addresses
    .map(customerAddress)
    .filter((addr): addr is FSCommerceTypes.CustomerAddress => addr !== undefined);
}

function shippingMethodPromo(
  data: SFCC.ShippingPromotion
): FSCommerceTypes.ShippingMethodPromo | null {
  if (!data) {
    return null;
  }
  return {
    calloutMessage: data.callout_msg,
    id: data.promotion_id || '',
    link: data.link,
    name: data.promotion_name || ''
  };
}

function shippingMethod(
  data: SFCC.ShippingMethod,
  currency: string
): FSCommerceTypes.ShippingMethod | null {
  if (!data) {
    return null;
  }

  const promos = (data.shipping_promotions || [])
    .map(shippingMethodPromo)
    .filter((promo): promo is FSCommerceTypes.ShippingMethodPromo => promo !== null);

  return {
    description: data.description,
    externalShippingMethod: data.external_shipping_method,
    id: data.id,
    name: data.name || '',
    price: makeCurrency(data.price, currency),
    shippingPromotions: promos
  };
}

function shipment(data: SFCC.Shipment, currency: string): FSCommerceTypes.Shipment | null {
  if (!data) {
    return null;
  }

  let formattedAddress;
  let formattedShippingMethod;

  if (data.shipping_address) {
    formattedAddress = address(data.shipping_address);
  }

  if (data.shipping_method) {
    formattedShippingMethod = shippingMethod(data.shipping_method, currency);
  }

  if (!formattedAddress || !formattedShippingMethod) {
    return null;
  }

  return {
    address: formattedAddress,
    gift: data.gift !== undefined ? data.gift : false,
    giftMessage: data.gift_message,
    id: data.shipment_id || '',
    shipmentNumber: data.shipment_no,
    shippingMethod: formattedShippingMethod
  };
}

function cart(cartData: SFCC.Basket, currency: string): FSCommerceTypes.Cart | null {
  if (!cartData) {
    return null;
  }

  const currencyCode = cartData.currency || currency;
  const items = (cartData.product_items || []).map(item => cartItem(item, currencyCode));
  const shipments = (cartData.shipments || [])
    .map(shipmentData => shipment(shipmentData, currencyCode))
    .filter((shipment): shipment is FSCommerceTypes.Shipment => shipment !== null);

  return {
    id: cartData.basket_id,
    customerInfo: cartData.customer_info && customerAccount(cartData.customer_info),
    items,
    subtotal: makeCurrency(cartData.product_sub_total, currencyCode),
    total: makeCurrency(cartData.order_total || cartData.product_total, currencyCode),
    shipping: makeCurrency(cartData.shipping_total, currencyCode),
    tax: makeCurrency(cartData.tax_total, currencyCode),
    promos: promos(cartData, currencyCode),
    shipments,
    billingAddress: cartData.billing_address && address(cartData.billing_address),
    payments: (cartData.payment_instruments || [])
      .map(paymentData => payment(paymentData, currencyCode))
  };
}

function promos(cartData: SFCC.Basket, currency: string): FSCommerceTypes.Promo[] {
  const currencyCode = cartData.currency || currency;
  return (cartData.coupon_items || []).map(item => ({
    id: item.coupon_item_id || '',
    code: item.code,
    valid: item.valid !== undefined ? item.valid : false,
    value: getPromoValue(cartData, item.code, currencyCode)
  }));
}

function getPromoValue(
  cartData: SFCC.Basket,
  code: string,
  currency: string
): FSCommerceTypes.CurrencyValue | undefined {
  if (
    !cartData.order_price_adjustments ||
    !cartData.order_price_adjustments.length
  ) {
    return undefined;
  }

  const currencyCode = cartData.currency || currency;
  const match = cartData.order_price_adjustments.find(adj => adj.coupon_code === code);
  if (!match) {
    return undefined;
  } else {
    return makeCurrency(match.price, currencyCode);
  }
}

function cartItem(cartItemData: ExtendedProductItem, currency: string): FSCommerceTypes.CartItem {
  const item: FSCommerceTypes.CartItem = {
    itemId: cartItemData.item_id || '',
    productId: cartItemData.product_id || '',
    title: cartItemData.product_name || '',
    quantity: cartItemData.quantity,
    handle: cartItemData.product_id || '',
    price: makeCurrency(cartItemData.base_price, currency),
    totalPrice: makeCurrency(cartItemData.price, currency),
    itemText: cartItemData.item_text,
    originalPrice: makeCurrency(cartItemData.base_price, currency),
    images: cartItemData.images
  };

  if (cartItemData.price_adjustments) {
    item.promotions = cartItemData.price_adjustments.reduce((promos, promo) => {
      if (promo.promotion_id) {
        return [...promos, {
          id: promo.promotion_id,
          text: promo.item_text,
          price: makeCurrency(promo.price, currency)
        }];
      }

      return promos;
    }, [] as FSCommerceTypes.CartPromo[]);
  }

  return item;
}

function refinements(
  refinementsData: SFCC.ProductSearchRefinement[]
): FSCommerceTypes.Refinement[] {
  if (!Array.isArray(refinementsData) || !refinementsData.length) {
    return [];
  }
  return refinementsData
    .filter(item => item.values && item.values.length > 0)
    .map(refinementItem)
    .filter((item): item is FSCommerceTypes.Refinement => item !== null);
}

function refinementItem(
  refinementItemData: SFCC.ProductSearchRefinement
): FSCommerceTypes.Refinement | null {
  if (!refinementItemData) {
    return null;
  }
  return {
    id: refinementItemData.attribute_id,
    title: refinementItemData.label || '',
    values: refinementItemValues(refinementItemData.values || [])
  };
}

function refinementItemValues(
  refinementItemValuesData: SFCC.ProductSearchRefinementValue[]
): FSCommerceTypes.RefinementValue[] {
  if (!Array.isArray(refinementItemValuesData) || refinementItemValuesData.length === 0) {
    return [];
  }

  return refinementItemValuesData.map(val => ({
    value: val.value || '',
    title: val.label || '',
    count: val.hit_count
  }));
}

function applicablePaymentCard(
  data: SFCC.PaymentCardSpec
): FSCommerceTypes.ApplicablePaymentCard | null {
  if (!data) {
    return null;
  }

  const checksumVerificationEnabled = data.checksum_verification_enabled !== undefined ?
    data.checksum_verification_enabled :
    true;

  return {
    cardType: data.card_type || '',
    checksumVerificationEnabled,
    description: data.description,
    image: data.image,
    name: data.name || '',
    numberLengths: data.number_lengths,
    numberPrefixes: data.number_prefixes,
    securityCodeLength: data.security_code_length
  };
}

function applicablePayment(data: SFCC.PaymentMethod): FSCommerceTypes.ApplicablePayment | null {
  if (!data) {
    return null;
  }
  const payment: FSCommerceTypes.ApplicablePayment = {
    description: data.description,
    id: data.id,
    image: data.image,
    name: data.name || ''
  };
  if (data.cards) {
    payment.cards = (data.cards || [])
      .map(applicablePaymentCard)
      .filter((card): card is FSCommerceTypes.ApplicablePaymentCard => card !== null);
  }
  return payment;
}

function applicablePayments(data: SFCC.PaymentMethodResult): FSCommerceTypes.ApplicablePayment[] {
  if (!data) {
    return [];
  }
  const applicablePayments = (data.applicable_payment_methods || []);
  return applicablePayments
    .map(applicablePayment)
    .filter((payment): payment is FSCommerceTypes.ApplicablePayment => payment !== null);
}

function paymentBankAccount(data: SFCC.PaymentBankAccount): FSCommerceTypes.PaymentBankAccount {
  return {
    driversLicenseLastDigits: data.drivers_license_last_digits || '',
    driversLicenseStateCode: data.drivers_license_state_code || '',
    holder: data.holder || '',
    maskedDriverLicense: data.masked_drivers_license,
    maskedNumber: data.masked_number,
    numberLastDigits: data.number_last_digits
  };
}

function paymentCard(data: SFCC.PaymentCard): FSCommerceTypes.PaymentCard {
  return {
    cardType: data.card_type,
    creditCardExpired: data.credit_card_expired,
    creditCardToken: data.credit_card_token,
    expirationMonth: data.expiration_month || 0,
    expirationYear: data.expiration_year || 0,
    holder: data.holder,
    issueNumber: data.issue_number,
    maskedNumber: data.masked_number,
    numberLastDigits: data.number_last_digits,
    validFromMonth: data.valid_from_month,
    validFromYear: data.valid_from_year
  };
}

function paymentMethod(data: SFCC.CustomerPaymentInstrument): FSCommerceTypes.PaymentMethod {
  return {
    bankRoutingNumber: data.bank_routing_number,
    creationDate: data.creation_date !== undefined ? new Date(data.creation_date) : undefined,
    id: data.payment_instrument_id,
    maskedGiftCertificateCode: data.masked_gift_certificate_code,
    modifiedDate: data.last_modified !== undefined ? new Date(data.last_modified) : undefined,
    paymentBankAccount: data.payment_bank_account && paymentBankAccount(data.payment_bank_account),
    paymentCard: data.payment_card && paymentCard(data.payment_card),
    paymentMethodId: data.payment_method_id
  };
}

function paymentMethods(
  data: SFCC.CustomerPaymentInstrumentResult
): FSCommerceTypes.PaymentMethod[] {
  const methods = data.data || [];
  return methods.map(paymentMethod);
}

function shippingMethodResponse(
  data: SFCC.ShippingMethodResult,
  currency: string
): FSCommerceTypes.ShippingMethodResponse | null {
  if (!data) {
    return null;
  }
  const methods = data.applicable_shipping_methods || [];
  return {
    defaultMethodId: data.default_shipping_method_id || '',
    shippingMethods: methods
      .map(method => shippingMethod(method, currency))
      .filter((method): method is FSCommerceTypes.ShippingMethod => method !== null)
  };
}

function payment(data: SFCC.OrderPaymentInstrument, currency: string): FSCommerceTypes.Payment {
  return {
    amount: makeCurrency(data.amount, currency),
    bankRoutingNumber: data.bank_routing_number,
    id: data.payment_instrument_id,
    maskedGiftCertificateCode: data.masked_gift_certificate_code,
    paymentBankAccount: data.payment_bank_account && paymentBankAccount(data.payment_bank_account),
    paymentCard: data.payment_card && paymentCard(data.payment_card),
    paymentMethodId: data.payment_method_id
  };
}

function searchSuggestion(data: SFCC.SuggestionResult): FSCommerceTypes.SearchSuggestion {
  const { brand_suggestions, category_suggestions, product_suggestions, query } = data;

  return {
    query: query || '',
    brandSuggestions: brand_suggestions && brandSuggestions(brand_suggestions),
    categorySuggestions: category_suggestions && categorySuggestions(category_suggestions),
    productSuggestions: product_suggestions && productSuggestions(product_suggestions)
  };
}

function brandSuggestions(data: SFCC.Suggestion): FSCommerceTypes.BrandSuggestions | undefined {
  if (!Array.isArray(data.brands)) {
    return undefined;
  }

  return {
    brands: data.brands.reduce((brands, brand) => {
      if (brand) {
        return [...brands, {
          title: brand
        }];
      }

      return brands;
    }, [] as FSCommerceTypes.BrandSuggestion[])
  };
}

function categorySuggestions(
  data: SFCC.Suggestion
): FSCommerceTypes.CategorySuggestions | undefined {
  if (!Array.isArray(data.categories)) {
    return undefined;
  }

  return {
    categories: data.categories.reduce((categories, category) => {
      if (category.id && category.name) {
        return [...categories, {
          categoryId: category.id,
          title: category.name
        }];
      }

      return categories;
    }, [] as FSCommerceTypes.CategorySuggestion[])
  };
}

function productSuggestions(data: SFCC.Suggestion): FSCommerceTypes.ProductSuggestions | undefined {
  if (!Array.isArray(data.products)) {
    return undefined;
  }

  return {
    products: data.products.reduce((products, product) => {
      if (product.product_id && product.product_name) {
        return [...products, {
          productId: product.product_id,
          title: product.product_name
        }];
      }

      return products;
    }, [] as FSCommerceTypes.ProductSuggestion[])
  };
}

function customerAccount(
  rawData: SFCC.Customer | SFCC.CustomerInfo
): FSCommerceTypes.CustomerAccount | undefined {
  if (!rawData) {
    return undefined;
  }

  const {
    creation_date,
    customer_id,
    customer_no,
    email = '',
    enabled,
    first_name = '',
    last_modified,
    last_name = '',
    login = ''
  } = rawData as SFCC.Customer & SFCC.CustomerInfo;

  return {
    creationDate: creation_date !== undefined ? new Date(creation_date) : undefined,
    customerId: customer_id,
    customerNumber: customer_no,
    email,
    enabled,
    firstName: first_name,
    lastModified: last_modified !== undefined ? new Date(last_modified) : undefined,
    lastName: last_name,
    login
  };
}

function orders(rawData: SFCC.Order[], currency: string): FSCommerceTypes.Order[] {
  if (!Array.isArray(rawData) || !rawData.length) {
    return [];
  }
  return rawData.map(orderData => order(orderData, currency));
}

function productItem(
  data: ExtendedProductItem,
  currency: string
): FSCommerceTypes.ProductItem | null {
  if (!data) {
    return null;
  }
  return {
    ...cartItem(data, currency),
    gift: data.gift !== undefined ? data.gift : false,
    giftMessage: data.gift_message,
    shipmentId: data.shipment_id,
    shippingItemId: data.shipping_item_id
  };
}

function order(data: SFCC.Order, defaultCurrency: string): FSCommerceTypes.Order {
  const {
    billing_address,
    channel_type,
    customer_info,
    confirmation_status,
    creation_date,
    currency = defaultCurrency,
    customer_name = '',
    order_no = '',
    tax_total,
    order_token,
    order_total,
    payment_instruments = [],
    payment_status,
    product_items = [],
    shipments = [],
    site_id,
    status
  } = data;

  return {
    billingAddress: billing_address && address(billing_address),
    channelType: channel_type,
    confirmationStatus: confirmation_status,
    creationDate: creation_date !== undefined ? new Date(creation_date) : undefined,
    currency,
    customerInfo: customer_info && customerAccount(customer_info),
    customerName: customer_name,
    orderId: order_no,
    orderTax: makeCurrency(tax_total, currency),
    orderToken: order_token,
    orderTotal: makeCurrency(order_total, currency),
    payments: payment_instruments
      .map(paymentInstrument => payment(paymentInstrument, currency))
      .filter((payment): payment is FSCommerceTypes.Payment => payment !== null),
    paymentStatus: payment_status,
    productItems: product_items
      .map(item => productItem(item, currency))
      .filter((item): item is FSCommerceTypes.ProductItem => item !== null),
    shipments: shipments
      .map(shipmentData => shipment(shipmentData, currency))
      .filter((shipment): shipment is FSCommerceTypes.Shipment => shipment !== null),
    siteId: site_id,
    status
  };
}

function makeCurrency(
  price: string | number | undefined,
  currencyCode: string
): FSCommerceTypes.CurrencyValue | undefined {
  if (price === undefined || price === null) {
    return undefined;
  }

  return {
    value: new Decimal(price),
    currencyCode
  };
}

export default {
  applicablePayments,
  product,
  productSearchHit,
  productIndex,
  variant,
  option,
  images,
  category,
  sessionToken,
  cart,
  refinements,
  customerAddress,
  customerAddresses,
  customerAccount,
  order,
  orders,
  paymentBankAccount,
  paymentCard,
  payment,
  paymentMethod,
  paymentMethods,
  searchSuggestion,
  shippingMethodResponse
};
