import { logger } from '@nrwl/devkit';
import { SingleBar, Presets } from 'cli-progress';
import { green, grey } from 'colors';
import chalk from 'chalk';

import { ShipConfig } from '../configs/ship.config';

export type PhaseConstructor<C extends ShipConfig = ShipConfig> = new (config: C) => Phase;

export interface Phase {
  readonly readableName: string;
  run: () => AsyncGenerator<number, void> | Generator<number, void> | Promise<void> | void;
}

export const runPhases = async <C extends ShipConfig>(
  phases: PhaseConstructor<C>[],
  config: C
): Promise<void> => {
  for (const Phase of phases) {
    const phase = new Phase(config);

    try {
      logger.log(`${chalk.dim('phase:')} ${phase.readableName}`);
      const result = phase.run();

      if (!result) {
        continue;
      }

      if ('then' in result) {
        await result;
      }

      if ('next' in result) {
        const progressBar = new SingleBar(
          {
            hideCursor: true,
            linewrap: true,
            format: `${grey('[{bar}]')} ${green('{percentage}%')}`,
          },
          Presets.rect
        );
        progressBar.start(1, 0);
        for await (const progress of result) {
          progressBar.update(progress);
        }
        progressBar.stop();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(error.message);
      } else {
        logger.error(`An unexpected error occurred`);
      }
      throw error;
    }
  }
};
