export interface List {
  type: string;
  data: {
    type: string;
    trees: Tree[];
  };
}

interface Tree {
  name?: string;
  children?: Tree[];
  hint?: string | null;
  color?: string;
  depth?: number;
}
