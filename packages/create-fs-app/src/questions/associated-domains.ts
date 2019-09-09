// tslint:disable: ter-max-len max-line-length
import { DistinctQuestion } from 'inquirer';
import * as formatters from '../lib/formatters';
import { strToArray } from '../lib/transforms';

export interface AssociatedDomainsAnswers {
  options: {
    associatedDomains: boolean;
  };
  config: {
    associatedDomains: string[];
  };
}

const questions: DistinctQuestion[] = [{
  type: 'confirm',
  name: 'options.associatedDomains',
  message: 'Are there domains that should be associated with this app for universal links?',
  suffix: 'See: https://developer.android.com/training/app-links',
  default: false
}, {
  type: 'editor',
  name: 'config.associatedDomains',
  message: 'Enter the domains that will be associated to your app (one per line)',
  when: answers => answers.options.associatedDomains,
  filter: strToArray
}];

export const associatedDomains = questions.map(formatters.android);
