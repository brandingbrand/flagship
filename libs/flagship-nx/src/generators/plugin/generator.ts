import type { Tree } from '@nrwl/devkit';
import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  offsetFromRoot,
  updateJson,
} from '@nrwl/devkit';
import { getRootTsConfigPathInTree } from '@nrwl/workspace/src/utilities/typescript';
import * as path from 'path';
import type { TsConfigJson } from 'type-fest';

import type { PluginGeneratorSchema } from './schema';

export interface NormalizedSchema extends PluginGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  distDirectory: string;
  appExtension: string;
  appExtensionClass: string;
}

const normalizeOptions = (tree: Tree, options: PluginGeneratorSchema): NormalizedSchema => {
  const name = names(options.name).fileName;
  const projectDirectory =
    options.directory !== undefined ? `${names(options.directory).fileName}/${name}` : name;
  const projectName = projectDirectory.replace(/\//g, '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags =
    options.tags !== undefined ? options.tags.split(',').map((tag) => tag.trim()) : [];

  const distDirectory = path.join('dist', projectRoot);

  const { className: appExtensionClass, fileName: appExtension } = names(options.appExtensionName);

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    distDirectory,
    appExtension,
    appExtensionClass,
  };
};

const addFiles = (tree: Tree, options: NormalizedSchema): void => {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
};

const updateRootTsConfig = (host: Tree, options: NormalizedSchema): void => {
  const tsconfigBase = getRootTsConfigPathInTree(host);

  if (tsconfigBase === null) {
    return;
  }

  updateJson(host, tsconfigBase, (json: TsConfigJson) => {
    const compilerOptions = json.compilerOptions ?? {};
    compilerOptions.paths = compilerOptions.paths ?? {};

    if (compilerOptions.paths[options.importPath]) {
      throw new Error(
        `You already have a library using the import path "${options.importPath}". Make sure to specify a unique one.`
      );
    }

    compilerOptions.paths[options.importPath] = [
      joinPathFragments(options.projectRoot, './src', `index.ts`),
    ];

    return json;
  });
};

const runGenerator = async (tree: Tree, options: PluginGeneratorSchema): Promise<void> => {
  const normalizedOptions = normalizeOptions(tree, options);

  addProjectConfiguration(
    tree,
    normalizedOptions.projectName,
    {
      root: normalizedOptions.projectRoot,
      projectType: 'library',
      sourceRoot: `${normalizedOptions.projectRoot}/src`,
      targets: {
        build: {
          executor: '@nrwl/js:tsc',
          options: {
            outputPath: normalizedOptions.distDirectory,
            main: joinPathFragments(normalizedOptions.projectRoot, 'src', 'index.ts'),
            tsConfig: joinPathFragments(normalizedOptions.projectRoot, 'tsconfig.json'),
            assets: [
              joinPathFragments(normalizedOptions.projectRoot, '*.md'),
              joinPathFragments(normalizedOptions.projectRoot, 'flagship.json'),
              joinPathFragments(
                normalizedOptions.projectRoot,
                'src',
                'ios',
                'app-extensions',
                '**',
                '*.schema.json'
              ),
              joinPathFragments(
                normalizedOptions.projectRoot,
                'src',
                'ios',
                'app-extensions',
                '**',
                'files',
                '**',
                '*'
              ),
            ],
          },
        },
      },
      tags: normalizedOptions.parsedTags,
    },
    true
  );

  addFiles(tree, normalizedOptions);
  updateRootTsConfig(tree, normalizedOptions);
  await formatFiles(tree);
};

export default runGenerator;
