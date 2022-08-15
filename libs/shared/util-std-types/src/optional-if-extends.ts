export type OptionalIfExtends<
  Type,
  BaseType,
  ExtendsType,
  KeyType extends keyof Type
> = ExtendsType extends BaseType ? Omit<Type, KeyType> & Partial<Pick<Type, KeyType>> : Type;
