if (!Object.fromEntries) {
  Object.fromEntries = <T>(arr: Iterable<readonly [PropertyKey, T]>) =>
    [...arr].reduce<Record<PropertyKey, T>>((acc, curr) => {
      acc[curr[0]] = curr[1];
      return acc;
    }, {});
}
