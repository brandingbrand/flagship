export const removeAtIndex =
  (index: number) =>
  <T>(arr: T[]): T[] => {
    // using mutability for performance boost & because it's easy & simple
    const copy = [...arr];
    copy.splice(index, 1);
    return copy;
  };
