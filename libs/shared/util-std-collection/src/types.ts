export type Combinable<Element> = {
  combine: (valueA: Element, valueB: Element) => Element;
};

export type CombinableWithEmpty<Element> = Combinable<Element> & {
  empty: Element;
};
