import FSNetwork from '@brandingbrand/fsnetwork';

import {
  ContentManagementSystemEnvironment,
  ContentManagementSystemProviderConfiguration
} from '../types/ContentManagementSystemProviderConfiguration';

import ContentManagementSystemProvider, {
  ContentManagementSystemContext
} from '../ContentManagementSystemProvider';

import {
  targetInstancesByCity,
  targetInstancesByCountry,
  targetInstancesByDate,
  targetInstancesByPostalCode,
  targetInstancesByRegion,
  targetInstancesByState,
  targetInstancesByTimeOfDay,
  targetInstancesByTimeZone
} from './targets';

import { Location } from '../../requesters/ContentManagementSystemLocator';
import { Dictionary } from '@brandingbrand/fsfoundation';

/**
 * Logs and rethrows a given error.
 *
 * @param {Error} error An error to log and rethrow
 * @throws Always throws the error passed to the function.
 */
function logAndRethrowError(error: Error): void {
  console.warn(`CoreContentManagementSystemProvider\nError: ${error}`);

  throw error;
}

export default class CoreContentManagementSystemProvider extends ContentManagementSystemProvider {
  private readonly productionBaseEndpoint: string = 'https://cdn.brandingbrand.com';
  private readonly developmentBaseEndpoint: string = 'https://cms-dsg-new.s3.amazonaws.com';
  private network: FSNetwork;
  private cache: { [key: string]: Promise<any> };

  constructor(configuration: ContentManagementSystemProviderConfiguration) {
    super(configuration);

    let baseURL;

    // tslint:disable-next-line
    if (configuration.environment === ContentManagementSystemEnvironment.PROD) {
      baseURL = this.productionBaseEndpoint;
    } else {
      baseURL = this.developmentBaseEndpoint;
    }

    this.network = new FSNetwork({ baseURL });
    this.cache = {};
  }

  async contentForSlot(
    group: string, slot: string, identifier?: string, context?: ContentManagementSystemContext
  ): Promise<Dictionary> {
    return this.pullContent()
      .then(content => {
        const slotContent = content &&
          content.data &&
          content.data[group] &&
          content.data[group][slot];

        if (slotContent) {
          // Copy slotContent to a new object so we don't mutate
          // the cache and cause future lookups to fail
          const mutableContent = { ...slotContent };

          if (mutableContent.instantiable) {
            if (identifier) {
              mutableContent.instances = mutableContent.instances[identifier] || {};
            }
          }

          const currentInstances = this.currentInstances(mutableContent);

          return this.targetInstances(currentInstances, content.data._Targets, context)
            .then(instances => {
              // Overrides the original instances with the valid ones.
              mutableContent.instances = instances;

              return mutableContent;
            });
        }

        // There is no content for this slot
        return null;
      })
      .catch(logAndRethrowError);
  }

  async identifiersForSlot(group: string, slot: string): Promise<string[] | null> {
    return this.pullContent()
      .then((content: any): string[] | null => {
        const slotContent = content &&
          content.data &&
          content.data[group] &&
          content.data[group][slot];

        if (slotContent && slotContent.instantiable) {
          return Object.keys(slotContent.instances);
        }

        return null;
      })
      .catch((e: Error) => {
        console.log(`Error getting identifiers for group ${group} slot ${slot}`, e);

        return null;
      });
  }


  private currentInstances(content: any): any[] {
    let instances = content && content.instances || {};

    // filter by campaign start/end date first
    instances = targetInstancesByDate(instances);

    let currentInstances = [];
    let overwrite = false;
    let overwriteCampaign;

    // Processes instances in order
    for (const instance of instances) {
      if (!overwrite) {
        if (instance.overwrite) {
          overwrite = true;
          overwriteCampaign = instance.campaign;

          // Replace any current instances with the overwriting instances.
          currentInstances = [];
        }

        currentInstances.push(instance);
      } else if (instance.campaign === overwriteCampaign) {
        currentInstances.push(instance);
      }
    }

    return currentInstances;
  }

  private async targetInstances(
    instancesToTarget: any[], targets: any, context?: ContentManagementSystemContext
  ): Promise<any[]> {
    if (!targets || !targets.length) {
      return Promise.resolve(instancesToTarget);
    }

    let location: Location;

    if (context) {
      try {
        location = await context.locator.getCurrentLocation();
      } catch (error) {
        if (__DEV__) {
          console.log(
            `%CoreContentManagementSystemProvider\n%c Function: ${
            this.targetInstances.name
            }\n Error: `,
            'color: blue',
            'color: grey',
            error
          );
        }

        return Promise.reject(error);
      }
    }

    // Checks if instances meet campaigns and individual targets.
    instancesToTarget = instancesToTarget
      .filter(instance => {
        return targetInstancesByCity(instance, targets, location) &&
          targetInstancesByCountry(instance, targets, location) &&
          targetInstancesByPostalCode(instance, targets, location) &&
          targetInstancesByRegion(instance, targets, location) &&
          targetInstancesByState(instance, targets, location) &&
          targetInstancesByTimeOfDay(instance, targets) &&
          targetInstancesByTimeZone(instance, targets);
      })
      .filter(Boolean);

    return Promise.resolve(instancesToTarget);
  }

  private async pullContent(): Promise<any> {
    const propertyId = encodeURIComponent(this.propertyId);
    const path = `/prod/property${propertyId}/cms/${this.environment}.json`;

    if (!this.cache[path]) {
      this.cache[path] = this.network.get(path).catch(error => {
        delete this.cache[path];

        throw error;
      });
    }

    return this.cache[path];
  }
}
