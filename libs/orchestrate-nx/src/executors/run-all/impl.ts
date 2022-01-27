import { runExecutor, parseTargetString, ExecutorContext } from '@nrwl/devkit';
import { from, map, mergeAll, mergeMap } from 'rxjs';
import { bufferedValuesFrom } from 'rxjs-for-await';

export interface RunAllExecutorOptions {
  targets: string[];
}

export async function* runAll(options: RunAllExecutorOptions, context: ExecutorContext) {
  const executions$ = from(options.targets).pipe(
    mergeMap(async (target) => {
      const executor = parseTargetString(target);
      const execution$ = await runExecutor(executor, {}, context);
      return from(execution$).pipe(map((progress) => ({ ...progress, target })));
    }),
    mergeAll()
  );

  const progress = new Map<string, boolean | null>(options.targets.map((target) => [target, null]));
  for await (const executions of bufferedValuesFrom(executions$)) {
    for (const execution of executions) {
      progress.set(execution.target, execution.success);
    }

    if (Array.from(progress.values()).some((success) => success === false)) {
      yield { success: false };
    }

    if (Array.from(progress.values()).every((success) => success === true)) {
      yield { success: true };
    }
  }

  return {
    success: Array.from(progress.values()).every((success) => success === true),
  };
}

export default runAll;
