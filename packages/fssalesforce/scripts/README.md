# API Response Types for Saleforce Commerce Cloud

## Purpose

Salesforce Commerce Cloud offers OpenAPI 2.0 (aka. Swagger) documentation, which can be used to
automatically generate Typescript type definitions.

SFCC includes any custom properties (eg. `c_showInMenu`) and some store-specific definitions
(ie. enum of valid country codes) within their schema, which may not be valid across all instances.
This script alters/removes those.

## How To

SFCC requires authentication to access their OpenAPI 2.0 documentation.

To generate a new version:

- Login to the [SFCC API Explorer](https://api-explorer.commercecloud.salesforce.com/)
- Download the schema from `https://demo-ocapi.demandware.net/s/-/dw/meta/v1/rest/shop/v{version}`
  where `{version}` is your target version (eg. 18_3)
- Add the path to `generateTypes.js`
  - By default, it will tries to read from `schema.json`
- Run `yarn gen-types`
- Output will write to `fssalesforce/types/SFCC.d.ts`

## Usage Type Definitions

Types are accessible through the `SFCC` namespace.

```typescript
function product(dwProduct: SFCC.Product): FSCommerceTypes.Product { ... }
```
