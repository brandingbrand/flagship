import FSNetwork from '@brandingbrand/fsnetwork';

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

export interface AdobeMarketingCloudWebProviderConfiguration {
  clientId: string;
  clientSecret: string;
  reportSuiteId: string;
}

export default class AdobeMarketingCloudWebProvider extends AnalyticsProvider {
  private readonly kBaseEndpoint: string = 'https://api.omniture.com';
  private readonly kAdminPath: string = '/admin/1.4/rest';
  private readonly kCredentialPath: string = '/token';

  private token?: Promise<any>;
  private client: FSNetwork;
  private configuration: AdobeMarketingCloudWebProviderConfiguration;

  constructor(commonConfiguration: AnalyticsProviderConfiguration,
              configuration: AdobeMarketingCloudWebProviderConfiguration) {
    super(commonConfiguration);

    this.client = new FSNetwork({ baseURL: this.kBaseEndpoint });
    this.configuration = configuration;

    // TODO: Trigger basic analytics.
  }

  // Commerce Functions

  contactCall(properties: ContactCall): void {
    // TODO: Find out how to send custom elements.
  }

  contactEmail(properties: ContactEmail): void {
    // TODO: Find out how to send custom elements.
  }

  clickGeneric(properties: ClickGeneric): void {
    // TODO: Find out how to send custom elements.
  }

  impressionGeneric(properties: ImpressionGeneric): void {
    // TODO: Find out how to send custom elements.
  }

  locationDirections(properties: LocationDirections): void {
    // TODO: Find out how to send custom elements.
  }

  pageview(properties: Screenview): void {
    this.trackEvent({
      elements: [{
        page: {
          id: properties.eventCategory
        },
        metrics: [
          {
            id: 'pageviews'
          }
        ]
      }]
    });
  }

  screenview(properties: Screenview): void {
    // Not supported. This class just targets web environments.
  }

  searchGeneric(properties: SearchGeneric): void {
    this.trackEvent({
      elements: [{
        search: {
          id: properties.eventCategory,
          keywords: properties.term.split(' ')
        }
      }]
    });
  }

  // Enhanced Commerce Functions

  addProduct(properties: Product): void {
    // TODO: Find out how to send custom elements.
  }

  checkout(properties: Checkout, action: CheckoutAction): void {
    // TODO: Find out how to send custom elements.
  }

  checkoutOption(properties: Generics, action: CheckoutAction): void {
    // TODO: Find out how to send custom elements.
  }

  clickProduct(properties: Product, action?: ProductAction): void {
    // TODO: Find out how to send custom elements.
  }

  clickPromotion(properties: Promotion): void {
    // TODO: Find out how to send custom elements.
  }

  impressionProduct(properties: ImpressionProduct): void {
    // TODO: Find out how to send custom elements.
  }

  impressionPromotion(properties: Promotion): void {
    // TODO: Find out how to send custom elements.
  }

  detailProduct(properties: Product, action?: ProductAction): void {
    // TODO: Find out how to send custom elements.
  }

  purchase(properties: Transaction, action: TransactionAction): void {
    // TODO: Find out how to send custom elements.
  }

  refundAll(properties: Generics, action: TransactionAction): void {
    // TODO: Find out how to send custom elements.
  }

  refundPartial(properties: TransactionRefund, action: TransactionAction): void {
    // TODO: Find out how to send custom elements.
  }

  removeProduct(properties: Product): void {
    // TODO: Find out how to send custom elements.
  }

  // App Lifecycle Functions

  lifecycle(properties: App): void {
    // TODO: Find out how to send custom elements.
  }

  // Networking

  private trackEvent(description: {}): void {
    this.getToken()
      .then(token => {
        const data = {
          access_token: token,
          reportDescription: {
            reportSuiteID: this.configuration.reportSuiteId
          }
        };

        Object.assign(data.reportDescription, description);

        const config = {
          params: {
            method: 'Report.Queue'
          }
        };

        this.client.post(this.kAdminPath, data, config);
      })
      .catch(error => {
        if (__DEV__) {
          console.log(
            `%cAdobeMarketingCloudWebProvider\n%c Function: ${this.trackEvent.name}\n Error: `,
            'color: blue',
            'color: grey',
            error
          );
        }
      });
  }

  private async getToken(): Promise<any> {
    if (!this.token) {
      const parameters = {
        grant_type: 'client_credentials'
      };

      const config = {
        auth: {
          username: this.configuration.clientId,
          password: this.configuration.clientSecret
        }
      };

      this.token = this.client.post(this.kCredentialPath, parameters, config)
        .then(payload => {
          // TODO: Expire token.
          return payload.data.access_token;
        }).catch(error => {
          this.token = undefined;

          throw error;
        });
    }

    return this.token;
  }
}
