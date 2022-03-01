import { formatFiles, getPackageManagerCommand, readJson, writeJson } from '@nrwl/devkit';
import { run } from '@nrwl/tao/src/commands/run';
import { flushChanges, FsTree } from '@nrwl/tao/src/shared/tree';
import { Workspace, Workspaces } from '@nrwl/tao/src/shared/workspace';
import { execSync } from 'child_process';

import { CommitMessage } from '@brandingbrand/git';

import { join } from 'path';

import { ShipConfig, ShipProjectOptions } from '../configs/ship.config';
import { sortObject } from '../utils/sort-object.util';

import { Phase } from './phase';

interface NxJson {
  defaultProject?: string;
}

interface PackageJson {
  name: string;
  version?: string;
  private?: boolean;
  engines?: Record<string, string>;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

interface PackageLockJson {
  packages: Record<
    string,
    {
      name?: string;
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    }
  >;
  dependencies: Record<string, unknown>;
}

interface TsConfigJson {
  compilerOptions?: {
    paths?: Record<string, string[]>;
  };
}

interface WorkspaceJson {
  projects: Record<string, { targets?: Record<string, unknown> }>;
  [key: string]: unknown;
}

const sortPackageJson = ({
  name,
  version,
  private: isPrivate,
  engines,
  scripts,
  dependencies,
  devDependencies,
  ...other
}: PackageJson): PackageJson => ({
  name,
  version,
  private: isPrivate,
  engines,
  scripts,
  dependencies: sortObject(dependencies ?? {}),
  devDependencies: sortObject(devDependencies ?? {}),
  ...other,
});

const webAliases: Record<string, string[]> = {
  'react-native-svg': ['svgs'],
  'react-native': ['react-native-web', '@react-native-community/datetimepicker'],
  'react-native-linear-gradient': ['react-native-web-linear-gradient'],
  'react-native-webview': ['react-native-web-webview'],
};

const installCommand = `${getPackageManagerCommand().install} --silent --ignore-scripts`;

export const isForcedDependency = (dependency: string) => {
  return dependency === 'tslib' || dependency === 'react-native-vector-icons';
};

// eslint-disable-next-line complexity
const isForcedDevDependency = (dependency: string) => {
  return (
    dependency.startsWith('@nrwl') ||
    dependency.startsWith('@commitlint') ||
    dependency.startsWith('@commitlint') ||
    dependency.startsWith('storybook') ||
    dependency === 'husky' ||
    dependency === 'ts-dedent' ||
    dependency === 'inquirer' ||
    dependency === '@types/inquirer' ||
    dependency === '@nstudio/nps-i' ||
    dependency === 'npm-run-all' ||
    dependency === 'nps' ||
    dependency === 'patch-package' ||
    dependency === 'typescript' ||
    dependency === 'prettier' ||
    dependency.includes('eslint') ||
    dependency.includes('jest') ||
    dependency === 'cypress' ||
    dependency === 'detox' ||
    dependency === '@jscutlery/semver' ||
    dependency === 'ts-jest' ||
    dependency === 'ts-node' ||
    dependency.includes('metro') ||
    dependency.startsWith('@react-native-community/cli') ||
    dependency === 'react-native-svg-transformer' ||
    dependency === 'jetifier' ||
    dependency === 'jsc-android' ||
    dependency === 'cz-customizable'
  );
};

export class PostProcessPhase implements Phase {
  constructor(private readonly config: ShipConfig) {}
  public readonly readableName = 'Post process repository';

  private cleanNxJson(sourceTree: FsTree, sourceWorkspace: Workspace, destinationTree: FsTree) {
    const nxJson = readJson<NxJson>(sourceTree, 'nx.json');

    if ('project' in this.config.options) {
      nxJson.defaultProject = this.config.options.project;
    } else if (nxJson.defaultProject) {
      const project = sourceWorkspace.projects[nxJson.defaultProject];

      if (
        !project ||
        this.config.excludedProjectsFilter({ ...project, name: nxJson.defaultProject })
      ) {
        delete sourceWorkspace.projects[nxJson.defaultProject];
      }
    }

    writeJson(destinationTree, 'nx.json', nxJson);
  }

  private cleanPackageLockJson(
    sourceTree: FsTree,
    sourceWorkspace: Workspace,
    destinationTree: FsTree
  ) {
    const packageLockJson = readJson<PackageLockJson>(sourceTree, 'package-lock.json');

    // To remove the `file:package` references we need to
    // remove internal packages from the package-lock.json
    for (const dependency of Object.keys(packageLockJson.packages)) {
      if (dependency && !dependency.includes('node_modules')) {
        const { name } = packageLockJson.packages[dependency];
        if (name) {
          const [projectName] = name.split('/').reverse();
          const project = sourceWorkspace.projects[projectName];
          if (this.config.excludedProjectsFilter({ ...project, name: projectName })) {
            delete packageLockJson.packages[dependency];
            delete packageLockJson.packages[`node_modules/${name}`];
            delete packageLockJson.dependencies[name];
          }
        }
      }
    }

    writeJson(destinationTree, 'package-lock.json', packageLockJson);
  }

  private cleanPackageJsonForWorkspace(
    sourceTree: FsTree,
    sourceWorkspace: Workspace,
    destinationTree: FsTree
  ) {
    const packageJson = readJson<PackageJson>(sourceTree, 'package.json');

    const dependencyKeys = ['dependencies', 'devDependencies'] as const;

    for (const dependencyKey of dependencyKeys) {
      if (dependencyKey in packageJson) {
        for (const dependency of Object.keys(packageJson[dependencyKey] ?? {})) {
          const version = packageJson[dependencyKey]?.[dependency];
          const project = Object.entries(sourceWorkspace.projects)
            .map(([name, project]) => ({ name, ...project }))
            .find(({ root }) => version?.includes(root));

          if (project && this.config.excludedProjectsFilter(project)) {
            delete (packageJson[dependencyKey] as Record<string, string>)[dependency];
          }
        }
      }
    }

    writeJson(destinationTree, 'package.json', sortPackageJson(packageJson));
  }

  // eslint-disable-next-line complexity
  private async cleanPackageJsonForProject(
    sourceTree: FsTree,
    destinationTree: FsTree,
    options: ShipProjectOptions
  ) {
    const packageJson = readJson<PackageJson>(sourceTree, 'package.json');

    const originalVersion = packageJson.version;
    const originalDependencies = packageJson.dependencies ?? {};
    const originalDevDependencies = packageJson.devDependencies ?? {};

    packageJson.version = '0.0.1';
    packageJson.dependencies = {};
    packageJson.devDependencies = {};

    for (const dependency of options.dependencies) {
      // Ignore any workspace dependencies, those will be handled
      // after the first pass. This is to fix any references to
      // `file:package` versions
      if (!options.workspace.includes(dependency)) {
        if (dependency in originalDependencies) {
          packageJson.dependencies[dependency] = originalDependencies[dependency];
        }

        if (dependency in originalDevDependencies) {
          packageJson.devDependencies[dependency] = originalDevDependencies[dependency];
        }

        // For any dependency that has a `@types` package
        // we will add that types package to devDependencies
        const typePackage = `@types/${dependency}`;
        if (typePackage in originalDependencies) {
          packageJson.devDependencies[typePackage] = originalDependencies[typePackage];
        }

        if (typePackage in originalDevDependencies) {
          packageJson.devDependencies[typePackage] = originalDevDependencies[typePackage];
        }

        // If we depend on any `react-native` dependencies
        // that have web aliases when using webpack, then
        // we will add those here
        if (dependency in webAliases) {
          const aliases = webAliases[dependency];
          for (const alias of aliases) {
            if (alias in originalDependencies) {
              packageJson.devDependencies[alias] = originalDependencies[alias];
            }

            if (alias in originalDevDependencies) {
              packageJson.devDependencies[alias] = originalDevDependencies[alias];
            }
          }
        }
      }
    }

    // Some dependencies are not caught by the Nx Project Graph
    // so here we will add a curated white list of dependencies
    for (const dependency of Object.keys({
      ...originalDependencies,
      ...originalDevDependencies,
    })) {
      if (isForcedDependency(dependency)) {
        delete packageJson.devDependencies[dependency];
        packageJson.dependencies[dependency] =
          originalDependencies[dependency] ?? originalDevDependencies[dependency];
      }

      if (isForcedDevDependency(dependency)) {
        delete packageJson.dependencies[dependency];
        packageJson.devDependencies[dependency] =
          originalDependencies[dependency] ?? originalDevDependencies[dependency];
      }
    }

    // Now that all the external dependencies are added we will
    // add the npm references to projects that were in this
    // repo
    for (const dependency of options.dependencies) {
      if (originalVersion && options.workspace.includes(dependency)) {
        // By convention any project ending with `-nx` is an nx
        // plugin and will be put in `devDependencies` instead
        // of `dependencies`
        if (dependency.endsWith('-nx')) {
          delete packageJson.dependencies[dependency];
          packageJson.devDependencies[dependency] = originalVersion;
        } else {
          delete packageJson.devDependencies[dependency];
          packageJson.dependencies[dependency] = originalVersion;
        }
      }
    }

    const projectPackageJsonPath = join(options.projectRoot, 'package.json');
    const projectPackageJson = readJson<PackageJson>(sourceTree, projectPackageJsonPath);
    projectPackageJson.version = '0.0.1';
    projectPackageJson.dependencies = {};

    for (const dependency of options.dependencies) {
      if (packageJson.dependencies[dependency] !== undefined) {
        const possibleIosPath = join('node_modules', dependency, 'ios');
        const possibleAndroidPath = join('node_modules', dependency, 'android');

        if (sourceTree.exists(possibleIosPath) || sourceTree.exists(possibleAndroidPath)) {
          projectPackageJson.dependencies[dependency] = '*';
        }
      }
    }

    writeJson(destinationTree, projectPackageJsonPath, projectPackageJson);
    writeJson(destinationTree, 'package.json', sortPackageJson(packageJson));
  }

  private cleanTsConfig(sourceTree: FsTree, sourceWorkspace: Workspace, destinationTree: FsTree) {
    const tsConfig = readJson<TsConfigJson>(sourceTree, 'tsconfig.base.json');

    if (tsConfig.compilerOptions?.paths) {
      for (const [name, [root]] of Object.entries(tsConfig.compilerOptions.paths ?? {})) {
        const [projectName, project] =
          Object.entries(sourceWorkspace.projects).find(([, project]) =>
            root.startsWith(project.root)
          ) ?? [];

        if (
          projectName &&
          project &&
          this.config.excludedProjectsFilter({ name: projectName, ...project })
        ) {
          delete tsConfig.compilerOptions.paths[name];
        }
      }
    }

    writeJson(destinationTree, 'tsconfig.base.json', tsConfig);
  }

  private cleanWorkspaceJson(
    sourceTree: FsTree,
    sourceWorkspace: Workspace,
    destinationTree: FsTree
  ) {
    const workspaceJson = readJson<WorkspaceJson>(sourceTree, 'workspace.json');
    for (const projectName of Object.keys(workspaceJson.projects)) {
      const project = sourceWorkspace.projects[projectName];
      if (!project || this.config.excludedProjectsFilter({ name: projectName, ...project })) {
        delete workspaceJson.projects[projectName];
      }
    }

    // The workspace project is unnecessary in
    // exported projects
    delete workspaceJson.projects.workspace;
    writeJson(destinationTree, 'workspace.json', workspaceJson);
  }

  private async syncDeps(
    destinationTree: FsTree,
    destinationWorkspace: Workspace,
    options: ShipProjectOptions
  ) {
    if ('sync-deps' in (destinationWorkspace.projects[options.project].targets ?? {})) {
      // This will populate the dependencies for react-native auto linking
      await run(
        destinationTree.root,
        destinationTree.root,
        [`${options.project}:sync-deps`],
        false
      );
    }
  }

  public async run(): Promise<void> {
    const sourceTree = new FsTree(this.config.sourceRepo.path, false);
    const destinationTree = new FsTree(this.config.destinationRepo.path, false);

    const sourceWorkspace = new Workspaces(sourceTree.root).readWorkspaceConfiguration();
    const destinationWorkspace = new Workspaces(destinationTree.root).readWorkspaceConfiguration();

    this.cleanNxJson(sourceTree, sourceWorkspace, destinationTree);
    this.cleanTsConfig(sourceTree, sourceWorkspace, destinationTree);
    this.cleanWorkspaceJson(sourceTree, sourceWorkspace, destinationTree);
    this.cleanPackageLockJson(sourceTree, sourceWorkspace, destinationTree);

    if ('project' in this.config.options) {
      await this.cleanPackageJsonForProject(sourceTree, destinationTree, this.config.options);
    } else {
      this.cleanPackageJsonForWorkspace(sourceTree, sourceWorkspace, destinationTree);
    }

    await formatFiles(destinationTree);
    flushChanges(destinationTree.root, destinationTree.listChanges());
    execSync(installCommand, { cwd: destinationTree.root });

    if ('project' in this.config.options) {
      await this.syncDeps(destinationTree, destinationWorkspace, this.config.options);
    }

    const message = new CommitMessage({
      type: 'chore',
      scope: 'release',
      subject: 'export workspace',
    });

    this.config.destinationRepo.stageAll().commit(message);
  }
}
