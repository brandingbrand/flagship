import type { Tree } from '@nrwl/devkit';
import { generateFiles, joinPathFragments, names } from '@nrwl/devkit';

import type { PlatformSpecific } from './platform';
import { android, ios } from './platform';

export interface CreateFastlaneFilesOptions {
  projectRoot: string;
  className: string;
  shortVersion: string;
  versionName: string;
  organization: string;
  bundleIdentifier: PlatformSpecific<string> | string;
  appName: PlatformSpecific<string>;
  ios?: {
    exportMethod: string;
    exportTeamId: string;
    appleCert: string;
    profilesDir: string;
    distCert: string;
    distP12: string;
    provisioningProfileName: string;
  };
  iosAppExtensions?: Record<string, { bundleIdentifier: string; profile?: string }>;
  android?: {
    storeFile: string;
    keyAlias: string;
  };
  dependencies: string[];
}

export const createFastlaneFiles = (tree: Tree, options: CreateFastlaneFilesOptions): void => {
  const { appName, bundleIdentifier, ...otherOptions } = options;

  if (otherOptions.ios) {
    const defualtProfile = otherOptions.ios.provisioningProfileName;
    const provisioningProfiles = [
      {
        bundleIdentifier: ios(bundleIdentifier),
        profile: defualtProfile,
      },
      ...Object.values(otherOptions.iosAppExtensions ?? {}).map((appExtension) => ({
        bundleIdentifier: appExtension.bundleIdentifier,
        profile: appExtension.profile ?? defualtProfile,
      })),
    ];

    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/fastlane/ios'),
      joinPathFragments(options.projectRoot, 'ios'),
      {
        bundleIdentifier: ios(bundleIdentifier),
        appName: ios(appName),
        provisioningProfiles,
        ...otherOptions,
      }
    );
  }

  if (otherOptions.android) {
    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/fastlane/android'),
      joinPathFragments(options.projectRoot, 'android'),
      {
        bundleIdentifier: android(bundleIdentifier),
        appName: android(appName),
        ...otherOptions,
      }
    );
  }
};
