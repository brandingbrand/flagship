export type ItemAttributes = {
  name: string;
};

export type Item = {
  $: ItemAttributes;
  _: string;
};

export type StyleAttributes = {
  name: string;
  parent?: string;
};

export type StyleElements = {
  item?: Item[];
};

export type Style = {
  $: StyleAttributes;
} & StyleElements;

export type Styles = {
  resources: {
    style: Style[];
  };
};
