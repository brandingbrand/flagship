import { spawn } from 'child_process';
import * as helpers from '../helpers';
import * as path from './path';
import * as os from './os';

async function runLink(name?: string): Promise<void> {
  return new Promise<void>((packageResolve, packageReject) => {
    const spawned = spawn('react-native', name ? ['link', name] : ['link'], {
      cwd: path.project.path(),
      shell: os.win
    });

    // Redirect child process output to process stdout/stderr so we can see script output
    spawned.stdout.pipe(process.stdout);
    spawned.stderr.pipe(process.stderr);

    spawned.on('error', e => packageReject(
      new Error('Error spawning react-native link' + e))
    );
    spawned.on('close', packageResolve);

    spawned.stdin.end();
  });
}

/**
 * Runs react-native link on the current project.
 *
 * @param {string[]} forceLink The list of packages to link
 * @returns {Promise<void>} A promise representing the child process running react-native link.
 */
export async function link(forceLink?: string[]): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    if (forceLink && forceLink.length) {
      for (const name in forceLink) {
        if (forceLink.hasOwnProperty(name)) {
          helpers.logInfo('running react-native link for ' + [forceLink[name]]);

          await runLink(forceLink[name]);
        }
      }
    }
    helpers.logInfo('running react-native link to link assets');
    await runLink();
    resolve();
  });
}
