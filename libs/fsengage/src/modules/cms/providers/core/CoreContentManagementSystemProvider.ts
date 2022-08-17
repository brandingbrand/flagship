import FSNetwork from '@brandingbrand/fsnetwork';

import type { Location } from '../../requesters/ContentManagementSystemLocator';
import type { ContentManagementSystemContext } from '../ContentManagementSystemProvider';
import ContentManagementSystemProvider from '../ContentManagementSystemProvider';
import type { ContentManagementSystemProviderConfiguration } from '../types/ContentManagementSystemProviderConfiguration';
import { ContentManagementSystemEnvironment } from '../types/ContentManagementSystemProviderConfiguration';

import {
  targetInstancesByCity,
  targetInstancesByCountry,
  targetInstancesByDate,
  targetInstancesByPostalCode,
  targetInstancesByRegion,
  targetInstancesByState,
  targetInstancesByTimeOfDay,
  targetInstancesByTimeZone,
} from './targets';

/**
 * Logs and rethrows a given error.
 *
 * @param error An error to log and rethrow
 * @throws Always throws the error passed to the function.
 */
const logAndRethrowError = (error: Error): void => {
  console.warn(`CoreContentManagementSystemProvider\nError: ${error}`);

  throw error;
};

export default class CoreContentManagementSystemProvider extends ContentManagementSystemProvider {
  constructor(configuration: ContentManagementSystemProviderConfiguration) {
    super(configuration);

    let baseURL;

    baseURL =
      configuration.environment === ContentManagementSystemEnvironment.PROD
        ? this.productionBaseEndpoint
        : this.developmentBaseEndpoint;

    this.network = new FSNetwork({ baseURL });
    this.cache = {};
    this.maxAge = 0;
  }

  private readonly productionBaseEndpoint: string = 'https://cdn.brandingbrand.com';
  private readonly developmentBaseEndpoint: string = 'https://cms-dsg-new.s3.amazonaws.com';
  private readonly network: FSNetwork;
  private cache: Record<string, Promise<unknown>>;
  private maxAge: number;

  private currentInstances(content: any): unknown[] {
    let instances = (content && content.instances) || [];

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
    instancesToTarget: unknown[],
    targets: any,
    context?: ContentManagementSystemContext
  ): Promise<any[]> {
    if (!targets || targets.length === 0) {
      return instancesToTarget;
    }

    let location: Location;

    if (context) {
      try {
        location = await context.locator.getCurrentLocation();
      } catch (error) {
        if (__DEV__) {
          console.log(
            `%CoreContentManagementSystemProvider\n%c Function: ${this.targetInstances.name}\n Error:`,
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
      .filter(
        (instance) =>
          targetInstancesByCity(instance, targets, location) &&
          targetInstancesByCountry(instance, targets, location) &&
          targetInstancesByPostalCode(instance, targets, location) &&
          targetInstancesByRegion(instance, targets, location) &&
          targetInstancesByState(instance, targets, location) &&
          targetInstancesByTimeOfDay(instance, targets) &&
          targetInstancesByTimeZone(instance, targets)
      )
      .filter(Boolean);

    return instancesToTarget;
  }

  private async pullContent(): Promise<any> {
    const propertyId = encodeURIComponent(this.propertyId);
    const path = `/prod/property${propertyId}/cms/${this.environment}.json`;

    if (!this.cache[path] || Date.now() > this.maxAge) {
      this.cache[path] = this.network.get(path).catch((error) => {
        delete this.cache[path];

        throw error;
      });
      this.maxAge = Date.now() + 900000; // 15m
    }

    return this.cache[path];
  }

  public async contentForSlot(
    group: string,
    slot: string,
    identifier?: string,
    context?: ContentManagementSystemContext
  ): Promise<Record<string, any>> {
    return this.pullContent()
      .then((content) => {
        const slotContent =
          content && content.data && content.data[group] && content.data[group][slot];

        if (slotContent) {
          // Copy slotContent to a new object so we don't mutate
          // the cache and cause future lookups to fail
          const mutableContent = { ...slotContent };

          if (mutableContent.instantiable && identifier) {
            mutableContent.instances = mutableContent.instances[identifier] || [];
          }

          const currentInstances = this.currentInstances(mutableContent);

          return this.targetInstances(currentInstances, content.data._Targets, context).then(
            (instances) => {
              // Overrides the original instances with the valid ones.
              mutableContent.instances = instances;

              return mutableContent;
            }
          );
        }

        // There is no content for this slot
        return null;
      })
      .catch(logAndRethrowError);
  }

  public async identifiersForSlot(group: string, slot: string): Promise<string[] | null> {
    return this.pullContent()
      .then((content: any): string[] | null => {
        const slotContent =
          content && content.data && content.data[group] && content.data[group][slot];

        if (slotContent && slotContent.instantiable) {
          return Object.keys(slotContent.instances);
        }

        return null;
      })
      .catch((error: Error) => {
        console.log(`Error getting identifiers for group ${group} slot ${slot}`, error);

        return null;
      });
  }

  public async contentForGroup(group: string): Promise<any | null> {
    return this.pullContent()
      .then((content: any): any | null => content && content.data && content.data[group])
      .catch(logAndRethrowError);
  }
}
