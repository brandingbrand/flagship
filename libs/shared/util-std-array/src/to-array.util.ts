export const toArray = <T>(possibleArray: T | T[]): T[] =>
  Array.isArray(possibleArray) ? possibleArray : [possibleArray];
