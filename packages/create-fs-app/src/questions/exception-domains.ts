// tslint:disable: ter-max-len max-line-length
import { DistinctQuestion } from 'inquirer';
import { strToArray } from '../lib/transforms';

export interface ExceptionDomainsAnswers {
  options: {
    exceptionDomains: boolean;
  };
  config?: {
    exceptionDomains?: string[];
  };
}

export const exceptionDomains: DistinctQuestion[] = [{
  type: 'confirm',
  name: 'options.exceptionDomains',
  message: 'Will you need to make any requests over http rather than https?',
  suffix: 'iOS and Android block clear text requests by default. This behavior can be overridden if absolutely necessary.',
  default: false
}, {
  type: 'editor',
  name: 'config.exceptionDomains',
  message: 'Enter the domains that require http connections (one per line)',
  when: answers => answers.options.exceptionDomains,
  filter: strToArray
}];
