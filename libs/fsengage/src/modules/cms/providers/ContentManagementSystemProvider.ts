import { ContentManagementSystemProviderConfiguration } from './types/ContentManagementSystemProviderConfiguration';

import ContentManagementSystemLocator from '../requesters/ContentManagementSystemLocator';

export interface ContentManagementSystemContext {
  locator: ContentManagementSystemLocator;
}

export default abstract class ContentManagementSystemProvider {
  protected propertyId: string;
  protected environment: number;

  // TODO | BD: Preview mode

  constructor(configuration: ContentManagementSystemProviderConfiguration) {
    this.propertyId = String(configuration.propertyId);
    this.environment = configuration.environment;
  }

  abstract contentForSlot(
    group: string,
    slot: string,
    identifier?: string,
    context?: ContentManagementSystemContext
  ): Promise<{}>;

  abstract contentForGroup(group: string): Promise<{}>;

  abstract identifiersForSlot(group: string, slot: string): Promise<string[] | null>;
}
