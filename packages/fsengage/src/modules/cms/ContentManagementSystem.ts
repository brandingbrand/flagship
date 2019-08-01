import ContentManagementSystemProvider from './providers/ContentManagementSystemProvider';
import ContentManagementSystemLocator from './requesters/ContentManagementSystemLocator';

export default class ContentManagementSystem {
  private provider: ContentManagementSystemProvider;
  private locator: ContentManagementSystemLocator;

  set shouldPromptForGelolocationPermission(permission: boolean) {
    this.locator.shouldPromptForGelolocationPermission = permission;
  }

  set shouldFallbackToGeoIP(permission: boolean) {
    this.locator.shouldFallbackToGeoIP = permission;
  }

  constructor(provider: ContentManagementSystemProvider) {
    this.provider = provider;
    this.locator = new ContentManagementSystemLocator();
  }

  async contentForSlot(group: string, slot: string, identifier?: string): Promise<{}> {
    if (__DEV__) {
      this.log(group, slot, identifier);
    }

    return this.provider.contentForSlot(group, slot, identifier, {
      locator: this.locator
    });
  }

  async contentForGroup(group: string): Promise<{}> {
    return this.provider.contentForGroup(group);
  }

  async identifiersForSlot(group: string, slot: string): Promise<string[] | null> {
    if (__DEV__) {
      this.log(group, slot);
    }

    return this.provider.identifiersForSlot(group, slot);
  }

  private log(group: string, slot: string, identifier?: string): void {
    console.log(
      `%cContentManagementSystem\n%c group: ${group}\n slot: ${slot}${
        identifier ? `\n identifier: ${identifier}` : ''
      }`,
      'color: blue',
      'color: grey'
    );
  }
}
