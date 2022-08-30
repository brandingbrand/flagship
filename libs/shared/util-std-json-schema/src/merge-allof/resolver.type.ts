import type { JSONSchemaCreate, JSONSchemaCreateDefinition } from '../types';

export type MergeSchemas = (
  schemas: JSONSchemaCreateDefinition[],
  parents?: Array<number | string>
) => JSONSchemaCreateDefinition | undefined;

export type Resolver<T> = (
  compacted: T[],
  paths: Array<number | string>,
  mergeSchemas: MergeSchemas
) => T | undefined;

type Merges<K extends keyof JSONSchemaCreate> = {
  [Key in K]: MergeSchemas;
};

export type ComplexResolver<K extends keyof JSONSchemaCreate> = (
  values: JSONSchemaCreate[],
  parents: Array<number | string>,
  mergers: Merges<K>
) => JSONSchemaCreate;
