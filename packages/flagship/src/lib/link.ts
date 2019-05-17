import { spawn } from 'child_process';
import * as helpers from '../helpers';
import * as path from './path';
import * as os from './os';

/**
 * Runs react-native link on the current project.
 *
 * @returns {Promise<void>} A promise representing the child process running react-native link.
 */
export async function link(): Promise<void> {
  helpers.logInfo('running react-native link');

  return new Promise<void>((resolve, reject) => {
    const spawned = spawn('react-native', ['link'], {
      cwd: path.project.path(),
      shell: os.win
    });

    // Redirect child process output to process stdout/stderr so we can see script output
    spawned.stdout.pipe(process.stdout);
    spawned.stderr.pipe(process.stderr);

    spawned.on('error', e => reject(new Error('Error spawning react-native link' + e)));
    spawned.on('close', resolve);

    spawned.stdin.end();
  });
}
