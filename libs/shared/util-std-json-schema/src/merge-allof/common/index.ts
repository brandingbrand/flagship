import { unique, without } from '@brandingbrand/standard-array';
import { isPlainObject } from '@brandingbrand/standard-object';

import type { JSONSchemaCreate, JSONSchemaCreateDefinition } from '../../types';

export const indexes = (array: unknown[]) => Object.keys(array).map(Number);

export const keys = <T>(obj: T): Array<keyof T> => {
  if (isPlainObject(obj)) {
    return Object.keys(obj) as Array<keyof T>;
  }
  return [];
};

export const allUniqueKeys = <T>(arr: T[]): T extends unknown[] ? number[] : Array<keyof T> =>
  unique(
    arr.flatMap<number | keyof T>((object) =>
      Array.isArray(object) ? indexes(object) : keys(object)
    )
  ) as T extends unknown[] ? number[] : Array<keyof T>;

export const withoutArray = <T>(arr: T[], ...rest: T[][]) => without(arr, ...rest.flat());

export const getValues = <T>(schemas: T[], key: keyof T) =>
  schemas.map((schema) => (typeof schema === 'object' ? schema[key] : undefined));

export const notUndefined = <T>(val: T | undefined): val is T => val !== undefined;
export const isSchema = (val: unknown): val is JSONSchemaCreate => typeof val === 'object';

export const isSchemaDefinition = (val: unknown): val is JSONSchemaCreateDefinition =>
  isPlainObject(val) || val === true || val === false;

export const isEmptySchema = (obj: unknown) =>
  keys(obj).length === 0 &&
  !(Array.isArray(obj) ? indexes(obj).length : false) &&
  obj !== false &&
  obj !== true;

export const isFalse = (val: unknown): val is false => val === false;
export const isTrue = (val: unknown): val is true => val === true;

export const stringArray = (values: string[][]) => unique(values.flat()).sort();

export const deleteUndefinedProperties = (returnObject: JSONSchemaCreate) => {
  // cleanup empty
  for (const property of Object.keys(returnObject) as Array<keyof JSONSchemaCreate>) {
    if (returnObject.hasOwnProperty(property) && isEmptySchema(returnObject[property])) {
      delete returnObject[property];
    }
  }

  return returnObject;
};
