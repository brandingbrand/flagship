import * as fs from '../lib/fs';
import { logError } from '../helpers';
import * as path from '../lib/path';

export interface Args {
  platform?: string;
}

export const command = 'clean [platform]';
export const describe = 'remove build and installation artifacts';
export const handler = (argv: Args) => {
  const androidPath = path.project.resolve('android');
  const iOSPath = path.project.resolve('ios');
  const webPath = path.project.resolve('web');

  switch (argv.platform) {
    case 'android':
      fs.removeSync(androidPath);
      break;

    case 'ios':
      fs.removeSync(iOSPath);
      break;

    case 'native':
      fs.removeSync(androidPath);
      fs.removeSync(iOSPath);
      break;

    case 'web':
      fs.removeSync(webPath);
      break;

    case undefined:
      fs.removeSync(androidPath);
      fs.removeSync(iOSPath);
      fs.removeSync(webPath);
      break;

    default:
      logError(`unrecognized platform ${argv.platform}`);
      process.exit(1);
  }
};
