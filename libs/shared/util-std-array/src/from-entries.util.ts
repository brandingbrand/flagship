export const fromEntries = <T>(prev: { [key: string]: T }, [key, value]: readonly [string, T]) => ({
  ...prev,
  [key]: value,
});
