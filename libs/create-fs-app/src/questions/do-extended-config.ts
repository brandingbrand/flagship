import { DistinctQuestion } from 'inquirer';
import { QuestionFormatter } from '../lib/formatters';
import { success } from '../lib/colors';

export interface DoExtendedConfigAnswers {
  options: {
    doExtended: boolean;
  };
}

export const doExtendedConfig: DistinctQuestion[] = [{
  type: 'confirm',
  name: 'options.doExtended',
  prefix: success('Basic settings complete!\n'),
  message: 'Do you want to configure additional options right now?',
  suffix: 'Includes configurations for features like universal links, additional modules, etc.',
  default: false
}];

export const onlyWhenExtendedConfig: QuestionFormatter = question => {
  const oldWhen = question.when;

  return {
    ...question,
    when: answers => {
      // if doExtended is falsy, it doesn't matter what the value of the old conditional was
      if (!answers.options.doExtended) {
        return false;
      }

      // if the question doesn't define a when-condition, we can simply use the value doExtended
      if (!oldWhen) {
        return answers.options.doExtended;
      }

      return typeof oldWhen === 'function' ? oldWhen(answers) : oldWhen;
    }
  };
};
