import { spawn } from 'child_process';
import { Config } from '../types';
import * as path from './path';
import * as helpers from '../helpers';
import * as os from './os';


/*
 * A set of platforms to link.
 * @typedef {Object} LinkPlatforms
 * @property {boolean} android - Whether or not to link for Android.
 * @property {boolean} ios - Whether or not to link for iOS.
 */

/**
 * Runs `react-native link` on the project.
 * @param {object} The project configuration.
 * @returns {Promise<void>}
 */
export async function link(configuration: Config): Promise<boolean | object> {
  helpers.logInfo(`running react-native link`);

  const androidDeploymentKey = configuration.codepush &&
    configuration.codepush.android.deploymentKey;
  const iosDeploymentKey = configuration.codepush &&
    configuration.codepush.ios.deploymentKey;

  // Spawn react-native link
  const spawned = spawn('react-native', ['link'], {
    cwd: path.project.path(),
    shell: os.win
  });

  return new Promise<boolean | object>((resolve, reject) => {
    let stdout = '';
    let androidDeploymentKeyEntered = false;
    let iosDeploymentKeyEntered = false;
    spawned.stdout.pipe(process.stdout);
    spawned.stderr.pipe(process.stderr);

    spawned.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
      if (!androidDeploymentKeyEntered &&
        stdout.includes('What is your CodePush deployment key for Android')) {
        spawned.stdin.write((androidDeploymentKey || '') + '\n');
        androidDeploymentKeyEntered = true;
        stdout = '';
      }
      if (!iosDeploymentKeyEntered &&
        stdout.includes('What is your CodePush deployment key for iOS')) {
        spawned.stdin.write((iosDeploymentKey || '') + '\n');
        spawned.stdin.end(); // cannot exit the process if stdin is still active
        iosDeploymentKeyEntered = true;
        stdout = '';
      }
    });

    spawned.on('exit', (code: number) => {
      if (code === 0) {
        helpers.logInfo('react-native link finished successfully');
        return resolve(true);
      } else {
        return reject('react-native link exited with code ' + code);
      }
    });

    spawned.on('error', reject);
  });
}
