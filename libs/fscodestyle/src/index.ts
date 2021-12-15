import { spawn, SpawnOptions } from 'child_process';
import { join, resolve } from 'path';
import { cwd, exit, platform } from 'process';

// npm/yarn set the working directory to the project root
const kProjectRoot = cwd();
const kTSLintArguments = [
  '--config', resolve(__dirname, '..', 'tslint.json'),
  '--exclude', join(kProjectRoot, '**', 'node_modules', '**', '*'),
  '--exclude', join(kProjectRoot, '**', 'dist', '**', '*'),
  '--project', join(kProjectRoot, 'tsconfig.json'),
  join(kProjectRoot, '**', '*.{ts,tsx}')
];
const kSpawnOptions: SpawnOptions = {
  stdio: 'inherit',
  shell: /^win/.test(platform)
};
const kPaths = [
  resolve(__dirname, '..', 'node_modules', '.bin', 'tslint'),
  'tslint'
];

/**
 * Attempts to run the tslint executable at the given path.
 *
 * @param {string} path The path to the tslint executable.
 * @returns {Promise<number>} The exit code of tslint.
 */
async function runTSLint(path: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    let didFailToSpawn = false;

    return spawn(path, kTSLintArguments, kSpawnOptions)
      .on('error', err => {
        didFailToSpawn = true;

        return reject(err);
      })
      .on('exit', code => {
        if (!didFailToSpawn) {
          return resolve(code || 0);
        }
      });
  });
}

/**
 * Attempts to find and run tslint in an array of possible paths.
 *
 * @param {string[]} paths An array of possible paths to be executed in order.
 * @returns {Promise<never>} This function exits the process with the exit code of tslint or -1 if
 * tslint couldn't be found.
 */
(async function findAndRunTSLint(paths: string[]): Promise<never> {
  for (const path of paths) {
    try {
      const code = await runTSLint(path);

      return exit(code);
    } catch (err) {
      // Couldn't find tslint at that path. Try the next.
      continue;
    }
  }

  // Execution should only get to this point if we couldn't find tslint in any of the paths
  return exit(-1);
})(kPaths).catch(() => exit(-1));

