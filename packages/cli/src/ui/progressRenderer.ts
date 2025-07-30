import * as cliProgress from 'cli-progress';
import chalk from 'chalk';
import ansiAlign from 'ansi-align';

import {
  FLAGSHIP_CODE_DESCRIPTION,
  FLAGSHIP_CODE_LABEL,
  FLAGSHIP_CODE_LOGO,
  FLAGSHIP_CODE_TITLE,
} from './constants';

import globalEmitter from '@/core/eventBus';

interface ProgressState {
  percent: number;
  result?: 'success' | 'fail';
  messages: string[];
}

class ProgressRenderer {
  private multibar: cliProgress.MultiBar | null = null;
  private progressBar: cliProgress.SingleBar | null = null;
  private state: ProgressState = {
    percent: 0,
    result: undefined,
    messages: [],
  };
  private resolve: Function | null = null;
  private cleanup: Function | undefined;

  public renderStatus({
    numberOfPlugins = 0,
    cmd,
  }: {
    numberOfPlugins?: number;
    cmd: string;
  }): Promise<void> {
    // Display header
    this.displayHeader();

    // Create multibar and progress bar
    this.multibar = new cliProgress.MultiBar({
      clearOnComplete: true,
      hideCursor: false,
      format: `${chalk.green(FLAGSHIP_CODE_LABEL)} ${chalk.gray(`[ ${cmd} ]`)} ${chalk.green('[{bar}]')} {percentage}%`,
      barCompleteChar: '█',
      barIncompleteChar: ' ',
      forceRedraw: true,
    }, cliProgress.Presets.shades_classic);

    this.progressBar = this.multibar.create(numberOfPlugins, 0, null, {
      clearOnComplete: true
    });

    // Set up event listeners
    this.setupEventListeners();

    // Return a promise that resolves when complete
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  private displayHeader(): void {
    // Clear screen and display header
    process.stderr.write('\n');
    process.stderr.write(FLAGSHIP_CODE_LOGO + '\n');
    process.stderr.write(
      ansiAlign([FLAGSHIP_CODE_TITLE, FLAGSHIP_CODE_DESCRIPTION]).join('\n') + '\n\n'
    );
  }

  private setupEventListeners(): void {
    const onRun = () => {
      this.state.percent += 1;
      if (this.progressBar) {
        this.progressBar.update(this.state.percent);
      }
    };

    const onEnd = () => {
      this.state.result = 'success';
      this.complete();
    };

    const onError = () => {
      this.state.result = 'fail';
      this.complete();
    };

    const onLog = (message: string) => {
      this.state.messages.push(message);
      // Use multibar log to write above progress bars
      if (this.multibar) {
        this.multibar.log(message + '\n');
      }
    };
    // clear existing listeners
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = undefined;
    }

    globalEmitter.on('onRun', onRun);
    globalEmitter.on('onEnd', onEnd);
    globalEmitter.on('onError', onError);
    globalEmitter.on('onLog', onLog);

    // Store cleanup function globally for external access
    this.cleanup = () => {
      globalEmitter.removeListener('onRun', onRun);
      globalEmitter.removeListener('onEnd', onEnd);
      globalEmitter.removeListener('onError', onError);
      globalEmitter.removeListener('onLog', onLog);
      
      if (this.multibar) {
        this.multibar.stop();
        this.multibar = null;
        this.progressBar = null;
      }
    };
  }

  private complete(): void {
    if (this.multibar) {
      this.multibar.stop();
    }

    // Display completion status
    if (this.state.result === 'success') {
      process.stderr.write(chalk.green('✓ ') + chalk.bold('done!\n'));
    } else if (this.state.result === 'fail') {
      process.stderr.write(chalk.red('✗ ') + chalk.bold('fail!\n'));
    }

    // Clean up event listeners
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = undefined;
    }

    // Resolve the promise
    if (this.resolve) {
      this.resolve();
    }
  }
}

// singleton instance
const progressRenderer = new ProgressRenderer();

export function renderStatus(options: {
  numberOfPlugins?: number;
  cmd: string;
}): Promise<void> {
  return progressRenderer.renderStatus(options);
}