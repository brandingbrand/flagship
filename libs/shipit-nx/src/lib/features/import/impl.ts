import { ExecutorContext } from '@nrwl/devkit';
import { ImportConfig } from '../../configs/import.config';
import {
  CleanPhase,
  ClonePhase,
  CorruptionCheckPhase,
  ImportSyncPhase,
  runPhases,
} from '../../phases';

export interface ImportExecutorOptions {
  repo: string;
  pullRequestNumber: string;
  dryRun?: boolean;
}

export const importIt = async (options: ImportExecutorOptions, context: ExecutorContext) => {
  const config = new ImportConfig({
    destinationRepoURL: options.repo,
    pullRequestNumber: options.pullRequestNumber,
    sourcePath: context.root,
  });

  return runPhases(
    [ClonePhase, CorruptionCheckPhase, CleanPhase, ...(options.dryRun ? [] : [ImportSyncPhase])],
    config
  )
    .then(() => ({ success: true }))
    .catch(() => ({ success: false }));
};

export default importIt;
