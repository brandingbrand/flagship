# FSEngage

FSEngage is Flagship's Engagement package. It Analytics library supports integrations for Google
Analytics, Leanplum, and Adobe Cloud Marketing. Its CMS library supports our proprietary CMS and soon
 will support Demandware.

* [Analytics](#analytics)
  * [Analytics Providers](#analytics-providers)
  * [Analytics Providers Configuration](#analytics-configurations)
    * [Analytics Provider Configuration](#AnalyticsProviderConfiguration)
    * [Leanplum](#LeanplumProviderConfiguration)
    * [Adobe Marketing Congfiguration](#AdobeMarketingCloudWebProviderConfiguration)
    * [Google Analytics](#GoogleAnalyticsProviderConfiguration)
  * [Analytics Constructors](#analytics-constructors)
  * [Analytics Tracking](#tracking-functions)
    * [Ecommerce Function Signatures](#ecommerce)
    * [Enhanced Ecommerce Function Signatures](#enhanced-ecommerce)
    * [App Lifecycle Function Signatures](#app-lifecycle)
    * [Full List of Property Parameters for Tracking](#parameters)
* [CMS](#cms)
  * [CMS Providers](#cms-providers)
    * [Core](#core)
    * [Demandware](#demandware)
  * [CMS API](#cms-api)
    * [CMS Configurations](#cms-configurations)
    * [CMS Constructors](#cms-constructors)
    * [Functionality](#cms-constructors)
* [Tests](#tests)

## Analytics

The analytics library includes convenient integrations for Google Analytics, Leanplum, and Adobe
Marketing cloud. Getting started with our analytics library is as easy as configuring your analytics
providers and passing these configs into the Analytics constructor. Then you will be
able to import your analytics object into your app's components for easy tracking of ecommerce,
enhanced ecommerce, and lifecycle events.

## Analytics Providers

### Leanplum

Leanplum is only supported in native environments.

### Adobe Marketing Cloud

Adobe is only supported in native environments at the moment. The plan is to also provide support
for web environment down the road.

__Warning__: Adobe native support has not been fully tested yet due to limited access to their
platform at the time of development.

#### # iOS

In order to run Adobe native code wrapper, the below dependencies would need to be linked in the iOS
project.

```bash
SystemConfiguration.framework
libsqlite3.0
```

Also, you will need to include in your bundle the configuration file `ADBMobileConfig.json` provided
by Adobe Marketing Cloud.

For more information please go [here](https://marketing.adobe.com/resources/help/en_US/mobile/ios/dev_qs.html).

## API - Analytics

### Analytics Configurations

Before generating your analytics object, you must first successfully configure your providers according
to the following configuration signatures.

#### # AnalyticsProviderConfiguration

  | Property | Type | Required |
  | - |:-:| :-:|
  | userAgent | string | **yes** |
  | osType | string | **yes** |
  | osVersion | string | **yes** |
  | appName | string | **yes** |
  | appId | string | **yes** |
  | appVersion | string | **yes** |
  | appInstallerId | string | no |

#### # AdobeMarketingCloudWebProviderConfiguration

  | Property | Type | Required |
  | - |:-:| :-:|
  | clientId | string | **yes** |
  | clientSecret | string | **yes** |
  | reportSuiteId | string | **yes** |

  __Note__: This configuration just applies for web environments. For native environment
  configuration please see [here](https://github.com/brandingbrand/flagship/tree/master/packages/fsengage#-ios).

#### # GoogleAnalyticsProviderConfiguration

  | Property | Type | Required |
  | - |:-:| :-:|
  | trackerId | string | **yes** |
  | clientId | string | **yes** |
  | trackerName | string | no |
  | cookieDomain | string | no |

#### # LeanplumProviderConfiguration

  | Property | Type | Required |
  | - |:-:| :-:|
  | appId | string | **yes** |
  | key | string | **yes** |
  | monetizationEventName | string | no |

### Analytics Constructors

Once you have configured your providers, you will want to pass them to the Analytics constructor in
order to output your own Analytics instance. Below you will find examples. The first user has chosen
to Google Analytics alone, the second has chosen to use all three providers.

```javascript

const AnalyticsProviderConfiguration = {
  userAgent: DeviceInfo.getUserAgent(),
  osType: Platform.OS,
  osVersion: (Platform.Version && Platform.Version.toString()) || '',
  appName: DeviceInfo.getApplicationName(),
  appId: DeviceInfo.getBundleId(),
  appVersion: version
};

const googleAnalyticsConfiguration = {
  trackerId: projectEnv.googleAnalytics[Platform.OS],
  clientId: DeviceInfo.getUniqueID()
};

const google = new GoogleAnalyticsProvider(
  AnalyticsProviderConfiguration,
  GoogleAnalyticsProviderConfiguration
)

const analytics = new Analytics([
  google
])

```

```javascript
const adobe = new AdobeMarketingCloudProvider(
  AnalyticsProviderConfiguration,
  AdobeMarketingCloudWebProviderConfiguration
);
const google = new GoogleAnalyticsProvider(
  AnalyticsProviderConfiguration,
  GoogleAnalyticsProviderConfiguration
);
const leanplum = new LeanplumProvider(
  AnalyticsProviderConfiguration,
  LeanplumProviderConfiguration
);

const analytics = new Analytics([
  adobe,
  google,
  leanplum
]): Analytics;

```

### Tracking Functions

Once you have successfully configured your Analytics provider, you can import it into your components
 and begin tracking users' interactions with your app or site. For example, on a Product Detail Page,
 you might want to add a click tracker to your 'Add To Cart' button.  It's as simple as adding the
 following code to your success handler (assuming you only want to tracks successful adds):

 ```javascript
       Analytics.click.generic('Add to Bag', {
        identifier: variantId,
        name: 'PDP'
      });
```

Or maybe you want to track a screenview of a product page. In that case you would want to add
something like this into your render function:

```javascript
     Analytics.screenview('ProductDetail', {
        url: 'www.example.com/products/123'
      });
```

The full list of function signatures for ecommerce, enhanced ecommerce, and lifecycle events can be
found below. Following these are complete lists of all mandatory and optional properties for each
function.

#### # Ecommerce

```javascript
analytics.contact.call(component: React.Component | string, properties: ContactCall): void;
```

```javascript
analytics.contact.email(component: React.Component | string, properties: ContactEmail): void;
```

```javascript
analytics.click.generic(component: React.Component | string, properties: ClickGeneric): void;
```

```javascript
analytics.location.directions(
  component: React.Component | string,
  properties: LocationDirections
): void;
```

```javascript
analytics.search.generic(component: React.Component | string, properties: SearchGeneric): void;
```

```javascript
analytics.impression.generic(
  component: React.Component | string,
  properties: ImpressionGeneric
): void;
```

```javascript
analytics.screenview(component: React.Component | string, properties: Screenview): void;
```

#### # Enhanced Ecommerce

**IMPORTANT**: Enhanced hits are not sent on their own; instead, they piggy-back on standard
hits such as impressions and screenviews. As such, you must invoke a screenview or similar
hit after using any of the following methods in order for the data to be delivered.

```javascript
analytics.impression.promotion(component: React.Component | string, properties: Promotion): void;
```

```javascript
analytics.impression.product(
  component: React.Component | string,
  properties: ImpressionProduct
): void;
```

```javascript
analytics.click.promotion(component: React.Component | string, properties: Promotion): void;
```

```javascript
analytics.click.product(
  component: React.Component | string,
  properties: Product,
  action: ProductAction?
): void;
```

```javascript
analytics.detail.product(
  component: React.Component | string,
  properties: Product,
  action: ProductAction?
): void;
```

```javascript
analytics.add.product(component: React.Component | string, properties: Product): void;
```

```javascript
analytics.remove.product(component: React.Component | string, properties: Product): void;
```

```javascript
analytics.checkout(
  component: React.Component | string,
  products: Product[],
  action: CheckoutAction
): void;
```

```javascript
analytics.checkoutOption(component: React.Component | string, action: CheckoutAction): void;
```

```javascript
analytics.purchase(
  component: React.Component | string,
  products: Product[],
  action: TransactionAction
): void;
```

```javascript
analytics.refund.partial(
  component: React.Component | string,
  products: RefundProduct[],
  action: TransactionAction
): void;
```

```javascript
analytics.refund.all(component: React.Component | string, action: TransactionAction): void;
```

#### # App Lifecycles

```javascript
analytics.lifecycle.active(): void;
```

```javascript
analytics.lifecycle.background(): void;
```

```javascript
analytics.lifecycle.close(): void;
```

```javascript
analytics.lifecycle.create(): void;
```

```javascript
analytics.lifecycle.inactive(): void;
```

```javascript
analytics.lifecycle.start(): void;
```

```javascript
analytics.lifecycle.suspend(): void;
```

### Parameters

#### # ClickGeneric

  | Property | Type | Required |
  | - |:-:| :-:|
  | identifier | string | **yes*** |
  | name | string | **yes*** |
  | index | number | no |

  \* Either **identifier** or **name** must be set.

#### # ContactCall

  | Property | Type | Required |
  | - |:-:| :-:|
  | number | string | **yes** |

#### # ContactEmail

  | Property | Type | Required |
  | - |:-:| :-:|
  | to | string | **yes** |

#### # ImpressionGeneric

  | Property | Type | Required |
  | - |:-:| :-:|
  | identifier | string | **yes*** |
  | name | string | **yes*** |
  | index | number | no |

  \* Either **identifier** or **name** must be set.

#### # ImpressionProduct

  | Property | Type | Required |
  | - |:-:| :-:|
  | identifier | string | **yes** |
  | name | string | **yes** |
  | brand | string | no |
  | category | string | no |
  | list | string | no |
  | variant | string | no |
  | price | number | no |
  | index | number | no |

#### # LocationDirections

  | Property | Type | Required |
  | - |:-:| :-:|
  | identifier | string | **yes*** |
  | address | string | **yes*** |

  \* Either **identifier** or **address** must be set.

#### # Product

  | Property | Type | Required |
  | - |:-:| :-:|
  | identifier | string | **yes** |
  | name | string | **yes** |
  | brand | string | no |
  | category | string | no |
  | variant | string | no |
  | coupons | string[] | no |
  | price | string | no |
  | quantity | number | no |
  | index | number | no |

#### # Promotion

  | Property | Type | Required |
  | - |:-:| :-:|
  | identifier | string | **yes** |
  | name | string | **yes** |
  | creative | string | no |
  | slot | string | no |

#### # RefundProduct

  | Property | Type | Required |
  | - |:-:| :-:|
  | identifier | string | **yes** |
  | quantity | number | **yes** |
  | price | string | no |
  | coupons | string[] | no |

#### # SearchGeneric

  | Property | Type | Required |
  | - |:-:| :-:|
  | term | string | **yes** |
  | count | number | no |

#### # Screenview

  | Property | Type | Required |
  | - |:-:| :-:|
  | url | string | **yes** |

### Actions

#### # ProductAction

  | Property | Type | Required |
  | - |:-:| :-:|
  | list | string | no |

#### # CheckoutAction

  | Property | Type | Required |
  | - |:-:| :-:|
  | step | number | no |
  | option | string | no |

#### # TransactionAction

  | Property | Type | Required |
  | - |:-:| :-:|
  | identifier | string | **yes** |
  | affiliation | string | no |
  | revenue | string | no |
  | tax | string | no |
  | shippingCost | string | no |
  | coupons | string[] | no |

## CMS

## CMS Providers

### Core

Branding Brand's content management system is supported with some targets limitations at the moment.
The targets currently supported are:

* City
* Country
* Date
* Postal Code
* Region
* State
* Time of Day
* Time Zone

### Demandware

Demandware's content management system support is on the roadmap, but it is still on the exploration
stage. A strategy for how to manage slots' content need to be set, since they are coming from the
Data API, instead of the Shop API.

## CMS API

### CMS Configurations

#### # ContentManagementSystemProviderConfiguration

  | Property | Type | Required |
  | - |:-:| :-:|
  | propertyId | string | **yes** |
  | environment | number | **yes** |

### CMS Constructors

```javascript
const core = new CoreContentManagementSystemProvider(
  configuration: ContentManagementSystemProviderConfiguration
);
const cms = new ContentManagementSystem(provider: core);
```

### Functionality

```javascript
cms.shouldFallbackToGeoIP = true;
```

```javascript
cms.shouldPromptForGelolocationPermission = true;
```

```javascript
cms.contentForSlot(group: string, slot: string, identifier?: string): Promise<{}>;
```

Get a list of identifiers of the slot

```javascript
cms.identifiersForSlot(group: string, slot: string): Promise<string[]>;
```

## Tests

### Native

In order to run native integrations tests, please execute the following commands:

```bash
1. npm install
```

```bash
2. npm run init
```

```bash
3. npm run ios || npm run android
```

### Web

In order to run web integrations tests, please execute the following commands:

```bash
1. npm install
```

```bash
2. npm run init
```

```bash
3. npm run web
```
