// CREDIT: https://github.com/mokkabonna/json-schema-merge-allof
// MIT

import { intersection, intersectionWith, unique, uniqueWith } from '@brandingbrand/standard-array';
import { leastCommonMultiple } from '@brandingbrand/standard-math';
import { cloneDeep, isPlainObject } from '@brandingbrand/standard-object';

import isEqual from 'fast-deep-equal';
import type {
  JSONSchema7,
  JSONSchema7Array,
  JSONSchema7Definition,
  JSONSchema7Object,
} from 'json-schema';

import { compare } from '../compare.util';

import {
  allUniqueKeys,
  getValues,
  isFalse,
  isSchema,
  isSchemaDefinition,
  isTrue,
  notUndefined,
  stringArray,
} from './common';
import * as itemsResolver from './complex-resolvers/items';
import * as propertiesResolver from './complex-resolvers/properties';
import type { MergeSchemas, Resolver } from './resolver.type';

const schemaResolver = <T extends JSONSchema7Definition | undefined>(
  compacted: T[],
  key: Array<number | string>,
  mergeSchemas: MergeSchemas
): T => mergeSchemas(compacted.filter(notUndefined) as JSONSchema7Definition[]) as T;

const createRequiredMetaArray = <T>(arr: T[]) => ({ required: arr });

const getAnyOfCombinations = <T>(arrOfArrays: T[][], combinations?: T[][]): T[][] => {
  combinations = combinations || [];
  if (arrOfArrays.length === 0) {
    return combinations;
  }

  const values = [...arrOfArrays].shift() ?? [];
  const rest = arrOfArrays.slice(1);
  if (combinations.length > 0) {
    return getAnyOfCombinations(
      rest,
      combinations.flatMap((combination) => values.map((item) => [item, ...combination]))
    );
  }

  return getAnyOfCombinations(
    rest,
    values.map((item) => [item])
  );
};

const tryMergeSchemaGroups = (
  schemaGroups: JSONSchema7Definition[][],
  mergeSchemas: MergeSchemas
) =>
  schemaGroups
    .map((schemas, index) => {
      try {
        return mergeSchemas(schemas, [index]);
      } catch {
        return undefined;
      }
    })
    .filter(notUndefined);

// resolvers
const first = <T>(compacted: T[]) => compacted[0];
const required: Resolver<string[]> = (compacted) => stringArray(compacted);
const maximumValue: Resolver<number> = (compacted) => Math.max(...compacted);
const minimumValue: Resolver<number> = (compacted) => Math.min(...compacted);
const uniqueItems: Resolver<boolean> = (compacted) => compacted.some(isTrue);
const examples: Resolver<JSONSchema7Array | JSONSchema7Object | boolean | number | string> = (
  compacted
) => uniqueWith(compacted.flat(), isEqual);

const oneOf: Resolver<JSONSchema7Definition[]> = (compacted, paths, mergeSchemas) => {
  const combinations = getAnyOfCombinations(cloneDeep(compacted));
  const result = tryMergeSchemaGroups(combinations, mergeSchemas);
  const unique = uniqueWith(result, compare);

  if (unique.length > 0) {
    return unique;
  }

  return undefined;
};

const definitions: Resolver<Record<string, JSONSchema7Definition>> = (
  compacted,
  paths,
  mergeSchemas
) => {
  const allChildren = allUniqueKeys(compacted);

  return allChildren.reduce<Record<string, JSONSchema7Definition>>((all, childKey) => {
    const childSchemas = getValues(compacted, childKey);
    let innerCompacted = uniqueWith(childSchemas.filter(notUndefined), isEqual);
    innerCompacted = uniqueWith(innerCompacted, compare);
    all[childKey] = mergeSchemas(innerCompacted as JSONSchema7[], [
      childKey,
    ]) as JSONSchema7Definition;
    return all;
  }, {});
};

const dependencies: Resolver<Record<string, JSONSchema7Definition | string[]>> = (
  compacted,
  paths,
  mergeSchemas
) => {
  const allChildren = allUniqueKeys(compacted);

  return allChildren.reduce<Record<string, JSONSchema7Definition | string[]>>((all, childKey) => {
    const childSchemas = getValues(compacted, childKey);
    let innerCompacted = uniqueWith(childSchemas.filter(notUndefined), isEqual);

    // to support dependencies
    const innerArrays = innerCompacted.filter((compacted): compacted is string[] =>
      Array.isArray(compacted)
    );

    if (innerArrays.length > 0) {
      if (innerArrays.length === innerCompacted.length) {
        all[childKey] = stringArray(innerCompacted as string[][]);
      } else {
        const innerSchemas = innerCompacted.filter(isSchemaDefinition);
        const arrayMetaSchemas = innerArrays.map(createRequiredMetaArray);
        all[childKey] = mergeSchemas(innerSchemas.concat(arrayMetaSchemas), [
          childKey,
        ]) as JSONSchema7Definition;
      }
      return all;
    }

    innerCompacted = uniqueWith(innerCompacted, compare);

    all[childKey] = mergeSchemas(innerCompacted as JSONSchema7[], [
      childKey,
    ]) as JSONSchema7Definition;
    return all;
  }, {});
};

const compareProp =
  (key: string) =>
  <T>(a: T, b: T) =>
    compare({ [key]: a }, { [key]: b });

const getAllOf = (schema: JSONSchema7Definition): JSONSchema7Definition[] => {
  if (typeof schema !== 'object') {
    return [schema];
  }

  const { allOf = [], ...copy } = schema;
  return [copy, ...allOf.flatMap(getAllOf)];
};

const throwIncompatible = (values: unknown[], paths: Array<number | string>) => {
  let asJSON;
  try {
    asJSON = values.map((val) => JSON.stringify(val, null, 2)).join('\n');
  } catch {
    asJSON = values.join(', ');
  }
  throw new Error(
    `Could not resolve values for path:"${paths.join('.')}". They are probably incompatible. Values:
${asJSON}`
  );
};

const schemaArrays = ['anyOf', 'oneOf'] as const;
type SchemaArrayKey = typeof schemaArrays[number];
const isSchemaArrayKey = (key: keyof JSONSchema7): key is SchemaArrayKey =>
  schemaArrays.includes(key as SchemaArrayKey);

const schemaGroupProps = [
  'properties',
  'patternProperties',
  'definitions',
  'dependencies',
] as const;
type SchemaGroupKey = typeof schemaGroupProps[number];
const isSchemaGroupKey = (key: keyof JSONSchema7): key is SchemaGroupKey =>
  schemaGroupProps.includes(key as SchemaGroupKey);

const schemaProps = [
  'additionalProperties',
  'additionalItems',
  'contains',
  'propertyNames',
  'not',
  'items',
] as const;
type SchemaPropsKey = typeof schemaProps[number];
const isSchemaPropsKey = (key: keyof JSONSchema7): key is SchemaPropsKey =>
  schemaProps.includes(key as SchemaPropsKey);

type Resolvers = {
  [K in keyof JSONSchema7]: Resolver<NonNullable<JSONSchema7[K]>>;
};

const resolvers: Resolvers = {
  type(compacted) {
    if (compacted.some(Array.isArray)) {
      const normalized = compacted.map((val) => (Array.isArray(val) ? val : [val]));
      const common = intersection(...normalized);

      if (common.length === 1) {
        return common[0];
      } else if (common.length > 1) {
        return unique(common);
      }
    }

    return undefined;
  },
  dependencies,
  oneOf,
  not(compacted) {
    return { anyOf: compacted };
  },
  pattern(compacted) {
    return compacted.map((r) => `(?=${r})`).join('');
  },
  multipleOf(compacted: number[]) {
    let integers = [...compacted];
    let factor = 1;

    if (integers.length < 2) {
      return integers[0];
    }

    while (integers.some((n) => !Number.isInteger(n))) {
      integers = integers.map((n) => n * 10) as [number, number, ...number[]];
      factor *= 10;
    }

    return leastCommonMultiple(...(integers as [number, number, ...number[]])) / factor;
  },
  enum(compacted) {
    const enums = intersectionWith(isEqual, ...compacted);
    if (enums.length > 0) {
      return enums.sort();
    }

    return undefined;
  },
  $id: first,
  $ref: first,
  $schema: first,
  additionalItems: schemaResolver,
  additionalProperties: schemaResolver,
  anyOf: oneOf,
  contains: schemaResolver,
  default: first,
  definitions,
  description: first,
  examples,
  exclusiveMaximum: minimumValue,
  exclusiveMinimum: maximumValue,
  maximum: minimumValue,
  maxItems: minimumValue,
  maxLength: minimumValue,
  maxProperties: minimumValue,
  minimum: maximumValue,
  minItems: maximumValue,
  minLength: maximumValue,
  minProperties: maximumValue,
  propertyNames: schemaResolver,
  required,
  title: first,
  uniqueItems,
};

const complexResolvers = {
  properties: propertiesResolver,
  items: itemsResolver,
};
type ComplexResolvers = typeof complexResolvers;
type ComplexResolverKey = ComplexResolvers[keyof ComplexResolvers]['keywords'][number];

const callGroupResolver = (
  complexKeywords: ComplexResolverKey[],
  resolverName: keyof typeof complexResolvers,
  schemas: JSONSchema7[],
  mergeSchemas: (
    schemas: JSONSchema7Definition[],
    base?: JSONSchema7Definition | null,
    parents?: Array<number | string>
  ) => JSONSchema7Definition | undefined,
  parents: Array<number | string>
) => {
  if (complexKeywords.length > 0) {
    const resolverConfig = complexResolvers[resolverName];

    if (!resolverConfig || !resolverConfig.resolver) {
      throw new Error(`No resolver found for ${resolverName}`);
    }

    // extract all keywords from all the schemas that have one or more
    // then remove all undefined ones and not unique
    const extractedKeywordsOnly = schemas.map((schema) =>
      complexKeywords.reduce<JSONSchema7>((all, key) => {
        if (schema[key] !== undefined) {
          all[key] = schema[key] as any;
        }
        return all;
      }, {})
    );

    const unique = uniqueWith(extractedKeywordsOnly, compare);

    // create mergers that automatically add the path of the keyword for use in the complex resolver
    const mergers = Object.fromEntries(
      (resolverConfig.keywords as readonly ComplexResolverKey[]).map((key) => [
        key,
        (schemas: JSONSchema7Definition[], extraKey: Array<number | string> = []) =>
          mergeSchemas(schemas, null, [...parents, key, ...extraKey]),
      ])
    ) as Record<ComplexResolverKey, MergeSchemas>;

    const result = resolverConfig.resolver(unique, [...parents, resolverName], mergers);

    if (!isPlainObject(result)) {
      throwIncompatible(unique, [...parents, resolverName]);
    }

    return result;
  }

  return undefined;
};

export const mergeAllOf = (
  rootSchema: JSONSchema7Definition,
  totalSchemas: JSONSchema7[] = []
): JSONSchema7Definition => {
  const mergeSchemas = (
    schemas: JSONSchema7Definition[],
    base?: JSONSchema7Definition | null,
    parents: Array<number | string> = []
  ): JSONSchema7Definition | undefined => {
    schemas = cloneDeep(schemas.filter(notUndefined));
    const merged = isPlainObject(base) ? base : {};

    // return undefined, an empty schema
    if (schemas.length === 0) {
      return undefined;
    }

    if (schemas.some(isFalse)) {
      return false;
    }

    if (schemas.every(isTrue)) {
      return true;
    }

    const definedSchemas = schemas.filter(isSchema);

    const allKeys = allUniqueKeys(definedSchemas);
    if (allKeys.includes('allOf')) {
      return mergeAllOf(
        {
          allOf: definedSchemas,
        },
        totalSchemas
      );
    }

    const complexKeys = Object.values(complexResolvers).map((resolverConfig) =>
      allKeys.filter((key): key is ComplexResolverKey =>
        (resolverConfig.keywords as readonly ComplexResolverKey[]).includes(
          key as ComplexResolverKey
        )
      )
    );

    const simpleKeys = allKeys.filter(
      <T>(key: ComplexResolverKey | T): key is T =>
        !complexKeys.some((keys) => keys.includes(key as ComplexResolverKey))
    );

    // call all simple resolvers for relevant keywords
    for (const key of simpleKeys) {
      const values = getValues(definedSchemas, key);
      const compacted = uniqueWith(values.filter(notUndefined), compareProp(key));

      // arrayProps like anyOf and oneOf must be merged first, as they include schemas
      // allOf is treated differently altogether
      if (compacted.length === 1 && isSchemaArrayKey(key)) {
        merged[key] = (compacted as Array<JSONSchema7[SchemaArrayKey]>)[0]
          ?.map((schema) => mergeSchemas([schema], schema))
          .filter(notUndefined);
        // prop groups must always be resolved
      } else if (compacted.length === 1 && !isSchemaGroupKey(key) && !isSchemaPropsKey(key)) {
        merged[key] = compacted[0] as any;
      } else {
        const resolver = resolvers[key];
        if (!resolver) {
          throw new Error(`No resolver found for key ${key}.`);
        }

        const merger = (schemas: JSONSchema7Definition[], extraKey: Array<number | string> = []) =>
          mergeSchemas(schemas, null, [...parents, key, ...extraKey]);

        merged[key] = resolver(compacted as any, [...parents, key], merger) as any;

        if (merged[key] === undefined) {
          throwIncompatible(compacted, [...parents, key]);
        }
      }
    }

    return Object.keys(complexResolvers).reduce(
      (all, resolverKeyword, index) => ({
        ...all,
        ...callGroupResolver(
          complexKeys[index] as Array<
            | 'additionalItems'
            | 'additionalProperties'
            | 'items'
            | 'patternProperties'
            | 'properties'
          >,
          resolverKeyword as keyof typeof complexResolvers,
          definedSchemas,
          mergeSchemas,
          parents
        ),
      }),
      merged
    );
  };

  const allSchemas = getAllOf(rootSchema);
  const merged = mergeSchemas(allSchemas);

  return isSchemaDefinition(merged) ? merged : {};
};
