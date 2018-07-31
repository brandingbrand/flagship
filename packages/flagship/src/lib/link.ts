import { Config } from '../types';
import { spawn } from 'node-suspect';
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

  const spawnArgs = ['link'];

  if (!(androidDeploymentKey && iosDeploymentKey)) {
    spawnArgs.push('--verbose');
  }

  // Spawn react-native link
  const spawned = spawn('react-native', spawnArgs, {
    cwd: path.project.path(),
    shell: os.win
  });

  if (androidDeploymentKey && iosDeploymentKey) {
    spawned
      .wait('What is your CodePush deployment key for Android (hit <ENTER> to ignore)')
      .sendline(androidDeploymentKey)
      .wait('What is your CodePush deployment key for iOS (hit <ENTER> to ignore)')
      .sendline(iosDeploymentKey)
      .sendEof();
  }

  return new Promise<boolean | object>((resolve, reject) => {
    return spawned.run((err: any) => {
      if (!err) {
        helpers.logInfo('react-native link finished successfully');
        return resolve(true);
      } else {
        helpers.logError('react-native link could not complete', err);
        return reject(err);
      }
    });
  });
}
