// tslint:disable-next-line:no-implicit-dependencies
// import firebase, { ReactNativeFirebase } from '@react-native-firebase/app';
// tslint:disable-next-line:no-implicit-dependencies
import AnalyticsProviderConfiguration from '../types/AnalyticsProviderConfiguration';

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

export interface FirebaseAnalyticsProviderConfiguration {
  appId: string;
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  measurementId: string;
}

export default class FirebaseAnalyticsProvider extends AnalyticsProvider {
  configuration: FirebaseAnalyticsProviderConfiguration;
  client: null;

  constructor(commonConfiguration: AnalyticsProviderConfiguration,
              configuration: FirebaseAnalyticsProviderConfiguration) {
    super(commonConfiguration);
    this.configuration = configuration;
    this.client = null;
  }

  async asyncInit(): Promise<void> {
    console.warn('Firebase Provider currently not supported on web');
  }

  addProduct(properties: Product): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  checkout(properties: Checkout, action: CheckoutAction): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  checkoutOption(properties: Generics, action: CheckoutAction): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  clickGeneric(properties: ClickGeneric): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  clickProduct(properties: Product, action?: ProductAction): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  clickPromotion(properties: Promotion): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  contactCall(properties: ContactCall): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  contactEmail(properties: ContactEmail): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  detailProduct(properties: Product, action?: ProductAction): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  impressionGeneric(properties: ImpressionGeneric): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  impressionProduct(properties: ImpressionProduct): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  impressionPromotion(properties: Promotion): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  lifecycle(properties: App): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  locationDirections(properties: LocationDirections): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  pageview(properties: Screenview): void {
    // do nothing
  }

  purchase(properties: Transaction, action: TransactionAction): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  refundAll(properties: Generics, action: TransactionAction): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  refundPartial(properties: TransactionRefund, action: TransactionAction): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  removeProduct(properties: Product): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  screenview(properties: Screenview): void {
    console.warn('Firebase Provider currently not supported on web');
  }

  searchGeneric(properties: SearchGeneric): void {
    console.warn('Firebase Provider currently not supported on web');
  }
}
