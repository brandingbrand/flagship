export type OptionalIfExtends<Type, Base, Extends, Key extends keyof Type> = Extends extends Base
  ? Omit<Type, Key> & Partial<Pick<Type, Key>>
  : Type;
