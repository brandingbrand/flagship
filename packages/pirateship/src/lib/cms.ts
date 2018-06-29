import {
  ContentManagementSystem,
  CoreContentManagementSystemProvider
} from '@brandingbrand/fsengage';
import { env as projectEnv } from '@brandingbrand/fsapp';

const providerConfiguration = {
  propertyId: projectEnv.cmsPropertyId,
  environment: projectEnv.cmsEnvironment
};

export const CMSProvider = new CoreContentManagementSystemProvider(
  providerConfiguration
);

// CMS Slot Instance interface
export type CMSSlot = any[];

// CMS instance that can be used as a prop for some Pirate components
export const CMS = new ContentManagementSystem(CMSProvider);

export async function fetchCMS(
  group: string,
  slot: string,
  identifier?: string
): Promise<CMSSlot> {
  try {
    const result = await CMS.contentForSlot(group, slot, identifier) as any;
    if (result && result.instances) {
      return result.instances as CMSSlot;
    } else {
      return [];
    }
  } catch (e) {
    // TODO: update this after all exceptions in CMS.contentForSlot are properly handled
    console.log('CMS Error - group: ' + group + ', slot: '
                + slot + ', identifier: ' + identifier);
    return [];
  }
}
