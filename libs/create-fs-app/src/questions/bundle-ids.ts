import { DistinctQuestion } from 'inquirer';
import { requiredString } from '../lib/validation';
import * as formatters from '../lib/formatters';

export interface BundleIdsAnswers {
  config: {
    bundleIds: {
      android: string;
      ios: string;
    };
  };
}

const android: DistinctQuestion = formatters.android({
  type: 'input',
  name: 'config.bundleIds.android',
  message: 'Android Application ID (eg. com.brandingbrand.myapp)',
  suffix:
    'This ID uniquely identifies your app on the device and in Google Play Store. Typically follows the convention of "com.[organization].[application]".',
  validate: requiredString,
});

const ios: DistinctQuestion = formatters.ios({
  type: 'input',
  name: 'config.bundleIds.ios',
  message: 'iOS Bundle ID (eg. com.brandingbrand.myapp)',
  suffix:
    'This ID uniquely identifies your app on the device. Typically follows the convention of "com.[organization].[application]".',
  validate: requiredString,
});

export const bundleIds = [android, ios];
