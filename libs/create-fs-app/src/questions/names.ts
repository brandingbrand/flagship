import { DistinctQuestion } from 'inquirer';
import { requiredString } from '../lib/validation';
import { required } from '../lib/formatters';

export interface NamesAnswers {
  config: {
    name: string;
    displayName: string;
  };
}

const questions: DistinctQuestion[] = [
  {
    type: 'input',
    name: 'config.name',
    message: 'What is your project name? (eg. pirateship)',
    suffix:
      'The internal name of your app; for example, this will be used to name the Xcode project files.',
    filter: (name) => name.trim(),
    validate: requiredString,
  },
  {
    type: 'input',
    name: 'config.displayName',
    message: 'What is the name that should be displayed for your app? (eg. PirateShip)',
    suffix: "The user-facing name of the app to be displayed on the user's home screen.",
    validate: requiredString,
  },
];

export const names = questions.map(required);
