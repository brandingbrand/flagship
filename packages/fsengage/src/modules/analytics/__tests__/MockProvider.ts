// tslint:disable:no-empty
import * as Provider from '../AnalyticsProvider';

export class MockProvider extends Provider.AnalyticsProvider {
  clickGeneric(properties: Provider.ClickGeneric): void {}
  contactCall(properties: Provider.ContactCall): void {}
  contactEmail(properties: Provider.ContactEmail): void {}
  impressionGeneric(properties: Provider.ImpressionGeneric): void {}
  locationDirections(properties: Provider.LocationDirections): void {}
  pageview(properties: Provider.Screenview): void {}
  screenview(properties: Provider.Screenview): void {}
  searchGeneric(properties: Provider.SearchGeneric): void {}

  // Enhanced Commerce Functions
  addProduct(properties: Provider.Product): void {}
  checkout(properties: Provider.Checkout, action: Provider.CheckoutAction): void {}
  checkoutOption(properties: Provider.Generics, action: Provider.CheckoutAction): void {}
  clickProduct(properties: Provider.Product, action?: Provider.ProductAction): void {}
  clickPromotion(properties: Provider.Promotion): void {}
  impressionProduct(properties: Provider.ImpressionProduct): void {}
  impressionPromotion(properties: Provider.Promotion): void {}
  detailProduct(properties: Provider.Product, action?: Provider.ProductAction): void {}
  purchase(properties: Provider.Transaction, action: Provider.TransactionAction): void {}
  refundAll(properties: Provider.Generics, action: Provider.TransactionAction): void {}
  refundPartial(properties: Provider.TransactionRefund, action: Provider.TransactionAction): void {}
  removeProduct(properties: Provider.Product): void {}

  // App Lifecycle Function
  lifecycle(properties: Provider.App): void {}
}
