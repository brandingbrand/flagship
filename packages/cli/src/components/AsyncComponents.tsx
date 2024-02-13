export async function promiseFn() {
  const ink = await import("ink");
  const Spinner = (await import("ink-spinner")).default;

  return {
    ...ink,
    Spinner,
  };
}
