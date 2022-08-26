import type { Tree } from '@nrwl/devkit';
import { readProjectConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import generator from './generator';
import type { PluginGeneratorSchema } from './schema';

describe('plugin generator', () => {
  let appTree: Tree;
  const options: PluginGeneratorSchema = {
    name: 'test',
    importPath: '@brandingbrand/test',
    appExtensionName: 'example',
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');

    expect(config).toBeDefined();
  });
});
