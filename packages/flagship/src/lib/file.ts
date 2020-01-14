import * as path from './path';
import * as fs from './fs';
import { spawnSync } from 'child_process';
import { Config } from '../types';

const dest = (file: string, configuration: Config) => path.resolve(
  path.ios.nativeProjectPath(configuration), path.basename(file)
);

export const addFilesToXcodeProject = (
  filePaths: string[],
  configuration: Config
) => {
  const regPaths: string[] = [];
  filePaths.forEach(file => {
    fs.copySync(
      file,
      dest(file, configuration)
    );
    regPaths.push(
      dest(file, configuration)
    );
  });

  spawnSync(
    'ruby',
    [
      path.resolve(__dirname, '../../scripts/register-files.rb'),
      '-n',
      configuration.name,
      '-p',
      path.ios.nativeProjectPath(configuration),
      '-f',
      regPaths.join(',')
    ], {
      stdio: 'inherit'
    });
};

