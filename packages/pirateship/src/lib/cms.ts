import {
  ContentManagementSystem,
  CoreContentManagementSystemProvider
} from '@brandingbrand/fsengage';
import { env as projectEnv } from '@brandingbrand/fsapp';
import { ImageSourcePropType } from 'react-native';

const providerConfiguration = {
  propertyId: projectEnv.cmsPropertyId,
  environment: projectEnv.cmsEnvironment
};

export const CMSProvider = new CoreContentManagementSystemProvider(
  providerConfiguration
);

export const kPromoImageKey = 'Banner-Promo-Image';
export const kPromoDescriptionKey = 'Banner-Promo-Description';
export const kPromoBackgroundColorKey = 'Background-Color';
export const kPromoTextColorKey = 'Text-Color';

export interface CMSSlotItemImage {
  height: number;
  path: ImageSourcePropType;
}

// CMS Slot Instance interface
export interface CMSBannerSlot {
  [kPromoImageKey]?: CMSSlotItemImage;
  [kPromoDescriptionKey]: string;
  [kPromoBackgroundColorKey]?: string;
  [kPromoTextColorKey]: string;
}

export interface CMSValueSlot {
  Value?: string;
}

// Or this with other slot types once they are added
export type CMSSlot = CMSBannerSlot | CMSValueSlot;

// CMS instance that can be used as a prop for some Pirate components
export const CMS = new ContentManagementSystem(CMSProvider);

interface CmsInstances {
  instances: CMSSlot[];
}

export async function fetchCMS(
  group: string,
  slot: string,
  identifier?: string
): Promise<CMSSlot[]> {
  try {
    const result = await CMS.contentForSlot(group, slot, identifier) as CmsInstances;
    if (result && result.instances) {
      return result.instances;
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
