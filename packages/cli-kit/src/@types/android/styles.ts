export type ItemAttributes = {
  name: string;
};

export type StyleItem = {
  $: ItemAttributes;
  _: string;
};

export type StyleAttributes = {
  name: string;
  parent?: string;
};

export type StyleElements = {
  item?: StyleItem[];
};

export type Style = {
  $: StyleAttributes;
} & StyleElements;

export type ResourceStyles = {
  resources: {
    style: Style[];
  };
};

export type Styles = {
  appThemeAttributes?: Partial<StyleAttributes>;
  appThemeElements?: StyleElements;
};
