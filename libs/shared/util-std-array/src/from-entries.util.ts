export const fromEntries = <T>(prev: Record<string, T>, [key, value]: readonly [string, T]) => ({
  ...prev,
  [key]: value,
});
