export const replaceAtIndex =
  (index: number) =>
  <T>(newValue: T) =>
  (arr: T[]): T[] => {
    // using mutability for performance boost & because it's easy & simple
    const copy = [...arr];
    copy[index] = newValue;
    return copy;
  };
