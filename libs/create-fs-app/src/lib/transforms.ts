/**
 * Splits a newline-delimited values into a array while removing extra whitespace
 *
 * @param input string of newline-delimited values
 * @return array of string values
 */
export const strToArray = (input: string): string[] =>
  input
    .split('\n')
    .map((txt: string) => txt.trim())
    .filter(Boolean);
