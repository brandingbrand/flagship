import { generateFiles, Tree } from '@nrwl/devkit';
import { join } from 'path';

import { deleteDiff } from './delete-diff';
import { IosPermissionKeys, iosPermissionsMetadata } from './permissions';
import { writeRecursive } from './write-recursive';

export interface CreateIosFilesOptions {
  projectRoot: string;
  rootOffset: string;
  className: string;
  constantName: string;
  fileName: string;
  name: string;
  propertyName: string;
  mainPath: string;
  development: boolean;
  nativeConstants: Record<string, string>;
  shortVersion: string;
  bundleVersion: string;
  bundleIdentifier: string;
  defaultEnvironment: string;
  exceptionDomains: string[];
  urlSchemes: string[];
  permissions?: Record<IosPermissionKeys, string>;
  appIcon?: string;
  launchScreen?: string;
}

export const createIosFiles = (tree: Tree, options: CreateIosFilesOptions) => {
  const iosRoot = join(options.projectRoot, 'ios');
  const podsPath = join(iosRoot, 'Pods');
  const projectPath = join(iosRoot, options.className);

  const permissionPods = (Object.keys(options.permissions ?? {}) as IosPermissionKeys[]).map(
    (permission) => iosPermissionsMetadata[permission].pod
  );

  const permissionDescriptors = (
    Object.entries(options.permissions ?? {}) as [IosPermissionKeys, string][]
  ).map(([permission, description]) => ({
    key: iosPermissionsMetadata[permission].usageDescriptionKey,
    value: description,
  }));

  tree.delete(podsPath);

  generateFiles(tree, join(__dirname, '../files/ios'), iosRoot, {
    ...options,
    permissionPods,
    permissionDescriptors,
  });

  if (options.appIcon) {
    const appIconPath = join(projectPath, 'Images.xcassets', 'AppIcon.appiconset');
    deleteDiff(tree, options.appIcon, appIconPath);
    writeRecursive(tree, options.appIcon, appIconPath);
  }

  if (options.launchScreen) {
    const launchScreenImagesPath = join(projectPath, 'LaunchImages.xcassets');
    const launchScreenTemplatePath = join(options.launchScreen, 'LaunchImages.xcassets');

    if (tree.exists(launchScreenTemplatePath)) {
      deleteDiff(tree, launchScreenTemplatePath, launchScreenImagesPath);
      writeRecursive(tree, launchScreenTemplatePath, launchScreenImagesPath);
    }

    const launchScreenStoryboardPath = join(projectPath, 'LaunchScreen.storyboard');
    const launchScreenStoryboardTemplatePath = join(
      options.launchScreen,
      'LaunchScreen.storyboard'
    );

    const storyboard = tree.read(launchScreenStoryboardTemplatePath);
    if (storyboard) {
      tree.write(launchScreenStoryboardPath, storyboard);
    }
  }
};
