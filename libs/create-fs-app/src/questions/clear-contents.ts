import { DistinctQuestion } from 'inquirer';
import { warning } from '../lib/colors';
import { tagPrefix } from '../lib/formatters';

const warningTag = tagPrefix(warning('WARNING'));

export interface ClearContentsAnswers {
  clearContents: boolean;
  clearContentsConfirm: boolean;
}

export const clearContents: DistinctQuestion[] = [
  {
    type: 'confirm',
    name: 'clearContents',
    message: 'The template project will be populated into this directory. It must be empty to continue.\nDo you want to delete all files and folders within it?\n',
    default: false
  },
  warningTag({
    type: 'confirm',
    name: 'clearContentsConfirm',
    message: `Are you sure? ${warning('THIS OPERATION IS UNRECOVERABLE!')}\n`,
    when: answers => answers.clearContents,
    default: false
  })
];
