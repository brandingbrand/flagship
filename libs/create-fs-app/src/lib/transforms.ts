/**
 * Splits a newline-delimited values into a array while removing extra whitespace
 * @param {string} input string of newline-delimited values
 * @returns {string[]} array of string values
 */
export const strToArray = (input: string): string[] => {
  return input
    .split('\n')
    .map((txt: string) => txt.trim())
    .filter(Boolean);
};
