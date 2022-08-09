export const mapValues = <ItemType, KeyType extends PropertyKey, ResultType>(
  object: Record<KeyType, ItemType>,
  predicate: (item: ItemType, key: KeyType, index: number) => ResultType
): Record<KeyType, ResultType> => {
  const entries = Object.entries(object) as Array<[KeyType, ItemType]>;
  const updatedEntries = entries.map(
    ([key, value], index) => [key, predicate(value, key, index)] as const
  );

  return Object.fromEntries(updatedEntries) as Record<KeyType, ResultType>;
};
