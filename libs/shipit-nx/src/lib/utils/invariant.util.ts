/**
 * Use invariant() to assert state which your program assumes to be true.
 * It is intended to indicate a programmer error for a condition that should
 * never occur.
 *
 * @param condition the condition which is asserted to be true
 * @param message the error if that assertion is not true
 * @throws if the condition is false
 */
export const invariant = (condition: boolean, message: string): void => {
  if (condition) return;

  const error = new Error(message);
  error.name = 'Invariant Violation';

  throw error;
};
