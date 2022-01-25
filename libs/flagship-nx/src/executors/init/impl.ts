import {
  ExecutorContext,
  names,
  formatFiles,
  readJson,
  offsetFromRoot,
  logger,
} from '@nrwl/devkit';
import { flushChanges, FsTree } from '@nrwl/tao/src/shared/tree';
import { ensureNodeModulesSymlink } from '@nrwl/react-native/src/utils/ensure-node-modules-symlink';
import { join } from 'path';
import { platform } from 'os';

import { link } from './lib/link';
import { removeExtension } from './lib/path';
import { bundleVersion } from './lib/version';
import { android, ios, PlatformSpecific } from './lib/platform';
import { AndroidPermissionKeys, IosPermissionKeys } from './lib/permissions';

import { createIosFiles } from './lib/create-ios-files';
import { createAndroidFiles } from './lib/create-android-files';
import { createFastlaneFiles } from './lib/create-fastlane-files';
import { podInstall, podRepoUpdate } from './lib/pod-install';

export interface InitExecutorOptions {
  main: string;
  packageJson: string;
  bundleIdentifier: string | PlatformSpecific<string>;
  development: boolean;
  defaultEnvironment: string;
  urlSchemes: string[];
  exceptionDomains: string[];

  activityAttributes?: Record<string, string>;
  applicationAttributes?: Record<string, string>;

  permissions: {
    android: AndroidPermissionKeys[];
    ios: Record<IosPermissionKeys, string>;
  };

  appIcon?: PlatformSpecific<string>;
  launchScreen?: PlatformSpecific<string>;

  appCenter?: {
    organization: string;
    appName: PlatformSpecific<string>;
  };

  buildConfig?: {
    ios?: {
      exportTeamId: string;
      appleCert: string;
      profilesDir: string;
      distCert: string;
      distP12: string;
      provisioningProfileName: string;
    };
    android?: {
      storeFile: string;
      keyAlias: string;
    };
  };
  passwords?: {
    android?: {
      storPassword: string;
      keyPassword: string;
    };
  };
}

interface PackageJson {
  version: string;
}

/**
 * This really should be a generator, but until the template is converted into
 * an nx generator this will have to be an executor
 */
export const initExecutor = async (
  options: InitExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> => {
  if (!context.projectName) {
    return { success: false };
  }

  try {
    const tree = new FsTree(context.root, false);
    const projectRoot = context.workspace.projects[context.projectName].root;
    const { version } = readJson<PackageJson>(tree, options.packageJson);

    const { className, constantName, fileName, name, propertyName } = names(context.projectName);
    const mainPath = removeExtension(options.main);
    const rootOffset = offsetFromRoot(projectRoot);

    const nativeConstants = {
      ...(options.development ? { ShowDevMenu: 'true' } : {}),
    };

    createIosFiles(tree, {
      projectRoot,
      rootOffset,
      className,
      constantName,
      fileName,
      name,
      propertyName,
      mainPath,
      nativeConstants,
      shortVersion: version,
      development: options.development,
      exceptionDomains: options.exceptionDomains,
      urlSchemes: options.urlSchemes,
      defaultEnvironment: options.defaultEnvironment,
      appIcon: ios(options.appIcon),
      launchScreen: ios(options.launchScreen),
      permissions: ios(options.permissions),
      bundleIdentifier: ios(options.bundleIdentifier),
      bundleVersion: bundleVersion(version),
    });

    createAndroidFiles(tree, {
      projectRoot,
      rootOffset,
      className,
      constantName,
      fileName,
      name,
      propertyName,
      mainPath,
      nativeConstants,
      shortVersion: version,
      main: options.main,
      development: options.development,
      exceptionDomains: options.exceptionDomains,
      urlSchemes: options.urlSchemes,
      defaultEnvironment: options.defaultEnvironment,
      appIcon: android(options.appIcon),
      launchScreen: android(options.launchScreen),
      permissions: android(options.permissions),
      bundleIdentifier: android(options.bundleIdentifier),
      buildConfig: android(options.buildConfig),
      passwords: android(options.passwords),
      bundleVersion: bundleVersion(version),
    });

    if (options.appCenter && options.buildConfig) {
      createFastlaneFiles(tree, {
        projectRoot,
        className,
        shortVersion: version,
        bundleIdentifier: options.bundleIdentifier,
        ...options.appCenter,
        ...options.buildConfig,
      });
    }

    await formatFiles(tree);
    flushChanges(context.root, tree.listChanges());
    ensureNodeModulesSymlink(context.root, projectRoot);

    await link(tree.root, projectRoot);
    if (platform() === 'darwin') {
      const iosFolder = join(projectRoot, 'ios');
      await podRepoUpdate(iosFolder);
      await podInstall(iosFolder);
    }
    return { success: true };
  } catch (error) {
    logger.error(error);
    return { success: false };
  }
};

export default initExecutor;
