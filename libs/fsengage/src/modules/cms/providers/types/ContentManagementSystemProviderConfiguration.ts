export interface ContentManagementSystemProviderConfiguration {
  propertyId: string;
  environment: ContentManagementSystemEnvironment;
}

export enum ContentManagementSystemEnvironment {
    DEV = 1,
    UAT,
    NONE,
    PROD
}
