import type { ExecutorContext } from '@nrwl/devkit';
import { logger, readJson } from '@nrwl/devkit';
import { spawnSync } from 'child_process';
import { FsTree, flushChanges } from 'nx/src/config/tree';
import { join } from 'path';

import type { LintResult } from '../../types/lint-result.type';
import { mergeProjectConfiguration } from '../../utils/merge-project-configuration.util';

import type { SetMaxWarningsExecutorSchema } from './schema';

const runExecutor = async (
  _options: SetMaxWarningsExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> =>
  new Promise((resolve) => {
    const { isVerbose, projectName, root } = context;

    if (projectName === undefined) {
      logger.error('Executor MUST be run on a project but no project name was found');
      resolve({ success: false });
      return;
    }

    const fileName = `max-warnings.json`;
    const outputFile = join('dist', 'eslint-config', projectName, fileName);

    logger.info(`Running linting for ${projectName} to get current warning count...`);
    const subProcess = spawnSync(
      'nx',
      [
        'lint',
        projectName,
        '--skip-nx-cache',
        '--format=json',
        `--output-file=${outputFile}`,
        '--max-warnings=-1',
      ],
      {
        stdio: 'ignore',
      }
    );

    if (subProcess.error) {
      logger.error('Failed to lint project');
      resolve({ success: false });
      return;
    }

    const tree = new FsTree(root, isVerbose);
    const results = readJson<LintResult[]>(tree, outputFile);
    const totalWarnings = results.reduce((total, result) => total + result.warningCount, 0);

    logger.info(
      `Setting max warnings for ${projectName} to current warning count of ${totalWarnings}`
    );
    mergeProjectConfiguration(tree, projectName, {
      targets: {
        lint: {
          executor: '@nrwl/linter:eslint',
          outputs: ['{options.outputFile}'],
          options: {
            maxWarnings: totalWarnings,
          },
        },
      },
    });

    flushChanges(root, tree.listChanges());

    resolve({ success: true });
  });

export default runExecutor;
