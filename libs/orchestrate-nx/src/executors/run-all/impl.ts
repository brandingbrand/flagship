import { runExecutor, parseTargetString, ExecutorContext, logger } from '@nrwl/devkit';

import { from, map, mergeAll, mergeMap } from 'rxjs';
import { bufferedValuesFrom } from 'rxjs-for-await';
import { cyan, red } from 'chalk';

import { calculateDependencies } from '../../lib/calculate-dependencies';
import { CONSOLE_PREFIX } from '../../lib/constants';
import { concatAll } from '../concat/impl';

export interface RunAllExecutorOptions {
  targets: string[];
}

export async function* runAll(options: RunAllExecutorOptions, context: ExecutorContext) {
  logger.info(`${CONSOLE_PREFIX} Building dependencies...`);
  const dependencyList = await calculateDependencies(options.targets);
  const dependencyExecution = await concatAll({ targets: dependencyList }, context);

  if (!dependencyExecution.success) {
    return { success: false };
  }

  logger.info(
    `${CONSOLE_PREFIX} Starting parallel expecters ${options.targets
      .map((target) => cyan(target))
      .join(', ')}...`
  );
  const executions$ = from(options.targets).pipe(
    mergeMap(async (targetString) => {
      const target = parseTargetString(targetString);
      const executor = await runExecutor(target, {}, context);
      return from(executor).pipe(map((progress) => ({ ...progress, target: targetString })));
    }),
    mergeAll()
  );

  let started = false;
  const progress = new Map<string, boolean | null>(options.targets.map((target) => [target, null]));
  for await (const executions of bufferedValuesFrom(executions$)) {
    for (const execution of executions) {
      progress.set(execution.target, execution.success);
    }

    const failedTask = Array.from(progress.entries())
      .filter(([, success]) => success === false)
      .map(([name]) => name);

    if (failedTask.length) {
      logger.info(
        `${CONSOLE_PREFIX} Failed with task ${failedTask.map((task) => red(task)).join(', ')}...`
      );
      yield { success: false };
    }

    if (Array.from(progress.values()).every((success) => success === true)) {
      if (!started) {
        started = true;
        logger.info(`${CONSOLE_PREFIX} All task started.`);
      }

      yield { success: true };
    }
  }

  logger.info(`${CONSOLE_PREFIX} All task completed.`);
  return {
    success: Array.from(progress.values()).every((success) => success === true),
  };
}

export default runAll;
