import { Answers, DistinctQuestion } from 'inquirer';
import * as colors from './colors';

// Allows multiple question formatters to be compiled into a single formatting function
export const compose = (...fns: QuestionFormatter[]): QuestionFormatter => {
  return (question) => fns.reduceRight((formatters, fn) => fn(formatters), question);
};

export type QuestionFormatter<T extends Answers = Answers> = (
  question: DistinctQuestion<T>
) => DistinctQuestion<T>;

/**
 * Appends a given tag to the prefix of a question
 *
 * @param {string} tag text to be added to the tag
 * @returns {QuestionFormatter} Formatter
 *
 * @example
 * tagPrefix('Required')(question)
 * // Some Text -> [Required] Some Text
 */
export const tagPrefix = (tag: string): QuestionFormatter => {
  return (question) => {
    return {
      ...question,
      prefix: `[${tag}]${question.prefix || ''}`,
    };
  };
};

/**
 * Sets or appends a new line to the given question's suffix
 *
 * @param {DistinctQuestion} question Inquirer question that will be altered
 * @returns {QuestionFormatter} Formatter
 *
 * @example
 * // Some Text -> \nSome Text\n
 */
export const newLineSuffix: QuestionFormatter = (question) => {
  let suffix = question.suffix || '\n';

  if (!suffix.startsWith('\n')) {
    suffix = '\n' + suffix;
  }

  if (!suffix.endsWith('\n')) {
    suffix = suffix + '\n';
  }

  return {
    ...question,
    suffix,
  };
};

export const required = tagPrefix(colors.required('Required'));
export const android = tagPrefix(colors.android('Android'));
export const ios = tagPrefix(colors.ios('iOS'));
