import type { ExecutorContext } from '@nrwl/devkit';
import { logger, parseTargetString, runExecutor } from '@nrwl/devkit';
import { cyan } from 'chalk';

import { calculateDependencies } from '../../lib/calculate-dependencies';
import { CONSOLE_PREFIX } from '../../lib/constants';

export interface ConcatAllExecutorOptions {
  targets: string[];
  options?: object;
}

/**
 *
 * @param options
 * @param context
 * @return
 */
export const concatAll = async (
  options: ConcatAllExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> => {
  try {
    const dependencyList = await calculateDependencies(
      options.targets,
      context.workspace.targetDependencies
    );
    const completedTask = new Set<string>();

    for (const targetString of [...dependencyList, ...options.targets]) {
      if (completedTask.has(targetString)) {
        continue;
      }

      const target = parseTargetString(targetString);
      logger.info(`${CONSOLE_PREFIX} Running ${cyan(targetString)}...`);
      for await (const execution of await runExecutor(target, options.options ?? {}, context)) {
        if (execution.success) {
          completedTask.add(targetString);
        }

        if ((execution.success as boolean | undefined) === false) {
          throw new Error(`${target} failed to complete successfully`);
        }
      }
    }
  } catch {
    logger.error(`${CONSOLE_PREFIX} Failed running tasks...`);
    return { success: false };
  }

  return { success: true };
};

export default concatAll;
