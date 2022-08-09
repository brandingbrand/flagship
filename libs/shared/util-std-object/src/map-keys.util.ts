export const mapKeys = <ItemType, KeyType extends PropertyKey, ResultType extends PropertyKey>(
  object: Record<KeyType, ItemType>,
  predicate: (item: ItemType, key: KeyType, index: number) => ResultType
): Record<ResultType, ItemType> => {
  const entries = Object.entries(object) as Array<[KeyType, ItemType]>;
  const updatedEntries = entries.map(
    ([key, value], index) => [predicate(value, key, index), value] as const
  );

  return Object.fromEntries(updatedEntries) as Record<ResultType, ItemType>;
};
