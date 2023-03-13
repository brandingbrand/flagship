export interface List {
  type: string;
  data: {
    type: string;
    trees: Tree[];
  };
}

export interface Tree {
  name?: string;
  children?: Tree[];
  hint?: string | null;
  color?: string;
  depth?: number;
}
