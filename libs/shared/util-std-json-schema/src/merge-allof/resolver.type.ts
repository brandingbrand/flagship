import { JSONSchema7, JSONSchema7Definition } from 'json-schema';

export type MergeSchemas = (
  schemas: JSONSchema7Definition[],
  parents?: (number | string)[]
) => JSONSchema7Definition | undefined;

export type Resolver<T> = (
  compacted: T[],
  paths: (number | string)[],
  mergeSchemas: MergeSchemas
) => T | undefined;

type Merges<K extends keyof JSONSchema7> = {
  [Key in K]: MergeSchemas;
};

export type ComplexResolver<K extends keyof JSONSchema7> = (
  values: JSONSchema7[],
  parents: (string | number)[],
  mergers: Merges<K>
) => JSONSchema7;
