import { bold } from 'chalk';
import { spawn } from 'child_process';

const podRepoUpdateErrorMessage = `
Running ${bold('pod repo update')} failed, see above.
Do you have CocoaPods (https://cocoapods.org/) installed?

Check that your XCode path is correct:
${bold('sudo xcode-select --print-path')}

If the path is wrong, switch the path: (your path may be different)
${bold('sudo xcode-select --switch /Applications/Xcode.app')}
`;

export const podRepoUpdate = async (iosDirectory: string) => {
  return new Promise<void>((resolve, reject) => {
    const process = spawn('pod', ['repo', 'update'], {
      cwd: iosDirectory,
      stdio: [0, 1, 2],
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(podRepoUpdateErrorMessage));
      }
    });
    process.on('error', () => {
      reject(new Error(podRepoUpdateErrorMessage));
    });
  });
};

const podInstallErrorMessage = `
Running ${bold('pod install')} failed, see above.
Do you have CocoaPods (https://cocoapods.org/) installed?

Check that your XCode path is correct:
${bold('sudo xcode-select --print-path')}

If the path is wrong, switch the path: (your path may be different)
${bold('sudo xcode-select --switch /Applications/Xcode.app')}
`;

export const podInstall = async (iosDirectory: string) => {
  return new Promise<void>((resolve, reject) => {
    const process = spawn('pod', ['install'], {
      cwd: iosDirectory,
      stdio: [0, 1, 2],
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(podInstallErrorMessage));
      }
    });
    process.on('error', () => {
      reject(new Error(podInstallErrorMessage));
    });
  });
};
