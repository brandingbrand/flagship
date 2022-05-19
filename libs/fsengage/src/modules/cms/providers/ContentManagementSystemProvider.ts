import type ContentManagementSystemLocator from '../requesters/ContentManagementSystemLocator';

import type { ContentManagementSystemProviderConfiguration } from './types/ContentManagementSystemProviderConfiguration';

export interface ContentManagementSystemContext {
  locator: ContentManagementSystemLocator;
}

export default abstract class ContentManagementSystemProvider {
  // TODO | BD: Preview mode
  constructor(configuration: ContentManagementSystemProviderConfiguration) {
    this.propertyId = String(configuration.propertyId);
    this.environment = configuration.environment;
  }

  protected propertyId: string;
  protected environment: number;

  public abstract contentForSlot(
    group: string,
    slot: string,
    identifier?: string,
    context?: ContentManagementSystemContext
  ): Promise<{}>;

  public abstract contentForGroup(group: string): Promise<{}>;

  public abstract identifiersForSlot(group: string, slot: string): Promise<string[] | null>;
}
