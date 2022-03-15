export const difference = <T>(array1: T[], array2: T[]): T[] => {
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  return [...array1.filter((item) => !set2.has(item)), ...array2.filter((item) => !set1.has(item))];
};
