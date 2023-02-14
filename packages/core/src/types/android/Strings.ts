export type String$Attributes = {
  name: string;
};

export type String$ = {
  $: String$Attributes;
  _: string;
};

export type Item = {
  _: string;
};

export type StringArrayAttributes = {
  name: string;
};

export type StringArrayElements = {
  item: Item[];
};

export type StringArray = {
  $: StringArrayAttributes;
} & StringArrayElements;

export type PluralsItemAttribute = {
  quantity: "zero" | "one" | "two" | "few" | "many" | "other";
};

export type PluralsItem = {
  $: PluralsItemAttribute;
  _: string;
};

export type PluralsAttributes = {
  name: string;
};

export type PluralsElements = {
  item: PluralsItem[];
};

export type Plurals = {
  $: PluralsAttributes;
} & PluralsElements;

export type StringsElements = {
  string?: String$[];
  "string-array"?: StringArray[];
  plurals?: Plurals[];
};

export type Strings = {
  resources: StringsElements;
};
