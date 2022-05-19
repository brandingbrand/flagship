import type { Config, UsageDescriptionIOS } from '../types';

import * as fs from './fs';
import * as path from './path';

/**
 *
 * @param config
 * @param usageDescriptions
 */
export const add = (config: Config, usageDescriptions: UsageDescriptionIOS[]): void => {
  const infoPlist = path.ios.infoPlistPath(config);

  for (const usage of usageDescriptions) {
    if (fs.doesKeywordExist(infoPlist, usage.key)) {
      // Replace the existing usage description for this key
      if (usage.array) {
        const stringArray = usage.array.map((res) => `<string>${res}</string>`);
        fs.update(
          infoPlist,
          new RegExp(
            `<key>${usage.key}<\\/key>\\s*<array>\\s*(<string>[^<]+<\\/string>\\s*){0,}<\\/array>`
          ),
          `<key>${usage.key}</key><array>${stringArray}</array>`
        );
      } else {
        fs.update(
          infoPlist,
          new RegExp(`<key>${usage.key}<\\/key>\\s*<string>[^<]+<\\/string>`),
          `<key>${usage.key}</key><string>${usage.string}</string>`
        );
      }
    } else {
      // This key doesn't exist so add it to the file
      if (usage.array) {
        const stringArray = usage.array.map((res) => `<string>${res}</string>`);
        fs.update(
          infoPlist,
          '<key>UIRequiredDeviceCapabilities</key>',
          `<key>${usage.key}</key>` +
            `<array>${stringArray.join('')}</array>` +
            `<key>UIRequiredDeviceCapabilities</key>`
        );
      } else {
        fs.update(
          infoPlist,
          '<key>UIRequiredDeviceCapabilities</key>',
          `<key>${usage.key}</key><string>${usage.string}</string><key>UIRequiredDeviceCapabilities</key>`
        );
      }
    }
  }
};
