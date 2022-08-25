import type { ExecutorContext } from '@nrwl/devkit';
import { formatFiles, logger, names, offsetFromRoot, readJson } from '@nrwl/devkit';
import { ensureNodeModulesSymlink } from '@nrwl/react-native/src/utils/ensure-node-modules-symlink';
import { FsTree, flushChanges } from '@nrwl/tao/src/shared/tree';
import { createProjectGraphAsync } from 'nx/src/project-graph/project-graph';
import { platform } from 'os';
import { join } from 'path';

import { createAndroidFiles } from './lib/create-android-files';
import { createFastlaneFiles } from './lib/create-fastlane-files';
import { createIosFiles } from './lib/create-ios-files';
import { findDependencies } from './lib/find-dependencies.util';
import { link } from './lib/link';
import { removeExtension } from './lib/path';
import type { AndroidPermissionKeys, IosPermissionKeys } from './lib/permissions';
import type { PlatformSpecific } from './lib/platform';
import { android, ios } from './lib/platform';
import { podInstall, podRepoUpdate } from './lib/pod-install';
import { bundleVersion } from './lib/version';

export interface InitExecutorOptions {
  main: string;
  packageJson: string;
  appName?: PlatformSpecific<string> | string;
  bundleIdentifier: PlatformSpecific<string> | string;

  /**
   * @deprecated In Flagship 12 this should be made to be required.
   */
  bundleVersion?: string;

  /**
   * @deprecated In Flagship 12 this should be made to be required.
   */
  versionCode?: number;

  development: boolean;
  defaultEnvironment: string;
  urlSchemes: string[];
  exceptionDomains: string[];

  googleServicesJson?: string;
  googleMapsApiKey?: string;

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
      exportMethod: string;
      exportTeamId: string;
      appleCert: string;
      profilesDir: string;
      distCert: string;
      distP12: string;
      provisioningProfileName: string;
      entitlementsFile?: string;
    };
    android?: {
      gradleVersion?: string;
      storeFile: string;
      keyAlias: string;
    };
  };

  androidPasswords?: {
    storePassword: string;
    keyPassword: string;
  };
}

interface PackageJson {
  version: string;
}

/**
 * This really should be a generator, but until the template is converted into
 * an nx generator this will have to be an executor
 *
 * @param options
 * @param context
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
    const projectRoot = context.workspace.projects[context.projectName]?.root ?? '.';
    const { version } = readJson<PackageJson>(tree, options.packageJson);

    const { className, constantName, fileName, name, propertyName } = names(context.projectName);
    const mainPath = removeExtension(options.main);
    const rootOffset = offsetFromRoot(projectRoot);

    const nativeConstants = {
      ...(options.development ? { ShowDevMenu: 'true' } : {}),
    };

    const graph = await createProjectGraphAsync();
    const dependencies = await findDependencies(tree, graph, context.projectName);

    createIosFiles(tree, {
      projectRoot,
      rootOffset,
      className,
      constantName,
      fileName,
      name: ios(options.appName) ?? name,
      propertyName,
      mainPath,
      nativeConstants,
      shortVersion: version,
      main: options.main,
      development: options.development,
      exceptionDomains: options.exceptionDomains,
      urlSchemes: options.urlSchemes,
      defaultEnvironment: options.defaultEnvironment,
      appIcon: ios(options.appIcon),
      launchScreen: ios(options.launchScreen),
      permissions: ios(options.permissions),
      bundleIdentifier: ios(options.bundleIdentifier),
      bundleVersion: ios(options.bundleVersion) ?? bundleVersion(version),
      entitlementsFile: options.buildConfig?.ios?.entitlementsFile,
      dependencies: [...dependencies.values()],
      buildConfig: options.buildConfig?.ios,
    });

    createAndroidFiles(tree, {
      projectRoot,
      rootOffset,
      className,
      constantName,
      fileName,
      name: android(options.appName) ?? name,
      propertyName,
      mainPath,
      nativeConstants,
      versionName: version,
      versionCode: android(options.versionCode) ?? Number.parseInt(bundleVersion(version), 10),
      main: options.main,
      development: options.development,
      exceptionDomains: options.exceptionDomains,
      urlSchemes: options.urlSchemes,
      defaultEnvironment: options.defaultEnvironment,
      googleServicesJson: options.googleServicesJson,
      googleMapsApiKey: options.googleMapsApiKey,
      appIcon: android(options.appIcon),
      launchScreen: android(options.launchScreen),
      permissions: android(options.permissions),
      bundleIdentifier: android(options.bundleIdentifier),
      buildConfig: android(options.buildConfig),
      passwords: options.androidPasswords,
      dependencies: [...dependencies.values()],
    });

    if (options.appCenter && options.buildConfig) {
      createFastlaneFiles(tree, {
        projectRoot,
        className,
        shortVersion: version,
        versionName: version,
        bundleIdentifier: options.bundleIdentifier,
        ...options.appCenter,
        ...options.buildConfig,
        dependencies: [...dependencies.values()],
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
