import * as inquirer from 'inquirer';
import * as formatters from '../lib/formatters';
import { requiredString } from '../lib/validation';

export interface ZendeskChatAnswers {
  options: {
    zendeskChat: boolean;
  };
  config?: {
    zendeskChat?: {
      accountKey: string;
    };
  };
}

const questions: inquirer.DistinctQuestion[] = [
  {
    type: 'confirm',
    name: 'options.zendeskChat',
    message: 'Will the app use react-native-zendesk-chat to implement Zendesk Chat?',
    default: false,
  },
  formatters.required({
    type: 'input',
    name: 'config.zendeskChat.accountKey',
    message: 'Enter your account key',
    when: (answers) => answers.options.zendeskChat,
    validate: requiredString,
  }),
];

export const zendeskChat = questions;
