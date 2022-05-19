import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';

export type MergeSchemas = (
  schemas: JSONSchema7Definition[],
  parents?: Array<number | string>
) => JSONSchema7Definition | undefined;

export type Resolver<T> = (
  compacted: T[],
  paths: Array<number | string>,
  mergeSchemas: MergeSchemas
) => T | undefined;

type Merges<K extends keyof JSONSchema7> = {
  [Key in K]: MergeSchemas;
};

export type ComplexResolver<K extends keyof JSONSchema7> = (
  values: JSONSchema7[],
  parents: Array<number | string>,
  mergers: Merges<K>
) => JSONSchema7;
