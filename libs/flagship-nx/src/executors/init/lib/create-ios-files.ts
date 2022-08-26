import type { Tree } from '@nrwl/devkit';
import { generateFiles, joinPathFragments, readJson } from '@nrwl/devkit';
import { mustBeValid, validate } from 'json-schema';
import { dirname } from 'path';
import type { PackageJson } from 'type-fest';
import xcode from 'xcode';

import type { AppExtension, FlagshipPluginJson } from '../../../models';

import { deleteDiff } from './delete-diff';
import type { IosPermissionKeys } from './permissions';
import { iosPermissionsMetadata } from './permissions';
import { addGroupToRoot } from './utils/add-group-to-root.util';
import { findPackageJson } from './utils/find-package-json.util';
import { flushTree } from './utils/flush-tree.util';
import { mapValues } from './utils/map-values.util';
import { writeRecursive } from './write-recursive';

export interface ExtensionOptions {
  appExtension: string;
  bundleIdentifier: string;
  profile?: string;
  entitlements?: string;
  options?: object;
}

export interface CreateIosFilesOptions {
  projectRoot: string;
  rootOffset: string;
  className: string;
  constantName: string;
  fileName: string;
  name: string;
  propertyName: string;
  main: string;
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
  entitlementsFile?: string;
  dependencies: string[];
  buildConfig?: {
    exportTeamId: string;
    appleCert: string;
    profilesDir: string;
    distCert: string;
    distP12: string;
    provisioningProfileName: string;
  };

  appExtensions?: Record<string, ExtensionOptions>;
}

const addFiles = (
  tree: Tree,
  options: CreateIosFilesOptions,
  podsPath: string,
  iosRoot: string
): void => {
  const permissionPods = (Object.keys(options.permissions ?? {}) as IosPermissionKeys[]).map(
    (permission) => iosPermissionsMetadata[permission].pod
  );

  const permissionDescriptors = (
    Object.entries(options.permissions ?? {}) as Array<[IosPermissionKeys, string]>
  ).map(([permission, description]) => ({
    key: iosPermissionsMetadata[permission].usageDescriptionKey,
    value: description,
  }));

  tree.delete(podsPath);

  generateFiles(tree, joinPathFragments(__dirname, '../files/ios'), iosRoot, {
    ...options,
    permissionPods,
    permissionDescriptors,
  });
};

const addAppIcon = (tree: Tree, options: CreateIosFilesOptions, projectPath: string): void => {
  if (options.appIcon !== undefined) {
    const appIconPath = joinPathFragments(projectPath, 'Images.xcassets', 'AppIcon.appiconset');
    deleteDiff(tree, options.appIcon, appIconPath);
    writeRecursive(tree, options.appIcon, appIconPath);
  }
};

const addLaunchScreen = (tree: Tree, options: CreateIosFilesOptions, projectPath: string): void => {
  if (options.launchScreen !== undefined) {
    const launchScreenImagesPath = joinPathFragments(projectPath, 'LaunchImages.xcassets');
    const launchScreenTemplatePath = joinPathFragments(
      options.launchScreen,
      'LaunchImages.xcassets'
    );

    // eslint-disable-next-line security/detect-non-literal-fs-filename -- Local CLI
    if (tree.exists(launchScreenTemplatePath)) {
      deleteDiff(tree, launchScreenTemplatePath, launchScreenImagesPath);
      writeRecursive(tree, launchScreenTemplatePath, launchScreenImagesPath);
    }

    const launchScreenStoryboardPath = joinPathFragments(projectPath, 'LaunchScreen.storyboard');
    const launchScreenStoryboardTemplatePath = joinPathFragments(
      options.launchScreen,
      'LaunchScreen.storyboard'
    );

    const storyboard = tree.read(launchScreenStoryboardTemplatePath);
    if (storyboard) {
      tree.write(launchScreenStoryboardPath, storyboard);
    }
  }
};

const addEntitlements = (tree: Tree, options: CreateIosFilesOptions, projectPath: string): void => {
  if (options.entitlementsFile !== undefined) {
    const entitlementsPath = joinPathFragments(projectPath, `${options.className}.entitlements`);
    const entitlementsTemplatePath = joinPathFragments(options.entitlementsFile);

    const entitlements = tree.read(entitlementsTemplatePath);
    if (entitlements) {
      tree.write(entitlementsPath, entitlements);
    }
  }
};

const addScripts = (tree: Tree, options: CreateIosFilesOptions, iosRoot: string): void => {
  if (options.buildConfig?.appleCert !== undefined) {
    const { appleCert, distCert, distP12, profilesDir } = options.buildConfig;

    generateFiles(
      tree,
      joinPathFragments(__dirname, '../files/scripts/ios'),
      joinPathFragments(iosRoot),
      {
        appleCert,
        distCert,
        distP12,
        profilesDir,
      }
    );
  }
};

type AppExtensions = Record<
  string,
  Omit<ExtensionOptions, 'appExtension'> & { root: string; appExtension: AppExtension }
>;

const readAppExtensions = (tree: Tree, options: CreateIosFilesOptions): AppExtensions =>
  mapValues(options.appExtensions ?? {}, (appExtensionOptions) => {
    const [packageName, appExtensionName] = appExtensionOptions.appExtension.split(':');
    if (packageName === undefined || appExtensionName === undefined) {
      throw new Error('Invalid appExtension string format.');
    }

    const packageJsonPath = findPackageJson(tree, packageName);
    const packageJson = readJson<PackageJson & { flagship?: string }>(tree, packageJsonPath);
    const root = dirname(packageJsonPath);

    if (packageJson.flagship === undefined) {
      throw new Error(
        `${packageName} is not a flagship plugin (flagship key missing from package.json)`
      );
    }

    const flagshipConfig = readJson<FlagshipPluginJson>(
      tree,
      joinPathFragments(root, packageJson.flagship)
    );

    const appExtension = flagshipConfig.ios.appExtensions[appExtensionName];

    if (appExtension === undefined) {
      throw new Error(`${packageName} does not include App Extension for ${appExtensionName}`);
    }

    return {
      ...appExtensionOptions,
      root,
      appExtension,
    };
  });

const defaultAppExtensionBuildSettings = {
  /* eslint-disable @typescript-eslint/naming-convention -- XCode Variables */
  OTHER_LDFLAGS: '("$(inherited)", "-ObjC", "-lc++")',
  ENABLE_BITCODE: 'NO',
  CODE_SIGN_IDENTITY: '"iPhone Distribution"',
  /* eslint-enable */
};

const configureAppExtensionBuildSettings = (
  tree: Tree,
  project: xcode.XCodeproject,
  appExtensionOptions: AppExtensions[string],
  options: CreateIosFilesOptions,
  name: string,
  targetName: string,
  appExtensionRoot: string
  /*
    eslint-disable-next-line max-params --
    There are simply a lot of aspects to know when adding build settings
  */
): void => {
  for (const buildConfiguration of ['Release', 'Debug']) {
    for (const [buildSetting, value] of Object.entries(defaultAppExtensionBuildSettings)) {
      project.updateBuildProperty(buildSetting, value, buildConfiguration, targetName);
    }

    const profile = appExtensionOptions.profile ?? options.buildConfig?.provisioningProfileName;
    if (profile !== undefined) {
      project.updateBuildProperty(
        'PROVISIONING_PROFILE_SPECIFIER',
        `"${profile}"`,
        buildConfiguration,
        targetName
      );
    }

    if (options.buildConfig?.exportTeamId !== undefined) {
      project.updateBuildProperty(
        `DEVELOPMENT_TEAM`,
        options.buildConfig.exportTeamId,
        buildConfiguration,
        targetName
      );
    }

    if (appExtensionOptions.entitlements !== undefined) {
      const entitlementsFile = tree.read(appExtensionOptions.entitlements);
      if (entitlementsFile) {
        const entitlementsFileName = `${name}.entitlements`;
        tree.write(joinPathFragments(appExtensionRoot, entitlementsFileName), entitlementsFile);
        project.updateBuildProperty(
          `CODE_SIGN_ENTITLEMENTS`,
          `${joinPathFragments(name, entitlementsFileName)}`,
          buildConfiguration,
          targetName
        );
      }
    }
  }
};

const addAppExtension = (
  tree: Tree,
  options: CreateIosFilesOptions,
  appExtensions: AppExtensions,
  iosRoot: string
): void => {
  flushTree(tree);

  const xcodeProjectPath = joinPathFragments(
    iosRoot,
    `${options.className}.xcodeproj`,
    'project.pbxproj'
  );
  const project = xcode.project(xcodeProjectPath);
  project.parseSync();

  for (const [name, appExtensionOptions] of Object.entries(appExtensions)) {
    const appExtensionRoot = joinPathFragments(iosRoot, name);

    const templatePath = joinPathFragments(
      appExtensionOptions.root,
      appExtensionOptions.appExtension.files
    );
    const schemaPath = joinPathFragments(
      appExtensionOptions.root,
      appExtensionOptions.appExtension.schema
    );

    const optionsValidation = validate(
      appExtensionOptions.options ?? {},
      readJson(tree, schemaPath)
    );
    mustBeValid(optionsValidation);

    generateFiles(tree, templatePath, appExtensionRoot, {
      appName: options.className,
      bundleIdentifier: appExtensionOptions.bundleIdentifier,
      shortVersion: options.shortVersion,
      bundleVersion: options.bundleVersion,
      ...appExtensionOptions.options,
    });

    const infoPlistSource = joinPathFragments(
      appExtensionRoot,
      appExtensionOptions.appExtension.infoPlist
    );
    const infoPlist = tree.read(infoPlistSource);
    tree.delete(infoPlistSource);

    if (infoPlist) {
      const infoPlistDestination = joinPathFragments(appExtensionRoot, `${name}-Info.plist`);
      tree.write(infoPlistDestination, infoPlist);
    }

    const files = tree
      .children(templatePath)
      .map((file) => file.replace(/.template$/, ''))
      .map((file) => file.replace(appExtensionOptions.appExtension.infoPlist, `${name}-Info.plist`))
      .map((file) => joinPathFragments(name, file));

    const extGroup = project.addPbxGroup(files, name, name);
    addGroupToRoot(project, options, extGroup);

    const target = project.addTarget(
      name,
      'app_extension',
      name,
      appExtensionOptions.bundleIdentifier
    );

    const sourceFiles = files.filter((file) => file.endsWith('.m'));
    project.addBuildPhase(sourceFiles, 'PBXSourcesBuildPhase', 'Sources', target.uuid);
    project.addBuildPhase([], 'PBXFrameworksBuildPhase', 'Frameworks', target.uuid);

    for (const framework of appExtensionOptions.appExtension.frameworks) {
      project.addFramework(framework, { target: target.uuid, customFramework: true, embed: true });
    }

    configureAppExtensionBuildSettings(
      tree,
      project,
      appExtensionOptions,
      options,
      name,
      target.pbxNativeTarget.name,
      appExtensionRoot
    );
  }

  tree.write(xcodeProjectPath, project.writeSync());
};

export const createIosFiles = (tree: Tree, options: CreateIosFilesOptions): void => {
  const iosRoot = joinPathFragments(options.projectRoot, 'ios');
  const podsPath = joinPathFragments(iosRoot, 'Pods');
  const projectPath = joinPathFragments(iosRoot, options.className);
  const appExtensions = readAppExtensions(tree, options);

  addFiles(tree, options, podsPath, iosRoot);
  addAppIcon(tree, options, projectPath);
  addLaunchScreen(tree, options, projectPath);
  addEntitlements(tree, options, projectPath);
  addScripts(tree, options, iosRoot);

  addAppExtension(tree, options, appExtensions, iosRoot);
};
