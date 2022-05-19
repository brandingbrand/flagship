import { cities, firstNames, lastNames, latinWords, states } from './FakeData';

const getRandomValueFromArray = (arr: string[]): string =>
  arr[Math.floor(Math.random() * arr.length)] ?? '';

/**
 * Generate a pseudo-random boolean value
 *
 * @return true or false
 */
export const boolean = (): boolean => Boolean(Math.round(Math.random()));

/**
 * Get a random US state abbreviation
 *
 * @return A state abbreviation
 */
export const state = (): string => getRandomValueFromArray(states);

/**
 * Get a random city from the list of the 25 most populous US cities
 *
 * @return The name of the city
 */
export const city = (): string => getRandomValueFromArray(cities);

/**
 * Generate a pseudo-random integer between min (inclusive) and max (exclusive)
 *
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (exclusive)
 * @return A random integer between min and max
 */
export const number = (min = 1, max = 10): number => Math.floor(Math.random() * (max - min) + min);

/**
 * Generate a random name (first last) from a list of most popular first and last names
 *
 * @return A generated
 */
export const name = (): string =>
  `${getRandomValueFromArray(firstNames)} ${getRandomValueFromArray(lastNames)}`;

/**
 * Generate a sentence comprised of lorem words with a min and max number of words.
 *
 * @param minWords - The minimum number of words in the sentence (inclusive)
 * @param maxWords - The maximum number of words in the sentence (exclusive)
 * @param lastChar - An optional character to end the sentence other than a period, such as '?'
 * @return A randomly-generated lorem sentence.
 */
export const sentence = (minWords = 5, maxWords = 20, lastChar = '.'): string => {
  // Get the first word and capitalize the first letter
  const firstWord = getRandomValueFromArray(latinWords);
  let sentence = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);

  // Get random value for number of words in sentence
  const numWords = number(minWords, maxWords - 1);

  for (let i = 0; i < numWords; ++i) {
    sentence += ` ${getRandomValueFromArray(latinWords)}`;
  }

  return sentence + lastChar;
};

/**
 * Generate a random set of paragraphs comprised of lorem sentences of varying length
 *
 * @param minParagraphs - The minimum number of paragraphs to generate (inclusive)
 * @param maxParagraphs - The maximum number of paragraphs to generate (exclusive)
 * @return A string containing paragraphs separated by newlines
 */
export const paragraphs = (minParagraphs = 1, maxParagraphs = 5): string => {
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
