import {
  execSync as exec
} from 'child_process';
import * as fs from './fs';
import * as helpers from '../helpers';
import * as os from './os';
import * as path from './path';

/**
 * Performs a pod install.
 */
export function install(): void {
  if (os.linux) {
    return;
  }

  helpers.logInfo('running pod install');

  try {
    exec(`cd "${path.project.resolve('ios')}" && pod install`, {
      stdio: [0, 1, 2]
    });
  } catch (err) {
    helpers.logError(
      'pod install failed, here are the few things you can try to fix:\n' +
        `\t1. Run "brew install cocoapods" if don't have cocoapods installed\n` +
        `\t2. Run "pod repo update" to update your local spec repos`
    );

    process.exit(1);
  }
}

/**
 * Adds a pod to a given Podfile.
 *
 * @param {string[]} pods An array of pods to add to the Podfile.
 * @param {string} podfilePath The path to the Podfile to update with the given pod.
 */
export function add(pods: string[], podfilePath: string = path.ios.podfilePath()): void {
  if (!pods.length) {
    return;
  }
  const podfileContents = fs.readFileSync(podfilePath);

  // Filter out any pods that are already declared in the podfile
  // TODO: This should support a version check
  pods = pods.filter(pod => podfileContents.indexOf(pod) === -1);
  pods = pods.map(pod => `\t${pod}`);

  fs.writeFileSync(
    podfilePath,
    podfileContents.replace(
      '# Add new pods below this line',
      `${pods.join('\n')}\n# Add new pods below this line`
    )
  );

  helpers.logInfo(`Podfile updated: ${pods.join(', ')}`);
}

/**
 * Add additional sources to the Podfile
 * @param {string[]} sources - list of sources to add
 */
export function sources(sources: string[]): void {
  if (sources.length > 0) {
    helpers.logInfo('adding additional pod sources: ' + sources.join(', '));
    let podfileContents = fs.readFileSync(path.ios.podfilePath());
    podfileContents = podfileContents.replace('# ADDITIONAL_POD_SOURCES',
      sources.map(s => `source '${s}'`).join('\n'));
    fs.writeFileSync(path.ios.podfilePath(), podfileContents);
  }
}
