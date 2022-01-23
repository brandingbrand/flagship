export const sortObject = <T extends Record<PropertyKey, unknown>>(unorderedObject: T) => {
  return Object.keys(unorderedObject)
    .sort()
    .reduce((aggregate: T, key: keyof T) => {
      aggregate[key] = unorderedObject[key];

      return aggregate;
    }, {} as T);
};
