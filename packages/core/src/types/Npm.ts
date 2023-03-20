export interface List {
  version: string;
  name: string;
  dependencies: Dependencies;
}

export interface Dependencies {
  [key: string]: {
    version: string;
    resolved: string;
    overridden: boolean;
    dependencies?: Dependencies;
  };
}
