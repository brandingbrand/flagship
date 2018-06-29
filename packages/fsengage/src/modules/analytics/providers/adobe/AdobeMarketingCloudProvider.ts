import MarketingCloud from '@brandingbrand/react-native-adobe-marketing-cloud';

import AnalyticsProvider, {
  App,
  Checkout,
  CheckoutAction,
  ClickGeneric,
  ContactCall,
  ContactEmail,
  Generics,
  ImpressionGeneric,
  ImpressionProduct,
  LocationDirections,
  Product,
  ProductAction,
  Promotion,
  Screenview,
  SearchGeneric,
  Transaction,
  TransactionAction,
  TransactionRefund
} from '../AnalyticsProvider';

import AnalyticsProviderConfiguration from '../types/AnalyticsProviderConfiguration';

export default class AdobeMarketingCloudProvider extends AnalyticsProvider {
  client: MarketingCloud;

  constructor(commonConfiguration: AnalyticsProviderConfiguration) {
    super(commonConfiguration);

    this.client = new MarketingCloud();
    this.client.collectLifecycleData();
  }

  // Commerce Functions

  contactCall(properties: ContactCall): void {
    this.client.trackAction(properties.group, {
      component: properties.subgroup,
      number: properties.number
    });
  }

  contactEmail(properties: ContactEmail): void {
    this.client.trackAction(properties.group, {
      component: properties.subgroup,
      to: properties.to
    });
  }

  clickGeneric(properties: ClickGeneric): void {
    this.client.trackAction(properties.group, {
      component: properties.subgroup,
      identifier: properties.identifier,
      name: properties.name,
      index: properties.index
    });
  }

  impressionGeneric(properties: ImpressionGeneric): void {
    // TODO: Fix this implementation so it's not the same as click
    return this.clickGeneric(properties);
  }

  locationDirections(properties: LocationDirections): void {
    this.client.trackAction(properties.group, {
      component: properties.subgroup,
      identifier: properties.identifier,
      address: properties.address
    });
  }

  pageview(properties: Screenview): void {
    // Not supported. This class just targets native environments.
  }

  screenview(properties: Screenview): void {
    this.client.trackAction('ScreenView', {
      component: properties.subgroup,
      appId: this.appId,
      appInstallerId: this.appInstallerId,
      appName: this.appName,
      appVersion: this.appVersion
    });
  }

  searchGeneric(properties: SearchGeneric): void {
    this.client.trackAction(properties.group, {
      component: properties.subgroup,
      term: properties.term,
      count: properties.count
    });
  }

  // Enhanced Commerce Functions

  addProduct(properties: Product): void {
    // TODO: Implementation
  }

  checkout(properties: Checkout, action: CheckoutAction): void {
    // TODO: Implementation
  }

  checkoutOption(properties: Generics, action: CheckoutAction): void {
    // TODO: Implementation
  }

  clickProduct(properties: Product, action?: ProductAction): void {
    // TODO: Implementation
  }

  clickPromotion(properties: Promotion): void {
    // TODO: Implementation
  }

  impressionProduct(properties: ImpressionProduct): void {
    // TODO: Implementation
  }

  impressionPromotion(properties: Promotion): void {
    // TODO: Implementation
  }

  detailProduct(properties: Product, action?: ProductAction): void {
    // TODO: Implementation
  }

  purchase(properties: Transaction, action: TransactionAction): void {
    // TODO: Implementation
  }

  refundAll(properties: Generics, action: TransactionAction): void {
    // TODO: Implementation
  }

  refundPartial(properties: TransactionRefund, action: TransactionAction): void {
    // TODO: Implementation
  }

  removeProduct(properties: Product): void {
    // TODO: Implementation
  }

  // App Lifecycle Functions

  lifecycle(properties: App): void {
    this.client.trackAction(properties.group, {
      appId: this.appId,
      lifecycle: properties.lifecycle
    });
  }
}
