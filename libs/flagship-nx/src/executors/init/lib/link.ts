import { fork } from 'child_process';
import { join } from 'path';

export const link = async (workspaceRoot: string, projectRoot: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const childProcess = fork(join(workspaceRoot, './node_modules/react-native/cli.js'), ['link'], {
      cwd: join(workspaceRoot, projectRoot),
    });

    process.on('exit', () => childProcess.kill());
    process.on('SIGTERM', () => childProcess.kill());

    childProcess.on('error', (err) => {
      reject(err);
    });
    childProcess.on('exit', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(code);
      }
    });
  });
};
