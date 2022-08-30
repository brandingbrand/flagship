// CREDIT: https://github.com/mokkabonna/json-schema-compare
// MIT

import { intersectionWith, toArray, unique, uniqueWith } from '@brandingbrand/standard-array';
import { defaults, isPlainObject } from '@brandingbrand/standard-object';

import isEqual from 'fast-deep-equal';

import type { JSONSchemaCreate, JSONSchemaCreateDefinition } from './types';

const undef = <T>(val: T | undefined): val is undefined => val === undefined;

const emptySchema = (schema: unknown): schema is true | {} | undefined =>
  undef(schema) || isEqual(schema, {}) || schema === true;

const isSchema = (val: unknown): val is JSONSchemaCreateDefinition | undefined =>
  undef(val) || isPlainObject(val) || val === true || val === false;

const keys = (obj: unknown) => (isPlainObject(obj) || Array.isArray(obj) ? Object.keys(obj) : []);

const has = <K extends string>(obj: object, key: K): obj is Record<K, unknown> =>
  obj.hasOwnProperty(key);

const stringArray = (arr: string[] | undefined) => (arr ? unique(arr).sort() : []);

const undefEmpty = (val: unknown) => undef(val) || (Array.isArray(val) && val.length === 0);

const keyValEqual = (
  a: object | undefined,
  b: object | undefined,
  key: string,
  compare: (a: unknown, b: unknown) => boolean
) => b && has(b, key) && a && has(a, key) && compare(a[key], b[key]);

const undefAndZero = (a: unknown, b: unknown) =>
  (undef(a) && b === 0) || (undef(b) && a === 0) || isEqual(a, b);

const falseUndefined = (a: unknown, b: unknown) =>
  (undef(a) && b === false) || (undef(b) && a === false) || isEqual(a, b);

const emptyObjUndef = (schema: unknown): schema is {} | undefined =>
  undef(schema) || isEqual(schema, {});

const undefArrayEqual = (a: string[] | undefined, b: string[] | undefined) => {
  if (undefEmpty(a) && undefEmpty(b)) {
    return true;
  }
  return isEqual(stringArray(a), stringArray(b));
};

const unsortedNormalizedArray = (a: string[] | string, b: string[] | string) => {
  a = toArray(a);
  b = toArray(b);
  return isEqual(stringArray(a), stringArray(b));
};

const schemaGroup = (
  a: object | undefined,
  b: object | undefined,
  key: string,
  compare: (a: unknown, b: unknown) => boolean
) => {
  const allProps = unique(keys(a).concat(keys(b)));
  if (emptyObjUndef(a) && emptyObjUndef(b)) {
    return true;
  } else if (emptyObjUndef(a) && keys(b).length > 0) {
    return false;
  } else if (emptyObjUndef(b) && keys(a).length > 0) {
    return false;
  }

  return allProps.every((key) => {
    const aVal = (a as object)[key as keyof typeof a];
    const bVal = (b as object)[key as keyof typeof b];
    if (Array.isArray(aVal) && Array.isArray(bVal)) {
      return isEqual(stringArray(a as string[]), stringArray(b as string[]));
    } else if (Array.isArray(aVal) && !Array.isArray(bVal)) {
      return false;
    } else if (Array.isArray(bVal) && !Array.isArray(aVal)) {
      return false;
    }
    return keyValEqual(a, b, key, compare);
  });
};

const items = (
  a: unknown,
  b: unknown,
  key: string,
  compare: (a: unknown, b: unknown) => boolean
) => {
  if (isPlainObject(a) && isPlainObject(b)) {
    return compare(a, b);
  } else if (Array.isArray(a) && Array.isArray(b)) {
    return schemaGroup(a, b, key, compare);
  }
  return isEqual(a, b);
};

const unsortedArray = (
  a: unknown[],
  b: unknown[],
  key: string,
  compare: (a: unknown, b: unknown) => boolean
) => {
  const uniqueA = uniqueWith(a, compare);
  const uniqueB = uniqueWith(b, compare);
  const inter = intersectionWith(compare, uniqueA, uniqueB);
  return inter.length === Math.max(uniqueA.length, uniqueB.length);
};

const comparers = {
  title: isEqual,
  uniqueItems: falseUndefined,
  minLength: undefAndZero,
  minItems: undefAndZero,
  minProperties: undefAndZero,
  required: undefArrayEqual,
  enum: undefArrayEqual,
  type: unsortedNormalizedArray,
  items,
  anyOf: unsortedArray,
  allOf: unsortedArray,
  oneOf: unsortedArray,
  properties: schemaGroup,
  patternProperties: schemaGroup,
  dependencies: schemaGroup,
};
type ComparerKey = keyof typeof comparers;

const acceptsUndefined = [
  'properties',
  'patternProperties',
  'dependencies',
  'uniqueItems',
  'minLength',
  'minItems',
  'minProperties',
  'required',
] as const;
type AcceptsUndefinedKey = typeof acceptsUndefined[number];

const schemaProps = [
  'additionalProperties',
  'additionalItems',
  'contains',
  'propertyNames',
  'not',
] as const;
type SchemaPropKey = typeof schemaProps[number];

export interface CompareOptions {
  ignore: string[];
}

export const compare = (
  a: unknown | undefined,
  b: unknown | undefined,
  options?: CompareOptions
): boolean => {
  const opts = defaults(options ?? {}, {
    ignore: [] as string[],
  });

  if (emptySchema(a) && emptySchema(b)) {
    return true;
  }

  if (!isSchema(a) || !isSchema(b)) {
    throw new Error('Either of the values are not a JSON schema.');
  }

  if (a === b) {
    return true;
  }

  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return a === b;
  }

  if ((a === undefined && b === false) || (b === undefined && a === false)) {
    return false;
  }

  if ((undef(a) && !undef(b)) || (!undef(a) && undef(b))) {
    return false;
  }

  if (typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  let allKeys = unique(Object.keys(a).concat(Object.keys(b)));

  if (opts.ignore.length > 0) {
    allKeys = allKeys.filter((k) => !opts.ignore.includes(k));
  }

  if (allKeys.length === 0) {
    return true;
  }

  const innerCompare = (a: unknown | undefined, b: unknown | undefined) => compare(a, b, options);

  return allKeys.every((key) => {
    const aValue = a[key as keyof JSONSchemaCreate];
    const bValue = b[key as keyof JSONSchemaCreate];

    if (schemaProps.includes(key as SchemaPropKey)) {
      type SchemaProp = typeof a[typeof schemaProps[number]];
      return compare(aValue as SchemaProp, bValue as SchemaProp, options);
    }

    const comparer = comparers[key as ComparerKey] ?? isEqual;

    // do simple equality check first
    if (isEqual(aValue, bValue)) {
      return true;
    }

    if (
      !acceptsUndefined.includes(key as AcceptsUndefinedKey) &&
      ((!has(a, key) && has(b, key)) || (has(a, key) && !has(b, key)))
    ) {
      return aValue === bValue;
    }

    const result = comparer(aValue, bValue, key, innerCompare);

    if (typeof result !== 'boolean') {
      throw new TypeError('Comparer must return true or false');
    }

    return result;
  });
};
