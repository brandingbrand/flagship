export type NonEmptyArray<Element> = Element[] & {
  0: Element;
};
