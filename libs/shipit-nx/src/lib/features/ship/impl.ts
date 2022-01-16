import { ExecutorContext } from '@nrwl/devkit';
import { ShipConfig } from '../../configs/ship.config';
import {
  CleanPhase,
  ClonePhase,
  CorruptionCheckPhase,
  PushPhase,
  SyncPhase,
  VerifyRepoPhase,
  runPhases,
} from '../../phases';

export interface ShipExecutorOptions {
  repo: string;
  dryRun?: boolean;
}

export const shipIt = async (options: ShipExecutorOptions, context: ExecutorContext) => {
  const config = new ShipConfig(context.root, options.repo);
  runPhases(
    [
      ClonePhase,
      CorruptionCheckPhase,
      CleanPhase,
      SyncPhase,
      VerifyRepoPhase,
      ...(options.dryRun ? [] : [PushPhase]),
    ],
    config
  );

  return { success: true };
};

export default shipIt;
