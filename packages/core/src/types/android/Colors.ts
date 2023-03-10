export type ColorAttributes = {
  name: string;
};

export type Color = {
  $: ColorAttributes;
  _: string;
};

export type ColorsElements = {
  color?: Color[];
};

export type Colors = {
  resources: ColorsElements;
};
