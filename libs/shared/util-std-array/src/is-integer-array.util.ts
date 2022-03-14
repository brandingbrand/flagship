export const isInteger = (item: unknown): item is number =>
  typeof item === 'number' && Number.isInteger(item);

export const isIntegerArray = (array: unknown[]): array is number[] => array.every(isInteger);
