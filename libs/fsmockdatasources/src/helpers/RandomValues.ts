import { cities, firstNames, lastNames, latinWords, states } from './FakeData';

const getRandomValueFromArray = (arr: string[]): string => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Generate a pseudo-random boolean value
 *
 * @returns true or false
 */
export const boolean = (): boolean => {
  return Boolean(Math.round(Math.random()));
};

/**
 * Get a random US state abbreviation
 *
 * @returns A state abbreviation
 */
export const state = (): string => {
  return getRandomValueFromArray(states);
};

/**
 * Get a random city from the list of the 25 most populous US cities
 *
 * @returns The name of the city
 */
export const city = (): string => {
  return getRandomValueFromArray(cities);
};

/**
 * Generate a pseudo-random integer between min (inclusive) and max (exclusive)
 *
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (exclusive)
 * @returns A random integer between min and max
 */
export const number = (min: number = 1, max: number = 10): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Generate a random name (first last) from a list of most popular first and last names
 *
 * @returns A generated
 */
export const name = (): string => {
  return getRandomValueFromArray(firstNames) + ' ' + getRandomValueFromArray(lastNames);
};

/**
 * Generate a sentence comprised of lorem words with a min and max number of words.
 *
 * @param minWords - The minimum number of words in the sentence (inclusive)
 * @param maxWords - The maximum number of words in the sentence (exclusive)
 * @param lastChar - An optional character to end the sentence other than a period, such as '?'
 * @returns A randomly-generated lorem sentence.
 */
export const sentence = (
  minWords: number = 5,
  maxWords: number = 20,
  lastChar: string = '.'
): string => {
  // Get the first word and capitalize the first letter
  const firstWord = getRandomValueFromArray(latinWords);
  let sentence = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);

  // Get random value for number of words in sentence
  const numWords = number(minWords, maxWords - 1);

  for (let i = 0; i < numWords; ++i) {
    sentence += ' ' + getRandomValueFromArray(latinWords);
  }

  return sentence + lastChar;
};

/**
 * Generate a random set of paragraphs comprised of lorem sentences of varying length
 *
 * @param minParagraphs - The minimum number of paragraphs to generate (inclusive)
 * @param maxParagraphs - The maximum number of paragraphs to generate (exclusive)
 * @returns A string containing paragraphs separated by newlines
 */
export const paragraphs = (minParagraphs: number = 1, maxParagraphs: number = 5): string => {
  // Get random value for number of paragraphs to generate
  const numParagraphs = number(minParagraphs, maxParagraphs);
  let paragraphs = '';

  for (let i = 0; i < numParagraphs; ++i) {
    // Get random value for number of sentences for current paragraph
    const numSentences = number(1, 5);

    for (let j = 0; j < numSentences; ++j) {
      paragraphs += sentence();

      if (j < numSentences - 1) {
        paragraphs += ' ';
      }
    }

    if (i < numParagraphs - 1) {
      paragraphs += '\n';
    }
  }

  return paragraphs;
};
