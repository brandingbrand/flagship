// CREDIT: https://github.com/mokkabonna/json-schema-merge-allof
// MIT

import type {
  JSONSchema7,
  JSONSchema7Array,
  JSONSchema7Definition,
  JSONSchema7Object,
} from 'json-schema';
import type { MergeSchemas, Resolver } from './resolver.type';

import { intersection, intersectionWith, unique, uniqueWith } from '@brandingbrand/standard-array';
import { leastCommonMultiple } from '@brandingbrand/standard-math';
import { cloneDeep, isPlainObject } from '@brandingbrand/standard-object';

import isEqual from 'fast-deep-equal';

import { compare } from '../compare.util';
import {
  getValues,
  isSchema,
  isSchemaDefinition,
  allUniqueKeys,
  notUndefined,
  isFalse,
  isTrue,
  stringArray,
} from './common';

import * as propertiesResolver from './complex-resolvers/properties';
import * as itemsResolver from './complex-resolvers/items';

const schemaResolver = <T extends JSONSchema7Definition | undefined>(
  compacted: T[],
  key: (number | string)[],
  mergeSchemas: MergeSchemas
): T => mergeSchemas(compacted.filter(notUndefined) as JSONSchema7Definition[]) as T;

const createRequiredMetaArray = <T>(arr: T[]) => {
  return { required: arr };
};

const getAnyOfCombinations = <T>(arrOfArrays: T[][], combinations?: T[][]): T[][] => {
  combinations = combinations || [];
  if (!arrOfArrays.length) {
    return combinations;
  }

  const values = arrOfArrays.slice(0).shift() ?? [];
  const rest = arrOfArrays.slice(1);
  if (combinations.length) {
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
) => {
  return schemaGroups
    .map((schemas, index) => {
      try {
        return mergeSchemas(schemas, [index]);
      } catch (e) {
        return undefined;
      }
    })
    .filter(notUndefined);
};

// resolvers
const first = <T>(compacted: T[]) => compacted[0];
const required: Resolver<string[]> = (compacted) => stringArray(compacted);
const maximumValue: Resolver<number> = (compacted) => Math.max(...compacted);
const minimumValue: Resolver<number> = (compacted) => Math.min(...compacted);
const uniqueItems: Resolver<boolean> = (compacted) => compacted.some(isTrue);
const examples: Resolver<string | number | boolean | JSONSchema7Object | JSONSchema7Array> = (
  compacted
) => uniqueWith(compacted.flat(), isEqual);

const oneOf: Resolver<JSONSchema7Definition[]> = (compacted, paths, mergeSchemas) => {
  const combinations = getAnyOfCombinations(cloneDeep(compacted));
  const result = tryMergeSchemaGroups(combinations, mergeSchemas);
  const unique = uniqueWith(result, compare);

  if (unique.length) {
    return unique;
  }

  return;
};

const definitions: Resolver<{
  [key: string]: JSONSchema7Definition;
}> = (compacted, paths, mergeSchemas) => {
  const allChildren = allUniqueKeys(compacted) as string[];

  return allChildren.reduce((all, childKey) => {
    const childSchemas = getValues(compacted, childKey);
    let innerCompacted = uniqueWith(childSchemas.filter(notUndefined), isEqual);
    innerCompacted = uniqueWith(innerCompacted, compare);
    all[childKey] = mergeSchemas(innerCompacted as JSONSchema7[], [
      childKey,
    ]) as JSONSchema7Definition;
    return all;
  }, {} as Record<string, JSONSchema7Definition>);
};

const dependencies: Resolver<{
  [key: string]: JSONSchema7Definition | string[];
}> = (compacted, paths, mergeSchemas) => {
  const allChildren = allUniqueKeys(compacted) as string[];

  return allChildren.reduce((all, childKey) => {
    const childSchemas = getValues(compacted, childKey);
    let innerCompacted = uniqueWith(childSchemas.filter(notUndefined), isEqual);

    // to support dependencies
    const innerArrays = innerCompacted.filter((compacted): compacted is string[] =>
      Array.isArray(compacted)
    );

    if (innerArrays.length) {
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
  }, {} as Record<string, JSONSchema7Definition | string[]>);
};

const compareProp = (key: string) => {
  return <T>(a: T, b: T) => compare({ [key]: a }, { [key]: b });
};

const getAllOf = (schema: JSONSchema7Definition): JSONSchema7Definition[] => {
  if (typeof schema !== 'object') {
    return [schema];
  }

  const { allOf = [], ...copy } = schema;
  return [copy, ...allOf.flatMap(getAllOf)];
};

const throwIncompatible = (values: unknown[], paths: (string | number)[]) => {
  let asJSON;
  try {
    asJSON = values
      .map((val) => {
        return JSON.stringify(val, null, 2);
      })
      .join('\n');
  } catch (variable) {
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
      const normalized = compacted.map(function (val) {
        return Array.isArray(val) ? val : [val];
      });
      const common = intersection(...normalized);

      if (common.length === 1) {
        return common[0];
      } else if (common.length > 1) {
        return unique(common);
      }
    }

    return;
  },
  dependencies,
  oneOf,
  not(compacted) {
    return { anyOf: compacted };
  },
  pattern(compacted) {
    return compacted.map((r) => '(?=' + r + ')').join('');
  },
  multipleOf(compacted: number[]) {
    let integers = [...compacted];
    let factor = 1;

    if (integers.length < 2) {
      return integers[0];
    }

    while (integers.some((n) => !Number.isInteger(n))) {
      integers = integers.map((n) => n * 10) as [number, number, ...number[]];
      factor = factor * 10;
    }

    return leastCommonMultiple(...(integers as [number, number, ...number[]])) / factor;
  },
  enum(compacted) {
    const enums = intersectionWith(isEqual, ...compacted);
    if (enums.length) {
      return enums.sort();
    }

    return;
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
    parents?: (number | string)[]
  ) => JSONSchema7Definition | undefined,
  parents: (string | number)[]
) => {
  if (complexKeywords.length) {
    const resolverConfig = complexResolvers[resolverName];

    if (!resolverConfig || !resolverConfig.resolver) {
      throw new Error('No resolver found for ' + resolverName);
    }

    // extract all keywords from all the schemas that have one or more
    // then remove all undefined ones and not unique
    const extractedKeywordsOnly = schemas.map((schema) =>
      complexKeywords.reduce((all, key) => {
        if (schema[key] !== undefined) all[key] = schema[key] as any;
        return all;
      }, {} as JSONSchema7)
    );

    const unique = uniqueWith(extractedKeywordsOnly, compare);

    // create mergers that automatically add the path of the keyword for use in the complex resolver
    const mergers = (resolverConfig.keywords as readonly ComplexResolverKey[]).reduce(
      (all, key) => ({
        ...all,
        [key]: (schemas: JSONSchema7Definition[], extraKey: (number | string)[] = []) =>
          mergeSchemas(schemas, null, [...parents, key, ...extraKey]),
      }),
      {} as Record<ComplexResolverKey, MergeSchemas>
    );

    const result = resolverConfig.resolver(unique, [...parents, resolverName], mergers);

    if (!isPlainObject(result)) {
      throwIncompatible(unique, [...parents, resolverName]);
    }

    return result;
  }

  return;
};

export const mergeAllOf = (
  rootSchema: JSONSchema7Definition,
  totalSchemas: JSONSchema7[] = []
): JSONSchema7Definition => {
  const mergeSchemas = (
    schemas: JSONSchema7Definition[],
    base?: JSONSchema7Definition | null,
    parents: (number | string)[] = []
  ): JSONSchema7Definition | undefined => {
    schemas = cloneDeep(schemas.filter(notUndefined));
    const merged = isPlainObject(base) ? base : {};

    // return undefined, an empty schema
    if (!schemas.length) {
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
      <T>(key: T | ComplexResolverKey): key is T =>
        !complexKeys.some((keys) => keys.includes(key as ComplexResolverKey))
    );

    // call all simple resolvers for relevant keywords
    simpleKeys.forEach((key) => {
      const values = getValues(definedSchemas, key);
      const compacted = uniqueWith(values.filter(notUndefined), compareProp(key));

      // arrayProps like anyOf and oneOf must be merged first, as they include schemas
      // allOf is treated differently altogether
      if (compacted.length === 1 && isSchemaArrayKey(key)) {
        merged[key] = (compacted as JSONSchema7[SchemaArrayKey][])[0]
          ?.map((schema) => mergeSchemas([schema], schema))
          .filter(notUndefined);
        // prop groups must always be resolved
      } else if (compacted.length === 1 && !isSchemaGroupKey(key) && !isSchemaPropsKey(key)) {
        merged[key] = compacted[0] as any;
      } else {
        const resolver = resolvers[key];
        if (!resolver) throw new Error(`No resolver found for key ${key}.`);

        const merger = (schemas: JSONSchema7Definition[], extraKey: (number | string)[] = []) =>
          mergeSchemas(schemas, null, [...parents, key, ...extraKey]);

        merged[key] = resolver(compacted as any, [...parents, key], merger) as any;

        if (merged[key] === undefined) {
          throwIncompatible(compacted, [...parents, key]);
        }
      }
    });

    return Object.keys(complexResolvers).reduce(
      (all, resolverKeyword, index) => ({
        ...all,
        ...callGroupResolver(
          complexKeys[index],
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
