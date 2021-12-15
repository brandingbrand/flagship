import { DistinctQuestion } from 'inquirer';
import { android, ios, QuestionFormatter } from '../lib/formatters';
import { requiredString } from '../lib/validation';

const generateCodePushConfig = (os: string, formatter: QuestionFormatter): DistinctQuestion[] => {
  // TODO: these descriptions could be better.
  const questions: DistinctQuestion[] = [
    {
      type: 'input',
      name: `config.codepush.${os.toLowerCase()}.name`,
      message: `Enter the ${os} name`,
      when: (answers) => answers.options.codepush,
      validate: requiredString,
    },
    {
      type: 'input',
      name: `config.codepush.${os.toLowerCase()}.appKey`,
      message: `Enter the ${os} appKey`,
      when: (answers) => answers.options.codepush,
      validate: requiredString,
    },
    {
      type: 'input',
      name: `config.codepush.${os.toLowerCase()}.deploymentKey`,
      message: `Enter the ${os} deployment key`,
      when: (answers) => answers.options.codepush,
      validate: requiredString,
    },
  ];

  return questions.map(formatter);
};

interface CodePushConfig {
  name: string;
  appKey: string;
  deploymentKey: string;
}

export interface CodePushAnswers {
  options: {
    codepush: boolean;
  };
  config?: {
    codepush?: {
      appCenterToken: string;
      android: CodePushConfig;
      ios: CodePushConfig;
    };
  };
}

export const codepush: DistinctQuestion[] = [
  {
    type: 'confirm',
    name: 'options.codepush',
    message: 'Would you like to enable CodePush?',
    default: false,
  },
  {
    type: 'input',
    name: 'config.codepush.appCenterToken',
    message: 'Enter your App Center Token',
    when: (answers) => answers.options.codepush,
    validate: (input) => typeof input === 'string' && input.trim() !== '',
  },
  ...generateCodePushConfig('iOS', ios),
  ...generateCodePushConfig('Android', android),
];
